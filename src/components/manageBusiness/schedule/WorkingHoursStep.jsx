// src/components/manageBusiness/schedule/WorkingHoursStep.jsx
'use client';
import { useMemo } from 'react';
import { FiPlus, FiX, FiClock, FiCoffee, FiCheck } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import TimePickerField from './TimePickerField';
import { toPersianDigit, toEnglishDigits } from '@/utils/numberUtils';
import { minutesToTime, timeToMinutes } from '@/utils/dateUtils';

const SLOT_DURATIONS = [15, 30, 45, 60, 90, 120];

const format24 = (timeStr) => {
  if (!timeStr) return '—';
  const cleaned = toEnglishDigits(String(timeStr)).trim();
  return toPersianDigit(cleaned);
};

export default function WorkingHoursStep({
  workStart,
  workEnd,
  slotDuration,
  breaks,
  onWorkStartChange,
  onWorkEndChange,
  onSlotDurationChange,
  onBreaksChange,
}) {
  const { colors } = useTheme();

  const addBreak = () => {
    const lastBreak = breaks[breaks.length - 1];
    let newStart = '13:00';
    let newEnd = '14:00';

    if (lastBreak) {
      const lastEndMin = timeToMinutes(lastBreak.end);
      newStart = minutesToTime(lastEndMin + 60);
      newEnd = minutesToTime(lastEndMin + 120);
    }

    if (timeToMinutes(newStart) < timeToMinutes(workStart)) newStart = workStart;
    if (timeToMinutes(newEnd) > timeToMinutes(workEnd)) newEnd = workEnd;

    onBreaksChange([...breaks, { id: Date.now(), start: newStart, end: newEnd }]);
  };

  const removeBreak = (id) => {
    onBreaksChange(breaks.filter((b) => b.id !== id));
  };

  const updateBreak = (id, field, value) => {
    onBreaksChange(breaks.map((b) => (b.id === id ? { ...b, [field]: value } : b)));
  };

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
        slots.push({
          start: minutesToTime(currentMin),
          end: minutesToTime(slotEnd),
        });
      }
      currentMin += slotDuration;
    }
    return slots;
  }, [workStart, workEnd, slotDuration, breaks]);

  const workStartMin = timeToMinutes(workStart);
  const workEndMin = timeToMinutes(workEnd);
  const isValidRange = workEndMin > workStartMin && workStartMin > 0;

  return (
    <div className="flex flex-col gap-4 px-3 sm:px-4 w-full max-w-full overflow-hidden">
      {/* بخش ۱: بازه کاری */}
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
            <div className="hidden sm:flex items-end pb-3 text-lg" style={{ color: colors.textSecondary }}>
              ←
            </div>
            {/* ✅ رنگ آیکون ساعت پایان هم‌رنگ بقیه (primary به جای قرمز) */}
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
              <span className="text-[11px] font-[Vazir-Bold] leading-relaxed" style={{ color: '#43A047' }}>
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
              <span className="text-[11px] font-[Vazir-Bold] leading-relaxed" style={{ color: '#E53935' }}>
                ساعت پایان باید بعد از ساعت شروع باشد
              </span>
            </div>
          ) : null}
        </div>
      </div>

      {/* بخش ۲: مدت هر نوبت */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <span className="text-lg flex-shrink-0">⏱️</span>
          <span className="text-[14px] font-[Vazir-Bold]" style={{ color: colors.textMain }}>
            مدت هر نوبت (دقیقه)
          </span>
        </div>
        <div
          className="p-3 rounded-2xl border"
          style={{ backgroundColor: colors.cardBackground, borderColor: colors.border }}
        >
          <div className="flex items-center gap-3 mb-3">
            <div
              className="flex items-center gap-2 flex-1 py-2.5 px-4 rounded-xl border-2"
              style={{
                borderColor: slotDuration > 0 ? colors.primary : colors.border,
                backgroundColor: colors.background,
              }}
            >
              <span className="text-base flex-shrink-0">✏️</span>
              <input
                type="text"
                inputMode="numeric"
                placeholder="مثلاً ۴۵"
                value={slotDuration > 0 ? toPersianDigit(String(slotDuration)) : ''}
                onChange={(e) => {
                  const cleaned = toEnglishDigits(e.target.value).replace(/[^0-9]/g, '');
                  const num = parseInt(cleaned, 10) || 0;
                  if (num >= 0 && num <= 480) {
                    onSlotDurationChange(num);
                  }
                }}
                className="flex-1 bg-transparent outline-none text-lg font-[Vazir-Bold] text-center"
                style={{ color: colors.textMain, direction: 'ltr' }}
              />
              <span
                className="text-xs font-[Vazir-Medium] flex-shrink-0"
                style={{ color: colors.textSecondary }}
              >
                دقیقه
              </span>
            </div>
            {slotDuration > 0 && (
              <button
                onClick={() => onSlotDurationChange(0)}
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all hover:scale-105 active:scale-95"
                style={{ backgroundColor: '#E5393515' }}
              >
                <FiX size={18} color="#E53935" />
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            {SLOT_DURATIONS.map((d) => (
              <button
                key={d}
                onClick={() => onSlotDurationChange(d)}
                className="px-3 py-2 rounded-xl border text-xs font-[Vazir-Bold] transition-all flex-1 min-w-[70px] sm:flex-none hover:scale-[1.03] active:scale-[0.97]"
                style={{
                  backgroundColor: slotDuration === d ? colors.primary : colors.background,
                  borderColor: slotDuration === d ? colors.primary : colors.border,
                  color: slotDuration === d ? '#fff' : colors.textMain,
                }}
              >
                {toPersianDigit(d)} دقیقه
              </button>
            ))}
          </div>

          {slotDuration > 0 && slotDuration < 10 && (
            <div
              className="flex items-center gap-1.5 mt-3 py-2 px-3 rounded-lg border"
              style={{ backgroundColor: '#FF980010', borderColor: '#FF980040' }}
            >
              <FiX size={13} color="#FF9800" />
              <span className="text-[11px] font-[Vazir-Bold]" style={{ color: '#FF9800' }}>
                مدت نوبت خیلی کوتاهه (حداقل ۱۰ دقیقه)
              </span>
            </div>
          )}
          {slotDuration > 240 && (
            <div
              className="flex items-center gap-1.5 mt-3 py-2 px-3 rounded-lg border"
              style={{ backgroundColor: '#FF980010', borderColor: '#FF980040' }}
            >
              <FiX size={13} color="#FF9800" />
              <span className="text-[11px] font-[Vazir-Bold]" style={{ color: '#FF9800' }}>
                مدت نوبت خیلی طولانیه (بیشتر از ۴ ساعت)
              </span>
            </div>
          )}
          {slotDuration >= 10 && slotDuration <= 240 && (
            <div
              className="flex items-center gap-1.5 mt-3 py-2 px-3 rounded-lg border"
              style={{ backgroundColor: '#43A04710', borderColor: '#43A04740' }}
            >
              <FiCheck size={13} color="#43A047" />
              <span className="text-[11px] font-[Vazir-Bold]" style={{ color: '#43A047' }}>
                {slotDuration >= 60
                  ? `${toPersianDigit(Math.floor(slotDuration / 60))} ساعت${slotDuration % 60 > 0 ? ` و ${toPersianDigit(slotDuration % 60)} دقیقه` : ''}`
                  : `${toPersianDigit(slotDuration)} دقیقه`}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* بخش ۳: بازه‌های استراحت */}
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
                    <span className="text-[13px] font-[Vazir-Bold] flex-1 truncate" style={{ color: colors.textMain }}>
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
                    <div className="hidden sm:flex items-end pb-3 text-xs" style={{ color: colors.textSecondary }}>
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
                      <span className="text-[10px] flex-shrink-0" style={{ color: '#E53935' }}>⚠️</span>
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

      {/* بخش ۴: پیش‌نمایش نوبت‌ها */}
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
            {isValidRange
              ? 'لطفاً مدت نوبت را انتخاب کنید'
              : 'لطفاً ابتدا بازه کاری معتبر وارد کنید'}
          </span>
        )}
      </div>
    </div>
  );
}