import type { Metadata } from 'next';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import WhatsAppOrderReceipt from '@/components/checkout/WhatsAppOrderReceipt';

export const metadata: Metadata = {
  title: 'Order Confirmed — WEAR YUNG',
  description: 'Your WEAR YUNG order has been placed successfully.',
};

interface SuccessPageProps {
  searchParams: Promise<{ order?: string; reference?: string }>;
}

export default async function CheckoutSuccessPage({ searchParams }: SuccessPageProps) {
  const { order, reference } = await searchParams;
  const targetId = order || reference || '';

  let orderData: any = null;
  let orderItems: any[] = [];

  if (targetId) {
    try {
      const supabase = await createClient();
      let query = supabase
        .from('orders')
        .select('*, order_items(*, product_variants:variant_id(sku, price, product:products(title)))');

      if (order) {
        query = query.eq('id', order);
      } else {
        query = query.eq('payment_reference', reference);
      }

      const { data } = await query.maybeSingle();
      if (data) {
        orderData = data;
        orderItems = (data.order_items || []).map((it: any) => ({
          title: it.product_variants?.product?.title || 'Wear Yung Piece',
          quantity: it.quantity,
          price: Number(it.unit_price) || 0,
        }));
      }
    } catch (e) {
      console.error('[CheckoutSuccess] Error loading order details:', e);
    }
  }

  const shipping = orderData?.shipping_address || {};
  const customerName = shipping.full_name || 'Valued Customer';
  const customerPhone = shipping.phone || '';
  const deliveryCity = shipping.city || 'Koforidua';
  const totalAmount = orderData ? Number(orderData.total_amount) : 0;
  const paymentStatus = orderData?.payment_status || 'Paid / Processing';

  return (
    <div style={{ background: 'var(--wy-canvas)', minHeight: '85vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3.5rem 1.5rem' }}>
      <div style={{ textAlign: 'center', maxWidth: '580px', width: '100%' }}>
        {/* Success Icon */}
        <div style={{
          width: '76px',
          height: '76px',
          borderRadius: '50%',
          background: 'rgba(34, 197, 94, 0.15)',
          border: '2px solid var(--wy-success)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1.5rem',
          boxShadow: '0 0 25px rgba(34, 197, 94, 0.25)',
        }}>
          <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="var(--wy-success)" strokeWidth="2.8">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>

        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.4rem, 5.5vw, 3.75rem)', color: 'var(--wy-text)', marginBottom: '0.65rem', letterSpacing: '0.04em' }}>
          ORDER CONFIRMED!
        </h1>

        <p style={{ color: 'var(--wy-muted)', fontSize: '0.96rem', lineHeight: 1.6, marginBottom: '0.5rem' }}>
          Thank you for shopping with <strong style={{ color: 'var(--wy-yellow)' }}>WEAR YUNG</strong>. Your order is secured and being prepared for dispatch.
        </p>

        {/* Interactive WhatsApp Order Receipt */}
        <WhatsAppOrderReceipt
          orderId={orderData?.id || targetId || `WY-${Date.now().toString(36).toUpperCase()}`}
          customerName={customerName}
          customerPhone={customerPhone}
          deliveryCity={deliveryCity}
          totalAmount={totalAmount}
          items={orderItems}
          paymentStatus={paymentStatus}
        />

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link
            href="/account"
            id="view-account-btn"
            style={{
              padding: '0.75rem 1.5rem',
              borderRadius: '100px',
              border: '1px solid var(--wy-border)',
              background: 'var(--wy-surface)',
              color: 'var(--wy-text)',
              fontSize: '0.85rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              textDecoration: 'none',
              transition: 'all 0.2s ease',
            }}
          >
            View Account & Orders
          </Link>
          <Link
            href="/shop"
            id="continue-shopping-btn"
            style={{
              padding: '0.75rem 1.75rem',
              borderRadius: '100px',
              background: 'var(--wy-yellow)',
              color: '#000000',
              fontSize: '0.85rem',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              textDecoration: 'none',
              boxShadow: '0 4px 20px rgba(255, 200, 0, 0.35)',
              transition: 'all 0.2s ease',
            }}
          >
            Continue Shopping →
          </Link>
        </div>
      </div>
    </div>
  );
}
