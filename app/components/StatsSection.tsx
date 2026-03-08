'use client';

import Link from 'next/link';

const STATS = [
  { value: '10k+',   label: 'Active Projects' },
  { value: '250k+',  label: 'Tasks Managed' },
  { value: '98.7%',  label: 'Customer Satisfaction' },
  { value: '< 100ms', label: 'Avg API Response' },
];

export default function StatsSection() {
  return (
    <>
      <style>{`
        /* ── Design tokens ── */
        :root {
          --color-bg-primary:    #07080f;
          --color-bg-secondary:  #0d0f1a;
          --color-text-primary:  #f0f2ff;
          --color-text-secondary:#a0a8c8;
          --color-text-muted:    #5a6280;
          --color-accent-cyan:   #22d3ee;
          --color-dark-base:     #07080f;
        }

        /* ── Stat value gradient text ── */
        .stats-value {
          font-weight: 800;
          font-size: 2.5rem;
          letter-spacing: -0.03em;
          line-height: 1;
          margin-bottom: 0.5rem;
          background: linear-gradient(135deg, #F1F5F9 40%, #22D3EE);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .stats-label {
          font-family: monospace;
          font-size: 0.72rem;
          color: var(--color-text-muted);
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        /* ── CTA section tag ── */
        .cta-tag {
          display: inline-block;
          font-family: monospace;
          font-size: 0.7rem;
          font-weight: 500;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--color-accent-cyan);
          background: rgba(34, 211, 238, 0.08);
          border: 1px solid rgba(34, 211, 238, 0.2);
          padding: 0.3rem 0.75rem;
          border-radius: 2px;
          margin-bottom: 1.5rem;
        }

        /* ── Primary CTA button ── */
        .cta-btn-primary {
          font-weight: 700;
          font-size: 0.95rem;
          letter-spacing: 0.06em;
          color: var(--color-dark-base);
          background: var(--color-accent-cyan);
          text-decoration: none;
          padding: 14px 2.25rem;
          border-radius: 2px;
          display: inline-block;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .cta-btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 36px rgba(34, 211, 238, 0.3);
        }

        /* ── Secondary CTA button ── */
        .cta-btn-secondary {
          font-weight: 600;
          font-size: 0.95rem;
          letter-spacing: 0.05em;
          color: var(--color-text-secondary);
          background: transparent;
          text-decoration: none;
          padding: 14px 2.25rem;
          border-radius: 2px;
          border: 1px solid rgba(255, 255, 255, 0.12);
          display: inline-block;
          transition: color 0.2s ease, border-color 0.2s ease;
        }
        .cta-btn-secondary:hover {
          color: var(--color-text-primary);
          border-color: rgba(255, 255, 255, 0.3);
        }
      `}</style>

      {/* ── Stats strip ── */}
      <section
        id="analytics"
        style={{
          padding: '5rem 2rem',
          borderTop: '1px solid rgba(255,255,255,0.05)',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
          background: 'var(--color-bg-secondary)',
        }}
      >
        <div
          style={{
            maxWidth: '1280px',
            margin: '0 auto',
            display: 'grid',
            gap: '2rem',
            textAlign: 'center',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
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
              <div className="stats-value">{stat.value}</div>
              <div className="stats-label">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA section ── */}
      <section
        style={{
          padding: '7rem 2rem',
          position: 'relative',
          overflow: 'hidden',
          background: 'var(--color-bg-primary)',
        }}
      >
        {/* Radial glow */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            background: 'radial-gradient(ellipse at 50% 50%, rgba(34,211,238,0.07) 0%, transparent 65%)',
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
          <span className="cta-tag">Get Started</span>

          <h2
            style={{
              fontWeight: 800,
              letterSpacing: '-0.02em',
              color: 'var(--color-text-primary)',
              lineHeight: 1.1,
              marginBottom: '1.25rem',
              fontSize: 'clamp(2rem, 4vw, 3.2rem)',
            }}
          >
            Ready to ship<br />faster?
          </h2>

          <p
            style={{
              fontSize: '1rem',
              color: 'var(--color-text-secondary)',
              lineHeight: 1.7,
              maxWidth: '480px',
              margin: '0 auto 2.5rem',
            }}
          >
            Deploy the full microservice stack in minutes. Your team will be managing
            projects and tracking tasks within the hour.
          </p>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/signup" className="cta-btn-primary">
              Start Free Trial
            </Link>
            <Link href="/docs" className="cta-btn-secondary">
              View Docs
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}