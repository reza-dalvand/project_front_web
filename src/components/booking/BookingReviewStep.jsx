// src/components/booking/BookingReviewStep.jsx
'use client';
import { FiCreditCard, FiDollarSign, FiTag, FiInfo, FiShield } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import RulesCard from './RulesCard';
import { toPersianDigit, formatPrice } from '@/utils/numberUtils';

/**
 * استپ بررسی: خلاصه مالی + قوانین
 *
 * @param {number} originalPrice
 * @param {number} discountPercent
 * @param {number} discountAmount
 * @param {number} finalPrice
 * @param {number} depositPercent
 * @param {number} depositAmount
 * @param {number} remainingAmount
 */
export default function BookingReviewStep({
  originalPrice,
  discountPercent,
  discountAmount,
  finalPrice,
  depositPercent,
  depositAmount,
  remainingAmount,
}) {
  const { colors } = useTheme();

  return (
    <div className="flex flex-col gap-3.5">
      {/* ═══ بخش خلاصه مالی ═══ */}
      <div className="flex items-center gap-2.5 mb-1">
        <div
          className="w-9 h-9 rounded-[11px] flex items-center justify-center"
          style={{ backgroundColor: '#43A04715' }}
        >
          <FiCreditCard size={20} color="#43A047" />
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-[15px] font-[Vazir-Bold]" style={{ color: colors.textMain }}>
            خلاصه پرداخت
          </span>
          <span className="text-[11px] font-[Vazir]" style={{ color: colors.textSecondary }}>
            فقط بیعانه را الان پرداخت کنید
          </span>
        </div>
      </div>

      {/* کارت قیمت */}
      <div
        className="rounded-2xl border overflow-hidden"
        style={{ borderColor: colors.border, backgroundColor: colors.cardBackground }}
      >
        {/* ردیف ۱: مبلغ کل */}
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <FiDollarSign size={16} style={{ color: colors.textSecondary }} />
            <span className="text-[13px] font-[Vazir]" style={{ color: colors.textSecondary }}>
              مبلغ کل خدمت
            </span>
          </div>
          <span className="text-[14px] font-[Vazir-Bold]" style={{ color: colors.textMain }}>
            {formatPrice(originalPrice)}
          </span>
        </div>
        <div className="h-px mx-4" style={{ backgroundColor: colors.border }} />

        {/* ردیف ۲: تخفیف */}
        {discountPercent > 0 && (
          <>
            <div className="flex items-center justify-between px-4 py-3">
              <div className="flex items-center gap-2">
                <FiTag size={16} color="#4CAF50" />
                <span className="text-[13px] font-[Vazir]" style={{ color: colors.textSecondary }}>
                  تخفیف ({toPersianDigit(discountPercent)}٪)
                </span>
              </div>
              <span className="text-[14px] font-[Vazir-Bold]" style={{ color: '#4CAF50' }}>
                - {formatPrice(discountAmount)}
              </span>
            </div>
            <div className="h-px mx-4" style={{ backgroundColor: colors.border }} />
          </>
        )}

        {/* ردیف ۳: قیمت نهایی */}
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <FiInfo size={16} style={{ color: colors.textMain }} />
            <span className="text-[13px] font-[Vazir-Bold]" style={{ color: colors.textMain }}>
              قیمت نهایی خدمت
            </span>
          </div>
          <span className="text-[15px] font-[Vazir-Bold]" style={{ color: colors.textMain }}>
            {formatPrice(finalPrice)}
          </span>
        </div>
        <div className="h-px mx-4" style={{ backgroundColor: colors.border }} />

        {/* ═══ بخش بیعانه (هایلایت شده) ═══ */}
        <div
          className="flex items-center justify-between px-4 py-4"
          style={{ backgroundColor: colors.primary + '08' }}
        >
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{ backgroundColor: colors.primary }}
            >
              <FiCreditCard size={14} color="#fff" />
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-[13px] font-[Vazir-Bold]" style={{ color: colors.primary }}>
                مبلغ بیعانه (پرداخت آنلاین)
              </span>
              <span className="text-[10px] font-[Vazir]" style={{ color: colors.textSecondary }}>
                {toPersianDigit(depositPercent)}٪ از قیمت نهایی
              </span>
            </div>
          </div>
          <span className="text-[16px] font-[Vazir-Bold]" style={{ color: colors.primary }}>
            {formatPrice(depositAmount)}
          </span>
        </div>

        {/* ردیف ۴: مابقی مبلغ */}
        {remainingAmount > 0 && (
          <>
            <div className="h-px mx-4" style={{ backgroundColor: colors.border }} />
            <div className="flex items-center justify-between px-4 py-3">
              <div className="flex items-center gap-2">
                <span className="text-[12px]">🏪</span>
                <span className="text-[12px] font-[Vazir]" style={{ color: colors.textSecondary }}>
                  مابقی (پرداخت در سالن)
                </span>
              </div>
              <span className="text-[13px] font-[Vazir-Bold]" style={{ color: '#2196F3' }}>
                {formatPrice(remainingAmount)}
              </span>
            </div>
          </>
        )}
      </div>

      {/* پیام مهم: فقط بیعانه پرداخت می‌شود */}
      <div
        className="flex items-start gap-2.5 p-3.5 rounded-xl border"
        style={{
          backgroundColor: '#43A04708',
          borderColor: '#43A04730',
        }}
      >
        <FiInfo size={16} color="#43A047" className="flex-shrink-0 mt-0.5" />
        <p
          className="text-[12px] font-[Vazir] leading-[20px] flex-1"
          style={{ color: colors.textSecondary }}
        >
          شما الان فقط{' '}
          <span className="font-[Vazir-Bold]" style={{ color: '#43A047' }}>
            بیعانه ({formatPrice(depositAmount)})
          </span>{' '}
          را پرداخت می‌کنید. مابقی مبلغ پس از انجام خدمت در سالن دریافت می‌شود.
        </p>
      </div>

      {/* ═══ بخش قوانین ═══ */}
      <div className="flex items-center gap-2.5 mt-3 mb-1"></div>
      <RulesCard colors={colors} />
    </div>
  );
}
