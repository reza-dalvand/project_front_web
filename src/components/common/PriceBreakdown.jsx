'use client';
import { FiTag, FiTrendingUp, FiCreditCard, FiDollarSign, FiBox } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import Card from './Card';
import Divider from './Divider';
import { toPersianDigit, formatPrice } from '@/utils/numberUtils';

export default function PriceBreakdown({
  originalPrice = 0,
  discountPercent = 0,
  finalPrice,
  hasDeposit = false,
  depositPercent = 30,
  depositAmount,
  showRemaining = true,
  variant = 'card',
}) {
  const { colors } = useTheme();

  // محاسبات
  const discountAmount = Math.round((originalPrice * discountPercent) / 100);
  const calculatedFinal = Math.max(0, originalPrice - discountAmount);
  const actualFinal = finalPrice ?? calculatedFinal;
  const calculatedDeposit = hasDeposit
    ? Math.round((actualFinal * depositPercent) / 100)
    : actualFinal;
  const actualDeposit = depositAmount ?? calculatedDeposit;
  const remaining = actualFinal - actualDeposit;

  // ═══════ حالت inline (فشرده) ═══════
  if (variant === 'inline') {
    return (
      <div className="flex flex-col gap-0.5">
        <div className="flex items-center gap-1.5">
          {discountPercent > 0 && (
            <span
              className="text-[11px] font-[Vazir] line-through"
              style={{ color: colors.textSecondary }}
            >
              {formatPrice(originalPrice)}
            </span>
          )}
          <span
            className="text-[15px] font-[Vazir-Bold]"
            style={{ color: colors.primary }}
          >
            {formatPrice(actualDeposit)}
          </span>
          {discountPercent > 0 && (
            <div
              className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-[6px]"
              style={{ backgroundColor: '#4CAF5020' }}
            >
              <FiTag size={10} color="#4CAF50" />
              <span className="text-[10px] font-[Vazir-Bold]" style={{ color: '#4CAF50' }}>
                {toPersianDigit(discountPercent)}٪
              </span>
            </div>
          )}
        </div>
        {hasDeposit && showRemaining && remaining > 0 && (
          <span
            className="text-[10px] font-[Vazir]"
            style={{ color: colors.textSecondary }}
          >
            + {formatPrice(remaining)} در سالن
          </span>
        )}
      </div>
    );
  }

  // ═══════ حالت detailed (همراه قوانین) ═══════
  if (variant === 'detailed') {
    return (
      <Card variant="default" padding={16} radius={18}>
        {/* هدر */}
        <div className="flex items-center gap-2 mb-1">
          <div
            className="w-9 h-9 rounded-[11px] flex items-center justify-center"
            style={{ backgroundColor: '#43A04715' }}
          >
            <FiCreditCard size={20} color="#43A047" />
          </div>
          <span
            className="text-[15px] font-[Vazir-Bold]"
            style={{ color: colors.textMain }}
          >
            خلاصه پرداخت
          </span>
        </div>

        {/* قیمت اصلی */}
        <div className="flex justify-between items-center py-0.5">
          <div className="flex items-center gap-1.5">
            <FiDollarSign size={14} style={{ color: colors.textSecondary }} />
            <span className="text-[12.5px] font-[Vazir]" style={{ color: colors.textSecondary }}>
              قیمت اصلی خدمت
            </span>
          </div>
          <span className="text-[13px] font-[Vazir-Bold]" style={{ color: colors.textMain }}>
            {formatPrice(originalPrice)}
          </span>
        </div>

        {/* تخفیف */}
        {discountPercent > 0 && (
          <div className="flex justify-between items-center py-0.5">
            <div className="flex items-center gap-1.5">
              <FiTag size={14} color="#4CAF50" />
              <span className="text-[12.5px] font-[Vazir]" style={{ color: colors.textSecondary }}>
                تخفیف ({toPersianDigit(discountPercent)}٪)
              </span>
            </div>
            <span className="text-[13px] font-[Vazir-Bold]" style={{ color: '#4CAF50' }}>
              - {formatPrice(discountAmount)}
            </span>
          </div>
        )}

        <Divider spacing={8} />

        {/* قیمت نهایی */}
        <div className="flex justify-between items-center py-0.5">
          <div className="flex items-center gap-1.5">
            <FiTrendingUp size={14} style={{ color: colors.textMain }} />
            <span className="text-[13px] font-[Vazir-Bold]" style={{ color: colors.textMain }}>
              قیمت نهایی خدمت
            </span>
          </div>
          <span className="text-[15px] font-[Vazir-Bold]" style={{ color: colors.textMain }}>
            {formatPrice(actualFinal)}
          </span>
        </div>

        {/* بیعانه */}
        {hasDeposit && (
          <div
            className="flex items-center justify-between p-3 rounded-[14px] border mt-1"
            style={{
              backgroundColor: colors.primary + '10',
              borderColor: colors.primary + '35',
            }}
          >
            <div className="flex items-center gap-2.5 flex-1">
              <div
                className="w-[34px] h-[34px] rounded-full flex items-center justify-center"
                style={{ backgroundColor: colors.primary }}
              >
                <FiCreditCard size={14} color="#fff" />
              </div>
              <div>
                <span
                  className="text-[11px] font-[Vazir]"
                  style={{ color: colors.textSecondary }}
                >
                  مبلغ بیعانه (پرداخت آنلاین)
                </span>
                <div
                  className="text-[15px] font-[Vazir-Bold] mt-0.5"
                  style={{ color: colors.primary }}
                >
                  {formatPrice(actualDeposit)}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* مابقی مبلغ */}
        {hasDeposit && remaining > 0 && (
          <div
            className="flex items-center gap-2.5 p-3 rounded-[14px] border"
            style={{
              backgroundColor: '#2196F308',
              borderColor: '#2196F330',
            }}
          >
            <FiBox size={18} color="#2196F3" />
            <div>
              <span
                className="text-[11px] font-[Vazir]"
                style={{ color: colors.textSecondary }}
              >
                مابقی مبلغ (پرداخت در سالن)
              </span>
              <div
                className="text-[15px] font-[Vazir-Bold] mt-0.5"
                style={{ color: '#2196F3' }}
              >
                {formatPrice(remaining)}
              </div>
            </div>
          </div>
        )}
      </Card>
    );
  }

  // ═══════ حالت card (پیش‌فرض) ═══════
  return (
    <Card variant="elevated" padding={14} radius={16}>
      {discountPercent > 0 && (
        <div className="flex justify-between items-center">
          <span className="text-xs font-[Vazir]" style={{ color: colors.textSecondary }}>
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
        <span className="text-[13px] font-[Vazir-Bold]" style={{ color: colors.textMain }}>
          {hasDeposit ? 'مبلغ کل خدمت' : 'مبلغ قابل پرداخت'}
        </span>
        <div className="flex items-center gap-1">
          <span className="text-[18px] font-[Vazir-Bold]" style={{ color: colors.primary }}>
            {formatPrice(hasDeposit ? actualFinal : actualDeposit)}
          </span>
          <span className="text-[11px] font-[Vazir]" style={{ color: colors.textSecondary }}>
            تومان
          </span>
          {discountPercent > 0 && (
            <div
              className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-[6px] mr-1"
              style={{ backgroundColor: '#4CAF5020' }}
            >
              <FiTag size={10} color="#4CAF50" />
              <span className="text-[10px] font-[Vazir-Bold]" style={{ color: '#4CAF50' }}>
                {toPersianDigit(discountPercent)}٪
              </span>
            </div>
          )}
        </div>
      </div>
      {hasDeposit && (
        <>
          <Divider spacing={6} />
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-1">
              <FiCreditCard size={13} style={{ color: colors.primary }} />
              <span className="text-[13px] font-[Vazir-Bold]" style={{ color: colors.textMain }}>
                بیعانه رزرو
              </span>
            </div>
            <span className="text-[15px] font-[Vazir-Bold]" style={{ color: colors.primary }}>
              {formatPrice(actualDeposit)}{' '}
              <span className="text-[11px] font-[Vazir]">تومان</span>
            </span>
          </div>
          {showRemaining && remaining > 0 && (
            <span
              className="text-[10px] font-[Vazir] text-right block"
              style={{ color: colors.textSecondary }}
            >
              مابقی ({formatPrice(remaining)}) در محل پرداخت می‌شود
            </span>
          )}
        </>
      )}
    </Card>
  );
}