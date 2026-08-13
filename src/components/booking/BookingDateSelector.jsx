// src/components/booking/BookingDateSelector.jsx
'use client';
import { useState, useEffect, useMemo } from 'react';
import { FiChevronRight, FiChevronLeft, FiCheck } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import { toPersianDigit } from '@/utils/numberUtils';
import {
  toJalaali,
  PERSIAN_MONTHS,
  PERSIAN_WEEKDAYS,
  jalaaliMonthLength,
  getFirstDayOfWeekJalaali,
} from '@/utils/dateUtils';

export default function BookingDateSelector({ selectedDate, onDateSelect, availableDates = [] }) {
  const { colors } = useTheme();

  const today = useMemo(() => {
    const now = new Date();
    return toJalaali(now.getFullYear(), now.getMonth() + 1, now.getDate());
  }, []);

  const [viewMonth, setViewMonth] = useMemo(() => {
    if (availableDates && availableDates.length > 0) {
      const first = availableDates[0];
      return [{ jy: first.jy, jm: first.jm }, () => {}];
    }
    return [{ jy: today.jy, jm: today.jm }, () => {}];
  }, [availableDates, today]);

  const [currentView, setCurrentView] = useState({ jy: today.jy, jm: today.jm });

  const goToPrev = () => {
    setCurrentView((prev) =>
      prev.jm === 1 ? { jy: prev.jy - 1, jm: 12 } : { ...prev, jm: prev.jm - 1 }
    );
  };

  const goToNext = () => {
    setCurrentView((prev) =>
      prev.jm === 12 ? { jy: prev.jy + 1, jm: 1 } : { ...prev, jm: prev.jm + 1 }
    );
  };

  const monthLength = jalaaliMonthLength(currentView.jy, currentView.jm);
  const firstDayOfWeek = getFirstDayOfWeekJalaali(currentView.jy, currentView.jm);

  const isSameDate = (d1, d2) => d1 && d2 && d1.jy === d2.jy && d1.jm === d2.jm && d1.jd === d2.jd;

  const isSelected = (day) =>
    selectedDate && isSameDate(selectedDate, { jy: currentView.jy, jm: currentView.jm, jd: day });

  const isPast = (jy, jm, jd) => {
    const val = jy * 10000 + jm * 100 + jd;
    const todayVal = today.jy * 10000 + today.jm * 100 + today.jd;
    return val < todayVal;
  };

  const isAvailable = (day) => {
    if (availableDates.length === 0) return !isPast(currentView.jy, currentView.jm, day);
    return availableDates.some(
      (d) => d.jy === currentView.jy && d.jm === currentView.jm && d.jd === day
    );
  };

  const toggleDay = (day) => {
    if (isPast(currentView.jy, currentView.jm, day)) return;
    if (!isAvailable(day)) return;
    onDateSelect({ jy: currentView.jy, jm: currentView.jm, jd: day });
  };

  const days = [];
  for (let i = 0; i < firstDayOfWeek; i++) {
    days.push({ empty: true, key: `e-${i}` });
  }
  for (let d = 1; d <= monthLength; d++) {
    days.push({ jd: d, jy: currentView.jy, jm: currentView.jm, key: `d-${d}` });
  }

  return (
    <div className="flex flex-col gap-3 px-1">
      {/* هدر ماه */}
      <div
        className="flex items-center justify-between p-3.5 rounded-2xl border"
        style={{ backgroundColor: colors.cardBackground, borderColor: colors.border }}
      >
        <button onClick={goToPrev} className="p-2 rounded-lg hover:bg-black/5">
          <FiChevronRight size={22} style={{ color: colors.textMain }} />
        </button>
        <div className="text-center">
          <span className="text-base font-[Vazir-Bold] block" style={{ color: colors.textMain }}>
            {PERSIAN_MONTHS[currentView.jm - 1]}
          </span>
          <span className="text-xs" style={{ color: colors.textSecondary }}>
            {toPersianDigit(currentView.jy)}
          </span>
        </div>
        <button onClick={goToNext} className="p-2 rounded-lg hover:bg-black/5">
          <FiChevronLeft size={22} style={{ color: colors.textMain }} />
        </button>
      </div>

      {/* نام روزهای هفته */}
      <div className="grid grid-cols-7 gap-1 mb-1">
        {PERSIAN_WEEKDAYS.map((d) => (
          <div key={d} className="text-center">
            <span
              className="text-[12px] font-[Vazir-Medium]"
              style={{ color: colors.textSecondary }}
            >
              {d}
            </span>
          </div>
        ))}
      </div>

      {/* شبکه روزها */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((day) => {
          if (day.empty) return <div key={day.key} />;
          const disabled = isPast(day.jy, day.jm, day.jd);
          const available = isAvailable(day.jd);
          const selected = isSelected(day.jd);
          const isToday = isSameDate(day, today);

          return (
            <button
              key={day.key}
              disabled={disabled || !available}
              onClick={() => toggleDay(day.jd)}
              className="relative aspect-square rounded-xl flex items-center justify-center text-sm font-[Vazir-Medium] transition-all"
              style={{
                backgroundColor: selected
                  ? colors.primary
                  : isToday
                    ? colors.primary + '15'
                    : 'transparent',
                color: selected ? '#fff' : colors.textMain,
                border: isToday && !selected ? `2px solid ${colors.primary}` : 'none',
                opacity: disabled || !available ? 0.3 : 1,
                cursor: disabled || !available ? 'not-allowed' : 'pointer',
              }}
            >
              {toPersianDigit(day.jd)}
              {selected && (
                <div className="absolute top-1 right-1">
                  <FiCheck size={10} color="#fff" />
                </div>
              )}
              {isToday && !selected && (
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
