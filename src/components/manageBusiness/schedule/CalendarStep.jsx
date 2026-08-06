// src/components/manageBusiness/schedule/CalendarStep.jsx
'use client';
import { useState, useMemo, useEffect } from 'react';
import { FiChevronRight, FiChevronLeft, FiCheck, FiX } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import { toPersianDigit } from '@/utils/numberUtils';
import {
  toJalaali,
  PERSIAN_MONTHS,
  PERSIAN_WEEKDAYS,
  jalaaliMonthLength,
  getFirstDayOfWeekJalaali,
} from '@/utils/dateUtils';

export default function CalendarStep({ selectedDates, onDatesChange, existingDates = [] }) {
  const { colors } = useTheme();

  const today = useMemo(() => {
    const now = new Date();
    return toJalaali(now.getFullYear(), now.getMonth() + 1, now.getDate());
  }, []);

  // ✅ FIX: هنگام mount یا تغییر existingDates، اگر selectedDates خالی است، پر شود
  useEffect(() => {
    if (existingDates && existingDates.length > 0 && (!selectedDates || selectedDates.length === 0)) {
      onDatesChange([...existingDates]);
    }
  }, [existingDates]);

  const [viewMonth, setViewMonth] = useState(() => {
    if (existingDates && existingDates.length > 0) {
      const first = existingDates[0];
      return { jy: first.jy, jm: first.jm };
    }
    if (selectedDates && selectedDates.length > 0) {
      const first = selectedDates[0];
      return { jy: first.jy, jm: first.jm };
    }
    return { jy: today.jy, jm: today.jm };
  });

  const goToPrev = () => {
    setViewMonth((prev) =>
      prev.jm === 1 ? { jy: prev.jy - 1, jm: 12 } : { ...prev, jm: prev.jm - 1 }
    );
  };

  const goToNext = () => {
    setViewMonth((prev) =>
      prev.jm === 12 ? { jy: prev.jy + 1, jm: 1 } : { ...prev, jm: prev.jm + 1 }
    );
  };

  const monthLength = jalaaliMonthLength(viewMonth.jy, viewMonth.jm);
  const firstDayOfWeek = getFirstDayOfWeekJalaali(viewMonth.jy, viewMonth.jm);

  const isSameDate = (d1, d2) =>
    d1 && d2 && d1.jy === d2.jy && d1.jm === d2.jm && d1.jd === d2.jd;

  const isSelected = (day) =>
    selectedDates.some((d) => isSameDate(d, { jy: viewMonth.jy, jm: viewMonth.jm, jd: day }));

  const isExisting = (day) =>
    existingDates.some((d) => isSameDate(d, { jy: viewMonth.jy, jm: viewMonth.jm, jd: day }));

  const isPast = (jy, jm, jd) => {
    const val = jy * 10000 + jm * 100 + jd;
    const todayVal = today.jy * 10000 + today.jm * 100 + today.jd;
    return val < todayVal;
  };

  const toggleDay = (day) => {
    const dateObj = { jy: viewMonth.jy, jm: viewMonth.jm, jd: day };
    if (isSelected(day)) {
      onDatesChange(selectedDates.filter((d) => !isSameDate(d, dateObj)));
    } else {
      onDatesChange([...selectedDates, dateObj]);
    }
  };

  const selectAllMonth = () => {
    const monthDates = [];
    for (let d = 1; d <= monthLength; d++) {
      if (!isPast(viewMonth.jy, viewMonth.jm, d)) {
        monthDates.push({ jy: viewMonth.jy, jm: viewMonth.jm, jd: d });
      }
    }
    const combined = [...selectedDates];
    monthDates.forEach((md) => {
      if (!combined.some((d) => isSameDate(d, md))) {
        combined.push(md);
      }
    });
    onDatesChange(combined);
  };

  const clearAll = () => onDatesChange([]);

  const days = [];
  for (let i = 0; i < firstDayOfWeek; i++) {
    days.push({ empty: true, key: `e-${i}` });
  }
  for (let d = 1; d <= monthLength; d++) {
    days.push({ jd: d, jy: viewMonth.jy, jm: viewMonth.jm, key: `d-${d}` });
  }

  return (
    <div className="flex flex-col gap-3 px-4">
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
            {PERSIAN_MONTHS[viewMonth.jm - 1]}
          </span>
          <span className="text-xs" style={{ color: colors.textSecondary }}>
            {toPersianDigit(viewMonth.jy)}
          </span>
        </div>
        <button onClick={goToNext} className="p-2 rounded-lg hover:bg-black/5">
          <FiChevronLeft size={22} style={{ color: colors.textMain }} />
        </button>
      </div>

      {/* دکمه‌های انتخاب همه / پاک کردن */}
      <div className="flex gap-2">
        <button
          onClick={selectAllMonth}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border text-xs font-[Vazir-Bold] transition-all"
          style={{
            backgroundColor: colors.primary + '10',
            borderColor: colors.primary + '40',
            color: colors.primary,
          }}
        >
          <FiCheck size={14} />
          انتخاب کل ماه
        </button>
        <button
          onClick={clearAll}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border text-xs font-[Vazir-Bold] transition-all"
          style={{
            backgroundColor: '#E5393510',
            borderColor: '#E5393540',
            color: '#E53935',
          }}
        >
          <FiX size={14} />
          پاک کردن همه
        </button>
      </div>

      {/* ردیف نام روزهای هفته */}
      <div className="grid grid-cols-7 gap-1 mb-1">
        {PERSIAN_WEEKDAYS.map((d, i) => (
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
          const isToday = isSameDate(day, today);
          const selected = isSelected(day.jd);
          const existing = isExisting(day.jd);
          // ✅ FIX: جمعه دیگر قرمز نیست و غیرفعال نیست
          // فقط روزهای گذشته غیرفعال هستند

          return (
            <button
              key={day.key}
              disabled={disabled}
              onClick={() => toggleDay(day.jd)}
              className="relative aspect-square rounded-xl flex items-center justify-center text-sm font-[Vazir-Medium] transition-all"
              style={{
                backgroundColor: selected
                  ? colors.primary
                  : !selected && existing
                    ? '#43A04715'
                    : isToday
                      ? colors.primary + '15'
                      : 'transparent',
                color: selected
                  ? '#fff'
                  : !selected && existing
                    ? '#43A047'
                    : colors.textMain,
                border: !selected && existing
                  ? '2px solid #43A047'
                  : isToday && !selected
                    ? `2px solid ${colors.primary}`
                    : 'none',
                opacity: disabled ? 0.3 : 1,
                cursor: disabled ? 'not-allowed' : 'pointer',
              }}
            >
              {toPersianDigit(day.jd)}

              {selected && (
                <div className="absolute top-1 right-1">
                  <FiCheck size={10} color="#fff" />
                </div>
              )}

              {!selected && existing && (
                <div className="absolute bottom-1 left-1">
                  <span className="text-[8px]" style={{ color: '#43A047' }}>📅</span>
                </div>
              )}

              {isToday && !selected && !existing && (
                <div
                  className="absolute bottom-1 w-1 h-1 rounded-full"
                  style={{ backgroundColor: colors.primary }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* شمارنده انتخاب‌ها */}
      {selectedDates.length > 0 && (
        <div
          className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border"
          style={{
            backgroundColor: colors.primary + '10',
            borderColor: colors.primary + '30',
          }}
        >
          <FiCheck size={14} style={{ color: colors.primary }} />
          <span className="text-xs font-[Vazir-Bold]" style={{ color: colors.primary }}>
            {toPersianDigit(selectedDates.length)} روز انتخاب شده
          </span>
        </div>
      )}
    </div>
  );
}