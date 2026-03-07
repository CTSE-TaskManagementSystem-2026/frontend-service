'use client';

import { useState } from 'react';
import Link from 'next/link';
import DashboardLayout from '../components/DashboardLayout';

const MOCK_PROJECTS = [
  { id: 1, name: 'Platform Redesign', description: 'Full UI/UX overhaul of the core platform, including new design system and component library.', status: 'ACTIVE', tasks: { total: 24, done: 14 }, members: 5, color: '#22D3EE', updatedAt: '2h ago' },
  { id: 2, name: 'Auth Service v2', description: 'Upgrade authentication to support OAuth2/OIDC, MFA, and enhanced session management.', status: 'ACTIVE', tasks: { total: 18, done: 9 }, members: 3, color: '#F59E0B', updatedAt: '5h ago' },
  { id: 3, name: 'Analytics Dashboard', description: 'Build real-time analytics dashboard with charts, KPIs, and customizable widgets.', status: 'IN REVIEW', tasks: { total: 31, done: 28 }, members: 4, color: '#818CF8', updatedAt: '1d ago' },
  { id: 4, name: 'Mobile App', description: 'React Native app with offline support, push notifications, and biometric auth.', status: 'PLANNED', tasks: { total: 40, done: 0 }, members: 6, color: '#34D399', updatedAt: '3d ago' },
  { id: 5, name: 'DevOps Pipeline', description: 'CI/CD pipeline setup with Docker, Kubernetes, and automated deployments to AWS.', status: 'ACTIVE', tasks: { total: 12, done: 8 }, members: 2, color: '#F87171', updatedAt: '30m ago' },
  { id: 6, name: 'API Documentation', description: 'Comprehensive OpenAPI 3.0 documentation for all microservices with Swagger UI.', status: 'DONE', tasks: { total: 8, done: 8 }, members: 2, color: '#64748B', updatedAt: '1w ago' },
];

const STATUS_COLOR: Record<string, string> = {
  ACTIVE: '#22D3EE', 'IN REVIEW': '#818CF8', PLANNED: '#F59E0B', DONE: '#34D399',
};

type Filter = 'ALL' | 'ACTIVE' | 'IN REVIEW' | 'PLANNED' | 'DONE';

export default function ProjectsPage() {
  const [filter, setFilter] = useState<Filter>('ALL');
  const [search, setSearch] = useState('');

  const filtered = MOCK_PROJECTS.filter((p) => {
    const matchFilter = filter === 'ALL' || p.status === filter;
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.description.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  return (
    <DashboardLayout
      title="Projects"
      subtitle="NEXUS / ALL PROJECTS"
      actions={
        <Link
          href="/projects/create"
          style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '7px 14px', background: 'var(--accent-cyan)', borderRadius: '3px', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.8rem', letterSpacing: '0.04em', color: '#07080F', textDecoration: 'none' }}
        >
          <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          New Project
        </Link>
      }
    >
      {/* Filters + search */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {/* Search */}
        <div style={{ position: 'relative', flex: '1 1 220px', maxWidth: '320px' }}>
          <svg width="14" height="14" fill="none" stroke="var(--text-muted)" strokeWidth="2" viewBox="0 0 24 24" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Search projects…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: '100%', padding: '8px 12px 8px 36px', background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: '4px', fontFamily: 'var(--font-body)', fontSize: '0.875rem', color: 'var(--text-primary)', outline: 'none' }}
            onFocus={(e) => (e.currentTarget.style.borderColor = 'rgba(34,211,238,0.4)')}
            onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--border)')}
          />
        </div>

        {/* Filter tabs */}
        <div style={{ display: 'flex', gap: '4px', background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: '4px', padding: '3px' }}>
          {(['ALL', 'ACTIVE', 'IN REVIEW', 'PLANNED', 'DONE'] as Filter[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{ padding: '5px 12px', borderRadius: '3px', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: '0.68rem', letterSpacing: '0.08em', background: filter === f ? 'rgba(34,211,238,0.12)' : 'transparent', color: filter === f ? 'var(--accent-cyan)' : 'var(--text-muted)', transition: 'all 0.2s' }}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Projects grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
        {filtered.map((project) => {
          const progress = Math.round((project.tasks.done / project.tasks.total) * 100) || 0;
          return (
            <Link
              key={project.id}
              href={`/projects/${project.id}`}
              style={{ textDecoration: 'none' }}
            >
              <div
                className="glass-card"
                style={{ borderRadius: '6px', padding: '1.5rem', position: 'relative', overflow: 'hidden', cursor: 'pointer', height: '100%', display: 'flex', flexDirection: 'column' }}
              >
                {/* Top accent */}
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: project.color }} />

                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <div
                    style={{ width: '36px', height: '36px', borderRadius: '6px', background: `${project.color}18`, border: `1px solid ${project.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '0.9rem', color: project.color }}
                  >
                    {project.name.charAt(0)}
                  </div>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.08em', color: STATUS_COLOR[project.status], background: `${STATUS_COLOR[project.status]}18`, border: `1px solid ${STATUS_COLOR[project.status]}30`, padding: '3px 8px', borderRadius: '2px' }}>
                    {project.status}
                  </span>
                </div>

                <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>{project.name}</h3>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.6, flex: 1, marginBottom: '1.25rem' }}>{project.description}</p>

                {/* Progress */}
                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--text-muted)', letterSpacing: '0.06em' }}>PROGRESS</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: project.color }}>{progress}%</span>
                  </div>
                  <div style={{ height: '4px', background: 'rgba(255,255,255,0.07)', borderRadius: '2px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${progress}%`, background: project.color, borderRadius: '2px', transition: 'width 0.5s ease' }} />
                  </div>
                </div>

                {/* Footer */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <svg width="12" height="12" fill="none" stroke="var(--text-muted)" strokeWidth="1.8" viewBox="0 0 24 24"><polyline points="9 11 12 14 22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" /></svg>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--text-muted)' }}>{project.tasks.done}/{project.tasks.total} tasks</span>
                  </div>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--text-muted)' }}>{project.updatedAt}</span>
                </div>
              </div>
            </Link>
          );
        })}

        {/* Empty state */}
        {filtered.length === 0 && (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem 2rem', color: 'var(--text-muted)' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', letterSpacing: '0.1em', marginBottom: '1rem' }}>NO PROJECTS FOUND</div>
            <Link href="/projects/create" style={{ color: 'var(--accent-cyan)', textDecoration: 'none', fontFamily: 'var(--font-body)', fontSize: '0.875rem' }}>Create your first project →</Link>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
