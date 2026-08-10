// src/components/booking/BookingSuccessStep.jsx
'use client';
import { FiCheck, FiInfo, FiCalendar, FiClock, FiCreditCard, FiShield } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import Button from '@/components/common/Button';
import { toPersianDigit, formatPrice } from '@/utils/numberUtils';
import { PERSIAN_MONTHS } from '@/utils/dateUtils';

/**
 * استپ موفقیت رزرو
 *
 * @param {boolean} trustEnabled
 * @param {object}  service
 * @param {object}  selectedDate
 * @param {object}  selectedTime
 * @param {number}  depositAmount
 * @param {function} onClose
 */
export default function BookingSuccessStep({
  trustEnabled,
  service,
  selectedDate,
  selectedTime,
  depositAmount,
  onClose,
}) {
  const { colors } = useTheme();

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
        className="w-full p-4 rounded-2xl border flex flex-col gap-2.5 mt-2"
        style={{ backgroundColor: colors.cardBackground, borderColor: colors.border }}
      >
        <div className="flex items-center gap-2">
          <FiInfo size={16} style={{ color: colors.textSecondary }} />
          <span
            className="text-xs font-[Vazir] min-w-[90px]"
            style={{ color: colors.textSecondary }}
          >
            خدمت:
          </span>
          <span className="text-[13px] font-[Vazir-Bold] flex-1" style={{ color: colors.textMain }}>
            {service?.name || ''}
          </span>
        </div>

        {selectedDate && (
          <div className="flex items-center gap-2">
            <FiCalendar size={16} style={{ color: colors.textSecondary }} />
            <span
              className="text-xs font-[Vazir] min-w-[90px]"
              style={{ color: colors.textSecondary }}
            >
              تاریخ:
            </span>
            <span
              className="text-[13px] font-[Vazir-Bold] flex-1"
              style={{ color: colors.textMain }}
            >
              {toPersianDigit(selectedDate.jd)} {PERSIAN_MONTHS[selectedDate.jm - 1]}
            </span>
          </div>
        )}

        {selectedTime && (
          <div className="flex items-center gap-2">
            <FiClock size={16} style={{ color: colors.textSecondary }} />
            <span
              className="text-xs font-[Vazir] min-w-[90px]"
              style={{ color: colors.textSecondary }}
            >
              ساعت:
            </span>
            <span
              className="text-[13px] font-[Vazir-Bold] flex-1"
              style={{ color: colors.textMain }}
            >
              {selectedTime.time}
            </span>
          </div>
        )}

        {/* مبلغ پرداختی = بیعانه */}
        <div className="flex items-center gap-2">
          <FiCreditCard size={16} color="#43A047" />
          <span
            className="text-xs font-[Vazir] min-w-[90px]"
            style={{ color: colors.textSecondary }}
          >
            بیعانه پرداختی:
          </span>
          <span className="text-[13px] font-[Vazir-Bold] flex-1" style={{ color: '#43A047' }}>
            {formatPrice(depositAmount)}
          </span>
        </div>

        {/* نمایش وضعیت اعتماد در خلاصه */}
        {trustEnabled && (
          <div className="flex items-center gap-2">
            <FiShield size={16} style={{ color: colors.primary }} />
            <span
              className="text-xs font-[Vazir] min-w-[90px]"
              style={{ color: colors.textSecondary }}
            >
              وضعیت کد:
            </span>
            <span
              className="text-[13px] font-[Vazir-Bold] flex-1"
              style={{ color: colors.primary }}
            >
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
