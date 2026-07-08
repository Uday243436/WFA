export interface ThemeVariables {
  '--bg-background': string;
  '--bg-surface': string;
  '--bg-surface-hover': string;
  '--border-color': string;
  '--text-primary': string;
  '--text-secondary': string;
  '--primary-accent': string;
  '--primary-accent-glow': string;
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
  '--bg-background': '#f8fafc',
  '--bg-surface': '#ffffff',
  '--bg-surface-hover': '#f1f5f9',
  '--border-color': '#e2e8f0',
  '--text-primary': '#0f172a',
  '--text-secondary': '#64748b',
  '--primary-accent': '#6366f1',
  '--primary-accent-glow': 'rgba(99, 102, 241, 0.15)',
  '--shadow-sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  '--shadow-md': '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
  '--shadow-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.02)',
  '--glass-bg': 'rgba(255, 255, 255, 0.75)',
  '--glass-border': 'rgba(226, 232, 240, 0.8)',
  '--status-up': '#10b981',
  '--status-down': '#ef4444',
  '--status-neutral': '#6b7280',
};

export const darkTheme: ThemeVariables = {
  '--bg-background': '#090a0f',
  '--bg-surface': '#12141c',
  '--bg-surface-hover': '#1e212f',
  '--border-color': '#222533',
  '--text-primary': '#f1f5f9',
  '--text-secondary': '#94a3b8',
  '--primary-accent': '#818cf8',
  '--primary-accent-glow': 'rgba(129, 140, 248, 0.2)',
  '--shadow-sm': '0 1px 2px 0 rgba(0, 0, 0, 0.5)',
  '--shadow-md': '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)',
  '--shadow-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.4), 0 4px 6px -2px rgba(0, 0, 0, 0.3)',
  '--glass-bg': 'rgba(18, 20, 28, 0.75)',
  '--glass-border': 'rgba(34, 37, 51, 0.8)',
  '--status-up': '#34d399',
  '--status-down': '#f87171',
  '--status-neutral': '#94a3b8',
};

export function applyTheme(theme: 'light' | 'dark') {
  const root = document.documentElement;
  const activeTheme = theme === 'dark' ? darkTheme : lightTheme;
  Object.entries(activeTheme).forEach(([variable, value]) => {
    root.style.setProperty(variable, value);
  });
  root.setAttribute('data-theme', theme);
}
