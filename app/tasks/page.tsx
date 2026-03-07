'use client';

import { useState } from 'react';
import Link from 'next/link';
import DashboardLayout from '../components/DashboardLayout';

const MOCK_TASKS = [
  { id: 1, title: 'Design system audit', description: 'Audit existing components for inconsistencies.', project: 'Platform Redesign', priority: 'HIGH', status: 'IN PROGRESS', assignee: 'JD', dueDate: 'Mar 12' },
  { id: 2, title: 'API rate limiting', description: 'Implement token bucket algorithm for all endpoints.', project: 'Auth Service', priority: 'HIGH', status: 'TODO', assignee: 'AS', dueDate: 'Mar 14' },
  { id: 3, title: 'Write integration tests', description: 'Cover happy path and edge cases for task CRUD.', project: 'Tasks Service', priority: 'MEDIUM', status: 'TODO', assignee: 'MK', dueDate: 'Mar 18' },
  { id: 4, title: 'Analytics dashboard v2', description: 'Rebuild chart layer with recharts.', project: 'Analytics', priority: 'LOW', status: 'IN REVIEW', assignee: 'JD', dueDate: 'Mar 20' },
  { id: 5, title: 'Deploy to staging', description: 'Push latest build to staging env.', project: 'DevOps', priority: 'HIGH', status: 'DONE', assignee: 'AS', dueDate: 'Mar 10' },
  { id: 6, title: 'Refresh token rotation', description: 'Add silent refresh with 401 interceptor.', project: 'Auth Service', priority: 'HIGH', status: 'IN PROGRESS', assignee: 'MK', dueDate: 'Mar 13' },
  { id: 7, title: 'Responsive navbar', description: 'Add hamburger menu for mobile viewports.', project: 'Platform Redesign', priority: 'MEDIUM', status: 'DONE', assignee: 'JD', dueDate: 'Mar 8' },
  { id: 8, title: 'User onboarding flow', description: 'Step-by-step wizard after first login.', project: 'Platform Redesign', priority: 'MEDIUM', status: 'TODO', assignee: 'AS', dueDate: 'Mar 25' },
];

const COLUMNS = ['TODO', 'IN PROGRESS', 'IN REVIEW', 'DONE'];
const PRIORITY_COLOR: Record<string, string> = { HIGH: '#EF4444', MEDIUM: '#F59E0B', LOW: '#34D399' };
const STATUS_COLOR: Record<string, string> = { TODO: '#64748B', 'IN PROGRESS': '#22D3EE', 'IN REVIEW': '#818CF8', DONE: '#34D399' };
const COL_ACCENT: Record<string, string> = { TODO: '#64748B', 'IN PROGRESS': '#22D3EE', 'IN REVIEW': '#818CF8', DONE: '#34D399' };

type ViewMode = 'KANBAN' | 'LIST';

