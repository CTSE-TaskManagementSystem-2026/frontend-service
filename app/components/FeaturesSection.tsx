'use client';

const FEATURES = [
  {
    icon: (
      <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
      </svg>
    ),
    title: 'Live collaboration',
    description:
      'Stay up to date with changes as work moves forward, so teams can respond faster and keep momentum without confusion.',
  },
  {
    icon: (
      <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
      </svg>
    ),
    title: 'Responsive workspace',
    description:
      'A clean experience across desktop, tablet, and mobile, so projects and tasks stay accessible wherever work happens.',
  },
  {
    icon: (
      <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
    title: 'Secure access',
    description:
      'Protect accounts and workspace activity with a safer sign-in experience designed to keep team data under control.',
  },
  {
    icon: (
      <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
      </svg>
    ),
    title: 'Actionable insights',
    description:
      'Turn project activity into clear visuals and useful signals that help teams understand progress and make better decisions.',
  },
  {
    icon: (
      <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <circle cx="18" cy="18" r="3" />
        <circle cx="6" cy="6" r="3" />
        <path d="M13 6h3a2 2 0 0 1 2 2v7" />
        <line x1="6" y1="9" x2="6" y2="21" />
      </svg>
    ),
    title: 'Built to grow',
    description:
      'Support small teams today and larger workflows tomorrow with a structure that stays organized as demands increase.',
  },
  {
    icon: (
      <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path d="M14.5 10c-.83 0-1.5-.67-1.5-1.5v-5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5v5c0 .83-.67 1.5-1.5 1.5z" />
        <path d="M20.5 10H19V8.5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
        <path d="M9.5 14c.83 0 1.5.67 1.5 1.5v5c0 .83-.67 1.5-1.5 1.5S8 21.33 8 20.5v-5c0-.83.67-1.5 1.5-1.5z" />
        <path d="M3.5 14H5v1.5c0 .83-.67 1.5-1.5 1.5S2 16.33 2 15.5 2.67 14 3.5 14z" />
        <path d="M14 14.5c0-.83.67-1.5 1.5-1.5h5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5h-5c-.83 0-1.5-.67-1.5-1.5z" />
        <path d="M15.5 19H14v1.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5-.67-1.5-1.5-1.5z" />
        <path d="M10 9.5C10 8.67 9.33 8 8.5 8h-5C2.67 8 2 8.67 2 9.5S2.67 11 3.5 11h5c.83 0 1.5-.67 1.5-1.5z" />
        <path d="M8.5 5H10V3.5C10 2.67 9.33 2 8.5 2S7 2.67 7 3.5 7.67 5 8.5 5z" />
      </svg>
    ),
    title: 'Connected workflows',
    description:
      'Keep projects, tasks, updates, and reporting working together in one smoother experience instead of scattered tools.',
  },
];

export default function FeaturesSection() {
  return (
    <section
      id="features"
      className="relative overflow-hidden px-6 py-24 text-[color:var(--color-text-primary)]"
    >
      <div className="absolute inset-0 bg-[linear-gradient(180deg,var(--color-bg-primary)_0%,var(--color-bg-secondary)_50%,var(--color-bg-primary)_100%)]" />
      <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(148,163,184,0.45)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.45)_1px,transparent_1px)] [background-size:44px_44px]" />
      <div className="absolute left-1/4 top-16 h-44 w-44 rounded-full bg-cyan-400/10 blur-3xl" />
      <div className="absolute bottom-10 right-0 h-52 w-52 rounded-full bg-violet-500/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl">
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[color:var(--color-border-accent)] bg-[color:var(--color-bg-card)] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-[color:var(--color-accent-cyan)] shadow-sm">
            <span className="h-2 w-2 rounded-full bg-[color:var(--color-accent-cyan)]" />
            Features
          </div>

          <h2 className="mt-6 text-4xl font-extrabold leading-tight tracking-[-0.03em] sm:text-5xl">
            Everything your team needs.
            <br />
            <span className="text-[color:var(--color-text-muted)]">Nothing it doesn&apos;t.</span>
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-[color:var(--color-text-secondary)] sm:text-lg">
            Designed to make planning, coordination, and delivery feel clearer, faster, and more dependable for every team.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {FEATURES.map((feature) => (
            <div
              key={feature.title}
              className="group relative overflow-hidden rounded-[28px] border border-[color:var(--color-border)] bg-[color:var(--color-bg-card)] p-7 shadow-[0_24px_70px_rgba(15,23,42,0.08)] transition duration-300 hover:-translate-y-1 hover:border-[color:var(--color-border-accent)]"
            >
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent opacity-0 transition duration-300 group-hover:opacity-100" />

              <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-[color:var(--color-border-accent)] bg-[color:var(--color-bg-secondary)] text-[color:var(--color-accent-cyan)] shadow-sm">
                {feature.icon}
              </div>

              <h3 className="text-xl font-semibold tracking-[-0.01em] text-[color:var(--color-text-primary)]">
                {feature.title}
              </h3>

              <p className="mt-3 text-sm leading-7 text-[color:var(--color-text-secondary)]">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}