'use client';

import { FiPhone, FiCalendar, FiClock, FiUser, FiInfo, FiXCircle, FiCheckCircle } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import Avatar from '@/components/common/Avatar';
import { toPersianDigit, formatPrice } from '@/utils/numberUtils';

const STATUS_META = {
  reserved: { label: 'رزرو شده', color: '#2196F3', icon: FiCalendar },
  done: { label: 'انجام شده', color: '#43A047', icon: FiCheckCircle },
  cancelled_by_salon: { label: 'لغو توسط سالن', color: '#E53935', icon: FiXCircle },
};

export default function AppointmentCard({
  appointment,
  onDetails,
  onVerify,
  onCancel,
}) {
  const { colors } = useTheme();
  const meta = STATUS_META[appointment.status] || STATUS_META.reserved;
  const isReserved = appointment.status === 'reserved';
  const StatusIcon = meta.icon;

  const dateStr = appointment.date
    ? `${toPersianDigit(appointment.date.jy)}/${toPersianDigit(appointment.date.jm)}/${toPersianDigit(appointment.date.jd)}`
    : '—';

  return (
    <div
      className="rounded-[18px] overflow-hidden shadow-sm"
      style={{ backgroundColor: colors.cardBackground }}
    >
      {/* هدر: مشتری + وضعیت */}
      <button
        onClick={() => onDetails?.(appointment)}
        className="w-full flex items-center justify-between gap-2.5 px-3.5 py-3 border-b text-right"
        style={{ borderColor: colors.border }}
      >
        <div className="flex items-center gap-2.5 flex-1 min-w-0">
          <Avatar name={appointment.customerName} size="md" />
          <div className="flex flex-col gap-0.5 flex-1 min-w-0">
            <span
              className="text-sm font-[Vazir-Bold] truncate"
              style={{ color: colors.textMain }}
            >
              {appointment.customerName}
            </span>
            <span className="flex items-center gap-1 text-xs" style={{ color: colors.textSecondary }}>
              <FiPhone size={12} />
              {toPersianDigit(appointment.customerPhone || '—')}
            </span>
          </div>
        </div>
        <div
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl flex-shrink-0"
          style={{ backgroundColor: meta.color + '20' }}
        >
          <StatusIcon size={12} style={{ color: meta.color }} />
          <span className="text-[11px] font-[Vazir-Bold]" style={{ color: meta.color }}>
            {meta.label}
          </span>
        </div>
      </button>

      {/* خدمت و کارمند */}
      <button
        onClick={() => onDetails?.(appointment)}
        className="w-full flex flex-col gap-1.5 px-3.5 py-2.5 text-right"
      >
        <div className="flex items-center gap-1.5">
          <span className="text-xs" style={{ color: colors.textSecondary }}>خدمت:</span>
          <span className="text-xs font-[Vazir-Medium]" style={{ color: colors.textMain }}>
            {appointment.serviceName}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <FiUser size={12} style={{ color: colors.textSecondary }} />
          <span className="text-xs" style={{ color: colors.textSecondary }}>کارمند:</span>
          <span className="text-xs font-[Vazir-Medium]" style={{ color: colors.textMain }}>
            {appointment.employeeName}
          </span>
        </div>
      </button>

      {/* تاریخ و مبلغ */}
      <div
        className="flex items-center justify-between px-3.5 py-3 border-t"
        style={{ borderColor: colors.border, backgroundColor: colors.background + '40' }}
      >
        <div className="flex items-center gap-1.5">
          <FiCalendar size={14} style={{ color: colors.primary }} />
          <span className="text-xs font-[Vazir-Bold]" style={{ color: colors.primary }}>
            {dateStr}
          </span>
          <div className="w-1 h-1 rounded-full mx-0.5" style={{ backgroundColor: colors.border }} />
          <FiClock size={14} style={{ color: colors.primary }} />
          <span className="text-xs font-[Vazir-Bold]" style={{ color: colors.primary }}>
            {appointment.time}
          </span>
        </div>
        <div className="flex flex-col items-end gap-0.5">
          {isReserved && appointment.depositPaid > 0 && (
            <div className="flex items-center gap-1">
              <span className="text-[10px]" style={{ color: colors.textSecondary }}>بیعانه:</span>
              <span className="text-[11px] font-[Vazir-Bold]" style={{ color: '#43A047' }}>
                {formatPrice(appointment.depositPaid)}
              </span>
            </div>
          )}
          <span className="text-[13px] font-[Vazir-Bold]" style={{ color: colors.textMain }}>
            {formatPrice(appointment.price)}
          </span>
        </div>
      </div>

      {/* پیام لغو */}
      {appointment.status === 'cancelled_by_salon' && appointment.cancellationReason && (
        <div
          className="flex items-start gap-1.5 px-3.5 py-2.5 border-t"
          style={{ backgroundColor: '#E5393510', borderColor: colors.border }}
        >
          <FiInfo size={14} color="#E53935" className="flex-shrink-0 mt-0.5" />
          <span className="text-[11px] font-[Vazir] leading-[17px] flex-1" style={{ color: '#E53935' }}>
            {appointment.cancellationReason}
          </span>
        </div>
      )}

      {/* پیام انجام شده */}
      {appointment.status === 'done' && (
        <div
          className="flex items-center gap-1.5 px-3.5 py-2.5 border-t"
          style={{ backgroundColor: '#43A04710', borderColor: colors.border }}
        >
          <FiCheckCircle size={14} color="#43A047" />
          <span className="text-[11px] font-[Vazir]" style={{ color: '#43A047' }}>
            خدمت انجام شد • بیعانه آزاد شد
          </span>
        </div>
      )}

      {/* دکمه‌های اکشن - فقط برای رزرو شده */}
      {isReserved && (
        <div
          className="flex flex-col gap-2 px-2.5 py-2.5 border-t"
          style={{ borderColor: colors.border, backgroundColor: colors.background + '60' }}
        >
          <div className="flex gap-2">
            <button
              onClick={() => onCancel?.(appointment)}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border"
              style={{ borderColor: '#E5393540', backgroundColor: '#E5393508' }}
            >
              <FiXCircle size={16} color="#E53935" />
              <span className="text-xs font-[Vazir-Bold]" style={{ color: '#E53935' }}>
                لغو نوبت
              </span>
            </button>
            <button
              onClick={() => onDetails?.(appointment)}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border"
              style={{ borderColor: colors.primary + '40', backgroundColor: colors.primary + '08' }}
            >
              <FiInfo size={16} style={{ color: colors.primary }} />
              <span className="text-xs font-[Vazir-Bold]" style={{ color: colors.primary }}>
                جزئیات نوبت
              </span>
            </button>
          </div>
          <button
            onClick={() => onVerify?.(appointment)}
            className="flex items-center gap-2.5 px-3.5 py-3 rounded-xl"
            style={{ backgroundColor: '#43A047' }}
          >
            <div
              className="w-11 h-11 rounded-[14px] flex items-center justify-center"
              style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
            >
              <FiCheckCircle size={18} color="#fff" />
            </div>
            <div className="flex-1 text-right">
              <p className="text-[13px] font-[Vazir-Bold] text-white">تایید انجام خدمت</p>
              <p className="text-[10px] text-white/80">وارد کردن کد ۴ رقمی مشتری</p>
            </div>
            <span className="text-white">←</span>
          </button>
        </div>
      )}
    </div>
  );
}