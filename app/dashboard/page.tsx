'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import DashboardLayout from '../components/DashboardLayout';

interface Task {
  _id: string;
  status: string;
  priority: string;
}

interface Project {
  _id: string;
  name: string;
  description?: string;
  active: boolean;
  status: 'active' | 'inactive' | 'archived' | 'completed';
  dueDate?: string;
  tasksCount: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

interface ProjectsSummary {
  totalProjects: number;
  activeProjects: number;
  overdue: number;
  totalTasks: number;
}

const STATUS_COLOR: Record<string, string> = {
  active: '#22D3EE',
  inactive: '#64748B',
  archived: '#F59E0B',
  completed: '#34D399',
};

const STATUS_LABEL: Record<string, string> = {
  active: 'ACTIVE',
  inactive: 'INACTIVE',
  archived: 'ARCHIVED',
  completed: 'COMPLETED',
};

const TASK_STATUS_CLR: Record<string, string> = {
  TODO: '#64748B',
  'IN PROGRESS': '#22D3EE',
  'IN REVIEW': '#818CF8',
  DONE: '#34D399',
};

function formatDate(iso?: string) {
  return iso
    ? new Date(iso).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
    : '—';
}

const QUICK_ACTIONS = [
  { label: 'Create Task', href: '/tasks/create', icon: '✚' },
  { label: 'New Project', href: '/projects/create', icon: '◈' },
  { label: 'View Projects', href: '/projects', icon: '⊞' },
  { label: 'All Tasks', href: '/tasks', icon: '☰' },
];

export default function DashboardPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [summary, setSummary] = useState<ProjectsSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const token =
    typeof window !== 'undefined' ? localStorage.getItem('token') : '';
  const auth = `Bearer ${token}`;

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/frontend-api/projects/user', {
        headers: { Authorization: auth },
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || 'Failed to fetch projects');

      setProjects(Array.isArray(data.projects) ? data.projects : []);
      if (data.summary) setSummary(data.summary);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error');
    } finally {
      setLoading(false);
    }
  }, [auth]);

  const fetchTasks = useCallback(async () => {
    try {
      const res = await fetch('/frontend-api/tasks/user', {
        headers: { Authorization: auth },
      });

      if (res.ok) {
        const data = await res.json();
        setTasks(Array.isArray(data) ? data : []);
      }
    } catch {
      /* non-fatal */
    }
  }, [auth]);

  useEffect(() => {
    fetchProjects();
    fetchTasks();
  }, [fetchProjects, fetchTasks]);

  const totalProjects = summary?.totalProjects ?? projects.length;
  const activeProjects =
    summary?.activeProjects ??
    projects.filter((p) => p.status === 'active').length;
  const overdueProjects = summary?.overdue ?? 0;
  const openTasks = tasks.filter((t) => t.status !== 'DONE').length;

  const STAT_CARDS = [
    {
      label: 'My Projects',
      value: String(totalProjects),
      change: `${activeProjects} active`,
      color: '#22D3EE',
    },
    {
      label: 'My Tasks',
      value: String(tasks.length),
      change: `${openTasks} open`,
      color: '#F59E0B',
    },
    {
      label: 'Overdue Projects',
      value: String(overdueProjects),
      change: overdueProjects > 0 ? 'attention needed' : 'all on track',
      color: overdueProjects > 0 ? '#EF4444' : '#34D399',
    },
    {
      label: 'Completed',
      value: String(projects.filter((p) => p.status === 'completed').length),
      change: 'projects done',
      color: '#818CF8',
    },
  ];

  return (
    <DashboardLayout
      title="Dashboard"
      subtitle="TASKMASTER / MY OVERVIEW"
      actions={
        <Link
          href="/projects/create"
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
          New Project
        </Link>
      }
    >
      {error && (
        <div className="mb-6 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 font-mono text-xs uppercase tracking-[0.12em] text-red-300">
          {error}
        </div>
      )}

      <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {STAT_CARDS.map((card) => (
          <div
            key={card.label}
            className="relative overflow-hidden rounded-[28px] border border-[color:var(--color-border)] bg-[color:var(--color-bg-card)] p-6 shadow-[0_24px_70px_rgba(15,23,42,0.08)]"
          >
            <div
              className="absolute inset-x-0 top-0 h-[3px]"
              style={{ background: card.color }}
            />

            <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[color:var(--color-text-muted)]">
              {card.label}
            </div>

            <div className="mt-3 text-4xl font-extrabold tracking-[-0.04em] text-[color:var(--color-text-primary)]">
              {loading ? '…' : card.value}
            </div>

            <div
              className="mt-2 font-mono text-xs uppercase tracking-[0.12em]"
              style={{ color: card.color }}
            >
              {card.change}
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="overflow-hidden rounded-[30px] border border-[color:var(--color-border)] bg-[color:var(--color-bg-card)] shadow-[0_24px_70px_rgba(15,23,42,0.08)]">
          <div className="flex items-center justify-between border-b border-[color:var(--color-border)] px-6 py-5">
            <h2 className="text-lg font-bold tracking-[-0.02em] text-[color:var(--color-text-primary)]">
              My Projects
            </h2>
            <Link
              href="/projects"
              className="font-mono text-xs uppercase tracking-[0.14em] text-cyan-300"
            >
              View all →
            </Link>
          </div>

          {loading && (
            <div className="px-6 py-14 text-center font-mono text-xs uppercase tracking-[0.18em] text-[color:var(--color-text-muted)]">
              Loading projects…
            </div>
          )}

          {!loading && projects.length === 0 && (
            <div className="px-6 py-14 text-center">
              <div className="mb-4 font-mono text-xs uppercase tracking-[0.18em] text-[color:var(--color-text-muted)]">
                No projects yet
              </div>
              <Link
                href="/projects/create"
                className="inline-flex items-center gap-2 rounded-2xl bg-cyan-400 px-4 py-2.5 text-sm font-semibold text-slate-950 transition duration-300 hover:-translate-y-0.5"
              >
                Create your first project →
              </Link>
            </div>
          )}

          {!loading &&
            projects.slice(0, 8).map((project, i) => {
              const isOverdue =
                project.dueDate &&
                new Date(project.dueDate) < new Date() &&
                project.status !== 'completed';

              return (
                <div
                  key={project._id}
                  className={`flex items-center gap-4 px-6 py-4 transition duration-150 hover:bg-white/[0.02] ${i < Math.min(projects.length, 8) - 1
                      ? 'border-b border-[color:var(--color-border)]'
                      : ''
                    }`}
                >
                  <div
                    className="h-2 w-2 flex-shrink-0 rounded-full"
                    style={{ background: STATUS_COLOR[project.status] }}
                  />

                  <div className="min-w-0 flex-1">
                    <div
                      className="truncate text-sm font-medium"
                      style={{
                        color:
                          project.status === 'completed'
                            ? 'var(--color-text-muted)'
                            : 'var(--color-text-primary)',
                        textDecoration:
                          project.status === 'completed' ? 'line-through' : 'none',
                      }}
                    >
                      {project.name}
                    </div>

                    {project.description && (
                      <div className="mt-1 truncate font-mono text-[11px] text-[color:var(--color-text-muted)]">
                        {project.description}
                      </div>
                    )}
                  </div>

                  <span className="hidden flex-shrink-0 font-mono text-[11px] uppercase tracking-[0.1em] text-[color:var(--color-text-muted)] sm:inline">
                    {project.tasksCount} tasks
                  </span>

                  <span
                    className="rounded-full border px-3 py-1 font-mono text-[10px] uppercase tracking-[0.14em]"
                    style={{
                      color: STATUS_COLOR[project.status],
                      background: `${STATUS_COLOR[project.status]}18`,
                      borderColor: `${STATUS_COLOR[project.status]}30`,
                    }}
                  >
                    {STATUS_LABEL[project.status] ?? project.status.toUpperCase()}
                  </span>

                  {project.dueDate && (
                    <span
                      className="hidden flex-shrink-0 font-mono text-[11px] uppercase tracking-[0.1em] md:inline"
                      style={{ color: isOverdue ? '#EF4444' : '#475569' }}
                    >
                      {formatDate(project.dueDate)}
                    </span>
                  )}
                </div>
              );
            })}
        </div>

        <div className="space-y-6">
          <div className="rounded-[30px] border border-[color:var(--color-border)] bg-[color:var(--color-bg-card)] p-5 shadow-[0_24px_70px_rgba(15,23,42,0.08)]">
            <h3 className="mb-4 font-mono text-xs uppercase tracking-[0.18em] text-[color:var(--color-text-muted)]">
              Quick Actions
            </h3>

            <div className="space-y-2.5">
              {QUICK_ACTIONS.map((a) => (
                <Link
                  key={a.href}
                  href={a.href}
                  className="flex items-center gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.03] px-4 py-3 text-sm font-medium text-[color:var(--color-text-secondary)] transition duration-200 hover:border-cyan-400/20 hover:text-[color:var(--color-text-primary)]"
                >
                  <span className="font-mono text-cyan-300">{a.icon}</span>
                  {a.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="rounded-[30px] border border-[color:var(--color-border)] bg-[color:var(--color-bg-card)] p-5 shadow-[0_24px_70px_rgba(15,23,42,0.08)]">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-mono text-xs uppercase tracking-[0.18em] text-[color:var(--color-text-muted)]">
                My Tasks
              </h3>
              <Link
                href="/tasks"
                className="font-mono text-xs uppercase tracking-[0.14em] text-cyan-300"
              >
                View all →
              </Link>
            </div>

            <div className="space-y-3">
              {['TODO', 'IN PROGRESS', 'IN REVIEW', 'DONE'].map((s) => {
                const count = tasks.filter((t) => t.status === s).length;

                return (
                  <div key={s} className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="h-2 w-2 rounded-full"
                        style={{ background: TASK_STATUS_CLR[s] }}
                      />
                      <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-[color:var(--color-text-secondary)]">
                        {s}
                      </span>
                    </div>

                    <span
                      className="text-sm font-bold"
                      style={{ color: count > 0 ? TASK_STATUS_CLR[s] : '#334155' }}
                    >
                      {count}
                    </span>
                  </div>
                );
              })}

              {tasks.length === 0 && (
                <div className="pt-1 font-mono text-[11px] uppercase tracking-[0.12em] text-[color:var(--color-text-muted)]">
                  No tasks yet
                </div>
              )}
            </div>
          </div>

          <div className="rounded-[30px] border border-[color:var(--color-border)] bg-[color:var(--color-bg-card)] p-5 shadow-[0_24px_70px_rgba(15,23,42,0.08)]">
            <h3 className="mb-4 font-mono text-xs uppercase tracking-[0.18em] text-[color:var(--color-text-muted)]">
              Recently Updated
            </h3>

            {loading ? (
              <div className="font-mono text-[11px] uppercase tracking-[0.12em] text-[color:var(--color-text-muted)]">
                Loading…
              </div>
            ) : projects.length === 0 ? (
              <div className="font-mono text-[11px] uppercase tracking-[0.12em] text-[color:var(--color-text-muted)]">
                No projects yet
              </div>
            ) : (
              <div className="space-y-3">
                {[...projects]
                  .sort(
                    (a, b) =>
                      new Date(b.updatedAt).getTime() -
                      new Date(a.updatedAt).getTime()
                  )
                  .slice(0, 5)
                  .map((p) => (
                    <div
                      key={p._id}
                      className="flex items-center justify-between gap-3"
                    >
                      <div className="flex min-w-0 items-center gap-2.5">
                        <div
                          className="h-2 w-2 flex-shrink-0 rounded-full"
                          style={{ background: STATUS_COLOR[p.status] }}
                        />
                        <span className="truncate text-sm text-[color:var(--color-text-secondary)]">
                          {p.name}
                        </span>
                      </div>

                      <span className="flex-shrink-0 font-mono text-[10px] uppercase tracking-[0.12em] text-[color:var(--color-text-muted)]">
                        {formatDate(p.updatedAt)}
                      </span>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}