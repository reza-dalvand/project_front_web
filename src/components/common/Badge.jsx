'use client';

import { useTheme } from '@/stores/useThemeStore';

/**
 * کامپوننت نشان (Badge) مشترک
 *
 * @param {string} label - متن نشان
 * @param {'primary'|'secondary'|'success'|'warning'|'error'|'neutral'} variant - نوع
 * @param {'sm'|'md'} size - اندازه
 * @param {boolean} dot - نمایش به صورت نقطه
 * @param {string} className - کلاس‌های اضافی
 */
export default function Badge({
  label,
  variant = 'primary',
  size = 'md',
  dot = false,
  className = '',
}) {
  const { colors } = useTheme();

  // رنگ‌های بر اساس نوع
  const variantMap = {
    primary: { bg: colors.primary + '22', text: colors.primary },
    secondary: { bg: colors.secondary + '22', text: colors.secondary },
    success: { bg: '#4CAF5022', text: '#4CAF50' },
    warning: { bg: '#FF980022', text: '#FF9800' },
    error: { bg: '#E5737322', text: '#E57373' },
    neutral: { bg: colors.border, text: colors.textSecondary },
  };

  const { bg, text } = variantMap[variant] || variantMap.primary;

  // اندازه‌های مختلف
  const sizeClasses = {
    sm: 'py-0.5 px-2 rounded-md text-[11px]',
    md: 'py-1 px-3 rounded-lg text-xs',
  };

  // حالت نقطه
  if (dot) {
    return (
      <div
        className={`w-2 h-2 rounded-full ${className}`}
        style={{ backgroundColor: text }}
      />
    );
  }

  return (
    <div
      className={`
        inline-flex items-center justify-center
        self-start
        ${sizeClasses[size]}
        ${className}
      `}
      style={{
        backgroundColor: bg,
        color: text,
        fontFamily: 'Vazir-Medium',
      }}
    >
      {label}
    </div>
  );
}