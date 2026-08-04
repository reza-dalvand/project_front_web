'use client';
import { FiLock } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import { toPersianDigit, formatPrice } from '@/utils/numberUtils';

/**
 * نوار خلاصه قیمت در پایین صفحه رزرو
 *
 * @param {number} originalPrice - قیمت اصلی
 * @param {number} finalPrice - قیمت نهایی
 * @param {number} depositAmount - مبلغ بیعانه
 * @param {number} discountPercent - درصد تخفیف
 * @param {boolean} hasDeposit - آیا بیعانه دارد
 * @param {boolean} canConfirm - آیا می‌توان تایید کرد
 * @param {function} onConfirm - تابع تایید
 */
export default function BookingSummaryBar({
  originalPrice,
  finalPrice,
  depositAmount,
  discountPercent,
  hasDeposit,
  canConfirm,
  onConfirm,
}) {
  const { colors } = useTheme();

  return (
    <div
      className="fixed bottom-0 left-0 right-0 px-5 pt-3.5 pb-6 border-t z-30"
      style={{
        backgroundColor: colors.cardBackground,
        borderTopColor: colors.border,
        boxShadow: '0 -4px 10px rgba(0,0,0,0.08)',
      }}
    >
      {/* خلاصه قیمت */}
      <div className="space-y-2 mb-2.5">
        {discountPercent > 0 && (
          <div className="flex justify-between items-center">
            <span
              className="text-xs font-[Vazir]"
              style={{ color: colors.textSecondary }}
            >
              قیمت اصلی
            </span>
            <span
              className="text-xs font-[Vazir] line-through"
              style={{ color: colors.textSecondary }}
            >
              {formatPrice(originalPrice)}
            </span>
          </div>
        )}
        <div className="flex justify-between items-center">
          <span
            className="text-xs font-[Vazir]"
            style={{ color: colors.textMain }}
          >
            {hasDeposit ? 'مبلغ کل خدمت' : 'مبلغ قابل پرداخت'}
          </span>
          <div className="flex items-center gap-1">
            <span
              className="text-[18px] font-[Vazir-Bold]"
              style={{ color: colors.primary }}
            >
              {formatPrice(hasDeposit ? finalPrice : depositAmount)}
            </span>
            <span
              className="text-[11px] font-[Vazir]"
              style={{ color: colors.textSecondary }}
            >
              تومان
            </span>
            {discountPercent > 0 && (
              <div
                className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-md mr-1"
                style={{ backgroundColor: '#4CAF5020' }}
              >
                <span className="text-[9px]">🏷️</span>
                <span
                  className="text-[10px] font-[Vazir-Bold]"
                  style={{ color: '#4CAF50' }}
                >
                  {toPersianDigit(discountPercent)}٪
                </span>
              </div>
            )}
          </div>
        </div>
        {hasDeposit && (
          <>
            <div
              className="h-px my-0.5"
              style={{ backgroundColor: colors.border }}
            />
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-1">
                <span className="text-xs">💳</span>
                <span
                  className="text-[13px] font-[Vazir-Bold]"
                  style={{ color: colors.textMain }}
                >
                  بیعانه رزرو
                </span>
              </div>
              <span
                className="text-[15px] font-[Vazir-Bold]"
                style={{ color: colors.primary }}
              >
                {formatPrice(depositAmount)}{' '}
                <span className="text-[11px] font-[Vazir]">تومان</span>
              </span>
            </div>
            <span
              className="text-[10px] font-[Vazir] text-right block"
              style={{ color: colors.textSecondary }}
            >
              مابقی مبلغ ({formatPrice(finalPrice - depositAmount)}) در محل پرداخت می‌شود
            </span>
          </>
        )}
      </div>

      {/* دکمه پرداخت */}
      <button
        onClick={onConfirm}
        disabled={!canConfirm}
        className="w-full flex items-center justify-center gap-2.5 py-4 rounded-2xl
          transition-all duration-200 disabled:opacity-50"
        style={{
          backgroundColor: canConfirm ? colors.primary : colors.border,
        }}
      >
        <FiLock size={16} color="#fff" />
        <span className="text-[15px] font-[Vazir-Bold] text-white flex-1 text-center">
          {hasDeposit ? 'پرداخت بیعانه و ثبت نوبت' : 'پرداخت و ثبت نوبت'}
        </span>
      </button>

      {/* خط اعتماد */}
      <div className="flex items-center justify-center gap-1 mt-2.5">
        <span className="text-xs">🛡️</span>
        <span
          className="text-[10px] font-[Vazir]"
          style={{ color: colors.textSecondary }}
        >
          پرداخت امن با درگاه بانکی
        </span>
      </div>
    </div>
  );
}