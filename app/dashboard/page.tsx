'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import DashboardLayout from '../components/DashboardLayout';

interface Task { _id: string; status: string; priority: string; }
interface Project {
  _id: string; name: string; description?: string; active: boolean;
  status: 'active' | 'inactive' | 'archived' | 'completed';
  dueDate?: string; tasksCount: number; createdBy: string; createdAt: string; updatedAt: string;
}
interface ProjectsSummary { totalProjects: number; activeProjects: number; overdue: number; totalTasks: number; }

const STATUS_COLOR: Record<string, string> = { active: '#22D3EE', inactive: '#64748B', archived: '#F59E0B', completed: '#34D399' };
const STATUS_LABEL: Record<string, string> = { active: 'ACTIVE', inactive: 'INACTIVE', archived: 'ARCHIVED', completed: 'COMPLETED' };
const TASK_STATUS_CLR: Record<string, string> = { TODO: '#64748B', 'IN PROGRESS': '#22D3EE', 'IN REVIEW': '#818CF8', DONE: '#34D399' };

function formatDate(iso?: string) {
  return iso ? new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—';
}

const QUICK_ACTIONS = [
  { label: 'Create Task',    href: '/tasks/create',   icon: '✚' },
  { label: 'New Project',    href: '/projects/create', icon: '◈' },
  { label: 'View Projects',  href: '/projects',        icon: '⊞' },
  { label: 'All Tasks',      href: '/tasks',           icon: '☰' },
];

