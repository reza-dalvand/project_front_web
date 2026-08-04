'use client';

import { useTheme } from '@/stores/useThemeStore';

/**
 * کامپوننت LoadingSpinner
 *
 * @param {string} label - متن زیر اسپینر
 * @param {'sm'|'md'|'lg'} size - اندازه
 * @param {boolean} overlay - نمایش تمام صفحه
 */
export default function LoadingSpinner({
  label,
  size = 'md',
  overlay = false,
}) {
  const { colors } = useTheme();

  const sizeClasses = {
    sm: 'w-5 h-5 border-2',
    md: 'w-8 h-8 border-[3px]',
    lg: 'w-12 h-12 border-4',
  };

  const spinner = (
    <div className="flex flex-col items-center justify-center gap-3 p-6">
      <div
        className={`
          ${sizeClasses[size]}
          rounded-full
          animate-spin
          border-current border-t-transparent
        `}
        style={{ color: colors.primary }}
      />
      {label && (
        <p
          className="text-sm text-center font-[Vazir]"
          style={{ color: colors.textSecondary }}
        >
          {label}
        </p>
      )}
    </div>
  );

  if (overlay) {
    return (
      <div
        className="fixed inset-0 z-[999] flex items-center justify-center"
        style={{ backgroundColor: colors.background + 'CC' }}
      >
        {spinner}
      </div>
    );
  }

  return spinner;
}