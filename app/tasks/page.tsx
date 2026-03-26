'use client';

import { useState, useEffect, useCallback } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import Link from 'next/link';

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

const PRIORITY_COLOR: Record<string, string> = {
  high: '#EF4444',
  medium: '#F59E0B',
  low: '#34D399',
};

const STATUS_COLOR: Record<string, string> = {
  TODO: '#64748B',
  'IN PROGRESS': '#22D3EE',
  'IN REVIEW': '#818CF8',
  DONE: '#34D399',
};

const COL_ACCENT = STATUS_COLOR;
const COLUMNS = ['TODO', 'IN PROGRESS', 'IN REVIEW', 'DONE'] as const;

type ViewMode = 'KANBAN' | 'LIST';

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [view, setView] = useState<ViewMode>('KANBAN');
  const [search, setSearch] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [showCreate, setShowCreate] = useState(false);
  const [createForm, setCreateForm] = useState({
    title: '',
    description: '',
    projectId: '',
    priority: 'medium',
  });
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState('');
  const [patchingId, setPatchingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const token =
    typeof window !== 'undefined' ? localStorage.getItem('token') : '';
  const auth = `Bearer ${token}`;

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/frontend-api/tasks/user', {
        headers: { Authorization: auth },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to load tasks');
      setTasks(Array.isArray(data) ? data : []);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Error loading tasks');
    } finally {
      setLoading(false);
    }
  }, [auth]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleCreate = async () => {
    if (!createForm.title.trim() || !createForm.projectId.trim()) {
      setCreateError('Title and Project ID are required.');
      return;
    }

    setCreateLoading(true);
    setCreateError('');

    try {
      const res = await fetch('/frontend-api/tasks/user', {
        method: 'POST',
        headers: {
          Authorization: auth,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...createForm, status: 'TODO' }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || data.details || 'Failed to create');

      setTasks((prev) => [data, ...prev]);
      setShowCreate(false);
      setCreateForm({
        title: '',
        description: '',
        projectId: '',
        priority: 'medium',
      });
    } catch (e: unknown) {
      setCreateError(e instanceof Error ? e.message : 'Error');
    } finally {
      setCreateLoading(false);
    }
  };

  const handleStatusChange = async (id: string, status: string) => {
    setPatchingId(id);

    try {
      const res = await fetch(
        `/frontend-api/tasks/user?id=${encodeURIComponent(id)}`,
        {
          method: 'PATCH',
          headers: {
            Authorization: auth,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ status }),
        }
      );

      const data = await res.json();
      if (res.ok) {
        setTasks((prev) =>
          prev.map((t) => (t._id === id ? { ...t, ...data } : t))
        );
      }
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
    const ms =
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.projectId.toLowerCase().includes(search.toLowerCase());
    const mp = priorityFilter === 'ALL' || t.priority === priorityFilter;
    return ms && mp;
  });

  return (
    <DashboardLayout
      title="My Tasks"
      subtitle="TASKMASTER / MY TASKS"
      actions={
        <Link
          href="/tasks/create"
          className="hidden items-center gap-2 rounded-2xl bg-cyan-400 px-4 py-2.5 text-sm font-semibold uppercase tracking-[0.14em] text-slate-950 transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(34,211,238,0.2)] sm:inline-flex"
        >
          <svg
            width="13"
            height="13"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            viewBox="0 0 24 24"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          New Task
        </Link>
      }
    >
      {showCreate && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-[520px] overflow-hidden rounded-[28px] border border-[color:var(--color-border)] bg-[color:var(--color-bg-card)] shadow-[0_30px_80px_rgba(15,23,42,0.2)]">
            <div className="h-20 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.16),transparent_34%),radial-gradient(circle_at_top_right,rgba(129,140,248,0.14),transparent_30%)]" />

            <div className="space-y-5 p-6 sm:p-8">
              <div>
                <h3 className="text-2xl font-extrabold tracking-[-0.03em] text-[color:var(--color-text-primary)]">
                  New Task
                </h3>
                <p className="mt-2 text-sm leading-7 text-[color:var(--color-text-secondary)]">
                  Create a new task entry for your workspace.
                </p>
              </div>

              {createError && (
                <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                  {createError}
                </div>
              )}

              <div>
                <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.2em] text-[color:var(--color-text-muted)]">
                  Title *
                </label>
                <input
                  type="text"
                  placeholder="Task title"
                  value={createForm.title}
                  onChange={(e) =>
                    setCreateForm((f) => ({ ...f, title: e.target.value }))
                  }
                  className="w-full rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-bg-secondary)] px-4 py-3 text-sm text-[color:var(--color-text-primary)] outline-none transition duration-200 placeholder:text-[color:var(--color-text-muted)] focus:border-[color:var(--color-border-accent)]"
                />
              </div>

              <div>
                <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.2em] text-[color:var(--color-text-muted)]">
                  Description
                </label>
                <input
                  type="text"
                  placeholder="Optional description"
                  value={createForm.description}
                  onChange={(e) =>
                    setCreateForm((f) => ({
                      ...f,
                      description: e.target.value,
                    }))
                  }
                  className="w-full rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-bg-secondary)] px-4 py-3 text-sm text-[color:var(--color-text-primary)] outline-none transition duration-200 placeholder:text-[color:var(--color-text-muted)] focus:border-[color:var(--color-border-accent)]"
                />
              </div>

              <div>
                <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.2em] text-[color:var(--color-text-muted)]">
                  Project ID *
                </label>
                <input
                  type="text"
                  placeholder="MongoDB _id of project"
                  value={createForm.projectId}
                  onChange={(e) =>
                    setCreateForm((f) => ({ ...f, projectId: e.target.value }))
                  }
                  className="w-full rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-bg-secondary)] px-4 py-3 text-sm text-[color:var(--color-text-primary)] outline-none transition duration-200 placeholder:text-[color:var(--color-text-muted)] focus:border-[color:var(--color-border-accent)]"
                />
              </div>

              <div>
                <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.2em] text-[color:var(--color-text-muted)]">
                  Priority
                </label>
                <select
                  value={createForm.priority}
                  onChange={(e) =>
                    setCreateForm((f) => ({ ...f, priority: e.target.value }))
                  }
                  className="w-full rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-bg-secondary)] px-4 py-3 text-sm text-[color:var(--color-text-primary)] outline-none transition duration-200 focus:border-[color:var(--color-border-accent)]"
                >
                  {['high', 'medium', 'low'].map((p) => (
                    <option key={p} value={p} className="bg-slate-900">
                      {p.toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  onClick={handleCreate}
                  disabled={createLoading}
                  className="inline-flex flex-1 items-center justify-center rounded-2xl bg-cyan-400 px-5 py-3.5 text-sm font-semibold uppercase tracking-[0.16em] text-slate-950 transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(34,211,238,0.22)] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
                >
                  {createLoading ? 'Creating…' : 'Create Task'}
                </button>

                <button
                  onClick={() => {
                    setShowCreate(false);
                    setCreateError('');
                    setCreateForm({
                      title: '',
                      description: '',
                      projectId: '',
                      priority: 'medium',
                    });
                  }}
                  className="inline-flex items-center justify-center rounded-2xl border border-[color:var(--color-border)] px-5 py-3.5 text-sm font-semibold text-[color:var(--color-text-secondary)] transition duration-200 hover:border-[color:var(--color-border-accent)] hover:text-[color:var(--color-text-primary)]"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="mb-6 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 font-mono text-xs uppercase tracking-[0.12em] text-red-300">
          {error}
        </div>
      )}

      <div className="mb-6 flex flex-wrap items-center gap-4">
        <div className="relative min-w-[220px] flex-1 sm:max-w-[320px]">
          <svg
            width="14"
            height="14"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[color:var(--color-text-muted)]"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>

          <input
            type="text"
            placeholder="Search tasks…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-bg-card)] py-3 pl-11 pr-4 text-sm text-[color:var(--color-text-primary)] outline-none transition duration-200 placeholder:text-[color:var(--color-text-muted)] focus:border-[color:var(--color-border-accent)]"
          />
        </div>

        <div className="flex flex-wrap gap-2 rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-bg-card)] p-2">
          {['ALL', 'high', 'medium', 'low'].map((p) => {
            const active = priorityFilter === p;
            return (
              <button
                key={p}
                onClick={() => setPriorityFilter(p)}
                className={`rounded-xl px-3 py-2 font-mono text-[11px] uppercase tracking-[0.12em] transition duration-200 ${active
                    ? 'bg-cyan-400/15 text-cyan-300'
                    : 'text-[color:var(--color-text-muted)] hover:bg-[color:var(--color-bg-secondary)] hover:text-[color:var(--color-text-secondary)]'
                  }`}
              >
                {p.toUpperCase()}
              </button>
            );
          })}
        </div>

        <div className="ml-auto flex gap-2 rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-bg-card)] p-2">
          {(['KANBAN', 'LIST'] as ViewMode[]).map((v) => {
            const active = view === v;
            return (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`rounded-xl px-3 py-2 font-mono text-[11px] uppercase tracking-[0.12em] transition duration-200 ${active
                    ? 'bg-cyan-400/15 text-cyan-300'
                    : 'text-[color:var(--color-text-muted)] hover:bg-[color:var(--color-bg-secondary)] hover:text-[color:var(--color-text-secondary)]'
                  }`}
              >
                {v}
              </button>
            );
          })}
        </div>
      </div>

      {loading && (
        <div className="rounded-[28px] border border-[color:var(--color-border)] bg-[color:var(--color-bg-card)] px-6 py-16 text-center font-mono text-xs uppercase tracking-[0.18em] text-[color:var(--color-text-muted)]">
          Loading tasks…
        </div>
      )}

      {!loading && view === 'KANBAN' && (
        <div className="flex gap-4 overflow-x-auto pb-2">
          {COLUMNS.map((col) => {
            const colTasks = filtered.filter((t) => t.status === col);

            return (
              <div
                key={col}
                className="min-h-[160px] min-w-[280px] flex-1 overflow-hidden rounded-[28px] border border-[color:var(--color-border)] bg-[color:var(--color-bg-card)]"
              >
                <div className="flex items-center gap-3 border-b border-[color:var(--color-border)] px-5 py-4">
                  <div
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ background: COL_ACCENT[col] }}
                  />
                  <span className="flex-1 font-mono text-[11px] uppercase tracking-[0.14em] text-[color:var(--color-text-secondary)]">
                    {col}
                  </span>
                  <span className="rounded-full border border-[color:var(--color-border)] bg-[color:var(--color-bg-secondary)] px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-[color:var(--color-text-muted)]">
                    {colTasks.length}
                  </span>
                </div>

                <div className="space-y-3 p-4">
                  {colTasks.map((task) => (
                    <div
                      key={task._id}
                      className="rounded-[22px] border border-[color:var(--color-border)] bg-[color:var(--color-bg-secondary)] p-4 transition duration-200 hover:border-[color:var(--color-border-accent)]"
                    >
                      <p
                        className="text-sm font-medium leading-6"
                        style={{
                          color:
                            task.status === 'DONE'
                              ? 'var(--color-text-muted)'
                              : 'var(--color-text-primary)',
                          textDecoration:
                            task.status === 'DONE' ? 'line-through' : 'none',
                        }}
                      >
                        {task.title}
                      </p>

                      {task.description && (
                        <p className="mt-2 line-clamp-2 font-mono text-[11px] leading-5 text-[color:var(--color-text-muted)]">
                          {task.description}
                        </p>
                      )}

                      <div className="mt-4 flex items-center justify-between gap-3">
                        <span
                          className="rounded-full border px-3 py-1 font-mono text-[10px] uppercase tracking-[0.12em]"
                          style={{
                            color: PRIORITY_COLOR[task.priority],
                            background: `${PRIORITY_COLOR[task.priority]}18`,
                            borderColor: `${PRIORITY_COLOR[task.priority]}30`,
                          }}
                        >
                          {task.priority.toUpperCase()}
                        </span>

                        <button
                          onClick={() => handleDelete(task._id)}
                          disabled={deletingId === task._id}
                          className="rounded-xl border border-red-500/20 px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-red-400 transition duration-200 hover:bg-red-500/10 disabled:opacity-50"
                        >
                          {deletingId === task._id ? '…' : 'Delete'}
                        </button>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-2">
                        {COLUMNS.filter((c) => c !== task.status).map((c) => (
                          <button
                            key={c}
                            disabled={patchingId === task._id}
                            onClick={() => handleStatusChange(task._id, c)}
                            className="rounded-xl border px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.08em] transition duration-200 disabled:opacity-50"
                            style={{
                              color: STATUS_COLOR[c],
                              background: `${STATUS_COLOR[c]}18`,
                              borderColor: `${STATUS_COLOR[c]}30`,
                            }}
                          >
                            {c.replace('IN ', '')}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}

                  {colTasks.length === 0 && (
                    <div className="rounded-[22px] border border-dashed border-[color:var(--color-border)] bg-[color:var(--color-bg-secondary)] px-4 py-8 text-center font-mono text-[11px] uppercase tracking-[0.14em] text-[color:var(--color-text-muted)]">
                      Empty
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {!loading && view === 'LIST' && (
        <div className="overflow-x-auto rounded-[28px] border border-[color:var(--color-border)] bg-[color:var(--color-bg-card)]">
          <div className="min-w-[900px]">
            <div className="grid grid-cols-[minmax(260px,1fr)_120px_150px_140px_110px_90px] gap-4 border-b border-[color:var(--color-border)] px-5 py-4">
              {['Task', 'Priority', 'Status', 'Project ID', 'Created', 'Action'].map(
                (h) => (
                  <span
                    key={h}
                    className="font-mono text-[11px] uppercase tracking-[0.14em] text-[color:var(--color-text-muted)]"
                  >
                    {h}
                  </span>
                )
              )}
            </div>

            {filtered.map((task, i) => (
              <div
                key={task._id}
                className={`grid grid-cols-[minmax(260px,1fr)_120px_150px_140px_110px_90px] items-center gap-4 px-5 py-4 transition duration-150 hover:bg-white/[0.02] ${i < filtered.length - 1
                    ? 'border-b border-[color:var(--color-border)]'
                    : ''
                  }`}
              >
                <div className="min-w-0">
                  <div
                    className="truncate text-sm font-medium"
                    style={{
                      color:
                        task.status === 'DONE'
                          ? 'var(--color-text-muted)'
                          : 'var(--color-text-primary)',
                      textDecoration:
                        task.status === 'DONE' ? 'line-through' : 'none',
                    }}
                  >
                    {task.title}
                  </div>

                  {task.description && (
                    <div className="mt-1 truncate font-mono text-[11px] text-[color:var(--color-text-muted)]">
                      {task.description}
                    </div>
                  )}
                </div>

                <span
                  className="font-mono text-[11px] uppercase tracking-[0.12em]"
                  style={{ color: PRIORITY_COLOR[task.priority] ?? '#94A3B8' }}
                >
                  {task.priority.toUpperCase()}
                </span>

                <select
                  value={task.status}
                  disabled={patchingId === task._id}
                  onChange={(e) => handleStatusChange(task._id, e.target.value)}
                  className="rounded-xl border px-3 py-2 font-mono text-[11px] uppercase tracking-[0.08em] outline-none"
                  style={{
                    color: STATUS_COLOR[task.status] ?? '#94A3B8',
                    background: `${STATUS_COLOR[task.status] ?? '#94A3B8'}18`,
                    borderColor: `${STATUS_COLOR[task.status] ?? '#94A3B8'}40`,
                  }}
                >
                  {COLUMNS.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>

                <span className="truncate font-mono text-[11px] text-[color:var(--color-text-muted)]">
                  {task.projectId}
                </span>

                <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-[color:var(--color-text-muted)]">
                  {new Date(task.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>

                <button
                  onClick={() => handleDelete(task._id)}
                  disabled={deletingId === task._id}
                  className="rounded-xl border border-red-500/30 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.12em] text-red-400 transition duration-200 hover:bg-red-500/10 disabled:opacity-50"
                >
                  {deletingId === task._id ? '…' : 'DEL'}
                </button>
              </div>
            ))}

            {filtered.length === 0 && (
              <div className="px-6 py-14 text-center font-mono text-xs uppercase tracking-[0.18em] text-[color:var(--color-text-muted)]">
                No tasks found
              </div>
            )}
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}