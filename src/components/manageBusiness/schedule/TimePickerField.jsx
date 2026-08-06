// src/components/manageBusiness/schedule/TimePickerField.jsx
'use client';
import { useTheme } from '@/stores/useThemeStore';

const HOURS = Array.from({ length: 24 }, (_, i) => i);
const MINUTES = Array.from({ length: 60 }, (_, i) => i);

export default function TimePickerField({
  label,
  value,
  onChange,
  icon = '⏰',
  color = '#2196F3',
}) {
  const { colors } = useTheme();

  const parts = (value || '09:00').split(':');
  const currentHour = parseInt(parts[0], 10) || 0;
  const currentMinute = parseInt(parts[1], 10) || 0;

  const handleHourChange = (e) => {
    const h = String(parseInt(e.target.value, 10)).padStart(2, '0');
    const m = String(currentMinute).padStart(2, '0');
    onChange(`${h}:${m}`);
  };

  const handleMinuteChange = (e) => {
    const h = String(currentHour).padStart(2, '0');
    const m = String(parseInt(e.target.value, 10)).padStart(2, '0');
    onChange(`${h}:${m}`);
  };

  return (
    <div className="flex-1 min-w-[110px] flex flex-col gap-1">
      <span
        className="text-[11px] font-[Vazir-Medium] mr-1"
        style={{ color: colors.textSecondary }}
      >
        {label}
      </span>

      <div
        className="flex items-center gap-2 py-2 px-3 rounded-xl border"
        style={{
          backgroundColor: colors.cardBackground,
          borderColor: colors.border,
        }}
      >
        {/* ✅ آیکون همیشه هم‌رنگ بقیه (color prop) */}
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: color + '18' }}
        >
          <span className="text-sm" style={{ color }}>{icon}</span>
        </div>
        {/* select دقیقه */}
        <select
          value={currentMinute}
          onChange={handleMinuteChange}
          dir="ltr"
          className="flex-1 min-w-0 bg-transparent outline-none text-sm font-[Vazir-Bold] text-center cursor-pointer appearance-none"
          style={{ color: colors.textMain, direction: 'ltr' }}
        >
          {MINUTES.map((m) => (
            <option key={m} value={m}>
              {String(m).padStart(2, '0')} دقیقه
            </option>
          ))}
        </select>


        <span
          className="text-lg font-[Vazir-Bold] flex-shrink-0"
          style={{ color: colors.textMain }}
        >
          :
        </span>
        {/* select ساعت */}
        <select
          value={currentHour}
          onChange={handleHourChange}
          dir="ltr"
          className="flex-1 min-w-0 bg-transparent outline-none text-sm font-[Vazir-Bold] text-center cursor-pointer appearance-none"
          style={{ color: colors.textMain, direction: 'ltr' }}
        >
          {HOURS.map((h) => (
            <option key={h} value={h}>
              {String(h).padStart(2, '0')} ساعت
            </option>
          ))}
        </select>

      </div>
    </div>
  );
}