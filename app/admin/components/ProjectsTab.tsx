'use client';

import { useState, useEffect, useCallback } from 'react';

interface Props {
    token: string;
}

interface Project {
    _id: string;
    name: string;
    description?: string;
    status: string;
    createdBy: string;
    tasksCount?: number;
    dueDate?: string;
    createdAt: string;
}

const STATUS_STYLE: Record<string, { color: string; bg: string; border: string }> = {
    active: {
        color: '#34d399',
        bg: 'rgba(52,211,153,0.10)',
        border: 'rgba(52,211,153,0.24)',
    },
    inactive: {
        color: '#94a3b8',
        bg: 'rgba(148,163,184,0.10)',
        border: 'rgba(148,163,184,0.24)',
    },
    archived: {
        color: '#f59e0b',
        bg: 'rgba(245,158,11,0.10)',
        border: 'rgba(245,158,11,0.24)',
    },
    completed: {
        color: '#818cf8',
        bg: 'rgba(129,140,248,0.10)',
        border: 'rgba(129,140,248,0.24)',
    },
};

export default function ProjectsTab({ token }: Props) {
    const auth = `Bearer ${token}`;
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [search, setSearch] = useState('');
    const [deletingId, setDeletingId] = useState('');

    const fetchProjects = useCallback(async () => {
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/frontend-api/projects/admin', {
                headers: { Authorization: auth },
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || data.error || 'Failed to fetch');
            setProjects(Array.isArray(data.projects) ? data.projects : []);
        } catch (e: unknown) {
            setError(e instanceof Error ? e.message : 'Error');
        } finally {
            setLoading(false);
        }
    }, [auth]);

    useEffect(() => {
        fetchProjects();
    }, [fetchProjects]);

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`Delete project "${name}"? This cannot be undone.`)) return;

        setDeletingId(id);
        try {
            const res = await fetch(
                `/frontend-api/projects/admin?id=${encodeURIComponent(id)}`,
                {
                    method: 'DELETE',
                    headers: { Authorization: auth },
                }
            );

            if (res.ok) {
                setProjects((prev) => prev.filter((p) => p._id !== id));
            } else {
                const data = await res.json();
                setError(data.message || data.error || 'Delete failed');
            }
        } finally {
            setDeletingId('');
        }
    };

    const filtered = projects.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[color:var(--color-text-muted)]">
                        Project Registry
                    </p>
                    <div className="mt-2 flex items-center gap-3">
                        <h3 className="text-2xl font-extrabold tracking-[-0.03em] text-[color:var(--color-text-primary)]">
                            Projects
                        </h3>
                        <span className="rounded-full border border-violet-400/20 bg-violet-500/10 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-violet-400">
                            {projects.length} total
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
                        placeholder="Search by name…"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-bg-card)] py-3 pl-11 pr-4 text-sm text-[color:var(--color-text-primary)] outline-none transition duration-200 placeholder:text-[color:var(--color-text-muted)] focus:border-[color:var(--color-border-accent)]"
                    />
                </div>
            </div>

            {error && (
                <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                    {error}
                </div>
            )}

            <div className="overflow-hidden rounded-[30px] border border-[color:var(--color-border)] bg-[color:var(--color-bg-card)] shadow-[0_24px_70px_rgba(15,23,42,0.08)]">
                {loading ? (
                    <div className="px-6 py-16 text-center font-mono text-xs uppercase tracking-[0.18em] text-[color:var(--color-text-muted)]">
                        Loading projects…
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="px-6 py-16 text-center font-mono text-xs uppercase tracking-[0.18em] text-[color:var(--color-text-muted)]">
                        No projects found
                    </div>
                ) : (
                    <>
                    <div className="space-y-3 p-3 lg:hidden">
                        {filtered.map((p) => {
                            const s = STATUS_STYLE[p.status] ?? STATUS_STYLE.inactive;

                            return (
                                <div
                                    key={p._id}
                                    className="rounded-[24px] border border-[color:var(--color-border)] bg-[color:var(--color-bg-secondary)] p-4"
                                >
                                    <div className="flex flex-wrap items-start justify-between gap-3">
                                        <div className="min-w-0 flex-1">
                                            <div className="text-sm font-semibold text-[color:var(--color-text-primary)]">
                                                {p.name}
                                            </div>

                                            {p.description && (
                                                <div className="mt-1 text-xs leading-6 text-[color:var(--color-text-muted)]">
                                                    {p.description}
                                                </div>
                                            )}
                                        </div>

                                        <span
                                            className="inline-flex rounded-full border px-3 py-1 font-mono text-[10px] uppercase tracking-[0.12em]"
                                            style={{
                                                color: s.color,
                                                background: s.bg,
                                                borderColor: s.border,
                                            }}
                                        >
                                            {p.status}
                                        </span>
                                    </div>

                                    <div className="mt-4 grid gap-3 sm:grid-cols-3">
                                        <div>
                                            <div className="mb-1 font-mono text-[10px] uppercase tracking-[0.14em] text-[color:var(--color-text-muted)]">
                                                Tasks
                                            </div>
                                            <div className="font-mono text-xs text-[color:var(--color-text-secondary)]">
                                                {p.tasksCount ?? 0}
                                            </div>
                                        </div>

                                        <div>
                                            <div className="mb-1 font-mono text-[10px] uppercase tracking-[0.14em] text-[color:var(--color-text-muted)]">
                                                Due Date
                                            </div>
                                            <div className="font-mono text-xs text-[color:var(--color-text-secondary)]">
                                                {p.dueDate ? new Date(p.dueDate).toLocaleDateString() : '-'}
                                            </div>
                                        </div>

                                        <div>
                                            <div className="mb-1 font-mono text-[10px] uppercase tracking-[0.14em] text-[color:var(--color-text-muted)]">
                                                Created
                                            </div>
                                            <div className="font-mono text-xs text-[color:var(--color-text-secondary)]">
                                                {new Date(p.createdAt).toLocaleDateString()}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-4">
                                        <button
                                            disabled={deletingId === p._id}
                                            onClick={() => handleDelete(p._id, p.name)}
                                            className="rounded-xl border border-red-500/30 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.12em] text-red-400 transition duration-200 hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-40"
                                        >
                                            {deletingId === p._id ? '...' : 'Delete'}
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="hidden overflow-x-auto lg:block">
                        <div className="min-w-[900px]">
                            <div className="grid grid-cols-[minmax(260px,1.6fr)_130px_90px_140px_140px_110px] gap-4 border-b border-[color:var(--color-border)] px-6 py-4">
                                {['Name', 'Status', 'Tasks', 'Due Date', 'Created', 'Action'].map((h) => (
                                    <span
                                        key={h}
                                        className="font-mono text-[11px] uppercase tracking-[0.14em] text-[color:var(--color-text-muted)]"
                                    >
                                        {h}
                                    </span>
                                ))}
                            </div>

                            {filtered.map((p, index) => {
                                const s = STATUS_STYLE[p.status] ?? STATUS_STYLE.inactive;

                                return (
                                    <div
                                        key={p._id}
                                        className={`grid grid-cols-[minmax(260px,1.6fr)_130px_90px_140px_140px_110px] items-center gap-4 px-6 py-4 transition duration-150 hover:bg-white/[0.02] ${index < filtered.length - 1
                                                ? 'border-b border-[color:var(--color-border)]'
                                                : ''
                                            }`}
                                    >
                                        <div className="min-w-0">
                                            <div className="truncate text-sm font-semibold text-[color:var(--color-text-primary)]">
                                                {p.name}
                                            </div>

                                            {p.description && (
                                                <div className="mt-1 truncate text-sm text-[color:var(--color-text-muted)]">
                                                    {p.description.slice(0, 60)}
                                                    {p.description.length > 60 ? '…' : ''}
                                                </div>
                                            )}
                                        </div>

                                        <div>
                                            <span
                                                className="inline-flex rounded-full border px-3 py-1 font-mono text-[10px] uppercase tracking-[0.12em]"
                                                style={{
                                                    color: s.color,
                                                    background: s.bg,
                                                    borderColor: s.border,
                                                }}
                                            >
                                                {p.status}
                                            </span>
                                        </div>

                                        <span className="font-mono text-xs text-[color:var(--color-text-secondary)]">
                                            {p.tasksCount ?? 0}
                                        </span>

                                        <span className="font-mono text-xs text-[color:var(--color-text-secondary)]">
                                            {p.dueDate ? new Date(p.dueDate).toLocaleDateString() : '—'}
                                        </span>

                                        <span className="font-mono text-xs text-[color:var(--color-text-secondary)]">
                                            {new Date(p.createdAt).toLocaleDateString()}
                                        </span>

                                        <div>
                                            <button
                                                disabled={deletingId === p._id}
                                                onClick={() => handleDelete(p._id, p.name)}
                                                className="rounded-xl border border-red-500/30 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.12em] text-red-400 transition duration-200 hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-40"
                                            >
                                                {deletingId === p._id ? '…' : 'Delete'}
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
