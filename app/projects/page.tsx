'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import DashboardLayout from '../components/DashboardLayout';

interface Project {
  _id: string;
  name: string;
  description?: string;
  status: 'active' | 'inactive' | 'archived' | 'completed';
  dueDate?: string;
  tasksCount: number;
  createdAt: string;
  updatedAt: string;
}

const STATUS_META: Record<string, { label: string; color: string }> = {
  active: { label: 'ACTIVE', color: '#22D3EE' },
  inactive: { label: 'INACTIVE', color: '#64748B' },
  archived: { label: 'ARCHIVED', color: '#F59E0B' },
  completed: { label: 'COMPLETED', color: '#34D399' },
};

const PALETTE = ['#22D3EE', '#F59E0B', '#818CF8', '#34D399', '#F87171', '#A78BFA', '#FB923C'];

function accentColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return PALETTE[Math.abs(hash) % PALETTE.length];
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d}d ago`;
  return `${Math.floor(d / 7)}w ago`;
}

type Filter = 'ALL' | 'active' | 'inactive' | 'archived' | 'completed';

const FILTER_LABELS: { value: Filter; label: string }[] = [
  { value: 'ALL', label: 'ALL' },
  { value: 'active', label: 'ACTIVE' },
  { value: 'inactive', label: 'INACTIVE' },
  { value: 'archived', label: 'ARCHIVED' },
  { value: 'completed', label: 'COMPLETED' },
];

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<Filter>('ALL');
  const [search, setSearch] = useState('');
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/frontend-api/projects/user', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to fetch projects');
      setProjects(Array.isArray(data.projects) ? data.projects : []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error');
    } finally {
      setLoading(false);
    }
  }, [token]);

  const handleDelete = async (e: React.MouseEvent, id: string, name: string) => {
    e.preventDefault();
    e.stopPropagation();

    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;

    try {
      const res = await fetch(`/frontend-api/projects/user?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        setProjects((prev) => prev.filter((p) => p._id !== id));
      } else {
        const data = await res.json();
        setError(data.message || 'Failed to delete project');
      }
    } catch {
      setError('Failed to delete project');
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const filtered = projects.filter((p) => {
    const matchFilter = filter === 'ALL' || p.status === filter;
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.description ?? '').toLowerCase().includes(search.toLowerCase());

    return matchFilter && matchSearch;
  });

  return (
    <DashboardLayout
      title="Projects"
      subtitle="TASKMASTER / MY PROJECTS"
      actions={
        <Link
          href="/projects/create"
          className="inline-flex h-10 items-center justify-center gap-2 rounded-2xl bg-cyan-400 px-3 text-sm font-semibold uppercase tracking-[0.14em] text-slate-950 transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(34,211,238,0.2)] sm:h-auto sm:px-4 sm:py-2.5"
        >
          <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          <span className="hidden sm:inline">New Project</span>
        </Link>
      }
    >
      {error && (
        <div className="mb-6 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 font-mono text-xs uppercase tracking-[0.12em] text-red-300">
          {error}
        </div>
      )}

      <div className="mb-6 flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative w-full lg:max-w-[340px] lg:flex-1">
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
            placeholder="Search projects…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-bg-card)] py-3 pl-11 pr-4 text-sm text-[color:var(--color-text-primary)] outline-none transition duration-200 placeholder:text-[color:var(--color-text-muted)] focus:border-[color:var(--color-border-accent)]"
          />
        </div>

        <div className="flex w-full flex-wrap gap-2 rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-bg-card)] p-2 lg:w-auto lg:flex-1">
          {FILTER_LABELS.map(({ value, label }) => {
            const active = filter === value;

            return (
              <button
                key={value}
                onClick={() => setFilter(value)}
                className={`rounded-xl px-3 py-2 font-mono text-[11px] uppercase tracking-[0.12em] transition duration-200 ${active
                    ? 'bg-cyan-400/15 text-cyan-300'
                    : 'text-[color:var(--color-text-muted)] hover:bg-[color:var(--color-bg-secondary)] hover:text-[color:var(--color-text-secondary)]'
                  }`}
              >
                {label}
              </button>
            );
          })}
        </div>

        {!loading && (
          <span className="self-start font-mono text-[11px] uppercase tracking-[0.12em] text-[color:var(--color-text-muted)] lg:ml-auto lg:self-center">
            {filtered.length} / {projects.length} projects
          </span>
        )}
      </div>

      {loading && (
        <div className="grid gap-4 sm:grid-cols-2 2xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-[250px] animate-pulse rounded-[28px] border border-[color:var(--color-border)] bg-[color:var(--color-bg-card)]"
            />
          ))}
        </div>
      )}

      {!loading && (
        <div className="grid gap-4 sm:grid-cols-2 2xl:grid-cols-3">
          {filtered.map((project) => {
            const meta = STATUS_META[project.status] ?? {
              label: project.status.toUpperCase(),
              color: '#94A3B8',
            };

            const accent = accentColor(project.name);
            const isOverdue =
              project.dueDate &&
              new Date(project.dueDate) < new Date() &&
              project.status !== 'completed';

            return (
              <Link
                key={project._id}
                href={`/projects/${project._id}`}
                className="group block"
              >
                <div className="relative flex h-full flex-col overflow-hidden rounded-[28px] border border-[color:var(--color-border)] bg-[color:var(--color-bg-card)] p-5 shadow-[0_24px_70px_rgba(15,23,42,0.08)] transition duration-300 hover:-translate-y-1 hover:border-[color:var(--color-border-accent)] hover:shadow-[0_28px_80px_rgba(34,211,238,0.08)] sm:p-6">
                  <div
                    className="absolute inset-x-0 top-0 h-[3px]"
                    style={{ background: accent }}
                  />

                  <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
                    <div
                      className="flex h-11 w-11 items-center justify-center rounded-2xl border text-sm font-extrabold"
                      style={{
                        background: `${accent}18`,
                        borderColor: `${accent}30`,
                        color: accent,
                      }}
                    >
                      {project.name.charAt(0).toUpperCase()}
                    </div>

                    <span
                      className="rounded-full border px-3 py-1 font-mono text-[10px] uppercase tracking-[0.14em]"
                      style={{
                        color: meta.color,
                        background: `${meta.color}18`,
                        borderColor: `${meta.color}30`,
                      }}
                    >
                      {meta.label}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold tracking-[-0.02em] text-[color:var(--color-text-primary)]">
                    {project.name}
                  </h3>

                  <p className="mt-3 flex-1 text-sm leading-7 text-[color:var(--color-text-secondary)]">
                    {project.description || 'No description provided.'}
                  </p>

                  <div className="mt-5">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-[color:var(--color-text-muted)]">
                        Tasks
                      </span>
                      <span
                        className="font-mono text-[11px] uppercase tracking-[0.12em]"
                        style={{ color: accent }}
                      >
                        {project.tasksCount}
                      </span>
                    </div>

                    <div className="h-1.5 overflow-hidden rounded-full bg-white/5">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${Math.min((project.tasksCount / 20) * 100, 100)}%`,
                          background: accent,
                        }}
                      />
                    </div>
                  </div>

                  <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-2">
                      {project.dueDate ? (
                        <>
                          <svg
                            width="12"
                            height="12"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            viewBox="0 0 24 24"
                            className={isOverdue ? 'text-red-400' : 'text-[color:var(--color-text-muted)]'}
                          >
                            <rect x="3" y="4" width="18" height="18" rx="2" />
                            <line x1="16" y1="2" x2="16" y2="6" />
                            <line x1="8" y1="2" x2="8" y2="6" />
                            <line x1="3" y1="10" x2="21" y2="10" />
                          </svg>

                          <span
                            className={`font-mono text-[11px] uppercase tracking-[0.1em] ${isOverdue ? 'text-red-400' : 'text-[color:var(--color-text-muted)]'
                              }`}
                          >
                            {new Date(project.dueDate).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                            })}
                          </span>
                        </>
                      ) : (
                        <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-[color:var(--color-text-muted)]">
                          No due date
                        </span>
                      )}
                    </div>

                    <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-[color:var(--color-text-muted)]">
                      {timeAgo(project.updatedAt)}
                    </span>
                  </div>

                  <button
                    onClick={(e) => handleDelete(e, project._id, project.name)}
                    className="mt-5 inline-flex w-fit rounded-xl border border-red-500/25 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.12em] text-red-400 transition duration-200 hover:bg-red-500/10"
                  >
                    Delete
                  </button>
                </div>
              </Link>
            );
          })}

          {filtered.length === 0 && (
            <div className="col-span-full rounded-[28px] border border-[color:var(--color-border)] bg-[color:var(--color-bg-card)] px-6 py-16 text-center shadow-[0_24px_70px_rgba(15,23,42,0.08)]">
              <div className="font-mono text-xs uppercase tracking-[0.18em] text-[color:var(--color-text-muted)]">
                {search || filter !== 'ALL' ? 'No projects match your filters' : 'No projects yet'}
              </div>

              {!search && filter === 'ALL' && (
                <Link
                  href="/projects/create"
                  className="mt-5 inline-flex rounded-2xl bg-cyan-400 px-4 py-2.5 text-sm font-semibold text-slate-950 transition duration-300 hover:-translate-y-0.5"
                >
                  Create your first project →
                </Link>
              )}
            </div>
          )}
        </div>
      )}
    </DashboardLayout>
  );
}
