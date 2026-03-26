'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '../../components/DashboardLayout';

const COLORS = ['#22D3EE', '#818CF8', '#F59E0B', '#34D399', '#F87171', '#A78BFA', '#FB923C', '#38BDF8'];
const STATUSES = ['active', 'inactive', 'archived', 'completed'];

export default function CreateProjectPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: '',
    description: '',
    status: 'active',
    color: COLORS[0],
    dueDate: '',
    tags: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const update =
    (field: string) =>
      (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
        setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async () => {
    if (!form.name.trim()) {
      setError('Project name is required.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/frontend-api/projects/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...form,
          tags: form.tags
            .split(',')
            .map((t) => t.trim())
            .filter(Boolean),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || data.error || 'Failed to create project');

      router.push('/projects');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout title="Create Project" subtitle="TASKMASTER / PROJECTS / NEW">
      <div className="max-w-3xl">
        <div className="mb-8">
          <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-[color:var(--color-border-accent)] bg-[color:var(--color-bg-card)] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[color:var(--color-accent-cyan)]">
            <span className="h-2 w-2 rounded-full bg-[color:var(--color-accent-cyan)]" />
            New workspace project
          </p>

          <h2 className="text-3xl font-extrabold tracking-[-0.03em] text-[color:var(--color-text-primary)]">
            Create Project
          </h2>

          <p className="mt-2 text-sm leading-7 text-[color:var(--color-text-secondary)]">
            Projects group related tasks and give your team a shared workspace.
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        )}

        <div className="overflow-hidden rounded-[30px] border border-[color:var(--color-border)] bg-[color:var(--color-bg-card)] shadow-[0_24px_70px_rgba(15,23,42,0.08)]">
          <div className="h-20 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.16),transparent_32%),radial-gradient(circle_at_top_right,rgba(129,140,248,0.14),transparent_30%)]" />

          <div className="space-y-6 p-6 sm:p-8">
            <div>
              <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.2em] text-[color:var(--color-text-muted)]">
                Project Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Platform Redesign"
                value={form.name}
                onChange={update('name')}
                className="w-full rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-bg-secondary)] px-4 py-3 text-sm text-[color:var(--color-text-primary)] outline-none transition duration-200 placeholder:text-[color:var(--color-text-muted)] focus:border-[color:var(--color-border-accent)]"
              />
            </div>

            <div>
              <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.2em] text-[color:var(--color-text-muted)]">
                Description
              </label>
              <textarea
                placeholder="What is this project about?"
                value={form.description}
                onChange={update('description')}
                rows={4}
                className="w-full resize-y rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-bg-secondary)] px-4 py-3 text-sm leading-7 text-[color:var(--color-text-primary)] outline-none transition duration-200 placeholder:text-[color:var(--color-text-muted)] focus:border-[color:var(--color-border-accent)]"
              />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.2em] text-[color:var(--color-text-muted)]">
                  Status
                </label>
                <select
                  value={form.status}
                  onChange={update('status')}
                  className="w-full cursor-pointer rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-bg-secondary)] px-4 py-3 text-sm text-[color:var(--color-text-primary)] outline-none transition duration-200 focus:border-[color:var(--color-border-accent)]"
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s} className="bg-slate-900">
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.2em] text-[color:var(--color-text-muted)]">
                  Due Date
                </label>
                <input
                  type="date"
                  value={form.dueDate}
                  onChange={update('dueDate')}
                  className="w-full rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-bg-secondary)] px-4 py-3 text-sm text-[color:var(--color-text-primary)] outline-none transition duration-200 focus:border-[color:var(--color-border-accent)]"
                  style={{ colorScheme: 'dark' }}
                />
              </div>
            </div>

            <div>
              <label className="mb-3 block text-[11px] font-semibold uppercase tracking-[0.2em] text-[color:var(--color-text-muted)]">
                Project Color
              </label>

              <div className="flex flex-wrap gap-3">
                {COLORS.map((c) => {
                  const active = form.color === c;

                  return (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setForm((f) => ({ ...f, color: c }))}
                      aria-label={`Select color ${c}`}
                      className={`h-10 w-10 rounded-full border-2 transition duration-200 ${active ? 'scale-110 border-white shadow-[0_0_0_4px_rgba(255,255,255,0.08)]' : 'border-transparent'
                        }`}
                      style={{ background: c }}
                    />
                  );
                })}
              </div>
            </div>

            <div>
              <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.2em] text-[color:var(--color-text-muted)]">
                Tags{' '}
                <span className="normal-case tracking-normal text-[color:var(--color-text-muted)]">
                  (comma-separated)
                </span>
              </label>

              <input
                type="text"
                placeholder="e.g. frontend, redesign, q4"
                value={form.tags}
                onChange={update('tags')}
                className="w-full rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-bg-secondary)] px-4 py-3 text-sm text-[color:var(--color-text-primary)] outline-none transition duration-200 placeholder:text-[color:var(--color-text-muted)] focus:border-[color:var(--color-border-accent)]"
              />

              {form.tags && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {form.tags
                    .split(',')
                    .filter((t) => t.trim())
                    .map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.08em] text-cyan-300"
                      >
                        {tag.trim()}
                      </span>
                    ))}
                </div>
              )}
            </div>

            <div>
              <label className="mb-3 block text-[11px] font-semibold uppercase tracking-[0.2em] text-[color:var(--color-text-muted)]">
                Preview
              </label>

              <div
                className="relative overflow-hidden rounded-[24px] border bg-[color:var(--color-bg-secondary)] p-5"
                style={{ borderColor: `${form.color}40` }}
              >
                <div
                  className="absolute inset-x-0 top-0 h-[3px]"
                  style={{ background: form.color }}
                />

                <div className="flex items-center gap-3">
                  <div
                    className="flex h-11 w-11 items-center justify-center rounded-2xl border text-sm font-extrabold"
                    style={{
                      background: `${form.color}18`,
                      borderColor: `${form.color}30`,
                      color: form.color,
                    }}
                  >
                    {(form.name || 'P').charAt(0)}
                  </div>

                  <div>
                    <p className="text-base font-bold tracking-[-0.02em] text-[color:var(--color-text-primary)]">
                      {form.name || 'Project Name'}
                    </p>
                    <p
                      className="mt-1 text-[11px] font-semibold uppercase tracking-[0.14em]"
                      style={{ color: form.color }}
                    >
                      {form.status}
                    </p>
                  </div>
                </div>

                {form.description && (
                  <p className="mt-4 text-sm leading-7 text-[color:var(--color-text-secondary)]">
                    {form.description}
                  </p>
                )}

                {(form.dueDate || form.tags) && (
                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    {form.dueDate && (
                      <span className="rounded-full border border-[color:var(--color-border)] bg-[color:var(--color-bg-card)] px-3 py-1 text-[11px] font-medium uppercase tracking-[0.08em] text-[color:var(--color-text-secondary)]">
                        Due {form.dueDate}
                      </span>
                    )}

                    {form.tags
                      .split(',')
                      .filter((t) => t.trim())
                      .slice(0, 3)
                      .map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full border px-3 py-1 text-[11px] font-medium uppercase tracking-[0.08em]"
                          style={{
                            color: form.color,
                            background: `${form.color}10`,
                            borderColor: `${form.color}25`,
                          }}
                        >
                          {tag.trim()}
                        </span>
                      ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-3 pt-2 sm:flex-row">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="inline-flex flex-1 items-center justify-center rounded-2xl bg-cyan-400 px-5 py-3.5 text-sm font-semibold uppercase tracking-[0.16em] text-slate-950 transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(34,211,238,0.22)] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
              >
                {loading ? 'Creating…' : 'Create Project'}
              </button>

              <button
                type="button"
                onClick={() => router.back()}
                className="inline-flex items-center justify-center rounded-2xl border border-[color:var(--color-border)] bg-transparent px-5 py-3.5 text-sm font-semibold text-[color:var(--color-text-secondary)] transition duration-200 hover:border-[color:var(--color-border-accent)] hover:text-[color:var(--color-text-primary)]"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}