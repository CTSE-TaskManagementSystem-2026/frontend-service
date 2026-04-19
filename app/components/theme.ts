export type Theme = 'dark' | 'light';

export const THEME_TOKENS: Record<Theme, Record<string, string>> = {
  dark: {
    '--color-bg-primary': '#07080F',
    '--color-bg-secondary': '#0D0E1A',
    '--color-bg-card': '#0F1020',
    '--color-border': 'rgba(255,255,255,0.08)',
    '--color-border-accent': 'rgba(34,211,238,0.3)',
    '--color-accent-cyan': '#22D3EE',
    '--color-accent-amber': '#F59E0B',
    '--color-accent-violet': '#818CF8',
    '--color-text-primary': '#F1F5F9',
    '--color-text-secondary': '#94A3B8',
    '--color-text-muted': '#475569',
    '--color-dark-base': '#07080F',
    '--bg-primary': '#07080F',
    '--bg-secondary': '#0D0E1A',
    '--bg-card': '#0F1020',
    '--border': 'rgba(255,255,255,0.08)',
    '--border-accent': 'rgba(34,211,238,0.3)',
    '--accent-cyan': '#22D3EE',
    '--accent-amber': '#F59E0B',
    '--accent-violet': '#818CF8',
    '--text-primary': '#F1F5F9',
    '--text-secondary': '#94A3B8',
    '--text-muted': '#475569',
  },
  light: {
    '--color-bg-primary': '#F8FAFC',
    '--color-bg-secondary': '#EEF2FF',
    '--color-bg-card': '#FFFFFF',
    '--color-border': 'rgba(15,23,42,0.08)',
    '--color-border-accent': 'rgba(14,165,233,0.22)',
    '--color-accent-cyan': '#0891B2',
    '--color-accent-amber': '#D97706',
    '--color-accent-violet': '#6366F1',
    '--color-text-primary': '#0F172A',
    '--color-text-secondary': '#475569',
    '--color-text-muted': '#64748B',
    '--color-dark-base': '#0F172A',
    '--bg-primary': '#F8FAFC',
    '--bg-secondary': '#EEF2FF',
    '--bg-card': '#FFFFFF',
    '--border': 'rgba(15,23,42,0.08)',
    '--border-accent': 'rgba(14,165,233,0.22)',
    '--accent-cyan': '#0891B2',
    '--accent-amber': '#D97706',
    '--accent-violet': '#6366F1',
    '--text-primary': '#0F172A',
    '--text-secondary': '#475569',
    '--text-muted': '#64748B',
  },
};

export function getInitialTheme(): Theme {
  if (typeof window === 'undefined') return 'dark';

  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark' || savedTheme === 'light') {
    return savedTheme;
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
}

export function applyTheme(theme: Theme) {
  if (typeof document === 'undefined') return;

  const root = document.documentElement;
  const tokens = THEME_TOKENS[theme];

  Object.entries(tokens).forEach(([key, value]) => {
    root.style.setProperty(key, value);
  });

  root.dataset.theme = theme;
  root.classList.toggle('dark', theme === 'dark');

  document.body.style.backgroundColor = tokens['--color-bg-primary'];
  document.body.style.color = tokens['--color-text-primary'];

  localStorage.setItem('theme', theme);
}
