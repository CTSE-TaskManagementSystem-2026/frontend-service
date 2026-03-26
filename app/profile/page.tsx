'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';

const TABS = ['Profile', 'Security'] as const;

function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<(typeof TABS)[number]>('Profile');
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    role: '',
    bio: '',
    timezone: 'UTC+5:30',
    avatar: '',
  });
  const [fetchLoading, setFetchLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');
  const [passwords, setPasswords] = useState({
    current: '',
    next: '',
    confirm: '',
  });
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [pwSaved, setPwSaved] = useState(false);
  const [pwError, setPwError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setFetchError('Not authenticated. Please log in.');
      setFetchLoading(false);
      return;
    }

    fetch('/frontend-api/auth/users', {
      method: 'GET',
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
      const res = await fetch('/frontend-api/auth/users', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: profile.name,
          email: profile.email,
          bio: profile.bio,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Update failed');

      localStorage.setItem('name', profile.name);
      localStorage.setItem('email', profile.email);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err: unknown) {
      setSaveError(err instanceof Error ? err.message : 'Update failed');
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
      const res = await fetch('/frontend-api/auth/users', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword: passwords.current,
          newPassword: passwords.next,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Password update failed');

      setPasswords({ current: '', next: '', confirm: '' });
      setPwSaved(true);
      setTimeout(() => setPwSaved(false), 2500);
    } catch (err: unknown) {
      setPwError(err instanceof Error ? err.message : 'Error');
    }
  };

  const roleLabel = profile.role ? profile.role.toUpperCase() : 'USER';

  return (
    <DashboardLayout title="Profile" subtitle="TASKMASTER / ACCOUNT SETTINGS">
      <div className="min-h-full bg-[color:var(--color-bg-primary)] text-[color:var(--color-text-primary)]">
        {fetchLoading && (
          <div className="rounded-[28px] border border-[color:var(--color-border)] bg-[color:var(--color-bg-card)] px-6 py-12 text-center text-xs font-semibold uppercase tracking-[0.22em] text-[color:var(--color-text-muted)] shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
            Loading profile…
          </div>
        )}

        {fetchError && (
          <div className="mb-6 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {fetchError}
          </div>
        )}

        {!fetchLoading && (
          <>
            <div className="mb-8 overflow-hidden rounded-[30px] border border-[color:var(--color-border)] bg-[color:var(--color-bg-card)] shadow-[0_24px_70px_rgba(15,23,42,0.08)]">
              <div className="h-24 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.22),transparent_38%),radial-gradient(circle_at_top_right,rgba(129,140,248,0.18),transparent_36%)]" />

              <div className="px-6 pb-6">
                <div className="-mt-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="flex h-20 w-20 items-center justify-center rounded-full border-4 border-[color:var(--color-bg-card)] bg-gradient-to-br from-cyan-400 via-sky-400 to-violet-500 text-xl font-extrabold text-slate-950 shadow-[0_18px_45px_rgba(34,211,238,0.22)]">
                        {profile.avatar}
                      </div>

                      <button
                        className="absolute bottom-0 right-0 inline-flex h-8 w-8 items-center justify-center rounded-full border border-cyan-300/30 bg-cyan-400 text-slate-950 shadow-sm transition duration-200 hover:scale-105"
                        aria-label="Edit avatar"
                      >
                        <svg
                          width="12"
                          height="12"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.2"
                          viewBox="0 0 24 24"
                        >
                          <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
                        </svg>
                      </button>
                    </div>

                    <div>
                      <h2 className="text-2xl font-extrabold tracking-[-0.02em] text-[color:var(--color-text-primary)]">
                        {profile.name || 'Unnamed User'}
                      </h2>
                      <p className="mt-1 text-sm text-[color:var(--color-text-secondary)]">
                        {profile.email}
                      </p>
                      <div className="mt-3 inline-flex items-center rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-300">
                        {roleLabel}
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-bg-secondary)] px-4 py-3">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[color:var(--color-text-muted)]">
                      Timezone
                    </p>
                    <p className="mt-1 text-sm font-medium text-[color:var(--color-text-primary)]">
                      {profile.timezone}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-6 flex gap-2 overflow-x-auto rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-bg-card)] p-2 shadow-[0_12px_40px_rgba(15,23,42,0.06)]">
              {TABS.map((tab) => {
                const active = activeTab === tab;

                return (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-200 ${active
                        ? 'bg-cyan-400 text-slate-950 shadow-[0_10px_25px_rgba(34,211,238,0.2)]'
                        : 'text-[color:var(--color-text-secondary)] hover:bg-[color:var(--color-bg-secondary)] hover:text-[color:var(--color-text-primary)]'
                      }`}
                  >
                    {tab}
                  </button>
                );
              })}
            </div>

            <div className="max-w-3xl">
              {activeTab === 'Profile' && (
                <div className="space-y-6 rounded-[30px] border border-[color:var(--color-border)] bg-[color:var(--color-bg-card)] p-6 shadow-[0_24px_70px_rgba(15,23,42,0.08)] sm:p-8">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[color:var(--color-text-muted)]">
                      Personal details
                    </p>
                    <h3 className="mt-2 text-2xl font-bold tracking-[-0.02em] text-[color:var(--color-text-primary)]">
                      Profile information
                    </h3>
                  </div>

                  {saved && (
                    <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
                      ✓ Changes saved successfully
                    </div>
                  )}

                  {saveError && (
                    <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                      {saveError}
                    </div>
                  )}

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.2em] text-[color:var(--color-text-muted)]">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={profile.name}
                        onChange={(e) =>
                          setProfile((p) => ({ ...p, name: e.target.value }))
                        }
                        className="w-full rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-bg-secondary)] px-4 py-3 text-sm text-[color:var(--color-text-primary)] outline-none transition duration-200 placeholder:text-[color:var(--color-text-muted)] focus:border-[color:var(--color-border-accent)]"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.2em] text-[color:var(--color-text-muted)]">
                        Email
                      </label>
                      <input
                        type="email"
                        value={profile.email}
                        onChange={(e) =>
                          setProfile((p) => ({ ...p, email: e.target.value }))
                        }
                        className="w-full rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-bg-secondary)] px-4 py-3 text-sm text-[color:var(--color-text-primary)] outline-none transition duration-200 placeholder:text-[color:var(--color-text-muted)] focus:border-[color:var(--color-border-accent)]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.2em] text-[color:var(--color-text-muted)]">
                      Bio
                    </label>
                    <textarea
                      value={profile.bio}
                      onChange={(e) =>
                        setProfile((p) => ({ ...p, bio: e.target.value }))
                      }
                      rows={4}
                      className="w-full rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-bg-secondary)] px-4 py-3 text-sm leading-7 text-[color:var(--color-text-primary)] outline-none transition duration-200 placeholder:text-[color:var(--color-text-muted)] focus:border-[color:var(--color-border-accent)]"
                    />
                  </div>

                  <button
                    onClick={handleSave}
                    className="inline-flex rounded-2xl bg-cyan-400 px-5 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-slate-950 transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(34,211,238,0.22)]"
                  >
                    Save Changes
                  </button>
                </div>
              )}

              {activeTab === 'Security' && (
                <div className="space-y-6 rounded-[30px] border border-[color:var(--color-border)] bg-[color:var(--color-bg-card)] p-6 shadow-[0_24px_70px_rgba(15,23,42,0.08)] sm:p-8">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[color:var(--color-text-muted)]">
                      Protection
                    </p>
                    <h3 className="mt-2 text-2xl font-bold tracking-[-0.02em] text-[color:var(--color-text-primary)]">
                      Change password
                    </h3>
                  </div>

                  {pwSaved && (
                    <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
                      ✓ Password updated successfully
                    </div>
                  )}

                  {pwError && (
                    <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                      {pwError}
                    </div>
                  )}

                  {(['current', 'next', 'confirm'] as const).map((field, i) => (
                    <div key={field}>
                      <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.2em] text-[color:var(--color-text-muted)]">
                        {['Current Password', 'New Password', 'Confirm New Password'][i]}
                      </label>
                      <input
                        type="password"
                        placeholder="••••••••"
                        value={passwords[field]}
                        onChange={(e) =>
                          setPasswords((p) => ({ ...p, [field]: e.target.value }))
                        }
                        className="w-full rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-bg-secondary)] px-4 py-3 text-sm text-[color:var(--color-text-primary)] outline-none transition duration-200 placeholder:text-[color:var(--color-text-muted)] focus:border-[color:var(--color-border-accent)]"
                      />
                    </div>
                  ))}

                  <button
                    onClick={handlePasswordChange}
                    className="inline-flex rounded-2xl bg-cyan-400 px-5 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-slate-950 transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(34,211,238,0.22)]"
                  >
                    Update Password
                  </button>

                  <div className="rounded-[24px] border border-red-500/20 bg-red-500/5 p-5">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-red-400">
                      Danger Zone
                    </p>
                    <p className="mt-3 text-sm leading-7 text-[color:var(--color-text-secondary)]">
                      Permanently delete your account and all associated data.
                    </p>
                    <button className="mt-4 inline-flex rounded-xl border border-red-500/30 px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.16em] text-red-400 transition duration-200 hover:bg-red-500/10">
                      Delete Account
                    </button>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}