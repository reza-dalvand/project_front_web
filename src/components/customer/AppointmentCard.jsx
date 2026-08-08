// src/components/manageBusiness/AppointmentCard.jsx
'use client';
import {
  FiPhone,
  FiCalendar,
  FiClock,
  FiInfo,
  FiXCircle,
  FiCheckCircle,
  FiChevronLeft,
  FiKey,
  FiShield,
} from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import Avatar from '@/components/common/Avatar';
import { toPersianDigit, formatPrice } from '@/utils/numberUtils';

const STATUS_META = {
  reserved: { label: 'رزرو شده', color: '#2196F3', icon: FiCalendar },
  done: { label: 'انجام شده', color: '#43A047', icon: FiCheckCircle },
  cancelled_by_salon: { label: 'لغو شده', color: '#E53935', icon: FiXCircle },
};

export default function AppointmentCard({ appointment, onPress, onVerify }) {
  const { colors } = useTheme();
  const meta = STATUS_META[appointment.status] || STATUS_META.reserved;
  const isReserved = appointment.status === 'reserved';
  const isTrustBased = appointment.trustBased === true;
  const isDone = appointment.status === 'done';
  const isCancelled = appointment.status === 'cancelled_by_salon';
  const StatusIcon = meta.icon;

  const dateStr = appointment.date
    ? `${toPersianDigit(appointment.date.jm)}/${toPersianDigit(appointment.date.jd)}`
    : '—';

  return (
    <button
      onClick={() => onPress?.(appointment)}
      className="w-full rounded-2xl border overflow-hidden text-right transition-all
        hover:shadow-md active:scale-[0.99]"
      style={{
        backgroundColor: colors.cardBackground,
        borderColor: isCancelled ? '#E5393530' : colors.border,
        opacity: isCancelled ? 0.75 : 1,
      }}
    >
      {/* ═══ ردیف اصلی: مشتری + وضعیت ═══ */}
      <div className="flex items-center gap-3 px-4 py-3.5">
        <Avatar name={appointment.customerName} size="md" />

        <div className="flex-1 min-w-0 flex flex-col gap-1">
          {/* نام + Badge */}
          <div className="flex items-center justify-between gap-2">
            <span
              className="text-sm font-[Vazir-Bold] truncate"
              style={{ color: colors.textMain }}
            >
              {appointment.customerName}
            </span>
            <span
              className="flex items-center gap-1 px-2 py-1 rounded-lg text-[10px]
                font-[Vazir-Bold] flex-shrink-0"
              style={{ backgroundColor: meta.color + '18', color: meta.color }}
            >
              <StatusIcon size={10} />
              {meta.label}
            </span>
          </div>

          {/* تاریخ • ساعت • بیعانه */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="text-[11px] font-[Vazir]" style={{ color: colors.textSecondary }}>
              📅 {dateStr}
            </span>
            <span className="text-[11px] font-[Vazir]" style={{ color: colors.textSecondary }}>
              🕐 {appointment.time}
            </span>
            {appointment.depositPaid > 0 && (
              <span
                className="text-[11px] font-[Vazir-Bold]"
                style={{ color: colors.primary }}
              >
                💰 {formatPrice(appointment.depositPaid)}
              </span>
            )}
          </div>

          {/* شماره تماس */}
          <span
            className="text-[10px] font-[Vazir]"
            style={{ color: colors.textSecondary, direction: 'ltr', textAlign: 'right' }}
          >
            {toPersianDigit(appointment.customerPhone || '—')}
          </span>
        </div>

        <FiChevronLeft size={18} style={{ color: colors.textSecondary, flexShrink: 0 }} />
      </div>

      {/* ═══ بخش اکشن ═══ */}

      {/* ── اعتمادی: پیام خودکار تایید ── */}
      {isReserved && isTrustBased && (
        <div
          className="flex items-start gap-2.5 px-4 py-3 border-t"
          style={{ borderColor: colors.border, backgroundColor: '#43A04708' }}
        >
          <FiShield size={16} color="#43A047" className="flex-shrink-0 mt-0.5" />
          <span
            className="text-[11px] font-[Vazir] leading-[19px] flex-1"
            style={{ color: '#43A047' }}
          >
            این نوبت بصورت خودکار بدون نیاز به کد تایید شده چون مشتری تیک اعتماد به سالن
            رو زده
          </span>
        </div>
      )}

      {/* ── نیاز به کد: دکمه باریک تمام عرض ── */}
      {isReserved && !isTrustBased && (
        <div className="px-4 py-3 border-t" style={{ borderColor: colors.border }}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onVerify?.(appointment);
            }}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl
              border-[1.5px] transition-all hover:scale-[1.01] active:scale-[0.99]"
            style={{
              borderColor: '#FF980050',
              backgroundColor: '#FF980008',
            }}
          >
            <FiKey size={14} color="#FF9800" />
            <span className="text-[12px] font-[Vazir-Bold]" style={{ color: '#FF9800' }}>
              وارد کردن کد تایید
            </span>
          </button>
        </div>
      )}

      {/* ── لغو شده: دلیل ── */}
      {isCancelled && appointment.cancellationReason && (
        <div
          className="flex items-start gap-2 px-4 py-2.5 border-t"
          style={{ borderColor: '#E5393520', backgroundColor: '#E5393508' }}
        >
          <FiInfo size={13} color="#E53935" className="flex-shrink-0 mt-0.5" />
          <span className="text-[10px] font-[Vazir] leading-4" style={{ color: '#E53935' }}>
            {appointment.cancellationReason}
          </span>
        </div>
      )}

      {/* ── انجام شده ── */}
      {isDone && (
        <div
          className="flex items-center gap-1.5 px-4 py-2.5 border-t"
          style={{ borderColor: '#43A04720', backgroundColor: '#43A04708' }}
        >
          <FiCheckCircle size={13} color="#43A047" />
          <span className="text-[10px] font-[Vazir]" style={{ color: '#43A047' }}>
            {appointment.trustConfirmed
              ? 'خدمت انجام شد • بدون نیاز به کد • بیعانه آزاد شد'
              : 'خدمت انجام شد • کد تایید شد • بیعانه آزاد شد'}
          </span>
        </div>
      )}
    </button>
  );
}