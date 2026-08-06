'use client';

import { FiEdit } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import { toPersianDigit } from '@/utils/numberUtils';

/**
 * کامپوننت شمارنده کاراکتر با progress bar
 *
 * @param {number} current - تعداد کاراکتر فعلی
 * @param {number} max - حداکثر کاراکتر مجاز
 */
export default function CharCounter({ current, max }) {
  const { colors } = useTheme();

  const remaining = max - current;
  const isNearLimit = remaining <= 50 && remaining > 0;
  const isAtLimit = remaining === 0;
  const percentage = (current / max) * 100;

  const getStatusColor = () => {
    if (isAtLimit) return '#E53935';
    if (isNearLimit) return '#FF9800';
    return colors.primary;
  };

  const statusColor = getStatusColor();

  return (
    <div>
      {/* نوار شمارنده */}
      <div className="flex items-center gap-3 -mt-2.5 mb-1.5 px-1">
        <div className="flex items-center gap-1">
          <FiEdit size={12} style={{ color: statusColor }} />
          <span className="text-xs font-[Vazir-Medium]" style={{ color: statusColor }}>
            {toPersianDigit(current)} از {toPersianDigit(max)} کاراکتر
          </span>
        </div>

        {/* Progress Bar */}
        <div
          className="flex-1 h-1 rounded-full overflow-hidden"
          style={{ backgroundColor: colors.border }}
        >
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{
              width: `${percentage}%`,
              backgroundColor: statusColor,
            }}
          />
        </div>
      </div>

      {/* هشدار نزدیک به محدودیت */}
      {isNearLimit && !isAtLimit && (
        <div
          className="flex items-center gap-2 py-1.5 px-3 rounded-lg border -mt-0.5 mb-1"
          style={{
            backgroundColor: '#FF980010',
            borderColor: '#FF980030',
          }}
        >
          <span className="text-xs" style={{ color: '#FF9800' }}>
            ⚠️
          </span>
          <span className="text-xs font-[Vazir-Medium]" style={{ color: '#FF9800' }}>
            فقط {toPersianDigit(remaining)} کاراکتر باقی مانده است
          </span>
        </div>
      )}

      {/* هشدار رسیدن به محدودیت */}
      {isAtLimit && (
        <div
          className="flex items-center gap-2 py-1.5 px-3 rounded-lg border -mt-0.5 mb-1"
          style={{
            backgroundColor: '#E5393510',
            borderColor: '#E5393530',
          }}
        >
          <span className="text-xs" style={{ color: '#E53935' }}>
            ❌
          </span>
          <span className="text-xs font-[Vazir-Medium]" style={{ color: '#E53935' }}>
            به حداکثر تعداد کاراکتر رسیدید
          </span>
        </div>
      )}
    </div>
  );
}
