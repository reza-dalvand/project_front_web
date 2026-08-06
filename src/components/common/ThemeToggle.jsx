// src/components/common/ThemeToggle.jsx
'use client';

import { useTheme } from '@/stores/useThemeStore';

export default function ThemeToggle() {
  const { theme, resolvedTheme, setTheme, colors } = useTheme();

  const cycleTheme = () => {
    if (theme === 'light') setTheme('dark');
    else if (theme === 'dark') setTheme('system');
    else setTheme('light');
  };

  const getLabel = () => {
    if (theme === 'system') return `سیستم (${resolvedTheme === 'dark' ? 'تاریک' : 'روشن'})`;
    return theme === 'dark' ? 'تاریک' : 'روشن';
  };

  const getIcon = () => {
    if (theme === 'light') return '☀️';
    if (theme === 'dark') return '🌙';
    return '💻';
  };

  return (
    <button
      onClick={cycleTheme}
      className="px-6 py-3 rounded-2xl border-2 transition-all duration-200 
                 hover:scale-105 active:scale-95 cursor-pointer
                 flex items-center gap-3"
      style={{
        backgroundColor: colors.cardBackground,
        borderColor: colors.primary,
        color: colors.textMain,
      }}
    >
      <span className="text-2xl">{getIcon()}</span>
      <span>تم: {getLabel()}</span>
    </button>
  );
}
