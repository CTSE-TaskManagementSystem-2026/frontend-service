'use client';

import { useState, useEffect, useCallback } from 'react';

interface Props { token: string; }

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

const PRIORITY_STYLE: Record<string, { color: string; bg: string; border: string }> = {
    high: { color: '#ef4444', bg: 'rgba(239,68,68,0.08)', border: 'rgba(239,68,68,0.2)' },
    medium: { color: '#f59e0b', bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.2)' },
    low: { color: '#34d399', bg: 'rgba(52,211,153,0.08)', border: 'rgba(52,211,153,0.2)' },
};

const STATUS_STYLE: Record<string, { color: string }> = {
    'TODO': { color: '#475569' },
    'IN PROGRESS': { color: '#22d3ee' },
    'IN REVIEW': { color: '#f59e0b' },
    'DONE': { color: '#34d399' },
};

export default function TasksTab({ token }: Props) {
    const auth = `Bearer ${token}`;
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [search, setSearch] = useState('');
    const [deletingId, setDeletingId] = useState('');
    const [filterStatus, setFilterStatus] = useState('ALL');

    const fetchTasks = useCallback(async () => {
        setLoading(true); setError('');
        try {
            const res = await fetch('/api/tasks/admin', { headers: { Authorization: auth } });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || data.message || 'Failed to fetch');
            setTasks(Array.isArray(data) ? data : []);
        } catch (e: unknown) {
            setError(e instanceof Error ? e.message : 'Error');
        } finally {
            setLoading(false);
        }
    }, [auth]);

    useEffect(() => { fetchTasks(); }, [fetchTasks]);

    const handleDelete = async (id: string, title: string) => {
        if (!confirm(`Delete task "${title}"? This cannot be undone.`)) return;
        setDeletingId(id);
        try {
            const res = await fetch(`/api/tasks/admin?id=${id}`, {
                method: 'DELETE',
                headers: { Authorization: auth },
            });
            if (res.ok) setTasks((prev) => prev.filter((t) => t._id !== id));
            else {
                const data = await res.json();
                setError(data.error || data.message || 'Delete failed');
            }
        } finally {
            setDeletingId('');
        }
    };

    const STATUSES = ['ALL', 'TODO', 'IN PROGRESS', 'IN REVIEW', 'DONE'];

    const filtered = tasks.filter((t) => {
        const matchSearch = t.title.toLowerCase().includes(search.toLowerCase());
        const matchStatus = filterStatus === 'ALL' || t.status === filterStatus;
        return matchSearch && matchStatus;
    });

    return (
        <>
            <style>{`
        .tasks-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1rem;
          gap: 1rem;
          flex-wrap: wrap;
        }
        .tasks-search {
          padding: 0.5rem 0.875rem;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 4px;
          font-family: 'Manrope', sans-serif;
          font-size: 0.875rem;
          color: #f1f5f9;
          outline: none;
          width: 220px;
          transition: border-color 0.2s ease;
        }
        .tasks-search:focus        { border-color: rgba(34,211,238,0.4); }
        .tasks-search::placeholder { color: #475569; }

        .status-filter-bar {
          display: flex;
          gap: 0.375rem;
          flex-wrap: wrap;
          margin-bottom: 1.5rem;
        }
        .status-filter-btn {
          padding: 0.35rem 0.875rem;
          border-radius: 2px;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.62rem;
          letter-spacing: 0.08em;
          cursor: pointer;
          transition: background 0.2s ease, color 0.2s ease;
          border: 1px solid rgba(255,255,255,0.08);
          background: transparent;
          color: #475569;
        }
        .status-filter-btn:hover    { color: #94a3b8; }
        .status-filter-btn-active {
          background: rgba(34,211,238,0.1);
          border-color: rgba(34,211,238,0.3);
          color: #22d3ee;
        }

        .tasks-table { width: 100%; border-collapse: collapse; }
        .tasks-table th {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.65rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #475569;
          text-align: left;
          padding: 0.625rem 1rem;
          border-bottom: 1px solid rgba(255,255,255,0.07);
          white-space: nowrap;
        }
        .tasks-table td {
          padding: 0.875rem 1rem;
          border-bottom: 1px solid rgba(255,255,255,0.04);
          font-family: 'Manrope', sans-serif;
          font-size: 0.875rem;
          color: #94a3b8;
          vertical-align: middle;
        }
        .tasks-table tr:last-child td { border-bottom: none; }
        .tasks-table tr:hover td     { background: rgba(255,255,255,0.02); }

        .priority-badge, .task-status-badge {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.62rem;
          letter-spacing: 0.08em;
          padding: 2px 8px;
          border-radius: 2px;
          text-transform: uppercase;
        }
        .task-delete-btn {
          padding: 0.35rem 0.75rem;
          background: transparent;
          border: 1px solid rgba(239,68,68,0.3);
          border-radius: 2px;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.62rem;
          letter-spacing: 0.06em;
          color: #ef4444;
          cursor: pointer;
          transition: background 0.2s ease;
        }
        .task-delete-btn:hover    { background: rgba(239,68,68,0.1); }
        .task-delete-btn:disabled { opacity: 0.4; cursor: not-allowed; }
      `}</style>

            <div className="tasks-header">
                <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '1rem', color: '#f1f5f9' }}>
                    Tasks
                    <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.65rem', color: '#475569', marginLeft: '0.75rem', letterSpacing: '0.08em' }}>
                        {tasks.length} TOTAL
                    </span>
                </div>
                <input
                    type="text"
                    placeholder="Search by title…"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="tasks-search"
                />
            </div>

            {/* Status filter pills */}
            <div className="status-filter-bar">
                {STATUSES.map((s) => (
                    <button
                        key={s}
                        onClick={() => setFilterStatus(s)}
                        className={`status-filter-btn ${filterStatus === s ? 'status-filter-btn-active' : ''}`}
                    >
                        {s}
                    </button>
                ))}
            </div>

            {error && (
                <div style={{ padding: '0.75rem 1rem', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '4px', fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.75rem', color: '#f87171', marginBottom: '1rem' }}>
                    {error}
                </div>
            )}

            <div style={{ background: '#0d0f1a', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '6px', overflow: 'hidden' }}>
                {loading ? (
                    <div style={{ padding: '3rem', textAlign: 'center', fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.72rem', color: '#475569', letterSpacing: '0.1em' }}>
                        LOADING TASKS…
                    </div>
                ) : filtered.length === 0 ? (
                    <div style={{ padding: '3rem', textAlign: 'center', fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.72rem', color: '#475569', letterSpacing: '0.1em' }}>
                        NO TASKS FOUND
                    </div>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table className="tasks-table">
                            <thead>
                                <tr>
                                    <th>Title</th>
                                    <th>Status</th>
                                    <th>Priority</th>
                                    <th>Project ID</th>
                                    <th>Created</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((t) => {
                                    const p = PRIORITY_STYLE[t.priority.toLowerCase()] ?? PRIORITY_STYLE.medium;
                                    const st = STATUS_STYLE[t.status] ?? { color: '#475569' };
                                    return (
                                        <tr key={t._id}>
                                            <td>
                                                <div style={{ color: '#f1f5f9', fontWeight: 500 }}>{t.title}</div>
                                                {t.description && (
                                                    <div style={{ fontSize: '0.78rem', color: '#475569', marginTop: '2px' }}>
                                                        {t.description.slice(0, 60)}{t.description.length > 60 ? '…' : ''}
                                                    </div>
                                                )}
                                            </td>
                                            <td>
                                                <span className="task-status-badge" style={{ color: st.color, border: `1px solid ${st.color}30`, background: `${st.color}10` }}>
                                                    {t.status}
                                                </span>
                                            </td>
                                            <td>
                                                <span className="priority-badge" style={{ color: p.color, background: p.bg, border: `1px solid ${p.border}` }}>
                                                    {t.priority}
                                                </span>
                                            </td>
                                            <td style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.65rem', color: '#475569' }}>
                                                {t.projectId.slice(-8)}…
                                            </td>
                                            <td style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.7rem' }}>
                                                {new Date(t.createdAt).toLocaleDateString()}
                                            </td>
                                            <td>
                                                <button
                                                    className="task-delete-btn"
                                                    disabled={deletingId === t._id}
                                                    onClick={() => handleDelete(t._id, t.title)}
                                                >
                                                    {deletingId === t._id ? '…' : 'DELETE'}
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </>
    );
}