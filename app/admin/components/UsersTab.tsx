'use client';

import { useState, useEffect, useCallback } from 'react';

interface Props {
    token: string;
}

interface User {
    _id: string;
    name: string;
    email: string;
    role: string;
    createdAt: string;
}

const ROLE_STYLE: Record<string, { color: string; bg: string; border: string }> = {
    admin: {
        color: '#818cf8',
        bg: 'rgba(129,140,248,0.10)',
        border: 'rgba(129,140,248,0.24)',
    },
    user: {
        color: '#22d3ee',
        bg: 'rgba(34,211,238,0.10)',
        border: 'rgba(34,211,238,0.24)',
    },
};

export default function UsersTab({ token }: Props) {
    const auth = `Bearer ${token}`;
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [deletingId, setDeletingId] = useState('');
    const [updatingId, setUpdatingId] = useState('');
    const [search, setSearch] = useState('');

    const fetchUsers = useCallback(async () => {
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/frontend-api/auth/admin', {
                headers: { Authorization: auth },
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Failed to fetch users');

            setUsers(Array.isArray(data) ? data : (data.users ?? []));
        } catch (e: unknown) {
            setError(e instanceof Error ? e.message : 'Error');
        } finally {
            setLoading(false);
        }
    }, [auth]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const handleDelete = async (userId: string, name: string) => {
        if (!confirm(`Delete user "${name}"? This cannot be undone.`)) return;

        setDeletingId(userId);
        try {
            const res = await fetch(
                `/frontend-api/auth/admin?userId=${encodeURIComponent(userId)}`,
                {
                    method: 'DELETE',
                    headers: { Authorization: auth },
                }
            );

            if (res.ok) {
                setUsers((prev) => prev.filter((u) => u._id !== userId));
            } else {
                const data = await res.json();
                setError(data.message || 'Delete failed');
            }
        } finally {
            setDeletingId('');
        }
    };

    const handleRoleToggle = async (id: string, currentRole: string) => {
        const newRole = currentRole === 'admin' ? 'user' : 'admin';
        if (!confirm(`Change this user's role to "${newRole}"?`)) return;

        setUpdatingId(id);
        try {
            const res = await fetch('/frontend-api/auth/admin', {
                method: 'PUT',
                headers: {
                    Authorization: auth,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId: id, role: newRole }),
            });

            const data = await res.json();
            if (res.ok) {
                setUsers((prev) =>
                    prev.map((u) => (u._id === id ? { ...u, role: newRole } : u))
                );
            } else {
                setError(data.message || 'Role update failed');
            }
        } finally {
            setUpdatingId('');
        }
    };

    const filtered = users.filter(
        (u) =>
            u.name.toLowerCase().includes(search.toLowerCase()) ||
            u.email.toLowerCase().includes(search.toLowerCase())
    );

    function getInitials(name: string) {
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[color:var(--color-text-muted)]">
                        User Registry
                    </p>
                    <div className="mt-2 flex items-center gap-3">
                        <h3 className="text-2xl font-extrabold tracking-[-0.03em] text-[color:var(--color-text-primary)]">
                            Users
                        </h3>
                        <span className="rounded-full border border-violet-400/20 bg-violet-500/10 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-violet-400">
                            {users.length} total
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
                        placeholder="Search by name or email…"
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
                        Loading users…
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="px-6 py-16 text-center font-mono text-xs uppercase tracking-[0.18em] text-[color:var(--color-text-muted)]">
                        No users found
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <div className="min-w-[980px]">
                            <div className="grid grid-cols-[minmax(240px,1.4fr)_minmax(240px,1.5fr)_120px_140px_170px] gap-4 border-b border-[color:var(--color-border)] px-6 py-4">
                                {['User', 'Email', 'Role', 'Joined', 'Actions'].map((h) => (
                                    <span
                                        key={h}
                                        className="font-mono text-[11px] uppercase tracking-[0.14em] text-[color:var(--color-text-muted)]"
                                    >
                                        {h}
                                    </span>
                                ))}
                            </div>

                            {filtered.map((u, index) => {
                                const role = ROLE_STYLE[u.role] ?? ROLE_STYLE.user;

                                return (
                                    <div
                                        key={u._id}
                                        className={`grid grid-cols-[minmax(240px,1.4fr)_minmax(240px,1.5fr)_120px_140px_170px] items-center gap-4 px-6 py-4 transition duration-150 hover:bg-white/[0.02] ${index < filtered.length - 1
                                                ? 'border-b border-[color:var(--color-border)]'
                                                : ''
                                            }`}
                                    >
                                        <div className="min-w-0">
                                            <div className="flex items-center gap-3">
                                                <span className="inline-flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 via-sky-400 to-violet-500 text-[11px] font-extrabold uppercase text-slate-950">
                                                    {getInitials(u.name)}
                                                </span>
                                                <span className="truncate text-sm font-semibold text-[color:var(--color-text-primary)]">
                                                    {u.name}
                                                </span>
                                            </div>
                                        </div>

                                        <span className="truncate text-sm text-[color:var(--color-text-secondary)]">
                                            {u.email}
                                        </span>

                                        <div>
                                            <span
                                                className="inline-flex rounded-full border px-3 py-1 font-mono text-[10px] uppercase tracking-[0.12em]"
                                                style={{
                                                    color: role.color,
                                                    background: role.bg,
                                                    borderColor: role.border,
                                                }}
                                            >
                                                {u.role.toUpperCase()}
                                            </span>
                                        </div>

                                        <span className="font-mono text-xs text-[color:var(--color-text-secondary)]">
                                            {new Date(u.createdAt).toLocaleDateString()}
                                        </span>

                                        <div className="flex items-center gap-2">
                                            <button
                                                disabled={updatingId === u._id}
                                                onClick={() => handleRoleToggle(u._id, u.role)}
                                                title={`Switch to ${u.role === 'admin' ? 'user' : 'admin'}`}
                                                className="rounded-xl border border-violet-400/30 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.12em] text-violet-400 transition duration-200 hover:bg-violet-500/10 disabled:cursor-not-allowed disabled:opacity-40"
                                            >
                                                {updatingId === u._id
                                                    ? '…'
                                                    : u.role === 'admin'
                                                        ? '→ USER'
                                                        : '→ ADMIN'}
                                            </button>

                                            <button
                                                disabled={deletingId === u._id}
                                                onClick={() => handleDelete(u._id, u.name)}
                                                className="rounded-xl border border-red-500/30 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.12em] text-red-400 transition duration-200 hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-40"
                                            >
                                                {deletingId === u._id ? '…' : 'DELETE'}
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}