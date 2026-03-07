'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '../../components/DashboardLayout';

const COLORS = ['#22D3EE', '#818CF8', '#F59E0B', '#34D399', '#F87171', '#A78BFA', '#FB923C', '#38BDF8'];
const STATUSES = ['ACTIVE', 'PLANNED', 'IN REVIEW', 'ON HOLD'];

export default function CreateProjectPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: '',
    description: '',
    status: 'ACTIVE',
    color: COLORS[0],
    dueDate: '',
    tags: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const update = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async () => {
    if (!form.name.trim()) { setError('Project name is required.'); return; }
    setError('');
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_PROJECTS_SERVICE_URL}/projects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ ...form, tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean) }),
      });
      if (!res.ok) throw new Error('Failed to create project');
      router.push('/projects');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout title="Create Project" subtitle="NEXUS / PROJECTS / NEW">
      <div style={{ maxWidth: '680px' }}>
        {/* Page header */}
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.6rem', color: 'var(--text-primary)', letterSpacing: '-0.01em', marginBottom: '0.4rem' }}>
            New Project
          </h2>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            Projects group related tasks and give your team a shared workspace.
          </p>
        </div>

        {error && (
          <div style={{ padding: '10px 14px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: '4px', marginBottom: '1.5rem', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#F87171', letterSpacing: '0.04em' }}>
            {error}
          </div>
        )}

        <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: '6px', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

          {/* Name */}
          <div>
            <label style={labelStyle}>Project Name <span style={{ color: '#EF4444' }}>*</span></label>
            <input type="text" placeholder="e.g. Platform Redesign" value={form.name} onChange={update('name')} style={inputStyle}
              onFocus={(e) => (e.currentTarget.style.borderColor = 'rgba(34,211,238,0.5)')}
              onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)')} />
          </div>

          {/* Description */}
          <div>
            <label style={labelStyle}>Description</label>
            <textarea
              placeholder="What is this project about?"
              value={form.description}
              onChange={update('description')}
              rows={4}
              style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6 }}
              onFocus={(e) => (e.currentTarget.style.borderColor = 'rgba(34,211,238,0.5)')}
              onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)')}
            />
          </div>

          {/* Status + Due date row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={labelStyle}>Status</label>
              <select value={form.status} onChange={update('status')} style={{ ...inputStyle, cursor: 'pointer' }}
                onFocus={(e) => (e.currentTarget.style.borderColor = 'rgba(34,211,238,0.5)')}
                onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)')}>
                {STATUSES.map((s) => <option key={s} value={s} style={{ background: '#0D0E1A' }}>{s}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Due Date</label>
              <input type="date" value={form.dueDate} onChange={update('dueDate')} style={{ ...inputStyle, colorScheme: 'dark' }}
                onFocus={(e) => (e.currentTarget.style.borderColor = 'rgba(34,211,238,0.5)')}
                onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)')} />
            </div>
          </div>

          {/* Color picker */}
          <div>
            <label style={labelStyle}>Project Color</label>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '4px' }}>
              {COLORS.map((c) => (
                <button
                  key={c}
                  onClick={() => setForm((f) => ({ ...f, color: c }))}
                  style={{ width: '32px', height: '32px', borderRadius: '50%', background: c, border: `3px solid ${form.color === c ? '#fff' : 'transparent'}`, cursor: 'pointer', transition: 'transform 0.15s, border-color 0.15s', transform: form.color === c ? 'scale(1.15)' : 'scale(1)' }}
                />
              ))}
            </div>
          </div>

          {/* Tags */}
          <div>
            <label style={labelStyle}>Tags <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(comma-separated)</span></label>
            <input type="text" placeholder="e.g. frontend, redesign, q4" value={form.tags} onChange={update('tags')} style={inputStyle}
              onFocus={(e) => (e.currentTarget.style.borderColor = 'rgba(34,211,238,0.5)')}
              onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)')} />
            {/* Tag preview */}
            {form.tags && (
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '8px' }}>
                {form.tags.split(',').filter((t) => t.trim()).map((tag) => (
                  <span key={tag} style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--accent-cyan)', background: 'rgba(34,211,238,0.08)', border: '1px solid rgba(34,211,238,0.2)', padding: '3px 8px', borderRadius: '2px', letterSpacing: '0.06em' }}>
                    {tag.trim()}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Preview card */}
          <div>
            <label style={labelStyle}>Preview</label>
            <div style={{ background: 'var(--bg-card)', border: `1px solid ${form.color}40`, borderRadius: '6px', padding: '1.25rem', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: form.color }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.5rem' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '6px', background: `${form.color}18`, border: `1px solid ${form.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '0.85rem', color: form.color }}>
                  {(form.name || 'P').charAt(0)}
                </div>
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)' }}>{form.name || 'Project Name'}</span>
              </div>
              {form.description && <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{form.description}</p>}
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: '0.75rem', paddingTop: '0.5rem' }}>
            <button
              onClick={handleSubmit}
              disabled={loading}
              style={{ flex: 1, padding: '12px', background: loading ? 'rgba(34,211,238,0.5)' : 'var(--accent-cyan)', border: 'none', borderRadius: '4px', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.9rem', letterSpacing: '0.05em', color: '#07080F', cursor: loading ? 'not-allowed' : 'pointer', transition: 'opacity 0.2s' }}
              onMouseEnter={(e) => { if (!loading) e.currentTarget.style.opacity = '0.88'; }}
              onMouseLeave={(e) => { e.currentTarget.style.opacity = '1'; }}
            >
              {loading ? 'Creating…' : 'Create Project'}
            </button>
            <button
              onClick={() => router.back()}
              style={{ padding: '12px 24px', background: 'transparent', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '4px', fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-secondary)', cursor: 'pointer', transition: 'all 0.2s' }}
              onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--text-primary)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; }}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

const labelStyle: React.CSSProperties = { display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '6px' };
const inputStyle: React.CSSProperties = { width: '100%', padding: '10px 14px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '4px', fontFamily: 'var(--font-body)', fontSize: '0.875rem', color: 'var(--text-primary)', outline: 'none', transition: 'border-color 0.2s' };
