'use client';

import Link from 'next/link';

const FOOTER_LINKS = {
  Platform: [
    { label: 'Secure Access', href: '#services' },
    { label: 'Project Spaces', href: '#services' },
    { label: 'Task Workflow', href: '#services' },
    { label: 'Insights & Reporting', href: '#services' },
  ],
  Developers: [
    { label: 'API Reference', href: '/docs/api' },
    { label: 'OpenAPI Spec', href: '/docs/openapi' },
    { label: 'SDKs', href: '/docs/sdks' },
    { label: 'Changelog', href: '/changelog' },
  ],
  Company: [
    { label: 'About', href: '/about' },
    { label: 'Blog', href: '/blog' },
    { label: 'Careers', href: '/careers' },
    { label: 'Status', href: '/status' },
  ],
  Legal: [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Security', href: '/security' },
    { label: 'Cookie Policy', href: '/cookies' },
  ],
};

const SOCIAL_ICONS = [
  {
    title: 'GitHub',
    href: '#',
    d: 'M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22',
  },
  {
    title: 'Twitter',
    href: '#',
    d: 'M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z',
  },
  {
    title: 'LinkedIn',
    href: '#',
    d: 'M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z M4 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4z',
  },
];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-[color:var(--color-border)] bg-[color:var(--color-bg-primary)] px-6 pb-8 pt-20 text-[color:var(--color-text-primary)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.08),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(129,140,248,0.08),transparent_24%)]" />
      <div className="absolute inset-0 opacity-[0.06] [background-image:linear-gradient(rgba(148,163,184,0.35)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.35)_1px,transparent_1px)] [background-size:42px_42px]" />

      <div className="relative mx-auto max-w-7xl">
        <div className="grid gap-12 border-b border-[color:var(--color-border)] pb-12 md:grid-cols-[1.15fr_repeat(4,minmax(0,1fr))]">
          <div>
            <Link href="/" className="inline-flex items-center gap-3">
              <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl border border-cyan-400/20 bg-gradient-to-br from-cyan-400/20 via-sky-400/10 to-violet-500/20">
                <div className="h-6 w-6 bg-gradient-to-br from-cyan-300 via-sky-400 to-violet-500 [clip-path:polygon(50%_0%,100%_25%,100%_75%,50%_100%,0%_75%,0%_25%)]" />
              </div>

              <div className="leading-none">
                <p className="text-lg font-extrabold tracking-[0.08em] text-[color:var(--color-text-primary)]">
                  TASKMASTER
                </p>
                <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-[color:var(--color-text-muted)]">
                  Workspace
                </p>
              </div>
            </Link>

            <p className="mt-5 max-w-xs text-sm leading-7 text-[color:var(--color-text-secondary)]">
              A modern workspace for planning projects, managing tasks, and helping teams stay aligned from idea to delivery.
            </p>

            <div className="mt-6 flex items-center gap-3">
              {SOCIAL_ICONS.map((icon) => (
                <a
                  key={icon.title}
                  href={icon.href}
                  aria-label={icon.title}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-bg-card)] text-[color:var(--color-text-secondary)] transition duration-300 hover:-translate-y-0.5 hover:border-[color:var(--color-border-accent)] hover:text-[color:var(--color-accent-cyan)]"
                >
                  <svg
                    width="18"
                    height="18"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    viewBox="0 0 24 24"
                  >
                    <path d={icon.d} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {Object.entries(FOOTER_LINKS).map(([group, links]) => (
            <div key={group}>
              <h4 className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[color:var(--color-text-muted)]">
                {group}
              </h4>

              <ul className="mt-5 space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-[color:var(--color-text-secondary)] transition duration-200 hover:text-[color:var(--color-text-primary)]"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-4 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-[color:var(--color-text-muted)]">
            © {new Date().getFullYear()} TaskMaster Platform. All rights reserved.
          </p>

          <div className="inline-flex items-center gap-2 rounded-full border border-[color:var(--color-border)] bg-[color:var(--color-bg-card)] px-3 py-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[color:var(--color-text-secondary)]">
              All systems operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}