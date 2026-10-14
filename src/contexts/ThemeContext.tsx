import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

export type ThemeName = 'delicado' | 'floral' | 'minimalista' | 'nocturno' | 'pastel' | 'natural';
export type Mode = 'claro' | 'oscuro' | 'auto';

interface ThemeValue {
  theme: ThemeName;
  mode: Mode;
  setTheme: (t: ThemeName) => void;
  setMode: (m: Mode) => void;
}

const Ctx = createContext<ThemeValue | null>(null);
const THEMES: ThemeName[] = ['delicado', 'floral', 'minimalista', 'nocturno', 'pastel', 'natural'];

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeName>(() => {
    const s = localStorage.getItem('ccycle-theme') as ThemeName | null;
    return s && THEMES.includes(s) ? s : 'delicado';
  });
  const [mode, setModeState] = useState<Mode>(() => {
    return (localStorage.getItem('ccycle-mode') as Mode | null) || 'auto';
  });

  useEffect(() => {
    localStorage.setItem('ccycle-theme', theme);
    document.documentElement.dataset.theme = theme;
  }, [theme]);
  useEffect(() => {
    localStorage.setItem('ccycle-mode', mode);
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const dark = mode === 'oscuro' || (mode === 'auto' && prefersDark);
    document.documentElement.dataset.mode = dark ? 'oscuro' : 'claro';
  }, [mode]);

  return (
    <Ctx.Provider value={{ theme, mode, setTheme: setThemeState, setMode: setModeState }}>
      {children}
    </Ctx.Provider>
  );
}

export function useTheme(): ThemeValue {
  const v = useContext(Ctx);
  if (!v) throw new Error('useTheme fuera de proveedor');
  return v;
}

export const THEME_OPTIONS: { id: ThemeName; label: string }[] = [
  { id: 'delicado', label: 'Delicado' },
  { id: 'floral', label: 'Floral' },
  { id: 'minimalista', label: 'Minimalista' },
  { id: 'nocturno', label: 'Nocturno' },
  { id: 'pastel', label: 'Pastel' },
  { id: 'natural', label: 'Natural' }
];
