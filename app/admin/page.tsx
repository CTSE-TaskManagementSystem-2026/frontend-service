'use client';

import { useState, useEffect, useCallback } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

type AdminSection = 'overview' | 'users' | 'projects' | 'tasks';

// ─── Types ────────────────────────────────────────────────────────────────────

// Real API user (from auth-service)
interface User {
  _id: string; name: string; email: string; role: string;
  createdAt?: string;
}

// Real project shape returned by projects-service
interface RealProject {
  _id: string;
  name: string;
  description?: string;
  active: boolean;
  status: 'active' | 'inactive' | 'archived' | 'completed';
  dueDate?: string;
  tasksCount: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatCard({ label, value, sub, color, icon }: { label: string; value: string; sub: string; color: string; icon: React.ReactNode }) {
  return (
    <div style={{ background: '#0A0B16', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '6px', padding: '1.5rem', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: color }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)' }}>{label}</div>
        <div style={{ color, lineHeight: 0, opacity: 0.7 }}>{icon}</div>
      </div>
      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '2.2rem', color: '#F1F5F9', letterSpacing: '-0.03em', lineHeight: 1, marginBottom: '0.4rem' }}>{value}</div>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color, letterSpacing: '0.04em' }}>{sub}</div>
    </div>
  );
}

function Badge({ text, color }: { text: string; color: string }) {
  return (
    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', letterSpacing: '0.08em', color, background: `${color}18`, border: `1px solid ${color}35`, padding: '2px 7px', borderRadius: '2px', whiteSpace: 'nowrap' }}>
      {text}
    </span>
  );
}

