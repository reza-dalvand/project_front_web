// src/components/booking/BookingReviewStep.jsx
'use client';
import { FiCreditCard, FiDollarSign, FiTag, FiInfo } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import { formatPrice, toPersianDigit } from '@/utils/numberUtils';

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
      {/* هدر */}
      <div className="flex items-center gap-2.5 mb-1">
        <div
          className="w-9 h-9 rounded-[11px] flex items-center justify-center"
          style={{ backgroundColor: '#43A04715' }}
        >
          <FiCreditCard size={20} color="#43A047" />
        </div>
        <div className="flex flex-col gap-0.5 flex-1">
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
        {/* مبلغ کل */}
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-1.5">
            <FiDollarSign size={14} style={{ color: colors.textSecondary }} />
            <span className="text-xs" style={{ color: colors.textSecondary }}>
              مبلغ کل خدمت
            </span>
          </div>
          <span className="text-xs font-[Vazir-Bold]" style={{ color: colors.textMain }}>
            {formatPrice(originalPrice)}
          </span>
        </div>

        {/* تخفیف */}
        {discountPercent > 0 && (
          <>
            <div className="h-px mx-4" style={{ backgroundColor: colors.border }} />
            <div className="flex items-center justify-between px-4 py-3">
              <div className="flex items-center gap-1.5">
                <FiTag size={14} color="#4CAF50" />
                <span className="text-xs" style={{ color: colors.textSecondary }}>
                  تخفیف ({toPersianDigit(discountPercent)}٪)
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span
                  className="text-[10px] font-[Vazir-Bold] px-2 py-0.5 rounded-lg"
                  style={{ backgroundColor: '#4CAF5020', color: '#4CAF50' }}
                >
                  {toPersianDigit(discountPercent)}٪
                </span>
                <span className="text-xs font-[Vazir-Bold]" style={{ color: '#4CAF50' }}>
                  - {formatPrice(discountAmount)}
                </span>
              </div>
            </div>
          </>
        )}

        <div className="h-px mx-4" style={{ backgroundColor: colors.border }} />

        {/* قیمت نهایی */}
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-1.5">
            <FiInfo size={14} style={{ color: colors.textMain }} />
            <span className="text-[13px] font-[Vazir-Bold]" style={{ color: colors.textMain }}>
              قیمت نهایی خدمت
            </span>
          </div>
          <span className="text-[15px] font-[Vazir-Bold]" style={{ color: colors.textMain }}>
            {formatPrice(finalPrice)}
          </span>
        </div>
      </div>

      {/* بیعانه */}
      {depositAmount > 0 && (
        <div
          className="flex items-center justify-between p-3.5 rounded-2xl border"
          style={{
            backgroundColor: colors.primary + '08',
            borderColor: colors.primary + '25',
          }}
        >
          <div className="flex items-center gap-2.5 flex-1">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{ backgroundColor: colors.primary }}
            >
              <FiCreditCard size={14} color="#fff" />
            </div>
            <div>
              <span className="text-[11px] font-[Vazir]" style={{ color: colors.textSecondary }}>
                مبلغ بیعانه (پرداخت آنلاین)
              </span>
              <div className="text-[15px] font-[Vazir-Bold]" style={{ color: colors.primary }}>
                {formatPrice(depositAmount)}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* مابقی */}
      {remainingAmount > 0 && (
        <div
          className="flex items-center gap-2.5 p-3.5 rounded-2xl border"
          style={{
            backgroundColor: '#2196F308',
            borderColor: '#2196F330',
          }}
        >
          <span className="text-lg">🏪</span>
          <div>
            <span className="text-[11px] font-[Vazir]" style={{ color: colors.textSecondary }}>
              مابقی مبلغ (پرداخت در سالن)
            </span>
            <div className="text-[15px] font-[Vazir-Bold]" style={{ color: '#2196F3' }}>
              {formatPrice(remainingAmount)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
