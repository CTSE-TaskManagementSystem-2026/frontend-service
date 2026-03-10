'use client';

import { useState, useEffect, useCallback } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import Link from 'next/link';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Task {
  _id: string;
  title: string;
  description?: string;
  status: string;
  priority: string;
  projectId: string;
  createdBy: string;
  createdAt: string;
}

// ─── Color maps ───────────────────────────────────────────────────────────────

const PRIORITY_COLOR: Record<string, string> = { high: '#EF4444', medium: '#F59E0B', low: '#34D399' };
const STATUS_COLOR: Record<string, string> = { TODO: '#64748B', 'IN PROGRESS': '#22D3EE', 'IN REVIEW': '#818CF8', DONE: '#34D399' };
const COL_ACCENT = STATUS_COLOR;
const COLUMNS = ['TODO', 'IN PROGRESS', 'IN REVIEW', 'DONE'];

// ─── Resolved design tokens ───────────────────────────────────────────────────
const T = {
  bgSecondary: '#0d0f1a',
  bgCard: '#0f1020',
  textPrimary: '#f1f5f9',
  textSecondary: '#94a3b8',
  textMuted: '#475569',
  accentCyan: '#22d3ee',
  darkBase: '#07080f',
  border: 'rgba(255,255,255,0.07)',
  fontDisplay: "'Syne', sans-serif",
  fontMono: "'IBM Plex Mono', monospace",
  fontBody: "'Manrope', sans-serif",
};

type ViewMode = 'KANBAN' | 'LIST';

