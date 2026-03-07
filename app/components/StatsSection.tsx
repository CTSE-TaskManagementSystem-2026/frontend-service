'use client';

import Link from 'next/link';

const STATS = [
  { value: '10k+', label: 'Active Projects' },
  { value: '250k+', label: 'Tasks Managed' },
  { value: '98.7%', label: 'Customer Satisfaction' },
  { value: '< 100ms', label: 'Avg API Response' },
];

export default function StatsSection() {
  return (
    <>
      {/* Stats strip */}
      <section
        id="analytics"
        style={{
          padding: '5rem 2rem',
          borderTop: '1px solid rgba(255,255,255,0.05)',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
          background: 'var(--bg-secondary)',
        }}
      >
        <div
          style={{
            maxWidth: '1280px',
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '2rem',
            textAlign: 'center',
          }}
        >
          {STATS.map((stat, i) => (
            <div
              key={stat.label}
              style={{
                padding: '1.5rem',
                borderLeft: i > 0 ? '1px solid rgba(255,255,255,0.05)' : 'none',
              }}
            >
              <div
                style={{
                  fontFamily: 'var(--font-display)',
                  fontWeight: 800,
                  fontSize: '2.5rem',
                  letterSpacing: '-0.03em',
                  background: 'linear-gradient(135deg, var(--text-primary) 40%, var(--accent-cyan))',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  lineHeight: 1,
                  marginBottom: '0.5rem',
                }}
              >
                {stat.value}
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.72rem',
                  color: 'var(--text-muted)',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA section */}
      <section
        style={{
          padding: '7rem 2rem',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(ellipse at 50% 50%, rgba(34,211,238,0.07) 0%, transparent 65%)',
            pointerEvents: 'none',
          }}
        />
        <div
          style={{
            maxWidth: '720px',
            margin: '0 auto',
            textAlign: 'center',
            position: 'relative',
            zIndex: 1,
          }}
        >
          <span className="tag" style={{ marginBottom: '1.5rem', display: 'inline-block' }}>
            Get Started
          </span>
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 800,
              fontSize: 'clamp(2rem, 4vw, 3.2rem)',
              letterSpacing: '-0.02em',
              color: 'var(--text-primary)',
              lineHeight: 1.1,
              marginBottom: '1.25rem',
            }}
          >
            Ready to ship
            <br />
            faster?
          </h2>
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '1rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.7,
              marginBottom: '2.5rem',
              maxWidth: '480px',
              margin: '0 auto 2.5rem',
            }}
          >
            Deploy the full microservice stack in minutes. Your team will be managing
            projects and tracking tasks within the hour.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link
              href="/signup"
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                fontSize: '0.95rem',
                letterSpacing: '0.06em',
                color: '#07080F',
                background: 'var(--accent-cyan)',
                textDecoration: 'none',
                padding: '14px 36px',
                borderRadius: '3px',
                transition: 'transform 0.2s, box-shadow 0.2s',
                display: 'inline-block',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 12px 36px rgba(34,211,238,0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              Start Free Trial
            </Link>
            <Link
              href="/docs"
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 600,
                fontSize: '0.95rem',
                letterSpacing: '0.05em',
                color: 'var(--text-secondary)',
                background: 'transparent',
                textDecoration: 'none',
                padding: '14px 36px',
                borderRadius: '3px',
                border: '1px solid rgba(255,255,255,0.12)',
                transition: 'color 0.2s, border-color 0.2s',
                display: 'inline-block',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'var(--text-primary)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'var(--text-secondary)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)';
              }}
            >
              View Docs
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
