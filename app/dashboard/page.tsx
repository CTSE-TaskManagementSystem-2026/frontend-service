'use client';

import Link from 'next/link';
import DashboardLayout from '../components/DashboardLayout';

const STAT_CARDS = [
    { label: 'Active Projects', value: '12', change: '+2 this week', color: '#22D3EE' },
    { label: 'Open Tasks', value: '47', change: '8 due today', color: '#F59E0B' },
    { label: 'Completed', value: '134', change: '+23 this month', color: '#34D399' },
    { label: 'Team Members', value: '9', change: '2 online now', color: '#818CF8' },
];

const RECENT_TASKS = [
    { id: 1, title: 'Design system audit', project: 'Platform Redesign', priority: 'HIGH', status: 'IN PROGRESS' },
    { id: 2, title: 'API rate limiting', project: 'Auth Service', priority: 'HIGH', status: 'TODO' },
    { id: 3, title: 'Write integration tests', project: 'Tasks Service', priority: 'MEDIUM', status: 'TODO' },
    { id: 4, title: 'Analytics dashboard v2', project: 'Analytics', priority: 'LOW', status: 'IN REVIEW' },
    { id: 5, title: 'Deploy to staging', project: 'DevOps', priority: 'HIGH', status: 'DONE' },
];

const PRIORITY_COLOR: Record<string, string> = {
    HIGH: '#EF4444', MEDIUM: '#F59E0B', LOW: '#34D399',
};
const STATUS_COLOR: Record<string, string> = {
    TODO: '#64748B', 'IN PROGRESS': '#22D3EE', 'IN REVIEW': '#818CF8', DONE: '#34D399',
};

