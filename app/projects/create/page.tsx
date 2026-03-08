'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '../../components/DashboardLayout';

const COLORS = ['#22D3EE', '#818CF8', '#F59E0B', '#34D399', '#F87171', '#A78BFA', '#FB923C', '#38BDF8'];
const STATUSES = ['ACTIVE', 'PLANNED', 'IN REVIEW', 'ON HOLD'];

const labelCls = 'create-label';
const inputCls = 'create-input';

export default function CreateProjectPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', description: '', status: 'ACTIVE', color: COLORS[0], dueDate: '', tags: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const update = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async () => {
    if (!form.name.trim()) { setError('Project name is required.'); return; }
    setError(''); setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_PROJECTS_SERVICE_URL}/projects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ ...form, tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean) }),
      });
      if (!res.ok) throw new Error('Failed to create project');
      router.push('/projects');
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
          --color-bg-card:        #0f1020;
          --color-text-primary:   #f1f5f9;
          --color-text-secondary: #94a3b8;
          --color-text-muted:     #475569;
          --color-accent-cyan:    #22d3ee;
          --color-dark-base:      #07080f;
          --color-border:         rgba(255,255,255,0.07);
        }

        /* ── Form elements ── */
        .create-label {
          display: block;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.7rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #94a3b8;
          margin-bottom: 0.375rem;
        }
        .create-input {
          width: 100%;
          padding: 0.625rem 0.875rem;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 4px;
          font-family: 'Manrope', sans-serif;
          font-size: 0.875rem;
          color: #f1f5f9;
          outline: none;
          transition: border-color 0.2s ease;
        }
        .create-input:focus { border-color: rgba(34,211,238,0.5); }
        .create-input::placeholder { color: #475569; }

        /* ── Error banner ── */
        .create-error {
          padding: 0.625rem 0.875rem;
          background: rgba(239,68,68,0.08);
          border: 1px solid rgba(239,68,68,0.25);
          border-radius: 4px;
          margin-bottom: 1.5rem;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.75rem;
          color: #F87171;
          letter-spacing: 0.04em;
        }

        /* ── Panel ── */
        .create-panel {
          background: var(--color-bg-secondary);
          border: 1px solid var(--color-border);
          border-radius: 6px;
          padding: 2rem;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        /* ── 2-col grid ── */
        .create-grid-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }
        @media (max-width: 540px) {
          .create-grid-2 { grid-template-columns: 1fr; }
        }

        /* ── Tag chip ── */
        .create-tag-chip {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.68rem;
          color: #22d3ee;
          background: rgba(34,211,238,0.08);
          border: 1px solid rgba(34,211,238,0.2);
          padding: 2px 8px;
          border-radius: 2px;
          letter-spacing: 0.06em;
        }

        /* ── Preview card ── */
        .create-preview {
          border-radius: 6px;
          padding: 1.25rem;
          position: relative;
          overflow: hidden;
          background: var(--color-bg-card);
        }

        /* ── Submit button ── */
        .create-submit-btn {
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
        .create-submit-btn:hover    { opacity: 0.9; }
        .create-submit-btn:disabled { opacity: 0.5; cursor: not-allowed; }

        /* ── Cancel button ── */
        .create-cancel-btn {
          padding: 0.75rem 1.5rem;
          background: transparent;
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 4px;
          font-family: 'Manrope', sans-serif;
          font-weight: 600;
          font-size: 0.875rem;
          color: #94a3b8;
          cursor: pointer;
          transition: color 0.2s ease, border-color 0.2s ease;
        }
        .create-cancel-btn:hover { color: #f1f5f9; border-color: rgba(255,255,255,0.25); }

        /* ── Date input dark scheme ── */
        .create-date-input { color-scheme: dark; }
      `}</style>

      <DashboardLayout title="Create Project" subtitle="TASKMASTER / PROJECTS / NEW">
        <div style={{ maxWidth: '680px' }}>
          {/* Page heading */}
          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '1.6rem', color: '#f1f5f9', letterSpacing: '-0.01em', marginBottom: '0.375rem' }}>
              New Project
            </h2>
            <p style={{ fontFamily: 'Manrope, sans-serif', fontSize: '0.875rem', color: '#94a3b8' }}>
              Projects group related tasks and give your team a shared workspace.
            </p>
          </div>

          {error && <div className="create-error">{error}</div>}

          <div className="create-panel">
            {/* Name */}
            <div>
              <label className={labelCls}>
                Project Name <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input type="text" placeholder="e.g. Platform Redesign" value={form.name} onChange={update('name')} className={inputCls} />
            </div>

            {/* Description */}
            <div>
              <label className={labelCls}>Description</label>
              <textarea placeholder="What is this project about?" value={form.description} onChange={update('description')} rows={4} className={inputCls} style={{ resize: 'vertical', lineHeight: 1.6 }} />
            </div>

            {/* Status + Due date */}
            <div className="create-grid-2">
              <div>
                <label className={labelCls}>Status</label>
                <select value={form.status} onChange={update('status')} className={inputCls} style={{ cursor: 'pointer' }}>
                  {STATUSES.map((s) => <option key={s} value={s} style={{ background: '#0D0E1A' }}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className={labelCls}>Due Date</label>
                <input type="date" value={form.dueDate} onChange={update('dueDate')} className={`${inputCls} create-date-input`} />
              </div>
            </div>

            {/* Color picker */}
            <div>
              <label className={labelCls}>Project Color</label>
              <div style={{ display: 'flex', gap: '0.625rem', flexWrap: 'wrap', marginTop: '0.25rem' }}>
                {COLORS.map((c) => (
                  <button key={c} onClick={() => setForm((f) => ({ ...f, color: c }))}
                    style={{
                      width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer',
                      background: c,
                      border: `3px solid ${form.color === c ? '#fff' : 'transparent'}`,
                      transform: form.color === c ? 'scale(1.15)' : 'scale(1)',
                      transition: 'transform 0.15s ease, border-color 0.15s ease',
                    }} />
                ))}
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className={labelCls}>
                Tags <span style={{ color: '#475569', fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>(comma-separated)</span>
              </label>
              <input type="text" placeholder="e.g. frontend, redesign, q4" value={form.tags} onChange={update('tags')} className={inputCls} />
              {form.tags && (
                <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
                  {form.tags.split(',').filter((t) => t.trim()).map((tag) => (
                    <span key={tag} className="create-tag-chip">{tag.trim()}</span>
                  ))}
                </div>
              )}
            </div>

            {/* Preview card */}
            <div>
              <label className={labelCls}>Preview</label>
              <div className="create-preview" style={{ border: `1px solid ${form.color}40` }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: form.color }} />
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.5rem' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '0.85rem', background: `${form.color}18`, border: `1px solid ${form.color}30`, color: form.color }}>
                    {(form.name || 'P').charAt(0)}
                  </div>
                  <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '0.95rem', color: '#f1f5f9' }}>
                    {form.name || 'Project Name'}
                  </span>
                </div>
                {form.description && <p style={{ fontFamily: 'Manrope, sans-serif', fontSize: '0.8rem', color: '#94a3b8', lineHeight: 1.5 }}>{form.description}</p>}
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '0.75rem', paddingTop: '0.5rem' }}>
              <button onClick={handleSubmit} disabled={loading} className="create-submit-btn">
                {loading ? 'Creating…' : 'Create Project'}
              </button>
              <button onClick={() => router.back()} className="create-cancel-btn">Cancel</button>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </>
  );
}