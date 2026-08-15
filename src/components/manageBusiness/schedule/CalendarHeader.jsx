// src/components/manageBusiness/schedule/CalendarHeader.jsx
'use client';
import { FiChevronRight, FiChevronLeft } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import { toPersianDigit } from '@/utils/numberUtils';
import { PERSIAN_MONTHS } from '@/utils/dateUtils';

export default function CalendarHeader({ viewMonth, onPrev, onNext }) {
  const { colors } = useTheme();

  return (
    <div
      className="flex items-center justify-between p-3.5 rounded-2xl border"
      style={{ backgroundColor: colors.cardBackground, borderColor: colors.border }}
    >
      <button onClick={onPrev} className="p-2 rounded-lg hover:bg-black/5">
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
      <button onClick={onNext} className="p-2 rounded-lg hover:bg-black/5">
        <FiChevronLeft size={22} style={{ color: colors.textMain }} />
      </button>
    </div>
  );
}