export default function DashboardPage() {
    return (
        <DashboardLayout
      title= "Dashboard"
    subtitle = "TASKMASTER / OVERVIEW"
    actions = {
        < Link
    href = "/projects/create"
    style = {{ display: 'flex', alignItems: 'center', gap: '6px', padding: '7px 14px', background: 'var(--accent-cyan)', border: 'none', borderRadius: '3px', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.8rem', letterSpacing: '0.04em', color: '#07080F', textDecoration: 'none', cursor: 'pointer' }
}
        >
    <svg width="13" height = "13" fill = "none" stroke = "currentColor" strokeWidth = "2.5" viewBox = "0 0 24 24" >
        <line x1="12" y1 = "5" x2 = "12" y2 = "19" /> <line x1="5" y1 = "12" x2 = "19" y2 = "12" />
            </svg>
          New Project
    </Link>
      }
    >
    {/* Stat cards */ }
    < div style = {{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
    {
        STAT_CARDS.map((card) => (
            <div
            key= { card.label }
            style = {{
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border)',
            borderRadius: '6px',
            padding: '1.5rem',
            position: 'relative',
            overflow: 'hidden',
        }}
        >
        <div style={ { position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: card.color } } />
            < div style = {{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                { card.label }
                </div>
                < div style = {{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '2rem', color: 'var(--text-primary)', letterSpacing: '-0.02em', lineHeight: 1, marginBottom: '0.5rem' }}>
                    { card.value }
                    </div>
                    < div style = {{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: card.color, letterSpacing: '0.04em' }}>
                        { card.change }
                        </div>
                        </div>
        ))}
</div>

{/* Two-column: recent tasks + quick actions */ }
<div style={ { display: 'grid', gridTemplateColumns: '1fr 300px', gap: '1rem', alignItems: 'start' } }>
    {/* Recent Tasks */ }
    < div style = {{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: '6px', overflow: 'hidden' }}>
        <div style={ { padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' } }>
            <h2 style={ { fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)' } }> Recent Tasks </h2>
                < Link href = "/tasks" style = {{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--accent-cyan)', textDecoration: 'none', letterSpacing: '0.06em' }}> VIEW ALL →</Link>
                    </div>
                    <div>
{
    RECENT_TASKS.map((task, i) => (
        <div
                key= { task.id }
                style = {{ padding: '1rem 1.5rem', borderBottom: i < RECENT_TASKS.length - 1 ? '1px solid var(--border)' : 'none', display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer', transition: 'background 0.15s' }}
onMouseEnter = {(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.02)')}
onMouseLeave = {(e) => (e.currentTarget.style.background = 'transparent')}
              >
    {/* Status dot */ }
    < div style = {{ width: '8px', height: '8px', borderRadius: '50%', background: STATUS_COLOR[task.status], flexShrink: 0 }} />
        < div style = {{ flex: 1, minWidth: 0 }}>
            <div style={ { fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: '0.875rem', color: task.status === 'DONE' ? 'var(--text-muted)' : 'var(--text-primary)', textDecoration: task.status === 'DONE' ? 'line-through' : 'none', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } }>
                { task.title }
                </div>
                < div style = {{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '1px' }}> { task.project } </div>
                    </div>
                    < span style = {{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.08em', color: PRIORITY_COLOR[task.priority], background: `${PRIORITY_COLOR[task.priority]}18`, border: `1px solid ${PRIORITY_COLOR[task.priority]}30`, padding: '2px 7px', borderRadius: '2px', flexShrink: 0 }}>
                        { task.priority }
                        </span>
                        < span style = {{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.06em', color: STATUS_COLOR[task.status], flexShrink: 0 }}>
                            { task.status }
                            </span>
                            </div>
            ))}
</div>
    </div>

{/* Quick actions + info */ }
<div style={ { display: 'flex', flexDirection: 'column', gap: '1rem' } }>
    {/* Quick actions */ }
    < div style = {{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: '6px', padding: '1.25rem' }}>
        <h3 style={ { fontFamily: 'var(--font-mono)', fontSize: '0.68rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '1rem' } }> Quick Actions </h3>
            < div style = {{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {
                [
                    { label: 'Create Task', href: '/tasks/create', icon: '✚' },
                    { label: 'New Project', href: '/projects/create', icon: '◈' },
                    { label: 'View Projects', href: '/projects', icon: '⊞' },
                    { label: 'All Tasks', href: '/tasks', icon: '☰' },
              ].map((a) => (
                        <Link key= { a.href } href = { a.href } style = {{ display: 'flex', alignItems: 'center', gap: '10px', padding: '9px 12px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '4px', textDecoration: 'none', fontFamily: 'var(--font-body)', fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-secondary)', transition: 'all 0.2s' }}
onMouseEnter = {(e) => { e.currentTarget.style.color = 'var(--text-primary)'; e.currentTarget.style.borderColor = 'rgba(34,211,238,0.2)'; }}
onMouseLeave = {(e) => { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; }}>
    <span style={ { fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)' } }> { a.icon } </span>
{ a.label }
</Link>
              ))}
</div>
    </div>

{/* Services health */ }
<div style={ { background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: '6px', padding: '1.25rem' } }>
    <h3 style={ { fontFamily: 'var(--font-mono)', fontSize: '0.68rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '1rem' } }> Service Health </h3>
        < div style = {{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {
            [
                { name: 'auth-service', port: ':4001', status: 'healthy' },
                { name: 'projects-service', port: ':4002', status: 'healthy' },
                { name: 'tasks-service', port: ':4003', status: 'healthy' },
                { name: 'analytics-service', port: ':4004', status: 'healthy' },
              ].map((svc) => (
                    <div key= { svc.name } style = {{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} >
            <div>
            <span style={ { fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-secondary)' } }> { svc.name } </span>
                < span style = {{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--text-muted)', marginLeft: '4px' }}> { svc.port } </span>
                    </div>
                    < div style = {{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <div style={ { width: '6px', height: '6px', borderRadius: '50%', background: '#34D399' } } />
                            < span style = {{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: '#34D399', letterSpacing: '0.06em' }}> OK </span>
                                </div>
                                </div>
              ))}
</div>
    </div>
    </div>
    </div>

    < style > {`
        @media (max-width: 900px) {
          div[style*="grid-template-columns: 1fr 300px"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </DashboardLayout>
  );
}
