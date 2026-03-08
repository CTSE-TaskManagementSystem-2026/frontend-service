'use client';

import { useState } from 'react';
import Link from 'next/link';

type Role = 'user' | 'admin';

// Shared field classes — using standard CSS via a scoped style block below
const labelCls = 'auth-label';
const inputCls = 'auth-input';

export default function LoginPage() {
  const [role, setRole] = useState<Role>('user');
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!form.email || !form.password) { setError('Please fill in all fields.'); return; }
    setError(''); setLoading(true);
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'login', email: form.email, password: form.password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Login failed');
      if (data.role !== role) {
        throw new Error(role === 'admin' ? 'Access denied. This account does not have admin privileges.' : 'Please use the Admin login for this account.');
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
    <>
      <style>{`
        /* ── Auth shared tokens ── */
        .auth-label {
          display: block;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.7rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #94A3B8;
          margin-bottom: 0.375rem;
        }

        .auth-input {
          width: 100%;
          padding: 0.625rem 0.875rem;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 4px;
          font-family: 'Manrope', sans-serif;
          font-size: 0.9rem;
          color: #F1F5F9;
          outline: none;
          transition: border-color 0.2s ease;
        }
        .auth-input:focus {
          border-color: rgba(34, 211, 238, 0.5);
        }
        .auth-input::placeholder {
          color: #475569;
        }

        /* ── Login card ── */
        .login-logo-text {
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          font-size: 1.3rem;
          letter-spacing: 0.06em;
          color: #F1F5F9;
        }

        .login-heading {
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          font-size: 1.6rem;
          color: #F1F5F9;
          letter-spacing: -0.01em;
          margin-bottom: 0.375rem;
        }

        .login-subheading {
          font-family: 'Manrope', sans-serif;
          font-size: 0.875rem;
          color: #94A3B8;
        }

        /* ── Role toggle buttons ── */
        .role-toggle-btn {
          flex: 1;
          padding: 0.5rem;
          border-radius: 4px;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          cursor: pointer;
          border: none;
          transition: background 0.2s ease, color 0.2s ease, box-shadow 0.2s ease;
        }

        /* ── Error banner ── */
        .auth-error {
          padding: 0.625rem 0.875rem;
          background: rgba(239, 68, 68, 0.08);
          border: 1px solid rgba(239, 68, 68, 0.25);
          border-radius: 4px;
          margin-bottom: 1.25rem;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.75rem;
          color: #F87171;
          letter-spacing: 0.04em;
        }

        /* ── Submit button ── */
        .auth-submit-btn {
          width: 100%;
          margin-top: 1.75rem;
          padding: 0.75rem;
          border-radius: 4px;
          font-family: 'Syne', sans-serif;
          font-weight: 700;
          font-size: 0.9rem;
          letter-spacing: 0.05em;
          border: none;
          cursor: pointer;
          transition: opacity 0.2s ease;
        }
        .auth-submit-btn:hover   { opacity: 0.9; }
        .auth-submit-btn:disabled { cursor: not-allowed; }

        /* ── Forgot password link ── */
        .auth-forgot-link {
          font-family: 'Manrope', sans-serif;
          font-size: 0.8rem;
          color: #22D3EE;
          text-decoration: none;
          opacity: 0.8;
          transition: opacity 0.2s ease;
        }
        .auth-forgot-link:hover { opacity: 1; }

        /* ── Divider ── */
        .auth-divider {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin: 1.75rem 0;
        }
        .auth-divider-line {
          flex: 1;
          height: 1px;
          background: rgba(255, 255, 255, 0.07);
        }
        .auth-divider-text {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.68rem;
          color: #475569;
          letter-spacing: 0.1em;
        }

        /* ── Sign-up footer ── */
        .auth-footer-text {
          text-align: center;
          font-family: 'Manrope', sans-serif;
          font-size: 0.875rem;
          color: #94A3B8;
        }
        .auth-footer-link {
          color: #22D3EE;
          text-decoration: none;
          font-weight: 600;
        }
      `}</style>

      <div
        style={{
          minHeight: '100vh',
          backgroundColor: '#07080F',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Grid background */}
        <div className="grid-bg absolute inset-0 opacity-50" />

        {/* Glow blob — dynamic based on role */}
        <div
          style={{
            position: 'absolute',
            top: '30%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '600px',
            height: '300px',
            pointerEvents: 'none',
            transition: 'background 0.4s ease',
            background: isAdmin
              ? 'radial-gradient(ellipse, rgba(129,140,248,0.1) 0%, transparent 70%)'
              : 'radial-gradient(ellipse, rgba(34,211,238,0.08) 0%, transparent 70%)',
          }}
        />

        <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: '420px' }}>
          {/* Logo */}
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', textDecoration: 'none', marginBottom: '2.5rem', justifyContent: 'center' }}>
            <div style={{ width: '30px', height: '30px', background: 'linear-gradient(135deg, #22D3EE, #818CF8)', clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }} />
            <span className="login-logo-text">TaskMaster</span>
          </Link>

          {/* Card */}
          <div className="glass-card" style={{ borderRadius: '8px', padding: '2.5rem', background: 'rgba(13,14,26,0.85)' }}>
            {/* Role toggle */}
            <div style={{ display: 'flex', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '6px', padding: '3px', marginBottom: '2rem' }}>
              {(['user', 'admin'] as Role[]).map((r) => (
                <button
                  key={r}
                  onClick={() => { setRole(r); setError(''); }}
                  className="role-toggle-btn"
                  style={{
                    background: role === r
                      ? (r === 'admin' ? 'linear-gradient(135deg, rgba(129,140,248,0.25), rgba(129,140,248,0.1))' : 'linear-gradient(135deg, rgba(34,211,238,0.25), rgba(34,211,238,0.1))')
                      : 'transparent',
                    color: role === r ? (r === 'admin' ? '#818CF8' : '#22D3EE') : '#475569',
                    boxShadow: role === r ? (r === 'admin' ? '0 0 12px rgba(129,140,248,0.15)' : '0 0 12px rgba(34,211,238,0.12)') : 'none',
                  }}
                >
                  {r === 'admin' ? '⬡ Admin' : '◈ User'}
                </button>
              ))}
            </div>

            {/* Heading */}
            <div style={{ marginBottom: '2rem' }}>
              <h1 className="login-heading">{isAdmin ? 'Admin access' : 'Welcome back'}</h1>
              <p className="login-subheading">{isAdmin ? 'Sign in with your administrator credentials' : 'Sign in to your workspace'}</p>
            </div>

            {/* Error */}
            {error && <div className="auth-error">{error}</div>}

            {/* Email */}
            <div style={{ marginBottom: '1.25rem' }}>
              <label className={labelCls}>Email address</label>
              <input
                type="email"
                placeholder={isAdmin ? 'admin@company.com' : 'you@company.com'}
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className={inputCls}
              />
            </div>

            {/* Password */}
            <div style={{ marginBottom: isAdmin ? 0 : '0.75rem' }}>
              <label className={labelCls}>Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className={inputCls}
              />
            </div>

            {/* Forgot */}
            {!isAdmin && (
              <div style={{ textAlign: 'right', marginBottom: '1.75rem' }}>
                <Link href="/forgot-password" className="auth-forgot-link">Forgot password?</Link>
              </div>
            )}

            {/* Submit */}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="auth-submit-btn"
              style={{
                background: loading ? 'rgba(34,211,238,0.4)' : isAdmin ? 'linear-gradient(135deg, #818CF8, #6366F1)' : '#22D3EE',
                color: isAdmin ? '#fff' : '#07080F',
                boxShadow: isAdmin ? '0 0 20px rgba(129,140,248,0.2)' : '0 0 20px rgba(34,211,238,0.12)',
              }}
            >
              {loading ? 'Signing in…' : isAdmin ? 'Sign In as Admin' : 'Sign In'}
            </button>

            {/* Divider + Sign-up (user only) */}
            {!isAdmin && (
              <>
                <div className="auth-divider">
                  <div className="auth-divider-line" />
                  <span className="auth-divider-text">OR</span>
                  <div className="auth-divider-line" />
                </div>
                <p className="auth-footer-text">
                  Don&apos;t have an account?{' '}
                  <Link href="/signup" className="auth-footer-link">Create one</Link>
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}