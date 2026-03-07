'use client';

import { useState, useEffect, useCallback } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

type AdminSection = 'overview' | 'users' | 'projects' | 'tasks' | 'system';

// Real API user (from auth-service)
interface User {
  _id: string; name: string; email: string; role: string;
  createdAt?: string;
}

// Local mock type used only by OverviewSection static tables
interface MockUser {
  id: number; name: string; email: string; role: string;
  status: string; joined: string; projects: number; tasks: number; avatar: string;
}
interface Project {
  id: number; name: string; owner: string; status: string; tasks: number; done: number;
  members: number; created: string; color: string;
}
interface Task {
  id: number; title: string; project: string; assignee: string; priority: string;
  status: string; due: string; createdBy: string;
}

// ─── Mock data ────────────────────────────────────────────────────────────────

const MOCK_USERS: MockUser[] = [
  { id: 1, name: 'John Doe',      email: 'john@company.com',  role: 'ADMIN',   status: 'ACTIVE',    joined: 'Jan 3, 2025',  projects: 12, tasks: 47, avatar: 'JD' },
  { id: 2, name: 'Alice Smith',   email: 'alice@company.com', role: 'MANAGER', status: 'ACTIVE',    joined: 'Jan 14, 2025', projects: 7,  tasks: 31, avatar: 'AS' },
  { id: 3, name: 'Mike Kim',      email: 'mike@company.com',  role: 'MEMBER',  status: 'ACTIVE',    joined: 'Feb 2, 2025',  projects: 4,  tasks: 18, avatar: 'MK' },
  { id: 4, name: 'Sara Ren',      email: 'sara@company.com',  role: 'MEMBER',  status: 'INACTIVE',  joined: 'Feb 20, 2025', projects: 2,  tasks: 6,  avatar: 'SR' },
  { id: 5, name: 'Dan Okafor',    email: 'dan@company.com',   role: 'MANAGER', status: 'ACTIVE',    joined: 'Mar 1, 2025',  projects: 5,  tasks: 22, avatar: 'DO' },
  { id: 6, name: 'Priya Nair',    email: 'priya@company.com', role: 'MEMBER',  status: 'ACTIVE',    joined: 'Mar 5, 2025',  projects: 3,  tasks: 14, avatar: 'PN' },
  { id: 7, name: 'Tom Briggs',    email: 'tom@company.com',   role: 'MEMBER',  status: 'SUSPENDED', joined: 'Mar 8, 2025',  projects: 1,  tasks: 3,  avatar: 'TB' },
  { id: 8, name: 'Lena Hoffmann', email: 'lena@company.com',  role: 'MANAGER', status: 'ACTIVE',    joined: 'Mar 10, 2025', projects: 6,  tasks: 28, avatar: 'LH' },
];

const MOCK_PROJECTS: Project[] = [
  { id: 1, name: 'Platform Redesign',  owner: 'John Doe',    status: 'ACTIVE',    tasks: 24, done: 14, members: 5, created: 'Jan 5',  color: '#22D3EE' },
  { id: 2, name: 'Auth Service v2',    owner: 'Alice Smith', status: 'ACTIVE',    tasks: 18, done: 9,  members: 3, created: 'Jan 14', color: '#F59E0B' },
  { id: 3, name: 'Analytics Dashboard',owner: 'Mike Kim',    status: 'IN REVIEW', tasks: 31, done: 28, members: 4, created: 'Feb 1',  color: '#818CF8' },
  { id: 4, name: 'Mobile App',         owner: 'Dan Okafor',  status: 'PLANNED',   tasks: 40, done: 0,  members: 6, created: 'Feb 18', color: '#34D399' },
  { id: 5, name: 'DevOps Pipeline',    owner: 'John Doe',    status: 'ACTIVE',    tasks: 12, done: 8,  members: 2, created: 'Mar 2',  color: '#F87171' },
  { id: 6, name: 'API Documentation',  owner: 'Lena Hoffmann',status: 'DONE',     tasks: 8,  done: 8,  members: 2, created: 'Mar 6',  color: '#64748B' },
];

