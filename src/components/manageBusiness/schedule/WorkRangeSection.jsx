// src/components/manageBusiness/schedule/WorkRangeSection.jsx
'use client';
import { FiCheck, FiX } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import TimePickerField from './TimePickerField';
import { toPersianDigit, toEnglishDigits } from '@/utils/numberUtils';
import { timeToMinutes } from '@/utils/dateUtils';

const format24 = (timeStr) => {
  if (!timeStr) return '—';
  const cleaned = toEnglishDigits(String(timeStr)).trim();
  return toPersianDigit(cleaned);
};

export default function WorkRangeSection({
  workStart,
  workEnd,
  onWorkStartChange,
  onWorkEndChange,
}) {
  const { colors } = useTheme();
  const workStartMin = timeToMinutes(workStart);
  const workEndMin = timeToMinutes(workEnd);
  const isValidRange = workEndMin > workStartMin && workStartMin > 0;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <span className="text-lg flex-shrink-0">🕐</span>
        <span className="text-[14px] font-[Vazir-Bold]" style={{ color: colors.textMain }}>
          بازه ساعت کاری
        </span>
        <span
          className="text-[10px] font-[Vazir-Bold] px-2 py-0.5 rounded-md"
          style={{ backgroundColor: '#2196F315', color: '#2196F3' }}
        >
          ۲۴ ساعته
        </span>
      </div>
      <div
        className="p-3 rounded-2xl border"
        style={{ backgroundColor: colors.cardBackground, borderColor: colors.border }}
      >
        <div className="flex flex-col sm:flex-row gap-3">
          <TimePickerField
            label="ساعت شروع"
            value={workStart}
            onChange={onWorkStartChange}
            icon="▶️"
            color="#43A047"
          />
          <div
            className="hidden sm:flex items-end pb-3 text-lg"
            style={{ color: colors.textSecondary }}
          >
            ←
          </div>
          <TimePickerField
            label="ساعت پایان"
            value={workEnd}
            onChange={onWorkEndChange}
            icon="⏹️"
            color={colors.primary}
          />
        </div>
        {isValidRange ? (
          <div
            className="flex items-center gap-1.5 mt-3 py-2 px-3 rounded-lg border"
            style={{ backgroundColor: '#43A04710', borderColor: '#43A04740' }}
          >
            <FiCheck size={13} color="#43A047" className="flex-shrink-0" />
            <span
              className="text-[11px] font-[Vazir-Bold] leading-relaxed"
              style={{ color: '#43A047' }}
            >
              از {format24(workStart)} تا {format24(workEnd)}
              {' • '}
              مجموع: {toPersianDigit(Math.floor((workEndMin - workStartMin) / 60))} ساعت
              {(workEndMin - workStartMin) % 60 > 0 &&
                ` و ${toPersianDigit((workEndMin - workStartMin) % 60)} دقیقه`}
            </span>
          </div>
        ) : workStartMin > 0 && workEndMin > 0 ? (
          <div
            className="flex items-center gap-1.5 mt-3 py-2 px-3 rounded-lg border"
            style={{ backgroundColor: '#E5393510', borderColor: '#E5393540' }}
          >
            <FiX size={13} color="#E53935" className="flex-shrink-0" />
            <span
              className="text-[11px] font-[Vazir-Bold] leading-relaxed"
              style={{ color: '#E53935' }}
            >
              ساعت پایان باید بعد از ساعت شروع باشد
            </span>
          </div>
        ) : null}
      </div>
    </div>
  );
}
