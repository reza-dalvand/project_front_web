// src/components/booking/BookingTimeSelector.jsx
'use client';

import { FiClock } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import { toPersianDigit } from '@/utils/numberUtils';

export default function BookingTimeSelector({
  slots = [],
  selectedId,
  onSelect,
  isLoading = false,
}) {
  const { colors } = useTheme();

  if (slots.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 gap-3">
        <FiClock size={40} style={{ color: colors.textSecondary + '60' }} />
        <p className="text-sm font-[Vazir-Bold]" style={{ color: colors.textMain }}>
          ساعت آزادی برای این تاریخ وجود ندارد
        </p>
        <p className="text-xs text-center" style={{ color: colors.textSecondary }}>
          لطفاً تاریخ دیگری را انتخاب کنید
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex items-center gap-2.5">
        <div
          className="w-[34px] h-[34px] rounded-[11px] flex items-center justify-center"
          style={{ backgroundColor: colors.primary + '15' }}
        >
          <FiClock size={18} style={{ color: colors.primary }} />
        </div>
        <div className="flex flex-col gap-0.5 flex-1">
          <span className="text-sm font-[Vazir-Bold]" style={{ color: colors.textMain }}>
            ساعت مورد نظر را انتخاب کنید
          </span>
          <span className="text-[11px] font-[Vazir]" style={{ color: colors.textSecondary }}>
            {toPersianDigit(slots.length)} ساعت آزاد
          </span>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {slots.map((slot) => {
          const isSelected = selectedId === slot.id;
          // ✅ FIX: خوانش camelCase (بعد از نرمال‌ساز)
          const displayLabel = slot.displayTime || slot.startTime || '';
          return (
            <button
              key={slot.id}
              onClick={() => onSelect(slot)}
              className="flex items-center justify-center gap-1 py-2.5 px-4 rounded-[12px] border-[1.5px] min-w-[80px] transition-all duration-200 hover:scale-105 active:scale-95"
              style={{
                backgroundColor: isSelected ? colors.primary : colors.cardBackground,
                borderColor: isSelected ? colors.primary : colors.border,
              }}
            >
              <span
                className="text-[13px] font-[Vazir-Bold]"
                style={{ color: isSelected ? '#fff' : colors.textMain }}
              >
                {displayLabel}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
