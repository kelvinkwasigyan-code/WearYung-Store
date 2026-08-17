interface StatItem {
  value: string;
  label: string;
}

interface StatsBarProps {
  stats?: StatItem[];
  style?: React.CSSProperties;
  className?: string;
}

export default function StatsBar({
  stats = [
    { value: '500+', label: 'Products' },
    { value: '7', label: 'Categories' },
    { value: '100%', label: 'Authentic' },
  ],
  style,
  className = '',
}: StatsBarProps) {
  return (
    <div className={`hero-stats-wrap ${className}`} style={{ display: 'flex', gap: 'clamp(1.25rem, 3.5vw, 2.75rem)', marginTop: '1.75rem', flexWrap: 'wrap', alignItems: 'center', ...style }}>
      {stats.map((stat) => (
        <div key={stat.label}>
          <p
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.35rem, 3.2vw, 2rem)',
              color: 'var(--wy-yellow)',
              letterSpacing: '0.04em',
              lineHeight: 1.1,
              margin: 0,
            }}
          >
            {stat.value}
          </p>
          <p
            style={{
              color: 'var(--wy-muted)',
              fontSize: 'clamp(0.68rem, 1.2vw, 0.78rem)',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              margin: 0,
              marginTop: '2px',
            }}
          >
            {stat.label}
          </p>
        </div>
      ))}
    </div>
  );
}
