'use client';
import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import {
  FiX,
  FiCalendar,
  FiClock,
  FiUser,
  FiDollarSign,
  FiInfo,
  FiAlertTriangle,
  FiXCircle,
} from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import { toPersianDigit, formatPrice } from '@/utils/numberUtils';
import { acquireScrollLock, releaseScrollLock } from '@/utils/scrollLock';

const STATUS_CONFIG = {
  reserved: { label: 'رزرو شده', color: '#2196F3', bg: '#2196F318' },
  confirmed: { label: 'تأیید شده', color: '#43A047', bg: '#43A04718' },
  done: { label: 'انجام شده', color: '#4CAF50', bg: '#4CAF5018' },
  cancelled: { label: 'لغو شده', color: '#E53935', bg: '#E5393518' },
};

/**
 * مدال جزئیات نوبت
 * نمایش جزئیات کامل + دکمه لغو (در صورت > 12 ساعت)
 */
export default function AppointmentDetailModal({ visible, appointment, onClose, onCancelRequest }) {
  const { colors } = useTheme();
  const instanceId = useRef('appointment-detail-modal');

  useEffect(() => {
    if (visible) acquireScrollLock(instanceId.current);
    else releaseScrollLock(instanceId.current);
    return () => releaseScrollLock(instanceId.current);
  }, [visible]);

  useEffect(() => {
    if (!visible) return;
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [visible, onClose]);

  if (!visible || !appointment) return null;

  const status = STATUS_CONFIG[appointment.status] || STATUS_CONFIG.reserved;
  const canCancel =
    appointment.isUpcoming &&
    appointment.status !== 'cancelled' &&
    appointment.status !== 'done' &&
    (appointment.hoursLeft ?? Infinity) >= 12;
  const isTooLate =
    appointment.isUpcoming &&
    appointment.status !== 'cancelled' &&
    appointment.status !== 'done' &&
    (appointment.hoursLeft ?? Infinity) < 12;

  const content = (
    <div
      className="fixed inset-0 z-[9999] flex items-end md:items-center justify-center"
      style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="w-full max-w-md max-h-[90vh] rounded-t-3xl md:rounded-3xl
          flex flex-col overflow-hidden shadow-2xl"
        style={{
          backgroundColor: colors.cardBackground,
          borderTop: `1px solid ${colors.border}`,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Handle Bar */}
        <div className="flex justify-center pt-3 pb-1 md:hidden">
          <div className="w-10 h-1 rounded-full" style={{ backgroundColor: colors.border }} />
        </div>

        {/* هدر */}
        <div
          className="flex items-center gap-3 px-5 py-4 border-b"
          style={{ borderColor: colors.border }}
        >
          <Image
            src={appointment.businessLogo}
            alt={appointment.businessName}
            width={48}
            height={48}
            className="rounded-xl"
          />
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-[Vazir-Bold] truncate" style={{ color: colors.textMain }}>
              {appointment.businessName}
            </h3>
            <p className="text-xs font-[Vazir]" style={{ color: colors.textSecondary }}>
              {appointment.serviceName}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: colors.background }}
          >
            <FiX size={20} style={{ color: colors.textMain }} />
          </button>
        </div>

        {/* محتوا */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* Badge وضعیت */}
          <div className="flex justify-center">
            <span
              className="px-4 py-2 rounded-xl text-sm font-[Vazir-Bold]"
              style={{ backgroundColor: status.bg, color: status.color }}
            >
              {status.label}
            </span>
          </div>

          {/* جزئیات */}
          <div
            className="rounded-2xl border p-4 space-y-3.5"
            style={{ borderColor: colors.border, backgroundColor: colors.background }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: colors.primary + '15' }}
              >
                <FiCalendar size={16} style={{ color: colors.primary }} />
              </div>
              <div className="flex-1">
                <p className="text-[11px] font-[Vazir]" style={{ color: colors.textSecondary }}>
                  تاریخ
                </p>
                <p className="text-sm font-[Vazir-Bold]" style={{ color: colors.textMain }}>
                  {appointment.date}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: '#2196F315' }}
              >
                <FiClock size={16} color="#2196F3" />
              </div>
              <div className="flex-1">
                <p className="text-[11px] font-[Vazir]" style={{ color: colors.textSecondary }}>
                  ساعت
                </p>
                <p className="text-sm font-[Vazir-Bold]" style={{ color: colors.textMain }}>
                  {appointment.time}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: '#9C27B015' }}
              >
                <FiUser size={16} color="#9C27B0" />
              </div>
              <div className="flex-1">
                <p className="text-[11px] font-[Vazir]" style={{ color: colors.textSecondary }}>
                  کارمند
                </p>
                <p className="text-sm font-[Vazir-Bold]" style={{ color: colors.textMain }}>
                  {appointment.employeeName}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: '#FF980015' }}
              >
                <FiDollarSign size={16} color="#FF9800" />
              </div>
              <div className="flex-1">
                <p className="text-[11px] font-[Vazir]" style={{ color: colors.textSecondary }}>
                  مبلغ کل خدمت
                </p>
                <p className="text-sm font-[Vazir-Bold]" style={{ color: colors.textMain }}>
                  {formatPrice(appointment.totalPrice)}
                </p>
              </div>
            </div>

            {appointment.depositPaid > 0 && (
              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: '#4CAF5015' }}
                >
                  <FiDollarSign size={16} color="#4CAF50" />
                </div>
                <div className="flex-1">
                  <p className="text-[11px] font-[Vazir]" style={{ color: colors.textSecondary }}>
                    بیعانه پرداخت شده
                  </p>
                  <p className="text-sm font-[Vazir-Bold]" style={{ color: '#4CAF50' }}>
                    {formatPrice(appointment.depositPaid)}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* ═══ بخش لغو ═══ */}
          {canCancel && (
            <div
              className="flex items-start gap-3 p-4 rounded-2xl border"
              style={{ backgroundColor: '#FF980008', borderColor: '#FF980030' }}
            >
              <FiInfo size={18} color="#FF9800" className="flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p
                  className="text-xs font-[Vazir] leading-5"
                  style={{ color: colors.textSecondary }}
                >
                  امکان لغو این نوبت وجود دارد.
                </p>
                <a
                  href="https://zibano.app/rules/cancellation"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] font-[Vazir] underline mt-1 inline-block"
                  style={{ color: colors.primary }}
                >
                  برای مطالعه قوانین این قسمت به این لینک مراجعه کنید
                </a>
              </div>
            </div>
          )}
          {isTooLate && (
            <div
              className="flex items-start gap-3 p-4 rounded-2xl border"
              style={{ backgroundColor: '#E5393508', borderColor: '#E5393530' }}
            >
              <FiAlertTriangle size={18} color="#E53935" className="flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p
                  className="text-xs font-[Vazir] leading-5"
                  style={{ color: colors.textSecondary }}
                >
                  امکان لغو این نوبت وجود ندارد.
                </p>
                <a
                  href="https://zibano.app/rules/cancellation"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] font-[Vazir] underline mt-1 inline-block"
                  style={{ color: colors.primary }}
                >
                  برای مطالعه قوانین این قسمت به این لینک مراجعه کنید
                </a>
              </div>
            </div>
          )}
        </div>

        {/* فوتر */}
        <div className="px-5 py-4 border-t" style={{ borderColor: colors.border }}>
          {canCancel ? (
            <button
              onClick={() => onCancelRequest?.(appointment)}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl
                border-2 transition-all hover:scale-[1.01] active:scale-[0.99]"
              style={{ borderColor: '#E53935', backgroundColor: '#E5393508' }}
            >
              <FiXCircle size={18} color="#E53935" />
              <span className="text-sm font-[Vazir-Bold]" style={{ color: '#E53935' }}>
                لغو نوبت و استرداد وجه
              </span>
            </button>
          ) : (
            <button
              onClick={onClose}
              className="w-full py-3.5 rounded-2xl text-sm font-[Vazir-Bold] transition-all"
              style={{ backgroundColor: colors.primary, color: '#fff' }}
            >
              بستن
            </button>
          )}
        </div>
      </div>
    </div>
  );

  return createPortal(content, document.body);
}
