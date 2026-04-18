'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function SignupPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const update = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e: React.MouseEvent) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.password || !form.confirmPassword) {
      setError('All fields are required.');
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (form.password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const res = await fetch('/frontend-api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Registration failed');
        return;
      }

      window.location.href = '/login';
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const strength = (() => {
    const p = form.password;
    if (!p) return 0;

    let s = 0;
    if (p.length >= 8) s++;
    if (/[A-Z]/.test(p)) s++;
    if (/[0-9]/.test(p)) s++;
    if (/[^A-Za-z0-9]/.test(p)) s++;
    return s;
  })();

  const strengthColor = ['transparent', '#EF4444', '#F59E0B', '#22D3EE', '#34D399'][strength];
  const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong'][strength];

  return (
    <div className="relative min-h-screen overflow-hidden bg-[color:var(--color-bg-primary)] text-[color:var(--color-text-primary)]">
      <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(148,163,184,0.35)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.35)_1px,transparent_1px)] [background-size:42px_42px]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(129,140,248,0.12),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(34,211,238,0.10),transparent_26%)]" />
      <div className="pointer-events-none absolute left-1/2 top-[26%] h-[220px] w-[380px] -translate-x-1/2 rounded-full bg-violet-500/15 blur-3xl sm:top-[28%] sm:h-[320px] sm:w-[620px]" />

      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-8 sm:px-6 sm:py-12">
        <div className="w-full max-w-[460px]">
          <Link href="/" className="mb-8 flex items-center justify-center gap-3 sm:mb-10">
            <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl border border-cyan-400/20 bg-gradient-to-br from-cyan-400/20 via-sky-400/10 to-violet-500/20">
              <div className="h-6 w-6 bg-gradient-to-br from-cyan-300 via-sky-400 to-violet-500 [clip-path:polygon(50%_0%,100%_25%,100%_75%,50%_100%,0%_75%,0%_25%)]" />
            </div>

            <span className="text-xl font-extrabold tracking-[0.08em] text-[color:var(--color-text-primary)]">
              TaskMaster
            </span>
          </Link>

          <div className="overflow-hidden rounded-[30px] border border-[color:var(--color-border)] bg-[color:var(--color-bg-card)]/90 p-5 shadow-[0_30px_80px_rgba(15,23,42,0.18)] backdrop-blur-2xl sm:p-8">
            <div className="mb-6 sm:mb-8">
              <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-[color:var(--color-border-accent)] bg-[color:var(--color-bg-secondary)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[color:var(--color-accent-cyan)]">
                <span className="h-2 w-2 rounded-full bg-[color:var(--color-accent-cyan)]" />
                Create workspace account
              </p>

              <h1 className="text-2xl font-extrabold tracking-[-0.03em] text-[color:var(--color-text-primary)] sm:text-3xl">
                Create account
              </h1>

              <p className="mt-2 text-sm leading-7 text-[color:var(--color-text-secondary)]">
                Start managing projects in minutes
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
                  Full name
                </label>
                <input
                  type="text"
                  placeholder="Jane Smith"
                  value={form.name}
                  onChange={update('name')}
                  className="w-full rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-bg-secondary)] px-4 py-3 text-sm text-[color:var(--color-text-primary)] outline-none transition duration-200 placeholder:text-[color:var(--color-text-muted)] focus:border-[color:var(--color-border-accent)]"
                />
              </div>

              <div>
                <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.2em] text-[color:var(--color-text-muted)]">
                  Work email
                </label>
                <input
                  type="email"
                  placeholder="jane@company.com"
                  value={form.email}
                  onChange={update('email')}
                  className="w-full rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-bg-secondary)] px-4 py-3 text-sm text-[color:var(--color-text-primary)] outline-none transition duration-200 placeholder:text-[color:var(--color-text-muted)] focus:border-[color:var(--color-border-accent)]"
                />
              </div>

              <div>
                <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.2em] text-[color:var(--color-text-muted)]">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="Min. 8 characters"
                  value={form.password}
                  onChange={update('password')}
                  className="w-full rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-bg-secondary)] px-4 py-3 text-sm text-[color:var(--color-text-primary)] outline-none transition duration-200 placeholder:text-[color:var(--color-text-muted)] focus:border-[color:var(--color-border-accent)]"
                />
              </div>

              {form.password && (
                <div className="-mt-1">
                  <div className="mb-2 flex gap-1">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="h-1 flex-1 rounded-full transition-all duration-300"
                        style={{
                          background: i <= strength ? strengthColor : 'rgba(255,255,255,0.08)',
                        }}
                      />
                    ))}
                  </div>

                  <span
                    className="text-[11px] font-semibold uppercase tracking-[0.14em]"
                    style={{ color: strengthColor }}
                  >
                    {strengthLabel}
                  </span>
                </div>
              )}

              <div>
                <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.2em] text-[color:var(--color-text-muted)]">
                  Confirm password
                </label>
                <input
                  type="password"
                  placeholder="Repeat password"
                  value={form.confirmPassword}
                  onChange={update('confirmPassword')}
                  className="w-full rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-bg-secondary)] px-4 py-3 text-sm text-[color:var(--color-text-primary)] outline-none transition duration-200 placeholder:text-[color:var(--color-text-muted)] focus:border-[color:var(--color-border-accent)]"
                />
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="mt-7 w-full rounded-2xl bg-cyan-400 px-4 py-3.5 text-sm font-semibold uppercase tracking-[0.16em] text-slate-950 transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(34,211,238,0.24)] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
            >
              {loading ? 'Creating account…' : 'Create Account'}
            </button>

            <p className="mt-6 text-center text-sm leading-7 text-[color:var(--color-text-secondary)]">
              By signing up you agree to our{' '}
              <Link href="/terms" className="font-semibold text-[color:var(--color-accent-cyan)]">
                Terms
              </Link>{' '}
              and{' '}
              <Link href="/privacy" className="font-semibold text-[color:var(--color-accent-cyan)]">
                Privacy Policy
              </Link>
            </p>

            <div className="my-7 flex items-center gap-4">
              <div className="h-px flex-1 bg-[color:var(--color-border)]" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[color:var(--color-text-muted)]">
                OR
              </span>
              <div className="h-px flex-1 bg-[color:var(--color-border)]" />
            </div>

            <p className="text-center text-sm text-[color:var(--color-text-secondary)]">
              Already have an account?{' '}
              <Link href="/login" className="font-semibold text-[color:var(--color-accent-cyan)]">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