// All task requests go through our own Next.js backend route — no NEXT_PUBLIC_ needed

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [view, setView] = useState<ViewMode>('KANBAN');
  const [search, setSearch] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [showCreate, setShowCreate] = useState(false);
  const [createForm, setCreateForm] = useState({ title: '', description: '', projectId: '', priority: 'medium' });
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState('');
  const [patchingId, setPatchingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';
  const auth = `Bearer ${token}`;

  const fetchTasks = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const res = await fetch('/frontend-api/tasks/user', { headers: { Authorization: auth } });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to load tasks');
      setTasks(Array.isArray(data) ? data : []);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Error loading tasks');
    } finally {
      setLoading(false);
    }
  }, [auth]);

  useEffect(() => { fetchTasks(); }, [fetchTasks]);

  const handleCreate = async () => {
    if (!createForm.title.trim() || !createForm.projectId.trim()) {
      setCreateError('Title and Project ID are required.'); return;
    }
    setCreateLoading(true); setCreateError('');
    try {
      const res = await fetch('/frontend-api/tasks/user', {
        method: 'POST',
        headers: { Authorization: auth, 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...createForm, status: 'TODO' }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || data.details || 'Failed to create');
      setTasks((prev) => [data, ...prev]);
      setShowCreate(false);
      setCreateForm({ title: '', description: '', projectId: '', priority: 'medium' });
    } catch (e: unknown) {
      setCreateError(e instanceof Error ? e.message : 'Error');
    } finally {
      setCreateLoading(false);
    }
  };

  const handleStatusChange = async (id: string, status: string) => {
    setPatchingId(id);
    try {
      const res = await fetch(`/frontend-api/tasks/user?id=${encodeURIComponent(id)}`, {
        method: 'PATCH',
        headers: { Authorization: auth, 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
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
      await fetch(`/frontend-api/tasks/user?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
        headers: { Authorization: auth },
      });
      setTasks((prev) => prev.filter((t) => t._id !== id));
    } finally {
      setDeletingId(null);
    }
  };

  const filtered = tasks.filter((t) => {
    const ms = t.title.toLowerCase().includes(search.toLowerCase()) || t.projectId.toLowerCase().includes(search.toLowerCase());
    const mp = priorityFilter === 'ALL' || t.priority === priorityFilter;
    return ms && mp;
  });

  // ─── Shared inline style objects ─────────────────────────────────────────────
  const fieldStyle: React.CSSProperties = {
    width: '100%', padding: '8px 12px',
    background: T.bgSecondary, border: `1px solid ${T.border}`, borderRadius: '4px',
    fontFamily: T.fontBody, fontSize: '0.875rem', color: T.textPrimary, outline: 'none',
  };
  const labelStyle: React.CSSProperties = {
    display: 'block', fontFamily: T.fontMono, fontSize: '0.65rem',
    letterSpacing: '0.1em', textTransform: 'uppercase', color: T.textMuted, marginBottom: '5px',
  };

  return (
    <DashboardLayout
      title="My Tasks"
      subtitle="TASKMASTER / MY TASKS"
      actions={
        <Link
          href="/tasks/create"
          style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '7px 14px', background: T.accentCyan, border: 'none', borderRadius: '3px', fontFamily: T.fontDisplay, fontWeight: 700, fontSize: '0.8rem', letterSpacing: '0.04em', color: T.darkBase, cursor: 'pointer' }}
        >
          <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          New Task
        </Link>
      }
    >
      {/* ── Create modal ── */}
      {showCreate && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: '8px', padding: '2rem', width: '100%', maxWidth: '480px' }}>
            <h3 style={{ fontFamily: T.fontDisplay, fontWeight: 800, fontSize: '1.1rem', color: T.textPrimary, marginBottom: '1.5rem' }}>New Task</h3>

            {createError && (
              <div style={{ padding: '8px 12px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: '4px', marginBottom: '1rem', fontFamily: T.fontMono, fontSize: '0.72rem', color: '#F87171' }}>
                {createError}
              </div>
            )}

            {[
              { key: 'title', label: 'Title *', placeholder: 'Task title' },
              { key: 'description', label: 'Description', placeholder: 'Optional description' },
              { key: 'projectId', label: 'Project ID *', placeholder: 'MongoDB _id of project' },
            ].map(({ key, label, placeholder }) => (
              <div key={key} style={{ marginBottom: '1.25rem' }}>
                <label style={labelStyle}>{label}</label>
                <input
                  type="text"
                  placeholder={placeholder}
                  value={createForm[key as keyof typeof createForm]}
                  onChange={(e) => setCreateForm((f) => ({ ...f, [key]: e.target.value }))}
                  style={fieldStyle}
                  onFocus={(e) => (e.currentTarget.style.borderColor = 'rgba(34,211,238,0.4)')}
                  onBlur={(e) => (e.currentTarget.style.borderColor = T.border)}
                />
              </div>
            ))}

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={labelStyle}>Priority</label>
              <select
                value={createForm.priority}
                onChange={(e) => setCreateForm((f) => ({ ...f, priority: e.target.value }))}
                style={{ ...fieldStyle, colorScheme: 'dark' }}
              >
                {['high', 'medium', 'low'].map((p) => <option key={p} value={p}>{p.toUpperCase()}</option>)}
              </select>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                onClick={handleCreate}
                disabled={createLoading}
                style={{ flex: 1, padding: '10px', background: T.accentCyan, border: 'none', borderRadius: '4px', fontFamily: T.fontDisplay, fontWeight: 700, fontSize: '0.875rem', color: T.darkBase, cursor: createLoading ? 'not-allowed' : 'pointer', opacity: createLoading ? 0.6 : 1 }}
              >
                {createLoading ? 'Creating…' : 'Create Task'}
              </button>
              <button
                onClick={() => { setShowCreate(false); setCreateError(''); setCreateForm({ title: '', description: '', projectId: '', priority: 'medium' }); }}
                style={{ padding: '10px 18px', background: 'transparent', border: `1px solid ${T.border}`, borderRadius: '4px', fontFamily: T.fontBody, fontSize: '0.875rem', color: T.textMuted, cursor: 'pointer' }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Error ── */}
      {error && (
        <div style={{ padding: '10px 14px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: '4px', marginBottom: '1.5rem', fontFamily: T.fontMono, fontSize: '0.72rem', color: '#F87171' }}>
          {error}
        </div>
      )}

      {/* ── Toolbar ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {/* Search */}
        <div style={{ position: 'relative', flex: '1 1 200px', maxWidth: '300px' }}>
          <svg width="14" height="14" fill="none" stroke={T.textMuted} strokeWidth="2" viewBox="0 0 24 24"
            style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Search tasks…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: '100%', padding: '8px 12px 8px 36px', background: T.bgSecondary, border: `1px solid ${T.border}`, borderRadius: '4px', fontFamily: T.fontBody, fontSize: '0.875rem', color: T.textPrimary, outline: 'none' }}
            onFocus={(e) => (e.currentTarget.style.borderColor = 'rgba(34,211,238,0.4)')}
            onBlur={(e) => (e.currentTarget.style.borderColor = T.border)}
          />
        </div>

        {/* Priority filter */}
        <div style={{ display: 'flex', gap: '4px', background: T.bgSecondary, border: `1px solid ${T.border}`, borderRadius: '4px', padding: '3px' }}>
          {['ALL', 'high', 'medium', 'low'].map((p) => (
            <button key={p} onClick={() => setPriorityFilter(p)}
              style={{ padding: '5px 10px', borderRadius: '3px', border: 'none', cursor: 'pointer', fontFamily: T.fontMono, fontSize: '0.65rem', letterSpacing: '0.08em', background: priorityFilter === p ? 'rgba(34,211,238,0.12)' : 'transparent', color: priorityFilter === p ? T.accentCyan : T.textMuted, transition: 'all 0.2s' }}>
              {p.toUpperCase()}
            </button>
          ))}
        </div>

        {/* View toggle */}
        <div style={{ display: 'flex', gap: '4px', background: T.bgSecondary, border: `1px solid ${T.border}`, borderRadius: '4px', padding: '3px', marginLeft: 'auto' }}>
          {(['KANBAN', 'LIST'] as ViewMode[]).map((v) => (
            <button key={v} onClick={() => setView(v)}
              style={{ padding: '5px 12px', borderRadius: '3px', border: 'none', cursor: 'pointer', fontFamily: T.fontMono, fontSize: '0.65rem', letterSpacing: '0.08em', background: view === v ? 'rgba(34,211,238,0.12)' : 'transparent', color: view === v ? T.accentCyan : T.textMuted, transition: 'all 0.2s' }}>
              {v}
            </button>
          ))}
        </div>
      </div>

      {loading && (
        <div style={{ padding: '4rem', textAlign: 'center', fontFamily: T.fontMono, fontSize: '0.72rem', color: T.textMuted, letterSpacing: '0.1em' }}>
          LOADING TASKS…
        </div>
      )}

      {/* ── KANBAN view ── */}
      {!loading && view === 'KANBAN' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', overflowX: 'auto', minWidth: 0 }}>
          {COLUMNS.map((col) => {
            const colTasks = filtered.filter((t) => t.status === col);
            return (
              <div key={col} style={{ background: T.bgSecondary, border: `1px solid ${T.border}`, borderRadius: '6px', overflow: 'hidden', minWidth: '220px' }}>
                {/* Column header */}
                <div style={{ padding: '0.875rem 1rem', borderBottom: `1px solid ${T.border}`, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: COL_ACCENT[col], flexShrink: 0 }} />
                  <span style={{ fontFamily: T.fontMono, fontSize: '0.7rem', letterSpacing: '0.1em', color: T.textSecondary, flex: 1 }}>{col}</span>
                  <span style={{ fontFamily: T.fontMono, fontSize: '0.65rem', color: T.textMuted, background: 'rgba(255,255,255,0.05)', padding: '1px 6px', borderRadius: '2px' }}>{colTasks.length}</span>
                </div>
                {/* Cards */}
                <div style={{ padding: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', minHeight: '120px' }}>
                  {colTasks.map((task) => (
                    <div
                      key={task._id}
                      style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: '4px', padding: '0.875rem', cursor: 'default', transition: 'border-color 0.2s' }}
                      onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'rgba(34,211,238,0.2)')}
                      onMouseLeave={(e) => (e.currentTarget.style.borderColor = T.border)}
                    >
                      <p style={{ fontFamily: T.fontBody, fontSize: '0.8rem', fontWeight: 500, color: task.status === 'DONE' ? T.textMuted : T.textPrimary, textDecoration: task.status === 'DONE' ? 'line-through' : 'none', marginBottom: '0.4rem', lineHeight: 1.4 }}>
                        {task.title}
                      </p>
                      {task.description && (
                        <p style={{ fontFamily: T.fontMono, fontSize: '0.62rem', color: T.textMuted, marginBottom: '0.5rem', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                          {task.description}
                        </p>
                      )}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '4px', marginBottom: '0.5rem' }}>
                        <span style={{ fontFamily: T.fontMono, fontSize: '0.6rem', letterSpacing: '0.06em', color: PRIORITY_COLOR[task.priority], background: `${PRIORITY_COLOR[task.priority]}18`, border: `1px solid ${PRIORITY_COLOR[task.priority]}30`, padding: '2px 6px', borderRadius: '2px' }}>
                          {task.priority.toUpperCase()}
                        </span>
                        <button
                          onClick={() => handleDelete(task._id)}
                          disabled={deletingId === task._id}
                          style={{ fontFamily: T.fontMono, fontSize: '0.6rem', color: 'rgba(248,113,113,0.6)', background: 'none', border: 'none', cursor: 'pointer', padding: '2px 4px' }}
                          onMouseEnter={(e) => (e.currentTarget.style.color = '#EF4444')}
                          onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(248,113,113,0.6)')}
                        >
                          {deletingId === task._id ? '…' : '✕'}
                        </button>
                      </div>
                      {/* Move to next/prev status */}
                      <div style={{ display: 'flex', gap: '3px' }}>
                        {COLUMNS.filter((c) => c !== task.status).map((c) => (
                          <button
                            key={c}
                            disabled={patchingId === task._id}
                            onClick={() => handleStatusChange(task._id, c)}
                            style={{ flex: 1, padding: '3px 4px', background: `${STATUS_COLOR[c]}18`, border: `1px solid ${STATUS_COLOR[c]}30`, borderRadius: '3px', fontFamily: T.fontMono, fontSize: '0.55rem', letterSpacing: '0.04em', color: STATUS_COLOR[c], cursor: 'pointer', opacity: patchingId === task._id ? 0.5 : 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                          >
                            {c.replace('IN ', '')}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                  {colTasks.length === 0 && (
                    <div style={{ fontFamily: T.fontMono, fontSize: '0.68rem', color: T.textMuted, textAlign: 'center', paddingTop: '1rem', letterSpacing: '0.06em' }}>
                      EMPTY
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── LIST view ── */}
      {!loading && view === 'LIST' && (
        <div style={{ background: T.bgSecondary, border: `1px solid ${T.border}`, borderRadius: '6px', overflow: 'hidden' }}>
          {/* Header row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 130px 130px 120px 100px 80px', gap: '1rem', padding: '0.75rem 1.25rem', borderBottom: `1px solid ${T.border}` }}>
            {['Task', 'Priority', 'Status', 'Project ID', 'Created', 'Action'].map((h) => (
              <span key={h} style={{ fontFamily: T.fontMono, fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: T.textMuted }}>{h}</span>
            ))}
          </div>
          {/* Data rows */}
          {filtered.map((task, i) => (
            <div
              key={task._id}
              style={{ display: 'grid', gridTemplateColumns: '1fr 130px 130px 120px 100px 80px', gap: '1rem', padding: '0.875rem 1.25rem', borderBottom: i < filtered.length - 1 ? `1px solid ${T.border}` : 'none', alignItems: 'center', transition: 'background 0.15s' }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.02)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            >
              <div>
                <div style={{ fontFamily: T.fontBody, fontWeight: 500, fontSize: '0.875rem', color: task.status === 'DONE' ? T.textMuted : T.textPrimary, textDecoration: task.status === 'DONE' ? 'line-through' : 'none', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {task.title}
                </div>
                {task.description && (
                  <div style={{ fontFamily: T.fontMono, fontSize: '0.62rem', color: T.textMuted, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginTop: '1px' }}>
                    {task.description}
                  </div>
                )}
              </div>
              <span style={{ fontFamily: T.fontMono, fontSize: '0.65rem', letterSpacing: '0.06em', color: PRIORITY_COLOR[task.priority] ?? '#94A3B8' }}>
                {task.priority.toUpperCase()}
              </span>
              {/* Inline status select */}
              <select
                value={task.status}
                disabled={patchingId === task._id}
                onChange={(e) => handleStatusChange(task._id, e.target.value)}
                style={{ background: `${STATUS_COLOR[task.status] ?? '#94A3B8'}18`, border: `1px solid ${STATUS_COLOR[task.status] ?? '#94A3B8'}40`, borderRadius: '3px', fontFamily: T.fontMono, fontSize: '0.62rem', color: STATUS_COLOR[task.status] ?? '#94A3B8', padding: '3px 6px', cursor: 'pointer', outline: 'none', colorScheme: 'dark' }}
              >
                {COLUMNS.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              <span style={{ fontFamily: T.fontMono, fontSize: '0.65rem', color: T.textMuted, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {task.projectId}
              </span>
              <span style={{ fontFamily: T.fontMono, fontSize: '0.65rem', color: T.textMuted }}>
                {new Date(task.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </span>
              <button
                onClick={() => handleDelete(task._id)}
                disabled={deletingId === task._id}
                style={{ padding: '4px 8px', background: 'transparent', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '3px', fontFamily: T.fontMono, fontSize: '0.6rem', color: '#F87171', cursor: 'pointer', opacity: deletingId === task._id ? 0.5 : 1 }}
              >
                {deletingId === task._id ? '…' : 'DEL'}
              </button>
            </div>
          ))}
          {filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: '3rem', fontFamily: T.fontMono, fontSize: '0.75rem', color: T.textMuted, letterSpacing: '0.1em' }}>
              NO TASKS FOUND
            </div>
          )}
        </div>
      )}
    </DashboardLayout>
  );
}