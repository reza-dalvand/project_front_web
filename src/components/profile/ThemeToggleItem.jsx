'use client';

import { FiSun, FiMoon } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';

export default function ThemeToggleItem({ isDark, onToggle }) {
  const { colors } = useTheme();

  return (
    <button
      onClick={onToggle}
      className="flex items-center justify-between p-3.5 rounded-2xl border w-full text-right"
      style={{
        backgroundColor: colors.cardBackground,
        borderColor: colors.border,
      }}
    >
      <div className="flex items-center gap-3 flex-1">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: '#FFC10720' }}
        >
          {isDark ? (
            <FiSun size={24} color="#FFC107" />
          ) : (
            <FiMoon size={24} color="#FFC107" />
          )}
        </div>
        <div className="flex flex-col gap-0.5 flex-1">
          <span
            className="text-[15px] font-[Vazir-Bold]"
            style={{ color: colors.textMain }}
          >
            حالت شب / روز
          </span>
          <span
            className="text-xs"
            style={{ color: colors.textSecondary }}
          >
            {isDark ? 'تم تاریک فعال است' : 'تم روشن فعال است'}
          </span>
        </div>
      </div>

      {/* سوئیچ */}
      <div
        className="w-11 h-6 rounded-full px-0.5 flex items-center transition-colors duration-300"
        style={{ backgroundColor: isDark ? colors.primary : colors.border }}
      >
        <div
          className="w-5 h-5 rounded-full bg-white shadow-md transition-all duration-300"
          style={{
            transform: isDark ? 'translateX(-18px)' : 'translateX(0)',
          }}
        />
      </div>
    </button>
  );
}