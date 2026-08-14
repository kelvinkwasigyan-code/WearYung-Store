export default function AnnouncementMarquee() {
  const announcements = [
    'FREE DELIVERY ON ORDERS ABOVE ₦50K',
    'AUTHENTIC STREETWEAR',
    'PREMIUM QUALITY GUARANTEED',
    'SHOP THE LATEST DROPS',
    'EXCLUSIVE COLLECTIONS',
  ];

  return (
    <div
      style={{
        background: 'var(--wy-yellow)',
        overflow: 'hidden',
        padding: '0.75rem 0',
        borderTop: '2px solid var(--wy-canvas)',
      }}
    >
      <div
        className="animate-marquee"
        style={{
          display: 'flex',
          gap: '3rem',
          width: 'max-content',
        }}
      >
        {[...Array(2)].map((_, i) => (
          <div key={i} style={{ display: 'flex', gap: '3rem', alignItems: 'center' }}>
            {announcements.map((text) => (
              <span
                key={text}
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1rem',
                  letterSpacing: '0.1em',
                  color: 'var(--wy-canvas)',
                  whiteSpace: 'nowrap',
                }}
              >
                {text} <span style={{ margin: '0 0.5rem', opacity: 0.5 }}>★</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
