interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  accent?: string;
}

export default function StatsCard({ title, value, subtitle, icon, accent = '#FFC800' }: StatsCardProps) {
  return (
    <div style={{
      background: '#0d0d0d',
      border: '1px solid #1a1a1a',
      borderRadius: '12px',
      padding: '1.5rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '0.75rem',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Accent glow */}
      <div style={{
        position: 'absolute', top: 0, right: 0,
        width: '80px', height: '80px',
        background: `radial-gradient(circle, ${accent}15 0%, transparent 70%)`,
        borderRadius: '0 12px 0 80px',
      }} />

      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <span style={{ fontSize: '0.78rem', color: '#555', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          {title}
        </span>
        <span style={{ color: accent }}>
          {icon}
        </span>
      </div>

      <div>
        <p style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(1.5rem, 3vw, 2.25rem)',
          color: '#ffffff',
          letterSpacing: '0.02em',
          lineHeight: 1,
        }}>
          {value}
        </p>
        {subtitle && (
          <p style={{ fontSize: '0.75rem', color: '#555', marginTop: '0.35rem' }}>
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}
