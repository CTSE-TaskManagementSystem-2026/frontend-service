'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const NAV_LINKS = [
  { label: 'Features', href: '#features' },
  { label: 'Services', href: '#services' },
  { label: 'Analytics', href: '#analytics' },
  { label: 'Docs', href: '#docs' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <style>{`
        :root {
          --color-bg-primary: #07080f;
          --color-bg-secondary: #0d0f1a;
          --color-text-primary: #f0f2ff;
          --color-text-secondary: #a0a8c8;
          --color-text-muted: #5a6280;
          --color-accent-cyan: #22d3ee;
          --color-accent-indigo: #818cf8;
          --color-dark-base: #07080f;
        }

        .nav-link {
          font-family: inherit;
          font-weight: 500;
          font-size: 0.875rem;
          color: var(--color-text-secondary);
          text-decoration: none;
          letter-spacing: 0.03em;
          transition: color 0.2s ease;
        }
        .nav-link:hover {
          color: var(--color-text-primary);
        }

        .btn-signin {
          font-weight: 500;
          font-size: 0.875rem;
          color: var(--color-text-secondary);
          text-decoration: none;
          transition: color 0.2s ease;
        }
        .btn-signin:hover {
          color: var(--color-text-primary);
        }

        .btn-cta {
          font-weight: 600;
          font-size: 0.875rem;
          letter-spacing: 0.05em;
          color: var(--color-dark-base);
          background: var(--color-accent-cyan);
          text-decoration: none;
          padding: 0.5rem 1.25rem;
          border-radius: 2px;
          transition: opacity 0.2s ease, transform 0.2s ease;
          display: inline-block;
          white-space: nowrap;
        }
        .btn-cta:hover {
          opacity: 0.85;
          transform: translateY(-1px);
        }

        .logo-badge {
          font-family: monospace;
          font-size: 0.65rem;
          color: var(--color-accent-cyan);
          background: rgba(34, 211, 238, 0.1);
          border: 1px solid rgba(34, 211, 238, 0.25);
          padding: 0.125rem 0.375rem;
          border-radius: 2px;
          letter-spacing: 0.1em;
        }

        .logo-text {
          font-weight: 800;
          font-size: 1.3rem;
          letter-spacing: 0.06em;
          color: var(--color-text-primary);
        }

        .hamburger-bar {
          display: block;
          width: 22px;
          height: 2px;
          background: var(--color-text-primary);
          transition: all 0.3s ease;
        }

        .mobile-nav-link {
          font-weight: 500;
          font-size: 1rem;
          color: var(--color-text-secondary);
          text-decoration: none;
        }

        @media (min-width: 768px) {
          .mobile-only { display: none !important; }
        }
        @media (max-width: 767px) {
          .desktop-only { display: none !important; }
        }
      `}</style>

      <header
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          transition: 'all 0.3s ease',
          backgroundColor: scrolled ? 'rgba(7, 8, 15, 0.92)' : 'transparent',
          backdropFilter: scrolled ? 'blur(16px)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(16px)' : 'none',
          borderBottom: scrolled
            ? '1px solid rgba(34, 211, 238, 0.1)'
            : '1px solid transparent',
        }}
      >
        <div
          style={{
            maxWidth: '1280px',
            margin: '0 auto',
            padding: '0 2rem',
            height: '68px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {/* Logo */}
          <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            <div
              style={{
                width: '2rem',
                height: '2rem',
                flexShrink: 0,
                background: 'linear-gradient(135deg, #22D3EE, #818CF8)',
                clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
              }}
            />
            <span className="logo-text">TaskMaster</span>
            <span className="logo-badge">v2</span>
          </Link>

          {/* Desktop nav */}
          <nav className="desktop-only" style={{ display: 'flex', alignItems: 'center', gap: '2.5rem' }}>
            {NAV_LINKS.map((link) => (
              <Link key={link.label} href={link.href} className="nav-link">
                {link.label}
              </Link>
            ))}
          </nav>

          {/* CTA buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Link href="/login" className="btn-signin desktop-only">
              Sign In
            </Link>
            <Link href="/signup" className="btn-cta">
              Get Started
            </Link>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
              className="mobile-only"
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '5px',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                padding: '4px',
              }}
            >
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="hamburger-bar"
                  style={{
                    transform:
                      menuOpen && i === 0 ? 'translateY(7px) rotate(45deg)'
                      : menuOpen && i === 2 ? 'translateY(-7px) rotate(-45deg)'
                      : menuOpen && i === 1 ? 'scaleX(0)' : 'none',
                    opacity: menuOpen && i === 1 ? 0 : 1,
                  }}
                />
              ))}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div
            className="mobile-only"
            style={{
              background: 'rgba(7, 8, 15, 0.97)',
              borderTop: '1px solid rgba(34, 211, 238, 0.1)',
              padding: '1.5rem 2rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.25rem',
            }}
          >
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="mobile-nav-link"
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </header>
    </>
  );
}