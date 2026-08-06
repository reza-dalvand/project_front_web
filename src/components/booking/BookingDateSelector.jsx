'use client';

import { useMemo } from 'react';
import { FiCalendar, FiCheck } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import SectionHeader from '@/components/common/SectionHeader';
import { toJalaali, PERSIAN_MONTHS, PERSIAN_WEEKDAYS } from '@/utils/dateUtils';
import { toPersianDigit } from '@/utils/numberUtils';

// تولید روزهای قابل رزرو (۳۰ روز آینده، بدون جمعه‌ها)
const generateAvailableDates = () => {
  const dates = [];
  const now = new Date();
  for (let i = 0; i < 30; i++) {
    const d = new Date(now);
    d.setDate(d.getDate() + i);
    const dayOfWeek = d.getDay();
    const isFriday = dayOfWeek === 5;
    const j = toJalaali(d.getFullYear(), d.getMonth() + 1, d.getDate());
    dates.push({
      ...j,
      dayOfWeek,
      isFriday, // ← علامت‌گذاری جمعه
      disabled: isFriday, // ← جمعه‌ها غیرقابل انتخاب
      weekdayName: PERSIAN_WEEKDAYS[(dayOfWeek + 1) % 7],
      key: `${j.jy}-${j.jm}-${j.jd}`,
    });
  }
  return dates;
};

export default function BookingDateSelector({ selectedDate, onDateSelect }) {
  const { colors } = useTheme();
  const availableDates = useMemo(() => generateAvailableDates(), []);

  // گروه‌بندی بر اساس ماه
  const groupedByMonth = useMemo(() => {
    const groups = {};
    availableDates.forEach((date) => {
      const monthKey = `${date.jy}-${date.jm}`;
      if (!groups[monthKey]) {
        groups[monthKey] = {
          jy: date.jy,
          jm: date.jm,
          label: `${PERSIAN_MONTHS[date.jm - 1]} ${toPersianDigit(date.jy)}`,
          dates: [],
        };
      }
      groups[monthKey].dates.push(date);
    });
    return Object.values(groups);
  }, [availableDates]);

  const isSameDate = (d1, d2) => d1 && d2 && d1.jy === d2.jy && d1.jm === d2.jm && d1.jd === d2.jd;

  const today = useMemo(() => {
    const now = new Date();
    return toJalaali(now.getFullYear(), now.getMonth() + 1, now.getDate());
  }, []);

  return (
    <div className="flex flex-col gap-2.5">
      <SectionHeader
        icon={<FiCalendar size={18} />}
        iconColor={colors.primary}
        title="روز مورد نظر را انتخاب کنید"
        subtitle={`${toPersianDigit(availableDates.length)} روز فعال برای رزرو`}
      />

      {/* لیست ماه‌ها */}
      <div className="flex flex-col gap-3.5 max-h-[400px] overflow-y-auto px-1">
        {groupedByMonth.map((group) => (
          <div key={group.label} className="flex flex-col gap-2">
            <span className="text-[13px] font-[Vazir-Bold] mr-1" style={{ color: colors.textMain }}>
              {group.label}
            </span>

            {/* شبکه روزها */}
            <div className="flex flex-wrap gap-2">
              {group.dates.map((date) => {
                const isSelected = isSameDate(date, selectedDate);
                const isToday = isSameDate(date, today);

                return (
                  <button
                    key={date.key}
                    onClick={() => !date.disabled && onDateSelect(date)}
                    disabled={date.disabled}
                    className="relative w-[52px] flex flex-col items-center justify-center py-2 rounded-xl border-[1.5px] transition-all duration-200 hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100"
                    style={{
                      backgroundColor: isSelected ? colors.primary : colors.cardBackground,
                      borderColor: isSelected
                        ? colors.primary
                        : isToday
                          ? colors.primary + '60'
                          : colors.border,
                    }}
                  >
                    <span
                      className="text-[9px] font-[Vazir]"
                      style={{
                        color: isSelected
                          ? '#ffffffcc'
                          : date.isFriday
                            ? '#E57373'
                            : colors.textSecondary,
                      }}
                    >
                      {date.weekdayName}
                    </span>
                    <span
                      className="text-[15px] font-[Vazir-Bold]"
                      style={{
                        color: isSelected ? '#fff' : colors.textMain,
                      }}
                    >
                      {toPersianDigit(date.jd)}
                    </span>

                    {/* نقطه امروز */}
                    {isToday && !isSelected && (
                      <div
                        className="absolute bottom-[3px] w-1 h-1 rounded-full"
                        style={{ backgroundColor: colors.primary }}
                      />
                    )}

                    {/* آیکون چک برای انتخاب شده */}
                    {isSelected && (
                      <div className="absolute top-1 left-1">
                        <FiCheck size={10} color="#fff" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* باکس تاریخ انتخاب شده */}
      {selectedDate && (
        <div
          className="flex items-center justify-center gap-1.5 py-2.5 px-3.5 rounded-xl border"
          style={{
            backgroundColor: colors.primary + '10',
            borderColor: colors.primary + '40',
          }}
        >
          <FiCalendar size={16} style={{ color: colors.primary }} />
          <span className="text-[13px] font-[Vazir-Bold]" style={{ color: colors.primary }}>
            {PERSIAN_WEEKDAYS[(selectedDate.dayOfWeek + 1) % 7]} {toPersianDigit(selectedDate.jd)}{' '}
            {PERSIAN_MONTHS[selectedDate.jm - 1]} {toPersianDigit(selectedDate.jy)}
          </span>
        </div>
      )}
    </div>
  );
}
