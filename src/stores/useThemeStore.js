// src/stores/useThemeStore.js
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// ═══════ رنگ‌ها (جایگزین theme/colors.js) ═══════
const LIGHT_COLORS = {
  background: '#F5F0EC',
  cardBackground: '#EBE3DE',
  primary: '#A88B7D',
  secondary: '#8D7468',
  textMain: '#2C2521',
  textSecondary: '#5A504B',
  border: '#DCD1CB',
};

const DARK_COLORS = {
  background: '#171412',
  cardBackground: '#26211E',
  primary: '#A88B7D',
  secondary: '#6B5A52',
  textMain: '#F5F0EC',
  textSecondary: '#BDB4AF',
  border: '#3D3734',
};

const getColors = (resolved) => (resolved === 'dark' ? DARK_COLORS : LIGHT_COLORS);

// ═══════ تشخیص تم سیستم ═══════
const getSystemTheme = () => {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

const getResolvedTheme = (theme) => {
  if (theme === 'system') return getSystemTheme();
  return theme;
};

// ═══════ Store ═══════
export const useThemeStore = create(
  persist(
    (set, get) => ({
      theme: 'system',
      resolvedTheme: 'light',
      colors: LIGHT_COLORS,
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
      storage: createJSONStorage(() =>
        typeof window !== 'undefined'
          ? localStorage
          : { getItem: () => null, setItem: () => {}, removeItem: () => {} }
      ),
      partialize: (state) => ({ theme: state.theme }),
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

// ═══════ Hook اصلی ═══════
export const useTheme = () => {
  const colors = useThemeStore((s) => s.colors);
  const resolvedTheme = useThemeStore((s) => s.resolvedTheme);
  const theme = useThemeStore((s) => s.theme);
  const setTheme = useThemeStore((s) => s.setTheme);
  const _hydrated = useThemeStore((s) => s._hydrated);

  return { colors, resolvedTheme, theme, setTheme, _hydrated };
};
