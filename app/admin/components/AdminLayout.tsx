'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const NAV_ITEMS = [
    {
        label: 'Admin Panel',
        href: '/admin',
        icon: (
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
            </svg>
        ),
    },
];

interface AdminLayoutProps {
    children: React.ReactNode;
    title?: string;
    subtitle?: string;
    actions?: React.ReactNode;
}

export default function AdminLayout({ children, title, subtitle, actions }: AdminLayoutProps) {
    const router = useRouter();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [adminName, setAdminName] = useState('Admin');
    const [adminInitials, setAdminInitials] = useState('AD');

    useEffect(() => {
        const name = localStorage.getItem('name') || 'Admin';
        setAdminName(name);
        setAdminInitials(
            name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
        );
    }, []);

    const handleLogout = () => {
        localStorage.clear();
        router.replace('/login');
    };

    return (
        <>
            <style>{`
        :root {
          --color-bg-primary:   #07080f;
          --color-bg-secondary: #0d0f1a;
          --color-text-primary: #f0f2ff;
          --color-text-secondary: #a0a8c8;
          --color-text-muted:   #5a6280;
          --color-accent:       #818cf8;
          --color-border:       rgba(255,255,255,0.07);
          --color-dark-base:    #07080f;
        }

        .adm-shell {
          display: flex;
          min-height: 100vh;
          background: var(--color-bg-primary);
        }

        /* ── Sidebar ── */
        .adm-sidebar {
          width: 250px;
          flex-shrink: 0;
          background: var(--color-bg-secondary);
          border-right: 1px solid var(--color-border);
          display: flex;
          flex-direction: column;
          position: fixed;
          top: 0; bottom: 0;
          z-index: 50;
          transition: transform 0.3s ease;
        }
        @media (max-width: 767px) {
          .adm-sidebar       { transform: translateX(-100%); }
          .adm-sidebar-open  { transform: translateX(0); }
          .adm-main          { margin-left: 0 !important; }
          .adm-desktop-only  { display: none !important; }
        }
        @media (min-width: 768px) {
          .adm-mobile-only   { display: none !important; }
        }

        .adm-logo {
          padding: 1.25rem 1.5rem;
          border-bottom: 1px solid var(--color-border);
          display: flex;
          align-items: center;
          gap: 0.625rem;
        }
        .adm-logo-text {
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          font-size: 1.1rem;
          letter-spacing: 0.06em;
          color: var(--color-text-primary);
        }
        .adm-logo-badge {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.58rem;
          letter-spacing: 0.1em;
          color: #818cf8;
          background: rgba(129,140,248,0.1);
          border: 1px solid rgba(129,140,248,0.2);
          padding: 2px 6px;
          border-radius: 2px;
          margin-left: 0.25rem;
        }

        /* ── Nav ── */
        .adm-nav {
          flex: 1;
          padding: 1rem 0.75rem;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .adm-nav-link {
          display: flex;
          align-items: center;
          gap: 0.625rem;
          padding: 9px 0.75rem;
          border-radius: 4px;
          text-decoration: none;
          font-family: 'Manrope', sans-serif;
          font-size: 0.875rem;
          transition: color 0.2s ease, background 0.2s ease, border-color 0.2s ease;
        }
        .adm-nav-active {
          font-weight: 600;
          color: #818cf8;
          background: rgba(129,140,248,0.08);
          border: 1px solid rgba(129,140,248,0.15);
        }
        .adm-nav-inactive {
          font-weight: 400;
          color: var(--color-text-secondary);
          background: transparent;
          border: 1px solid transparent;
        }
        .adm-nav-inactive:hover {
          color: var(--color-text-primary);
          background: rgba(255,255,255,0.04);
        }

        /* ── Sidebar bottom ── */
        .adm-sidebar-bottom {
          padding: 1rem 0.75rem;
          border-top: 1px solid var(--color-border);
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        /* ── User chip ── */
        .adm-user-chip {
          display: flex;
          align-items: center;
          gap: 0.625rem;
          padding: 0.625rem 0.75rem;
          border-radius: 4px;
          border: 1px solid var(--color-border);
        }
        .adm-user-avatar {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          font-size: 0.75rem;
          color: #07080f;
          background: linear-gradient(135deg, #818CF8, #6366F1);
        }
        .adm-user-name {
          font-family: 'Manrope', sans-serif;
          font-weight: 600;
          font-size: 0.8rem;
          color: var(--color-text-primary);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .adm-user-role {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.6rem;
          color: #818cf8;
          letter-spacing: 0.08em;
        }

        /* ── Logout button ── */
        .adm-logout-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          width: 100%;
          padding: 9px 0.75rem;
          background: transparent;
          border: 1px solid rgba(239,68,68,0.2);
          border-radius: 4px;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.7rem;
          letter-spacing: 0.08em;
          color: #ef4444;
          cursor: pointer;
          transition: background 0.2s ease, border-color 0.2s ease;
          text-align: left;
        }
        .adm-logout-btn:hover {
          background: rgba(239,68,68,0.06);
          border-color: rgba(239,68,68,0.35);
        }

        /* ── Overlay ── */
        .adm-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.6);
          z-index: 40;
        }

        /* ── Main ── */
        .adm-main {
          margin-left: 240px;
          flex: 1;
          display: flex;
          flex-direction: column;
          min-width: 0;
        }

        /* ── Topbar ── */
        .adm-topbar {
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
        .adm-topbar-title {
          font-family: 'Syne', sans-serif;
          font-weight: 700;
          font-size: 1rem;
          color: var(--color-text-primary);
          margin: 0;
        }
        .adm-topbar-subtitle {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.65rem;
          color: var(--color-text-muted);
          letter-spacing: 0.08em;
          margin: 0;
        }
        .adm-icon-btn {
          background: transparent;
          border: 1px solid var(--color-border);
          border-radius: 4px;
          padding: 7px;
          cursor: pointer;
          color: var(--color-text-secondary);
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }

        /* ── Content ── */
        .adm-content {
          flex: 1;
          padding: 2rem;
          overflow-y: auto;
        }

        /* ── Admin accent stripe at top ── */
        .adm-stripe {
          height: 2px;
          background: linear-gradient(90deg, #818CF8, #6366F1, transparent);
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 100;
        }
      `}</style>

            {/* Purple admin accent stripe */}
            <div className="adm-stripe" />

            <div className="adm-shell">
                {/* Sidebar */}
                <aside className={`adm-sidebar ${sidebarOpen ? 'adm-sidebar-open' : ''}`}>
                    {/* Logo */}
                    <div className="adm-logo">
                        <div style={{
                            width: '1.75rem', height: '1.75rem', flexShrink: 0,
                            background: 'linear-gradient(135deg, #818CF8, #6366F1)',
                            clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
                        }} />
                        <span className="adm-logo-text">
                            TaskMaster
                        </span>
                    </div>

                    {/* Nav */}
                    <nav className="adm-nav">
                        {NAV_ITEMS.map((item) => (
                            <Link key={item.href} href={item.href} className="adm-nav-link adm-nav-active">
                                <span style={{ lineHeight: 1 }}>{item.icon}</span>
                                {item.label}
                            </Link>
                        ))}
                    </nav>

                    {/* Bottom */}
                    <div className="adm-sidebar-bottom">
                        {/* User chip */}
                        <div className="adm-user-chip">
                            <div className="adm-user-avatar">{adminInitials}</div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <div className="adm-user-name">{adminName}</div>
                                <div className="adm-user-role">ADMIN</div>
                            </div>
                        </div>

                        {/* Logout */}
                        <button onClick={handleLogout} className="adm-logout-btn">
                            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                                <polyline points="16 17 21 12 16 7" />
                                <line x1="21" y1="12" x2="9" y2="12" />
                            </svg>
                            LOGOUT
                        </button>
                    </div>
                </aside>

                {/* Mobile overlay */}
                {sidebarOpen && (
                    <div className="adm-overlay adm-mobile-only" onClick={() => setSidebarOpen(false)} />
                )}

                {/* Main */}
                <div className="adm-main">
                    {/* Topbar */}
                    <header className="adm-topbar">
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                            {title && <h1 className="adm-topbar-title">{title}</h1>}
                            {subtitle && <p className="adm-topbar-subtitle">{subtitle}</p>}
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            {actions}

                            {/* Hamburger — mobile only */}
                            <button
                                onClick={() => setSidebarOpen(!sidebarOpen)}
                                className="adm-icon-btn adm-mobile-only"
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
                    <main className="adm-content">{children}</main>
                </div>
            </div>
        </>
    );
}