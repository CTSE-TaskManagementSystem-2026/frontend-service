'use client';

import { useState } from 'react';
import Link from 'next/link';

type Role = 'user' | 'admin';

export default function LoginPage() {
  const [role, setRole] = useState<Role>('user');
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      setError('Please fill in all fields.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const res = await fetch('/frontend-api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email, password: form.password }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || 'Login failed');

      if (data.role !== role) {
        throw new Error(
          role === 'admin'
            ? 'Access denied. This account does not have admin privileges.'
            : 'Please use the Admin login for this account.'
        );
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('role', data.role);
      localStorage.setItem('name', data.name);
      localStorage.setItem('email', data.email);

      window.location.href = data.role === 'admin' ? '/admin' : '/dashboard';
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const isAdmin = role === 'admin';

  return (
    <div className="relative min-h-screen overflow-hidden bg-[color:var(--color-bg-primary)] text-[color:var(--color-text-primary)]">
      <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(148,163,184,0.35)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.35)_1px,transparent_1px)] [background-size:42px_42px]" />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.10),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(129,140,248,0.12),transparent_26%)]" />

      <div
        className={`pointer-events-none absolute left-1/2 top-[26%] h-[220px] w-[380px] -translate-x-1/2 rounded-full blur-3xl transition-all duration-500 sm:top-[28%] sm:h-[320px] sm:w-[620px] ${isAdmin ? 'bg-violet-500/15' : 'bg-cyan-400/15'
          }`}
      />

      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-8 sm:px-6 sm:py-12">
        <div className="w-full max-w-[440px]">
          <Link
            href="/"
            className="mb-8 flex items-center justify-center gap-3 sm:mb-10"
          >
            <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl border border-cyan-400/20 bg-gradient-to-br from-cyan-400/20 via-sky-400/10 to-violet-500/20">
              <div className="h-6 w-6 bg-gradient-to-br from-cyan-300 via-sky-400 to-violet-500 [clip-path:polygon(50%_0%,100%_25%,100%_75%,50%_100%,0%_75%,0%_25%)]" />
            </div>

            <span className="text-xl font-extrabold tracking-[0.08em] text-[color:var(--color-text-primary)]">
              TaskMaster
            </span>
          </Link>

          <div className="overflow-hidden rounded-[30px] border border-[color:var(--color-border)] bg-[color:var(--color-bg-card)]/90 p-5 shadow-[0_30px_80px_rgba(15,23,42,0.18)] backdrop-blur-2xl sm:p-8">
            <div className="mb-6 rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-bg-secondary)] p-1 sm:mb-8">
              <div className="grid grid-cols-2 gap-1">
                {(['user', 'admin'] as Role[]).map((r) => {
                  const active = role === r;
                  return (
                    <button
                      key={r}
                      onClick={() => {
                        setRole(r);
                        setError('');
                      }}
                      className={`rounded-xl px-4 py-3 text-xs font-semibold uppercase tracking-[0.18em] transition-all duration-300 ${active
                          ? r === 'admin'
                            ? 'bg-violet-500/15 text-violet-300 shadow-[0_0_20px_rgba(139,92,246,0.18)]'
                            : 'bg-cyan-400/15 text-cyan-300 shadow-[0_0_20px_rgba(34,211,238,0.14)]'
                          : 'text-[color:var(--color-text-muted)] hover:text-[color:var(--color-text-secondary)]'
                        }`}
                    >
                      {r === 'admin' ? '⬡ Admin' : '◈ User'}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mb-6 sm:mb-8">
              <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-[color:var(--color-border-accent)] bg-[color:var(--color-bg-secondary)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[color:var(--color-accent-cyan)]">
                <span className="h-2 w-2 rounded-full bg-[color:var(--color-accent-cyan)]" />
                {isAdmin ? 'Administrator access' : 'Workspace login'}
              </p>

              <h1 className="text-2xl font-extrabold tracking-[-0.03em] text-[color:var(--color-text-primary)] sm:text-3xl">
                {isAdmin ? 'Admin access' : 'Welcome back'}
              </h1>

              <p className="mt-2 text-sm leading-7 text-[color:var(--color-text-secondary)]">
                {isAdmin
                  ? 'Sign in with your administrator credentials'
                  : 'Sign in to your workspace'}
              </p>
            </div>

            {error && (
              <div className="mb-6 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-xs font-medium tracking-[0.04em] text-red-300">
                {error}
              </div>
            )}

            <div className="space-y-5">
              <div>
                <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.2em] text-[color:var(--color-text-muted)]">
                  Email address
                </label>
                <input
                  type="email"
                  placeholder={isAdmin ? 'admin@company.com' : 'you@company.com'}
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-bg-secondary)] px-4 py-3 text-sm text-[color:var(--color-text-primary)] outline-none transition duration-200 placeholder:text-[color:var(--color-text-muted)] focus:border-[color:var(--color-border-accent)]"
                />
              </div>

              <div>
                <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.2em] text-[color:var(--color-text-muted)]">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-bg-secondary)] px-4 py-3 text-sm text-[color:var(--color-text-primary)] outline-none transition duration-200 placeholder:text-[color:var(--color-text-muted)] focus:border-[color:var(--color-border-accent)]"
                />
              </div>
            </div>

            {!isAdmin && (
              <div className="mt-4 text-right">
                <Link
                  href="/forgot-password"
                  className="text-sm font-medium text-[color:var(--color-accent-cyan)] transition-opacity duration-200 hover:opacity-80"
                >
                  Forgot password?
                </Link>
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={loading}
              className={`mt-7 w-full rounded-2xl px-4 py-3.5 text-sm font-semibold uppercase tracking-[0.16em] transition duration-300 ${isAdmin
                  ? 'bg-gradient-to-r from-violet-500 to-indigo-500 text-white hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(99,102,241,0.28)]'
                  : 'bg-cyan-400 text-slate-950 hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(34,211,238,0.24)]'
                } disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0`}
            >
              {loading ? 'Signing in…' : isAdmin ? 'Sign In as Admin' : 'Sign In'}
            </button>

            {!isAdmin && (
              <>
                <div className="my-7 flex items-center gap-4">
                  <div className="h-px flex-1 bg-[color:var(--color-border)]" />
                  <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[color:var(--color-text-muted)]">
                    OR
                  </span>
                  <div className="h-px flex-1 bg-[color:var(--color-border)]" />
                </div>

                <p className="text-center text-sm text-[color:var(--color-text-secondary)]">
                  Don&apos;t have an account?{' '}
                  <Link
                    href="/signup"
                    className="font-semibold text-[color:var(--color-accent-cyan)]"
                  >
                    Create one
                  </Link>
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
