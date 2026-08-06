'use client';
import { FiLock } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import { toPersianDigit, formatPrice } from '@/utils/numberUtils';

/**
 * نوار پرداخت در پایین صفحه رزرو
 *
 * @param {object} service - داده خدمت
 * @param {boolean} canConfirm - آیا می‌توان تایید کرد
 * @param {function} onConfirm - تابع تایید
 */
export default function BookingPaymentBar({ service, canConfirm, onConfirm }) {
  const { colors } = useTheme();

  const originalPrice = service.originalPrice || service.price || 0;
  const discountPercent = service.discount || 0;
  const finalPrice = Math.max(
    0,
    originalPrice - Math.round((originalPrice * discountPercent) / 100)
  );
  const hasDeposit = service.hasDeposit || false;
  const depositPercent = service.depositPercent || 30;
  const depositAmount = hasDeposit ? Math.round((finalPrice * depositPercent) / 100) : finalPrice;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 px-4 pt-3 pb-6 border-t z-30"
      style={{
        backgroundColor: colors.cardBackground,
        borderTopColor: colors.border,
        boxShadow: '0 -4px 10px rgba(0,0,0,0.08)',
      }}
    >
      {/* خلاصه قیمت */}
      <div className="flex justify-between items-end mb-2">
        <div className="flex flex-col gap-0.5">
          <span className="text-[11px] font-[Vazir]" style={{ color: colors.textSecondary }}>
            {hasDeposit ? 'بیعانه رزرو' : 'مبلغ قابل پرداخت'}
          </span>
          {discountPercent > 0 && (
            <span
              className="text-[10px] font-[Vazir] line-through"
              style={{ color: colors.textSecondary }}
            >
              {formatPrice(originalPrice)}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-[17px] font-[Vazir-Bold]" style={{ color: colors.primary }}>
            {formatPrice(depositAmount)}
          </span>
          {discountPercent > 0 && (
            <div
              className="flex items-center gap-0.5 px-1.5 py-0.5 rounded"
              style={{ backgroundColor: '#4CAF5020' }}
            >
              <span className="text-[9px]">🏷️</span>
              <span className="text-[9px] font-[Vazir-Bold]" style={{ color: '#4CAF50' }}>
                {toPersianDigit(discountPercent)}٪
              </span>
            </div>
          )}
        </div>
      </div>

      {/* دکمه پرداخت */}
      <button
        onClick={onConfirm}
        disabled={!canConfirm}
        className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl
          transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        style={{
          backgroundColor: canConfirm ? '#43A047' : colors.border,
        }}
      >
        <FiLock size={16} color={canConfirm ? '#fff' : colors.textSecondary} />
        <span
          className="text-sm font-[Vazir-Bold] flex-1 text-center"
          style={{ color: canConfirm ? '#fff' : colors.textSecondary }}
        >
          {hasDeposit ? 'پرداخت بیعانه و ثبت نوبت' : 'پرداخت و ثبت نوبت'}
        </span>
      </button>

      {/* خط اعتماد */}
      <div className="flex items-center justify-center gap-1 mt-2">
        <span className="text-[9px]">🛡️</span>
        <span className="text-[9px] font-[Vazir]" style={{ color: colors.textSecondary }}>
          پرداخت امن · امکان لغو نوبت در صورت رزرو وجود ندارد
        </span>
      </div>
    </div>
  );
}
