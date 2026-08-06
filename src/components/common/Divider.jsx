'use client';

import { useTheme } from '@/stores/useThemeStore';

/**
 * کامپوننت Divider - خط جداکننده
 *
 * @param {string} label - متن وسط خط
 * @param {'horizontal'|'vertical'} orientation - جهت
 * @param {number} thickness - ضخامت
 * @param {number} spacing - فاصله عمودی
 */
export default function Divider({
  label,
  orientation = 'horizontal',
  thickness = 1,
  spacing = 16,
}) {
  const { colors } = useTheme();

  if (orientation === 'vertical') {
    return (
      <div
        className="self-stretch"
        style={{
          width: `${thickness}px`,
          margin: `0 ${spacing}px`,
          backgroundColor: colors.border,
        }}
      />
    );
  }

  if (label) {
    return (
      <div className="flex items-center" style={{ margin: `${spacing}px 0` }}>
        <div
          className="flex-1"
          style={{
            height: `${thickness}px`,
            backgroundColor: colors.border,
          }}
        />
        <span className="px-3 text-xs font-[Vazir]" style={{ color: colors.textSecondary }}>
          {label}
        </span>
        <div
          className="flex-1"
          style={{
            height: `${thickness}px`,
            backgroundColor: colors.border,
          }}
        />
      </div>
    );
  }

  return (
    <div
      className="w-full"
      style={{
        height: `${thickness}px`,
        margin: `${spacing}px 0`,
        backgroundColor: colors.border,
      }}
    />
  );
}
