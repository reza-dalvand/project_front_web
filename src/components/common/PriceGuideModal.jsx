'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  FiX, FiCheck, FiInfo, FiTrendingUp, 
  FiDollarSign, FiAlertCircle, FiCheckCircle 
} from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import Button from './Button';
import { formatPrice, APP_FEE_TIERS, getCurrentFeeTier } from '@/utils/numberUtils';
import { toPersianDigit } from '@/utils/numberUtils';

/**
 * مدال راهنمای قیمت‌گذاری
 * @param {boolean} visible - وضعیت نمایش
 * @param {function} onClose - تابع بستن
 * @param {number} currentPrice - قیمت فعلی خدمت (برای هایلایت کردن ردیف مناسب)
 */
export default function PriceGuideModal({ visible, onClose, currentPrice }) {
  const { colors } = useTheme();
  const [mounted, setMounted] = useState(false);
  const currentTier = currentPrice > 0 ? getCurrentFeeTier(currentPrice) : null;

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // بستن با Escape
  useEffect(() => {
    if (!visible) return;
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [visible, onClose]);

  // قفل اسکرول
  useEffect(() => {
    if (visible) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [visible]);

  if (!mounted || !visible) return null;

  const content = (
    <div
      className="fixed inset-0 z-[9999] flex items-center md:items-center md:justify-center justify-end"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Modal */}
      <div
        className="relative w-full max-w-lg md:rounded-3xl rounded-t-3xl max-h-[90vh] overflow-hidden flex flex-col"
        style={{
          backgroundColor: colors.cardBackground,
          borderWidth: 1,
          borderColor: colors.border,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Handle Bar (موبایل) */}
        <div className="flex justify-center py-3 md:hidden">
          <div
            className="w-10 h-1 rounded-full"
            style={{ backgroundColor: colors.border }}
          />
        </div>

        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-4 border-b"
          style={{ borderColor: colors.border }}
        >
          <div className="flex items-center gap-3 flex-1">
            <div
              className="w-11 h-11 rounded-2xl flex items-center justify-center"
              style={{ backgroundColor: '#4CAF5015' }}
            >
              <FiDollarSign size={22} color="#4CAF50" />
            </div>
            <div className="flex-1">
              <h3
                className="text-base font-[Vazir-Bold]"
                style={{ color: colors.textMain }}
              >
                راهنمای قیمت‌گذاری
              </h3>
              <p
                className="text-[11px] font-[Vazir] mt-0.5"
                style={{ color: colors.textSecondary }}
              >
                هزینه خدمات‌رسانی زیبانو به ازای هر رزرو
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full flex items-center justify-center"
            style={{ backgroundColor: colors.background }}
          >
            <FiX size={20} style={{ color: colors.textMain }} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* کارت توضیح */}
          <div
            className="flex items-start gap-3 p-4 rounded-2xl border"
            style={{
              backgroundColor: '#2196F308',
              borderColor: '#2196F325',
            }}
          >
            <FiInfo size={18} color="#2196F3" className="flex-shrink-0 mt-0.5" />
            <p
              className="text-xs font-[Vazir] leading-6 flex-1"
              style={{ color: colors.textSecondary }}
            >
              زیبانو برای ارائه خدماتی مانند پشتیبانی، پردازش پرداخت، مدیریت نوبت‌ها و اطلاع‌رسانی خودکار، هزینه‌ای ثابت و شفاف از هر رزرو دریافت می‌کند.{' '}
              <span
                className="font-[Vazir-Bold]"
                style={{ color: '#2196F3' }}
              >
                این هزینه به قیمت خدمت اضافه و توسط مشتری پرداخت می‌شود.
              </span>
            </p>
          </div>

          {/* عنوان جدول */}
          <h4
            className="text-[15px] font-[Vazir-Bold]"
            style={{ color: colors.textMain }}
          >
            جدول هزینه خدمات‌رسانی
          </h4>

          {/* جدول */}
          <div
            className="rounded-2xl border overflow-hidden"
            style={{
              borderColor: colors.border,
              backgroundColor: colors.background,
            }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-4 py-3 border-b"
              style={{ borderColor: colors.border }}
            >
              <span
                className="text-[11px] font-[Vazir-Bold]"
                style={{ color: colors.textSecondary }}
              >
                بازه قیمت خدمت (تومان)
              </span>
              <span
                className="text-[11px] font-[Vazir-Bold]"
                style={{ color: colors.textSecondary }}
              >
                هزینه زیبانو
              </span>
            </div>

            {/* Rows */}
            {APP_FEE_TIERS.map((tier, index) => {
              const isCurrent =
                currentTier &&
                currentTier.fee === tier.fee &&
                currentPrice >= tier.min &&
                currentPrice <= tier.max;
              const isLast = index === APP_FEE_TIERS.length - 1;

              return (
                <div
                  key={tier.min}
                  className={`flex items-center justify-between px-4 py-3 ${
                    isCurrent
                      ? 'border-2 border-[#4CAF5040] bg-[#4CAF5015] rounded-xl my-1'
                      : ''
                  } ${!isLast && !isCurrent ? 'border-b' : ''}`}
                  style={{
                    borderColor: !isCurrent && !isLast ? colors.border : undefined,
                  }}
                >
                  <div className="flex items-center gap-2 flex-1">
                    {isCurrent && (
                      <FiTrendingUp size={14} color="#4CAF50" />
                    )}
                    <span
                      className={`text-xs flex-1 ${
                        isCurrent ? 'font-[Vazir-Bold]' : 'font-[Vazir-Medium]'
                      }`}
                      style={{ color: isCurrent ? '#4CAF50' : colors.textMain }}
                    >
                      {formatPrice(tier.min).replace(' تومان', '')} تا{' '}
                      {formatPrice(tier.max).replace(' تومان', '')}
                    </span>
                  </div>
                  <div
                    className="px-3 py-1.5 rounded-xl"
                    style={{
                      backgroundColor: isCurrent ? '#4CAF50' : colors.primary + '15',
                    }}
                  >
                    <span
                      className="text-xs font-[Vazir-Bold]"
                      style={{ color: isCurrent ? '#fff' : colors.primary }}
                    >
                      {formatPrice(tier.fee).replace(' تومان', '')}
                    </span>
                  </div>
                </div>
              );
            })}

            {/* ردیف "و به همین صورت..." */}
            <div
              className="flex items-center justify-between px-4 py-4 border-t"
              style={{
                backgroundColor: colors.cardBackground,
                borderColor: 'rgba(0,0,0,0.05)',
              }}
            >
              <div className="flex items-center gap-2 flex-1">
                <FiTrendingUp size={14} style={{ color: colors.primary }} />
                <span
                  className="text-[11px] font-[Vazir-Medium] flex-1 leading-5"
                  style={{ color: colors.textMain }}
                >
                  و به همین صورت به ازای عبور از هر ۵۰۰ هزار تومان، ۱۰ هزار تومان اضافه خواهد شد.
                </span>
              </div>
              <div
                className="px-3 py-1.5 rounded-xl"
                style={{ backgroundColor: colors.primary + '15' }}
              >
                <span
                  className="text-xs font-[Vazir-Bold]"
                  style={{ color: colors.primary }}
                >
                  +۱۰K
                </span>
              </div>
            </div>
          </div>

          {/* نمایش قیمت فعلی */}
          {currentPrice > 0 && currentTier && (
            <div
              className="flex items-center gap-3 p-4 rounded-2xl border-2"
              style={{
                backgroundColor: '#4CAF5010',
                borderColor: '#4CAF5040',
              }}
            >
              <FiCheckCircle size={20} color="#4CAF50" className="flex-shrink-0" />
              <div className="flex-1">
                <p
                  className="text-xs font-[Vazir-Medium]"
                  style={{ color: colors.textMain }}
                >
                  هزینه زیبانو برای خدمت شما
                </p>
                <p
                  className="text-sm font-[Vazir-Bold] mt-1"
                  style={{ color: '#4CAF50' }}
                >
                  {formatPrice(currentTier.fee)}
                </p>
              </div>
            </div>
          )}

          {/* نکات مهم */}
          <div
            className="rounded-2xl border p-4 space-y-3"
            style={{
              borderColor: colors.border,
              backgroundColor: colors.cardBackground,
            }}
          >
            <div className="flex items-center gap-2">
              <FiInfo size={18} color="#FFC107" />
              <h5
                className="text-sm font-[Vazir-Bold]"
                style={{ color: colors.textMain }}
              >
                نکات مهم
              </h5>
            </div>

            <div className="space-y-2">
              {[
                'این هزینه به صورت خودکار به قیمت خدمت اضافه می‌شود',
                'شما مبلغی که تعیین کرده‌اید را به صورت کامل دریافت می‌کنید',
                'در صورت لغو نوبت توسط شما، کل مبلغ پرداختی به مشتری مسترد می‌شود',
              ].map((tip, i) => (
                <div key={i} className="flex items-start gap-2">
                  <div
                    className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0"
                    style={{ backgroundColor: '#4CAF50' }}
                  />
                  <p
                    className="text-xs font-[Vazir] leading-5 flex-1"
                    style={{ color: colors.textSecondary }}
                  >
                    {tip}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          className="px-5 py-4 border-t"
          style={{ borderColor: colors.border }}
        >
          <Button
            title="متوجه شدم"
            onPress={onClose}
            variant="primary"
            size="lg"
            fullWidth
            icon={<FiCheck size={18} color="#fff" />}
            iconPosition="right"
          />
        </div>
      </div>
    </div>
  );

  return createPortal(content, document.body);
}