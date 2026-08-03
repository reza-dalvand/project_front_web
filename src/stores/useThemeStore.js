// src/stores/useThemeStore.js
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { lightColors, darkColors } from '../theme/colors';

// تشخیص تم سیستم
const getSystemTheme = () => {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
};

const getResolvedTheme = (theme) => {
  if (theme === 'system') {
    return getSystemTheme();
  }
  return theme;
};

const getColors = (resolved) => {
  return resolved === 'dark' ? darkColors : lightColors;
};

export const useThemeStore = create(
  persist(
    (set, get) => ({
      theme: 'system',
      resolvedTheme: getResolvedTheme('system'),
      colors: getColors(getResolvedTheme('system')),
      _hydrated: false,

      setHydrated: () => set({ _hydrated: true }),

      setTheme: (value) => {
        const resolved = getResolvedTheme(value);
        set({
          theme: value,
          resolvedTheme: resolved,
          colors: getColors(resolved),
        });
      },

      updateFromSystem: () => {
        const { theme } = get();
        if (theme === 'system') {
          const resolved = getSystemTheme();
          set({
            resolvedTheme: resolved,
            colors: getColors(resolved),
          });
        }
      },
    }),
    {
      name: 'zibano-theme-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        theme: state.theme,
      }),
      onRehydrateStorage: () => {
        return (state) => {
          if (state) {
            const resolved = getResolvedTheme(state.theme);
            state.resolvedTheme = resolved;
            state.colors = getColors(resolved);
            state.setHydrated();
          }
        };
      },
    }
  )
);

// Hook کمکی
export const useTheme = () => {
  const colors = useThemeStore((s) => s.colors);
  const resolvedTheme = useThemeStore((s) => s.resolvedTheme);
  const theme = useThemeStore((s) => s.theme);
  const setTheme = useThemeStore((s) => s.setTheme);
  const _hydrated = useThemeStore((s) => s._hydrated);

  return { colors, resolvedTheme, theme, setTheme, _hydrated };
};