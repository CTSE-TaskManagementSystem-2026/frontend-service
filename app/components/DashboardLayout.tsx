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

type Theme = 'dark' | 'light';

const THEME_TOKENS: Record<Theme, Record<string, string>> = {
  dark: {
    '--color-bg-primary': '#07080F',
    '--color-bg-secondary': '#0D0E1A',
    '--color-bg-card': '#0F1020',
    '--color-border': 'rgba(255,255,255,0.08)',
    '--color-border-accent': 'rgba(34,211,238,0.3)',
    '--color-accent-cyan': '#22D3EE',
    '--color-accent-amber': '#F59E0B',
    '--color-accent-violet': '#818CF8',
    '--color-text-primary': '#F1F5F9',
    '--color-text-secondary': '#94A3B8',
    '--color-text-muted': '#475569',
    '--color-dark-base': '#07080F',
    '--bg-primary': '#07080F',
    '--bg-secondary': '#0D0E1A',
    '--bg-card': '#0F1020',
    '--border': 'rgba(255,255,255,0.08)',
    '--border-accent': 'rgba(34,211,238,0.3)',
    '--accent-cyan': '#22D3EE',
    '--accent-amber': '#F59E0B',
    '--accent-violet': '#818CF8',
    '--text-primary': '#F1F5F9',
    '--text-secondary': '#94A3B8',
    '--text-muted': '#475569',
  },
  light: {
    '--color-bg-primary': '#F8FAFC',
    '--color-bg-secondary': '#EEF2FF',
    '--color-bg-card': '#FFFFFF',
    '--color-border': 'rgba(15,23,42,0.08)',
    '--color-border-accent': 'rgba(14,165,233,0.22)',
    '--color-accent-cyan': '#0891B2',
    '--color-accent-amber': '#D97706',
    '--color-accent-violet': '#6366F1',
    '--color-text-primary': '#0F172A',
    '--color-text-secondary': '#475569',
    '--color-text-muted': '#64748B',
    '--color-dark-base': '#0F172A',
    '--bg-primary': '#F8FAFC',
    '--bg-secondary': '#EEF2FF',
    '--bg-card': '#FFFFFF',
    '--border': 'rgba(15,23,42,0.08)',
    '--border-accent': 'rgba(14,165,233,0.22)',
    '--accent-cyan': '#0891B2',
    '--accent-amber': '#D97706',
    '--accent-violet': '#6366F1',
    '--text-primary': '#0F172A',
    '--text-secondary': '#475569',
    '--text-muted': '#64748B',
  },
};

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  const tokens = THEME_TOKENS[theme];

  Object.entries(tokens).forEach(([key, value]) => {
    root.style.setProperty(key, value);
  });

  root.dataset.theme = theme;
  root.classList.toggle('dark', theme === 'dark');

  document.body.style.backgroundColor = tokens['--color-bg-primary'];
  document.body.style.color = tokens['--color-text-primary'];

  localStorage.setItem('theme', theme);
}

const handleLogout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('role');
  localStorage.removeItem('name');
  localStorage.removeItem('email');
  window.location.href = '/login';
};

