import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import AccountDashboard from './AccountDashboard';

export const metadata = {
  title: 'My Account | WEAR YUNG',
};

export default async function AccountPage() {
  const supabase = await createClient();

  // 1. Authenticate user
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    redirect('/login');
  }

  // 2. Fetch User Profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  // 3. Fetch Order History
  const { data: orders } = await supabase
    .from('orders')
    .select(`
      *,
      order_items (
        *,
        product_variants (
          *,
          products (*)
        )
      )
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  // 4. Fetch Wishlist Items
  const { data: wishlistItems } = await supabase
    .from('user_wishlists')
    .select(`
      *,
      products (
        *,
        variants:product_variants(*)
      )
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  return (
    <div style={{ padding: '6rem 1rem 4rem', minHeight: '100vh', background: 'var(--wy-canvas)' }}>
      <div className="container-wy">
        <h1 
          style={{ 
            fontFamily: 'var(--font-display)', 
            fontSize: 'clamp(2.5rem, 5vw, 4rem)',
            letterSpacing: '0.04em',
            color: 'var(--wy-text)',
            marginBottom: '2rem'
          }}
        >
          ACCOUNT
        </h1>
        
        <AccountDashboard 
          user={{ ...user, profile }} 
          orders={orders || []} 
          wishlist={wishlistItems || []} 
        />
      </div>
    </div>
  );
}
