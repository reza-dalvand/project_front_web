'use client';
import { useTheme } from '@/stores/useThemeStore';
import { toPersianDigit } from '@/utils/numberUtils';

/**
 * فیلد انتخاب ساعت
 * معادل TimePickerField اندروید با input type="time"
 */
export default function TimePickerField({
  label,
  value,
  onChange,
  icon = '⏰',
  color = '#2196F3',
}) {
  const { colors } = useTheme();

  return (
    <div className="flex-1 gap-1">
      <span className="text-[11px] font-[Vazir-Medium]" style={{ color: colors.textSecondary }}>
        {label}
      </span>
      <div
        className="flex items-center gap-2 py-2.5 px-3 rounded-xl border"
        style={{
          backgroundColor: colors.cardBackground,
          borderColor: colors.border,
        }}
      >
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: color + '18' }}
        >
          <span className="text-base">{icon}</span>
        </div>
        <input
          type="time"
          value={value || '09:00'}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 bg-transparent outline-none text-sm font-[Vazir-Bold] text-center"
          style={{ color: colors.textMain, direction: 'ltr' }}
        />
      </div>
    </div>
  );
}