'use client';
import { FiEdit } from 'react-icons/fi';
import { toPersianDigit } from '@/utils/numberUtils';

export default function CharCounter({ current, max }) {
  const remaining = max - current;
  const isNearLimit = remaining <= 50 && remaining > 0;
  const isAtLimit = remaining === 0;
  const percentage = (current / max) * 100;

  const statusColor = isAtLimit
    ? 'text-[#E53935]'
    : isNearLimit
      ? 'text-[#FF9800]'
      : 'text-[var(--primary)]';

  const barColor = isAtLimit
    ? 'bg-[#E53935]'
    : isNearLimit
      ? 'bg-[#FF9800]'
      : 'bg-[var(--primary)]';

  return (
    <div>
      {/* نوار شمارنده */}
      <div className="flex items-center gap-3 -mt-2.5 mb-1.5 px-1">
        <div className={`flex items-center gap-1 ${statusColor}`}>
          <FiEdit size={12} />
          <span className="text-xs font-vazir-medium">
            {toPersianDigit(current)} از {toPersianDigit(max)} کاراکتر
          </span>
        </div>
        {/* Progress Bar */}
        <div className="flex-1 h-1 rounded-full overflow-hidden bg-[var(--border)]">
          <div
            className={`h-full rounded-full transition-all duration-300 ${barColor}`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      {/* هشدار نزدیک به محدودیت */}
      {isNearLimit && !isAtLimit && (
        <div
          className="flex items-center gap-2 py-1.5 px-3 rounded-lg border -mt-0.5 mb-1
          bg-[#FF9800]/10 border-[#FF9800]/30"
        >
          <span className="text-xs text-[#FF9800]">⚠️</span>
          <span className="text-xs font-vazir-medium text-[#FF9800]">
            فقط {toPersianDigit(remaining)} کاراکتر باقی مانده است
          </span>
        </div>
      )}

      {/* هشدار رسیدن به محدودیت */}
      {isAtLimit && (
        <div
          className="flex items-center gap-2 py-1.5 px-3 rounded-lg border -mt-0.5 mb-1
          bg-[#E53935]/10 border-[#E53935]/30"
        >
          <span className="text-xs text-[#E53935]">❌</span>
          <span className="text-xs font-vazir-medium text-[#E53935]">
            به حداکثر تعداد کاراکتر رسیدید
          </span>
        </div>
      )}
    </div>
  );
}
