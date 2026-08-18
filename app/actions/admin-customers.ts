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

    // 2. Fetch order metrics grouped by user_id & customer_email
    const { data: orders } = await db
      .from('orders')
      .select('id, user_id, customer_email, total_amount, payment_status, created_at');

    const orderStatsByUser: Record<string, { count: number; spent: number; email?: string; phone?: string; name?: string }> = {};

    if (orders) {
      for (const order of orders) {
        if (order.user_id) {
          if (!orderStatsByUser[order.user_id]) {
            orderStatsByUser[order.user_id] = { count: 0, spent: 0, email: order.customer_email };
          }
          orderStatsByUser[order.user_id].count += 1;
          if (order.payment_status === 'paid') {
            orderStatsByUser[order.user_id].spent += Number(order.total_amount) || 0;
          }
        }
      }
    }

    // 3. Attempt to fetch auth users list if service role is available
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

    // 4. Combine all customer data
    const profileMap = new Map<string, AdminCustomer>();

    for (const p of profiles || []) {
      const authInfo = authUsersMap[p.id];
      const stats = orderStatsByUser[p.id];
      const email = p.email || authInfo?.email || stats?.email || 'Registered User';
      const name = p.full_name || authInfo?.raw_user_meta_data?.full_name || 'Customer';
      const phone = p.phone_number || authInfo?.raw_user_meta_data?.phone_number || '';

      profileMap.set(p.id, {
        id: p.id,
        email,
        full_name: name,
        phone_number: phone,
        role: p.role || 'customer',
        orders_count: stats?.count || 0,
        total_spent: stats?.spent || 0,
        created_at: p.created_at || authInfo?.created_at || new Date().toISOString(),
        address: p.address,
      });
    }

    // Add any auth users that didn't have a profile record yet
    for (const [userId, authUser] of Object.entries(authUsersMap)) {
      if (!profileMap.has(userId)) {
        const stats = orderStatsByUser[userId];
        const isAdm = isAdminEmail(authUser.email);
        profileMap.set(userId, {
          id: userId,
          email: authUser.email || 'Registered User',
          full_name: authUser.raw_user_meta_data?.full_name || (isAdm ? 'Admin' : 'Customer'),
          phone_number: authUser.raw_user_meta_data?.phone_number || '',
          role: isAdm ? 'admin' : 'customer',
          orders_count: stats?.count || 0,
          total_spent: stats?.spent || 0,
          created_at: authUser.created_at || new Date().toISOString(),
          address: null,
        });
      }
    }

    const customerList = Array.from(profileMap.values()).sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    return { success: true, customers: customerList };
  } catch (error: any) {
    console.error('[fetchAdminCustomersAction error]:', error);
    return { success: false, error: error.message || 'Failed to fetch customers' };
  }
}

export async function toggleCustomerRoleAction(userId: string, newRole: 'admin' | 'customer') {
  try {
    const { db } = await verifyAdmin();

    const { error } = await db
      .from('profiles')
      .update({ role: newRole })
      .eq('id', userId);

    if (error) throw new Error(error.message);

    revalidatePath('/admin/customers');
    return { success: true, message: `User role updated to ${newRole}` };
  } catch (error: any) {
    console.error('[toggleCustomerRoleAction error]:', error);
    return { success: false, error: error.message || 'Failed to update user role' };
  }
}
