'use client';
import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import {
  FiX,
  FiCheck,
  FiInfo,
  FiTrendingUp,
  FiDollarSign,
  FiAlertCircle,
  FiCheckCircle,
  FiMinusCircle,
} from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import Button from './Button';
import {
  formatPrice,
  APP_FEE_TIERS,
  getCurrentFeeTier,
  toPersianDigit,
  MAX_APP_FEE,
} from '@/utils/numberUtils';
import { acquireScrollLock, releaseScrollLock } from '@/utils/scrollLock';

export default function PriceGuideModal({ visible, onClose, currentPrice }) {
  const { colors } = useTheme();
  const [mounted, setMounted] = useState(false);
  const instanceId = useRef('price-guide-modal');
  const currentTier = currentPrice > 0 ? getCurrentFeeTier(currentPrice) : null;
  const currentFee = currentPrice > 0 ? calculateCurrentFee(currentPrice) : 0;

  function calculateCurrentFee(price) {
    let fee = 0;
    if (price < 250000) fee = 7000;
    else if (price <= 500000) fee = Math.round(price * 0.04);
    else fee = Math.round(price * 0.05);
    return Math.min(fee, MAX_APP_FEE);
  }

  useEffect(() => {
    setMounted(true);
    return () => {
      setMounted(false);
      releaseScrollLock(instanceId.current);
    };
  }, []);

  useEffect(() => {
    if (!visible) return;
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [visible, onClose]);

  useEffect(() => {
    if (visible) {
      acquireScrollLock(instanceId.current);
    } else {
      releaseScrollLock(instanceId.current);
    }
    return () => {
      releaseScrollLock(instanceId.current);
    };
  }, [visible]);

  if (!mounted || !visible) return null;

  const content = (
    <div
      className="fixed inset-0 z-[9999] flex items-center md:items-center md:justify-center justify-end"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/60" />
      <div
        className="relative w-full max-w-lg md:rounded-3xl rounded-t-3xl max-h-[90vh] overflow-hidden flex flex-col"
        style={{
          backgroundColor: colors.cardBackground,
          borderWidth: 1,
          borderColor: colors.border,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-center py-3 md:hidden">
          <div className="w-10 h-1 rounded-full" style={{ backgroundColor: colors.border }} />
        </div>

        <div
          className="flex items-center justify-between px-5 py-4 border-b"
          style={{ borderColor: colors.border }}
        >
          <div className="flex items-center gap-3 flex-1">
            <div
              className="w-11 h-11 rounded-2xl flex items-center justify-center"
              style={{ backgroundColor: '#FF980015' }}
            >
              <FiDollarSign size={22} color="#FF9800" />
            </div>
            <div className="flex-1">
              <h3 className="text-base font-[Vazir-Bold]" style={{ color: colors.textMain }}>
                راهنمای کمیسیون
              </h3>
              <p
                className="text-[11px] font-[Vazir] mt-0.5"
                style={{ color: colors.textSecondary }}
              >
                سهم زیبانو از هر رزرو
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

        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* کارت توضیح */}
          <div
            className="flex items-start gap-3 p-4 rounded-2xl border"
            style={{
              backgroundColor: '#FF980008',
              borderColor: '#FF980025',
            }}
          >
            <FiInfo size={18} color="#FF9800" className="flex-shrink-0 mt-0.5" />
            <p
              className="text-xs font-[Vazir] leading-6 flex-1"
              style={{ color: colors.textSecondary }}
            >
              زیبانو برای ارائه خدماتی مانند پشتیبانی، پردازش پرداخت، مدیریت نوبت‌ها و اطلاع‌رسانی
              خودکار، کمیسیونی از مبلغ هر رزرو دریافت می‌کند.{' '}
              <span className="font-[Vazir-Bold]" style={{ color: '#FF9800' }}>
                این مبلغ از قیمت کل خدمت کسر خواهد شد.
              </span>
            </p>
          </div>

          {/* عنوان جدول */}
          <h4 className="text-[15px] font-[Vazir-Bold]" style={{ color: colors.textMain }}>
            جدول کمیسیون
          </h4>

          {/* جدول */}
          <div
            className="rounded-2xl border overflow-hidden"
            style={{
              borderColor: colors.border,
              backgroundColor: colors.background,
            }}
          >
            <div
              className="flex items-center justify-between px-4 py-3 border-b"
              style={{ borderColor: colors.border }}
            >
              <span
                className="text-[11px] font-[Vazir-Bold] flex-1"
                style={{ color: colors.textSecondary }}
              >
                بازه قیمت خدمت (تومان)
              </span>
              <span
                className="text-[11px] font-[Vazir-Bold]"
                style={{ color: colors.textSecondary }}
              >
                کمیسیون زیبانو
              </span>
            </div>

            {APP_FEE_TIERS.map((tier, index) => {
              const isCurrent =
                currentTier &&
                currentTier.min === tier.min &&
                currentTier.max === tier.max &&
                currentPrice > tier.min &&
                currentPrice <= tier.max;
              const isLast = index === APP_FEE_TIERS.length - 1;

              const feeDisplay =
                tier.type === 'fixed'
                  ? `${toPersianDigit(tier.fee.toLocaleString('en-US'))} تومان`
                  : `${toPersianDigit(tier.fee)}٪`;

              const minDisplay =
                tier.min === 0
                  ? '۰'
                  : formatPrice(tier.min).replace(' تومان', '');
              const maxDisplay = isLast
                ? 'به بالا'
                : formatPrice(tier.max).replace(' تومان', '');

              return (
                <div
                  key={`${tier.min}-${tier.max}`}
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
                    {isCurrent && <FiTrendingUp size={14} color="#4CAF50" />}
                    <span
                      className={`text-xs flex-1 ${
                        isCurrent ? 'font-[Vazir-Bold]' : 'font-[Vazir-Medium]'
                      }`}
                      style={{ color: isCurrent ? '#4CAF50' : colors.textMain }}
                    >
                      {minDisplay} تا {maxDisplay}
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
                      {feeDisplay}
                    </span>
                  </div>
                </div>
              );
            })}

            {/* ردیف سقف کمیسیون */}
            <div
              className="flex items-center justify-between px-4 py-4 border-t"
              style={{
                backgroundColor: colors.cardBackground,
                borderColor: 'rgba(0,0,0,0.05)',
              }}
            >
              <div className="flex items-center gap-2 flex-1">
                <FiAlertCircle size={14} style={{ color: '#FF9800' }} />
                <span
                  className="text-[11px] font-[Vazir-Medium] flex-1 leading-5"
                  style={{ color: colors.textMain }}
                >
                  سقف کمیسیون در هر رزرو
                </span>
              </div>
              <div
                className="px-3 py-1.5 rounded-xl"
              >
                <span
                  className="text-xs font-[Vazir-Bold]"
                  style={{ color: '#eaa718' }}
                >
                  {toPersianDigit(MAX_APP_FEE.toLocaleString('en-US'))} تومان
                </span>
              </div>
            </div>
          </div>

          {/* نمایش کمیسیون فعلی */}
          {currentPrice > 0 && currentTier && (
            <div
              className="flex items-center gap-3 p-4 rounded-2xl border-2"
              style={{
                backgroundColor: '#FF980010',
                borderColor: '#FF980040',
              }}
            >
              <FiMinusCircle size={20} color="#FF9800" className="flex-shrink-0" />
              <div className="flex-1">
                <p className="text-xs font-[Vazir-Medium]" style={{ color: colors.textMain }}>
                  کمیسیون زیبانو از خدمت شما
                </p>
                <p className="text-sm font-[Vazir-Bold] mt-1" style={{ color: '#FF9800' }}>
                  {formatPrice(currentFee)}
                </p>
                <p className="text-[10px] font-[Vazir] mt-1" style={{ color: colors.textSecondary }}>
                  سهم دریافتی شما:{' '}
                  <span className="font-[Vazir-Bold]" style={{ color: '#4CAF50' }}>
                    {formatPrice(currentPrice - currentFee)}
                  </span>
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
              <h5 className="text-sm font-[Vazir-Bold]" style={{ color: colors.textMain }}>
                نکات مهم
              </h5>
            </div>
            <div className="space-y-2">
              {[
                'کمیسیون از مبلغ کل خدمت کسر می‌شود',
                'در صورت لغو نوبت توسط شما، کل مبلغ پرداختی بیعانه به مشتری مسترد می‌شود',
                'حداکثر کمیسیون در هر رزرو ۵۰ هزار تومان است',
              ].map((tip, i) => (
                <div key={i} className="flex items-start gap-2">
                  <div
                    className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0"
                    style={{ backgroundColor: '#FF9800' }}
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

        <div className="px-5 py-4 border-t" style={{ borderColor: colors.border }}>
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