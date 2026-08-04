'use client';
import { useTheme } from '@/stores/useThemeStore';

/**
 * کامپوننت اسلات زمانی رزرو
 *
 * @param {string} time - زمان (مثلاً "۱۰:۳۰")
 * @param {'available'|'booked'|'selected'} status - وضعیت
 * @param {function} onPress - تابع کلیک
 */
export default function BookingTimeSlot({
  time,
  status = 'available',
  onPress,
}) {
  const { colors } = useTheme();

  const isBooked = status === 'booked';
  const isSelected = status === 'selected';

  const backgroundColor = isSelected
    ? colors.primary
    : isBooked
      ? colors.border
      : colors.cardBackground;

  const textColor = isSelected
    ? '#FFFFFF'
    : isBooked
      ? colors.textSecondary
      : colors.textMain;

  return (
    <button
      onClick={isBooked ? undefined : onPress}
      disabled={isBooked}
      className="min-w-[72px] px-3.5 py-2.5 rounded-[10px] border-[1.5px]
        transition-all duration-200 flex items-center justify-center gap-1
        hover:scale-105 active:scale-95
        disabled:cursor-not-allowed disabled:hover:scale-100"
      style={{
        backgroundColor,
        borderColor: isSelected
          ? colors.primary
          : isBooked
            ? colors.border + '60'
            : colors.border,
      }}
    >
      <span
        className="text-[13px] font-[Vazir-Bold]"
        style={{ color: textColor }}
      >
        {time}
      </span>
      {isBooked && (
        <span
          className="text-[8px] font-[Vazir]"
          style={{ color: colors.textSecondary + '80' }}
        >
          پر
        </span>
      )}
    </button>
  );
}