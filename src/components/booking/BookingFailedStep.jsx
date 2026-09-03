// src/components/booking/BookingFailedStep.jsx
'use client';
import { FiX, FiCalendar, FiClock, FiCreditCard } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import Button from '@/components/common/Button';
import { formatPrice } from '@/utils/numberUtils';
import { PERSIAN_MONTHS } from '@/utils/dateUtils';

/**
 * @param {object}   service        - خدمت انتخاب‌شده
 * @param {object}   selectedDate   - تاریخ انتخاب‌شده { jy, jm, jd }
 * @param {object}   selectedTime   - ساعت انتخاب‌شده
 * @param {number}   depositAmount  - مبلغ بیعانه
 * @param {string}   errorMessage   - پیام خطای درگاه (رزرو برای استفاده‌های احتمالی آینده)
 * @param {string}   trackingCode   - کد پیگیری (اختیاری)
 * @param {function} onRetry        - تلاش مجدد (رزرو برای استفاده‌های احتمالی آینده)
 * @param {function} onClose        - بستن مدال
 */
export default function BookingFailedStep({
  service,
  selectedDate,
  selectedTime,
  depositAmount,
  errorMessage,
  trackingCode,
  onRetry,
  onClose,
}) {
  const { colors } = useTheme();

  const dateStr = selectedDate
    ? `${selectedDate.jd} ${PERSIAN_MONTHS[selectedDate.jm - 1]} ${selectedDate.jy}`
    : '';

  return (
    <div className="flex flex-col items-center justify-center py-10 px-5 gap-4">
      {/* ═══ آیکون ناموفق ═══ */}
      <div
        className="relative w-[90px] h-[90px] rounded-full flex items-center justify-center mb-1"
        style={{ backgroundColor: '#E53935' }}
      >
        <FiX size={44} color="#fff" />
        {/* دایره تزئینی */}
        <div
          className="absolute -inset-2 rounded-full border-2 border-dashed animate-pulse"
          style={{ borderColor: '#E5393540' }}
        />
      </div>

      {/* ═══ عنوان ═══ */}
      <div className="text-center">
        <h3 className="text-lg font-[Vazir-Bold] mb-1" style={{ color: colors.textMain }}>
          پرداخت ناموفق
        </h3>
      </div>

      {/* ═══ خلاصه رزرو ═══ */}
      <div
        className="w-full p-4 rounded-2xl border space-y-3"
        style={{ borderColor: colors.border, backgroundColor: colors.background }}
      >
        {service?.name && (
          <div className="flex items-center gap-2.5">
            <span className="text-sm">💆‍♀️</span>
            <span className="text-xs" style={{ color: colors.textSecondary }}>
              خدمت:
            </span>
            <span
              className="text-xs font-[Vazir-Bold] flex-1 text-left truncate"
              style={{ color: colors.textMain }}
            >
              {service.name}
            </span>
          </div>
        )}
        {dateStr && (
          <div className="flex items-center gap-2.5">
            <FiCalendar size={13} style={{ color: colors.textSecondary }} />
            <span className="text-xs" style={{ color: colors.textSecondary }}>
              تاریخ:
            </span>
            <span
              className="text-xs font-[Vazir-Bold] flex-1 text-left"
              style={{ color: colors.textMain }}
            >
              {dateStr}
            </span>
          </div>
        )}
        {selectedTime && (
          <div className="flex items-center gap-2.5">
            <FiClock size={13} style={{ color: colors.textSecondary }} />
            <span className="text-xs" style={{ color: colors.textSecondary }}>
              ساعت:
            </span>
            <span
              className="text-xs font-[Vazir-Bold] flex-1 text-left"
              style={{ color: colors.textMain }}
            >
                {selectedTime.displayTime ||
                selectedTime.display_time ||
                selectedTime.startTime ||
                selectedTime.start_time}
            </span>
          </div>
        )}
        {depositAmount > 0 && (
          <div className="flex items-center gap-2.5">
            <FiCreditCard size={13} style={{ color: colors.textSecondary }} />
            <span className="text-xs" style={{ color: colors.textSecondary }}>
              بیعانه:
            </span>
            <span
              className="text-xs font-[Vazir-Bold] flex-1 text-left"
              style={{ color: '#E53935' }}
            >
              {formatPrice(depositAmount)}
            </span>
          </div>
        )}
      </div>

      {/* ═══ کد پیگیری (در صورت وجود) ═══ */}
      {trackingCode && (
        <div
          className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl border"
          style={{ borderColor: colors.border }}
        >
          <span className="text-[11px]" style={{ color: colors.textSecondary }}>
            کد پیگیری تراکنش:
          </span>
          <span
            className="text-[11px] font-[Vazir-Bold]"
            style={{ color: colors.textMain, direction: 'ltr' }}
          >
            {trackingCode}
          </span>
        </div>
      )}

      {/* ═══ راهنما ═══ */}
      <div
        className="w-full flex items-start gap-2 p-3 rounded-xl border"
        style={{ backgroundColor: '#FF980008', borderColor: '#FF980025' }}
      >
        <span className="text-sm flex-shrink-0">💡</span>
        <p
          className="text-[11px] font-[Vazir] leading-[18px]"
          style={{ color: colors.textSecondary }}
        >
          در صورت کسر وجه از حساب شما، مبلغ طی ۴۸ ساعت کاری به حساب برگردانده می‌شود.
        </p>
      </div>

      {/* ═══ دکمه‌ها ═══ */}
      <div className="w-full flex flex-col gap-2.5 mt-2">
        <Button
          title="بازگشت به صفحه کسب‌وکار"
          onPress={onClose}
          variant="outline"
          size="lg"
          fullWidth
        />
      </div>
    </div>
  );
}
