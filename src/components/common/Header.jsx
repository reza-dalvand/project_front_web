'use client';
import { FiChevronRight } from 'react-icons/fi';
import { useRouter } from 'next/navigation';

export default function Header({
  title,
  subtitle,
  onBackPress,
  backIcon = null,
  rightAction = null,
  variant = 'default',
  className = '',
}) {
  const router = useRouter();
  const isTransparent = variant === 'transparent';

  const handleBack =
    onBackPress ||
    (() => {
      if (typeof window !== 'undefined' && window.history.length > 1) {
        router.back();
      } else {
        router.push('/');
      }
    });

  return (
    <div
      className={`
        flex items-center justify-between relative z-50
        px-3 sm:px-5 lg:px-6
        pb-2.5 sm:pb-3.5
        ${isTransparent ? 'bg-transparent' : 'bg-[var(--bg)] border-b border-[var(--border)]/40'}
        ${className}
      `}
      style={{ paddingTop: 'env(safe-area-inset-top, 12px)' }}
    >
      {/* دکمه بازگشت */}
      <div className="min-w-[40px] sm:min-w-[44px] h-[40px] sm:h-[44px] flex items-center justify-start">
        <button
          onClick={handleBack}
          className={`
            w-[38px] h-[38px] sm:w-[42px] sm:h-[42px]
            rounded-full flex items-center justify-center border transition-colors
            active:scale-95
            ${
              isTransparent
                ? 'bg-white/85 border-[var(--border)]/60'
                : 'bg-[var(--card)] border-[var(--border)]/60'
            }
          `}
        >
          {backIcon || (
            <FiChevronRight
              size={22}
              className="text-[var(--text-main)] sm:w-[24px] sm:h-[24px]"
            />
          )}
        </button>
      </div>

      {/* عنوان و زیرعنوان */}
      <div className="flex-1 flex flex-col items-center justify-center px-2 sm:px-4 min-w-0">
        {title && (
          <h1 className="text-[15px] sm:text-[17px] lg:text-[18px] font-vazir-bold text-center tracking-tight text-[var(--text-main)] truncate w-full">
            {title}
          </h1>
        )}
        {subtitle && (
          <span className="text-[10px] sm:text-[11px] lg:text-[12px] font-vazir-medium text-center mt-0.5 sm:mt-1 opacity-80 text-[var(--text-secondary)] truncate w-full">
            {subtitle}
          </span>
        )}
      </div>

      {/* اکشن سمت راست */}
      <div className="min-w-[40px] sm:min-w-[44px] h-[40px] sm:h-[44px] flex items-center justify-end">
        {rightAction || <div className="w-[38px] h-[38px] sm:w-[42px] sm:h-[42px]" />}
      </div>
    </div>
  );
}