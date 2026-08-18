'use server';

import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { isAdminEmail } from '@/lib/constants';
import { revalidatePath } from 'next/cache';

async function verifyAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Unauthorized. Please sign in.');
  }

  const isEmailAdmin = isAdminEmail(user.email);
  if (!isEmailAdmin) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .maybeSingle();

    if (profile?.role !== 'admin') {
      throw new Error('Forbidden. Admin privileges required.');
    }
  }

  let db = supabase;
  if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
    try {
      db = createAdminClient();
    } catch (err) {
      db = supabase;
    }
  }

  return { user, db, supabase };
}

export interface AdminCustomer {
  id: string;
  email: string;
  full_name: string;
  phone_number: string;
  role: string;
  orders_count: number;
  total_spent: number;
  created_at: string;
  address?: Record<string, any> | null;
  source?: 'registered' | 'order_guest';
}

export async function fetchAdminCustomersAction(): Promise<{ success: boolean; customers?: AdminCustomer[]; error?: string }> {
  try {
    const { db } = await verifyAdmin();

    // 1. Fetch profiles
    const { data: profiles, error: profilesError } = await db
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (profilesError) {
      console.error('[fetchAdminCustomersAction] Error fetching profiles:', profilesError);
    }

    // 2. Fetch all orders to aggregate customer spend & discover historical orderers
    const { data: orders } = await db
      .from('orders')
      .select('id, user_id, customer_email, customer_name, customer_phone, total_amount, payment_status, created_at, shipping_address');

    const orderStatsByUser: Record<string, { count: number; spent: number; email?: string; phone?: string; name?: string }> = {};
    const orderStatsByEmail: Record<string, { count: number; spent: number; name?: string; phone?: string; latestDate?: string }> = {};

    if (orders) {
      for (const order of orders) {
        const orderEmail = order.customer_email?.trim().toLowerCase();
        const orderAmount = order.payment_status === 'paid' ? (Number(order.total_amount) || 0) : 0;

        if (order.user_id) {
          if (!orderStatsByUser[order.user_id]) {
            orderStatsByUser[order.user_id] = { count: 0, spent: 0, email: order.customer_email, phone: order.customer_phone, name: order.customer_name };
          }
          orderStatsByUser[order.user_id].count += 1;
          orderStatsByUser[order.user_id].spent += orderAmount;
        }

        if (orderEmail) {
          if (!orderStatsByEmail[orderEmail]) {
            orderStatsByEmail[orderEmail] = { count: 0, spent: 0, name: order.customer_name, phone: order.customer_phone, latestDate: order.created_at };
          }
          orderStatsByEmail[orderEmail].count += 1;
          orderStatsByEmail[orderEmail].spent += orderAmount;
        }
      }
    }

    // 3. Fetch auth users list if service role is available
    const authUsersMap: Record<string, { email?: string; created_at?: string; raw_user_meta_data?: any }> = {};
    try {
      if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
        const adminClient = createAdminClient();
        const { data: authUsersData } = await adminClient.auth.admin.listUsers({ perPage: 1000 });
        if (authUsersData?.users) {
          for (const u of authUsersData.users) {
            authUsersMap[u.id] = {
              email: u.email,
              created_at: u.created_at,
              raw_user_meta_data: u.user_metadata,
            };
          }
        }
      }
    } catch (err) {
      console.warn('[fetchAdminCustomersAction] Auth admin listUsers skipped:', err);
    }

    // 4. Combine all customer data into unified list
    const customerMap = new Map<string, AdminCustomer>();
    const trackedEmails = new Set<string>();

    // A. Profiles
    for (const p of profiles || []) {
      const authInfo = authUsersMap[p.id];
      const stats = orderStatsByUser[p.id] || (p.email ? orderStatsByEmail[p.email.toLowerCase()] : undefined);
      const email = p.email || authInfo?.email || stats?.email || 'Registered User';
      const name = p.full_name || authInfo?.raw_user_meta_data?.full_name || stats?.name || 'Customer';
      const phone = p.phone_number || authInfo?.raw_user_meta_data?.phone_number || stats?.phone || '';

      if (email && email !== 'Registered User') {
        trackedEmails.add(email.toLowerCase());
      }

      customerMap.set(p.id, {
        id: p.id,
        email,
        full_name: name,
        phone_number: phone,
        role: p.role || 'customer',
        orders_count: stats?.count || 0,
        total_spent: stats?.spent || 0,
        created_at: p.created_at || authInfo?.created_at || new Date().toISOString(),
        address: p.address,
        source: 'registered',
      });
    }

    // B. Auth users without profiles
    for (const [userId, authUser] of Object.entries(authUsersMap)) {
      if (!customerMap.has(userId)) {
        const email = authUser.email || '';
        const stats = orderStatsByUser[userId] || (email ? orderStatsByEmail[email.toLowerCase()] : undefined);
        const isAdm = isAdminEmail(email);

        if (email) {
          trackedEmails.add(email.toLowerCase());
        }

        customerMap.set(userId, {
          id: userId,
          email: email || 'Registered User',
          full_name: authUser.raw_user_meta_data?.full_name || (isAdm ? 'Admin' : 'Customer'),
          phone_number: authUser.raw_user_meta_data?.phone_number || stats?.phone || '',
          role: isAdm ? 'admin' : 'customer',
          orders_count: stats?.count || 0,
          total_spent: stats?.spent || 0,
          created_at: authUser.created_at || new Date().toISOString(),
          address: null,
          source: 'registered',
        });
      }
    }

    // C. Guest order customers (customers who made orders with their email)
    for (const [email, orderData] of Object.entries(orderStatsByEmail)) {
      if (!trackedEmails.has(email)) {
        const syntheticId = `order-customer-${email.replace(/[^a-zA-Z0-9]/g, '_')}`;
        customerMap.set(syntheticId, {
          id: syntheticId,
          email,
          full_name: orderData.name || 'Store Customer',
          phone_number: orderData.phone || '',
          role: 'customer',
          orders_count: orderData.count,
          total_spent: orderData.spent,
          created_at: orderData.latestDate || new Date().toISOString(),
          address: null,
          source: 'order_guest',
        });
        trackedEmails.add(email);
      }
    }

    const customerList = Array.from(customerMap.values()).sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    return { success: true, customers: customerList };
  } catch (error: any) {
    console.error('[fetchAdminCustomersAction error]:', error);
    return { success: false, error: error.message || 'Failed to fetch customers' };
  }
}

