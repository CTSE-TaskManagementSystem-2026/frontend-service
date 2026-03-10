'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '../../components/DashboardLayout';

const PRIORITIES = ['low', 'medium', 'high'];
const STATUSES = ['TODO', 'IN PROGRESS', 'IN REVIEW', 'DONE'];
const PRIORITY_COLOR: Record<string, string> = {
  low: '#34D399', medium: '#F59E0B', high: '#EF4444',
};

const labelCls = 'task-label';
const inputCls = 'task-input';

interface Project { _id: string; name: string; }

// All requests go through our own Next.js backend routes — no NEXT_PUBLIC_ needed

export default function CreateTaskPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [projLoading, setProjLoading] = useState(true);
  const [form, setForm] = useState({
    title: '', description: '', projectId: '',
    priority: 'medium', status: 'TODO', dueDate: '', tags: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // ── Fetch real projects on mount ──
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;
    fetch('/frontend-api/projects/user', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => setProjects(Array.isArray(data.projects) ? data.projects : []))
      .catch(() => setError('Failed to load projects'))
      .finally(() => setProjLoading(false));
  }, []);

  const update = (field: string) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async () => {
    if (!form.title.trim()) { setError('Task title is required.'); return; }
    if (!form.projectId) { setError('Please select a project.'); return; }
    setError(''); setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/frontend-api/tasks/user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          title: form.title,
          description: form.description,
          projectId: form.projectId,
          priority: form.priority,
          status: form.status,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || data.details || 'Failed to create task');
      router.push('/tasks');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error');
    } finally {
      setLoading(false);
    }
  };

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
          --color-border:         rgba(255, 255, 255, 0.07);
        }

        /* ── Form elements ── */
        .task-label {
          display: block;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.7rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #94a3b8;
          margin-bottom: 0.375rem;
        }
        .task-input {
          width: 100%;
          padding: 0.625rem 0.875rem;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 4px;
          font-family: 'Manrope', sans-serif;
          font-size: 0.875rem;
          color: #f1f5f9;
          outline: none;
          transition: border-color 0.2s ease;
        }
        .task-input:focus        { border-color: rgba(34, 211, 238, 0.5); }
        .task-input::placeholder { color: #475569; }

        /* ── Date input dark color-scheme ── */
        .task-date { color-scheme: dark; }

        /* ── Error banner ── */
        .task-error {
          padding: 0.625rem 0.875rem;
          background: rgba(239, 68, 68, 0.08);
          border: 1px solid rgba(239, 68, 68, 0.25);
          border-radius: 4px;
          margin-bottom: 1.5rem;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.75rem;
          color: #F87171;
          letter-spacing: 0.04em;
        }

        /* ── Panel ── */
        .task-panel {
          background: var(--color-bg-secondary);
          border: 1px solid var(--color-border);
          border-radius: 6px;
          padding: 2rem;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        /* ── 2-col grid ── */
        .task-grid-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }
        @media (max-width: 540px) {
          .task-grid-2 { grid-template-columns: 1fr; }
        }

        /* ── Priority buttons ── */
        .task-priority-btn {
          flex: 1;
          padding: 0.5rem 0.25rem;
          border-radius: 4px;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.65rem;
          letter-spacing: 0.06em;
          cursor: pointer;
          transition: background 0.2s ease, color 0.2s ease, border-color 0.2s ease;
        }

        /* ── Assignee avatar button ── */
        .task-avatar-btn {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          font-family: 'Syne', sans-serif;
          font-weight: 700;
          font-size: 0.6rem;
          cursor: pointer;
          transition: background 0.2s ease, border-color 0.2s ease, color 0.2s ease;
          border-width: 2px;
          border-style: solid;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }

        /* ── Tag chip ── */
        .task-tag-chip {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.68rem;
          color: #22d3ee;
          background: rgba(34, 211, 238, 0.08);
          border: 1px solid rgba(34, 211, 238, 0.2);
          padding: 2px 8px;
          border-radius: 2px;
          letter-spacing: 0.06em;
        }

        /* ── Assignee selected name ── */
        .task-assignee-name {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.65rem;
          color: #22d3ee;
          margin-top: 0.375rem;
          letter-spacing: 0.06em;
        }

        /* ── Submit button ── */
        .task-submit-btn {
          flex: 1;
          padding: 0.75rem;
          background: #22d3ee;
          border: none;
          border-radius: 4px;
          font-family: 'Syne', sans-serif;
          font-weight: 700;
          font-size: 0.9rem;
          letter-spacing: 0.05em;
          color: #07080f;
          cursor: pointer;
          transition: opacity 0.2s ease;
        }
        .task-submit-btn:hover    { opacity: 0.9; }
        .task-submit-btn:disabled { opacity: 0.5; cursor: not-allowed; }

        /* ── Cancel button ── */
        .task-cancel-btn {
          padding: 0.75rem 1.5rem;
          background: transparent;
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 4px;
          font-family: 'Manrope', sans-serif;
          font-weight: 600;
          font-size: 0.875rem;
          color: #94a3b8;
          cursor: pointer;
          transition: color 0.2s ease, border-color 0.2s ease;
        }
        .task-cancel-btn:hover {
          color: #f1f5f9;
          border-color: rgba(255, 255, 255, 0.25);
        }
      `}</style>

      <DashboardLayout title="Create Task" subtitle="TASKMASTER / TASKS / NEW">
        <div style={{ maxWidth: '680px' }}>
          {/* Page heading */}
          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '1.6rem', color: '#f1f5f9', letterSpacing: '-0.01em', marginBottom: '0.375rem' }}>
              New Task
            </h2>
            <p style={{ fontFamily: 'Manrope, sans-serif', fontSize: '0.875rem', color: '#94a3b8' }}>
              Add a task to track a piece of work within a project.
            </p>
          </div>

          {error && <div className="task-error">{error}</div>}

          <div className="task-panel">
            {/* Title */}
            <div>
              <label className={labelCls}>
                Task Title <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input type="text" placeholder="e.g. Implement JWT refresh tokens" value={form.title} onChange={update('title')} className={inputCls} />
            </div>

            {/* Description */}
            <div>
              <label className={labelCls}>Description</label>
              <textarea
                placeholder="What needs to be done? Include acceptance criteria…"
                value={form.description}
                onChange={update('description')}
                rows={5}
                className={inputCls}
                style={{ resize: 'vertical', lineHeight: 1.65 }}
              />
            </div>

            {/* Project */}
            <select value={form.projectId} onChange={update('projectId')} className={inputCls} style={{ cursor: 'pointer' }}>
              <option value="" style={{ background: '#0D0E1A' }}>
                {projLoading ? 'Loading projects…' : 'Select a project…'}
              </option>
              {projects.map((p) => (
                <option key={p._id} value={p._id} style={{ background: '#0D0E1A' }}>
                  {p.name}
                </option>
              ))}
            </select>

            {/* Priority + Status */}
            <div className="task-grid-2">
              <div>
                <label className={labelCls}>Priority</label>
                <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap' }}>
                  {['low', 'medium', 'high'].map((p) => (
                    <button
                      key={p}
                      onClick={() => setForm((f) => ({ ...f, priority: p }))}
                      className="task-priority-btn"
                      style={{
                        borderColor: form.priority === p ? PRIORITY_COLOR[p] : 'rgba(255,255,255,0.08)',
                        background: form.priority === p ? `${PRIORITY_COLOR[p]}18` : 'transparent',
                        color: form.priority === p ? PRIORITY_COLOR[p] : '#475569',
                        border: `1px solid ${form.priority === p ? PRIORITY_COLOR[p] : 'rgba(255,255,255,0.08)'}`,
                      }}
                    >
                      {p.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className={labelCls}>Status</label>
                <select value={form.status} onChange={update('status')} className={inputCls} style={{ cursor: 'pointer' }}>
                  {STATUSES.map((s) => (
                    <option key={s} value={s} style={{ background: '#0D0E1A' }}>{s}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className={labelCls}>
                Tags{' '}
                <span style={{ color: '#475569', fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>
                  (comma-separated)
                </span>
              </label>
              <input type="text" placeholder="e.g. backend, auth, security" value={form.tags} onChange={update('tags')} className={inputCls} />
              {form.tags && (
                <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
                  {form.tags.split(',').filter((t) => t.trim()).map((tag) => (
                    <span key={tag} className="task-tag-chip">{tag.trim()}</span>
                  ))}
                </div>
              )}
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '0.75rem', paddingTop: '0.5rem' }}>
              <button onClick={handleSubmit} disabled={loading} className="task-submit-btn">
                {loading ? 'Creating…' : 'Create Task'}
              </button>
              <button onClick={() => router.back()} className="task-cancel-btn">
                Cancel
              </button>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </>
  );
}