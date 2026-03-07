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
      const res = await fetch(`${process.env.NEXT_PUBLIC_AUTH_SERVICE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.name, email: form.email, password: form.password }),
      });
      if (!res.ok) throw new Error((await res.json()).message || 'Registration failed');
      window.location.href = '/login';
    } catch (err: any) {
      setError(err.message);
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
      <div className="grid-bg" style={{ position: 'absolute', inset: 0, opacity: 0.5 }} />
      <div
        style={{
          position: 'absolute',
          top: '30%',
          left: '50%',
          transform: 'translate(-50%,-50%)',
          width: '600px',
          height: '300px',
          background: 'radial-gradient(ellipse, rgba(129,140,248,0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: '460px' }}>
        {/* Logo */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', marginBottom: '2.5rem', justifyContent: 'center' }}>
          <div style={{ width: '30px', height: '30px', background: 'linear-gradient(135deg, #22D3EE, #818CF8)', clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }} />
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.3rem', letterSpacing: '0.06em', color: 'var(--text-primary)' }}>NEXUS</span>
        </Link>

        <div className="glass-card" style={{ borderRadius: '8px', padding: '2.5rem', background: 'rgba(13,14,26,0.85)' }}>
          <div style={{ marginBottom: '2rem' }}>
            <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.6rem', color: 'var(--text-primary)', letterSpacing: '-0.01em', marginBottom: '0.4rem' }}>
              Create account
            </h1>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              Start managing projects in minutes
            </p>
          </div>

          {error && (
            <div style={{ padding: '10px 14px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: '4px', marginBottom: '1.25rem', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#F87171', letterSpacing: '0.04em' }}>
              {error}
            </div>
          )}

          {/* Full name */}
          <div style={{ marginBottom: '1.1rem' }}>
            <label style={labelStyle}>Full name</label>
            <input type="text" placeholder="Jane Smith" value={form.name} onChange={update('name')} style={inputStyle}
              onFocus={(e) => (e.currentTarget.style.borderColor = 'rgba(34,211,238,0.5)')}
              onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)')} />
          </div>

          {/* Email */}
          <div style={{ marginBottom: '1.1rem' }}>
            <label style={labelStyle}>Work email</label>
            <input type="email" placeholder="jane@company.com" value={form.email} onChange={update('email')} style={inputStyle}
              onFocus={(e) => (e.currentTarget.style.borderColor = 'rgba(34,211,238,0.5)')}
              onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)')} />
          </div>

          {/* Password */}
          <div style={{ marginBottom: form.password ? '0.5rem' : '1.1rem' }}>
            <label style={labelStyle}>Password</label>
            <input type="password" placeholder="Min. 8 characters" value={form.password} onChange={update('password')} style={inputStyle}
              onFocus={(e) => (e.currentTarget.style.borderColor = 'rgba(34,211,238,0.5)')}
              onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)')} />
          </div>

          {/* Password strength */}
          {form.password && (
            <div style={{ marginBottom: '1.1rem' }}>
              <div style={{ display: 'flex', gap: '4px', marginBottom: '4px' }}>
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} style={{ flex: 1, height: '3px', borderRadius: '2px', background: i <= strength ? strengthColor : 'rgba(255,255,255,0.08)', transition: 'background 0.3s' }} />
                ))}
              </div>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: strengthColor, letterSpacing: '0.08em' }}>{strengthLabel}</span>
            </div>
          )}

          {/* Confirm password */}
          <div style={{ marginBottom: '1.75rem' }}>
            <label style={labelStyle}>Confirm password</label>
            <input type="password" placeholder="Repeat password" value={form.confirmPassword} onChange={update('confirmPassword')} style={inputStyle}
              onFocus={(e) => (e.currentTarget.style.borderColor = 'rgba(34,211,238,0.5)')}
              onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)')} />
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{ width: '100%', padding: '12px', background: loading ? 'rgba(34,211,238,0.5)' : 'var(--accent-cyan)', border: 'none', borderRadius: '4px', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.9rem', letterSpacing: '0.05em', color: '#07080F', cursor: loading ? 'not-allowed' : 'pointer', transition: 'opacity 0.2s' }}
            onMouseEnter={(e) => { if (!loading) e.currentTarget.style.opacity = '0.88'; }}
            onMouseLeave={(e) => { e.currentTarget.style.opacity = '1'; }}
          >
            {loading ? 'Creating account…' : 'Create Account'}
          </button>

          <p style={{ textAlign: 'center', fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '1.5rem' }}>
            By signing up you agree to our{' '}
            <Link href="/terms" style={{ color: 'var(--accent-cyan)', textDecoration: 'none' }}>Terms</Link>
            {' '}and{' '}
            <Link href="/privacy" style={{ color: 'var(--accent-cyan)', textDecoration: 'none' }}>Privacy Policy</Link>
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', margin: '1.5rem 0' }}>
            <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.07)' }} />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--text-muted)', letterSpacing: '0.1em' }}>OR</span>
            <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.07)' }} />
          </div>

          <p style={{ textAlign: 'center', fontFamily: 'var(--font-body)', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            Already have an account?{' '}
            <Link href="/login" style={{ color: 'var(--accent-cyan)', textDecoration: 'none', fontWeight: 600 }}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.7rem',
  letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '6px',
};
const inputStyle: React.CSSProperties = {
  width: '100%', padding: '10px 14px', background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.1)', borderRadius: '4px',
  fontFamily: 'var(--font-body)', fontSize: '0.9rem', color: 'var(--text-primary)',
  outline: 'none', transition: 'border-color 0.2s',
};
