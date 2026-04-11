import { useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import { getFromStorage, saveToStorage } from './storage';
import { ThemeContext, type Theme } from './theme-context';

const STORAGE_KEY = 'anxiety-theme';

function resolve(theme: Theme): 'light' | 'dark' {
  if (theme === 'system') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return theme;
}

function apply(resolved: 'light' | 'dark') {
  document.documentElement.classList.toggle('dark', resolved === 'dark');
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeRaw] = useState<Theme>(() => {
    const stored = getFromStorage<Theme>(STORAGE_KEY, 'system');
    apply(resolve(stored));
    return stored;
  });

  const [resolved, setResolved] = useState<'light' | 'dark'>(() => resolve(theme));

  const setTheme = useCallback((t: Theme) => {
    setThemeRaw(t);
    saveToStorage(STORAGE_KEY, t);
    const r = resolve(t);
    setResolved(r);
    apply(r);
  }, []);

  useEffect(() => {
    if (theme !== 'system') return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => {
      const r = resolve('system');
      setResolved(r);
      apply(r);
    };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [theme]);

  return (
    <ThemeContext value={{ theme, setTheme, resolved }}>
      {children}
    </ThemeContext>
  );
}
