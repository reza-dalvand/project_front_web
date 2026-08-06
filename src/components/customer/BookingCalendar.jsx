'use client';
import { useState, useMemo } from 'react';
import { FiChevronRight, FiChevronLeft } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import {
  toJalaali,
  PERSIAN_MONTHS,
  PERSIAN_WEEKDAYS,
  jalaaliMonthLength,
  getFirstDayOfWeekJalaali,
} from '@/utils/dateUtils';
import { toPersianDigit } from '@/utils/numberUtils';

/**
 * تقویم شمسی برای انتخاب تاریخ رزرو
 *
 * @param {object} selectedDate - تاریخ انتخاب شده { jy, jm, jd }
 * @param {function} onDateSelect - تابع انتخاب تاریخ
 * @param {object} minDate - حداقل تاریخ قابل انتخاب
 * @param {Array} disabledDates - تاریخ‌های غیرفعال
 */
export default function BookingCalendar({
  selectedDate,
  onDateSelect,
  minDate,
  disabledDates = [],
}) {
  const { colors } = useTheme();

  const today = useMemo(() => {
    const now = new Date();
    return toJalaali(now.getFullYear(), now.getMonth() + 1, now.getDate());
  }, []);

  const [viewMonth, setViewMonth] = useState(() => {
    if (selectedDate) return { jy: selectedDate.jy, jm: selectedDate.jm };
    return { jy: today.jy, jm: today.jm };
  });

  const goToPrevMonth = () => {
    setViewMonth((prev) =>
      prev.jm === 1 ? { jy: prev.jy - 1, jm: 12 } : { ...prev, jm: prev.jm - 1 }
    );
  };

  const goToNextMonth = () => {
    setViewMonth((prev) =>
      prev.jm === 12 ? { jy: prev.jy + 1, jm: 1 } : { ...prev, jm: prev.jm + 1 }
    );
  };

  const monthLength = jalaaliMonthLength(viewMonth.jy, viewMonth.jm);
  const firstDayOfWeek = getFirstDayOfWeekJalaali(viewMonth.jy, viewMonth.jm);

  const isSameDate = (d1, d2) => d1 && d2 && d1.jy === d2.jy && d1.jm === d2.jm && d1.jd === d2.jd;

  const isDateDisabled = (jy, jm, jd) => {
    const val = jy * 10000 + jm * 100 + jd;
    if (minDate) {
      const minVal = minDate.jy * 10000 + minDate.jm * 100 + minDate.jd;
      if (val < minVal) return true;
    }
    if (disabledDates.some((d) => isSameDate(d, { jy, jm, jd }))) return true;
    return false;
  };

  // ساخت آرایه روزها
  const days = [];
  for (let i = 0; i < firstDayOfWeek; i++) {
    days.push({ empty: true, key: `e-${i}` });
  }
  for (let d = 1; d <= monthLength; d++) {
    days.push({ jd: d, jy: viewMonth.jy, jm: viewMonth.jm, key: `d-${d}` });
  }

  const canGoPrev = !(minDate && viewMonth.jy === minDate.jy && viewMonth.jm === minDate.jm);

  return (
    <div className="rounded-2xl p-4" style={{ backgroundColor: colors.cardBackground }}>
      {/* هدر ماه */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={goToPrevMonth}
          disabled={!canGoPrev}
          className="w-9 h-9 rounded-xl flex items-center justify-center
            transition-colors disabled:opacity-30"
          style={{ backgroundColor: colors.background }}
        >
          <FiChevronRight size={20} style={{ color: colors.textMain }} />
        </button>
        <span className="text-base font-[Vazir-Bold]" style={{ color: colors.textMain }}>
          {PERSIAN_MONTHS[viewMonth.jm - 1]} {toPersianDigit(viewMonth.jy)}
        </span>
        <button
          onClick={goToNextMonth}
          className="w-9 h-9 rounded-xl flex items-center justify-center
            transition-colors"
          style={{ backgroundColor: colors.background }}
        >
          <FiChevronLeft size={20} style={{ color: colors.textMain }} />
        </button>
      </div>

      {/* ردیف نام روزهای هفته */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {PERSIAN_WEEKDAYS.map((day, i) => (
          <div key={day} className="text-center">
            <span
              className="text-[13px] font-[Vazir-Medium]"
              style={{ color: i === 6 ? '#E57373' : colors.textSecondary }}
            >
              {day}
            </span>
          </div>
        ))}
      </div>

      {/* شبکه روزها */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((day, index) => {
          if (day.empty) return <div key={day.key} />;

          const disabled = isDateDisabled(day.jy, day.jm, day.jd);
          const isToday = isSameDate(day, today);
          const isSelected = isSameDate(day, selectedDate);
          const isFriday = index % 7 === 6;

          return (
            <button
              key={day.key}
              disabled={disabled}
              onClick={() => onDateSelect?.(day)}
              className="relative aspect-square rounded-full flex items-center justify-center
                transition-all duration-200 hover:scale-110 active:scale-95
                disabled:cursor-not-allowed disabled:hover:scale-100"
              style={{
                backgroundColor: isSelected
                  ? colors.primary
                  : isToday
                    ? colors.primary + '15'
                    : 'transparent',
                border: isToday && !isSelected ? `1.5px solid ${colors.primary}` : 'none',
              }}
            >
              <span
                className="text-[15px]"
                style={{
                  color: isSelected
                    ? '#fff'
                    : disabled
                      ? colors.border
                      : isFriday && !isToday
                        ? '#E57373'
                        : colors.textMain,
                  fontFamily: isSelected ? 'Vazir-Bold' : 'Vazir',
                }}
              >
                {toPersianDigit(day.jd)}
              </span>
              {/* نقطه امروز */}
              {isToday && !isSelected && (
                <div
                  className="absolute bottom-1 w-1 h-1 rounded-full"
                  style={{ backgroundColor: colors.primary }}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
