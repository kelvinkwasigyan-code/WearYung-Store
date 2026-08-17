'use client';

export default function AnnouncementMarquee() {
  const announcements = [
    'FREE DELIVERY ON ORDERS ABOVE GH₵ 500',
    'AUTHENTIC STREETWEAR',
    'PREMIUM QUALITY GUARANTEED',
    'SHOP THE LATEST DROPS',
    'EXCLUSIVE COLLECTIONS',
    'FAST NATIONWIDE SHIPPING',
  ];

  return (
    <div
      style={{
        background: '#FFC800',
        overflow: 'hidden',
        padding: '0.65rem 0',
        borderTop: '1px solid rgba(0,0,0,0.1)',
        borderBottom: '1px solid rgba(0,0,0,0.1)',
        position: 'relative',
        zIndex: 20,
      }}
    >
      <div
        className="animate-marquee"
        style={{
          display: 'flex',
          gap: '2.5rem',
          width: 'max-content',
        }}
      >
        {[...Array(4)].map((_, i) => (
          <div key={i} style={{ display: 'flex', gap: '2.5rem', alignItems: 'center', flexShrink: 0 }}>
            {announcements.map((text, idx) => (
              <span
                key={`${i}-${idx}`}
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '0.96rem',
                  fontWeight: 400,
                  letterSpacing: '0.14em',
                  color: '#000000',
                  whiteSpace: 'nowrap',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                }}
              >
                <span>{text}</span>
                <span style={{ fontSize: '0.75rem', opacity: 0.6 }}>★</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