export default function TasksPage() {
  const [view, setView] = useState<ViewMode>('KANBAN');
  const [search, setSearch] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('ALL');

  const filtered = MOCK_TASKS.filter((t) => {
    const matchSearch = t.title.toLowerCase().includes(search.toLowerCase()) || t.project.toLowerCase().includes(search.toLowerCase());
    const matchPriority = priorityFilter === 'ALL' || t.priority === priorityFilter;
    return matchSearch && matchPriority;
  });

  return (
    <DashboardLayout
      title="Tasks"
      subtitle="TASKMASTER / ALL TASKS"
      actions={
        <Link
          href="/tasks/create"
          style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '7px 14px', background: 'var(--accent-cyan)', borderRadius: '3px', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.8rem', letterSpacing: '0.04em', color: '#07080F', textDecoration: 'none' }}
        >
          <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
          New Task
        </Link>
      }
    >
      {/* Toolbar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {/* Search */}
        <div style={{ position: 'relative', flex: '1 1 200px', maxWidth: '300px' }}>
          <svg width="14" height="14" fill="none" stroke="var(--text-muted)" strokeWidth="2" viewBox="0 0 24 24" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input type="text" placeholder="Search tasks…" value={search} onChange={(e) => setSearch(e.target.value)}
            style={{ width: '100%', padding: '8px 12px 8px 36px', background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: '4px', fontFamily: 'var(--font-body)', fontSize: '0.875rem', color: 'var(--text-primary)', outline: 'none' }}
            onFocus={(e) => (e.currentTarget.style.borderColor = 'rgba(34,211,238,0.4)')}
            onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--border)')} />
        </div>

        {/* Priority filter */}
        <div style={{ display: 'flex', gap: '4px', background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: '4px', padding: '3px' }}>
          {['ALL', 'HIGH', 'MEDIUM', 'LOW'].map((p) => (
            <button key={p} onClick={() => setPriorityFilter(p)}
              style={{ padding: '5px 10px', borderRadius: '3px', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.08em', background: priorityFilter === p ? 'rgba(34,211,238,0.12)' : 'transparent', color: priorityFilter === p ? 'var(--accent-cyan)' : 'var(--text-muted)', transition: 'all 0.2s' }}>
              {p}
            </button>
          ))}
        </div>

        {/* View toggle */}
        <div style={{ display: 'flex', gap: '4px', background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: '4px', padding: '3px', marginLeft: 'auto' }}>
          {(['KANBAN', 'LIST'] as ViewMode[]).map((v) => (
            <button key={v} onClick={() => setView(v)}
              style={{ padding: '5px 12px', borderRadius: '3px', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.08em', background: view === v ? 'rgba(34,211,238,0.12)' : 'transparent', color: view === v ? 'var(--accent-cyan)' : 'var(--text-muted)', transition: 'all 0.2s' }}>
              {v}
            </button>
          ))}
        </div>
      </div>

      {/* KANBAN view */}
      {view === 'KANBAN' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', overflowX: 'auto', minWidth: 0 }}>
          {COLUMNS.map((col) => {
            const colTasks = filtered.filter((t) => t.status === col);
            return (
              <div key={col} style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: '6px', overflow: 'hidden', minWidth: '220px' }}>
                {/* Column header */}
                <div style={{ padding: '0.875rem 1rem', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: COL_ACCENT[col], flexShrink: 0 }} />
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', letterSpacing: '0.1em', color: 'var(--text-secondary)', flex: 1 }}>{col}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.05)', padding: '1px 6px', borderRadius: '2px' }}>{colTasks.length}</span>
                </div>
                {/* Cards */}
                <div style={{ padding: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', minHeight: '120px' }}>
                  {colTasks.map((task) => (
                    <div key={task.id} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '4px', padding: '0.875rem', cursor: 'pointer', transition: 'border-color 0.2s, transform 0.2s' }}
                      onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(34,211,238,0.2)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'translateY(0)'; }}>
                      <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', fontWeight: 500, color: 'var(--text-primary)', marginBottom: '0.5rem', lineHeight: 1.4 }}>{task.title}</p>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--text-muted)', marginBottom: '0.625rem' }}>{task.project}</div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', letterSpacing: '0.06em', color: PRIORITY_COLOR[task.priority], background: `${PRIORITY_COLOR[task.priority]}18`, border: `1px solid ${PRIORITY_COLOR[task.priority]}30`, padding: '2px 6px', borderRadius: '2px' }}>{task.priority}</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--text-muted)' }}>{task.dueDate}</span>
                          <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: 'linear-gradient(135deg, #22D3EE, #818CF8)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.55rem', color: '#07080F' }}>{task.assignee}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                  {colTasks.length === 0 && <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--text-muted)', textAlign: 'center', paddingTop: '1rem', letterSpacing: '0.06em' }}>EMPTY</div>}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* LIST view */}
      {view === 'LIST' && (
        <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: '6px', overflow: 'hidden' }}>
          {/* Header row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 160px 80px 100px 90px 60px', gap: '1rem', padding: '0.75rem 1.25rem', borderBottom: '1px solid var(--border)' }}>
            {['Task', 'Project', 'Priority', 'Status', 'Due', 'Who'].map((h) => (
              <span key={h} style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>{h}</span>
            ))}
          </div>
          {filtered.map((task, i) => (
            <div key={task.id} style={{ display: 'grid', gridTemplateColumns: '1fr 160px 80px 100px 90px 60px', gap: '1rem', padding: '0.875rem 1.25rem', borderBottom: i < filtered.length - 1 ? '1px solid var(--border)' : 'none', alignItems: 'center', cursor: 'pointer', transition: 'background 0.15s' }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.02)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}>
              <div>
                <div style={{ fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: '0.875rem', color: task.status === 'DONE' ? 'var(--text-muted)' : 'var(--text-primary)', textDecoration: task.status === 'DONE' ? 'line-through' : 'none' }}>{task.title}</div>
              </div>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{task.project}</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.06em', color: PRIORITY_COLOR[task.priority] }}>{task.priority}</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.06em', color: STATUS_COLOR[task.status] }}>{task.status}</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-muted)' }}>{task.dueDate}</span>
              <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: 'linear-gradient(135deg, #22D3EE, #818CF8)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.6rem', color: '#07080F' }}>{task.assignee}</div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: '3rem', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-muted)', letterSpacing: '0.1em' }}>NO TASKS FOUND</div>
          )}
        </div>
      )}
    </DashboardLayout>
  );
}