const MOCK_TASKS: Task[] = [
  { id: 1,  title: 'Design system audit',       project: 'Platform Redesign', assignee: 'JD', priority: 'HIGH',   status: 'IN PROGRESS', due: 'Mar 12', createdBy: 'Alice Smith' },
  { id: 2,  title: 'API rate limiting',          project: 'Auth Service v2',   assignee: 'AS', priority: 'HIGH',   status: 'TODO',        due: 'Mar 14', createdBy: 'John Doe' },
  { id: 3,  title: 'Write integration tests',    project: 'DevOps Pipeline',   assignee: 'MK', priority: 'MEDIUM', status: 'TODO',        due: 'Mar 18', createdBy: 'John Doe' },
  { id: 4,  title: 'Analytics dashboard v2',     project: 'Analytics Dashboard',assignee: 'JD', priority: 'LOW',   status: 'IN REVIEW',   due: 'Mar 20', createdBy: 'Mike Kim' },
  { id: 5,  title: 'Deploy to staging',          project: 'DevOps Pipeline',   assignee: 'AS', priority: 'HIGH',   status: 'DONE',        due: 'Mar 10', createdBy: 'Alice Smith' },
  { id: 6,  title: 'Refresh token rotation',     project: 'Auth Service v2',   assignee: 'MK', priority: 'HIGH',   status: 'IN PROGRESS', due: 'Mar 13', createdBy: 'Alice Smith' },
  { id: 7,  title: 'Responsive navbar',          project: 'Platform Redesign', assignee: 'JD', priority: 'MEDIUM', status: 'DONE',        due: 'Mar 8',  createdBy: 'John Doe' },
  { id: 8,  title: 'User onboarding flow',       project: 'Platform Redesign', assignee: 'PN', priority: 'MEDIUM', status: 'TODO',        due: 'Mar 25', createdBy: 'Dan Okafor' },
  { id: 9,  title: 'Docker compose setup',       project: 'DevOps Pipeline',   assignee: 'DO', priority: 'HIGH',   status: 'DONE',        due: 'Mar 7',  createdBy: 'Dan Okafor' },
  { id: 10, title: 'Chart.js integration',       project: 'Analytics Dashboard',assignee: 'LH', priority: 'MEDIUM',status: 'IN PROGRESS', due: 'Mar 16', createdBy: 'Lena Hoffmann' },
];

const ACTIVITY_FEED = [
  { icon: '✚', color: '#22D3EE', msg: 'Alice Smith created project "Auth Service v2"', time: '2m ago' },
  { icon: '◎', color: '#F59E0B', msg: 'Tom Briggs account suspended by admin', time: '14m ago' },
  { icon: '✔', color: '#34D399', msg: 'Task "Deploy to staging" marked done by Alice Smith', time: '1h ago' },
  { icon: '⊕', color: '#818CF8', msg: 'Priya Nair joined project "Platform Redesign"', time: '2h ago' },
  { icon: '△', color: '#F87171', msg: 'CRITICAL task overdue: "API rate limiting"', time: '3h ago' },
  { icon: '◈', color: '#22D3EE', msg: 'Dan Okafor created project "Mobile App"', time: '5h ago' },
  { icon: '⊛', color: '#F59E0B', msg: 'New user registered: Lena Hoffmann', time: '1d ago' },
];

// ─── Color maps ───────────────────────────────────────────────────────────────

const ROLE_COLOR: Record<string, string> = { ADMIN: '#F59E0B', MANAGER: '#818CF8', MEMBER: '#22D3EE' };
const USER_STATUS_COLOR: Record<string, string> = { ACTIVE: '#34D399', INACTIVE: '#64748B', SUSPENDED: '#EF4444' };
const PRIORITY_COLOR: Record<string, string> = { HIGH: '#EF4444', MEDIUM: '#F59E0B', LOW: '#34D399', CRITICAL: '#A855F7' };
const TASK_STATUS_COLOR: Record<string, string> = { TODO: '#64748B', 'IN PROGRESS': '#22D3EE', 'IN REVIEW': '#818CF8', DONE: '#34D399' };
const PROJECT_STATUS_COLOR: Record<string, string> = { ACTIVE: '#22D3EE', 'IN REVIEW': '#818CF8', PLANNED: '#F59E0B', DONE: '#34D399', 'ON HOLD': '#64748B' };

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

// ─── Section: Overview ────────────────────────────────────────────────────────

