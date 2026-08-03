'use client';

import { useTheme } from '@/stores/useThemeStore';

export default function ScreenWrapper({
  children,
  scrollable = false,
  padding = 0,
  className = '',
  contentClassName = '',
}) {
  const { colors } = useTheme();

  if (scrollable) {
    return (
      <div
        className={`min-h-screen ${className}`}
        style={{ backgroundColor: colors.background }}
      >
        <div
          className={`flex flex-col ${contentClassName}`}
          style={{ padding: `${padding}px` }}
        >
          {children}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen flex flex-col ${className}`}
      style={{ backgroundColor: colors.background, padding: `${padding}px` }}
    >
      {children}
    </div>
  );
}