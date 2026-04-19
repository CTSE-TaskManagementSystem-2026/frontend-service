import Link from 'next/link';

const HIGHLIGHTS = [
  {
    title: 'Project clarity',
    description: 'Keep plans, priorities, and progress easy to understand.',
    icon: (
      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path d="M4 19h16" />
        <path d="M7 15v-5" />
        <path d="M12 15V8" />
        <path d="M17 15v-2" />
      </svg>
    ),
  },
  {
    title: 'Task focus',
    description: 'Move work forward with clear ownership and smoother execution.',
    icon: (
      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path d="M9 12.5 11.5 15 20 6.5" />
        <path d="M20 12v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h8" />
      </svg>
    ),
  },
  {
    title: 'Team visibility',
    description: 'Give everyone a cleaner view of what matters next.',
    icon: (
      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
];

const PREVIEW_ITEMS = [
  { label: 'Active projects', value: '12' },
  { label: 'In progress', value: '28' },
  { label: 'Completed this week', value: '46' },
];

const HERO_PILLS = [
  '4 focused services',
  'Responsive workspace',
  'Role-based access',
];

const WORKSTREAMS = [
  {
    title: 'Product launch board',
    text: 'Design, backend, and QA are moving through one shared delivery lane.',
    progress: 88,
    status: 'On track',
  },
  {
    title: 'Team coordination',
    text: 'Updates, handoffs, and ownership stay visible across the whole sprint.',
    progress: 72,
    status: 'Healthy',
  },
  {
    title: 'Release readiness',
    text: 'Leads can scan blockers quickly and move the next task without friction.',
    progress: 94,
    status: 'Ready',
  },
];

export default function HeroSection() {
  return (
    <section
      id="hero"
      className="relative overflow-hidden px-6 pb-16 pt-28 text-[color:var(--color-text-primary)] sm:pb-20 sm:pt-32"
    >
      <div className="absolute inset-0 bg-[color:var(--color-bg-primary)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.14),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(129,140,248,0.14),transparent_30%),radial-gradient(circle_at_left_bottom,rgba(245,158,11,0.08),transparent_26%)]" />
      <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(148,163,184,0.55)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.55)_1px,transparent_1px)] [background-size:48px_48px]" />

      <div className="relative mx-auto grid min-h-[calc(100vh-7rem)] max-w-7xl items-center gap-12 lg:grid-cols-[1.08fr_0.92fr]">
        <div className="max-w-3xl">
          <div className="mb-6 inline-flex items-center gap-3 rounded-full border border-[color:var(--color-border-accent)] bg-[color:var(--color-bg-card)] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-[color:var(--color-accent-cyan)] shadow-sm">
            <span className="h-2 w-2 rounded-full bg-[color:var(--color-accent-cyan)] shadow-[0_0_18px_rgba(34,211,238,0.55)]" />
            Workflow Platform
          </div>

          <h1 className="max-w-4xl text-5xl font-extrabold leading-[0.95] tracking-[-0.05em] sm:text-6xl lg:text-7xl">
            Organize work.
            <br />
            <span className="bg-gradient-to-r from-cyan-400 via-sky-400 to-violet-500 bg-clip-text text-transparent">
              Keep teams moving.
            </span>
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-8 text-[color:var(--color-text-secondary)] sm:text-lg">
            A modern workspace for planning projects, tracking tasks, and giving every team a clearer view of what needs attention next.
          </p>

          <div className="mt-6 flex flex-wrap gap-2.5">
            {HERO_PILLS.map((pill) => (
              <span
                key={pill}
                className="rounded-full border border-[color:var(--color-border)] bg-[color:var(--color-bg-card)] px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[color:var(--color-text-secondary)] shadow-[0_12px_30px_rgba(15,23,42,0.06)]"
              >
                {pill}
              </span>
            ))}
          </div>

          <div className="mt-10 rounded-[28px] border border-[color:var(--color-border)] bg-[color:var(--color-bg-card)]/75 p-4 shadow-[0_24px_70px_rgba(15,23,42,0.10)] backdrop-blur-xl sm:p-5">
            <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
              <Link
                href="/signup"
                aria-label="Get started with TaskMaster"
                className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-500 to-violet-600 px-6 py-3.5 text-sm font-semibold uppercase tracking-[0.16em] text-white shadow-[0_18px_45px_rgba(34,211,238,0.25)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_22px_55px_rgba(34,211,238,0.35)] hover:from-cyan-400 hover:to-violet-500"
              >
                Get Started
                <svg
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M5 12H19M12 5L19 12L12 19"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>

              <Link
                href="#services"
                className="inline-flex items-center gap-2 rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-bg-card)] px-6 py-3.5 text-sm font-semibold uppercase tracking-[0.16em] text-[color:var(--color-text-primary)] transition duration-300 hover:-translate-y-0.5 hover:border-[color:var(--color-border-accent)]"
              >
                Explore Platform
              </Link>

              <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs font-medium uppercase tracking-[0.14em] text-[color:var(--color-text-muted)] sm:ml-auto sm:justify-end">
                <span>New here?</span>
                <Link
                  href="/login"
                  className="text-[color:var(--color-accent-cyan)] transition duration-200 hover:opacity-80"
                >
                  Sign in
                </Link>
                <span className="hidden h-1 w-1 rounded-full bg-[color:var(--color-text-muted)] sm:inline-block" />
                <span>Ready in minutes</span>
              </div>
            </div>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-3">
            {HIGHLIGHTS.map((item) => (
              <div
                key={item.title}
                className="rounded-3xl border border-[color:var(--color-border)] bg-[color:var(--color-bg-card)] p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)] transition duration-300 hover:-translate-y-1 hover:border-[color:var(--color-border-accent)]"
              >
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-[color:var(--color-border-accent)] bg-[color:var(--color-bg-secondary)] text-[color:var(--color-accent-cyan)]">
                    {item.icon}
                  </div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[color:var(--color-text-muted)]">
                    Core Value
                  </p>
                </div>

                <h3 className="text-lg font-semibold text-[color:var(--color-text-primary)]">
                  {item.title}
                </h3>

                <p className="mt-2 text-sm leading-7 text-[color:var(--color-text-secondary)]">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="absolute -left-8 top-10 h-28 w-28 rounded-full bg-cyan-400/15 blur-3xl" />
          <div className="absolute -right-6 bottom-8 h-28 w-28 rounded-full bg-violet-500/15 blur-3xl" />

          <div className="relative overflow-hidden rounded-[32px] border border-[color:var(--color-border)] bg-[color:var(--color-bg-card)] p-6 shadow-[0_30px_80px_rgba(15,23,42,0.14)]">
            <div className="flex items-center justify-between border-b border-[color:var(--color-border)] pb-5">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[color:var(--color-text-muted)]">
                  Workspace Overview
                </p>
                <h3 className="mt-2 text-2xl font-bold text-[color:var(--color-text-primary)]">
                  Delivery at a glance
                </h3>
              </div>

              <div className="rounded-2xl border border-[color:var(--color-border-accent)] bg-cyan-400/10 px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[color:var(--color-accent-cyan)]">
                Live View
              </div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {PREVIEW_ITEMS.map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-bg-secondary)] p-4"
                >
                  <p className="text-xs font-medium uppercase tracking-[0.16em] text-[color:var(--color-text-muted)]">
                    {item.label}
                  </p>
                  <p className="mt-3 text-3xl font-bold text-[color:var(--color-text-primary)]">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-[28px] border border-[color:var(--color-border)] bg-[color:var(--color-bg-secondary)]/70 p-4">
              <div className="mb-4 flex items-center justify-between gap-4">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[color:var(--color-text-muted)]">
                    Today&apos;s snapshot
                  </p>
                  <p className="mt-2 text-lg font-semibold text-[color:var(--color-text-primary)]">
                    Keep every workstream visible.
                  </p>
                </div>

                <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-emerald-500">
                  3 squads active
                </span>
              </div>

              <div className="space-y-4">
                {WORKSTREAMS.map((item) => (
                  <div
                    key={item.title}
                    className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-bg-secondary)] p-4"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h4 className="text-sm font-semibold text-[color:var(--color-text-primary)]">
                          {item.title}
                        </h4>
                        <p className="mt-1 text-sm leading-6 text-[color:var(--color-text-secondary)]">
                          {item.text}
                        </p>
                      </div>
                      <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-emerald-500">
                        {item.status}
                      </span>
                    </div>

                    <div className="mt-4 h-2 rounded-full bg-black/5 dark:bg-white/5">
                      <div
                        className="h-2 rounded-full bg-gradient-to-r from-cyan-400 via-sky-400 to-violet-500"
                        style={{ width: `${item.progress}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
