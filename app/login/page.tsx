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
      // Both user and admin login go through the same auth-service login endpoint.
      // The auth-service returns a role field in the response; we use it to redirect.
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'login', email: form.email, password: form.password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Login failed');

      // Validate that the returned role matches what the user selected
      if (data.role !== role) {
        throw new Error(
          role === 'admin'
            ? 'Access denied. This account does not have admin privileges.'
            : 'Please use the Admin login for this account.'
        );
      }

      // Persist auth data
      localStorage.setItem('token', data.token);
      localStorage.setItem('role', data.role);
      localStorage.setItem('name', data.name);
      localStorage.setItem('email', data.email);

      // Route based on role
      window.location.href = data.role === 'admin' ? '/admin' : '/dashboard';
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const isAdmin = role === 'admin';

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--bg-primary)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Grid bg */}
      <div className="grid-bg" style={{ position: 'absolute', inset: 0, opacity: 0.5 }} />
      {/* Glow */}
      <div
        style={{
          position: 'absolute',
          top: '30%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '600px',
          height: '300px',
          background: isAdmin
            ? 'radial-gradient(ellipse, rgba(129,140,248,0.1) 0%, transparent 70%)'
            : 'radial-gradient(ellipse, rgba(34,211,238,0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
          transition: 'background 0.4s',
        }}
      />

      <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: '420px' }}>
        {/* Logo */}
        <Link
          href="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            textDecoration: 'none',
            marginBottom: '2.5rem',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              width: '30px',
              height: '30px',
              background: 'linear-gradient(135deg, #22D3EE, #818CF8)',
              clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
            }}
          />
          <span
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 800,
              fontSize: '1.3rem',
              letterSpacing: '0.06em',
              color: 'var(--text-primary)',
            }}
          >
            TaskMaster
          </span>
        </Link>

        {/* Card */}
        <div
          className="glass-card"
          style={{ borderRadius: '8px', padding: '2.5rem', background: 'rgba(13,14,26,0.85)' }}
        >
          {/* Role toggle */}
          <div
            style={{
              display: 'flex',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '6px',
              padding: '3px',
              marginBottom: '2rem',
            }}
          >
            {(['user', 'admin'] as Role[]).map((r) => (
              <button
                key={r}
                onClick={() => { setRole(r); setError(''); }}
                style={{
                  flex: 1,
                  padding: '8px',
                  border: 'none',
                  borderRadius: '4px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  background:
                    role === r
                      ? r === 'admin'
                        ? 'linear-gradient(135deg, rgba(129,140,248,0.25), rgba(129,140,248,0.1))'
                        : 'linear-gradient(135deg, rgba(34,211,238,0.25), rgba(34,211,238,0.1))'
                      : 'transparent',
                  color:
                    role === r
                      ? r === 'admin'
                        ? '#818CF8'
                        : '#22D3EE'
                      : 'var(--text-muted)',
                  boxShadow:
                    role === r
                      ? r === 'admin'
                        ? '0 0 12px rgba(129,140,248,0.15)'
                        : '0 0 12px rgba(34,211,238,0.12)'
                      : 'none',
                }}
              >
                {r === 'admin' ? '⬡ Admin' : '◈ User'}
              </button>
            ))}
          </div>

          {/* Heading */}
          <div style={{ marginBottom: '2rem' }}>
            <h1
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 800,
                fontSize: '1.6rem',
                color: 'var(--text-primary)',
                letterSpacing: '-0.01em',
                marginBottom: '0.4rem',
              }}
            >
              {isAdmin ? 'Admin access' : 'Welcome back'}
            </h1>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              {isAdmin ? 'Sign in with your administrator credentials' : 'Sign in to your workspace'}
            </p>
          </div>

          {/* Error */}
          {error && (
            <div
              style={{
                padding: '10px 14px',
                background: 'rgba(239,68,68,0.08)',
                border: '1px solid rgba(239,68,68,0.25)',
                borderRadius: '4px',
                marginBottom: '1.25rem',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                color: '#F87171',
                letterSpacing: '0.04em',
              }}
            >
              {error}
            </div>
          )}

          {/* Email */}
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={labelStyle}>Email address</label>
            <input
              type="email"
              placeholder={isAdmin ? 'admin@company.com' : 'you@company.com'}
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              style={inputStyle}
              onFocus={(e) =>
                (e.currentTarget.style.borderColor = isAdmin
                  ? 'rgba(129,140,248,0.5)'
                  : 'rgba(34,211,238,0.5)')
              }
              onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)')}
            />
          </div>

          {/* Password */}
          <div style={{ marginBottom: '0.75rem' }}>
            <label style={labelStyle}>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              style={inputStyle}
              onFocus={(e) =>
                (e.currentTarget.style.borderColor = isAdmin
                  ? 'rgba(129,140,248,0.5)'
                  : 'rgba(34,211,238,0.5)')
              }
              onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)')}
            />
          </div>

          {/* Forgot password (user only) */}
          {!isAdmin && (
            <div style={{ textAlign: 'right', marginBottom: '1.75rem' }}>
              <Link
                href="/forgot-password"
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.8rem',
                  color: 'var(--accent-cyan)',
                  textDecoration: 'none',
                  opacity: 0.8,
                }}
              >
                Forgot password?
              </Link>
            </div>
          )}

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{
              width: '100%',
              marginTop: isAdmin ? '1.75rem' : '0',
              padding: '12px',
              background: loading
                ? 'rgba(34,211,238,0.4)'
                : isAdmin
                ? 'linear-gradient(135deg, #818CF8, #6366F1)'
                : 'var(--accent-cyan)',
              border: 'none',
              borderRadius: '4px',
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              fontSize: '0.9rem',
              letterSpacing: '0.05em',
              color: isAdmin ? '#fff' : '#07080F',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'opacity 0.2s, transform 0.2s',
              boxShadow: isAdmin ? '0 0 20px rgba(129,140,248,0.2)' : '0 0 20px rgba(34,211,238,0.12)',
            }}
            onMouseEnter={(e) => { if (!loading) e.currentTarget.style.opacity = '0.88'; }}
            onMouseLeave={(e) => { e.currentTarget.style.opacity = '1'; }}
          >
            {loading ? 'Signing in…' : isAdmin ? 'Sign In as Admin' : 'Sign In'}
          </button>

          {/* Divider + Sign-up (user only) */}
          {!isAdmin && (
            <>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  margin: '1.75rem 0',
                }}
              >
                <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.07)' }} />
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--text-muted)', letterSpacing: '0.1em' }}>
                  OR
                </span>
                <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.07)' }} />
              </div>

              <p style={{ textAlign: 'center', fontFamily: 'var(--font-body)', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                Don&apos;t have an account?{' '}
                <Link href="/signup" style={{ color: 'var(--accent-cyan)', textDecoration: 'none', fontWeight: 600 }}>
                  Create one
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontFamily: 'var(--font-mono)',
  fontSize: '0.7rem',
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  color: 'var(--text-secondary)',
  marginBottom: '6px',
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px 14px',
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '4px',
  fontFamily: 'var(--font-body)',
  fontSize: '0.9rem',
  color: 'var(--text-primary)',
  outline: 'none',
  transition: 'border-color 0.2s',
};
