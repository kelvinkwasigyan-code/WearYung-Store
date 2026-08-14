interface StatItem {
  value: string;
  label: string;
}

interface StatsBarProps {
  stats?: StatItem[];
}

export default function StatsBar({
  stats = [
    { value: '500+', label: 'Products' },
    { value: '7', label: 'Categories' },
    { value: '100%', label: 'Authentic' },
  ],
}: StatsBarProps) {
  return (
    <div style={{ display: 'flex', gap: '3rem', marginTop: '4rem', flexWrap: 'wrap' }}>
      {stats.map((stat) => (
        <div key={stat.label}>
          <p
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '2rem',
              color: 'var(--wy-yellow)',
              letterSpacing: '0.04em',
            }}
          >
            {stat.value}
          </p>
          <p
            style={{
              color: 'var(--wy-muted)',
              fontSize: '0.8rem',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}
          >
            {stat.label}
          </p>
        </div>
      ))}
    </div>
  );
}
