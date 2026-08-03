'use client';

import { FiClock, FiX } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import { toPersianDigit } from '@/utils/numberUtils';

export default function BookingTimeSelector({
  slots = [],
  selectedId,
  onSelect,
}) {
  const { colors } = useTheme();
  const availableCount = slots.filter((s) => s.isAvailable).length;

  return (
    <div className="flex flex-col gap-2.5">
      {/* هدر */}
      <div className="flex items-center gap-2.5">
        <div
          className="w-[34px] h-[34px] rounded-[11px] flex items-center justify-center"
          style={{ backgroundColor: colors.primary + '15' }}
        >
          <FiClock size={18} style={{ color: colors.primary }} />
        </div>
        <div className="flex flex-col gap-0.5 flex-1">
          <span
            className="text-sm font-[Vazir-Bold]"
            style={{ color: colors.textMain }}
          >
            ساعت مورد نظر را انتخاب کنید
          </span>
          <span
            className="text-[11px] font-[Vazir]"
            style={{ color: colors.textSecondary }}
          >
            {toPersianDigit(availableCount)} ساعت آزاد
          </span>
        </div>
      </div>

      {/* شبکه اسلات‌های زمانی */}
      <div className="flex flex-wrap gap-2">
        {slots.map((slot) => {
          const isSelected = selectedId === slot.id;
          const isAvailable = slot.isAvailable;

          return (
            <button
              key={slot.id}
              onClick={() => isAvailable && onSelect(slot)}
              disabled={!isAvailable}
              className="flex items-center justify-center gap-1 py-2 px-3 rounded-[10px] border-[1.5px] min-w-[72px] transition-all duration-200 disabled:cursor-not-allowed hover:scale-105 active:scale-95 disabled:hover:scale-100"
              style={{
                backgroundColor: isSelected
                  ? colors.primary
                  : isAvailable
                  ? colors.cardBackground
                  : colors.background,
                borderColor: isSelected
                  ? colors.primary
                  : isAvailable
                  ? colors.border
                  : colors.border + '60',
              }}
            >
              <span
                className="text-[13px] font-[Vazir-Bold]"
                style={{
                  color: isSelected
                    ? '#fff'
                    : isAvailable
                    ? colors.textMain
                    : colors.textSecondary + '60',
                }}
              >
                {slot.time}
              </span>
              {!isAvailable && (
                <span
                  className="text-[8px] font-[Vazir]"
                  style={{ color: colors.textSecondary + '80' }}
                >
                  پر
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}