export default function DashboardLayout({
  children,
  title,
  subtitle,
  actions,
}: DashboardLayoutProps) {
  const pathname = usePathname();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userName, setUserName] = useState('');
  const [userRole, setUserRole] = useState('');
  const [userInitials, setUserInitials] = useState('??');
  const [theme, setTheme] = useState<Theme>('dark');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const name = localStorage.getItem('name') || '';
    const role = localStorage.getItem('role') || '';

    setUserName(name);
    setUserRole(role);
    setUserInitials(
      name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2) || '??'
    );

    const savedTheme = localStorage.getItem('theme') as Theme | null;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = savedTheme ?? (prefersDark ? 'dark' : 'light');

    setTheme(initialTheme);
    applyTheme(initialTheme);
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    applyTheme(theme);
  }, [theme, mounted]);

  const isDark = theme === 'dark';

  const shellClasses = isDark
    ? {
      pageGlowOne: 'bg-cyan-400/10',
      pageGlowTwo: 'bg-violet-500/10',
      overlay: 'bg-black/60',
      sidebar: 'bg-slate-950/85',
      header: 'bg-slate-950/70',
      subtleHover: 'hover:bg-white/[0.04]',
      neutralBtn:
        'border-white/10 bg-white/[0.03] text-slate-200 hover:border-cyan-300/30 hover:bg-cyan-400/10 hover:text-cyan-200',
      inactiveNav:
        'border-transparent text-[color:var(--color-text-secondary)] hover:border-[color:var(--color-border)] hover:bg-white/[0.03] hover:text-[color:var(--color-text-primary)]',
      activeNav:
        'border-cyan-400/20 bg-cyan-400/10 font-semibold text-cyan-300 shadow-[0_10px_30px_rgba(34,211,238,0.08)]',
      brandCard: 'bg-[color:var(--color-bg-card)]',
    }
    : {
      pageGlowOne: 'bg-sky-400/10',
      pageGlowTwo: 'bg-violet-500/10',
      overlay: 'bg-slate-900/25',
      sidebar: 'bg-white/88',
      header: 'bg-white/80',
      subtleHover: 'hover:bg-slate-100/80',
      neutralBtn:
        'border-slate-200 bg-white/80 text-slate-700 hover:border-sky-300 hover:bg-sky-50 hover:text-sky-700',
      inactiveNav:
        'border-transparent text-[color:var(--color-text-secondary)] hover:border-[color:var(--color-border)] hover:bg-slate-100/80 hover:text-[color:var(--color-text-primary)]',
      activeNav:
        'border-sky-300/40 bg-sky-50 font-semibold text-sky-700 shadow-[0_10px_30px_rgba(14,165,233,0.10)]',
      brandCard: 'bg-[color:var(--color-bg-card)]',
    };

  const toggleTheme = () => {
    setTheme((current) => (current === 'dark' ? 'light' : 'dark'));
  };

  return (
    <div className="relative flex min-h-screen bg-[color:var(--color-bg-primary)] text-[color:var(--color-text-primary)] transition-colors duration-300">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.07] [background-image:linear-gradient(rgba(148,163,184,0.35)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.35)_1px,transparent_1px)] [background-size:42px_42px]" />
        <div className={`absolute left-[12%] top-20 h-72 w-72 rounded-full blur-3xl ${shellClasses.pageGlowOne}`} />
        <div className={`absolute bottom-10 right-[8%] h-72 w-72 rounded-full blur-3xl ${shellClasses.pageGlowTwo}`} />
      </div>

      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          className={`fixed inset-0 z-40 md:hidden ${shellClasses.overlay}`}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[268px] flex-col border-r border-[color:var(--color-border)] ${shellClasses.sidebar} backdrop-blur-2xl transition-transform duration-300 md:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        <div className="flex items-center gap-3 border-b border-[color:var(--color-border)] px-6 py-5">
          <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl border border-cyan-400/20 bg-gradient-to-br from-cyan-400/20 via-sky-400/10 to-violet-500/20">
            <div className="h-6 w-6 bg-gradient-to-br from-cyan-300 via-sky-400 to-violet-500 [clip-path:polygon(50%_0%,100%_25%,100%_75%,50%_100%,0%_75%,0%_25%)]" />
          </div>

          <div className="leading-none">
            <p className="text-lg font-extrabold tracking-[0.08em] text-[color:var(--color-text-primary)]">
              TaskMaster
            </p>
            <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-[color:var(--color-text-muted)]">
              Workspace
            </p>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4">
          <div className="space-y-1.5">
            {NAV_ITEMS.map((item) => {
              const active =
                pathname === item.href || pathname?.startsWith(item.href + '/');

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm transition-all duration-200 ${active ? shellClasses.activeNav : shellClasses.inactiveNav
                    }`}
                >
                  <span className={active ? 'text-current' : 'text-inherit'}>
                    {item.icon}
                  </span>
                  {item.label}
                </Link>
              );
            })}
          </div>
        </nav>

        <div className="border-t border-[color:var(--color-border)] px-3 py-4">
          <Link
            href="/projects/create"
            className="mb-3 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-cyan-400 px-4 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-slate-950 transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(34,211,238,0.2)]"
          >
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            New Project
          </Link>

          <div className={`flex items-center gap-3 rounded-2xl border border-[color:var(--color-border)] ${shellClasses.brandCard} px-3 py-3`}>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 via-sky-400 to-violet-500 text-sm font-extrabold text-slate-950">
              {userInitials}
            </div>

            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-semibold text-[color:var(--color-text-primary)]">
                {userName || 'User'}
              </div>
              <div className="truncate font-mono text-[11px] uppercase tracking-[0.12em] text-[color:var(--color-text-muted)]">
                {userRole || '—'}
              </div>
            </div>

            <button
              onClick={handleLogout}
              title="Log out"
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl text-[color:var(--color-text-muted)] transition duration-200 hover:bg-red-500/10 hover:text-red-400"
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

      <div className="relative flex min-w-0 flex-1 flex-col md:ml-[268px]">
        <header
          className={`sticky top-0 z-30 border-b border-[color:var(--color-border)] ${shellClasses.header} backdrop-blur-2xl transition-colors duration-300`}
        >
          <div className="flex h-[76px] items-center justify-between px-4 sm:px-6">
            <div className="flex min-w-0 items-center gap-3">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className={`inline-flex h-10 w-10 items-center justify-center rounded-2xl border transition duration-200 md:hidden ${shellClasses.neutralBtn}`}
              >
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </svg>
              </button>

              <div className="min-w-0">
                {title && (
                  <h1 className="truncate text-lg font-bold tracking-[-0.02em] text-[color:var(--color-text-primary)] sm:text-xl">
                    {title}
                  </h1>
                )}
                {subtitle && (
                  <p className="truncate font-mono text-[11px] uppercase tracking-[0.14em] text-[color:var(--color-text-muted)]">
                    {subtitle}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              {actions}

              <button
                type="button"
                onClick={toggleTheme}
                aria-label="Toggle theme"
                className={`group inline-flex h-10 w-10 items-center justify-center rounded-2xl border transition duration-200 ${shellClasses.neutralBtn}`}
              >
                {isDark ? (
                  <svg
                    className="h-5 w-5 transition-transform duration-300 group-hover:rotate-12"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path
                      d="M12 3V5M12 19V21M4.93 4.93L6.34 6.34M17.66 17.66L19.07 19.07M3 12H5M19 12H21M4.93 19.07L6.34 17.66M17.66 6.34L19.07 4.93M12 16A4 4 0 1 0 12 8A4 4 0 0 0 12 16Z"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : (
                  <svg
                    className="h-5 w-5 transition-transform duration-300 group-hover:-rotate-12"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path
                      d="M21 12.8A9 9 0 1 1 11.2 3C10.9 3.8 10.75 4.66 10.75 5.56C10.75 9.7 14.1 13.06 18.25 13.06C19.15 13.06 20.03 12.97 21 12.8Z"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </button>

              <button
                className={`relative inline-flex h-10 w-10 items-center justify-center rounded-2xl border transition duration-200 ${shellClasses.neutralBtn}`}
              >
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                  <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>
                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-cyan-400" />
              </button>
            </div>
          </div>
        </header>

        <main className="relative flex-1 px-4 py-6 sm:px-6">{children}</main>
      </div>
    </div>
  );
}