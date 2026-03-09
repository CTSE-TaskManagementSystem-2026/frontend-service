'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import DashboardLayout from '../components/DashboardLayout';

interface Project {
  _id: string; name: string; description?: string;
  status: 'active' | 'inactive' | 'archived' | 'completed';
  dueDate?: string; tasksCount: number; createdAt: string; updatedAt: string;
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
  if (m < 1) return 'just now'; if (m < 60) return `${m}m ago`;
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
    setLoading(true); setError('');
    try {
      const res = await fetch('/api/projects/user', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to fetch projects');
      setProjects(Array.isArray(data.projects) ? data.projects : []);
    } catch (err: unknown) { setError(err instanceof Error ? err.message : 'Error'); }
    finally { setLoading(false); }
  }, [token]);

  useEffect(() => { fetchProjects(); }, [fetchProjects]);

  const filtered = projects.filter((p) => {
    const matchFilter = filter === 'ALL' || p.status === filter;
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || (p.description ?? '').toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  return (
    <>
      <style>{`
        :root {
          --color-bg-secondary:   #0d0f1a;
          --color-text-primary:   #f1f5f9;
          --color-text-secondary: #94a3b8;
          --color-text-muted:     #475569;
          --color-accent-cyan:    #22d3ee;
          --color-dark-base:      #07080f;
          --color-border:         rgba(255,255,255,0.07);
        }

        /* ── Error banner ── */
        .proj-error {
          padding: 0.625rem 0.875rem;
          background: rgba(239,68,68,0.08);
          border: 1px solid rgba(239,68,68,0.25);
          border-radius: 4px;
          margin-bottom: 1.25rem;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.72rem;
          color: #F87171;
        }

        /* ── New project button ── */
        .proj-new-btn {
          display: flex;
          align-items: center;
          gap: 0.375rem;
          padding: 7px 0.875rem;
          background: #22d3ee;
          border-radius: 2px;
          font-family: 'Syne', sans-serif;
          font-weight: 700;
          font-size: 0.8rem;
          letter-spacing: 0.04em;
          color: #07080f;
          text-decoration: none;
        }

        /* ── Search input ── */
        .proj-search {
          width: 100%;
          padding: 0.5rem 0.75rem 0.5rem 2.25rem;
          background: var(--color-bg-secondary);
          border: 1px solid var(--color-border);
          border-radius: 4px;
          font-family: 'Manrope', sans-serif;
          font-size: 0.875rem;
          color: #f1f5f9;
          outline: none;
          transition: border-color 0.2s ease;
        }
        .proj-search:focus { border-color: rgba(34,211,238,0.4); }
        .proj-search::placeholder { color: #475569; }

        /* ── Filter pills ── */
        .proj-filter-bar {
          display: flex;
          gap: 2px;
          background: var(--color-bg-secondary);
          border: 1px solid var(--color-border);
          border-radius: 4px;
          padding: 3px;
        }
        .proj-filter-btn {
          padding: 5px 0.75rem;
          border-radius: 2px;
          border: none;
          cursor: pointer;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.68rem;
          letter-spacing: 0.08em;
          transition: background 0.2s ease, color 0.2s ease;
        }
        .proj-filter-btn-active   { background: rgba(34,211,238,0.12); color: #22d3ee; }
        .proj-filter-btn-inactive { background: transparent; color: #475569; }

        /* ── Skeleton loader ── */
        @keyframes shimmer {
          0%   { opacity: 0.3; }
          50%  { opacity: 0.5; }
          100% { opacity: 0.3; }
        }
        .proj-skeleton {
          background: var(--color-bg-secondary);
          border: 1px solid var(--color-border);
          border-radius: 6px;
          height: 220px;
          animation: shimmer 1.4s ease-in-out infinite;
        }

        /* ── Project card ── */
        .proj-card {
          position: relative;
          overflow: hidden;
          border-radius: 6px;
          padding: 1.5rem;
          background: rgba(15,16,32,0.7);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255,255,255,0.07);
          cursor: pointer;
          height: 100%;
          display: flex;
          flex-direction: column;
          transition: border-color 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease;
        }
        .proj-card:hover {
          border-color: rgba(34,211,238,0.3);
          transform: translateY(-4px);
          box-shadow: 0 20px 60px rgba(34,211,238,0.08);
        }

        /* ── Task progress bar ── */
        .proj-bar-track {
          height: 4px;
          background: rgba(255,255,255,0.07);
          border-radius: 2px;
          overflow: hidden;
        }

        /* ── Empty state ── */
        .proj-empty {
          grid-column: 1 / -1;
          text-align: center;
          padding: 4rem 2rem;
          color: #475569;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.75rem;
          letter-spacing: 0.1em;
        }
        .proj-empty-link {
          color: #22d3ee;
          text-decoration: none;
          font-family: 'Manrope', sans-serif;
          font-size: 0.875rem;
        }
      `}</style>

      <DashboardLayout
        title="Projects"
        subtitle="TASKMASTER / MY PROJECTS"
        actions={
          <Link href="/projects/create" className="proj-new-btn">
            <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
            New Project
          </Link>
        }
      >
        {error && <div className="proj-error">{error}</div>}

        {/* Filters + search */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '220px', maxWidth: '320px' }}>
            <svg width="14" height="14" fill="none" stroke="#475569" strokeWidth="2" viewBox="0 0 24 24"
              style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input type="text" placeholder="Search projects…" value={search} onChange={(e) => setSearch(e.target.value)} className="proj-search" />
          </div>
          <div className="proj-filter-bar">
            {FILTER_LABELS.map(({ value, label }) => (
              <button key={value} onClick={() => setFilter(value)}
                className={`proj-filter-btn ${filter === value ? 'proj-filter-btn-active' : 'proj-filter-btn-inactive'}`}>
                {label}
              </button>
            ))}
          </div>
          {!loading && (
            <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.68rem', color: '#475569', letterSpacing: '0.06em', marginLeft: 'auto' }}>
              {filtered.length} / {projects.length} projects
            </span>
          )}
        </div>

        {/* Loading skeletons */}
        {loading && (
          <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
            {Array.from({ length: 6 }).map((_, i) => <div key={i} className="proj-skeleton" />)}
          </div>
        )}

        {/* Projects grid */}
        {!loading && (
          <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
            {filtered.map((project) => {
              const meta = STATUS_META[project.status] ?? { label: project.status.toUpperCase(), color: '#94A3B8' };
              const accent = accentColor(project.name);
              const isOverdue = project.dueDate && new Date(project.dueDate) < new Date() && project.status !== 'completed';
              return (
                <Link key={project._id} href={`/projects/${project._id}`} style={{ textDecoration: 'none' }}>
                  <div className="proj-card">
                    {/* Top accent bar */}
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: accent }} />
                    {/* Header row */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                      <div style={{ width: '36px', height: '36px', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '0.9rem', background: `${accent}18`, border: `1px solid ${accent}30`, color: accent }}>
                        {project.name.charAt(0).toUpperCase()}
                      </div>
                      <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.65rem', letterSpacing: '0.08em', padding: '2px 8px', borderRadius: '2px', color: meta.color, background: `${meta.color}18`, border: `1px solid ${meta.color}30` }}>
                        {meta.label}
                      </span>
                    </div>
                    <h3 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '1rem', color: '#f1f5f9', marginBottom: '0.5rem' }}>{project.name}</h3>
                    <p style={{ fontFamily: 'Manrope, sans-serif', fontSize: '0.8rem', color: '#94a3b8', lineHeight: 1.6, flex: 1, marginBottom: '1.25rem' }}>
                      {project.description || 'No description provided.'}
                    </p>
                    {/* Task count + bar */}
                    <div style={{ marginBottom: '1rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                        <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.65rem', color: '#475569', letterSpacing: '0.06em' }}>TASKS</span>
                        <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.65rem', color: accent }}>{project.tasksCount}</span>
                      </div>
                      <div className="proj-bar-track">
                        <div style={{ height: '100%', borderRadius: '2px', transition: 'width 0.5s ease', width: `${Math.min((project.tasksCount / 20) * 100, 100)}%`, background: accent }} />
                      </div>
                    </div>
                    {/* Footer */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        {project.dueDate ? (
                          <>
                            <svg width="11" height="11" fill="none" stroke={isOverdue ? '#EF4444' : '#475569'} strokeWidth="1.8" viewBox="0 0 24 24">
                              <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
                            </svg>
                            <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.65rem', color: isOverdue ? '#EF4444' : '#475569' }}>
                              {new Date(project.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </span>
                          </>
                        ) : <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.65rem', color: '#475569' }}>No due date</span>}
                      </div>
                      <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.65rem', color: '#475569' }}>{timeAgo(project.updatedAt)}</span>
                    </div>
                  </div>
                </Link>
              );
            })}

            {/* Empty state */}
            {filtered.length === 0 && (
              <div className="proj-empty">
                <div style={{ marginBottom: '1rem' }}>
                  {search || filter !== 'ALL' ? 'NO PROJECTS MATCH YOUR FILTERS' : 'NO PROJECTS YET'}
                </div>
                {!search && filter === 'ALL' && (
                  <Link href="/projects/create" className="proj-empty-link">Create your first project →</Link>
                )}
              </div>
            )}
          </div>
        )}
      </DashboardLayout>
    </>
  );
}