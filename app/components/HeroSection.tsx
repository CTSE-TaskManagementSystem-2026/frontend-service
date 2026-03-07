'use client';

import Link from 'next/link';

const METRICS = [
  { value: '99.9%', label: 'Uptime SLA' },
  { value: '<50ms', label: 'P99 Latency' },
  { value: '5', label: 'Microservices' },
];

export default function HeroSection() {
  return (
    <section
      id="hero"
      style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        paddingTop: '68px',
      }}
    >
      {/* Animated grid background */}
      <div
        className="grid-bg"
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 0,
          opacity: 0.6,
        }}
      />

      {/* Radial glow blobs */}
      <div
        style={{
          position: 'absolute',
          top: '15%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '700px',
          height: '400px',
          background: 'radial-gradient(ellipse at center, rgba(34,211,238,0.12) 0%, transparent 70%)',
          zIndex: 1,
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '10%',
          left: '20%',
          width: '400px',
          height: '300px',
          background: 'radial-gradient(ellipse at center, rgba(129,140,248,0.1) 0%, transparent 70%)',
          zIndex: 1,
          pointerEvents: 'none',
        }}
      />

      {/* Content */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '5rem 2rem',
          textAlign: 'center',
        }}
      >
        {/* Top tag */}
        <div
          className="animate-fadeInUp"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '2rem',
            opacity: 0,
          }}
        >
          <span className="tag">Microservice Platform</span>
          <span
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: '#22D3EE',
              display: 'inline-block',
            }}
            className="animate-pulse-glow"
          />
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.72rem',
              color: 'var(--text-muted)',
              letterSpacing: '0.08em',
            }}
          >
            ALL SYSTEMS OPERATIONAL
          </span>
        </div>

        {/* Headline */}
        <h1
          className="animate-fadeInUp delay-100"
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 800,
            fontSize: 'clamp(2.8rem, 7vw, 6rem)',
            lineHeight: 1.05,
            letterSpacing: '-0.02em',
            color: 'var(--text-primary)',
            marginBottom: '1.5rem',
            opacity: 0,
          }}
        >
          Build. Ship.{' '}
          <span
            style={{
              background: 'linear-gradient(135deg, #22D3EE 0%, #818CF8 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Deliver.
          </span>
          <br />
          At Scale.
        </h1>

        {/* Sub-headline */}
        <p
          className="animate-fadeInUp delay-200"
          style={{
            fontFamily: 'var(--font-body)',
            fontWeight: 400,
            fontSize: 'clamp(1rem, 2vw, 1.2rem)',
            color: 'var(--text-secondary)',
            maxWidth: '600px',
            margin: '0 auto 3rem',
            lineHeight: 1.7,
            opacity: 0,
          }}
        >
          A distributed microservice platform for managing projects, tasks, and teams —
          with real-time analytics and enterprise-grade authentication built in from day one.
        </p>

        {/* CTA Buttons */}
        <div
          className="animate-fadeInUp delay-300"
          style={{
            display: 'flex',
            gap: '1rem',
            justifyContent: 'center',
            flexWrap: 'wrap',
            marginBottom: '4.5rem',
            opacity: 0,
          }}
        >
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
              padding: '14px 32px',
              borderRadius: '3px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'transform 0.2s, box-shadow 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 10px 30px rgba(34,211,238,0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            Start Free Trial
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </Link>
          <Link
            href="#services"
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 600,
              fontSize: '0.95rem',
              letterSpacing: '0.05em',
              color: 'var(--text-primary)',
              background: 'transparent',
              textDecoration: 'none',
              padding: '14px 32px',
              borderRadius: '3px',
              border: '1px solid rgba(255,255,255,0.15)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'border-color 0.2s, background 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'rgba(34,211,238,0.4)';
              e.currentTarget.style.background = 'rgba(34,211,238,0.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)';
              e.currentTarget.style.background = 'transparent';
            }}
          >
            Explore Architecture
          </Link>
        </div>

        {/* Metrics strip */}
        <div
          className="animate-fadeInUp delay-400"
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '3rem',
            flexWrap: 'wrap',
            opacity: 0,
          }}
        >
          {METRICS.map((m) => (
            <div key={m.label} style={{ textAlign: 'center' }}>
              <div
                style={{
                  fontFamily: 'var(--font-display)',
                  fontWeight: 800,
                  fontSize: '1.8rem',
                  color: 'var(--accent-cyan)',
                  letterSpacing: '-0.02em',
                }}
              >
                {m.value}
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.7rem',
                  color: 'var(--text-muted)',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  marginTop: '2px',
                }}
              >
                {m.label}
              </div>
            </div>
          ))}
        </div>

        {/* Scroll cue */}
        <div
          className="animate-float"
          style={{
            marginTop: '5rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '6px',
            opacity: 0.4,
          }}
        >
          <div
            style={{
              width: '24px',
              height: '38px',
              border: '2px solid rgba(255,255,255,0.2)',
              borderRadius: '12px',
              display: 'flex',
              justifyContent: 'center',
              paddingTop: '6px',
            }}
          >
            <div
              style={{
                width: '4px',
                height: '8px',
                background: 'var(--accent-cyan)',
                borderRadius: '2px',
                animation: 'scrollDot 1.6s ease-in-out infinite',
              }}
            />
          </div>
        </div>
      </div>

      <style>{`
        @keyframes scrollDot {
          0%   { transform: translateY(0); opacity: 1; }
          100% { transform: translateY(12px); opacity: 0; }
        }
      `}</style>
    </section>
  );
}