function Avatar({ initials, size = 28 }: { initials: string; size?: number }) {
  return (
    <div style={{ width: size, height: size, borderRadius: '50%', background: 'linear-gradient(135deg, #F59E0B, #F87171)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: size * 0.28 + 'px', color: '#07080F', flexShrink: 0 }}>
      {initials}
    </div>
  );
}

function SectionHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1.25rem' }}>
      <div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.1rem', color: '#F1F5F9', letterSpacing: '-0.01em' }}>{title}</h2>
        {subtitle && <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.08em', marginTop: '2px' }}>{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

// ─── Section: Overview ─────────────────────────────────────────────────────────────

function OverviewSection() {
  const [users, setUsers] = useState<User[]>([]);
  const [projects, setProjects] = useState<RealProject[]>([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [projectsLoading, setProjectsLoading] = useState(true);

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';
  const auth = `Bearer ${token}`;

  const roleColor: Record<string, string> = { admin: '#F59E0B', user: '#22D3EE', manager: '#818CF8' };
  const getInitials = (name: string) => name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
  const formatDate = (iso?: string) => iso ? new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—';

  useEffect(() => {
    fetch('/api/auth/user', { headers: { Authorization: auth } })
      .then((r) => r.json())
      .then((d) => setUsers(Array.isArray(d) ? d : []))
      .catch(() => {})
      .finally(() => setUsersLoading(false));

    fetch('/api/projects/admin', { headers: { Authorization: auth } })
      .then((r) => r.json())
      .then((d) => setProjects(Array.isArray(d.projects) ? d.projects : []))
      .catch(() => {})
      .finally(() => setProjectsLoading(false));
  }, [auth]);

  const activeProjects = projects.filter((p) => p.status === 'active').length;

  const STATUS_CLR: Record<string, string> = { active: '#22D3EE', inactive: '#64748B', archived: '#F59E0B', completed: '#34D399' };

  return (
    <div>
      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.75rem' }}>
        <StatCard label="Total Users" value={usersLoading ? '…' : String(users.length)} sub={`${users.length} registered`} color="#F59E0B"
          icon={<svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>} />
        <StatCard label="Total Projects" value={projectsLoading ? '…' : String(projects.length)} sub={`${activeProjects} active`} color="#22D3EE"
          icon={<svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>} />
        <StatCard label="Completed" value={projectsLoading ? '…' : String(projects.filter((p) => p.status === 'completed').length)} sub="projects done" color="#34D399"
          icon={<svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>} />
        <StatCard label="Archived" value={projectsLoading ? '…' : String(projects.filter((p) => p.status === 'archived').length)} sub="projects archived" color="#818CF8"
          icon={<svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><polyline points="21 8 21 21 3 21 3 8"/><rect x="1" y="3" width="22" height="5"/><line x1="10" y1="12" x2="14" y2="12"/></svg>} />
      </div>

      {/* Two columns: recent users + recent projects */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>

        {/* Recent Users */}
        <div style={{ background: '#0A0B16', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '6px', overflow: 'hidden' }}>
          <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase' }}>Recent Users</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: '#F59E0B', letterSpacing: '0.06em' }}>{users.length} TOTAL</span>
          </div>
          {usersLoading && <div style={{ padding: '2rem', textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'rgba(255,255,255,0.2)' }}>LOADING…</div>}
          {!usersLoading && users.slice(0, 5).map((u, i, arr) => (
            <div key={u._id} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '0.875rem 1.25rem', borderBottom: i < arr.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
              <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'linear-gradient(135deg, #F59E0B, #F87171)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '0.72rem', color: '#07080F', flexShrink: 0 }}>
                {getInitials(u.name)}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: '0.85rem', color: '#F1F5F9', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{u.name}</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'rgba(255,255,255,0.3)' }}>{formatDate(u.createdAt)}</div>
              </div>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', letterSpacing: '0.08em', color: roleColor[u.role] || '#94A3B8', background: `${roleColor[u.role] || '#94A3B8'}18`, border: `1px solid ${roleColor[u.role] || '#94A3B8'}35`, padding: '2px 7px', borderRadius: '2px' }}>
                {u.role.toUpperCase()}
              </span>
            </div>
          ))}
          {!usersLoading && users.length === 0 && <div style={{ padding: '2rem', textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'rgba(255,255,255,0.2)' }}>NO USERS</div>}
        </div>

        {/* Recent Projects */}
        <div style={{ background: '#0A0B16', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '6px', overflow: 'hidden' }}>
          <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase' }}>Recent Projects</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: '#22D3EE', letterSpacing: '0.06em' }}>{projects.length} TOTAL</span>
          </div>
          {projectsLoading && <div style={{ padding: '2rem', textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'rgba(255,255,255,0.2)' }}>LOADING…</div>}
          {!projectsLoading && projects.slice(0, 5).map((p, i, arr) => (
            <div key={p._id} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '0.875rem 1.25rem', borderBottom: i < arr.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: STATUS_CLR[p.status] ?? '#94A3B8', flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: '0.85rem', color: '#F1F5F9', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</div>
                {p.description && <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'rgba(255,255,255,0.28)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.description}</div>}
              </div>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', letterSpacing: '0.08em', color: STATUS_CLR[p.status] ?? '#94A3B8', background: `${STATUS_CLR[p.status] ?? '#94A3B8'}18`, border: `1px solid ${STATUS_CLR[p.status] ?? '#94A3B8'}35`, padding: '2px 7px', borderRadius: '2px', whiteSpace: 'nowrap' }}>
                {p.status.toUpperCase()}
              </span>
            </div>
          ))}
          {!projectsLoading && projects.length === 0 && <div style={{ padding: '2rem', textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'rgba(255,255,255,0.2)' }}>NO PROJECTS</div>}
        </div>
      </div>
    </div>
  );
}

// ─── Section: Users ───────────────────────────────────────────────────────────

function UsersSection() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');

  // Create modal state
  const [showCreate, setShowCreate] = useState(false);
  const [createForm, setCreateForm] = useState({ name: '', email: '', password: '' });
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState('');

  // Edit role state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editRole, setEditRole] = useState('');
  const [editLoading, setEditLoading] = useState(false);

  // Delete state
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';
  const authHeader = `Bearer ${token}`;

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/user', {
        headers: { Authorization: authHeader },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to fetch users');
      setUsers(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [authHeader]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  // ── Create User ───────────────
  const handleCreate = async () => {
    setCreateError('');
    if (!createForm.name || !createForm.email || !createForm.password) {
      setCreateError('All fields are required.');
      return;
    }
    setCreateLoading(true);
    try {
      const res = await fetch('/api/auth/user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: authHeader },
        body: JSON.stringify(createForm),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to create user');
      setShowCreate(false);
      setCreateForm({ name: '', email: '', password: '' });
      fetchUsers();
    } catch (err: any) {
      setCreateError(err.message);
    } finally {
      setCreateLoading(false);
    }
  };

  // ── Update Role ───────────────
  const handleUpdateRole = async (userId: string) => {
    setEditLoading(true);
    try {
      const res = await fetch('/api/auth/user', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: authHeader },
        body: JSON.stringify({ userId, role: editRole }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to update role');
      setUsers((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, role: editRole } : u))
      );
      setEditingId(null);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setEditLoading(false);
    }
  };

  // ── Delete User ───────────────
  const handleDelete = async (userId: string) => {
    setDeletingId(userId);
    try {
      const res = await fetch(`/api/auth/user?userId=${userId}`, {
        method: 'DELETE',
        headers: { Authorization: authHeader },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to delete user');
      setUsers((prev) => prev.filter((u) => u._id !== userId));
    } catch (err: any) {
      alert(err.message);
    } finally {
      setDeletingId(null);
    }
  };

  const filtered = users.filter((u) => {
    const ms = u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const mr = roleFilter === 'ALL' || u.role.toLowerCase() === roleFilter.toLowerCase();
    return ms && mr;
  });

  const roleColor: Record<string, string> = {
    admin: '#F59E0B', user: '#22D3EE', manager: '#818CF8',
  };

  const getInitials = (name: string) =>
    name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);

  const formatDate = (iso?: string) =>
    iso ? new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—';

  return (
    <div>
      {/* Create User Modal */}
      {showCreate && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          onClick={(e) => { if (e.target === e.currentTarget) setShowCreate(false); }}>
          <div style={{ background: '#0D0E1A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '2rem', width: '100%', maxWidth: '420px' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.1rem', color: '#F1F5F9', marginBottom: '1.5rem' }}>Create New User</h3>
            {createError && (
              <div style={{ padding: '8px 12px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: '4px', marginBottom: '1rem', fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: '#F87171' }}>{createError}</div>
            )}
            {[{ label: 'Full Name', key: 'name', type: 'text', placeholder: 'Jane Smith' },
              { label: 'Email', key: 'email', type: 'email', placeholder: 'jane@company.com' },
              { label: 'Password', key: 'password', type: 'password', placeholder: 'Min 8 characters' }].map(({ label, key, type, placeholder }) => (
              <div key={key} style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.45)', marginBottom: '5px' }}>{label}</label>
                <input type={type} placeholder={placeholder}
                  value={(createForm as any)[key]}
                  onChange={(e) => setCreateForm((f) => ({ ...f, [key]: e.target.value }))}
                  style={{ width: '100%', padding: '9px 13px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '4px', fontFamily: 'var(--font-body)', fontSize: '0.875rem', color: '#F1F5F9', outline: 'none' }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = 'rgba(245,158,11,0.5)')}
                  onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)')} />
              </div>
            ))}
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
              <button onClick={handleCreate} disabled={createLoading}
                style={{ flex: 1, padding: '10px', background: '#F59E0B', border: 'none', borderRadius: '4px', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.875rem', color: '#07080F', cursor: createLoading ? 'not-allowed' : 'pointer', opacity: createLoading ? 0.6 : 1 }}>
                {createLoading ? 'Creating…' : 'Create User'}
              </button>
              <button onClick={() => { setShowCreate(false); setCreateError(''); setCreateForm({ name: '', email: '', password: '' }); }}
                style={{ padding: '10px 18px', background: 'transparent', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '4px', fontFamily: 'var(--font-body)', fontSize: '0.875rem', color: 'rgba(255,255,255,0.5)', cursor: 'pointer' }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <SectionHeader
        title="User Management"
        subtitle={loading ? 'LOADING…' : `${users.length} TOTAL USERS`}
        action={
          <button onClick={() => setShowCreate(true)}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '7px 14px', background: '#F59E0B', border: 'none', borderRadius: '3px', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.78rem', letterSpacing: '0.04em', color: '#07080F', cursor: 'pointer' }}>
            <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Create User
          </button>
        }
      />

      {error && (
        <div style={{ padding: '10px 14px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: '4px', marginBottom: '1rem', fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: '#F87171' }}>{error}</div>
      )}

      {/* Toolbar */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: '1 1 200px', maxWidth: '280px' }}>
          <svg width="13" height="13" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2" viewBox="0 0 24 24" style={{ position: 'absolute', left: '11px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input type="text" placeholder="Search users…" value={search} onChange={(e) => setSearch(e.target.value)}
            style={{ width: '100%', padding: '7px 11px 7px 32px', background: '#0A0B16', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '4px', fontFamily: 'var(--font-body)', fontSize: '0.825rem', color: '#F1F5F9', outline: 'none' }}
            onFocus={(e) => (e.currentTarget.style.borderColor = 'rgba(245,158,11,0.4)')}
            onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)')} />
        </div>
        <div style={{ display: 'flex', gap: '3px', background: '#0A0B16', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '4px', padding: '2px' }}>
          {['ALL', 'admin', 'user'].map((r) => (
            <button key={r} onClick={() => setRoleFilter(r)}
              style={{ padding: '4px 10px', borderRadius: '3px', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: '0.62rem', letterSpacing: '0.07em', background: roleFilter === r ? 'rgba(245,158,11,0.15)' : 'transparent', color: roleFilter === r ? '#F59E0B' : 'rgba(255,255,255,0.35)', transition: 'all 0.2s' }}>
              {r.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div style={{ background: '#0A0B16', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '6px', overflow: 'hidden' }}>
        {/* Header */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 220px 130px 140px 110px', gap: '0.75rem', padding: '0.75rem 1.25rem', borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}>
          {['User', 'Email', 'Role', 'Joined', 'Actions'].map((h) => (
            <span key={h} style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)' }}>{h}</span>
          ))}
        </div>

        {loading && (
          <div style={{ padding: '3rem', textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'rgba(255,255,255,0.2)', letterSpacing: '0.1em' }}>LOADING USERS…</div>
        )}

        {!loading && filtered.map((u, i) => (
          <div key={u._id}
            style={{ display: 'grid', gridTemplateColumns: '1fr 220px 130px 140px 110px', gap: '0.75rem', padding: '0.875rem 1.25rem', borderBottom: i < filtered.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none', alignItems: 'center', transition: 'background 0.15s' }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.02)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}>
            {/* User */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
              <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'linear-gradient(135deg, #F59E0B, #F87171)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '0.72rem', color: '#07080F', flexShrink: 0 }}>
                {getInitials(u.name)}
              </div>
              <span style={{ fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: '0.85rem', color: '#F1F5F9', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{u.name}</span>
            </div>
            {/* Email */}
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'rgba(255,255,255,0.45)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{u.email}</span>
            {/* Role — editable */}
            {editingId === u._id ? (
              <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                <select value={editRole} onChange={(e) => setEditRole(e.target.value)}
                  style={{ flex: 1, padding: '4px 6px', background: '#0D0E1A', border: '1px solid rgba(245,158,11,0.4)', borderRadius: '3px', fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: '#F59E0B', outline: 'none' }}>
                  <option value="user" style={{ background: '#0D0E1A' }}>user</option>
                  <option value="admin" style={{ background: '#0D0E1A' }}>admin</option>
                </select>
                <button onClick={() => handleUpdateRole(u._id)} disabled={editLoading}
                  style={{ padding: '3px 7px', background: '#F59E0B', border: 'none', borderRadius: '3px', fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: '#07080F', cursor: 'pointer' }}>✓</button>
                <button onClick={() => setEditingId(null)}
                  style={{ padding: '3px 7px', background: 'transparent', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '3px', fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'rgba(255,255,255,0.4)', cursor: 'pointer' }}>✕</button>
              </div>
            ) : (
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', letterSpacing: '0.08em', color: roleColor[u.role] || '#94A3B8', background: `${roleColor[u.role] || '#94A3B8'}18`, border: `1px solid ${roleColor[u.role] || '#94A3B8'}35`, padding: '2px 7px', borderRadius: '2px', whiteSpace: 'nowrap' }}>
                {u.role.toUpperCase()}
              </span>
            )}
            {/* Joined */}
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'rgba(255,255,255,0.35)' }}>{formatDate(u.createdAt)}</span>
            {/* Actions */}
            <div style={{ display: 'flex', gap: '4px' }}>
              <button
                onClick={() => { setEditingId(u._id); setEditRole(u.role); }}
                style={{ padding: '4px 8px', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '3px', fontFamily: 'var(--font-mono)', fontSize: '0.58rem', letterSpacing: '0.06em', color: 'rgba(255,255,255,0.45)', cursor: 'pointer', transition: 'all 0.15s' }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(245,158,11,0.5)'; e.currentTarget.style.color = '#F59E0B'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = 'rgba(255,255,255,0.45)'; }}>
                EDIT
              </button>
              <button
                onClick={() => { if (confirm(`Delete ${u.name}? This cannot be undone.`)) handleDelete(u._id); }}
                disabled={deletingId === u._id}
                style={{ padding: '4px 8px', background: 'transparent', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '3px', fontFamily: 'var(--font-mono)', fontSize: '0.58rem', letterSpacing: '0.06em', color: '#F87171', cursor: deletingId === u._id ? 'not-allowed' : 'pointer', opacity: deletingId === u._id ? 0.5 : 1, transition: 'all 0.15s' }}
                onMouseEnter={(e) => { if (deletingId !== u._id) { e.currentTarget.style.borderColor = 'rgba(239,68,68,0.7)'; e.currentTarget.style.color = '#EF4444'; } }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(239,68,68,0.3)'; e.currentTarget.style.color = '#F87171'; }}>
                {deletingId === u._id ? '…' : 'DEL'}
              </button>
            </div>
          </div>
        ))}

        {!loading && filtered.length === 0 && (
          <div style={{ padding: '3rem', textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'rgba(255,255,255,0.2)', letterSpacing: '0.1em' }}>NO USERS FOUND</div>
        )}
      </div>
    </div>
  );
}

// ─── Section: Projects (live data from projects-service) ─────────────────────

function ProjectsSection() {
  const [projects, setProjects] = useState<RealProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [showCreate, setShowCreate] = useState(false);
  const [createForm, setCreateForm] = useState({ name: '', description: '', status: 'active', dueDate: '' });
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';
  const auth = `Bearer ${token}`;

  const fetchProjects = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const res = await fetch('/api/projects/admin', { headers: { Authorization: auth } });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to fetch projects');
      setProjects(Array.isArray(data.projects) ? data.projects : []);
    } catch (err: any) { setError(err.message); }
    finally { setLoading(false); }
  }, [auth]);

  useEffect(() => { fetchProjects(); }, [fetchProjects]);

  const handleCreate = async () => {
    setCreateError('');
    if (!createForm.name.trim()) { setCreateError('Project name is required.'); return; }
    setCreateLoading(true);
    try {
      const res = await fetch('/api/projects/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: auth },
        body: JSON.stringify({ name: createForm.name, description: createForm.description || undefined, status: createForm.status, dueDate: createForm.dueDate || undefined }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to create project');
      setShowCreate(false); setCreateForm({ name: '', description: '', status: 'active', dueDate: '' }); fetchProjects();
    } catch (err: any) { setCreateError(err.message); }
    finally { setCreateLoading(false); }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete project "${name}"? This cannot be undone.`)) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/projects/admin?id=${id}`, { method: 'DELETE', headers: { Authorization: auth } });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to delete project');
      setProjects((prev) => prev.filter((p) => p._id !== id));
    } catch (err: any) { alert(err.message); }
    finally { setDeletingId(null); }
  };

  const STATUS_LABEL: Record<string, string> = { active: 'ACTIVE', inactive: 'INACTIVE', archived: 'ARCHIVED', completed: 'COMPLETED' };
  const STATUS_CLR: Record<string, string> = { active: '#22D3EE', inactive: '#64748B', archived: '#F59E0B', completed: '#34D399' };
  const formatDate = (iso?: string) => iso ? new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—';

  const filtered = projects.filter((p) => {
    const ms = p.name.toLowerCase().includes(search.toLowerCase());
    const sf = statusFilter === 'ALL' || p.status === statusFilter.toLowerCase();
    return ms && sf;
  });

  return (
    <div>
      {showCreate && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          onClick={(e) => { if (e.target === e.currentTarget) setShowCreate(false); }}>
          <div style={{ background: '#0D0E1A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '2rem', width: '100%', maxWidth: '440px' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.1rem', color: '#F1F5F9', marginBottom: '1.5rem' }}>New Project</h3>
            {createError && <div style={{ padding: '8px 12px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: '4px', marginBottom: '1rem', fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: '#F87171' }}>{createError}</div>}
            {[{ label: 'Project Name *', key: 'name', type: 'text', placeholder: 'My project' },
              { label: 'Description', key: 'description', type: 'text', placeholder: 'Optional' }].map(({ label, key, type, placeholder }) => (
              <div key={key} style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.45)', marginBottom: '5px' }}>{label}</label>
                <input type={type} placeholder={placeholder} value={(createForm as any)[key]}
                  onChange={(e) => setCreateForm((f) => ({ ...f, [key]: e.target.value }))}
                  style={{ width: '100%', padding: '9px 13px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '4px', fontFamily: 'var(--font-body)', fontSize: '0.875rem', color: '#F1F5F9', outline: 'none' }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = 'rgba(245,158,11,0.5)')}
                  onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)')} />
              </div>
            ))}
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.45)', marginBottom: '5px' }}>Status</label>
              <select value={createForm.status} onChange={(e) => setCreateForm((f) => ({ ...f, status: e.target.value }))} style={{ width: '100%', padding: '9px 13px', background: '#0D0E1A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '4px', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: '#F1F5F9', outline: 'none' }}>
                {['active', 'inactive', 'archived', 'completed'].map((s) => <option key={s} value={s} style={{ background: '#0D0E1A' }}>{s}</option>)}
              </select>
            </div>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.45)', marginBottom: '5px' }}>Due Date</label>
              <input type="date" value={createForm.dueDate} onChange={(e) => setCreateForm((f) => ({ ...f, dueDate: e.target.value }))} style={{ width: '100%', padding: '9px 13px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '4px', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: '#F1F5F9', outline: 'none', colorScheme: 'dark' }} onFocus={(e) => (e.currentTarget.style.borderColor = 'rgba(245,158,11,0.5)')} onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)')} />
            </div>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button onClick={handleCreate} disabled={createLoading} style={{ flex: 1, padding: '10px', background: '#F59E0B', border: 'none', borderRadius: '4px', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.875rem', color: '#07080F', cursor: createLoading ? 'not-allowed' : 'pointer', opacity: createLoading ? 0.6 : 1 }}>{createLoading ? 'Creating…' : 'Create Project'}</button>
              <button onClick={() => { setShowCreate(false); setCreateError(''); setCreateForm({ name: '', description: '', status: 'active', dueDate: '' }); }} style={{ padding: '10px 18px', background: 'transparent', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '4px', fontFamily: 'var(--font-body)', fontSize: '0.875rem', color: 'rgba(255,255,255,0.5)', cursor: 'pointer' }}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      <SectionHeader
        title="All Projects"
        subtitle={loading ? 'LOADING…' : `${projects.length} TOTAL PROJECTS`}
        action={
          <button onClick={() => setShowCreate(true)} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '7px 14px', background: '#F59E0B', border: 'none', borderRadius: '3px', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.78rem', letterSpacing: '0.04em', color: '#07080F', cursor: 'pointer' }}>
            <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            New Project
          </button>
        }
      />


      {error && <div style={{ padding: '10px 14px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: '4px', marginBottom: '1rem', fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: '#F87171' }}>{error}</div>}

      {/* Toolbar */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: '1 1 200px', maxWidth: '280px' }}>
          <svg width="13" height="13" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2" viewBox="0 0 24 24" style={{ position: 'absolute', left: '11px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input type="text" placeholder="Search projects…" value={search} onChange={(e) => setSearch(e.target.value)}
            style={{ width: '100%', padding: '7px 11px 7px 32px', background: '#0A0B16', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '4px', fontFamily: 'var(--font-body)', fontSize: '0.825rem', color: '#F1F5F9', outline: 'none' }}
            onFocus={(e) => (e.currentTarget.style.borderColor = 'rgba(245,158,11,0.4)')}
            onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)')} />
        </div>
        <div style={{ display: 'flex', gap: '3px', background: '#0A0B16', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '4px', padding: '2px' }}>
          {['ALL', 'active', 'inactive', 'archived', 'completed'].map((s) => (
            <button key={s} onClick={() => setStatusFilter(s)}
              style={{ padding: '4px 10px', borderRadius: '3px', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: '0.62rem', letterSpacing: '0.07em', background: statusFilter === s ? 'rgba(245,158,11,0.15)' : 'transparent', color: statusFilter === s ? '#F59E0B' : 'rgba(255,255,255,0.35)', transition: 'all 0.2s', whiteSpace: 'nowrap' }}>
              {s.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div style={{ background: '#0A0B16', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '6px', overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 160px 120px 100px 110px 100px', gap: '0.75rem', padding: '0.75rem 1.25rem', borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}>
          {['Project', 'Status', 'Tasks', 'Due Date', 'Created', 'Actions'].map((h) => (
            <span key={h} style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)' }}>{h}</span>
          ))}
        </div>
        {loading && <div style={{ padding: '3rem', textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'rgba(255,255,255,0.2)', letterSpacing: '0.1em' }}>LOADING PROJECTS…</div>}
        {!loading && filtered.map((p, i) => (
          <div key={p._id}
            style={{ display: 'grid', gridTemplateColumns: '1fr 160px 120px 100px 110px 100px', gap: '0.75rem', padding: '0.875rem 1.25rem', borderBottom: i < filtered.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none', alignItems: 'center', transition: 'background 0.15s' }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.02)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: '0.875rem', color: '#F1F5F9', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</div>
              {p.description && <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'rgba(255,255,255,0.28)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginTop: '1px' }}>{p.description}</div>}
            </div>
            <Badge text={STATUS_LABEL[p.status] ?? p.status.toUpperCase()} color={STATUS_CLR[p.status] ?? '#94A3B8'} />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)' }}>{p.tasksCount} tasks</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: p.dueDate && new Date(p.dueDate) < new Date() ? '#F87171' : 'rgba(255,255,255,0.35)' }}>
              {p.dueDate ? formatDate(p.dueDate) : '—'}
            </span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'rgba(255,255,255,0.35)' }}>{formatDate(p.createdAt)}</span>
            <div style={{ display: 'flex', gap: '4px' }}>
              <button onClick={() => handleDelete(p._id, p.name)} disabled={deletingId === p._id}
                style={{ padding: '4px 8px', background: 'transparent', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '3px', fontFamily: 'var(--font-mono)', fontSize: '0.58rem', letterSpacing: '0.06em', color: '#F87171', cursor: deletingId === p._id ? 'not-allowed' : 'pointer', opacity: deletingId === p._id ? 0.5 : 1, transition: 'all 0.15s' }}
                onMouseEnter={(e) => { if (deletingId !== p._id) { e.currentTarget.style.borderColor = 'rgba(239,68,68,0.7)'; e.currentTarget.style.color = '#EF4444'; } }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(239,68,68,0.3)'; e.currentTarget.style.color = '#F87171'; }}>
                {deletingId === p._id ? '…' : 'DEL'}
              </button>
            </div>
          </div>
        ))}
        {!loading && filtered.length === 0 && <div style={{ padding: '3rem', textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'rgba(255,255,255,0.2)', letterSpacing: '0.1em' }}>NO PROJECTS FOUND</div>}
      </div>
    </div>
  );
}


// ─── Section: Tasks ────────────────────────────────────────────────────────────

interface AdminTask {
  _id: string;
  title: string;
  description?: string;
  status: string;
  priority: string;
  projectId: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

const PRIORITY_CLR: Record<string, string> = { high: '#EF4444', medium: '#F59E0B', low: '#34D399' };
const TASK_STATUS_CLR: Record<string, string> = { TODO: '#64748B', 'IN PROGRESS': '#22D3EE', 'IN REVIEW': '#818CF8', DONE: '#34D399' };
const TASK_STATUSES = ['TODO', 'IN PROGRESS', 'IN REVIEW', 'DONE'];
const TASK_PRIORITIES = ['high', 'medium', 'low'];

function TasksSection() {
  const [tasks, setTasks] = useState<AdminTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [showCreate, setShowCreate] = useState(false);
  const [createForm, setCreateForm] = useState({ title: '', description: '', projectId: '', priority: 'medium', status: 'TODO' });
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState('');
  const [patchingId, setPatchingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';
  const auth = `Bearer ${token}`;

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/tasks/admin', { headers: { Authorization: auth } });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to fetch tasks');
      setTasks(Array.isArray(data) ? data : []);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Error');
    } finally {
      setLoading(false);
    }
  }, [auth]);

  useEffect(() => { fetchTasks(); }, [fetchTasks]);

  const handleCreate = async () => {
    if (!createForm.title.trim() || !createForm.projectId.trim()) {
      setCreateError('Title and Project ID are required.');
      return;
    }
    setCreateLoading(true); setCreateError('');
    try {
      const res = await fetch('/api/tasks/admin', {
        method: 'POST',
        headers: { Authorization: auth, 'Content-Type': 'application/json' },
        body: JSON.stringify(createForm),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || data.details || 'Failed to create task');
      setTasks((prev) => [data, ...prev]);
      setShowCreate(false);
      setCreateForm({ title: '', description: '', projectId: '', priority: 'medium', status: 'TODO' });
    } catch (e: unknown) {
      setCreateError(e instanceof Error ? e.message : 'Error');
    } finally {
      setCreateLoading(false);
    }
  };

  const handlePatch = async (id: string, field: string, value: string) => {
    setPatchingId(id);
    try {
      const res = await fetch(`/api/tasks/admin?id=${id}`, {
        method: 'PATCH',
        headers: { Authorization: auth, 'Content-Type': 'application/json' },
        body: JSON.stringify({ [field]: value }),
      });
      const data = await res.json();
      if (res.ok) setTasks((prev) => prev.map((t) => (t._id === id ? { ...t, ...data } : t)));
    } finally {
      setPatchingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this task?')) return;
    setDeletingId(id);
    try {
      await fetch(`/api/tasks/admin?id=${id}`, { method: 'DELETE', headers: { Authorization: auth } });
      setTasks((prev) => prev.filter((t) => t._id !== id));
    } finally {
      setDeletingId(null);
    }
  };

  const filtered = tasks.filter((t) => {
    const ms = t.title.toLowerCase().includes(search.toLowerCase()) || t.projectId.toLowerCase().includes(search.toLowerCase());
    const mst = statusFilter === 'ALL' || t.status === statusFilter;
    const mp = priorityFilter === 'ALL' || t.priority === priorityFilter;
    return ms && mst && mp;
  });

  const fieldStyle = { width: '100%', padding: '9px 13px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '4px', fontFamily: 'var(--font-body)', fontSize: '0.825rem', color: '#F1F5F9', outline: 'none' };
  const labelStyle = { display: 'block' as const, fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase' as const, color: 'rgba(255,255,255,0.45)', marginBottom: '5px' };

  return (
    <div>
      {/* Create modal */}
      {showCreate && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ background: '#0F1020', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '2rem', width: '100%', maxWidth: '520px' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.1rem', color: '#F1F5F9', marginBottom: '1.5rem' }}>Create Task</h3>
            {createError && <div style={{ padding: '8px 12px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: '4px', marginBottom: '1rem', fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: '#F87171' }}>{createError}</div>}

            {[{ key: 'title', label: 'Title *' }, { key: 'description', label: 'Description' }, { key: 'projectId', label: 'Project ID *' }].map(({ key, label }) => (
              <div key={key} style={{ marginBottom: '1.25rem' }}>
                <label style={labelStyle}>{label}</label>
                <input type="text" value={createForm[key as keyof typeof createForm]} onChange={(e) => setCreateForm((f) => ({ ...f, [key]: e.target.value }))} style={fieldStyle}
                  onFocus={(e) => (e.currentTarget.style.borderColor = 'rgba(245,158,11,0.5)')} onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)')} />
              </div>
            ))}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
              <div>
                <label style={labelStyle}>Priority</label>
                <select value={createForm.priority} onChange={(e) => setCreateForm((f) => ({ ...f, priority: e.target.value }))} style={{ ...fieldStyle, colorScheme: 'dark' }}>
                  {TASK_PRIORITIES.map((p) => <option key={p} value={p}>{p.toUpperCase()}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Status</label>
                <select value={createForm.status} onChange={(e) => setCreateForm((f) => ({ ...f, status: e.target.value }))} style={{ ...fieldStyle, colorScheme: 'dark' }}>
                  {TASK_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button onClick={handleCreate} disabled={createLoading} style={{ flex: 1, padding: '10px', background: '#F59E0B', border: 'none', borderRadius: '4px', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.875rem', color: '#07080F', cursor: createLoading ? 'not-allowed' : 'pointer', opacity: createLoading ? 0.6 : 1 }}>{createLoading ? 'Creating…' : 'Create Task'}</button>
              <button onClick={() => { setShowCreate(false); setCreateError(''); setCreateForm({ title: '', description: '', projectId: '', priority: 'medium', status: 'TODO' }); }} style={{ padding: '10px 18px', background: 'transparent', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '4px', fontFamily: 'var(--font-body)', fontSize: '0.875rem', color: 'rgba(255,255,255,0.5)', cursor: 'pointer' }}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      <SectionHeader
        title="All Tasks"
        subtitle={loading ? 'LOADING…' : `${tasks.length} TOTAL TASKS`}
        action={
          <button onClick={() => setShowCreate(true)} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '7px 14px', background: '#F59E0B', border: 'none', borderRadius: '3px', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.78rem', letterSpacing: '0.04em', color: '#07080F', cursor: 'pointer' }}>
            <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            New Task
          </button>
        }
      />

      {error && <div style={{ padding: '10px 14px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: '4px', marginBottom: '1rem', fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: '#F87171' }}>{error}</div>}

      {/* Toolbar */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: '1 1 200px', maxWidth: '280px' }}>
          <svg width="13" height="13" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2" viewBox="0 0 24 24" style={{ position: 'absolute', left: '11px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input type="text" placeholder="Search tasks…" value={search} onChange={(e) => setSearch(e.target.value)}
            style={{ width: '100%', padding: '7px 11px 7px 32px', background: '#0A0B16', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '4px', fontFamily: 'var(--font-body)', fontSize: '0.825rem', color: '#F1F5F9', outline: 'none' }}
            onFocus={(e) => (e.currentTarget.style.borderColor = 'rgba(245,158,11,0.4)')} onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)')} />
        </div>

        {/* Status filter */}
        <div style={{ display: 'flex', gap: '3px', background: '#0A0B16', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '4px', padding: '2px' }}>
          {['ALL', ...TASK_STATUSES].map((s) => (
            <button key={s} onClick={() => setStatusFilter(s)} style={{ padding: '4px 9px', borderRadius: '3px', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '0.07em', background: statusFilter === s ? 'rgba(245,158,11,0.15)' : 'transparent', color: statusFilter === s ? '#F59E0B' : 'rgba(255,255,255,0.35)', transition: 'all 0.2s', whiteSpace: 'nowrap' }}>
              {s}
            </button>
          ))}
        </div>

        {/* Priority filter */}
        <div style={{ display: 'flex', gap: '3px', background: '#0A0B16', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '4px', padding: '2px' }}>
          {['ALL', ...TASK_PRIORITIES].map((p) => (
            <button key={p} onClick={() => setPriorityFilter(p)} style={{ padding: '4px 9px', borderRadius: '3px', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '0.07em', background: priorityFilter === p ? 'rgba(245,158,11,0.15)' : 'transparent', color: priorityFilter === p ? '#F59E0B' : 'rgba(255,255,255,0.35)', transition: 'all 0.2s', whiteSpace: 'nowrap' }}>
              {p.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div style={{ background: '#0A0B16', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '6px', overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 130px 150px 130px 130px 120px', gap: '0.75rem', padding: '0.75rem 1.25rem', borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}>
          {['Task', 'Priority', 'Status', 'Project ID', 'Created', 'Actions'].map((h) => (
            <span key={h} style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)' }}>{h}</span>
          ))}
        </div>

        {loading && <div style={{ padding: '3rem', textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'rgba(255,255,255,0.2)', letterSpacing: '0.1em' }}>LOADING TASKS…</div>}

        {!loading && filtered.map((t, i) => (
          <div key={t._id} style={{ display: 'grid', gridTemplateColumns: '1fr 130px 150px 130px 130px 120px', gap: '0.75rem', padding: '0.875rem 1.25rem', borderBottom: i < filtered.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none', alignItems: 'center', transition: 'background 0.15s' }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.02)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}>

            {/* Title + description */}
            <div style={{ minWidth: 0 }}>
              <div style={{ fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: '0.875rem', color: t.status === 'DONE' ? 'rgba(255,255,255,0.3)' : '#F1F5F9', textDecoration: t.status === 'DONE' ? 'line-through' : 'none', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.title}</div>
              {t.description && <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'rgba(255,255,255,0.28)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginTop: '1px' }}>{t.description}</div>}
            </div>

            {/* Priority inline select */}
            <select value={t.priority} disabled={patchingId === t._id} onChange={(e) => handlePatch(t._id, 'priority', e.target.value)}
              style={{ background: `${PRIORITY_CLR[t.priority] ?? '#94A3B8'}18`, border: `1px solid ${PRIORITY_CLR[t.priority] ?? '#94A3B8'}40`, borderRadius: '3px', fontFamily: 'var(--font-mono)', fontSize: '0.62rem', letterSpacing: '0.06em', color: PRIORITY_CLR[t.priority] ?? '#94A3B8', padding: '3px 6px', cursor: 'pointer', outline: 'none', colorScheme: 'dark' }}>
              {TASK_PRIORITIES.map((p) => <option key={p} value={p}>{p.toUpperCase()}</option>)}
            </select>

            {/* Status inline select */}
            <select value={t.status} disabled={patchingId === t._id} onChange={(e) => handlePatch(t._id, 'status', e.target.value)}
              style={{ background: `${TASK_STATUS_CLR[t.status] ?? '#94A3B8'}18`, border: `1px solid ${TASK_STATUS_CLR[t.status] ?? '#94A3B8'}40`, borderRadius: '3px', fontFamily: 'var(--font-mono)', fontSize: '0.62rem', letterSpacing: '0.06em', color: TASK_STATUS_CLR[t.status] ?? '#94A3B8', padding: '3px 6px', cursor: 'pointer', outline: 'none', colorScheme: 'dark' }}>
              {TASK_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>

            {/* Project ID (truncated) */}
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'rgba(255,255,255,0.32)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.projectId}</span>

            {/* Created date */}
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'rgba(255,255,255,0.32)' }}>
              {new Date(t.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>

            {/* Delete */}
            <button onClick={() => handleDelete(t._id)} disabled={deletingId === t._id}
              style={{ padding: '4px 10px', background: 'transparent', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '3px', fontFamily: 'var(--font-mono)', fontSize: '0.58rem', letterSpacing: '0.06em', color: '#F87171', cursor: deletingId === t._id ? 'not-allowed' : 'pointer', opacity: deletingId === t._id ? 0.5 : 1, transition: 'all 0.15s' }}
              onMouseEnter={(e) => { if (deletingId !== t._id) { e.currentTarget.style.borderColor = 'rgba(239,68,68,0.7)'; e.currentTarget.style.color = '#EF4444'; } }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(239,68,68,0.3)'; e.currentTarget.style.color = '#F87171'; }}>
              {deletingId === t._id ? '…' : 'DEL'}
            </button>
          </div>
        ))}

        {!loading && filtered.length === 0 && (
          <div style={{ padding: '3rem', textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'rgba(255,255,255,0.2)', letterSpacing: '0.1em' }}>NO TASKS FOUND</div>
        )}
      </div>
    </div>
  );
}


// ─── Admin Sidebar + Layout ───────────────────────────────────────────────────

const ADMIN_NAV: { key: AdminSection; label: string; icon: React.ReactNode }[] = [
  { key: 'overview', label: 'Overview', icon: <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg> },
  { key: 'users',    label: 'Users',    icon: <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg> },
  { key: 'projects', label: 'Projects', icon: <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg> },
  { key: 'tasks',    label: 'Tasks',    icon: <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg> },
];

const SECTION_COUNTS: Partial<Record<AdminSection, number>> = {};


// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AdminDashboardPage() {
  const [section, setSection] = useState<AdminSection>('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderSection = () => {
    switch (section) {
      case 'overview': return <OverviewSection />;
      case 'users':    return <UsersSection />;
      case 'projects': return <ProjectsSection />;
      case 'tasks':    return <TasksSection />;
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=IBM+Plex+Mono:wght@300;400;500&family=Manrope:wght@300;400;500;600&display=swap');
        :root {
          --font-display: 'Syne', sans-serif;
          --font-mono: 'IBM Plex Mono', monospace;
          --font-body: 'Manrope', sans-serif;
          --border: rgba(255, 255, 255, 0.07);
          --bg-primary: #07080F;
          --bg-secondary: #0D0E1A;
          --bg-card: #0F1020;
          --text-primary: #F1F5F9;
          --text-secondary: #94A3B8;
          --text-muted: #475569;
          --accent-cyan: #22D3EE;
          --border-accent: rgba(34, 211, 238, 0.3);
        }
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #07080F; color: #F1F5F9; font-family: 'Manrope', sans-serif; }
        ::-webkit-scrollbar { width: 5px; height: 5px; }
        ::-webkit-scrollbar-track { background: #07080F; }
        ::-webkit-scrollbar-thumb { background: rgba(245,158,11,0.3); border-radius: 3px; }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        @media (max-width: 768px) {
          .admin-sidebar { transform: translateX(-100%); }
          .admin-sidebar.open { transform: translateX(0); }
          .admin-main { margin-left: 0 !important; }
          .admin-mobile-btn { display: flex !important; }
          .admin-overview-cols { grid-template-columns: 1fr !important; }
          .admin-sys-cols { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <div style={{ display: 'flex', minHeight: '100vh', background: '#07080F' }}>

        {/* ── Sidebar ── */}
        <aside
          className={`admin-sidebar${sidebarOpen ? ' open' : ''}`}
          style={{ width: '220px', flexShrink: 0, background: '#080910', borderRight: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', position: 'fixed', top: 0, bottom: 0, left: 0, zIndex: 60, transition: 'transform 0.3s ease' }}
        >
          {/* Logo + admin badge */}
          <div style={{ padding: '1.25rem 1.25rem 1rem', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <div style={{ width: '26px', height: '26px', background: 'linear-gradient(135deg, #F59E0B, #F87171)', clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)', flexShrink: 0 }} />
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.1rem', letterSpacing: '0.06em', color: '#F1F5F9' }}>TaskMaster</span>
            </div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '3px 8px', background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.25)', borderRadius: '2px' }}>
              <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#F59E0B' }} />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '0.12em', color: '#F59E0B' }}>ADMIN PANEL</span>
            </div>
          </div>

          {/* Nav */}
          <nav style={{ flex: 1, padding: '0.875rem 0.75rem', display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {ADMIN_NAV.map((item) => {
              const active = section === item.key;
              return (
                <button
                  key={item.key}
                  onClick={() => { setSection(item.key); setSidebarOpen(false); }}
                  style={{ display: 'flex', alignItems: 'center', gap: '9px', padding: '9px 11px', borderRadius: '4px', border: `1px solid ${active ? 'rgba(245,158,11,0.2)' : 'transparent'}`, background: active ? 'rgba(245,158,11,0.08)' : 'transparent', fontFamily: 'var(--font-body)', fontWeight: active ? 600 : 400, fontSize: '0.85rem', color: active ? '#F59E0B' : 'rgba(255,255,255,0.45)', cursor: 'pointer', width: '100%', textAlign: 'left', transition: 'all 0.2s', justifyContent: 'space-between' }}
                  onMouseEnter={(e) => { if (!active) { e.currentTarget.style.color = '#F1F5F9'; e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; } }}
                  onMouseLeave={(e) => { if (!active) { e.currentTarget.style.color = 'rgba(255,255,255,0.45)'; e.currentTarget.style.background = 'transparent'; } }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
                    <span style={{ lineHeight: 0, color: active ? '#F59E0B' : 'inherit' }}>{item.icon}</span>
                    {item.label}
                  </div>
                  {SECTION_COUNTS[item.key] !== null && (
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: active ? '#F59E0B' : 'rgba(255,255,255,0.25)', background: 'rgba(255,255,255,0.05)', padding: '1px 6px', borderRadius: '2px' }}>
                      {SECTION_COUNTS[item.key]}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Bottom: back to app + user */}
          <div style={{ padding: '0.875rem 0.75rem', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <a href="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 11px', borderRadius: '4px', background: 'rgba(34,211,238,0.06)', border: '1px solid rgba(34,211,238,0.15)', textDecoration: 'none', fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: '#22D3EE', transition: 'opacity 0.2s' }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.7')}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}>
              <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"/></svg>
              Back to App
            </a>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 11px', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '4px' }}>
              <Avatar initials="JD" size={26} />
              <div>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.78rem', fontWeight: 600, color: '#F1F5F9' }}>John Doe</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: '#F59E0B', letterSpacing: '0.06em' }}>ADMIN</div>
              </div>
            </div>
          </div>
        </aside>

        {/* Mobile overlay */}
        {sidebarOpen && (
          <div onClick={() => setSidebarOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 55 }} />
        )}

        {/* ── Main area ── */}
        <div className="admin-main" style={{ marginLeft: '220px', flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>

          {/* Topbar */}
          <header style={{ height: '56px', background: '#080910', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 2rem', position: 'sticky', top: 0, zIndex: 30 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {/* Mobile hamburger */}
              <button className="admin-mobile-btn" onClick={() => setSidebarOpen(!sidebarOpen)}
                style={{ display: 'none', background: 'transparent', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '4px', padding: '6px', cursor: 'pointer', color: 'rgba(255,255,255,0.5)', lineHeight: 0 }}>
                <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
              </button>
              <div>
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.95rem', color: '#F1F5F9' }}>
                  {ADMIN_NAV.find((n) => n.key === section)?.label}
                </span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'rgba(255,255,255,0.25)', letterSpacing: '0.1em', marginLeft: '10px' }}>
                  ADMIN / {section.toUpperCase()}
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
              {/* Search */}
              <div style={{ position: 'relative' }}>
                <svg width="13" height="13" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="2" viewBox="0 0 24 24" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                  <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
                <input type="text" placeholder="Global search…" style={{ padding: '6px 12px 6px 30px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '4px', fontFamily: 'var(--font-body)', fontSize: '0.78rem', color: '#F1F5F9', outline: 'none', width: '180px' }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = 'rgba(245,158,11,0.4)')}
                  onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)')} />
              </div>

              {/* Alert bell */}
              <button style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '4px', padding: '6px', cursor: 'pointer', color: 'rgba(255,255,255,0.45)', lineHeight: 0, position: 'relative' }}>
                <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
                <span style={{ position: 'absolute', top: '4px', right: '4px', width: '5px', height: '5px', borderRadius: '50%', background: '#F59E0B' }} />
              </button>

              {/* Admin badge */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '5px 10px', background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: '3px' }}>
                <svg width="11" height="11" fill="none" stroke="#F59E0B" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: '#F59E0B', letterSpacing: '0.1em' }}>ADMIN</span>
              </div>
            </div>
          </header>

          {/* Page content */}
          <main style={{ flex: 1, padding: '2rem', overflowY: 'auto' }}>
            {renderSection()}
          </main>
        </div>
      </div>
    </>
  );
}