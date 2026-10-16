'use client';

import { toPersianDigit } from '@/utils/numberUtils';

export default function StarRating({
  value = 0,
  maxStars = 5,
  onRate,
  interactive = false,
  showLabel = false,
  size = 'md',
  className = '',
}) {
  const numericValue = (() => {
    const parsed = Number(value);
    if (!Number.isFinite(parsed)) return 0;
    return Math.max(0, Math.min(maxStars, parsed));
  })();

  const starSizes = {
    xs: { mobile: 12, desktop: 14 },
    sm: { mobile: 14, desktop: 16 },
    md: { mobile: 16, desktop: 18 },
    lg: { mobile: 20, desktop: 24 },
  };

  const s = starSizes[size] ?? starSizes.md;
  const percent = maxStars > 0 ? (numericValue / maxStars) * 100 : 0;

  const renderVisualStars = (fontSize) => (
    <div
      className="relative inline-block leading-none select-none"
      style={{ fontSize }}
    >
      <span style={{ color: 'var(--border)' }}>
        {'★'.repeat(maxStars)}
      </span>

      <span
        className="absolute top-0 left-0 overflow-hidden whitespace-nowrap"
        style={{
          color: 'var(--primary)',
          width: `${percent}%`,
        }}
      >
        {'★'.repeat(maxStars)}
      </span>
    </div>
  );

  if (interactive && onRate) {
    return (
      <div className={`flex items-center gap-0.5 sm:gap-1 ${className}`} dir="ltr">
        {Array.from({ length: maxStars }).map((_, i) => {
          const isFilled = i < Math.round(numericValue);

          return (
            <button
              key={i}
              type="button"
              onClick={() => onRate(i + 1)}
              className="hover:scale-125 active:scale-110 transition-transform p-0.5"
              style={{
                color: isFilled ? 'var(--primary)' : 'var(--border)',
                fontSize: `${s.mobile}px`,
              }}
            >
              <span className="hidden sm:inline" style={{ fontSize: `${s.desktop}px` }}>
                {isFilled ? '★' : '☆'}
              </span>

              <span className="sm:hidden">
                {isFilled ? '★' : '☆'}
              </span>
            </button>
          );
        })}

        {showLabel && (
          <span className="mr-1 sm:mr-1.5 font-vazir text-[12px] sm:text-[13px] text-[var(--text-secondary)] tabular-nums">
            {numericValue > 0 ? toPersianDigit(numericValue.toFixed(1)) : '—'}
          </span>
        )}
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-0.5 sm:gap-1 ${className}`} dir="ltr">
      <span className="sm:hidden">
        {renderVisualStars(s.mobile)}
      </span>

      <span className="hidden sm:inline">
        {renderVisualStars(s.desktop)}
      </span>

      {showLabel && (
        <span className="mr-1 sm:mr-1.5 font-vazir text-[12px] sm:text-[13px] text-[var(--text-secondary)] tabular-nums">
          {numericValue > 0 ? toPersianDigit(numericValue.toFixed(1)) : '—'}
        </span>
      )}
    </div>
  );
}