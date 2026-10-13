'use client';

import { useTheme } from '@/stores/useThemeStore';
import { getLineRentalPricePresentation } from '@/utils/numberUtils';

const ROW_TONE_COLORS = {
  blue: '#2196F3',
  amber: '#FF9800',
  orange: '#F59E0B',
  purple: '#9C27B0',
  indigo: '#6366F1',
  gray: '#607D8B',
};

const TAG_TONE_STYLES = {
  success: {
    backgroundColor: 'rgba(16,185,129,0.12)',
    color: '#10B981',
  },
};

export default function LineRentalPriceRows({
  rental,
  size = 'md',
  className = '',
}) {
  const { colors } = useTheme();
  const { rows, tags } = getLineRentalPricePresentation(rental);

  if (rows.length === 0 && tags.length === 0) return null;

  const isSmall = size === 'sm';

  const labelClass = isSmall
    ? 'text-[10px] font-[Vazir-Medium]'
    : 'text-[11px] sm:text-xs font-[Vazir-Medium]';

  const valueClass = isSmall
    ? 'text-[10px] font-[Vazir-Bold]'
    : 'text-[11px] sm:text-xs font-[Vazir-Bold]';

  const tagClass = isSmall
    ? 'px-2 py-0.5 text-[9px] font-[Vazir-Bold]'
    : 'px-2.5 py-1 text-[10px] font-[Vazir-Bold]';

  return (
    <div className={`space-y-1.5 ${className}`}>
      {rows.map((row) => (
        <div
          key={row.id}
          className="flex items-center justify-between gap-2"
        >
          <span
            className={labelClass}
            style={{ color: colors.textSecondary }}
          >
            {row.label}
          </span>

          <span
            className={valueClass}
            style={{
              color: ROW_TONE_COLORS[row.tone] || colors.textMain,
            }}
          >
            {row.value}
          </span>
        </div>
      ))}

      {tags.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
          {tags.map((tag) => {
            const tagStyle = TAG_TONE_STYLES[tag.tone] || TAG_TONE_STYLES.success;

            return (
              <span
                key={tag.id}
                className={`inline-flex items-center rounded-full ${tagClass}`}
                style={{
                  backgroundColor: tagStyle.backgroundColor,
                  color: tagStyle.color,
                }}
              >
                {tag.label}
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
}