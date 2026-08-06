'use client';

import { useTheme } from '@/stores/useThemeStore';
import Card from './Card';

export default function StatsCard({
  icon,
  label,
  value,
  subtitle,
  color = '#2196F3',
  variant = 'default',
}) {
  const { colors } = useTheme();

  // حالت فشرده
  if (variant === 'compact') {
    return (
      <div className="flex-1 flex flex-col items-center gap-1">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center mb-1 text-xl"
          style={{ backgroundColor: color + '18', color }}
        >
          {icon}
        </div>
        <span className="text-[17px] font-[Vazir-Bold]" style={{ color: colors.textMain }}>
          {value}
        </span>
        <span
          className="text-[10px] font-[Vazir] text-center"
          style={{ color: colors.textSecondary }}
        >
          {label}
        </span>
      </div>
    );
  }

  // حالت افقی
  if (variant === 'horizontal') {
    return (
      <Card variant="elevated" padding={12} radius={14} className="w-[48.3%]">
        <div className="flex flex-col items-start gap-1">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center mb-1 text-xl"
            style={{ backgroundColor: color + '20', color }}
          >
            {icon}
          </div>
          <span className="text-[15px] font-[Vazir-Bold] mt-0.5" style={{ color: colors.textMain }}>
            {value}
          </span>
          <span
            className="text-[11.5px] font-[Vazir-Bold] mt-0.5"
            style={{ color: colors.textMain }}
          >
            {label}
          </span>
          {subtitle && (
            <span
              className="text-[9.5px] font-[Vazir] mt-0.5"
              style={{ color: colors.textSecondary }}
            >
              {subtitle}
            </span>
          )}
        </div>
      </Card>
    );
  }

  // حالت پیش‌فرض
  return (
    <Card variant="elevated" padding={16} radius={16} className="flex flex-col items-center gap-2">
      <div
        className="w-12 h-12 rounded-full flex items-center justify-center mb-1 text-2xl"
        style={{ backgroundColor: color + '20', color }}
      >
        {icon}
      </div>
      <span className="text-[22px] font-[Vazir-Bold]" style={{ color: colors.textMain }}>
        {value}
      </span>
      <span
        className="text-[12px] font-[Vazir] text-center"
        style={{ color: colors.textSecondary }}
      >
        {label}
      </span>
      {subtitle && (
        <span
          className="text-[10px] font-[Vazir] text-center"
          style={{ color: colors.textSecondary }}
        >
          {subtitle}
        </span>
      )}
    </Card>
  );
}
