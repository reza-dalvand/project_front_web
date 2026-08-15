// src/components/manageBusiness/schedule/CalendarGrid.jsx
'use client';
import { FiCheck } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import { toPersianDigit } from '@/utils/numberUtils';
import { PERSIAN_WEEKDAYS } from '@/utils/dateUtils';

export default function CalendarGrid({
  days,
  viewMonth,
  today,
  selectedDates,
  existingDates,
  onToggleDay,
}) {
  const { colors } = useTheme();

  const isSameDate = (d1, d2) => d1 && d2 && d1.jy === d2.jy && d1.jm === d2.jm && d1.jd === d2.jd;

  const isSelected = (day) =>
    selectedDates.some((d) => isSameDate(d, { jy: viewMonth.jy, jm: viewMonth.jm, jd: day }));

  const isExisting = (day) =>
    existingDates.some((d) => isSameDate(d, { jy: viewMonth.jy, jm: viewMonth.jm, jd: day }));

  const isPast = (jy, jm, jd) => {
    const val = jy * 10000 + jm * 100 + jd;
    const todayVal = today.jy * 10000 + today.jm * 100 + today.jd;
    return val < todayVal;
  };

  return (
    <>
      {/* ردیف نام روزهای هفته */}
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
          const isToday = isSameDate(day, today);
          const selected = isSelected(day.jd);
          const existing = isExisting(day.jd);

          return (
            <button
              key={day.key}
              disabled={disabled}
              onClick={() => onToggleDay(day.jd)}
              className="relative aspect-square rounded-xl flex items-center justify-center text-sm font-[Vazir-Medium] transition-all"
              style={{
                backgroundColor: selected
                  ? colors.primary
                  : !selected && existing
                    ? '#43A04715'
                    : isToday
                      ? colors.primary + '15'
                      : 'transparent',
                color: selected ? '#fff' : !selected && existing ? '#43A047' : colors.textMain,
                border:
                  !selected && existing
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
                  <span className="text-[8px]" style={{ color: '#43A047' }}>
                    📅
                  </span>
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
    </>
  );
}
