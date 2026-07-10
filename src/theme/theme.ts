export interface ThemeVariables {
  '--bg-background': string;
  '--bg-background-soft': string;
  '--bg-surface': string;
  '--bg-surface-hover': string;
  '--border-color': string;
  '--border-strong': string;
  '--text-primary': string;
  '--text-secondary': string;
  '--text-muted': string;
  '--primary-accent': string;
  '--primary-accent-glow': string;
  '--secondary-accent': string;
  '--warm-accent': string;
  '--page-gradient': string;
  '--surface-gradient': string;
  '--sidebar-gradient': string;
  '--shadow-sm': string;
  '--shadow-md': string;
  '--shadow-lg': string;
  '--glass-bg': string;
  '--glass-border': string;
  '--status-up': string;
  '--status-down': string;
  '--status-neutral': string;
}

export const lightTheme: ThemeVariables = {
  '--bg-background': '#f6f8fb',
  '--bg-background-soft': '#edf4ff',
  '--bg-surface': '#ffffff',
  '--bg-surface-hover': '#eef4fb',
  '--border-color': '#d9e2ef',
  '--border-strong': '#c8d4e3',
  '--text-primary': '#132033',
  '--text-secondary': '#5e6f87',
  '--text-muted': '#8a99ab',
  '--primary-accent': '#4f46e5',
  '--primary-accent-glow': 'rgba(79, 70, 229, 0.16)',
  '--secondary-accent': '#0ea5e9',
  '--warm-accent': '#f59e0b',
  '--page-gradient': 'radial-gradient(circle at 12% 8%, rgba(14, 165, 233, 0.16), transparent 28%), radial-gradient(circle at 88% 18%, rgba(245, 158, 11, 0.12), transparent 24%), linear-gradient(135deg, #f8fbff 0%, #eef4fb 48%, #f7fafc 100%)',
  '--surface-gradient': 'linear-gradient(145deg, rgba(255, 255, 255, 0.96), rgba(247, 250, 252, 0.86))',
  '--sidebar-gradient': 'linear-gradient(180deg, rgba(255, 255, 255, 0.98), rgba(242, 247, 253, 0.94))',
  '--shadow-sm': '0 8px 22px rgba(30, 41, 59, 0.07)',
  '--shadow-md': '0 16px 40px rgba(30, 41, 59, 0.10)',
  '--shadow-lg': '0 24px 70px rgba(30, 41, 59, 0.16)',
  '--glass-bg': 'rgba(255, 255, 255, 0.78)',
  '--glass-border': 'rgba(201, 213, 229, 0.72)',
  '--status-up': '#10b981',
  '--status-down': '#ef4444',
  '--status-neutral': '#6b7280',
};

export const darkTheme: ThemeVariables = {
  '--bg-background': '#080b12',
  '--bg-background-soft': '#101827',
  '--bg-surface': '#111827',
  '--bg-surface-hover': '#1a2435',
  '--border-color': '#243247',
  '--border-strong': '#334155',
  '--text-primary': '#f4f7fb',
  '--text-secondary': '#a6b4c8',
  '--text-muted': '#74839a',
  '--primary-accent': '#8b9cff',
  '--primary-accent-glow': 'rgba(139, 156, 255, 0.20)',
  '--secondary-accent': '#22d3ee',
  '--warm-accent': '#fbbf24',
  '--page-gradient': 'radial-gradient(circle at 10% 8%, rgba(34, 211, 238, 0.16), transparent 30%), radial-gradient(circle at 88% 12%, rgba(251, 191, 36, 0.10), transparent 24%), linear-gradient(135deg, #070a11 0%, #101827 52%, #0c1220 100%)',
  '--surface-gradient': 'linear-gradient(145deg, rgba(17, 24, 39, 0.94), rgba(15, 23, 42, 0.82))',
  '--sidebar-gradient': 'linear-gradient(180deg, rgba(13, 18, 29, 0.98), rgba(17, 24, 39, 0.94))',
  '--shadow-sm': '0 10px 26px rgba(0, 0, 0, 0.24)',
  '--shadow-md': '0 18px 48px rgba(0, 0, 0, 0.32)',
  '--shadow-lg': '0 28px 80px rgba(0, 0, 0, 0.45)',
  '--glass-bg': 'rgba(17, 24, 39, 0.74)',
  '--glass-border': 'rgba(71, 85, 105, 0.42)',
  '--status-up': '#34d399',
  '--status-down': '#f87171',
  '--status-neutral': '#94a3b8',
};

export type AppTheme = 'light' | 'dark';

export function applyTheme(theme: AppTheme) {
  const root = document.documentElement;
  const activeTheme = theme === 'dark' ? darkTheme : lightTheme;
  Object.entries(activeTheme).forEach(([variable, value]) => {
    root.style.setProperty(variable, value as string);
  });
  root.setAttribute('data-theme', theme);
  root.style.colorScheme = theme;
}
