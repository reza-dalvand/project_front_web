'use client';

export default function StarRating({
  value = 0,
  maxStars = 5,
  onRate,
  interactive = false,
  showLabel = false,
  size = 'md',
  className = '',
}) {
  const starSizes = {
    xs: { mobile: 12, desktop: 14 },
    sm: { mobile: 14, desktop: 16 },
    md: { mobile: 16, desktop: 18 },
    lg: { mobile: 20, desktop: 24 },
  };
  const s = starSizes[size] ?? starSizes.md;

  return (
    <div className={`flex items-center gap-0.5 sm:gap-1 ${className}`}>
      {Array.from({ length: maxStars }).map((_, i) => {
        const isFilled = i < Math.round(value);
        const star = (
          <span
            key={i}
            className="leading-none select-none"
            style={{
              fontSize: `${s.mobile}px`,
              color: isFilled ? 'var(--primary)' : 'var(--border)',
            }}
          >
            <span className="hidden sm:inline" style={{ fontSize: `${s.desktop}px` }}>
              {isFilled ? '★' : '☆'}
            </span>
            <span className="sm:hidden">
              {isFilled ? '★' : '☆'}
            </span>
          </span>
        );

        if (interactive && onRate) {
          return (
            <button
              key={i}
              onClick={() => onRate(i + 1)}
              className="hover:scale-125 active:scale-110 transition-transform p-0.5"
            >
              {star}
            </button>
          );
        }
        return star;
      })}

      {showLabel && (
        <span className="mr-1 sm:mr-1.5 font-vazir text-[12px] sm:text-[13px] text-[var(--text-secondary)] tabular-nums">
          {value > 0 ? value.toFixed(1) : '—'}
        </span>
      )}
    </div>
  );
}