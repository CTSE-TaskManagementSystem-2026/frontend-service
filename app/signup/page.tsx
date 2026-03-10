'use client';

import { useState } from 'react';
import Link from 'next/link';
import { NextResponse } from 'next/server';

// Shared field classes resolved via scoped style block
const labelCls = 'auth-label';
const inputCls = 'auth-input';

const AUTH_SERVICE_BASE = process.env.NEXT_PUBLIC_AUTH_SERVICE_URL ?? 'http://localhost:3001/api/auth';

export default function SignupPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const update = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password || !form.confirmPassword) { setError('All fields are required.'); return; }
    if (form.password !== form.confirmPassword) { setError('Passwords do not match.'); return; }
    if (form.password.length < 8) { setError('Password must be at least 8 characters.'); return; }
    setError(''); setLoading(true);
    try {
      const res = await fetch(`${AUTH_SERVICE_BASE}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.name, email: form.email, password: form.password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || 'Registration failed');
        return;
      }
      window.location.href = '/login';
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const strength = (() => {
    const p = form.password; if (!p) return 0;
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
        .signup-submit-btn {
          width: 100%;
          padding: 0.75rem;
          background: #22D3EE;
          border: none;
          border-radius: 4px;
          font-family: 'Syne', sans-serif;
          font-weight: 700;
          font-size: 0.9rem;
          letter-spacing: 0.05em;
          color: #07080F;
          cursor: pointer;
          transition: opacity 0.2s ease;
        }
        .signup-submit-btn:hover    { opacity: 0.9; }
        .signup-submit-btn:disabled { opacity: 0.5; cursor: not-allowed; }

        /* ── Divider ── */
        .auth-divider {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin: 1.5rem 0;
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

        /* ── Footer links ── */
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
        .auth-terms-text {
          text-align: center;
          font-family: 'Manrope', sans-serif;
          font-size: 0.8rem;
          color: #475569;
          margin-top: 1.5rem;
        }
        .auth-terms-link {
          color: #22D3EE;
          text-decoration: none;
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

        {/* Glow blob */}
        <div
          style={{
            position: 'absolute',
            top: '30%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '600px',
            height: '300px',
            pointerEvents: 'none',
            background: 'radial-gradient(ellipse, rgba(129,140,248,0.08) 0%, transparent 70%)',
          }}
        />

        <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: '460px' }}>
          {/* Logo */}
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', textDecoration: 'none', marginBottom: '2.5rem', justifyContent: 'center' }}>
            <div style={{ width: '30px', height: '30px', background: 'linear-gradient(135deg, #22D3EE, #818CF8)', clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }} />
            <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '1.3rem', letterSpacing: '0.06em', color: '#F1F5F9' }}>TaskMaster</span>
          </Link>

          {/* Card */}
          <div className="glass-card" style={{ borderRadius: '8px', padding: '2.5rem', background: 'rgba(13,14,26,0.85)' }}>
            {/* Heading */}
            <div style={{ marginBottom: '2rem' }}>
              <h1 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '1.6rem', color: '#F1F5F9', letterSpacing: '-0.01em', marginBottom: '0.375rem' }}>
                Create account
              </h1>
              <p style={{ fontFamily: 'Manrope, sans-serif', fontSize: '0.875rem', color: '#94A3B8' }}>
                Start managing projects in minutes
              </p>
            </div>

            {/* Error */}
            {error && <div className="auth-error">{error}</div>}

            {/* Name */}
            <div style={{ marginBottom: '1rem' }}>
              <label className={labelCls}>Full name</label>
              <input type="text" placeholder="Jane Smith" value={form.name} onChange={update('name')} className={inputCls} />
            </div>

            {/* Email */}
            <div style={{ marginBottom: '1rem' }}>
              <label className={labelCls}>Work email</label>
              <input type="email" placeholder="jane@company.com" value={form.email} onChange={update('email')} className={inputCls} />
            </div>

            {/* Password */}
            <div style={{ marginBottom: form.password ? '0.5rem' : '1rem' }}>
              <label className={labelCls}>Password</label>
              <input type="password" placeholder="Min. 8 characters" value={form.password} onChange={update('password')} className={inputCls} />
            </div>

            {/* Password strength */}
            {form.password && (
              <div style={{ marginBottom: '1rem' }}>
                <div style={{ display: 'flex', gap: '4px', marginBottom: '4px' }}>
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      style={{
                        flex: 1,
                        height: '3px',
                        borderRadius: '2px',
                        transition: 'background 0.3s ease',
                        background: i <= strength ? strengthColor : 'rgba(255,255,255,0.08)',
                      }}
                    />
                  ))}
                </div>
                <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.65rem', letterSpacing: '0.08em', color: strengthColor }}>
                  {strengthLabel}
                </span>
              </div>
            )}

            {/* Confirm password */}
            <div style={{ marginBottom: '1.75rem' }}>
              <label className={labelCls}>Confirm password</label>
              <input type="password" placeholder="Repeat password" value={form.confirmPassword} onChange={update('confirmPassword')} className={inputCls} />
            </div>

            {/* Submit */}
            <button onClick={handleSubmit} disabled={loading} className="signup-submit-btn">
              {loading ? 'Creating account…' : 'Create Account'}
            </button>

            {/* Terms */}
            <p className="auth-terms-text">
              By signing up you agree to our{' '}
              <Link href="/terms" className="auth-terms-link">Terms</Link>
              {' '}and{' '}
              <Link href="/privacy" className="auth-terms-link">Privacy Policy</Link>
            </p>

            {/* Divider */}
            <div className="auth-divider">
              <div className="auth-divider-line" />
              <span className="auth-divider-text">OR</span>
              <div className="auth-divider-line" />
            </div>

            {/* Sign in link */}
            <p className="auth-footer-text">
              Already have an account?{' '}
              <Link href="/login" className="auth-footer-link">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}