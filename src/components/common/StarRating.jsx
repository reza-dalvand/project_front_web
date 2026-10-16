'use client';

import { toPersianDigit } from '@/utils/numberUtils';

const SIZE_CLASSES = {
  xs: 'text-[12px] sm:text-[14px]',
  sm: 'text-[14px] sm:text-[16px]',
  md: 'text-[16px] sm:text-[18px]',
  lg: 'text-[20px] sm:text-[24px]',
};

function getStarFill(value, index) {
  const diff = value - index;

  if (diff <= 0) return 0;
  if (diff >= 1) return 100;

  return Math.round(diff * 100);
}

function getStarState(fill) {
  if (fill >= 100) return 'full';
  if (fill > 0) return 'partial';
  return 'empty';
}

function StarVisual({ index, fill, sizeClass }) {
  const state = getStarState(fill);

  return (
    <span
      data-star-index={index}
      data-star-fill={fill}
      data-star-state={state}
      className={`relative inline-block leading-none select-none ${sizeClass}`}
      aria-hidden="true"
    >
      {/* ستاره خالی */}
      <span style={{ color: 'var(--border)' }}>☆</span>

      {/*
        لایه ستاره پر فقط وقتی رندر می‌شود که fill بزرگ‌تر از صفر باشد.
        این کار باعث می‌شود ستاره‌های خالی در تست‌ها شامل ★ نشوند.
      */}
      {fill > 0 && (
        <span
          className="absolute top-0 left-0 overflow-hidden whitespace-nowrap"
          style={{
            color: 'var(--primary)',
            width: `${fill}%`,
          }}
        >
          ★
        </span>
      )}
    </span>
  );
}

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

  const sizeClass = SIZE_CLASSES[size] ?? SIZE_CLASSES.md;

  const stars = Array.from({ length: maxStars }, (_, index) => {
    const fill = getStarFill(numericValue, index);
    return { index, fill };
  });

  const labelText =
    numericValue > 0 ? toPersianDigit(numericValue.toFixed(1)) : '—';

  const ariaValue = numericValue > 0 ? numericValue.toFixed(1) : '0.0';

  if (interactive && onRate) {
    return (
      <div
        className={`flex items-center gap-0.5 sm:gap-1 ${className}`}
        dir="ltr"
        role="group"
        aria-label={`انتخاب امتیاز از ${toPersianDigit(maxStars)}`}
      >
        {stars.map(({ index, fill }) => (
          <button
            key={index}
            type="button"
            onClick={() => onRate(index + 1)}
            className="hover:scale-125 active:scale-110 transition-transform p-0.5"
            aria-label={`امتیاز ${toPersianDigit(index + 1)} از ${toPersianDigit(
              maxStars
            )}`}
          >
            <StarVisual index={index} fill={fill} sizeClass={sizeClass} />
          </button>
        ))}

        {showLabel && (
          <span
            className="mr-1 sm:mr-1.5 font-[Vazir] text-[12px] sm:text-[13px] tabular-nums"
            style={{ color: 'var(--text-secondary)' }}
          >
            {labelText}
          </span>
        )}
      </div>
    );
  }

  return (
    <div
      className={`flex items-center gap-0.5 sm:gap-1 ${className}`}
      dir="ltr"
      role="img"
      aria-label={`امتیاز ${toPersianDigit(ariaValue)} از ${toPersianDigit(
        maxStars
      )}`}
    >
      {stars.map(({ index, fill }) => (
        <StarVisual
          key={index}
          index={index}
          fill={fill}
          sizeClass={sizeClass}
        />
      ))}

      {showLabel && (
        <span
          className="mr-1 sm:mr-1.5 font-[Vazir] text-[12px] sm:text-[13px] tabular-nums"
          style={{ color: 'var(--text-secondary)' }}
        >
          {labelText}
        </span>
      )}
    </div>
  );
}