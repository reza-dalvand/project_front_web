'use client';
import { FiClock, FiXCircle } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import { toPersianDigit } from '@/utils/numberUtils';

/**
 * گرید اسلات‌های زمانی با شمارنده ساعت‌های آزاد
 *
 * @param {Array} slots - آرایه اسلات‌ها [{ id, time, isAvailable }]
 * @param {string} selectedId - شناسه اسلات انتخاب شده
 * @param {function} onSelect - تابع انتخاب
 */
export default function TimeSlotGrid({
  slots = [],
  selectedId,
  onSelect,
}) {
  const { colors } = useTheme();
  const availableCount = slots.filter((s) => s.isAvailable).length;

  return (
    <div className="space-y-3.5">
      {/* هدر */}
      <div className="flex items-center gap-2">
        <div
          className="w-8 h-8 rounded-[10px] flex items-center justify-center"
          style={{ backgroundColor: colors.primary + '15' }}
        >
          <FiClock size={18} style={{ color: colors.primary }} />
        </div>
        <span
          className="text-[15px] font-[Vazir-Bold] flex-1"
          style={{ color: colors.textMain }}
        >
          انتخاب ساعت
        </span>
        {/* Badge ساعت‌های آزاد */}
        <div
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-[10px]"
          style={{ backgroundColor: '#4CAF5015' }}
        >
          <div
            className="w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: '#4CAF50' }}
          />
          <span
            className="text-[11px] font-[Vazir-Bold]"
            style={{ color: '#4CAF50' }}
          >
            {toPersianDigit(availableCount)} ساعت آزاد
          </span>
        </div>
      </div>

      {/* گرید */}
      <div className="flex flex-wrap gap-2.5">
        {slots.map((slot) => {
          const isSelected = selectedId === slot.id;
          const isBooked = !slot.isAvailable;

          return (
            <button
              key={slot.id}
              disabled={isBooked}
              onClick={() => onSelect(slot.id)}
              className="w-[31.5%] flex items-center justify-center gap-1.5
                py-3 rounded-[14px] border-[1.5px]
                transition-all duration-200
                disabled:cursor-not-allowed"
              style={{
                backgroundColor: isSelected
                  ? colors.primary
                  : isBooked
                    ? colors.border + '30'
                    : colors.cardBackground,
                borderColor: isSelected
                  ? colors.primary
                  : isBooked
                    ? colors.border + '60'
                    : colors.border,
              }}
            >
              {isBooked ? (
                <FiXCircle
                  size={14}
                  style={{ color: colors.textSecondary + '80' }}
                />
              ) : (
                <FiClock
                  size={14}
                  style={{
                    color: isSelected ? '#fff' : colors.textSecondary,
                  }}
                />
              )}
              <span
                className="text-[13px]"
                style={{
                  color: isSelected
                    ? '#fff'
                    : isBooked
                      ? colors.textSecondary + '60'
                      : colors.textMain,
                  fontFamily: isSelected ? 'Vazir-Bold' : 'Vazir-Medium',
                }}
              >
                {slot.time}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}