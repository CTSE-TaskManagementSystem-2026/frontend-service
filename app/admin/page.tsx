'use client';

import { useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from './components/AdminLayout';
import OverviewTab from './components/OverviewTab';
import UsersTab from './components/UsersTab';
import ProjectsTab from './components/ProjectsTab';
import TasksTab from './components/TasksTab';

type Tab = 'Overview' | 'Users' | 'Projects' | 'Tasks';
const TABS: Tab[] = ['Overview', 'Users', 'Projects', 'Tasks'];

const TAB_META: Record<
  Tab,
  {
    icon: ReactNode;
    eyebrow: string;
    title: string;
    description: string;
    accent: string;
    soft: string;
  }
> = {
  Overview: {
    eyebrow: 'Control Center',
    title: 'Platform overview',
    description:
      'Monitor system-wide activity, totals, and service health from one place.',
    accent: 'text-cyan-400',
    soft: 'bg-cyan-400/10 border-cyan-400/20',
    icon: (
      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <rect x="3" y="3" width="7" height="7" rx="1.5" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" />
      </svg>
    ),
  },
  Users: {
    eyebrow: 'Access Management',
    title: 'Users administration',
    description:
      'Review accounts, search users quickly, and manage roles with better visibility.',
    accent: 'text-violet-400',
    soft: 'bg-violet-500/10 border-violet-400/20',
    icon: (
      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  Projects: {
    eyebrow: 'Workspace Registry',
    title: 'Projects administration',
    description:
      'Track project records, statuses, deadlines, and overall portfolio structure.',
    accent: 'text-emerald-400',
    soft: 'bg-emerald-500/10 border-emerald-400/20',
    icon: (
      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
  Tasks: {
    eyebrow: 'Execution Tracking',
    title: 'Tasks administration',
    description:
      'Inspect work items, monitor flow, and keep operational workload organized.',
    accent: 'text-amber-400',
    soft: 'bg-amber-500/10 border-amber-400/20',
    icon: (
      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <polyline points="9 11 12 14 22 4" />
        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
      </svg>
    ),
  },
};

export default function AdminPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>('Overview');
  const [token, setToken] = useState('');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const t = localStorage.getItem('token') ?? '';
    const role = localStorage.getItem('role') ?? '';
    if (!t || role !== 'admin') {
      router.replace('/login');
      return;
    }
    setToken(t);
    setReady(true);
  }, [router]);

  if (!ready) return null;

  const activeMeta = TAB_META[activeTab];

  return (
    <AdminLayout title="Admin" subtitle="TASKMASTER / ADMIN PANEL">
      <div className="space-y-6">
        <section className="relative overflow-hidden rounded-[32px] border border-[color:var(--color-border)] bg-[color:var(--color-bg-card)] shadow-[0_30px_80px_rgba(15,23,42,0.10)]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(129,140,248,0.16),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(34,211,238,0.10),transparent_28%)]" />
          <div className="absolute inset-0 opacity-[0.06] [background-image:linear-gradient(rgba(148,163,184,0.35)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.35)_1px,transparent_1px)] [background-size:42px_42px]" />

          <div className="relative p-6 sm:p-8">
            <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
              <div>
                <div
                  className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] ${activeMeta.soft} ${activeMeta.accent}`}
                >
                  <span className="inline-flex">{activeMeta.icon}</span>
                  {activeMeta.eyebrow}
                </div>

                <h2 className="mt-5 text-3xl font-extrabold tracking-[-0.04em] text-[color:var(--color-text-primary)] sm:text-4xl">
                  {activeMeta.title}
                </h2>

                <p className="mt-4 max-w-2xl text-sm leading-7 text-[color:var(--color-text-secondary)] sm:text-base">
                  {activeMeta.description}
                </p>

                <div className="mt-6 flex flex-wrap gap-3">
                  <div className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-bg-secondary)] px-4 py-3">
                    <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[color:var(--color-text-muted)]">
                      Scope
                    </p>
                    <p className="mt-1 text-sm font-semibold text-[color:var(--color-text-primary)]">
                      Full admin visibility
                    </p>
                  </div>

                  <div className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-bg-secondary)] px-4 py-3">
                    <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[color:var(--color-text-muted)]">
                      Access level
                    </p>
                    <p className="mt-1 text-sm font-semibold text-violet-400">
                      Administrator
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-2">
                {TABS.map((tab) => {
                  const meta = TAB_META[tab];
                  const active = activeTab === tab;

                  return (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`group rounded-[24px] border p-5 text-left transition duration-300 ${active
                          ? 'border-[color:var(--color-border-accent)] bg-[color:var(--color-bg-secondary)] shadow-[0_20px_50px_rgba(15,23,42,0.10)]'
                          : 'border-[color:var(--color-border)] bg-[color:var(--color-bg-secondary)]/70 hover:-translate-y-1 hover:border-[color:var(--color-border-accent)]'
                        }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div
                          className={`inline-flex h-11 w-11 items-center justify-center rounded-2xl border ${meta.soft} ${meta.accent}`}
                        >
                          {meta.icon}
                        </div>

                        {active && (
                          <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-cyan-300">
                            Active
                          </span>
                        )}
                      </div>

                      <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.14em] text-[color:var(--color-text-muted)]">
                        {meta.eyebrow}
                      </p>

                      <h3 className="mt-2 text-lg font-bold tracking-[-0.02em] text-[color:var(--color-text-primary)]">
                        {tab}
                      </h3>

                      <p className="mt-2 text-sm leading-6 text-[color:var(--color-text-secondary)]">
                        {meta.description}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-[30px] border border-[color:var(--color-border)] bg-[color:var(--color-bg-card)] p-2 shadow-[0_24px_70px_rgba(15,23,42,0.08)]">
          <div className="flex flex-wrap gap-2">
            {TABS.map((tab) => {
              const active = activeTab === tab;
              const meta = TAB_META[tab];

              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`inline-flex items-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold transition duration-200 ${active
                      ? 'bg-[color:var(--color-bg-secondary)] text-[color:var(--color-text-primary)] shadow-[0_12px_30px_rgba(15,23,42,0.10)]'
                      : 'text-[color:var(--color-text-secondary)] hover:bg-[color:var(--color-bg-secondary)] hover:text-[color:var(--color-text-primary)]'
                    }`}
                >
                  <span className={meta.accent}>{meta.icon}</span>
                  {tab}
                </button>
              );
            })}
          </div>
        </section>

        <section className="space-y-6">
          {activeTab === 'Overview' && <OverviewTab token={token} />}
          {activeTab === 'Users' && <UsersTab token={token} />}
          {activeTab === 'Projects' && <ProjectsTab token={token} />}
          {activeTab === 'Tasks' && <TasksTab token={token} />}
        </section>
      </div>
    </AdminLayout>
  );
}