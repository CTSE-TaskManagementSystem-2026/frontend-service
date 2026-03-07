'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';

const TABS = ['Profile', 'Security', 'Notifications', 'API Tokens'];

function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('Profile');
  const [profile, setProfile] = useState({ name: '', email: '', role: '', bio: '', timezone: 'UTC+5:30', avatar: '' });
  const [fetchLoading, setFetchLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');
  const [passwords, setPasswords] = useState({ current: '', next: '', confirm: '' });
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [pwSaved, setPwSaved] = useState(false);
  const [pwError, setPwError] = useState('');

  // Fetch real profile data on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setFetchError('Not authenticated. Please log in.');
      setFetchLoading(false);
      return;
    }
    fetch('/api/auth/profile', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data._id) {
          setProfile({
            name: data.name || '',
            email: data.email || '',
            role: data.role || '',
            bio: data.bio || '',
            timezone: data.timezone || 'UTC+5:30',
            avatar: getInitials(data.name || '?'),
          });
        } else {
          setFetchError(data.message || 'Failed to load profile');
        }
      })
      .catch(() => setFetchError('Network error fetching profile'))
      .finally(() => setFetchLoading(false));
  }, []);

  const handleSave = async () => {
    setSaveError('');
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const res = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name: profile.name, email: profile.email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Update failed');
      // Sync localStorage name
      localStorage.setItem('name', profile.name);
      localStorage.setItem('email', profile.email);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err: any) {
      setSaveError(err.message);
    }
  };

  const handlePasswordChange = async () => {
    setPwError('');
    if (!passwords.current || !passwords.next || !passwords.confirm) {
      setPwError('All password fields are required.');
      return;
    }
    if (passwords.next !== passwords.confirm) {
      setPwError('New passwords do not match.');
      return;
    }
    if (passwords.next.length < 8) {
      setPwError('New password must be at least 8 characters.');
      return;
    }
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const res = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ currentPassword: passwords.current, newPassword: passwords.next }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Password update failed');
      setPasswords({ current: '', next: '', confirm: '' });
      setPwSaved(true);
      setTimeout(() => setPwSaved(false), 2500);
    } catch (err: any) {
      setPwError(err.message);
    }
  };

  return (
    <DashboardLayout title="Profile" subtitle="TASKMASTER / ACCOUNT SETTINGS">
      {fetchLoading && (
        <div style={{ padding: '3rem', textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-muted)', letterSpacing: '0.1em' }}>LOADING PROFILE…</div>
      )}
      {fetchError && (
        <div style={{ padding: '10px 14px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: '4px', marginBottom: '1.5rem', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#F87171' }}>{fetchError}</div>
      )}
      {!fetchLoading && !fetchError && false && null /* gate below */}
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2rem', padding: '1.5rem', background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: '6px' }}>
        {/* Avatar */}
        <div style={{ position: 'relative' }}>
          <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'linear-gradient(135deg, #22D3EE, #818CF8)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.4rem', color: '#07080F', flexShrink: 0 }}>
            {profile.avatar}
          </div>
          <button style={{ position: 'absolute', bottom: 0, right: 0, width: '22px', height: '22px', borderRadius: '50%', background: 'var(--accent-cyan)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="10" height="10" fill="none" stroke="#07080F" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>
          </button>
        </div>
        <div style={{ flex: 1 }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.2rem', color: 'var(--text-primary)', marginBottom: '2px' }}>{profile.name}</h2>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '6px' }}>{profile.email}</div>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.08em', color: 'var(--accent-cyan)', background: 'rgba(34,211,238,0.08)', border: '1px solid rgba(34,211,238,0.2)', padding: '3px 8px', borderRadius: '2px' }}>{profile.role.toUpperCase()}</span>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0', borderBottom: '1px solid var(--border)', marginBottom: '1.75rem', overflowX: 'auto' }}>
        {TABS.map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            style={{ padding: '10px 20px', background: 'transparent', border: 'none', borderBottom: `2px solid ${activeTab === tab ? 'var(--accent-cyan)' : 'transparent'}`, fontFamily: 'var(--font-body)', fontWeight: activeTab === tab ? 600 : 400, fontSize: '0.875rem', color: activeTab === tab ? 'var(--text-primary)' : 'var(--text-secondary)', cursor: 'pointer', transition: 'all 0.2s', whiteSpace: 'nowrap', marginBottom: '-1px' }}>
            {tab}
          </button>
        ))}
      </div>

      <div style={{ maxWidth: '600px' }}>
        {/* Profile tab */}
        {activeTab === 'Profile' && (
          <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: '6px', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {saved && (
              <div style={{ padding: '10px 14px', background: 'rgba(52,211,153,0.08)', border: '1px solid rgba(52,211,153,0.25)', borderRadius: '4px', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#34D399', letterSpacing: '0.04em' }}>
                ✓ Changes saved successfully
              </div>
            )}
            {saveError && (
              <div style={{ padding: '10px 14px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: '4px', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#F87171', letterSpacing: '0.04em' }}>{saveError}</div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={labelStyle}>Full Name</label>
                <input type="text" value={profile.name} onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))} style={inputStyle}
                  onFocus={(e) => (e.currentTarget.style.borderColor = 'rgba(34,211,238,0.5)')}
                  onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)')} />
              </div>
              <div>
                <label style={labelStyle}>Email</label>
                <input type="email" value={profile.email} onChange={(e) => setProfile((p) => ({ ...p, email: e.target.value }))} style={inputStyle}
                  onFocus={(e) => (e.currentTarget.style.borderColor = 'rgba(34,211,238,0.5)')}
                  onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)')} />
              </div>
            </div>

            <div>
              <label style={labelStyle}>Bio</label>
              <textarea value={profile.bio} onChange={(e) => setProfile((p) => ({ ...p, bio: e.target.value }))} rows={3}
                style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6 }}
                onFocus={(e) => (e.currentTarget.style.borderColor = 'rgba(34,211,238,0.5)')}
                onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)')} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={labelStyle}>Role</label>
                <input type="text" value={profile.role} disabled style={{ ...inputStyle, opacity: 0.5, cursor: 'not-allowed' }} />
              </div>
              <div>
                <label style={labelStyle}>Timezone</label>
                <select value={profile.timezone} onChange={(e) => setProfile((p) => ({ ...p, timezone: e.target.value }))} style={{ ...inputStyle, cursor: 'pointer' }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = 'rgba(34,211,238,0.5)')}
                  onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)')}>
                  {['UTC-8', 'UTC-5', 'UTC+0', 'UTC+1', 'UTC+5:30', 'UTC+8', 'UTC+9'].map((tz) => <option key={tz} value={tz} style={{ background: '#0D0E1A' }}>{tz}</option>)}
                </select>
              </div>
            </div>

            <button onClick={handleSave} style={{ alignSelf: 'flex-start', padding: '10px 24px', background: 'var(--accent-cyan)', border: 'none', borderRadius: '4px', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.875rem', letterSpacing: '0.05em', color: '#07080F', cursor: 'pointer', transition: 'opacity 0.2s' }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.88')}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}>
              Save Changes
            </button>
          </div>
        )}

        {/* Security tab */}
        {activeTab === 'Security' && (
          <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: '6px', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)' }}>Change Password</h3>
            {pwSaved && (
              <div style={{ padding: '10px 14px', background: 'rgba(52,211,153,0.08)', border: '1px solid rgba(52,211,153,0.25)', borderRadius: '4px', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#34D399', letterSpacing: '0.04em' }}>✓ Password updated successfully</div>
            )}
            {pwError && (
              <div style={{ padding: '10px 14px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: '4px', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#F87171' }}>{pwError}</div>
            )}
            {['current', 'next', 'confirm'].map((field, i) => (
              <div key={field}>
                <label style={labelStyle}>{['Current Password', 'New Password', 'Confirm New Password'][i]}</label>
                <input type="password" placeholder="••••••••" value={(passwords as any)[field]} onChange={(e) => setPasswords((p) => ({ ...p, [field]: e.target.value }))} style={inputStyle}
                  onFocus={(e) => (e.currentTarget.style.borderColor = 'rgba(34,211,238,0.5)')}
                  onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)')} />
              </div>
            ))}
            <button onClick={handlePasswordChange} style={{ alignSelf: 'flex-start', padding: '10px 24px', background: 'var(--accent-cyan)', border: 'none', borderRadius: '4px', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.875rem', letterSpacing: '0.05em', color: '#07080F', cursor: 'pointer' }}>
              Update Password
            </button>

            {/* Danger zone */}
            <div style={{ marginTop: '1rem', padding: '1.25rem', background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '4px' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', letterSpacing: '0.1em', color: '#EF4444', marginBottom: '0.5rem' }}>DANGER ZONE</div>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>Permanently delete your account and all associated data.</p>
              <button style={{ padding: '8px 16px', background: 'transparent', border: '1px solid rgba(239,68,68,0.4)', borderRadius: '3px', fontFamily: 'var(--font-mono)', fontSize: '0.72rem', letterSpacing: '0.08em', color: '#EF4444', cursor: 'pointer' }}>
                DELETE ACCOUNT
              </button>
            </div>
          </div>
        )}

        {/* Notifications tab */}
        {activeTab === 'Notifications' && (
          <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: '6px', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '0' }}>
            {[
              { label: 'Task assigned to you', description: 'Get notified when someone assigns you a task', on: true },
              { label: 'Project updates', description: 'Changes to projects you are a member of', on: true },
              { label: 'Task due reminders', description: 'Reminder 24h before a task is due', on: false },
              { label: 'Weekly digest', description: 'Summary of your team\'s activity every Monday', on: true },
              { label: 'Security alerts', description: 'Login from a new device or location', on: true },
            ].map((item, i, arr) => (
              <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.125rem 0', borderBottom: i < arr.length - 1 ? '1px solid var(--border)' : 'none' }}>
                <div>
                  <div style={{ fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: '0.875rem', color: 'var(--text-primary)', marginBottom: '2px' }}>{item.label}</div>
                  <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.78rem', color: 'var(--text-muted)' }}>{item.description}</div>
                </div>
                {/* Toggle */}
                <div style={{ width: '40px', height: '22px', borderRadius: '11px', background: item.on ? 'var(--accent-cyan)' : 'rgba(255,255,255,0.1)', position: 'relative', cursor: 'pointer', flexShrink: 0, transition: 'background 0.2s' }}>
                  <div style={{ position: 'absolute', top: '3px', left: item.on ? '21px' : '3px', width: '16px', height: '16px', borderRadius: '50%', background: '#fff', transition: 'left 0.2s' }} />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* API Tokens tab */}
        {activeTab === 'API Tokens' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: '6px', padding: '1.5rem' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)', marginBottom: '1rem' }}>Generate New Token</h3>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <input type="text" placeholder="Token name (e.g. CI/CD pipeline)" style={{ ...inputStyle, flex: 1 }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = 'rgba(34,211,238,0.5)')}
                  onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)')} />
                <button style={{ padding: '10px 18px', background: 'var(--accent-cyan)', border: 'none', borderRadius: '4px', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.8rem', color: '#07080F', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                  Generate
                </button>
              </div>
            </div>

            {/* Existing tokens */}
            <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: '6px', overflow: 'hidden' }}>
              <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--border)' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Active Tokens</span>
              </div>
              {[
                { name: 'CI/CD Pipeline', created: 'Mar 1, 2025', lastUsed: '2h ago', prefix: 'nxs_a8f2…' },
                { name: 'Local Dev', created: 'Feb 14, 2025', lastUsed: '5m ago', prefix: 'nxs_c1d9…' },
              ].map((token, i, arr) => (
                <div key={token.name} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem 1.25rem', borderBottom: i < arr.length - 1 ? '1px solid var(--border)' : 'none' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: '0.875rem', color: 'var(--text-primary)', marginBottom: '2px' }}>{token.name}</div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--text-muted)' }}>{token.prefix} · Created {token.created} · Last used {token.lastUsed}</div>
                  </div>
                  <button style={{ padding: '6px 12px', background: 'transparent', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '3px', fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.06em', color: '#EF4444', cursor: 'pointer' }}>REVOKE</button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

const labelStyle: React.CSSProperties = { display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '6px' };
const inputStyle: React.CSSProperties = { width: '100%', padding: '10px 14px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '4px', fontFamily: 'var(--font-body)', fontSize: '0.875rem', color: 'var(--text-primary)', outline: 'none', transition: 'border-color 0.2s' };
