'use client';

import Link from 'next/link';

const FOOTER_LINKS = {
  Platform: [
    { label: 'Auth Service', href: '#services' },
    { label: 'Projects Service', href: '#services' },
    { label: 'Tasks Service', href: '#services' },
    { label: 'Analytics Service', href: '#services' },
  ],
  Developers: [
    { label: 'API Reference', href: '/docs/api' },
    { label: 'OpenAPI Spec', href: '/docs/openapi' },
    { label: 'SDKs', href: '/docs/sdks' },
    { label: 'Changelog', href: '/changelog' },
  ],
  Company: [
    { label: 'About', href: '/about' },
    { label: 'Blog', href: '/blog' },
    { label: 'Careers', href: '/careers' },
    { label: 'Status', href: '/status' },
  ],
  Legal: [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Security', href: '/security' },
    { label: 'Cookie Policy', href: '/cookies' },
  ],
};

const SOCIAL_ICONS = [
  {
    title: 'GitHub',
    d: 'M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22',
  },
  {
    title: 'Twitter',
    d: 'M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z',
  },
  {
    title: 'LinkedIn',
    d: 'M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z M4 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4z',
  },
];

export default function Footer() {
  return (
    <>
      <style>{`
        .footer-root {
          border-top: 1px solid rgba(255, 255, 255, 0.06);
          background-color: #0d0f1a;
          padding: 4rem 2rem 2rem;
        }

        .footer-inner {
          max-width: 1280px;
          margin: 0 auto;
        }

        .footer-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
          gap: 3rem;
          margin-bottom: 4rem;
        }

        .footer-brand-name {
          font-weight: 800;
          font-size: 1.15rem;
          letter-spacing: 0.06em;
          color: #f0f2ff;
        }

        .footer-brand-desc {
          font-size: 0.85rem;
          color: #5a6280;
          line-height: 1.6;
          max-width: 200px;
          margin: 0;
        }

        .footer-social-link {
          color: #5a6280;
          text-decoration: none;
          line-height: 1;
          transition: color 0.2s ease;
          display: inline-flex;
        }
        .footer-social-link:hover {
          color: #22d3ee;
        }

        .footer-group-label {
          font-family: monospace;
          font-size: 0.7rem;
          font-weight: 500;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #a0a8c8;
          margin: 0 0 1.25rem 0;
        }

        .footer-link-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 0.65rem;
        }

        .footer-link {
          font-size: 0.875rem;
          color: #5a6280;
          text-decoration: none;
          transition: color 0.2s ease;
        }
        .footer-link:hover {
          color: #f0f2ff;
        }

        .footer-divider {
          height: 1px;
          background: rgba(255, 255, 255, 0.06);
          border: none;
          margin: 0;
        }

        .footer-bottom {
          padding-top: 1.5rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .footer-copyright {
          font-family: monospace;
          font-size: 0.72rem;
          color: #5a6280;
          letter-spacing: 0.06em;
          margin: 0;
        }

        .footer-status {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .footer-status-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #34d399;
          display: inline-block;
          flex-shrink: 0;
        }

        .footer-status-text {
          font-family: monospace;
          font-size: 0.7rem;
          color: #5a6280;
          letter-spacing: 0.08em;
        }
      `}</style>

      <footer className="footer-root">
        <div className="footer-inner">
          {/* Top: logo + links */}
          <div className="footer-grid">
            {/* Brand column */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '1rem' }}>
                <div
                  style={{
                    width: '1.75rem',
                    height: '1.75rem',
                    flexShrink: 0,
                    background: 'linear-gradient(135deg, #22D3EE, #818CF8)',
                    clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
                  }}
                />
                <span className="footer-brand-name">TaskMaster</span>
              </div>
              <p className="footer-brand-desc">
                A microservice platform for modern engineering teams.
              </p>

              {/* Social icons */}
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
                {SOCIAL_ICONS.map((icon) => (
                  <a
                    key={icon.title}
                    href="#"
                    aria-label={icon.title}
                    className="footer-social-link"
                  >
                    <svg
                      width="18"
                      height="18"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      viewBox="0 0 24 24"
                    >
                      <path d={icon.d} />
                    </svg>
                  </a>
                ))}
              </div>
            </div>

            {/* Link columns */}
            {Object.entries(FOOTER_LINKS).map(([group, links]) => (
              <div key={group}>
                <h4 className="footer-group-label">{group}</h4>
                <ul className="footer-link-list">
                  {links.map((link) => (
                    <li key={link.label}>
                      <Link href={link.href} className="footer-link">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <hr className="footer-divider" />

          {/* Bottom bar */}
          <div className="footer-bottom">
            <p className="footer-copyright">
              © {new Date().getFullYear()} TaskMaster Platform. All rights reserved.
            </p>
            <div className="footer-status">
              <span className="footer-status-dot" />
              <span className="footer-status-text">All systems operational</span>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}