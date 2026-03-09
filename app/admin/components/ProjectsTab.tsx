'use client';

import { useState, useEffect, useCallback } from 'react';

interface Props { token: string; }

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
    active: { color: '#34d399', bg: 'rgba(52,211,153,0.08)', border: 'rgba(52,211,153,0.2)' },
    inactive: { color: '#94a3b8', bg: 'rgba(148,163,184,0.08)', border: 'rgba(148,163,184,0.2)' },
    archived: { color: '#475569', bg: 'rgba(71,85,105,0.08)', border: 'rgba(71,85,105,0.2)' },
    completed: { color: '#818cf8', bg: 'rgba(129,140,248,0.08)', border: 'rgba(129,140,248,0.2)' },
};

export default function ProjectsTab({ token }: Props) {
    const auth = `Bearer ${token}`;
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [search, setSearch] = useState('');
    const [deletingId, setDeletingId] = useState('');

    const fetchProjects = useCallback(async () => {
        setLoading(true); setError('');
        try {
            const res = await fetch('/api/projects/admin', { headers: { Authorization: auth } });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || data.error || 'Failed to fetch');
            setProjects(Array.isArray(data.projects) ? data.projects : []);
        } catch (e: unknown) {
            setError(e instanceof Error ? e.message : 'Error');
        } finally {
            setLoading(false);
        }
    }, [auth]);

    useEffect(() => { fetchProjects(); }, [fetchProjects]);

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`Delete project "${name}"? This cannot be undone.`)) return;
        setDeletingId(id);
        try {
            const res = await fetch(`/api/projects/admin?id=${id}`, {
                method: 'DELETE',
                headers: { Authorization: auth },
            });
            if (res.ok) setProjects((prev) => prev.filter((p) => p._id !== id));
            else {
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
        <>
            <style>{`
        .proj-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1.5rem;
          gap: 1rem;
          flex-wrap: wrap;
        }
        .proj-search {
          padding: 0.5rem 0.875rem;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 4px;
          font-family: 'Manrope', sans-serif;
          font-size: 0.875rem;
          color: #f1f5f9;
          outline: none;
          width: 260px;
          transition: border-color 0.2s ease;
        }
        .proj-search:focus        { border-color: rgba(34,211,238,0.4); }
        .proj-search::placeholder { color: #475569; }

        .proj-table { width: 100%; border-collapse: collapse; }
        .proj-table th {
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
        .proj-table td {
          padding: 0.875rem 1rem;
          border-bottom: 1px solid rgba(255,255,255,0.04);
          font-family: 'Manrope', sans-serif;
          font-size: 0.875rem;
          color: #94a3b8;
          vertical-align: middle;
        }
        .proj-table tr:last-child td { border-bottom: none; }
        .proj-table tr:hover td     { background: rgba(255,255,255,0.02); }

        .status-badge {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.62rem;
          letter-spacing: 0.08em;
          padding: 2px 8px;
          border-radius: 2px;
          text-transform: uppercase;
        }
        .proj-delete-btn {
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
        .proj-delete-btn:hover    { background: rgba(239,68,68,0.1); }
        .proj-delete-btn:disabled { opacity: 0.4; cursor: not-allowed; }
      `}</style>

            <div className="proj-header">
                <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '1rem', color: '#f1f5f9' }}>
                    Projects
                    <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.65rem', color: '#475569', marginLeft: '0.75rem', letterSpacing: '0.08em' }}>
                        {projects.length} TOTAL
                    </span>
                </div>
                <input
                    type="text"
                    placeholder="Search by name…"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="proj-search"
                />
            </div>

            {error && (
                <div style={{ padding: '0.75rem 1rem', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '4px', fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.75rem', color: '#f87171', marginBottom: '1rem' }}>
                    {error}
                </div>
            )}

            <div style={{ background: '#0d0f1a', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '6px', overflow: 'hidden' }}>
                {loading ? (
                    <div style={{ padding: '3rem', textAlign: 'center', fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.72rem', color: '#475569', letterSpacing: '0.1em' }}>
                        LOADING PROJECTS…
                    </div>
                ) : filtered.length === 0 ? (
                    <div style={{ padding: '3rem', textAlign: 'center', fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.72rem', color: '#475569', letterSpacing: '0.1em' }}>
                        NO PROJECTS FOUND
                    </div>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table className="proj-table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Status</th>
                                    <th>Tasks</th>
                                    <th>Due Date</th>
                                    <th>Created</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((p) => {
                                    const s = STATUS_STYLE[p.status] ?? STATUS_STYLE.inactive;
                                    return (
                                        <tr key={p._id}>
                                            <td>
                                                <div style={{ color: '#f1f5f9', fontWeight: 500 }}>{p.name}</div>
                                                {p.description && (
                                                    <div style={{ fontSize: '0.78rem', color: '#475569', marginTop: '2px' }}>
                                                        {p.description.slice(0, 60)}{p.description.length > 60 ? '…' : ''}
                                                    </div>
                                                )}
                                            </td>
                                            <td>
                                                <span className="status-badge" style={{ color: s.color, background: s.bg, border: `1px solid ${s.border}` }}>
                                                    {p.status}
                                                </span>
                                            </td>
                                            <td style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.78rem' }}>
                                                {p.tasksCount ?? 0}
                                            </td>
                                            <td style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.7rem' }}>
                                                {p.dueDate ? new Date(p.dueDate).toLocaleDateString() : '—'}
                                            </td>
                                            <td style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.7rem' }}>
                                                {new Date(p.createdAt).toLocaleDateString()}
                                            </td>
                                            <td>
                                                <button
                                                    className="proj-delete-btn"
                                                    disabled={deletingId === p._id}
                                                    onClick={() => handleDelete(p._id, p.name)}
                                                >
                                                    {deletingId === p._id ? '…' : 'DELETE'}
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