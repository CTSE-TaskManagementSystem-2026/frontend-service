'use client';

import { useState, useEffect, useCallback } from 'react';

interface Props {
    token: string;
}

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

const PRIORITY_STYLE: Record<
    string,
    { color: string; bg: string; border: string }
> = {
    high: {
        color: '#ef4444',
        bg: 'rgba(239,68,68,0.10)',
        border: 'rgba(239,68,68,0.24)',
    },
    medium: {
        color: '#f59e0b',
        bg: 'rgba(245,158,11,0.10)',
        border: 'rgba(245,158,11,0.24)',
    },
    low: {
        color: '#34d399',
        bg: 'rgba(52,211,153,0.10)',
        border: 'rgba(52,211,153,0.24)',
    },
};

const STATUS_STYLE: Record<string, { color: string; bg: string; border: string }> = {
    TODO: {
        color: '#64748b',
        bg: 'rgba(100,116,139,0.10)',
        border: 'rgba(100,116,139,0.24)',
    },
    'IN PROGRESS': {
        color: '#22d3ee',
        bg: 'rgba(34,211,238,0.10)',
        border: 'rgba(34,211,238,0.24)',
    },
    'IN REVIEW': {
        color: '#f59e0b',
        bg: 'rgba(245,158,11,0.10)',
        border: 'rgba(245,158,11,0.24)',
    },
    DONE: {
        color: '#34d399',
        bg: 'rgba(52,211,153,0.10)',
        border: 'rgba(52,211,153,0.24)',
    },
};

const STATUSES = ['ALL', 'TODO', 'IN PROGRESS', 'IN REVIEW', 'DONE'];

