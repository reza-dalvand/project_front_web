// src/app/loading.jsx
'use client';

import { useTheme } from '@/stores/useThemeStore';

export default function Loading() {
  const { colors } = useTheme();

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center gap-6"
      style={{ backgroundColor: colors.background }}
    >
      {/* لوگو */}
      <div
        className="w-20 h-20 rounded-full flex items-center justify-center shadow-lg"
        style={{ backgroundColor: colors.primary }}
      >
        <span className="text-3xl">🌸</span>
      </div>

      {/* اسپینر */}
      <div
        className="w-10 h-10 border-4 rounded-full animate-spin"
        style={{
          borderColor: colors.primary + '30',
          borderTopColor: colors.primary,
        }}
      />

      {/* متن لودینگ */}
      <div className="text-center">
        <p className="text-sm font-[Vazir-Medium]" style={{ color: colors.textSecondary }}>
          در حال بارگذاری...
        </p>
      </div>
    </div>
  );
}
