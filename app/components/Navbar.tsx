'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { applyTheme, getInitialTheme, type Theme } from '@/app/components/theme';

const NAV_LINKS = [
  { label: 'Features', href: '#features' },
  { label: 'Services', href: '#services' },
  { label: 'Analytics', href: '#analytics' },
  { label: 'Docs', href: '#docs' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [theme, setTheme] = useState<Theme>('dark');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const initialTheme = getInitialTheme();
    setTheme(initialTheme);
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    applyTheme(theme);
  }, [theme, mounted]);

  const isDark = theme === 'dark';

  const shellClasses = isDark
    ? scrolled
      ? 'border-white/10 bg-slate-950/80 shadow-[0_20px_60px_rgba(2,6,23,0.45)]'
      : 'border-white/10 bg-slate-950/55 shadow-[0_18px_50px_rgba(2,6,23,0.28)]'
    : scrolled
      ? 'border-slate-200/90 bg-white/85 shadow-[0_20px_60px_rgba(15,23,42,0.12)]'
      : 'border-slate-200/80 bg-white/70 shadow-[0_18px_50px_rgba(15,23,42,0.08)]';

  const textPrimary = isDark ? 'text-slate-100' : 'text-slate-900';
  const textSecondary = isDark ? 'text-slate-300' : 'text-slate-600';
  const textMuted = isDark ? 'text-slate-400' : 'text-slate-500';
  const hoverText = isDark ? 'hover:text-cyan-300' : 'hover:text-sky-700';
  const divider = isDark ? 'border-white/10' : 'border-slate-200/80';

  const toggleTheme = () => {
    setTheme((current) => (current === 'dark' ? 'light' : 'dark'));
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 sm:px-6">
      <div
        className={`mx-auto mt-3 max-w-7xl rounded-[28px] border backdrop-blur-2xl transition-all duration-300 ${shellClasses}`}
      >
        <div className="flex h-[72px] items-center justify-between px-4 sm:px-6">
          <Link
            href="/"
            className="flex items-center gap-3 text-decoration-none"
            onClick={() => setMenuOpen(false)}
          >
            <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl border border-cyan-400/20 bg-gradient-to-br from-cyan-400/20 via-sky-400/10 to-violet-500/20">
              <div className="h-6 w-6 bg-gradient-to-br from-cyan-300 via-sky-400 to-violet-500 [clip-path:polygon(50%_0%,100%_25%,100%_75%,50%_100%,0%_75%,0%_25%)]" />
            </div>

            <div className="flex flex-col leading-none">
              <span className={`text-[1.05rem] font-extrabold tracking-[0.08em] ${textPrimary}`}>
                TASKMASTER
              </span>
              <span className={`text-[0.62rem] font-medium uppercase tracking-[0.26em] ${textMuted}`}>
                Workspace
              </span>
            </div>
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className={`text-sm font-medium tracking-[0.03em] transition-colors duration-200 ${textSecondary} ${hoverText}`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className={`group inline-flex h-11 w-11 items-center justify-center rounded-2xl border transition-all duration-300 ${isDark
                  ? 'border-white/10 bg-white/5 text-slate-200 hover:border-cyan-300/40 hover:bg-cyan-400/10 hover:text-cyan-200'
                  : 'border-slate-200 bg-white/80 text-slate-700 hover:border-sky-300 hover:bg-sky-50 hover:text-sky-700'
                }`}
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

            <Link
              href="/login"
              className={`hidden text-sm font-medium transition-colors duration-200 md:inline-flex ${textSecondary} ${hoverText}`}
            >
              Sign In
            </Link>

            <Link
              href="/signup"
              className="hidden rounded-2xl bg-cyan-400 px-5 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-slate-950 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_45px_rgba(34,211,238,0.28)] sm:inline-flex"
            >
              Get Started
            </Link>

            <button
              type="button"
              onClick={() => setMenuOpen((current) => !current)}
              aria-label="Toggle menu"
              className={`inline-flex h-11 w-11 items-center justify-center rounded-2xl border transition-colors duration-300 md:hidden ${isDark
                  ? 'border-white/10 bg-white/5 text-slate-100 hover:border-cyan-300/40 hover:bg-cyan-400/10'
                  : 'border-slate-200 bg-white/80 text-slate-900 hover:border-sky-300 hover:bg-sky-50'
                }`}
            >
              <div className="relative h-4 w-5">
                <span
                  className={`absolute left-0 top-0 block h-0.5 w-5 rounded-full transition-all duration-300 ${isDark ? 'bg-slate-100' : 'bg-slate-900'
                    } ${menuOpen ? 'translate-y-[7px] rotate-45' : ''}`}
                />
                <span
                  className={`absolute left-0 top-[7px] block h-0.5 w-5 rounded-full transition-all duration-300 ${isDark ? 'bg-slate-100' : 'bg-slate-900'
                    } ${menuOpen ? 'opacity-0' : 'opacity-100'}`}
                />
                <span
                  className={`absolute left-0 top-[14px] block h-0.5 w-5 rounded-full transition-all duration-300 ${isDark ? 'bg-slate-100' : 'bg-slate-900'
                    } ${menuOpen ? '-translate-y-[7px] -rotate-45' : ''}`}
                />
              </div>
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className={`border-t px-4 pb-4 pt-3 md:hidden sm:px-6 ${divider}`}>
            <div className="flex flex-col gap-2">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className={`rounded-2xl px-4 py-3 text-sm font-medium transition-all duration-200 ${isDark
                      ? 'text-slate-200 hover:bg-white/5 hover:text-cyan-300'
                      : 'text-slate-700 hover:bg-slate-100 hover:text-sky-700'
                    }`}
                >
                  {link.label}
                </Link>
              ))}

              <div className={`my-2 border-t ${divider}`} />

              <Link
                href="/login"
                onClick={() => setMenuOpen(false)}
                className={`rounded-2xl px-4 py-3 text-sm font-medium transition-all duration-200 ${isDark
                    ? 'text-slate-200 hover:bg-white/5 hover:text-cyan-300'
                    : 'text-slate-700 hover:bg-slate-100 hover:text-sky-700'
                  }`}
              >
                Sign In
              </Link>

              <Link
                href="/signup"
                onClick={() => setMenuOpen(false)}
                className="mt-1 inline-flex justify-center rounded-2xl bg-cyan-400 px-5 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-slate-950 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_45px_rgba(34,211,238,0.28)]"
              >
                Get Started
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