export default function TasksTab({ token }: Props) {
    const auth = `Bearer ${token}`;
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [search, setSearch] = useState('');
    const [deletingId, setDeletingId] = useState('');
    const [filterStatus, setFilterStatus] = useState('ALL');

    const fetchTasks = useCallback(async () => {
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/frontend-api/tasks/admin', {
                headers: { Authorization: auth },
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || data.message || 'Failed to fetch');
            setTasks(Array.isArray(data) ? data : []);
        } catch (e: unknown) {
            setError(e instanceof Error ? e.message : 'Error');
        } finally {
            setLoading(false);
        }
    }, [auth]);

    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

    const handleDelete = async (id: string, title: string) => {
        if (!confirm(`Delete task "${title}"? This cannot be undone.`)) return;

        setDeletingId(id);
        try {
            const res = await fetch(
                `/frontend-api/tasks/admin?id=${encodeURIComponent(id)}`,
                {
                    method: 'DELETE',
                    headers: { Authorization: auth },
                }
            );

            if (res.ok) {
                setTasks((prev) => prev.filter((t) => t._id !== id));
            } else {
                const data = await res.json();
                setError(data.error || data.message || 'Delete failed');
            }
        } finally {
            setDeletingId('');
        }
    };

    const filtered = tasks.filter((t) => {
        const matchSearch = t.title.toLowerCase().includes(search.toLowerCase());
        const matchStatus = filterStatus === 'ALL' || t.status === filterStatus;
        return matchSearch && matchStatus;
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[color:var(--color-text-muted)]">
                        Task Registry
                    </p>
                    <div className="mt-2 flex items-center gap-3">
                        <h3 className="text-2xl font-extrabold tracking-[-0.03em] text-[color:var(--color-text-primary)]">
                            Tasks
                        </h3>
                        <span className="rounded-full border border-violet-400/20 bg-violet-500/10 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-violet-400">
                            {tasks.length} total
                        </span>
                    </div>
                </div>

                <div className="relative w-full sm:w-[280px]">
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
                        placeholder="Search by title…"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-bg-card)] py-3 pl-11 pr-4 text-sm text-[color:var(--color-text-primary)] outline-none transition duration-200 placeholder:text-[color:var(--color-text-muted)] focus:border-[color:var(--color-border-accent)]"
                    />
                </div>
            </div>

            <div className="flex flex-wrap gap-2">
                {STATUSES.map((s) => {
                    const active = filterStatus === s;
                    return (
                        <button
                            key={s}
                            onClick={() => setFilterStatus(s)}
                            className={`rounded-xl border px-3 py-2 font-mono text-[11px] uppercase tracking-[0.12em] transition duration-200 ${active
                                    ? 'border-violet-400/25 bg-violet-500/10 text-violet-400'
                                    : 'border-[color:var(--color-border)] bg-[color:var(--color-bg-card)] text-[color:var(--color-text-muted)] hover:text-[color:var(--color-text-secondary)]'
                                }`}
                        >
                            {s}
                        </button>
                    );
                })}
            </div>

            {error && (
                <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                    {error}
                </div>
            )}

            <div className="overflow-hidden rounded-[30px] border border-[color:var(--color-border)] bg-[color:var(--color-bg-card)] shadow-[0_24px_70px_rgba(15,23,42,0.08)]">
                {loading ? (
                    <div className="px-6 py-16 text-center font-mono text-xs uppercase tracking-[0.18em] text-[color:var(--color-text-muted)]">
                        Loading tasks…
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="px-6 py-16 text-center font-mono text-xs uppercase tracking-[0.18em] text-[color:var(--color-text-muted)]">
                        No tasks found
                    </div>
                ) : (
                    <>
                    <div className="space-y-3 p-3 lg:hidden">
                        {filtered.map((t) => {
                            const p =
                                PRIORITY_STYLE[t.priority.toLowerCase()] ?? PRIORITY_STYLE.medium;
                            const st = STATUS_STYLE[t.status] ?? STATUS_STYLE.TODO;

                            return (
                                <div
                                    key={t._id}
                                    className="rounded-[24px] border border-[color:var(--color-border)] bg-[color:var(--color-bg-secondary)] p-4"
                                >
                                    <div className="flex flex-wrap items-start justify-between gap-3">
                                        <div className="min-w-0 flex-1">
                                            <div className="text-sm font-semibold text-[color:var(--color-text-primary)]">
                                                {t.title}
                                            </div>

                                            {t.description && (
                                                <div className="mt-1 text-xs leading-6 text-[color:var(--color-text-muted)]">
                                                    {t.description}
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex flex-wrap gap-2">
                                            <span
                                                className="inline-flex rounded-full border px-3 py-1 font-mono text-[10px] uppercase tracking-[0.12em]"
                                                style={{
                                                    color: st.color,
                                                    background: st.bg,
                                                    borderColor: st.border,
                                                }}
                                            >
                                                {t.status}
                                            </span>

                                            <span
                                                className="inline-flex rounded-full border px-3 py-1 font-mono text-[10px] uppercase tracking-[0.12em]"
                                                style={{
                                                    color: p.color,
                                                    background: p.bg,
                                                    borderColor: p.border,
                                                }}
                                            >
                                                {t.priority}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                                        <div>
                                            <div className="mb-1 font-mono text-[10px] uppercase tracking-[0.14em] text-[color:var(--color-text-muted)]">
                                                Project ID
                                            </div>
                                            <div className="truncate font-mono text-xs text-[color:var(--color-text-secondary)]">
                                                {t.projectId}
                                            </div>
                                        </div>

                                        <div>
                                            <div className="mb-1 font-mono text-[10px] uppercase tracking-[0.14em] text-[color:var(--color-text-muted)]">
                                                Created
                                            </div>
                                            <div className="font-mono text-xs text-[color:var(--color-text-secondary)]">
                                                {new Date(t.createdAt).toLocaleDateString()}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-4">
                                        <button
                                            disabled={deletingId === t._id}
                                            onClick={() => handleDelete(t._id, t.title)}
                                            className="rounded-xl border border-red-500/30 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.12em] text-red-400 transition duration-200 hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-40"
                                        >
                                            {deletingId === t._id ? '...' : 'Delete'}
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="hidden overflow-x-auto lg:block">
                        <div className="min-w-[980px]">
                            <div className="grid grid-cols-[minmax(280px,1.7fr)_150px_130px_150px_140px_110px] gap-4 border-b border-[color:var(--color-border)] px-6 py-4">
                                {['Title', 'Status', 'Priority', 'Project ID', 'Created', 'Action'].map((h) => (
                                    <span
                                        key={h}
                                        className="font-mono text-[11px] uppercase tracking-[0.14em] text-[color:var(--color-text-muted)]"
                                    >
                                        {h}
                                    </span>
                                ))}
                            </div>

                            {filtered.map((t, index) => {
                                const p =
                                    PRIORITY_STYLE[t.priority.toLowerCase()] ?? PRIORITY_STYLE.medium;
                                const st = STATUS_STYLE[t.status] ?? STATUS_STYLE.TODO;

                                return (
                                    <div
                                        key={t._id}
                                        className={`grid grid-cols-[minmax(280px,1.7fr)_150px_130px_150px_140px_110px] items-center gap-4 px-6 py-4 transition duration-150 hover:bg-white/[0.02] ${index < filtered.length - 1
                                                ? 'border-b border-[color:var(--color-border)]'
                                                : ''
                                            }`}
                                    >
                                        <div className="min-w-0">
                                            <div className="truncate text-sm font-semibold text-[color:var(--color-text-primary)]">
                                                {t.title}
                                            </div>

                                            {t.description && (
                                                <div className="mt-1 truncate text-sm text-[color:var(--color-text-muted)]">
                                                    {t.description.slice(0, 60)}
                                                    {t.description.length > 60 ? '…' : ''}
                                                </div>
                                            )}
                                        </div>

                                        <div>
                                            <span
                                                className="inline-flex rounded-full border px-3 py-1 font-mono text-[10px] uppercase tracking-[0.12em]"
                                                style={{
                                                    color: st.color,
                                                    background: st.bg,
                                                    borderColor: st.border,
                                                }}
                                            >
                                                {t.status}
                                            </span>
                                        </div>

                                        <div>
                                            <span
                                                className="inline-flex rounded-full border px-3 py-1 font-mono text-[10px] uppercase tracking-[0.12em]"
                                                style={{
                                                    color: p.color,
                                                    background: p.bg,
                                                    borderColor: p.border,
                                                }}
                                            >
                                                {t.priority}
                                            </span>
                                        </div>

                                        <span className="font-mono text-xs text-[color:var(--color-text-secondary)]">
                                            {t.projectId.slice(-8)}…
                                        </span>

                                        <span className="font-mono text-xs text-[color:var(--color-text-secondary)]">
                                            {new Date(t.createdAt).toLocaleDateString()}
                                        </span>

                                        <div>
                                            <button
                                                disabled={deletingId === t._id}
                                                onClick={() => handleDelete(t._id, t.title)}
                                                className="rounded-xl border border-red-500/30 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.12em] text-red-400 transition duration-200 hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-40"
                                            >
                                                {deletingId === t._id ? '…' : 'Delete'}
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                    </>
                )}
            </div>
        </div>
    );
}
