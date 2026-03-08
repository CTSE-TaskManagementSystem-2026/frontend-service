'use client';

const FEATURES = [
  {
    icon: (
      <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
      </svg>
    ),
    title: 'Real-time Updates',
    description:
      'Server-sent events push live task and project changes to the frontend without polling — zero-delay collaboration across all connected users.',
  },
  {
    icon: (
      <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
      </svg>
    ),
    title: 'Responsive Dashboard',
    description:
      'A fully adaptive Next.js frontend that renders beautifully across desktop, tablet, and mobile — served from the frontend-service behind the ALB.',
  },
  {
    icon: (
      <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
    title: 'Zero-trust Auth',
    description:
      'Every API call is authenticated at the service boundary. The auth-service issues short-lived JWTs — no session state stored server-side.',
  },
  {
    icon: (
      <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
      </svg>
    ),
    title: 'Analytics at a Glance',
    description:
      'The analytics-service computes sprint velocity, cycle time, and throughput. Visualized as interactive charts directly in the dashboard.',
  },
  {
    icon: (
      <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <circle cx="18" cy="18" r="3" />
        <circle cx="6" cy="6" r="3" />
        <path d="M13 6h3a2 2 0 0 1 2 2v7" />
        <line x1="6" y1="9" x2="6" y2="21" />
      </svg>
    ),
    title: 'Modular & Scalable',
    description:
      'Each microservice scales horizontally and independently. Deploy more task-service replicas during peak sprints without touching auth or analytics.',
  },
  {
    icon: (
      <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path d="M14.5 10c-.83 0-1.5-.67-1.5-1.5v-5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5v5c0 .83-.67 1.5-1.5 1.5z" />
        <path d="M20.5 10H19V8.5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
        <path d="M9.5 14c.83 0 1.5.67 1.5 1.5v5c0 .83-.67 1.5-1.5 1.5S8 21.33 8 20.5v-5c0-.83.67-1.5 1.5-1.5z" />
        <path d="M3.5 14H5v1.5c0 .83-.67 1.5-1.5 1.5S2 16.33 2 15.5 2.67 14 3.5 14z" />
        <path d="M14 14.5c0-.83.67-1.5 1.5-1.5h5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5h-5c-.83 0-1.5-.67-1.5-1.5z" />
        <path d="M15.5 19H14v1.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5-.67-1.5-1.5-1.5z" />
        <path d="M10 9.5C10 8.67 9.33 8 8.5 8h-5C2.67 8 2 8.67 2 9.5S2.67 11 3.5 11h5c.83 0 1.5-.67 1.5-1.5z" />
        <path d="M8.5 5H10V3.5C10 2.67 9.33 2 8.5 2S7 2.67 7 3.5 7.67 5 8.5 5z" />
      </svg>
    ),
    title: 'API-First Design',
    description:
      'All services expose clean REST APIs documented with OpenAPI 3.0. The frontend consumes them directly — easy to swap or extend any service independently.',
  },
];

export default function FeaturesSection() {
  return (
    <>
      <style>{`
        /* ── Design tokens (shared with other sections) ── */
        :root {
          --color-bg-primary:    #07080f;
          --color-bg-mid:        #0d0e1a;
          --color-bg-card:       #0a0b17;
          --color-bg-card-hover: #121328;
          --color-text-primary:  #f0f2ff;
          --color-text-secondary:#a0a8c8;
          --color-text-muted:    #5a6280;
          --color-accent-cyan:   #22d3ee;
          --color-border:        rgba(255, 255, 255, 0.06);
        }

        /* ── Section tag / badge ── */
        .feat-tag {
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
          margin-bottom: 1.25rem;
        }

        /* ── Feature card ── */
        .feat-card {
          padding: 2rem;
          background: var(--color-bg-card);
          cursor: default;
          transition: background 0.3s ease;
        }
        .feat-card:hover {
          background: var(--color-bg-card-hover);
        }

        /* ── Icon wrapper ── */
        .feat-icon {
          color: var(--color-accent-cyan);
          margin-bottom: 1rem;
          line-height: 1;
        }

        /* ── Card title ── */
        .feat-title {
          font-weight: 700;
          font-size: 1rem;
          color: var(--color-text-primary);
          margin: 0 0 0.5rem;
          letter-spacing: 0.01em;
        }

        /* ── Card description ── */
        .feat-desc {
          font-size: 0.875rem;
          color: var(--color-text-secondary);
          line-height: 1.65;
          margin: 0;
        }

        /* ── Section heading muted part ── */
        .feat-heading-muted {
          color: var(--color-text-muted);
          font-weight: 500;
          font-size: 85%;
        }
      `}</style>

      <section
        id="features"
        style={{
          padding: '7rem 2rem',
          position: 'relative',
          background: 'linear-gradient(180deg, #07080F 0%, #0D0E1A 50%, #07080F 100%)',
        }}
      >
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '4.5rem' }}>
            <span className="feat-tag">Features</span>
            <h2
              style={{
                fontWeight: 800,
                letterSpacing: '-0.02em',
                color: 'var(--color-text-primary)',
                lineHeight: 1.15,
                marginBottom: '1rem',
                fontSize: 'clamp(1.8rem, 3.5vw, 2.75rem)',
              }}
            >
              Everything your team needs.
              <br />
              <span className="feat-heading-muted">Nothing it doesn&apos;t.</span>
            </h2>
          </div>

          {/* Features grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '1px',
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              borderRadius: '6px',
              overflow: 'hidden',
            }}
          >
            {FEATURES.map((feat) => (
              <div key={feat.title} className="feat-card">
                <div className="feat-icon">{feat.icon}</div>
                <h3 className="feat-title">{feat.title}</h3>
                <p className="feat-desc">{feat.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}