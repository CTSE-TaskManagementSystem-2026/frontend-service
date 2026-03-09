'use client';

import { useState, useEffect } from 'react';

interface Props { token: string; }

interface Summary {
    totalUsers: number;
    totalProjects: number;
    totalTasks: number;
    activeProjects: number;
}

const AUTH_API = '/api/auth/user';
const PROJECTS_API = '/api/projects/admin';
const TASKS_API = '/api/tasks/admin';

export default function OverviewTab({ token }: Props) {
    const auth = `Bearer ${token}`;
    const [summary, setSummary] = useState<Summary | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        async function load() {
            try {
                const [usersRes, projRes, tasksRes] = await Promise.all([
                    fetch(AUTH_API, { headers: { Authorization: auth } }),
                    fetch(PROJECTS_API, { headers: { Authorization: auth } }),
                    fetch(TASKS_API, { headers: { Authorization: auth } }),
                ]);

                const usersData = usersRes.ok ? await usersRes.json() : { users: [] };
                const projData = projRes.ok ? await projRes.json() : { projects: [], summary: {} };
                const tasksData = tasksRes.ok ? await tasksRes.json() : [];

                setSummary({
                    totalUsers: usersData.users?.length ?? 0,
                    totalProjects: projData.projects?.length ?? 0,
                    activeProjects: projData.summary?.activeProjects ?? 0,
                    totalTasks: Array.isArray(tasksData) ? tasksData.length : 0,
                });
            } catch {
                setError('Failed to load overview data');
            } finally {
                setLoading(false);
            }
        }
        load();
    }, [auth]);

    const STATS = summary ? [
        { label: 'Total Users', value: summary.totalUsers, icon: '⬡', color: '#22d3ee' },
        { label: 'Total Projects', value: summary.totalProjects, icon: '▣', color: '#818cf8' },
        { label: 'Active Projects', value: summary.activeProjects, icon: '◈', color: '#34d399' },
        { label: 'Total Tasks', value: summary.totalTasks, icon: '◇', color: '#f59e0b' },
    ] : [];

    return (
        <>
            <style>{`
        .ov-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1rem;
          margin-bottom: 2rem;
        }
        @media (max-width: 900px) { .ov-grid { grid-template-columns: repeat(2,1fr); } }
        @media (max-width: 500px) { .ov-grid { grid-template-columns: 1fr; } }

        .ov-card {
          background: #0d0f1a;
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 6px;
          padding: 1.5rem;
          position: relative;
          overflow: hidden;
        }
        .ov-card-icon {
          font-size: 1.4rem;
          margin-bottom: 0.75rem;
        }
        .ov-card-value {
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          font-size: 2.2rem;
          color: #f1f5f9;
          line-height: 1;
          margin-bottom: 0.375rem;
        }
        .ov-card-label {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.65rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #475569;
        }
        .ov-card-bar {
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 2px;
        }
        .ov-section-title {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.68rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #475569;
          margin-bottom: 1rem;
        }
      `}</style>

            {loading && (
                <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.75rem', color: '#475569', letterSpacing: '0.1em' }}>
                    LOADING OVERVIEW…
                </div>
            )}

            {error && (
                <div style={{ padding: '0.75rem 1rem', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '4px', fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.75rem', color: '#f87171' }}>
                    {error}
                </div>
            )}

            {!loading && summary && (
                <>
                    <div className="ov-grid">
                        {STATS.map((s) => (
                            <div key={s.label} className="ov-card">
                                <div className="ov-card-bar" style={{ background: s.color }} />
                                <div className="ov-card-icon" style={{ color: s.color }}>{s.icon}</div>
                                <div className="ov-card-value">{s.value}</div>
                                <div className="ov-card-label">{s.label}</div>
                            </div>
                        ))}
                    </div>

                    <div style={{ background: '#0d0f1a', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '6px', padding: '1.5rem' }}>
                        <div className="ov-section-title">System Status</div>
                        {[
                            { label: 'Auth Service', status: 'Operational' },
                            { label: 'Projects Service', status: 'Operational' },
                            { label: 'Tasks Service', status: 'Operational' },
                        ].map((s) => (
                            <div key={s.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                                <span style={{ fontFamily: 'Manrope, sans-serif', fontSize: '0.875rem', color: '#94a3b8' }}>{s.label}</span>
                                <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.65rem', letterSpacing: '0.08em', color: '#34d399', background: 'rgba(52,211,153,0.08)', border: '1px solid rgba(52,211,153,0.2)', padding: '2px 8px', borderRadius: '2px' }}>
                                    {s.status}
                                </span>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </>
    );
}