'use client';

import { useState } from 'react';
import { MessageCircle, Check, Copy, Package, ShieldCheck, MapPin } from 'lucide-react';

interface OrderItem {
  title: string;
  quantity: number;
  price: number;
}

interface WhatsAppOrderReceiptProps {
  orderId: string;
  customerName?: string;
  customerPhone?: string;
  deliveryCity?: string;
  totalAmount?: number;
  items?: OrderItem[];
  paymentStatus?: string;
}

export default function WhatsAppOrderReceipt({
  orderId,
  customerName = 'Valued Customer',
  customerPhone = '',
  deliveryCity = 'Koforidua',
  totalAmount = 0,
  items = [],
  paymentStatus = 'Paid / Processing',
}: WhatsAppOrderReceiptProps) {
  const [copied, setCopied] = useState(false);

  const formattedItems = items.length > 0
    ? items.map(item => `• ${item.quantity}x ${item.title} (GH₵ ${(item.price * item.quantity).toFixed(2)})`).join('\n')
    : '• Curated Wear Yung Drop';

  const receiptMessage = `🔥 *WEAR YUNG — OFFICIAL ORDER RECEIPT* 🔥
━━━━━━━━━━━━━━━━━━━━
📦 *Order Reference:* #${orderId}
👤 *Customer:* ${customerName}
📱 *Phone:* ${customerPhone || 'N/A'}
📍 *Delivery Location:* ${deliveryCity}, Ghana
💳 *Payment Status:* ${paymentStatus.toUpperCase()}

🛍️ *Purchased Items:*
${formattedItems}

💰 *Total Paid:* GH₵ ${totalAmount > 0 ? totalAmount.toFixed(2) : 'Confirmed'}
━━━━━━━━━━━━━━━━━━━━
📍 *Store:* Wear Yung Collections, Behind B Foster Bakery, Koforidua.
💬 *Support WhatsApp:* +233 54 535 5585`;

  const encodedMessage = encodeURIComponent(receiptMessage);
  const whatsappUrl = `https://wa.me/233545355585?text=${encodedMessage}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(receiptMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div
      style={{
        background: 'var(--wy-surface)',
        border: '1px solid var(--wy-border)',
        borderRadius: '16px',
        padding: 'clamp(1.25rem, 3vw, 1.75rem)',
        textAlign: 'left',
        margin: '1.75rem 0 2rem',
        boxShadow: '0 12px 32px rgba(0, 0, 0, 0.4)',
      }}
    >
      {/* Receipt Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--wy-border)', paddingBottom: '1rem', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(255, 200, 0, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--wy-yellow)' }}>
            <Package size={18} />
          </div>
          <div>
            <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', color: 'var(--wy-text)', margin: 0, letterSpacing: '0.04em' }}>
              ORDER RECEIPT SUMMARY
            </h4>
            <span style={{ fontSize: '0.75rem', color: 'var(--wy-muted)' }}>
              Ref: <strong style={{ color: 'var(--wy-yellow)' }}>#{orderId.slice(0, 12)}</strong>
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', background: 'rgba(34, 197, 94, 0.12)', border: '1px solid rgba(34, 197, 94, 0.3)', color: '#22c55e', padding: '0.25rem 0.65rem', borderRadius: '100px', fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase' }}>
          <ShieldCheck size={13} />
          <span>Verified</span>
        </div>
      </div>

      {/* Breakdown */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.86rem', color: 'var(--wy-muted)' }}>
        {customerName && customerName !== 'Valued Customer' && (
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Recipient:</span>
            <strong style={{ color: 'var(--wy-text)' }}>{customerName}</strong>
          </div>
        )}
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>Delivery City:</span>
          <span style={{ color: 'var(--wy-text)', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
            <MapPin size={13} color="var(--wy-yellow)" /> {deliveryCity}
          </span>
        </div>
        {totalAmount > 0 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px dashed var(--wy-border)', paddingTop: '0.6rem', marginTop: '0.2rem' }}>
            <span style={{ fontWeight: 600 }}>Total Amount:</span>
            <strong style={{ color: 'var(--wy-yellow)', fontSize: '1.1rem', fontFamily: 'var(--font-display)' }}>
              GH₵ {totalAmount.toFixed(2)}
            </strong>
          </div>
        )}
      </div>

      {/* WhatsApp Dispatch CTAs */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', marginTop: '1.25rem' }}>
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.55rem',
            background: '#25D366',
            color: '#000000',
            fontWeight: 800,
            fontSize: '0.88rem',
            padding: '0.85rem 1.25rem',
            borderRadius: '100px',
            textDecoration: 'none',
            letterSpacing: '0.04em',
            boxShadow: '0 4px 20px rgba(37, 211, 102, 0.3)',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#1EBE5D';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#25D366';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          <MessageCircle size={18} />
          <span>Send Instant Receipt to WhatsApp (+233 54 535 5585)</span>
        </a>

        <button
          type="button"
          onClick={handleCopy}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.45rem',
            background: 'transparent',
            border: '1px solid var(--wy-border)',
            color: 'var(--wy-muted)',
            fontSize: '0.78rem',
            padding: '0.55rem 1rem',
            borderRadius: '8px',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
          }}
        >
          {copied ? <Check size={14} color="#22c55e" /> : <Copy size={14} />}
          <span>{copied ? 'Receipt Copied to Clipboard!' : 'Copy Order Text'}</span>
        </button>
      </div>
    </div>
  );
}
