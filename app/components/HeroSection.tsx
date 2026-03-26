import Link from 'next/link';

const HIGHLIGHTS = [
  {
    title: 'Project clarity',
    description: 'Keep plans, priorities, and progress easy to understand.',
  },
  {
    title: 'Task focus',
    description: 'Move work forward with clear ownership and smoother execution.',
  },
  {
    title: 'Team visibility',
    description: 'Give everyone a cleaner view of what matters next.',
  },
];

const PREVIEW_ITEMS = [
  { label: 'Active projects', value: '12' },
  { label: 'In progress', value: '28' },
  { label: 'Completed this week', value: '46' },
];

export default function HeroSection() {
  return (
    <section
      id="hero"
      className="relative overflow-hidden px-6 pb-20 pt-32 text-[color:var(--color-text-primary)]"
    >
      <div className="absolute inset-0 bg-[color:var(--color-bg-primary)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.14),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(129,140,248,0.14),transparent_30%),radial-gradient(circle_at_left_bottom,rgba(245,158,11,0.08),transparent_26%)]" />
      <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(148,163,184,0.55)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.55)_1px,transparent_1px)] [background-size:48px_48px]" />

      <div className="relative mx-auto grid min-h-[calc(100vh-8rem)] max-w-7xl items-center gap-14 lg:grid-cols-[1.08fr_0.92fr]">
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

          <div className="mt-10 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 rounded-2xl bg-[color:var(--color-text-primary)] px-6 py-3.5 text-sm font-semibold uppercase tracking-[0.16em] text-[color:var(--color-bg-primary)] transition duration-300 hover:-translate-y-0.5"
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
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-3">
            {HIGHLIGHTS.map((item) => (
              <div
                key={item.title}
                className="rounded-3xl border border-[color:var(--color-border)] bg-[color:var(--color-bg-card)] p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)] transition duration-300 hover:-translate-y-1 hover:border-[color:var(--color-border-accent)]"
              >
                <div className="mb-4 flex items-center gap-3">
                  <div className="h-10 w-10 rounded-2xl border border-[color:var(--color-border-accent)] bg-[color:var(--color-bg-secondary)]" />
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

            <div className="mt-6 space-y-4">
              {[
                { title: 'Planning board', text: 'Clear priorities with structured progress tracking.', width: 'w-[88%]' },
                { title: 'Team coordination', text: 'Shared visibility across ongoing work and ownership.', width: 'w-[72%]' },
                { title: 'Delivery flow', text: 'A cleaner path from idea to execution.', width: 'w-[94%]' },
              ].map((item) => (
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
                      Active
                    </span>
                  </div>

                  <div className="mt-4 h-2 rounded-full bg-black/5 dark:bg-white/5">
                    <div
                      className={`h-2 rounded-full bg-gradient-to-r from-cyan-400 via-sky-400 to-violet-500 ${item.width}`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}