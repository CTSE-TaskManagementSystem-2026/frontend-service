'use client';

const SERVICES = [
  {
    id: 'access',
    tag: 'Core 01',
    name: 'Secure Access',
    description:
      'Give every team member a safer and smoother way to sign in, manage access, and work with confidence.',
    features: ['Protected accounts', 'Role-based access', 'Team permissions', 'Reliable sign-in'],
    accent: 'amber',
    icon: (
      <svg width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <rect x="3" y="11" width="18" height="10" rx="2" />
        <path d="M7 11V8a5 5 0 0 1 10 0v3" />
      </svg>
    ),
  },
  {
    id: 'projects',
    tag: 'Core 02',
    name: 'Project Spaces',
    description:
      'Organize teams, initiatives, and ongoing work in one clean environment built for clarity and coordination.',
    features: ['Shared workspaces', 'Project organization', 'Team visibility', 'Structured planning'],
    accent: 'cyan',
    icon: (
      <svg width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path d="M3 7.5A2.5 2.5 0 0 1 5.5 5H10l2 2h6.5A2.5 2.5 0 0 1 21 9.5v8A2.5 2.5 0 0 1 18.5 20h-13A2.5 2.5 0 0 1 3 17.5v-10Z" />
      </svg>
    ),
  },
  {
    id: 'tasks',
    tag: 'Core 03',
    name: 'Task Workflow',
    description:
      'Create, assign, prioritize, and follow progress with a workflow that keeps delivery moving without extra complexity.',
    features: ['Clear priorities', 'Ownership tracking', 'Status updates', 'Focused execution'],
    accent: 'violet',
    icon: (
      <svg width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path d="M9 11.5 11.5 14 21 4.5" />
        <path d="M21 12v6.5A2.5 2.5 0 0 1 18.5 21h-13A2.5 2.5 0 0 1 3 18.5v-13A2.5 2.5 0 0 1 5.5 3H16" />
      </svg>
    ),
  },
  {
    id: 'insights',
    tag: 'Core 04',
    name: 'Insights & Reporting',
    description:
      'Turn activity into meaningful reporting so teams can see performance, spot trends, and make better decisions faster.',
    features: ['Progress reporting', 'Team insights', 'Visual trends', 'Decision support'],
    accent: 'emerald',
    icon: (
      <svg width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path d="M4 19h16" />
        <path d="M7 16V10" />
        <path d="M12 16V6" />
        <path d="M17 16v-4" />
      </svg>
    ),
  },
];

const accentStyles = {
  amber: {
    line: 'from-amber-400/70 via-amber-300/60 to-transparent',
    icon: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
    badge: 'text-amber-600 bg-amber-500/10 border-amber-500/20',
    dot: 'bg-amber-500',
  },
  cyan: {
    line: 'from-cyan-400/70 via-sky-400/60 to-transparent',
    icon: 'text-cyan-500 bg-cyan-500/10 border-cyan-500/20',
    badge: 'text-cyan-600 bg-cyan-500/10 border-cyan-500/20',
    dot: 'bg-cyan-500',
  },
  violet: {
    line: 'from-violet-500/70 via-indigo-400/60 to-transparent',
    icon: 'text-violet-500 bg-violet-500/10 border-violet-500/20',
    badge: 'text-violet-600 bg-violet-500/10 border-violet-500/20',
    dot: 'bg-violet-500',
  },
  emerald: {
    line: 'from-emerald-500/70 via-green-400/60 to-transparent',
    icon: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
    badge: 'text-emerald-600 bg-emerald-500/10 border-emerald-500/20',
    dot: 'bg-emerald-500',
  },
} as const;

export default function ServicesSection() {
  return (
    <section
      id="services"
      className="relative overflow-hidden px-6 py-24 text-[color:var(--color-text-primary)]"
    >
      <div className="absolute inset-0 bg-[linear-gradient(180deg,var(--color-bg-primary)_0%,var(--color-bg-secondary)_50%,var(--color-bg-primary)_100%)]" />
      <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(148,163,184,0.4)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.4)_1px,transparent_1px)] [background-size:48px_48px]" />
      <div className="absolute left-1/2 top-24 h-72 w-72 -translate-x-1/2 rounded-full bg-cyan-400/10 blur-3xl" />
      <div className="absolute bottom-8 right-0 h-72 w-72 rounded-full bg-violet-500/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl">
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[color:var(--color-border-accent)] bg-[color:var(--color-bg-card)] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-[color:var(--color-accent-cyan)] shadow-sm">
            <span className="h-2 w-2 rounded-full bg-[color:var(--color-accent-cyan)]" />
            Platform Services
          </div>

          <h2 className="mt-6 text-4xl font-extrabold leading-tight tracking-[-0.03em] sm:text-5xl">
            Built around the work
            <br />
            <span className="text-[color:var(--color-text-muted)]">your team actually does.</span>
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-[color:var(--color-text-secondary)] sm:text-lg">
            Each part of the platform is designed to support planning, execution, visibility, and progress without making the experience feel complicated.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {SERVICES.map((service) => {
            const accent = accentStyles[service.accent as keyof typeof accentStyles];

            return (
              <div
                key={service.id}
                className="group relative overflow-hidden rounded-[28px] border border-[color:var(--color-border)] bg-[color:var(--color-bg-card)] p-6 shadow-[0_24px_70px_rgba(15,23,42,0.08)] transition duration-300 hover:-translate-y-1 hover:border-[color:var(--color-border-accent)]"
              >
                <div className={`absolute inset-x-0 top-0 h-px bg-gradient-to-r ${accent.line}`} />

                <div className="mb-5 flex items-start justify-between gap-4">
                  <div
                    className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl border ${accent.icon}`}
                  >
                    {service.icon}
                  </div>

                  <span
                    className={`rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] ${accent.badge}`}
                  >
                    {service.tag}
                  </span>
                </div>

                <h3 className="text-xl font-semibold tracking-[-0.01em] text-[color:var(--color-text-primary)]">
                  {service.name}
                </h3>

                <p className="mt-3 text-sm leading-7 text-[color:var(--color-text-secondary)]">
                  {service.description}
                </p>

                <div className="mt-5 flex flex-wrap gap-2">
                  {service.features.map((feature) => (
                    <span
                      key={feature}
                      className="rounded-full border border-[color:var(--color-border)] bg-[color:var(--color-bg-secondary)] px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.08em] text-[color:var(--color-text-secondary)]"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-10 rounded-[28px] border border-[color:var(--color-border)] bg-[color:var(--color-bg-card)] p-6 shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[color:var(--color-text-muted)]">
                Why this matters
              </p>
              <h3 className="mt-2 text-2xl font-bold tracking-[-0.02em] text-[color:var(--color-text-primary)]">
                One connected experience, not scattered tools.
              </h3>
              <p className="mt-3 text-sm leading-7 text-[color:var(--color-text-secondary)]">
                From access and planning to execution and reporting, every part works together to keep the workspace cleaner, more reliable, and easier to use.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 lg:min-w-[420px]">
              {[
                { label: 'Structured', accent: 'bg-cyan-500' },
                { label: 'Reliable', accent: 'bg-violet-500' },
                { label: 'Scalable', accent: 'bg-emerald-500' },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-bg-secondary)] px-4 py-4"
                >
                  <div className={`mb-3 h-2 w-10 rounded-full ${item.accent}`} />
                  <p className="text-sm font-semibold text-[color:var(--color-text-primary)]">
                    {item.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}