// src/components/manageBusiness/schedule/BreaksSection.jsx
'use client';
import { FiPlus, FiX, FiClock } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import TimePickerField from './TimePickerField';
import { toPersianDigit, toEnglishDigits } from '@/utils/numberUtils';
import { timeToMinutes } from '@/utils/dateUtils';

const format24 = (timeStr) => {
  if (!timeStr) return '—';
  const cleaned = toEnglishDigits(String(timeStr)).trim();
  return toPersianDigit(cleaned);
};

export default function BreaksSection({ breaks, workStart, workEnd, onBreaksChange }) {
  const { colors } = useTheme();
  const workStartMin = timeToMinutes(workStart);
  const workEndMin = timeToMinutes(workEnd);

  const addBreak = () => {
    const lastBreak = breaks[breaks.length - 1];
    let newStart = '13:00';
    let newEnd = '14:00';
    if (lastBreak) {
      const lastEndMin = timeToMinutes(lastBreak.end);
      newStart = `${String(Math.floor((lastEndMin + 60) / 60)).padStart(2, '0')}:${String((lastEndMin + 60) % 60).padStart(2, '0')}`;
      newEnd = `${String(Math.floor((lastEndMin + 120) / 60)).padStart(2, '0')}:${String((lastEndMin + 120) % 60).padStart(2, '0')}`;
    }
    if (timeToMinutes(newStart) < workStartMin) newStart = workStart;
    if (timeToMinutes(newEnd) > workEndMin) newEnd = workEnd;
    onBreaksChange([...breaks, { id: Date.now(), start: newStart, end: newEnd }]);
  };

  const removeBreak = (id) => {
    onBreaksChange(breaks.filter((b) => b.id !== id));
  };

  const updateBreak = (id, field, value) => {
    onBreaksChange(breaks.map((b) => (b.id === id ? { ...b, [field]: value } : b)));
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg flex-shrink-0">☕</span>
          <span className="text-[14px] font-[Vazir-Bold]" style={{ color: colors.textMain }}>
            بازه‌های استراحت
          </span>
        </div>
        {breaks.length > 0 && (
          <span
            className="px-2.5 py-1 rounded-lg text-[11px] font-[Vazir-Bold] flex-shrink-0"
            style={{ backgroundColor: '#9C27B020', color: '#9C27B0' }}
          >
            {toPersianDigit(breaks.length)} بازه
          </span>
        )}
      </div>
      {breaks.length > 0 ? (
        <div className="flex flex-col gap-2.5">
          {breaks.map((brk, index) => {
            const bStartMin = timeToMinutes(brk.start);
            const bEndMin = timeToMinutes(brk.end);
            const isBreakValid =
              bEndMin > bStartMin && bStartMin >= workStartMin && bEndMin <= workEndMin;
            const breakDuration = bEndMin > bStartMin ? bEndMin - bStartMin : 0;
            return (
              <div
                key={brk.id}
                className="p-3 rounded-2xl border"
                style={{
                  backgroundColor: colors.cardBackground,
                  borderColor: isBreakValid ? colors.border : '#E53935',
                  borderWidth: isBreakValid ? 1 : 1.5,
                }}
              >
                <div className="flex items-center gap-2 mb-2.5">
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-[Vazir-Bold] text-white flex-shrink-0"
                    style={{ backgroundColor: '#9C27B0' }}
                  >
                    {toPersianDigit(index + 1)}
                  </div>
                  <span
                    className="text-[13px] font-[Vazir-Bold] flex-1 truncate"
                    style={{ color: colors.textMain }}
                  >
                    استراحت {toPersianDigit(index + 1)}
                  </span>
                  {breakDuration > 0 && (
                    <span
                      className="px-2 py-0.5 rounded-lg text-[10px] font-[Vazir-Bold] flex-shrink-0"
                      style={{ backgroundColor: '#9C27B015', color: '#9C27B0' }}
                    >
                      {format24(brk.start)} تا {format24(brk.end)}
                      {' • '}
                      {toPersianDigit(breakDuration)} دقیقه
                    </span>
                  )}
                  <button
                    onClick={() => removeBreak(brk.id)}
                    className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: '#E5393515' }}
                  >
                    <FiX size={14} color="#E53935" />
                  </button>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <TimePickerField
                    label="از ساعت"
                    value={brk.start}
                    onChange={(v) => updateBreak(brk.id, 'start', v)}
                    icon="▶️"
                    color="#FF9800"
                  />
                  <div
                    className="hidden sm:flex items-end pb-3 text-xs"
                    style={{ color: colors.textSecondary }}
                  >
                    تا
                  </div>
                  <TimePickerField
                    label="تا ساعت"
                    value={brk.end}
                    onChange={(v) => updateBreak(brk.id, 'end', v)}
                    icon="⏹️"
                    color="#F44336"
                  />
                </div>
                {!isBreakValid && workStartMin > 0 && workEndMin > 0 && (
                  <div className="flex items-start gap-1 mt-2">
                    <span className="text-[10px] flex-shrink-0" style={{ color: '#E53935' }}>
                      ⚠️
                    </span>
                    <span className="text-[10px] leading-relaxed" style={{ color: '#E53935' }}>
                      بازه باید بین {format24(workStart)} تا {format24(workEnd)} باشد
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div
          className="p-5 rounded-2xl border-2 border-dashed flex flex-col items-center gap-2"
          style={{ borderColor: colors.border }}
        >
          <FiClock size={32} style={{ color: colors.textSecondary + '80' }} />
          <span className="text-[13px] font-[Vazir-Bold]" style={{ color: colors.textMain }}>
            بدون بازه استراحت
          </span>
          <span className="text-[11px] text-center" style={{ color: colors.textSecondary }}>
            در تمام ساعات کاری نوبت ارائه می‌دهید
          </span>
        </div>
      )}
      <button
        onClick={addBreak}
        className="flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-dashed text-[13px] font-[Vazir-Bold] transition-all"
        style={{
          borderColor: colors.primary + '40',
          color: colors.primary,
        }}
      >
        <FiPlus size={16} />
        افزودن بازه استراحت
      </button>
    </div>
  );
}
