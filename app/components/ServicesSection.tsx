'use client';

const SERVICES = [
  {
    id: 'auth', tag: 'SVC-01', name: 'Auth Service', port: ':4001',
    description: 'Stateless JWT authentication with refresh-token rotation, OAuth2/OIDC provider integration, RBAC, and MFA support. Every service validates tokens independently.',
    features: ['JWT / Refresh Tokens', 'OAuth2 & OIDC', 'Role-Based Access', 'MFA Ready'],
    color: '#F59E0B',
    icon: (<svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>),
  },
  {
    id: 'projects', tag: 'SVC-02', name: 'Projects Service', port: ':4002',
    description: 'Manage workspaces, projects, and team membership. Supports nested structures, custom fields, and project-level permission overrides on top of global RBAC.',
    features: ['Nested Workspaces', 'Team Management', 'Custom Fields', 'Permission Layers'],
    color: '#22D3EE',
    icon: (<svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>),
  },
  {
    id: 'tasks', tag: 'SVC-03', name: 'Tasks Service', port: ':4003',
    description: 'Full task lifecycle management — create, assign, prioritize, and track work items with sub-tasks, dependencies, labels, and real-time status updates via SSE.',
    features: ['Sub-tasks & Dependencies', 'Priority Queues', 'Labels & Filters', 'SSE Updates'],
    color: '#818CF8',
    icon: (<svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>),
  },
  {
    id: 'analytics', tag: 'SVC-04', name: 'Analytics Service', port: ':4004',
    description: 'Aggregates events from all services to power velocity reports, burn-down charts, team throughput, and custom KPI dashboards with flexible time-range queries.',
    features: ['Velocity Reports', 'Burn-down Charts', 'Team Throughput', 'Custom KPIs'],
    color: '#34D399',
    icon: (<svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>),
  },
];

export default function ServicesSection() {
  return (
    <>
      <style>{`
        /* ── Design tokens ── */
        :root {
          --color-bg-primary:    #07080f;
          --color-text-primary:  #f0f2ff;
          --color-text-secondary:#a0a8c8;
          --color-text-muted:    #5a6280;
          --color-accent-cyan:   #22d3ee;
          --color-accent-violet: #818cf8;
          --color-accent-amber:  #f59e0b;
        }

        /* ── Section tag / badge ── */
        .svc-tag {
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

        /* ── Glass card ── */
        .svc-glass-card {
          position: relative;
          overflow: hidden;
          border-radius: 6px;
          padding: 2rem;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.07);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          transition: border-color 0.3s ease, background 0.3s ease;
        }
        .svc-glass-card:hover {
          background: rgba(255, 255, 255, 0.05);
          border-color: rgba(255, 255, 255, 0.12);
        }

        /* ── Service tag badge (SVC-0X) ── */
        .svc-id-badge {
          font-family: monospace;
          font-size: 0.68rem;
          color: var(--color-text-muted);
          letter-spacing: 0.1em;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.07);
          padding: 0.25rem 0.5rem;
          border-radius: 2px;
        }

        /* ── Feature chip ── */
        .svc-chip {
          font-family: monospace;
          font-size: 0.68rem;
          letter-spacing: 0.06em;
          color: var(--color-text-secondary);
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.08);
          padding: 0.2rem 0.5rem;
          border-radius: 2px;
        }

        /* ── Architecture note ── */
        .svc-arch-note {
          margin-top: 3rem;
          padding: 1.5rem 2rem;
          background: rgba(34, 211, 238, 0.04);
          border: 1px solid rgba(34, 211, 238, 0.12);
          border-radius: 4px;
          display: flex;
          align-items: center;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .svc-arch-note p {
          font-family: monospace;
          font-size: 0.78rem;
          color: var(--color-text-secondary);
          letter-spacing: 0.04em;
          line-height: 1.6;
          margin: 0;
        }

        .svc-arch-note .highlight-cyan   { color: var(--color-accent-cyan); }
        .svc-arch-note .highlight-violet { color: var(--color-accent-violet); }
        .svc-arch-note .highlight-amber  { color: var(--color-accent-amber); }
      `}</style>

      <section
        id="services"
        style={{
          padding: '7rem 2rem',
          position: 'relative',
          overflow: 'hidden',
          background: 'var(--color-bg-primary)',
        }}
      >
        {/* Section glow */}
        <div
          style={{
            position: 'absolute',
            top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '800px', height: '400px',
            pointerEvents: 'none',
            background: 'radial-gradient(ellipse, rgba(129,140,248,0.06) 0%, transparent 70%)',
          }}
        />

        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          {/* Header */}
          <div style={{ marginBottom: '4rem', maxWidth: '680px' }}>
            <span className="svc-tag">Architecture</span>
            <h2 style={{
              fontWeight: 800,
              letterSpacing: '-0.02em',
              color: 'var(--color-text-primary)',
              lineHeight: 1.1,
              marginBottom: '1rem',
              fontSize: 'clamp(2rem, 4vw, 3rem)',
            }}>
              Four services.<br />
              <span style={{ color: 'var(--color-text-secondary)', fontWeight: 600 }}>One cohesive platform.</span>
            </h2>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '1rem', lineHeight: 1.7, maxWidth: '520px', margin: 0 }}>
              Each backend service is independently deployable, scalable, and communicates
              via well-defined REST APIs — routed through an Application Load Balancer.
            </p>
          </div>

          {/* Service cards grid */}
          <div style={{ display: 'grid', gap: '1.25rem', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
            {SERVICES.map((svc) => (
              <div key={svc.id} className="svc-glass-card">
                {/* Top color bar */}
                <div style={{
                  position: 'absolute', top: 0, left: 0, right: 0,
                  height: '2px', opacity: 0.8,
                  background: svc.color,
                }} />

                {/* Header row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
                  <div style={{
                    padding: '0.625rem',
                    borderRadius: '4px',
                    lineHeight: 1,
                    color: svc.color,
                    background: `${svc.color}18`,
                    border: `1px solid ${svc.color}30`,
                  }}>
                    {svc.icon}
                  </div>
                  <span className="svc-id-badge">{svc.tag}</span>
                </div>

                {/* Name & port */}
                <div style={{ marginBottom: '0.75rem' }}>
                  <h3 style={{
                    fontWeight: 700, fontSize: '1.15rem',
                    color: 'var(--color-text-primary)',
                    letterSpacing: '0.01em', margin: '0 0 0.125rem',
                  }}>
                    {svc.name}
                  </h3>
                  <span style={{ fontFamily: 'monospace', fontSize: '0.72rem', letterSpacing: '0.05em', opacity: 0.8, color: svc.color }}>
                    http://internal{svc.port}
                  </span>
                </div>

                {/* Description */}
                <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: 1.65, marginBottom: '1.5rem' }}>
                  {svc.description}
                </p>

                {/* Feature chips */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
                  {svc.features.map((f) => (
                    <span key={f} className="svc-chip">{f}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Architecture note */}
          <div className="svc-arch-note">
            <svg width="18" height="18" fill="none" stroke="#22D3EE" strokeWidth="1.8" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            <p>
              <span className="highlight-cyan">ALB</span> routes{' '}
              <code className="highlight-violet">/</code> to frontend-service &nbsp;|&nbsp;
              Frontend calls backend services via{' '}
              <code className="highlight-amber">HTTP REST</code> &nbsp;|&nbsp;
              All inter-service traffic is internal network only
            </p>
          </div>
        </div>
      </section>
    </>
  );
}