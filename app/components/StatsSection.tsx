'use client';

import Link from 'next/link';

const STATS = [
  { value: '10k+', label: 'Active Projects' },
  { value: '250k+', label: 'Tasks Managed' },
  { value: '98.7%', label: 'Customer Satisfaction' },
  { value: '< 100ms', label: 'Avg API Response' },
];

export default function StatsSection() {
  return (
    <>
      <section
        id="analytics"
        className="relative overflow-hidden border-y border-[color:var(--color-border)] bg-[color:var(--color-bg-secondary)] px-6 py-20 text-[color:var(--color-text-primary)]"
      >
        <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(148,163,184,0.35)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.35)_1px,transparent_1px)] [background-size:42px_42px]" />

        <div className="relative mx-auto grid max-w-7xl gap-5 text-center sm:grid-cols-2 xl:grid-cols-4">
          {STATS.map((stat, index) => (
            <div
              key={stat.label}
              className={`rounded-[28px] border border-[color:var(--color-border)] bg-[color:var(--color-bg-card)] px-6 py-8 shadow-[0_20px_60px_rgba(15,23,42,0.06)] transition duration-300 hover:-translate-y-1 hover:border-[color:var(--color-border-accent)] ${index !== 0 ? '' : ''
                }`}
            >
              <div className="bg-gradient-to-r from-[color:var(--color-text-primary)] via-[color:var(--color-text-primary)] to-[color:var(--color-accent-cyan)] bg-clip-text text-4xl font-extrabold tracking-[-0.04em] text-transparent sm:text-5xl">
                {stat.value}
              </div>

              <div className="mt-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-[color:var(--color-text-muted)] sm:text-xs">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="relative overflow-hidden bg-[color:var(--color-bg-primary)] px-6 py-24 text-[color:var(--color-text-primary)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.10),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(129,140,248,0.10),transparent_28%)]" />
        <div className="absolute left-1/2 top-10 h-64 w-64 -translate-x-1/2 rounded-full bg-cyan-400/10 blur-3xl" />

        <div className="relative mx-auto max-w-4xl rounded-[32px] border border-[color:var(--color-border)] bg-[color:var(--color-bg-card)] px-6 py-12 text-center shadow-[0_30px_80px_rgba(15,23,42,0.10)] sm:px-10 sm:py-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-[color:var(--color-border-accent)] bg-[color:var(--color-bg-secondary)] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-[color:var(--color-accent-cyan)]">
            <span className="h-2 w-2 rounded-full bg-[color:var(--color-accent-cyan)]" />
            Get Started
          </div>

          <h2 className="mt-6 text-4xl font-extrabold leading-tight tracking-[-0.03em] sm:text-5xl">
            Ready to move faster
            <br />
            <span className="text-[color:var(--color-text-muted)]">with a clearer workflow?</span>
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-[color:var(--color-text-secondary)] sm:text-lg">
            Bring projects, tasks, and team coordination into one polished workspace built to help people focus, collaborate, and deliver with confidence.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/signup"
              className="inline-flex items-center justify-center rounded-2xl bg-cyan-400 px-6 py-3.5 text-sm font-semibold uppercase tracking-[0.16em] text-slate-950 transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_45px_rgba(34,211,238,0.28)]"
            >
              Start Free Trial
            </Link>

            <Link
              href="/docs"
              className="inline-flex items-center justify-center rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-bg-secondary)] px-6 py-3.5 text-sm font-semibold uppercase tracking-[0.16em] text-[color:var(--color-text-primary)] transition duration-300 hover:-translate-y-0.5 hover:border-[color:var(--color-border-accent)]"
            >
              View Docs
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}