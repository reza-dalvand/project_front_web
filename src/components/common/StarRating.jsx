'use client';

import { useTheme } from '@/stores/useThemeStore';

export default function StarRating({
  value = 0,
  maxStars = 5,
  onRate,
  interactive = false,
  showLabel = false,
  size = 'md',
  className = '',
}) {
  const { colors } = useTheme();

  const starSizes = { sm: 14, md: 18, lg: 24 };
  const starSize = starSizes[size] ?? starSizes.md;

  return (
    <div className={`flex items-center gap-0.5 ${className}`}>
      {Array.from({ length: maxStars }).map((_, i) => {
        const isFilled = i < Math.round(value);
        const star = (
          <span
            key={i}
            style={{
              fontSize: `${starSize}px`,
              color: isFilled ? colors.primary : colors.border,
            }}
          >
            {isFilled ? '★' : '☆'}
          </span>
        );

        if (interactive && onRate) {
          return (
            <button
              key={i}
              onClick={() => onRate(i + 1)}
              className="hover:scale-110 transition-transform"
            >
              {star}
            </button>
          );
        }

        return star;
      })}
      {showLabel && (
        <span
          className="mr-1.5 font-[Vazir] text-[13px]"
          style={{ color: colors.textSecondary }}
        >
          {value > 0 ? value.toFixed(1) : '—'}
        </span>
      )}
    </div>
  );
}