export async function syncExistingCustomersAction(): Promise<{ success: boolean; syncedCount: number; message: string }> {
  try {
    const { db } = await verifyAdmin();
    let syncedCount = 0;

    // 1. If service role key is available, sync from auth.users into profiles
    try {
      if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
        const adminClient = createAdminClient();
        const { data: authData } = await adminClient.auth.admin.listUsers({ perPage: 1000 });
        if (authData?.users) {
          for (const u of authData.users) {
            const isAdm = isAdminEmail(u.email);
            const { error: upsertErr } = await db.from('profiles').upsert({
              id: u.id,
              email: u.email,
              full_name: u.user_metadata?.full_name || (isAdm ? 'Admin' : 'Customer'),
              phone_number: u.user_metadata?.phone_number || '',
              role: isAdm ? 'admin' : 'customer',
            });
            if (!upsertErr) syncedCount++;
          }
        }
      }
    } catch (e) {
      console.warn('[syncExistingCustomersAction] Auth admin sync warning:', e);
    }

    // 2. Also backfill phone numbers and names from orders table
    try {
      const { data: orders } = await db
        .from('orders')
        .select('user_id, customer_name, customer_phone, customer_email')
        .not('user_id', 'is', null);

      if (orders) {
        for (const order of orders) {
          if (order.user_id && (order.customer_name || order.customer_phone)) {
            await db
              .from('profiles')
              .update({
                full_name: order.customer_name,
                phone_number: order.customer_phone,
              })
              .eq('id', order.user_id)
              .or('full_name.is.null,full_name.eq.Anonymous User,full_name.eq.Customer');
          }
        }
      }
    } catch (e) {
      console.warn('[syncExistingCustomersAction] Orders profile backfill warning:', e);
    }

    revalidatePath('/admin/customers');
    return {
      success: true,
      syncedCount,
      message: syncedCount > 0
        ? `Successfully synchronized ${syncedCount} customer accounts!`
        : 'All existing customers are fully synchronized.',
    };
  } catch (error: any) {
    console.error('[syncExistingCustomersAction error]:', error);
    return { success: false, syncedCount: 0, message: error.message || 'Failed to sync customers' };
  }
}

export async function updateCustomerRoleAction(userId: string, newRole: 'manager' | 'customer') {
  try {
    const { db } = await verifyAdmin();

    // Prevent assigning admin role to any customer
    if (newRole !== 'manager' && newRole !== 'customer') {
      return { success: false, error: 'Only Manager and Customer roles are configurable.' };
    }

    const { error } = await db
      .from('profiles')
      .update({ role: newRole })
      .eq('id', userId);

    if (error) throw new Error(error.message);

    revalidatePath('/admin/customers');
    return { success: true, message: `User role updated to ${newRole.toUpperCase()}` };
  } catch (error: any) {
    console.error('[updateCustomerRoleAction error]:', error);
    return { success: false, error: error.message || 'Failed to update user role' };
  }
}

// Alias for backwards compatibility
export const toggleCustomerRoleAction = updateCustomerRoleAction;
