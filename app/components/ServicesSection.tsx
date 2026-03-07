'use client';

const SERVICES = [
  {
    id: 'auth',
    tag: 'SVC-01',
    name: 'Auth Service',
    port: ':4001',
    description:
      'Stateless JWT authentication with refresh-token rotation, OAuth2/OIDC provider integration, RBAC, and MFA support. Every service validates tokens independently.',
    features: ['JWT / Refresh Tokens', 'OAuth2 & OIDC', 'Role-Based Access', 'MFA Ready'],
    color: '#F59E0B',
    icon: (
      <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
        <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
      </svg>
    ),
  },
  {
    id: 'projects',
    tag: 'SVC-02',
    name: 'Projects Service',
    port: ':4002',
    description:
      'Manage workspaces, projects, and team membership. Supports nested structures, custom fields, and project-level permission overrides on top of global RBAC.',
    features: ['Nested Workspaces', 'Team Management', 'Custom Fields', 'Permission Layers'],
    color: '#22D3EE',
    icon: (
      <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
      </svg>
    ),
  },
  {
    id: 'tasks',
    tag: 'SVC-03',
    name: 'Tasks Service',
    port: ':4003',
    description:
      'Full task lifecycle management — create, assign, prioritize, and track work items with sub-tasks, dependencies, labels, and real-time status updates via SSE.',
    features: ['Sub-tasks & Dependencies', 'Priority Queues', 'Labels & Filters', 'SSE Updates'],
    color: '#818CF8',
    icon: (
      <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <polyline points="9 11 12 14 22 4"/>
        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
      </svg>
    ),
  },
  {
    id: 'analytics',
    tag: 'SVC-04',
    name: 'Analytics Service',
    port: ':4004',
    description:
      'Aggregates events from all services to power velocity reports, burn-down charts, team throughput, and custom KPI dashboards with flexible time-range queries.',
    features: ['Velocity Reports', 'Burn-down Charts', 'Team Throughput', 'Custom KPIs'],
    color: '#34D399',
    icon: (
      <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
      </svg>
    ),
  },
];

export default function ServicesSection() {
  return (
    <section
      id="services"
      style={{
        padding: '7rem 2rem',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Section glow */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '800px',
          height: '400px',
          background: 'radial-gradient(ellipse, rgba(129,140,248,0.06) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '4rem', maxWidth: '680px' }}>
          <span className="tag" style={{ marginBottom: '1.25rem', display: 'inline-block' }}>
            Architecture
          </span>
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 800,
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              letterSpacing: '-0.02em',
              color: 'var(--text-primary)',
              lineHeight: 1.1,
              marginBottom: '1rem',
            }}
          >
            Four services.
            <br />
            <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>
              One cohesive platform.
            </span>
          </h2>
          <p
            style={{
              fontFamily: 'var(--font-body)',
              color: 'var(--text-secondary)',
              fontSize: '1rem',
              lineHeight: 1.7,
              maxWidth: '520px',
            }}
          >
            Each backend service is independently deployable, scalable, and communicates
            via well-defined REST APIs — routed through an Application Load Balancer.
          </p>
        </div>

        {/* Service cards grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.25rem',
          }}
        >
          {SERVICES.map((svc, idx) => (
            <div
              key={svc.id}
              className="glass-card"
              style={{
                borderRadius: '6px',
                padding: '2rem',
                position: 'relative',
                overflow: 'hidden',
                animationDelay: `${idx * 0.1}s`,
              }}
            >
              {/* Top color bar */}
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '2px',
                  background: svc.color,
                  opacity: 0.8,
                }}
              />

              {/* Header row */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
                <div
                  style={{
                    color: svc.color,
                    background: `${svc.color}18`,
                    padding: '10px',
                    borderRadius: '4px',
                    border: `1px solid ${svc.color}30`,
                    lineHeight: 0,
                  }}
                >
                  {svc.icon}
                </div>
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.68rem',
                    color: 'var(--text-muted)',
                    letterSpacing: '0.1em',
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.07)',
                    padding: '4px 8px',
                    borderRadius: '2px',
                  }}
                >
                  {svc.tag}
                </span>
              </div>

              {/* Name & port */}
              <div style={{ marginBottom: '0.75rem' }}>
                <h3
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontWeight: 700,
                    fontSize: '1.15rem',
                    color: 'var(--text-primary)',
                    letterSpacing: '0.01em',
                    marginBottom: '2px',
                  }}
                >
                  {svc.name}
                </h3>
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.72rem',
                    color: svc.color,
                    letterSpacing: '0.05em',
                    opacity: 0.8,
                  }}
                >
                  http://internal{svc.port}
                </span>
              </div>

              {/* Description */}
              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.875rem',
                  color: 'var(--text-secondary)',
                  lineHeight: 1.65,
                  marginBottom: '1.5rem',
                }}
              >
                {svc.description}
              </p>

              {/* Feature chips */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {svc.features.map((f) => (
                  <span
                    key={f}
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.68rem',
                      letterSpacing: '0.06em',
                      color: 'var(--text-secondary)',
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      padding: '3px 8px',
                      borderRadius: '2px',
                    }}
                  >
                    {f}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Architecture diagram hint */}
        <div
          style={{
            marginTop: '3rem',
            padding: '1.5rem 2rem',
            background: 'rgba(34,211,238,0.04)',
            border: '1px solid rgba(34,211,238,0.12)',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            flexWrap: 'wrap',
          }}
        >
          <svg width="18" height="18" fill="none" stroke="#22D3EE" strokeWidth="1.8" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          <p
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.78rem',
              color: 'var(--text-secondary)',
              letterSpacing: '0.04em',
              lineHeight: 1.6,
            }}
          >
            <span style={{ color: 'var(--accent-cyan)' }}>ALB</span> routes{' '}
            <code style={{ color: '#818CF8' }}>/</code> to frontend-service &nbsp;|&nbsp;
            Frontend calls backend services via{' '}
            <code style={{ color: '#F59E0B' }}>HTTP REST</code> &nbsp;|&nbsp;
            All inter-service traffic is internal network only
          </p>
        </div>
      </div>
    </section>
  );
}
