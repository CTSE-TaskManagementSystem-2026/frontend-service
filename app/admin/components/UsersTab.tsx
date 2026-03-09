'use client';

import { useState, useEffect, useCallback } from 'react';

interface Props { token: string; }

interface User {
    _id: string;
    name: string;
    email: string;
    role: string;
    createdAt: string;
}

export default function UsersTab({ token }: Props) {
    const auth = `Bearer ${token}`;
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [deletingId, setDeletingId] = useState('');
    const [search, setSearch] = useState('');

    const fetchUsers = useCallback(async () => {
        setLoading(true); setError('');
        try {
            const res = await fetch('/api/auth/user', { headers: { Authorization: auth } });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Failed to fetch users');
            setUsers(Array.isArray(data.users) ? data.users : []);
        } catch (e: unknown) {
            setError(e instanceof Error ? e.message : 'Error');
        } finally {
            setLoading(false);
        }
    }, [auth]);

    useEffect(() => { fetchUsers(); }, [fetchUsers]);

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`Delete user "${name}"? This cannot be undone.`)) return;
        setDeletingId(id);
        try {
            const res = await fetch(`/api/auth/user?userId=${id}`, {
                method: 'DELETE',
                headers: { Authorization: auth },
            });
            if (res.ok) setUsers((prev) => prev.filter((u) => u._id !== id));
            else {
                const data = await res.json();
                setError(data.message || 'Delete failed');
            }
        } finally {
            setDeletingId('');
        }
    };

    const filtered = users.filter(
        (u) =>
            u.name.toLowerCase().includes(search.toLowerCase()) ||
            u.email.toLowerCase().includes(search.toLowerCase())
    );

    function getInitials(name: string) {
        return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
    }

    return (
        <>
            <style>{`
        .users-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1.5rem;
          gap: 1rem;
          flex-wrap: wrap;
        }
        .users-search {
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
        .users-search:focus        { border-color: rgba(34,211,238,0.4); }
        .users-search::placeholder { color: #475569; }

        .users-table {
          width: 100%;
          border-collapse: collapse;
        }
        .users-table th {
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
        .users-table td {
          padding: 0.875rem 1rem;
          border-bottom: 1px solid rgba(255,255,255,0.04);
          font-family: 'Manrope', sans-serif;
          font-size: 0.875rem;
          color: #94a3b8;
          vertical-align: middle;
        }
        .users-table tr:last-child td { border-bottom: none; }
        .users-table tr:hover td { background: rgba(255,255,255,0.02); }

        .user-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: linear-gradient(135deg, #22d3ee, #818cf8);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          font-size: 0.65rem;
          color: #07080f;
          margin-right: 0.625rem;
          flex-shrink: 0;
        }
        .role-badge {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.62rem;
          letter-spacing: 0.08em;
          padding: 2px 8px;
          border-radius: 2px;
        }
        .role-admin {
          color: #818cf8;
          background: rgba(129,140,248,0.08);
          border: 1px solid rgba(129,140,248,0.2);
        }
        .role-user {
          color: #22d3ee;
          background: rgba(34,211,238,0.08);
          border: 1px solid rgba(34,211,238,0.2);
        }
        .delete-btn {
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
        .delete-btn:hover    { background: rgba(239,68,68,0.1); }
        .delete-btn:disabled { opacity: 0.4; cursor: not-allowed; }
      `}</style>

            <div className="users-header">
                <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '1rem', color: '#f1f5f9' }}>
                    Users
                    <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.65rem', color: '#475569', marginLeft: '0.75rem', letterSpacing: '0.08em' }}>
                        {users.length} TOTAL
                    </span>
                </div>
                <input
                    type="text"
                    placeholder="Search by name or email…"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="users-search"
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
                        LOADING USERS…
                    </div>
                ) : filtered.length === 0 ? (
                    <div style={{ padding: '3rem', textAlign: 'center', fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.72rem', color: '#475569', letterSpacing: '0.1em' }}>
                        NO USERS FOUND
                    </div>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table className="users-table">
                            <thead>
                                <tr>
                                    <th>User</th>
                                    <th>Email</th>
                                    <th>Role</th>
                                    <th>Joined</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((u) => (
                                    <tr key={u._id}>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                                <span className="user-avatar">{getInitials(u.name)}</span>
                                                <span style={{ color: '#f1f5f9', fontWeight: 500 }}>{u.name}</span>
                                            </div>
                                        </td>
                                        <td>{u.email}</td>
                                        <td>
                                            <span className={`role-badge ${u.role === 'admin' ? 'role-admin' : 'role-user'}`}>
                                                {u.role.toUpperCase()}
                                            </span>
                                        </td>
                                        <td style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.7rem' }}>
                                            {new Date(u.createdAt).toLocaleDateString()}
                                        </td>
                                        <td>
                                            <button
                                                className="delete-btn"
                                                disabled={deletingId === u._id}
                                                onClick={() => handleDelete(u._id, u.name)}
                                            >
                                                {deletingId === u._id ? '…' : 'DELETE'}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </>
    );
}