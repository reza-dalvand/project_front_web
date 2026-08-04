'use client';
import { FiClock } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';

const DAYS = [
  { key: 'sat', label: 'شنبه' },
  { key: 'sun', label: 'یک‌شنبه' },
  { key: 'mon', label: 'دوشنبه' },
  { key: 'tue', label: 'سه‌شنبه' },
  { key: 'wed', label: 'چهارشنبه' },
  { key: 'thu', label: 'پنج‌شنبه' },
  { key: 'fri', label: 'جمعه' },
];

export default function ScheduleEditor({ schedule = {}, onChange }) {
  const { colors } = useTheme();

  const toggle = (key) => {
    const updated = {
      ...schedule,
      [key]: {
        ...schedule[key],
        active: !schedule[key]?.active,
        start: schedule[key]?.start || '09:00',
        end: schedule[key]?.end || '18:00',
      },
    };
    onChange?.(updated);
  };

  return (
    <div className="rounded-xl overflow-hidden" style={{ backgroundColor: colors.cardBackground }}>
      {DAYS.map(({ key, label }) => {
        const day = schedule[key] || { active: false, start: '09:00', end: '18:00' };
        return (
          <div
            key={key}
            className="flex items-center px-4 py-3 border-b last:border-b-0"
            style={{ borderColor: colors.border }}
          >
            <button
              onClick={() => toggle(key)}
              className="relative w-11 h-6 rounded-full transition-colors flex-shrink-0"
              style={{ backgroundColor: day.active ? colors.primary + '55' : colors.border }}
            >
              <div
                className="absolute top-0.5 w-5 h-5 rounded-full shadow-md transition-all"
                style={{
                  backgroundColor: day.active ? colors.primary : '#ccc',
                  [day.active ? 'right' : 'left']: '2px',
                }}
              />
            </button>
            <span className="text-sm font-[Vazir-Medium] mr-3 flex-1" style={{ color: colors.textMain }}>
              {label}
            </span>
            {day.active && (
              <span className="text-xs" style={{ color: colors.textSecondary }}>
                {day.start} - {day.end}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}