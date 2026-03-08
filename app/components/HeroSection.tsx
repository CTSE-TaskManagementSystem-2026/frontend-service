'use client';

import Link from 'next/link';

const METRICS = [
  { value: '99.9%', label: 'Uptime SLA' },
  { value: '<50ms', label: 'P99 Latency' },
  { value: '5', label: 'Microservices' },
];

export default function HeroSection() {
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
          --color-dark-base:     #07080f;
        }

        /* ── Grid background ── */
        .hero-grid-bg {
          position: absolute;
          inset: 0;
          opacity: 0.6;
          background-image:
            linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px);
          background-size: 60px 60px;
          pointer-events: none;
        }

        /* ── Badge / tag ── */
        .hero-tag {
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
        }

        /* ── Gradient headline span ── */
        .hero-gradient-text {
          background: linear-gradient(90deg, #22d3ee 0%, #818cf8 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        /* ── Pulse dot ── */
        @keyframes pulse-glow {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.5; transform: scale(1.3); }
        }
        .hero-pulse-dot {
          display: inline-block;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--color-accent-cyan);
          animation: pulse-glow 2s ease-in-out infinite;
          flex-shrink: 0;
        }

        /* ── Fade-in-up stagger ── */
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .hero-fade { opacity: 0; animation: fadeInUp 0.7s ease forwards; }
        .hero-fade-d0  { animation-delay: 0ms; }
        .hero-fade-d100 { animation-delay: 100ms; }
        .hero-fade-d200 { animation-delay: 200ms; }
        .hero-fade-d300 { animation-delay: 300ms; }
        .hero-fade-d400 { animation-delay: 400ms; }

        /* ── Floating scroll cue ── */
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(-6px); }
        }
        .hero-float { animation: float 3s ease-in-out infinite; }

        /* ── Scroll dot ── */
        @keyframes scroll-dot {
          0%   { transform: translateY(0); opacity: 1; }
          80%  { transform: translateY(10px); opacity: 0; }
          100% { transform: translateY(0); opacity: 0; }
        }
        .hero-scroll-dot {
          width: 4px;
          height: 8px;
          background: var(--color-accent-cyan);
          border-radius: 2px;
          animation: scroll-dot 1.6s ease-in-out infinite;
        }

        /* ── Primary CTA button ── */
        .hero-btn-primary {
          font-weight: 700;
          font-size: 0.95rem;
          letter-spacing: 0.06em;
          color: var(--color-dark-base);
          background: var(--color-accent-cyan);
          text-decoration: none;
          padding: 14px 2rem;
          border-radius: 2px;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .hero-btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(34, 211, 238, 0.3);
        }

        /* ── Secondary CTA button ── */
        .hero-btn-secondary {
          font-weight: 600;
          font-size: 0.95rem;
          letter-spacing: 0.05em;
          color: var(--color-text-primary);
          background: transparent;
          text-decoration: none;
          padding: 14px 2rem;
          border-radius: 2px;
          border: 1px solid rgba(255,255,255,0.15);
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          transition: border-color 0.2s ease, background 0.2s ease;
        }
        .hero-btn-secondary:hover {
          border-color: rgba(34, 211, 238, 0.4);
          background: rgba(34, 211, 238, 0.05);
        }
      `}</style>

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
          background: 'var(--color-bg-primary)',
        }}
      >
        {/* Animated grid background */}
        <div className="hero-grid-bg" />

        {/* Radial glow blobs */}
        <div
          style={{
            position: 'absolute',
            top: '15%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '700px',
            height: '400px',
            zIndex: 1,
            pointerEvents: 'none',
            background: 'radial-gradient(ellipse at center, rgba(34,211,238,0.12) 0%, transparent 70%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '10%',
            left: '20%',
            width: '400px',
            height: '300px',
            zIndex: 1,
            pointerEvents: 'none',
            background: 'radial-gradient(ellipse at center, rgba(129,140,248,0.1) 0%, transparent 70%)',
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
            width: '100%',
          }}
        >
          {/* Top badge */}
          <div className="hero-fade hero-fade-d0" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem' }}>
            <span className="hero-tag">Microservice Platform</span>
            <span className="hero-pulse-dot" />
            <span style={{ fontFamily: 'monospace', fontSize: '0.72rem', color: 'var(--color-text-muted)', letterSpacing: '0.08em' }}>
              ALL SYSTEMS OPERATIONAL
            </span>
          </div>

          {/* Headline */}
          <h1
            className="hero-fade hero-fade-d100"
            style={{
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: '-0.02em',
              color: 'var(--color-text-primary)',
              marginBottom: '1.5rem',
              fontSize: 'clamp(2.8rem, 7vw, 6rem)',
            }}
          >
            Build. Ship.{' '}
            <span className="hero-gradient-text">Deliver.</span>
            <br />
            At Scale.
          </h1>

          {/* Sub-headline */}
          <p
            className="hero-fade hero-fade-d200"
            style={{
              fontWeight: 400,
              color: 'var(--color-text-secondary)',
              maxWidth: '600px',
              margin: '0 auto 3rem',
              lineHeight: 1.7,
              fontSize: 'clamp(1rem, 2vw, 1.2rem)',
            }}
          >
            A distributed microservice platform for managing projects, tasks, and teams —
            with real-time analytics and enterprise-grade authentication built in from day one.
          </p>

          {/* CTA Buttons */}
          <div
            className="hero-fade hero-fade-d300"
            style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '4.5rem' }}
          >
            <Link href="/signup" className="hero-btn-primary">
              Start Free Trial
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
            <Link href="#services" className="hero-btn-secondary">
              Explore Architecture
            </Link>
          </div>

          {/* Metrics strip */}
          <div
            className="hero-fade hero-fade-d400"
            style={{ display: 'flex', justifyContent: 'center', gap: '3rem', flexWrap: 'wrap' }}
          >
            {METRICS.map((m) => (
              <div key={m.label} style={{ textAlign: 'center' }}>
                <div style={{ fontWeight: 800, fontSize: '1.8rem', color: 'var(--color-accent-cyan)', letterSpacing: '-0.02em' }}>
                  {m.value}
                </div>
                <div style={{ fontFamily: 'monospace', fontSize: '0.7rem', color: 'var(--color-text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: '2px' }}>
                  {m.label}
                </div>
              </div>
            ))}
          </div>

          {/* Scroll cue */}
          <div className="hero-float" style={{ marginTop: '5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', opacity: 0.4 }}>
            <div style={{ width: '24px', height: '38px', border: '2px solid rgba(255,255,255,0.2)', borderRadius: '12px', display: 'flex', justifyContent: 'center', paddingTop: '6px' }}>
              <div className="hero-scroll-dot" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}