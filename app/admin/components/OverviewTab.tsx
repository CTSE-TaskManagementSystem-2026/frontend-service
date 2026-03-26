'use client';

import { useState, useEffect } from 'react';

interface Props {
    token: string;
}

interface Summary {
    totalUsers: number;
    totalProjects: number;
    totalTasks: number;
    activeProjects: number;
}

export default function OverviewTab({ token }: Props) {
    const auth = `Bearer ${token}`;
    const [summary, setSummary] = useState<Summary | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        async function load() {
            try {
                const [usersRes, projRes, tasksRes] = await Promise.all([
                    fetch('/frontend-api/auth/admin', {
                        headers: { Authorization: auth },
                    }),
                    fetch('/frontend-api/projects/admin', {
                        headers: { Authorization: auth },
                    }),
                    fetch('/frontend-api/tasks/admin', {
                        headers: { Authorization: auth },
                    }),
                ]);

                const usersData = usersRes.ok ? await usersRes.json() : { users: [] };
                const projData = projRes.ok
                    ? await projRes.json()
                    : { projects: [], summary: {} };
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

    const STATS = summary
        ? [
            {
                label: 'Total Users',
                value: summary.totalUsers,
                icon: '⬡',
                color: '#22d3ee',
            },
            {
                label: 'Total Projects',
                value: summary.totalProjects,
                icon: '▣',
                color: '#818cf8',
            },
            {
                label: 'Active Projects',
                value: summary.activeProjects,
                icon: '◈',
                color: '#34d399',
            },
            {
                label: 'Total Tasks',
                value: summary.totalTasks,
                icon: '◇',
                color: '#f59e0b',
            },
        ]
        : [];

    return (
        <div className="space-y-6">
            {loading && (
                <div className="rounded-[24px] border border-[color:var(--color-border)] bg-[color:var(--color-bg-card)] px-6 py-10 text-center font-mono text-xs uppercase tracking-[0.18em] text-[color:var(--color-text-muted)] shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
                    Loading overview…
                </div>
            )}

            {error && (
                <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                    {error}
                </div>
            )}

            {!loading && summary && (
                <>
                    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                        {STATS.map((s) => (
                            <div
                                key={s.label}
                                className="relative overflow-hidden rounded-[28px] border border-[color:var(--color-border)] bg-[color:var(--color-bg-card)] p-6 shadow-[0_24px_70px_rgba(15,23,42,0.08)] transition duration-300 hover:-translate-y-1 hover:border-[color:var(--color-border-accent)]"
                            >
                                <div
                                    className="absolute inset-x-0 top-0 h-[3px]"
                                    style={{ background: s.color }}
                                />

                                <div
                                    className="mb-4 text-2xl leading-none"
                                    style={{ color: s.color }}
                                >
                                    {s.icon}
                                </div>

                                <div className="text-4xl font-extrabold tracking-[-0.04em] text-[color:var(--color-text-primary)] sm:text-5xl">
                                    {s.value}
                                </div>

                                <div className="mt-3 font-mono text-[11px] uppercase tracking-[0.14em] text-[color:var(--color-text-muted)]">
                                    {s.label}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="overflow-hidden rounded-[30px] border border-[color:var(--color-border)] bg-[color:var(--color-bg-card)] shadow-[0_24px_70px_rgba(15,23,42,0.08)]">
                        <div className="border-b border-[color:var(--color-border)] px-6 py-5">
                            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[color:var(--color-text-muted)]">
                                System Status
                            </p>
                            <h3 className="mt-2 text-2xl font-bold tracking-[-0.02em] text-[color:var(--color-text-primary)]">
                                Service health overview
                            </h3>
                        </div>

                        <div className="px-6 py-2">
                            {[
                                { label: 'Auth Service', status: 'Operational' },
                                { label: 'Projects Service', status: 'Operational' },
                                { label: 'Tasks Service', status: 'Operational' },
                            ].map((s, index, arr) => (
                                <div
                                    key={s.label}
                                    className={`flex items-center justify-between gap-4 py-4 ${index < arr.length - 1
                                            ? 'border-b border-[color:var(--color-border)]'
                                            : ''
                                        }`}
                                >
                                    <span className="text-sm font-medium text-[color:var(--color-text-secondary)]">
                                        {s.label}
                                    </span>

                                    <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-emerald-500">
                                        <span className="h-2 w-2 rounded-full bg-emerald-500" />
                                        {s.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}