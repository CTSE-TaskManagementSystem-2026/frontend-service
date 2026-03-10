'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_ITEMS = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: (
      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
  },
  {
    label: 'Projects',
    href: '/projects',
    icon: (
      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
  {
    label: 'Tasks',
    href: '/tasks',
    icon: (
      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <polyline points="9 11 12 14 22 4" />
        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
      </svg>
    ),
  },
  {
    label: 'Profile',
    href: '/profile',
    icon: (
      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
];

interface DashboardLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
}


const handleLogout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('role');
  localStorage.removeItem('name');
  localStorage.removeItem('email');
  window.location.href = '/login';
};

export default function DashboardLayout({ children, title, subtitle, actions }: DashboardLayoutProps) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userName, setUserName] = useState('');
  const [userRole, setUserRole] = useState('');
  const [userInitials, setUserInitials] = useState('??');

  useEffect(() => {
    const name = localStorage.getItem('name') || '';
    const role = localStorage.getItem('role') || '';
    setUserName(name);
    setUserRole(role);
    setUserInitials(
      name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2) || '??'
    );
  }, []);

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
          --color-border:        rgba(255, 255, 255, 0.07);
        }

        /* ── Layout shell ── */
        .dash-shell {
          display: flex;
          min-height: 100vh;
          background: var(--color-bg-primary);
        }

        /* ── Sidebar ── */
        .dash-sidebar {
          width: 240px;
          flex-shrink: 0;
          background: var(--color-bg-secondary);
          border-right: 1px solid var(--color-border);
          display: flex;
          flex-direction: column;
          position: fixed;
          top: 0;
          bottom: 0;
          z-index: 50;
          transition: transform 0.3s ease;
        }

        .dash-sidebar-logo {
          padding: 1.25rem 1.5rem;
          border-bottom: 1px solid var(--color-border);
          display: flex;
          align-items: center;
          gap: 0.625rem;
        }

        .dash-sidebar-logo-text {
          font-weight: 800;
          font-size: 1.1rem;
          letter-spacing: 0.06em;
          color: var(--color-text-primary);
        }

        /* ── Nav ── */
        .dash-nav {
          flex: 1;
          padding: 1rem 0.75rem;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .dash-nav-link {
          display: flex;
          align-items: center;
          gap: 0.625rem;
          padding: 9px 0.75rem;
          border-radius: 4px;
          text-decoration: none;
          font-size: 0.875rem;
          transition: color 0.2s ease, background 0.2s ease, border-color 0.2s ease;
        }

        .dash-nav-link-active {
          font-weight: 600;
          color: #22d3ee;
          background: rgba(34, 211, 238, 0.08);
          border: 1px solid rgba(34, 211, 238, 0.15);
        }

        .dash-nav-link-inactive {
          font-weight: 400;
          color: var(--color-text-secondary);
          background: transparent;
          border: 1px solid transparent;
        }
        .dash-nav-link-inactive:hover {
          color: var(--color-text-primary);
          background: rgba(255, 255, 255, 0.04);
        }

        /* ── Sidebar bottom ── */
        .dash-sidebar-bottom {
          padding: 1rem 0.75rem;
          border-top: 1px solid var(--color-border);
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .dash-new-project-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 9px 0.75rem;
          border-radius: 4px;
          text-decoration: none;
          font-weight: 600;
          font-size: 0.8rem;
          color: var(--color-dark-base);
          background: var(--color-accent-cyan);
          transition: opacity 0.2s ease;
        }
        .dash-new-project-btn:hover { opacity: 0.85; }

        /* ── User chip ── */
        .dash-user-chip {
          display: flex;
          align-items: center;
          gap: 0.625rem;
          padding: 0.625rem 0.75rem;
          border-radius: 4px;
          border: 1px solid var(--color-border);
          cursor: pointer;
        }

        .dash-user-avatar {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 0.75rem;
          color: var(--color-dark-base);
          background: linear-gradient(135deg, #22D3EE, #818CF8);
        }

        .dash-user-name {
          font-weight: 600;
          font-size: 0.8rem;
          color: var(--color-text-primary);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .dash-user-role {
          font-family: monospace;
          font-size: 0.65rem;
          color: var(--color-text-muted);
          letter-spacing: 0.06em;
        }

        /* ── Mobile overlay ── */
        .dash-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.6);
          z-index: 40;
        }

        /* ── Main content area ── */
        .dash-main {
          margin-left: 240px;
          flex: 1;
          display: flex;
          flex-direction: column;
          min-width: 0;
        }

        /* ── Top bar ── */
        .dash-topbar {
          height: 60px;
          background: var(--color-bg-secondary);
          border-bottom: 1px solid var(--color-border);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 2rem;
          position: sticky;
          top: 0;
          z-index: 30;
        }

        .dash-topbar-title {
          font-weight: 700;
          font-size: 1rem;
          color: var(--color-text-primary);
          letter-spacing: 0.01em;
          margin: 0;
        }

        .dash-topbar-subtitle {
          font-family: monospace;
          font-size: 0.68rem;
          color: var(--color-text-muted);
          letter-spacing: 0.06em;
          margin: 0;
        }

        /* ── Icon buttons in topbar ── */
        .dash-icon-btn {
          background: transparent;
          border: 1px solid var(--color-border);
          border-radius: 4px;
          padding: 7px;
          cursor: pointer;
          color: var(--color-text-secondary);
          line-height: 1;
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }

        .dash-notif-dot {
          position: absolute;
          top: 4px;
          right: 4px;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--color-accent-cyan);
        }

        /* ── Page content ── */
        .dash-content {
          flex: 1;
          padding: 2rem;
          overflow-y: auto;
        }

        /* ── Responsive ── */
        @media (max-width: 767px) {
          .dash-sidebar          { transform: translateX(-100%); }
          .dash-sidebar-open     { transform: translateX(0); }
          .dash-main             { margin-left: 0; }
          .dash-desktop-only     { display: none !important; }
        }
        @media (min-width: 768px) {
          .dash-mobile-only      { display: none !important; }
        }
      `}</style>

      <div className="dash-shell">
        {/* Sidebar */}
        <aside className={`dash-sidebar ${sidebarOpen ? 'dash-sidebar-open' : ''}`}>
          {/* Logo */}
          <div className="dash-sidebar-logo">
            <div
              style={{
                width: '1.75rem',
                height: '1.75rem',
                flexShrink: 0,
                background: 'linear-gradient(135deg, #22D3EE, #818CF8)',
                clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
              }}
            />
            <span className="dash-sidebar-logo-text">TaskMaster</span>
          </div>

          {/* Nav items */}
          <nav className="dash-nav">
            {NAV_ITEMS.map((item) => {
              const active = pathname === item.href || pathname?.startsWith(item.href + '/');
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`dash-nav-link ${active ? 'dash-nav-link-active' : 'dash-nav-link-inactive'}`}
                >
                  <span style={{ lineHeight: 1, color: active ? '#22d3ee' : 'inherit' }}>{item.icon}</span>
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Bottom: quick actions + user chip */}
          <div className="dash-sidebar-bottom">
            <Link href="/projects/create" className="dash-new-project-btn">
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              New Project
            </Link>

            {/* User chip */}
            <div className="dash-user-chip">
              <div className="dash-user-avatar">{userInitials}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="dash-user-name">{userName || 'User'}</div>
                <div className="dash-user-role">{userRole || '—'}</div>
              </div>

              <button
                onClick={handleLogout}
                title="Log out"
                style={{
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '4px',
                  color: '#475569',
                  flexShrink: 0,
                  lineHeight: 1,
                  transition: 'color 0.2s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#ef4444')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#475569')}
              >
                <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
              </button>
            </div>
          </div>
        </aside>

        {/* Mobile overlay */}
        {sidebarOpen && (
          <div className="dash-overlay dash-mobile-only" onClick={() => setSidebarOpen(false)} />
        )}

        {/* Main content */}
        <div className="dash-main">
          {/* Top bar */}
          <header className="dash-topbar">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              {title && <h1 className="dash-topbar-title">{title}</h1>}
              {subtitle && <p className="dash-topbar-subtitle">{subtitle}</p>}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              {actions}

              {/* Notification bell */}
              <button className="dash-icon-btn">
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                  <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>
                <span className="dash-notif-dot" />
              </button>

              {/* Hamburger for mobile */}
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="dash-icon-btn dash-mobile-only"
              >
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </svg>
              </button>
            </div>
          </header>

          {/* Page content */}
          <main className="dash-content">{children}</main>
        </div>
      </div>
    </>
  );
}