function OverviewSection() {
  const activeUsers = MOCK_USERS.filter((u) => u.status === 'ACTIVE').length;
  const activeProjects = MOCK_PROJECTS.filter((p) => p.status === 'ACTIVE').length;
  const openTasks = MOCK_TASKS.filter((t) => t.status !== 'DONE').length;
  const doneTasks = MOCK_TASKS.filter((t) => t.status === 'DONE').length;

  return (
    <div>
      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.75rem' }}>
        <StatCard label="Total Users" value={String(MOCK_USERS.length)} sub={`${activeUsers} active`} color="#F59E0B"
          icon={<svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>} />
        <StatCard label="Total Projects" value={String(MOCK_PROJECTS.length)} sub={`${activeProjects} active`} color="#22D3EE"
          icon={<svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>} />
        <StatCard label="Total Tasks" value={String(MOCK_TASKS.length)} sub={`${openTasks} open · ${doneTasks} done`} color="#818CF8"
          icon={<svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>} />
        <StatCard label="Services" value="4 / 4" sub="all systems nominal" color="#34D399"
          icon={<svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>} />
      </div>

      {/* Two columns: quick tables + activity */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '1rem' }}>

        {/* Recent users + projects stacked */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

          {/* Top users */}
          <div style={{ background: '#0A0B16', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '6px', overflow: 'hidden' }}>
            <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase' }}>Recent Users</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: '#F59E0B', cursor: 'pointer', letterSpacing: '0.06em' }}>VIEW ALL →</span>
            </div>
            {MOCK_USERS.slice(0, 4).map((u, i, arr) => (
              <div key={u.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '0.875rem 1.25rem', borderBottom: i < arr.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                <Avatar initials={u.avatar} size={32} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: '0.85rem', color: '#F1F5F9', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{u.name}</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'rgba(255,255,255,0.3)' }}>{u.email}</div>
                </div>
                <Badge text={u.role} color={ROLE_COLOR[u.role]} />
                <Badge text={u.status} color={USER_STATUS_COLOR[u.status]} />
              </div>
            ))}
          </div>

          {/* Recent projects */}
          <div style={{ background: '#0A0B16', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '6px', overflow: 'hidden' }}>
            <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase' }}>Projects Overview</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: '#F59E0B', cursor: 'pointer', letterSpacing: '0.06em' }}>VIEW ALL →</span>
            </div>
            {MOCK_PROJECTS.slice(0, 4).map((p, i, arr) => {
              const pct = Math.round((p.done / p.tasks) * 100) || 0;
              return (
                <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '0.875rem 1.25rem', borderBottom: i < arr.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: p.color, flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: '0.85rem', color: '#F1F5F9', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: '3px' }}>{p.name}</div>
                    <div style={{ height: '3px', background: 'rgba(255,255,255,0.07)', borderRadius: '2px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${pct}%`, background: p.color, borderRadius: '2px' }} />
                    </div>
                  </div>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: p.color }}>{pct}%</span>
                  <Badge text={p.status} color={PROJECT_STATUS_COLOR[p.status]} />
                </div>
              );
            })}
          </div>
        </div>

        {/* Activity feed */}
        <div style={{ background: '#0A0B16', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '6px', overflow: 'hidden' }}>
          <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase' }}>Activity Feed</span>
          </div>
          <div style={{ padding: '0.5rem 0' }}>
            {ACTIVITY_FEED.map((a, i) => (
              <div key={i} style={{ display: 'flex', gap: '10px', padding: '0.75rem 1.25rem', borderBottom: i < ACTIVITY_FEED.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                <div style={{ width: '24px', height: '24px', borderRadius: '4px', background: `${a.color}18`, border: `1px solid ${a.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', color: a.color, flexShrink: 0 }}>{a.icon}</div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.78rem', color: 'rgba(255,255,255,0.65)', lineHeight: 1.45, marginBottom: '2px' }}>{a.msg}</p>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'rgba(255,255,255,0.25)', letterSpacing: '0.06em' }}>{a.time}</span>
                </div>
              </div>
            ))}
          </div>
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

// ─── Section: Projects ────────────────────────────────────────────────────────

function ProjectsSection() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const filtered = MOCK_PROJECTS.filter((p) => {
    const ms = p.name.toLowerCase().includes(search.toLowerCase()) || p.owner.toLowerCase().includes(search.toLowerCase());
    const mst = statusFilter === 'ALL' || p.status === statusFilter;
    return ms && mst;
  });

  return (
    <div>
      <SectionHeader
        title="All Projects"
        subtitle={`${MOCK_PROJECTS.length} TOTAL PROJECTS`}
        action={
          <button style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '7px 14px', background: '#F59E0B', border: 'none', borderRadius: '3px', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.78rem', letterSpacing: '0.04em', color: '#07080F', cursor: 'pointer' }}>
            <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            New Project
          </button>
        }
      />

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
          {['ALL', 'ACTIVE', 'IN REVIEW', 'PLANNED', 'DONE'].map((s) => (
            <button key={s} onClick={() => setStatusFilter(s)}
              style={{ padding: '4px 10px', borderRadius: '3px', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: '0.62rem', letterSpacing: '0.07em', background: statusFilter === s ? 'rgba(245,158,11,0.15)' : 'transparent', color: statusFilter === s ? '#F59E0B' : 'rgba(255,255,255,0.35)', transition: 'all 0.2s', whiteSpace: 'nowrap' }}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div style={{ background: '#0A0B16', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '6px', overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 150px 110px 130px 80px 80px 100px', gap: '0.75rem', padding: '0.75rem 1.25rem', borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}>
          {['Project', 'Owner', 'Status', 'Progress', 'Tasks', 'Members', 'Actions'].map((h) => (
            <span key={h} style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)' }}>{h}</span>
          ))}
        </div>
        {filtered.map((p, i) => {
          const pct = Math.round((p.done / p.tasks) * 100) || 0;
          return (
            <div key={p.id} style={{ display: 'grid', gridTemplateColumns: '1fr 150px 110px 130px 80px 80px 100px', gap: '0.75rem', padding: '0.875rem 1.25rem', borderBottom: i < filtered.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none', alignItems: 'center', transition: 'background 0.15s' }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.02)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: p.color, flexShrink: 0 }} />
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: '0.875rem', color: '#F1F5F9', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'rgba(255,255,255,0.28)' }}>{p.created}</div>
                </div>
              </div>
              <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.owner}</span>
              <Badge text={p.status} color={PROJECT_STATUS_COLOR[p.status]} />
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'rgba(255,255,255,0.3)' }}>{p.done}/{p.tasks}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: p.color }}>{pct}%</span>
                </div>
                <div style={{ height: '3px', background: 'rgba(255,255,255,0.07)', borderRadius: '2px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${pct}%`, background: p.color, borderRadius: '2px' }} />
                </div>
              </div>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', textAlign: 'center' }}>{p.tasks}</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', textAlign: 'center' }}>{p.members}</span>
              <div style={{ display: 'flex', gap: '4px' }}>
                {['View', 'Delete'].map((a) => (
                  <button key={a} style={{ padding: '4px 8px', background: 'transparent', border: `1px solid ${a === 'Delete' ? 'rgba(239,68,68,0.3)' : 'rgba(255,255,255,0.1)'}`, borderRadius: '3px', fontFamily: 'var(--font-mono)', fontSize: '0.58rem', letterSpacing: '0.06em', color: a === 'Delete' ? '#F87171' : 'rgba(255,255,255,0.45)', cursor: 'pointer', transition: 'all 0.15s' }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = a === 'Delete' ? 'rgba(239,68,68,0.7)' : 'rgba(245,158,11,0.5)'; e.currentTarget.style.color = a === 'Delete' ? '#EF4444' : '#F59E0B'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = a === 'Delete' ? 'rgba(239,68,68,0.3)' : 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = a === 'Delete' ? '#F87171' : 'rgba(255,255,255,0.45)'; }}>
                    {a.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Section: Tasks ───────────────────────────────────────────────────────────

function TasksSection() {
  const [search, setSearch] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const filtered = MOCK_TASKS.filter((t) => {
    const ms = t.title.toLowerCase().includes(search.toLowerCase()) || t.project.toLowerCase().includes(search.toLowerCase());
    const mp = priorityFilter === 'ALL' || t.priority === priorityFilter;
    const mst = statusFilter === 'ALL' || t.status === statusFilter;
    return ms && mp && mst;
  });

  return (
    <div>
      <SectionHeader
        title="All Tasks"
        subtitle={`${MOCK_TASKS.length} TOTAL · ${MOCK_TASKS.filter(t => t.status !== 'DONE').length} OPEN`}
      />

      {/* Toolbar */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: '1 1 200px', maxWidth: '280px' }}>
          <svg width="13" height="13" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2" viewBox="0 0 24 24" style={{ position: 'absolute', left: '11px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input type="text" placeholder="Search tasks…" value={search} onChange={(e) => setSearch(e.target.value)}
            style={{ width: '100%', padding: '7px 11px 7px 32px', background: '#0A0B16', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '4px', fontFamily: 'var(--font-body)', fontSize: '0.825rem', color: '#F1F5F9', outline: 'none' }}
            onFocus={(e) => (e.currentTarget.style.borderColor = 'rgba(245,158,11,0.4)')}
            onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)')} />
        </div>
        {[['Priority', ['ALL','HIGH','MEDIUM','LOW'], priorityFilter, setPriorityFilter], ['Status', ['ALL','TODO','IN PROGRESS','IN REVIEW','DONE'], statusFilter, setStatusFilter]].map(([label, opts, val, setter]: any) => (
          <div key={label} style={{ display: 'flex', gap: '3px', background: '#0A0B16', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '4px', padding: '2px' }}>
            {opts.map((o: string) => (
              <button key={o} onClick={() => setter(o)}
                style={{ padding: '4px 9px', borderRadius: '3px', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '0.07em', background: val === o ? 'rgba(245,158,11,0.15)' : 'transparent', color: val === o ? '#F59E0B' : 'rgba(255,255,255,0.35)', transition: 'all 0.2s', whiteSpace: 'nowrap' }}>
                {o}
              </button>
            ))}
          </div>
        ))}
      </div>

      {/* Table */}
      <div style={{ background: '#0A0B16', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '6px', overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 160px 80px 110px 100px 120px 90px', gap: '0.75rem', padding: '0.75rem 1.25rem', borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}>
          {['Task', 'Project', 'Who', 'Priority', 'Status', 'Created By', 'Due'].map((h) => (
            <span key={h} style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)' }}>{h}</span>
          ))}
        </div>
        {filtered.map((t, i) => (
          <div key={t.id} style={{ display: 'grid', gridTemplateColumns: '1fr 160px 80px 110px 100px 120px 90px', gap: '0.75rem', padding: '0.875rem 1.25rem', borderBottom: i < filtered.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none', alignItems: 'center', transition: 'background 0.15s' }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.02)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}>
            <div style={{ fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: '0.85rem', color: t.status === 'DONE' ? 'rgba(255,255,255,0.3)' : '#F1F5F9', textDecoration: t.status === 'DONE' ? 'line-through' : 'none', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.title}</div>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.project}</span>
            <Avatar initials={t.assignee} size={26} />
            <Badge text={t.priority} color={PRIORITY_COLOR[t.priority]} />
            <Badge text={t.status} color={TASK_STATUS_COLOR[t.status]} />
            <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.78rem', color: 'rgba(255,255,255,0.4)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.createdBy}</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)' }}>{t.due}</span>
          </div>
        ))}
        {filtered.length === 0 && (
          <div style={{ padding: '3rem', textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'rgba(255,255,255,0.2)', letterSpacing: '0.1em' }}>NO TASKS FOUND</div>
        )}
      </div>
    </div>
  );
}

// ─── Section: System ──────────────────────────────────────────────────────────

function SystemSection() {
  const services = [
    { name: 'auth-service',      port: 4001, status: 'HEALTHY', uptime: '99.98%', latency: '32ms',  requests: '12.4k', errors: '0.01%', version: 'v1.4.2' },
    { name: 'projects-service',  port: 4002, status: 'HEALTHY', uptime: '99.95%', latency: '48ms',  requests: '8.1k',  errors: '0.00%', version: 'v1.2.1' },
    { name: 'tasks-service',     port: 4003, status: 'HEALTHY', uptime: '99.99%', latency: '41ms',  requests: '31.7k', errors: '0.02%', version: 'v1.6.0' },
    { name: 'analytics-service', port: 4004, status: 'HEALTHY', uptime: '99.91%', latency: '96ms',  requests: '4.2k',  errors: '0.04%', version: 'v1.1.3' },
    { name: 'frontend-service',  port: 3000, status: 'HEALTHY', uptime: '100%',   latency: '11ms',  requests: '55.2k', errors: '0.00%', version: 'v1.5.0' },
  ];

  const env = [
    { key: 'NODE_ENV',                    value: 'production' },
    { key: 'AUTH_SERVICE_URL',            value: 'http://auth-service:4001' },
    { key: 'PROJECTS_SERVICE_URL',        value: 'http://projects-service:4002' },
    { key: 'TASKS_SERVICE_URL',           value: 'http://tasks-service:4003' },
    { key: 'ANALYTICS_SERVICE_URL',       value: 'http://analytics-service:4004' },
    { key: 'JWT_EXPIRY',                  value: '15m' },
    { key: 'REFRESH_TOKEN_EXPIRY',        value: '7d' },
    { key: 'LOG_LEVEL',                   value: 'info' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <SectionHeader title="System Health" subtitle="LIVE SERVICE MONITORING · 5 SERVICES" />

      {/* Services table */}
      <div style={{ background: '#0A0B16', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '6px', overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 80px 90px 80px 90px 80px 80px 80px', gap: '0.75rem', padding: '0.75rem 1.25rem', borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}>
          {['Service', 'Port', 'Status', 'Uptime', 'P99 Latency', 'Requests', 'Errors', 'Version'].map((h) => (
            <span key={h} style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)' }}>{h}</span>
          ))}
        </div>
        {services.map((svc, i) => (
          <div key={svc.name} style={{ display: 'grid', gridTemplateColumns: '1fr 80px 90px 80px 90px 80px 80px 80px', gap: '0.75rem', padding: '0.875rem 1.25rem', borderBottom: i < services.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#34D399', boxShadow: '0 0 6px rgba(52,211,153,0.6)', animation: 'pulse 2s ease-in-out infinite', flexShrink: 0 }} />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: '#F1F5F9' }}>{svc.name}</span>
            </div>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)' }}>:{svc.port}</span>
            <Badge text={svc.status} color="#34D399" />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: '#34D399' }}>{svc.uptime}</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'rgba(255,255,255,0.5)' }}>{svc.latency}</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'rgba(255,255,255,0.5)' }}>{svc.requests}</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: parseFloat(svc.errors) > 0.03 ? '#F59E0B' : '#34D399' }}>{svc.errors}</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'rgba(255,255,255,0.35)' }}>{svc.version}</span>
          </div>
        ))}
      </div>

      {/* ALB + env side by side */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        {/* ALB info */}
        <div style={{ background: '#0A0B16', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '6px', padding: '1.5rem' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: '1.25rem' }}>ALB Configuration</div>
          {[
            { label: 'Load Balancer', value: 'nexus-alb.us-east-1.amazonaws.com' },
            { label: 'Routing Rule', value: '/ → frontend-service:3000' },
            { label: 'API Gateway', value: '/api/* → backend services' },
            { label: 'Health Check', value: '/health (interval: 30s)' },
            { label: 'SSL', value: 'ACM Certificate · TLS 1.3' },
            { label: 'Region', value: 'us-east-1 (primary)' },
          ].map((row) => (
            <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '0.625rem', marginBottom: '0.625rem', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'rgba(255,255,255,0.35)', letterSpacing: '0.06em' }}>{row.label}</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: '#F59E0B' }}>{row.value}</span>
            </div>
          ))}
        </div>

        {/* Environment variables */}
        <div style={{ background: '#0A0B16', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '6px', padding: '1.5rem' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: '1.25rem' }}>Environment Variables</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {env.map((e) => (
              <div key={e.key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 10px', background: 'rgba(255,255,255,0.02)', borderRadius: '3px', gap: '1rem' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.04em', flexShrink: 0 }}>{e.key}</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: '#22D3EE', letterSpacing: '0.04em', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', textAlign: 'right' }}>{e.value}</span>
              </div>
            ))}
          </div>
        </div>
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
  { key: 'system',   label: 'System',   icon: <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg> },
];

const SECTION_COUNTS: Record<AdminSection, number | null> = {
  overview: null,
  users: MOCK_USERS.length,
  projects: MOCK_PROJECTS.length,
  tasks: MOCK_TASKS.length,
  system: 5,
};

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
      case 'system':   return <SystemSection />;
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