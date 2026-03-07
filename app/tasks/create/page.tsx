'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '../../components/DashboardLayout';

const PRIORITIES = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];
const STATUSES = ['TODO', 'IN PROGRESS', 'IN REVIEW', 'DONE'];
const MOCK_PROJECTS = [
  { id: '1', name: 'Platform Redesign' },
  { id: '2', name: 'Auth Service' },
  { id: '3', name: 'Analytics Dashboard' },
  { id: '4', name: 'Mobile App' },
  { id: '5', name: 'DevOps Pipeline' },
];
const MOCK_MEMBERS = [
  { id: 'jd', name: 'John Doe', initials: 'JD' },
  { id: 'as', name: 'Alice Smith', initials: 'AS' },
  { id: 'mk', name: 'Mike Kim', initials: 'MK' },
  { id: 'sr', name: 'Sara Ren', initials: 'SR' },
];

const PRIORITY_COLOR: Record<string, string> = { LOW: '#34D399', MEDIUM: '#F59E0B', HIGH: '#EF4444', CRITICAL: '#A855F7' };

export default function CreateTaskPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: '', description: '', projectId: '',
    priority: 'MEDIUM', status: 'TODO',
    assigneeId: '', dueDate: '', tags: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const update = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async () => {
    if (!form.title.trim()) { setError('Task title is required.'); return; }
    if (!form.projectId) { setError('Please select a project.'); return; }
    setError(''); setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_TASKS_SERVICE_URL}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ ...form, tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean) }),
      });
      if (!res.ok) throw new Error('Failed to create task');
      router.push('/tasks');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout title="Create Task" subtitle="NEXUS / TASKS / NEW">
      <div style={{ maxWidth: '680px' }}>
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.6rem', color: 'var(--text-primary)', letterSpacing: '-0.01em', marginBottom: '0.4rem' }}>New Task</h2>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Add a task to track a piece of work within a project.</p>
        </div>

        {error && (
          <div style={{ padding: '10px 14px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: '4px', marginBottom: '1.5rem', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#F87171', letterSpacing: '0.04em' }}>
            {error}
          </div>
        )}

        <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: '6px', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

          {/* Title */}
          <div>
            <label style={labelStyle}>Task Title <span style={{ color: '#EF4444' }}>*</span></label>
            <input type="text" placeholder="e.g. Implement JWT refresh tokens" value={form.title} onChange={update('title')} style={inputStyle}
              onFocus={(e) => (e.currentTarget.style.borderColor = 'rgba(34,211,238,0.5)')}
              onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)')} />
          </div>

          {/* Description */}
          <div>
            <label style={labelStyle}>Description</label>
            <textarea placeholder="What needs to be done? Include acceptance criteria…" value={form.description} onChange={update('description')} rows={5}
              style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.65 }}
              onFocus={(e) => (e.currentTarget.style.borderColor = 'rgba(34,211,238,0.5)')}
              onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)')} />
          </div>

          {/* Project */}
          <div>
            <label style={labelStyle}>Project <span style={{ color: '#EF4444' }}>*</span></label>
            <select value={form.projectId} onChange={update('projectId')} style={{ ...inputStyle, cursor: 'pointer' }}
              onFocus={(e) => (e.currentTarget.style.borderColor = 'rgba(34,211,238,0.5)')}
              onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)')}>
              <option value="" style={{ background: '#0D0E1A' }}>Select a project…</option>
              {MOCK_PROJECTS.map((p) => <option key={p.id} value={p.id} style={{ background: '#0D0E1A' }}>{p.name}</option>)}
            </select>
          </div>

          {/* Priority + Status row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={labelStyle}>Priority</label>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {PRIORITIES.map((p) => (
                  <button key={p} onClick={() => setForm((f) => ({ ...f, priority: p }))}
                    style={{ flex: 1, padding: '8px 4px', borderRadius: '4px', border: `1px solid ${form.priority === p ? PRIORITY_COLOR[p] : 'rgba(255,255,255,0.08)'}`, background: form.priority === p ? `${PRIORITY_COLOR[p]}18` : 'transparent', fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.06em', color: form.priority === p ? PRIORITY_COLOR[p] : 'var(--text-muted)', cursor: 'pointer', transition: 'all 0.2s' }}>
                    {p}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label style={labelStyle}>Status</label>
              <select value={form.status} onChange={update('status')} style={{ ...inputStyle, cursor: 'pointer' }}
                onFocus={(e) => (e.currentTarget.style.borderColor = 'rgba(34,211,238,0.5)')}
                onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)')}>
                {STATUSES.map((s) => <option key={s} value={s} style={{ background: '#0D0E1A' }}>{s}</option>)}
              </select>
            </div>
          </div>

          {/* Assignee + Due date */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={labelStyle}>Assignee</label>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {MOCK_MEMBERS.map((m) => (
                  <button key={m.id} onClick={() => setForm((f) => ({ ...f, assigneeId: f.assigneeId === m.id ? '' : m.id }))}
                    title={m.name}
                    style={{ width: '36px', height: '36px', borderRadius: '50%', background: form.assigneeId === m.id ? 'linear-gradient(135deg, #22D3EE, #818CF8)' : 'rgba(255,255,255,0.07)', border: `2px solid ${form.assigneeId === m.id ? 'rgba(34,211,238,0.6)' : 'rgba(255,255,255,0.1)'}`, cursor: 'pointer', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.6rem', color: form.assigneeId === m.id ? '#07080F' : 'var(--text-secondary)', transition: 'all 0.2s' }}>
                    {m.initials}
                  </button>
                ))}
              </div>
              {form.assigneeId && <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--accent-cyan)', marginTop: '6px', letterSpacing: '0.06em' }}>{MOCK_MEMBERS.find((m) => m.id === form.assigneeId)?.name}</div>}
            </div>
            <div>
              <label style={labelStyle}>Due Date</label>
              <input type="date" value={form.dueDate} onChange={update('dueDate')} style={{ ...inputStyle, colorScheme: 'dark' }}
                onFocus={(e) => (e.currentTarget.style.borderColor = 'rgba(34,211,238,0.5)')}
                onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)')} />
            </div>
          </div>

          {/* Tags */}
          <div>
            <label style={labelStyle}>Tags <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(comma-separated)</span></label>
            <input type="text" placeholder="e.g. backend, auth, security" value={form.tags} onChange={update('tags')} style={inputStyle}
              onFocus={(e) => (e.currentTarget.style.borderColor = 'rgba(34,211,238,0.5)')}
              onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)')} />
            {form.tags && (
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '8px' }}>
                {form.tags.split(',').filter((t) => t.trim()).map((tag) => (
                  <span key={tag} style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--accent-cyan)', background: 'rgba(34,211,238,0.08)', border: '1px solid rgba(34,211,238,0.2)', padding: '3px 8px', borderRadius: '2px', letterSpacing: '0.06em' }}>{tag.trim()}</span>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: '0.75rem', paddingTop: '0.5rem' }}>
            <button onClick={handleSubmit} disabled={loading}
              style={{ flex: 1, padding: '12px', background: loading ? 'rgba(34,211,238,0.5)' : 'var(--accent-cyan)', border: 'none', borderRadius: '4px', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.9rem', letterSpacing: '0.05em', color: '#07080F', cursor: loading ? 'not-allowed' : 'pointer', transition: 'opacity 0.2s' }}
              onMouseEnter={(e) => { if (!loading) e.currentTarget.style.opacity = '0.88'; }}
              onMouseLeave={(e) => { e.currentTarget.style.opacity = '1'; }}>
              {loading ? 'Creating…' : 'Create Task'}
            </button>
            <button onClick={() => router.back()}
              style={{ padding: '12px 24px', background: 'transparent', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '4px', fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-secondary)', cursor: 'pointer', transition: 'all 0.2s' }}
              onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--text-primary)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; }}>
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
