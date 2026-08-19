// src/components/common/Header.jsx
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

  // ✅ FIX: fallback برای وقتی history خالیه
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
        flex items-center justify-between px-5 pb-3.5 relative z-50
        ${isTransparent ? 'bg-transparent' : 'bg-[var(--bg)] border-b border-[var(--border)]/40'}
        ${className}
      `}
      style={{ paddingTop: '20px' }}
    >
      <div className="min-w-[44px] h-[44px] flex items-center justify-start">
        <button
          onClick={handleBack}
          className={`
            w-[42px] h-[42px] rounded-full flex items-center justify-center border transition-colors
            ${
              isTransparent
                ? 'bg-white/85 border-[var(--border)]/60'
                : 'bg-[var(--card)] border-[var(--border)]/60'
            }
          `}
        >
          {backIcon || <FiChevronRight size={24} className="text-[var(--text-main)]" />}
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-2">
        {title && (
          <h1 className="text-[17px] font-vazir-bold text-center tracking-tight text-[var(--text-main)]">
            {title}
          </h1>
        )}
        {subtitle && (
          <span className="text-[11px] font-vazir-medium text-center mt-1 opacity-80 text-[var(--text-secondary)]">
            {subtitle}
          </span>
        )}
      </div>

      <div className="min-w-[44px] h-[44px] flex items-center justify-end">
        {rightAction || <div className="w-[42px] h-[42px]" />}
      </div>
    </div>
  );
}
