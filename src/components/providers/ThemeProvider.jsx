// src/components/providers/ThemeProvider.jsx
'use client';

import { useEffect } from 'react';
import { useThemeStore } from '@/stores/useThemeStore';

export default function ThemeProvider({ children }) {
  const resolvedTheme = useThemeStore((s) => s.resolvedTheme);
  const updateFromSystem = useThemeStore((s) => s.updateFromSystem);
  const _hydrated = useThemeStore((s) => s._hydrated);

  // گوش دادن به تغییرات system preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => updateFromSystem();

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [updateFromSystem]);

  // اعمال کلاس dark و RTL به html
  useEffect(() => {
    const root = document.documentElement;

    // تنظیم RTL
    root.setAttribute('dir', 'rtl');
    root.setAttribute('lang', 'fa');

    // اعمال dark mode
    if (resolvedTheme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    // علامت‌گذاری که تم بارگذاری شده
    root.setAttribute('data-theme-loaded', 'true');
  }, [resolvedTheme]);

  return <>{children}</>;
}
