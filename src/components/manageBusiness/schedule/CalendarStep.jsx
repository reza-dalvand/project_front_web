// src/components/manageBusiness/schedule/CalendarStep.jsx
'use client';
import { useState, useMemo, useEffect, useRef } from 'react';
import { FiCheck } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import CalendarHeader from './CalendarHeader';
import CalendarActions from './CalendarActions';
import CalendarGrid from './CalendarGrid';
import { toPersianDigit } from '@/utils/numberUtils';
import { toJalaali, jalaaliMonthLength, getFirstDayOfWeekJalaali } from '@/utils/dateUtils';

export default function CalendarStep({ selectedDates, onDatesChange, existingDates = [] }) {
  const { colors } = useTheme();
  const today = useMemo(() => {
    const now = new Date();
    return toJalaali(now.getFullYear(), now.getMonth() + 1, now.getDate());
  }, []);

  // ✅ FIX 3.1: استفاده از useRef برای نگهداری آخرین مقدار selectedDates
  // این کار از stale closure در توابع toggleDay و selectAllMonth جلوگیری می‌کند
  const selectedDatesRef = useRef(selectedDates);
  selectedDatesRef.current = selectedDates;

  // ✅ FIX 3.1: استفاده از useRef برای onDatesChange تا تغییر رفرنس والد
  // باعث اجرای مجدد useEffect و پاک شدن انتخاب‌ها نشود
  const onDatesChangeRef = useRef(onDatesChange);
  onDatesChangeRef.current = onDatesChange;

  const prevExistingDatesRef = useRef(existingDates);

  useEffect(() => {
    // فقط زمانی سینک کن که existingDates واقعاً تغییر کرده باشد (رفرنس جدید از سمت والد)
    if (prevExistingDatesRef.current !== existingDates) {
      prevExistingDatesRef.current = existingDates;

      // سینک اولیه فقط در صورتی انجام می‌شود که selectedDates خالی باشد
      if (
        existingDates &&
        existingDates.length > 0 &&
        (!selectedDatesRef.current || selectedDatesRef.current.length === 0)
      ) {
        onDatesChangeRef.current([...existingDates]);
      }
    }
    // ✅ FIX 3.1: فقط existingDates در dependency array باشد
    // حذف selectedDates و onDatesChange از deps → جلوگیری از حلقه بی‌نهایت
    // و جلوگیری از پاک شدن انتخاب‌های کاربر هنگام re-render والد
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

  const isSameDate = (d1, d2) => d1 && d2 && d1.jy === d2.jy && d1.jm === d2.jm && d1.jd === d2.jd;

  const isSelected = (day) =>
    selectedDates.some((d) => isSameDate(d, { jy: viewMonth.jy, jm: viewMonth.jm, jd: day }));

  const isPast = (jy, jm, jd) => {
    const val = jy * 10000 + jm * 100 + jd;
    const todayVal = today.jy * 10000 + today.jm * 100 + today.jd;
    return val < todayVal;
  };

  // ✅ FIX 3.1: استفاده از selectedDatesRef برای جلوگیری از stale closure
  const toggleDay = (day) => {
    const dateObj = { jy: viewMonth.jy, jm: viewMonth.jm, jd: day };
    const currentDates = selectedDatesRef.current;
    const exists = currentDates.some((d) => isSameDate(d, dateObj));
    if (exists) {
      onDatesChange(currentDates.filter((d) => !isSameDate(d, dateObj)));
    } else {
      onDatesChange([...currentDates, dateObj]);
    }
  };

  // ✅ FIX 3.1: استفاده از selectedDatesRef برای جلوگیری از stale closure
  const selectAllMonth = () => {
    const monthDates = [];
    for (let d = 1; d <= monthLength; d++) {
      if (!isPast(viewMonth.jy, viewMonth.jm, d)) {
        monthDates.push({ jy: viewMonth.jy, jm: viewMonth.jm, jd: d });
      }
    }
    const combined = [...selectedDatesRef.current];
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
      <CalendarHeader viewMonth={viewMonth} onPrev={goToPrev} onNext={goToNext} />

      {/* دکمه‌های انتخاب همه / پاک کردن */}
      <CalendarActions onSelectAll={selectAllMonth} onClearAll={clearAll} />

      {/* شبکه روزها */}
      <CalendarGrid
        days={days}
        viewMonth={viewMonth}
        today={today}
        selectedDates={selectedDates}
        existingDates={existingDates}
        onToggleDay={toggleDay}
      />

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