export default function DashboardPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [summary, setSummary] = useState<ProjectsSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';
  const auth = `Bearer ${token}`;

  const fetchProjects = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const res = await fetch('/api/projects/user', { headers: { Authorization: auth } });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to fetch projects');
      setProjects(Array.isArray(data.projects) ? data.projects : []);
      if (data.summary) setSummary(data.summary);
    } catch (err: unknown) { setError(err instanceof Error ? err.message : 'Error'); }
    finally { setLoading(false); }
  }, [auth]);

  const fetchTasks = useCallback(async () => {
    try {
      const res = await fetch('/api/tasks/user', { headers: { Authorization: auth } });
      if (res.ok) { const data = await res.json(); setTasks(Array.isArray(data) ? data : []); }
    } catch { /* non-fatal */ }
  }, [auth]);

  useEffect(() => { fetchProjects(); fetchTasks(); }, [fetchProjects, fetchTasks]);

  const totalProjects   = summary?.totalProjects  ?? projects.length;
  const activeProjects  = summary?.activeProjects  ?? projects.filter((p) => p.status === 'active').length;
  const overdueProjects = summary?.overdue         ?? 0;
  const openTasks       = tasks.filter((t) => t.status !== 'DONE').length;

  const STAT_CARDS = [
    { label: 'My Projects',      value: String(totalProjects),   change: `${activeProjects} active`,                                         color: '#22D3EE' },
    { label: 'My Tasks',         value: String(tasks.length),    change: `${openTasks} open`,                                                color: '#F59E0B' },
    { label: 'Overdue Projects', value: String(overdueProjects), change: overdueProjects > 0 ? 'attention needed' : 'all on track',          color: overdueProjects > 0 ? '#EF4444' : '#34D399' },
    { label: 'Completed',        value: String(projects.filter((p) => p.status === 'completed').length), change: 'projects done',             color: '#818CF8' },
  ];

  return (
    <>
      <style>{`
        /* ── Design tokens (inherited/mirrored from DashboardLayout) ── */
        :root {
          --color-bg-secondary:  #0d0f1a;
          --color-text-primary:  #f0f2ff;
          --color-text-secondary:#a0a8c8;
          --color-text-muted:    #5a6280;
          --color-accent-cyan:   #22d3ee;
          --color-dark-base:     #07080f;
          --color-border:        rgba(255, 255, 255, 0.07);
        }

        /* ── Error banner ── */
        .db-error {
          padding: 0.625rem 0.875rem;
          background: rgba(239, 68, 68, 0.08);
          border: 1px solid rgba(239, 68, 68, 0.25);
          border-radius: 4px;
          margin-bottom: 1.5rem;
          font-family: monospace;
          font-size: 0.72rem;
          color: #F87171;
        }

        /* ── Stat cards grid ── */
        .db-stat-grid {
          display: grid;
          gap: 1rem;
          margin-bottom: 2rem;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        }

        .db-stat-card {
          background: var(--color-bg-secondary);
          border: 1px solid var(--color-border);
          border-radius: 6px;
          padding: 1.5rem;
          position: relative;
          overflow: hidden;
        }

        .db-stat-label {
          font-family: monospace;
          font-size: 0.68rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--color-text-muted);
          margin-bottom: 0.5rem;
        }

        .db-stat-value {
          font-weight: 800;
          font-size: 2rem;
          color: var(--color-text-primary);
          letter-spacing: -0.02em;
          line-height: 1;
          margin-bottom: 0.5rem;
        }

        /* ── Two-col layout ── */
        .db-two-col {
          display: grid;
          gap: 1rem;
          align-items: start;
          grid-template-columns: minmax(0, 1fr) 300px;
        }

        @media (max-width: 900px) {
          .db-two-col { grid-template-columns: 1fr; }
        }

        /* ── Panel (card container) ── */
        .db-panel {
          background: var(--color-bg-secondary);
          border: 1px solid var(--color-border);
          border-radius: 6px;
          overflow: hidden;
        }

        .db-panel-header {
          padding: 1.25rem 1.5rem;
          border-bottom: 1px solid var(--color-border);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .db-panel-title {
          font-weight: 700;
          font-size: 0.95rem;
          color: var(--color-text-primary);
          margin: 0;
        }

        .db-panel-link {
          font-family: monospace;
          font-size: 0.7rem;
          color: var(--color-accent-cyan);
          text-decoration: none;
          letter-spacing: 0.06em;
        }

        /* ── Loading / empty states ── */
        .db-empty {
          padding: 3rem;
          text-align: center;
          font-family: monospace;
          font-size: 0.72rem;
          color: var(--color-text-muted);
          letter-spacing: 0.1em;
        }

        /* ── Project row ── */
        .db-project-row {
          padding: 1rem 1.5rem;
          display: flex;
          align-items: center;
          gap: 1rem;
          cursor: pointer;
          transition: background 0.15s ease;
        }
        .db-project-row:hover { background: rgba(255,255,255,0.02); }

        .db-project-name {
          font-weight: 500;
          font-size: 0.875rem;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .db-project-desc {
          font-family: monospace;
          font-size: 0.68rem;
          color: var(--color-text-muted);
          margin-top: 1px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        /* ── Status badge ── */
        .db-status-badge {
          font-family: monospace;
          font-size: 0.65rem;
          letter-spacing: 0.08em;
          padding: 2px 7px;
          border-radius: 2px;
          flex-shrink: 0;
        }

        /* ── Right column panels ── */
        .db-right-col { display: flex; flex-direction: column; gap: 1rem; }

        .db-small-panel {
          background: var(--color-bg-secondary);
          border: 1px solid var(--color-border);
          border-radius: 6px;
          padding: 1.25rem;
        }

        .db-small-panel-title {
          font-family: monospace;
          font-size: 0.68rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--color-text-muted);
          margin: 0 0 1rem;
        }

        /* ── Quick action links ── */
        .db-quick-link {
          display: flex;
          align-items: center;
          gap: 0.625rem;
          padding: 9px 0.75rem;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 4px;
          text-decoration: none;
          font-size: 0.85rem;
          font-weight: 500;
          color: var(--color-text-secondary);
          transition: color 0.2s ease, border-color 0.2s ease;
          margin-bottom: 0.5rem;
        }
        .db-quick-link:last-child { margin-bottom: 0; }
        .db-quick-link:hover {
          color: var(--color-text-primary);
          border-color: rgba(34, 211, 238, 0.2);
        }

        /* ── Task status row ── */
        .db-task-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.5rem;
          margin-bottom: 0.5rem;
        }
        .db-task-row:last-child { margin-bottom: 0; }

        /* ── Recent row ── */
        .db-recent-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.5rem;
          margin-bottom: 0.5rem;
        }
        .db-recent-row:last-child { margin-bottom: 0; }

        /* ── New project action button (in header) ── */
        .db-action-btn {
          display: flex;
          align-items: center;
          gap: 0.375rem;
          padding: 7px 0.875rem;
          background: var(--color-accent-cyan);
          border-radius: 2px;
          font-weight: 700;
          font-size: 0.8rem;
          letter-spacing: 0.04em;
          color: var(--color-dark-base);
          text-decoration: none;
        }

        /* ── First-project CTA ── */
        .db-first-project-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.375rem;
          padding: 7px 0.875rem;
          background: var(--color-accent-cyan);
          border-radius: 2px;
          font-weight: 700;
          font-size: 0.8rem;
          letter-spacing: 0.04em;
          color: var(--color-dark-base);
          text-decoration: none;
        }
      `}</style>

      <DashboardLayout
        title="Dashboard"
        subtitle="TASKMASTER / MY OVERVIEW"
        actions={
          <Link href="/projects/create" className="db-action-btn">
            <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            New Project
          </Link>
        }
      >
        {error && <div className="db-error">{error}</div>}

        {/* Stat cards */}
        <div className="db-stat-grid">
          {STAT_CARDS.map((card) => (
            <div key={card.label} className="db-stat-card">
              <div className="absolute top-0 left-0 right-0" style={{ height: '2px', background: card.color, position: 'absolute', top: 0, left: 0, right: 0 }} />
              <div className="db-stat-label">{card.label}</div>
              <div className="db-stat-value">{loading ? '…' : card.value}</div>
              <div style={{ fontFamily: 'monospace', fontSize: '0.7rem', letterSpacing: '0.04em', color: card.color }}>{card.change}</div>
            </div>
          ))}
        </div>

        {/* Two-column layout */}
        <div className="db-two-col">
          {/* My Projects panel */}
          <div className="db-panel">
            <div className="db-panel-header">
              <h2 className="db-panel-title">My Projects</h2>
              <Link href="/projects" className="db-panel-link">VIEW ALL →</Link>
            </div>

            {loading && <div className="db-empty">LOADING PROJECTS…</div>}

            {!loading && projects.length === 0 && (
              <div style={{ padding: '3rem', textAlign: 'center' }}>
                <div style={{ fontFamily: 'monospace', fontSize: '0.72rem', color: 'var(--color-text-muted)', letterSpacing: '0.1em', marginBottom: '1rem' }}>
                  NO PROJECTS YET
                </div>
                <Link href="/projects/create" className="db-first-project-btn">
                  Create your first project →
                </Link>
              </div>
            )}

            {!loading && projects.slice(0, 8).map((project, i) => {
              const isOverdue = project.dueDate && new Date(project.dueDate) < new Date() && project.status !== 'completed';
              return (
                <div
                  key={project._id}
                  className="db-project-row"
                  style={{ borderBottom: i < Math.min(projects.length, 8) - 1 ? '1px solid var(--color-border)' : 'none' }}
                >
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', flexShrink: 0, background: STATUS_COLOR[project.status] }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      className="db-project-name"
                      style={{ color: project.status === 'completed' ? 'var(--color-text-muted)' : 'var(--color-text-primary)', textDecoration: project.status === 'completed' ? 'line-through' : 'none' }}
                    >
                      {project.name}
                    </div>
                    {project.description && <div className="db-project-desc">{project.description}</div>}
                  </div>
                  <span style={{ fontFamily: 'monospace', fontSize: '0.65rem', color: 'var(--color-text-muted)', flexShrink: 0 }}>{project.tasksCount} tasks</span>
                  <span
                    className="db-status-badge"
                    style={{ color: STATUS_COLOR[project.status], background: `${STATUS_COLOR[project.status]}18`, border: `1px solid ${STATUS_COLOR[project.status]}30` }}
                  >
                    {STATUS_LABEL[project.status] ?? project.status.toUpperCase()}
                  </span>
                  {project.dueDate && (
                    <span style={{ fontFamily: 'monospace', fontSize: '0.65rem', flexShrink: 0, color: isOverdue ? '#EF4444' : '#475569' }}>
                      {formatDate(project.dueDate)}
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Right column */}
          <div className="db-right-col">
            {/* Quick actions */}
            <div className="db-small-panel">
              <h3 className="db-small-panel-title">Quick Actions</h3>
              {QUICK_ACTIONS.map((a) => (
                <Link key={a.href} href={a.href} className="db-quick-link">
                  <span style={{ fontFamily: 'monospace', color: 'var(--color-accent-cyan)' }}>{a.icon}</span>
                  {a.label}
                </Link>
              ))}
            </div>

            {/* My Tasks summary */}
            <div className="db-small-panel">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 className="db-small-panel-title" style={{ margin: 0 }}>My Tasks</h3>
                <Link href="/tasks" className="db-panel-link">VIEW ALL →</Link>
              </div>
              {['TODO', 'IN PROGRESS', 'IN REVIEW', 'DONE'].map((s) => {
                const count = tasks.filter((t) => t.status === s).length;
                return (
                  <div key={s} className="db-task-row">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                      <div style={{ width: '6px', height: '6px', borderRadius: '50%', flexShrink: 0, background: TASK_STATUS_CLR[s] }} />
                      <span style={{ fontFamily: 'monospace', fontSize: '0.68rem', color: 'var(--color-text-secondary)', letterSpacing: '0.04em' }}>{s}</span>
                    </div>
                    <span style={{ fontWeight: 700, fontSize: '0.9rem', color: count > 0 ? TASK_STATUS_CLR[s] : '#334155' }}>{count}</span>
                  </div>
                );
              })}
              {tasks.length === 0 && <div style={{ fontFamily: 'monospace', fontSize: '0.65rem', color: 'var(--color-text-muted)' }}>No tasks yet</div>}
            </div>

            {/* Recently updated */}
            <div className="db-small-panel">
              <h3 className="db-small-panel-title">Recently Updated</h3>
              {loading ? (
                <div style={{ fontFamily: 'monospace', fontSize: '0.65rem', color: 'var(--color-text-muted)' }}>Loading…</div>
              ) : projects.length === 0 ? (
                <div style={{ fontFamily: 'monospace', fontSize: '0.65rem', color: 'var(--color-text-muted)' }}>No projects yet</div>
              ) : (
                [...projects]
                  .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
                  .slice(0, 5)
                  .map((p) => (
                    <div key={p._id} className="db-recent-row">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '7px', minWidth: 0 }}>
                        <div style={{ width: '6px', height: '6px', borderRadius: '50%', flexShrink: 0, background: STATUS_COLOR[p.status] }} />
                        <span style={{ fontSize: '0.78rem', color: 'var(--color-text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</span>
                      </div>
                      <span style={{ fontFamily: 'monospace', fontSize: '0.62rem', color: 'var(--color-text-muted)', flexShrink: 0 }}>{formatDate(p.updatedAt)}</span>
                    </div>
                  ))
              )}
            </div>
          </div>
        </div>
      </DashboardLayout>
    </>
  );
}