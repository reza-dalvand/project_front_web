'use client';
import Image from 'next/image';
import { FiCalendar, FiClock, FiCopy, FiCheck, FiChevronLeft } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';

const STATUS_CONFIG = {
  reserved: { label: 'رزرو شده', color: '#2196F3' },
  confirmed: { label: 'تأیید شده', color: '#43A047' },
  done: { label: 'انجام شده', color: '#4CAF50' },
  cancelled: { label: 'لغو شده', color: '#E53935' },
};

/**
 * کارت فشرده نوبت
 * فقط: لوگو + نام سالن + تاریخ + ساعت + وضعیت + کد تایید کوچک
 */
export default function AppointmentCompactCard({
  appointment,
  onPress,
  onCopyCode,
  copiedCode,
}) {
  const { colors } = useTheme();
  const status = STATUS_CONFIG[appointment.status] || STATUS_CONFIG.reserved;

  return (
    <div
      className="rounded-2xl border overflow-hidden transition-all hover:shadow-sm"
      style={{ backgroundColor: colors.cardBackground, borderColor: colors.border }}
    >
      {/* ═══ بدنه اصلی - کلیک → جزئیات ═══ */}
      <button
        onClick={() => onPress?.(appointment)}
        className="w-full flex items-center gap-3 p-3.5 text-right active:bg-black/[0.02]"
      >
        {/* لوگو */}
        <div className="relative flex-shrink-0">
          <Image
            src={appointment.businessLogo}
            alt={appointment.businessName}
            width={46}
            height={46}
            className="rounded-xl"
          />
          {/* نقطه وضعیت */}
          <div
            className="absolute -bottom-0.5 -left-0.5 w-3 h-3 rounded-full border-2"
            style={{ backgroundColor: status.color, borderColor: colors.cardBackground }}
          />
        </div>

        {/* اطلاعات */}
        <div className="flex-1 min-w-0 flex flex-col gap-1.5">
          <span
            className="text-sm font-[Vazir-Bold] truncate"
            style={{ color: colors.textMain }}
          >
            {appointment.businessName}
          </span>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <FiCalendar size={12} style={{ color: colors.textSecondary }} />
              <span className="text-[11px] font-[Vazir]" style={{ color: colors.textSecondary }}>
                {appointment.date}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <FiClock size={12} style={{ color: colors.textSecondary }} />
              <span className="text-[11px] font-[Vazir]" style={{ color: colors.textSecondary }}>
                {appointment.time}
              </span>
            </div>
          </div>
        </div>

        {/* وضعیت + فلش */}
        <span
          className="flex items-center gap-1 text-[10px] font-[Vazir-Bold] px-2.5 py-1.5 rounded-lg flex-shrink-0"
          style={{ backgroundColor: status.color + '18', color: status.color }}
        >
          {status.label}
          <FiChevronLeft size={12} />
        </span>
      </button>

      {/* ═══ کد تایید کوچک - فقط نوبت‌های آینده ═══ */}
      {appointment.isUpcoming &&
        appointment.status !== 'cancelled' &&
        appointment.verificationCode && (
          <div
            className="flex items-center gap-2.5 px-3.5 py-2.5 border-t"
            style={{ borderColor: colors.border, backgroundColor: colors.background }}
          >
            <span
              className="text-[10px] font-[Vazir] flex-shrink-0"
              style={{ color: colors.textSecondary }}
            >
              کد تایید انجام خدمت:
            </span>
            {/* ارقام کد */}
            <div className="flex items-center gap-1" dir="ltr">
              {appointment.verificationCode.split('').map((digit, idx) => (
                <span
                  key={idx}
                  className="w-[22px] h-[26px] rounded-md border flex items-center justify-center
                    text-xs font-[Vazir-Bold]"
                  style={{
                    borderColor: colors.primary + '40',
                    color: colors.primary,
                    backgroundColor: colors.cardBackground,
                  }}
                >
                  {digit}
                </span>
              ))}
            </div>
            <div className="flex-1" />
            {/* دکمه کپی */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onCopyCode?.(appointment.verificationCode);
              }}
              className="w-7 h-7 rounded-lg flex items-center justify-center transition-all
                hover:scale-110 active:scale-95"
              style={{
                backgroundColor:
                  copiedCode === appointment.verificationCode
                    ? '#4CAF5020'
                    : colors.primary + '15',
              }}
            >
              {copiedCode === appointment.verificationCode ? (
                <FiCheck size={13} color="#4CAF50" />
              ) : (
                <FiCopy size={13} style={{ color: colors.primary }} />
              )}
            </button>
          </div>
        )}
    </div>
  );
}