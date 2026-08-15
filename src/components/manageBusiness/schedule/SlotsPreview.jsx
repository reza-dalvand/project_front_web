// src/components/manageBusiness/schedule/SlotsPreview.jsx
'use client';
import { useMemo } from 'react';
import { useTheme } from '@/stores/useThemeStore';
import { toPersianDigit, toEnglishDigits } from '@/utils/numberUtils';
import { timeToMinutes } from '@/utils/dateUtils';

const format24 = (timeStr) => {
  if (!timeStr) return '—';
  const cleaned = toEnglishDigits(String(timeStr)).trim();
  return toPersianDigit(cleaned);
};

export default function SlotsPreview({ workStart, workEnd, slotDuration, breaks }) {
  const { colors } = useTheme();

  const availableSlots = useMemo(() => {
    const startMin = timeToMinutes(workStart);
    const endMin = timeToMinutes(workEnd);
    if (!startMin || !endMin || endMin <= startMin || !slotDuration || slotDuration <= 0) return [];
    const occupiedRanges = breaks.map((b) => {
      const bStart = Math.max(timeToMinutes(b.start), startMin);
      const bEnd = Math.min(timeToMinutes(b.end), endMin);
      return { start: bStart, end: Math.max(bStart, bEnd) };
    });
    const slots = [];
    let currentMin = startMin;
    while (currentMin + slotDuration <= endMin) {
      const slotEnd = currentMin + slotDuration;
      const isOccupied = occupiedRanges.some(
        (range) => currentMin < range.end && slotEnd > range.start
      );
      if (!isOccupied) {
        const h = Math.floor(currentMin / 60);
        const m = currentMin % 60;
        const eh = Math.floor(slotEnd / 60);
        const em = slotEnd % 60;
        slots.push({
          start: `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`,
          end: `${String(eh).padStart(2, '0')}:${String(em).padStart(2, '0')}`,
        });
      }
      currentMin += slotDuration;
    }
    return slots;
  }, [workStart, workEnd, slotDuration, breaks]);

  return (
    <div
      className="p-3 rounded-2xl border"
      style={{
        backgroundColor: availableSlots.length > 0 ? '#43A04708' : '#FF980010',
        borderColor: availableSlots.length > 0 ? '#43A04740' : '#FF980040',
      }}
    >
      <div className="flex items-center gap-2 mb-2">
        <span className="text-base flex-shrink-0">{availableSlots.length > 0 ? '📋' : '⚠️'}</span>
        <span
          className="text-[13px] font-[Vazir-Bold] flex-1 truncate"
          style={{ color: availableSlots.length > 0 ? '#43A047' : '#FF9800' }}
        >
          پیش‌نمایش نوبت‌های قابل رزرو
        </span>
        <span
          className="px-2.5 py-1 rounded-lg text-[11px] font-[Vazir-Bold] flex-shrink-0"
          style={{
            backgroundColor: availableSlots.length > 0 ? '#43A04720' : '#FF980020',
            color: availableSlots.length > 0 ? '#43A047' : '#FF9800',
          }}
        >
          {toPersianDigit(availableSlots.length)} نوبت
        </span>
      </div>
      {availableSlots.length > 0 ? (
        <div className="flex flex-wrap gap-1.5">
          {availableSlots.slice(0, 12).map((slot, idx) => (
            <span
              key={idx}
              className="px-2 py-1.5 rounded-lg text-[10px] font-[Vazir-Bold] border"
              style={{
                backgroundColor: colors.primary + '15',
                borderColor: colors.primary + '40',
                color: colors.primary,
              }}
            >
              {format24(slot.start)} - {format24(slot.end)}
            </span>
          ))}
          {availableSlots.length > 12 && (
            <span
              className="px-2 py-1.5 rounded-lg text-[10px] font-[Vazir] border"
              style={{
                backgroundColor: colors.background,
                borderColor: colors.border,
                color: colors.textSecondary,
              }}
            >
              + {toPersianDigit(availableSlots.length - 12)} نوبت دیگر
            </span>
          )}
        </div>
      ) : (
        <span className="text-[11px] text-center block" style={{ color: colors.textSecondary }}>
          در این بازه نوبت قابل رزرو وجود ندارد
        </span>
      )}
    </div>
  );
}