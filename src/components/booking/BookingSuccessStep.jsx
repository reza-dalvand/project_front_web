// src/components/booking/BookingSuccessStep.jsx
'use client';
import { FiCheck, FiCalendar, FiClock, FiCreditCard, FiShield } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import Button from '@/components/common/Button';
import { formatPrice, toPersianDigit } from '@/utils/numberUtils';
import { PERSIAN_MONTHS } from '@/utils/dateUtils';

export default function BookingSuccessStep({
  trustEnabled,
  service,
  selectedDate,
  selectedTime,
  depositAmount,
  verificationCode,
  onClose,
}) {
  const { colors } = useTheme();

  const dateStr = selectedDate
    ? `${selectedDate.jd} ${PERSIAN_MONTHS[selectedDate.jm - 1]} ${selectedDate.jy}`
    : '';

  return (
    <div className="flex flex-col items-center justify-center py-12 px-6 gap-4">
      {/* آیکون موفقیت */}
      <div
        className="relative w-[100px] h-[100px] rounded-full flex items-center justify-center mb-2"
        style={{ backgroundColor: '#43A047' }}
      >
        <FiCheck size={48} color="#fff" />
      </div>

      <span className="text-xl font-[Vazir-Bold] text-center" style={{ color: colors.textMain }}>
        رزرو با موفقیت ثبت شد!
      </span>

      <span
        className="text-[13px] font-[Vazir] text-center leading-[21px]"
        style={{ color: colors.textSecondary }}
      >
        {trustEnabled
          ? 'نوبت شما بدون نیاز به کد تایید ثبت شد. پیامک تایید نوبت ارسال می‌شود.'
          : 'کد تایید ۴ رقمی به شماره شما ارسال خواهد شد'}
      </span>

      {/* خلاصه رزرو */}
      <div
        className="w-full p-4 rounded-2xl border flex flex-col gap-3"
        style={{ borderColor: colors.border, backgroundColor: colors.background }}
      >
        {service?.name && (
          <div className="flex items-center gap-2">
            <span className="text-sm">💆‍♀️</span>
            <span className="text-xs" style={{ color: colors.textSecondary }}>
              خدمت:
            </span>
            <span className="text-sm font-[Vazir-Bold] flex-1" style={{ color: colors.textMain }}>
              {service.name}
            </span>
          </div>
        )}

        {dateStr && (
          <div className="flex items-center gap-2">
            <FiCalendar size={14} style={{ color: colors.textSecondary }} />
            <span className="text-xs" style={{ color: colors.textSecondary }}>
              تاریخ:
            </span>
            <span className="text-sm font-[Vazir-Bold]" style={{ color: colors.textMain }}>
              {dateStr}
            </span>
          </div>
        )}

        {selectedTime && (
          <div className="flex items-center gap-2">
            <FiClock size={14} style={{ color: colors.textSecondary }} />
            <span className="text-xs" style={{ color: colors.textSecondary }}>
              ساعت:
            </span>
            <span className="text-sm font-[Vazir-Bold]" style={{ color: colors.textMain }}>
                {selectedTime.displayTime ||
                selectedTime.display_time ||
                selectedTime.startTime ||
                selectedTime.start_time}
            </span>
          </div>
        )}

        {depositAmount > 0 && (
          <div className="flex items-center gap-2">
            <FiCreditCard size={14} color="#43A047" />
            <span className="text-xs" style={{ color: colors.textSecondary }}>
              بیعانه پرداختی:
            </span>
            <span className="text-sm font-[Vazir-Bold]" style={{ color: '#43A047' }}>
              {formatPrice(depositAmount)}
            </span>
          </div>
        )}

        {/* کد تایید */}
        {verificationCode && !trustEnabled && (
          <div
            className="flex items-center justify-center gap-3 p-3 rounded-xl border"
            style={{
              backgroundColor: colors.primary + '10',
              borderColor: colors.primary + '30',
            }}
          >
            <span className="text-xs" style={{ color: colors.textSecondary }}>
              کد تایید:
            </span>
            <div className="flex items-center gap-1.5" dir="ltr">
              {verificationCode.split('').map((digit, idx) => (
                <span
                  key={idx}
                  className="w-[28px] h-[32px] rounded-lg border flex items-center justify-center text-base font-[Vazir-Bold]"
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
          </div>
        )}

        {/* اعتماد */}
        {trustEnabled && (
          <div className="flex items-center gap-2">
            <FiShield size={14} style={{ color: colors.primary }} />
            <span className="text-xs" style={{ color: colors.textSecondary }}>
              وضعیت کد:
            </span>
            <span className="text-[13px] font-[Vazir-Bold]" style={{ color: colors.primary }}>
              بدون نیاز به کد تایید
            </span>
          </div>
        )}
      </div>

      <div className="w-full mt-3">
        <Button title="بازگشت به صفحه کسب‌وکار" onPress={onClose} variant="outline" fullWidth />
      </div>
    </div>
  );
}
