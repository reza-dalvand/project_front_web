'use client';

import { FiChevronRight } from 'react-icons/fi';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/stores/useThemeStore';

export default function Header({
  title,
  subtitle,
  onBackPress,
  backIcon = null,
  rightAction = null,
  variant = 'default',
  className = '',
}) {
  const { colors } = useTheme();
  const router = useRouter();

  const isTransparent = variant === 'transparent';
  const handleBack = onBackPress || (() => router.back());

  return (
    <div
      className={`
        flex items-center justify-between px-5 pb-3.5 relative z-50
        ${className}
      `}
      style={{
        backgroundColor: isTransparent ? 'transparent' : colors.background,
        paddingTop: '20px',
        borderBottom: isTransparent ? 'none' : `1px solid ${colors.border}40`,
      }}
    >
      {/* دکمه بازگشت */}
      <div className="min-w-[44px] h-[44px] flex items-center justify-start">
        <button
          onClick={handleBack}
          className="w-[42px] h-[42px] rounded-full flex items-center justify-center border transition-colors"
          style={{
            backgroundColor: isTransparent ? 'rgba(255,255,255,0.85)' : colors.cardBackground,
            borderColor: colors.border + '60',
          }}
        >
          {backIcon || <FiChevronRight size={24} style={{ color: colors.textMain }} />}
        </button>
      </div>

      {/* عنوان وسط */}
      <div className="flex-1 flex flex-col items-center justify-center px-2">
        {title && (
          <h1
            className="text-[17px] font-[Vazir-Bold] text-center tracking-tight"
            style={{ color: colors.textMain }}
          >
            {title}
          </h1>
        )}
        {subtitle && (
          <span
            className="text-[11px] font-[Vazir-Medium] text-center mt-1 opacity-80"
            style={{ color: colors.textSecondary }}
          >
            {subtitle}
          </span>
        )}
      </div>

      {/* اکشن سمت چپ */}
      <div className="min-w-[44px] h-[44px] flex items-center justify-end">
        {rightAction || <div className="w-[42px] h-[42px]" />}
      </div>
    </div>
  );
}
