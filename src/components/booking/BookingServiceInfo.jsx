'use client';
import { useState } from 'react';
import { FiInfo, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import Card from '@/components/common/Card';
import ServiceTypeIcon from '@/components/manageBusiness/services/ServiceTypeIcon';
import { toPersianDigit, formatPrice } from '@/utils/numberUtils';

/**
 * کارت اطلاعات خدمت در صفحه رزرو
 *
 * @param {object} service - داده خدمت
 */
export default function BookingServiceInfo({ service }) {
  const { colors } = useTheme();
  const [showDescription, setShowDescription] = useState(false);

  const originalPrice = service.originalPrice || service.price || 0;
  const discountPercent = service.discount || 0;
  const discountAmount = Math.round((originalPrice * discountPercent) / 100);
  const finalPrice = Math.max(0, originalPrice - discountAmount);
  const hasDeposit = service.hasDeposit || false;
  const depositPercent = service.depositPercent || 30;
  const depositAmount = hasDeposit
    ? Math.round((finalPrice * depositPercent) / 100)
    : finalPrice;
  const remainingAmount = finalPrice - depositAmount;

  return (
    <Card variant="default" padding={0} radius={18} className="overflow-hidden">
      {/* هدر خدمت */}
      <div className="flex items-center gap-3 p-4">
        <ServiceTypeIcon typeId={service.typeId} size={52} />
        <div className="flex flex-col gap-1 flex-1">
          <h3
            className="text-base font-[Vazir-Bold] leading-[22px] line-clamp-2"
            style={{ color: colors.textMain }}
          >
            {service.name}
          </h3>
          <span
            className="text-xs font-[Vazir]"
            style={{ color: colors.textSecondary }}
          >
            {service.businessName || 'کسب‌وکار'}
          </span>
        </div>
      </div>

      {/* ردیف قیمت */}
      <div
        className="p-4 pt-3 border-t space-y-2"
        style={{ borderColor: colors.border }}
      >
        {discountPercent > 0 && (
          <div className="flex justify-between items-center">
            <span
              className="text-[13px] font-[Vazir]"
              style={{ color: colors.textSecondary }}
            >
              قیمت اصلی
            </span>
            <span
              className="text-[13px] font-[Vazir] line-through"
              style={{ color: colors.textSecondary }}
            >
              {formatPrice(originalPrice)}
            </span>
          </div>
        )}
        <div className="flex justify-between items-center">
          <span
            className="text-[13px] font-[Vazir]"
            style={{ color: colors.textMain }}
          >
            قیمت نهایی
          </span>
          <div className="flex items-center gap-2">
            <span
              className="text-[17px] font-[Vazir-Bold]"
              style={{ color: colors.primary }}
            >
              {formatPrice(finalPrice)}
            </span>
            {discountPercent > 0 && (
              <div
                className="flex items-center gap-1 px-2 py-1 rounded-lg shadow-sm"
                style={{ backgroundColor: '#E53935' }}
              >
                <span className="text-[10px]">🏷️</span>
                <span className="text-[11px] font-[Vazir-Bold] text-white">
                  {toPersianDigit(discountPercent)}٪
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* بخش بیعانه */}
      {hasDeposit && (
        <div
          className="p-4 border-t space-y-2.5"
          style={{ borderColor: colors.border }}
        >
          {/* بیعانه قابل پرداخت */}
          <div
            className="flex items-center justify-between p-3 rounded-xl border"
            style={{
              backgroundColor: colors.primary + '08',
              borderColor: colors.primary + '30',
            }}
          >
            <div className="flex items-center gap-2.5 flex-1">
              <div
                className="w-[38px] h-[38px] rounded-full flex items-center justify-center"
                style={{ backgroundColor: colors.primary }}
              >
                <span className="text-white text-sm">💰</span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span
                  className="text-xs font-[Vazir]"
                  style={{ color: colors.textSecondary }}
                >
                  مبلغ قابل پرداخت (بیعانه)
                </span>
                <span
                  className="text-base font-[Vazir-Bold]"
                  style={{ color: colors.primary }}
                >
                  {formatPrice(depositAmount)}
                </span>
              </div>
            </div>
          </div>

          {/* باقیمانده در محل */}
          {remainingAmount > 0 && (
            <div className="flex items-center gap-1.5 py-1">
              <span className="text-xs">🏪</span>
              <span
                className="text-xs font-[Vazir] flex-1"
                style={{ color: colors.textSecondary }}
              >
                باقیمانده در محل:
              </span>
              <span
                className="text-[13px] font-[Vazir-Bold]"
                style={{ color: '#2196F3' }}
              >
                {formatPrice(remainingAmount)}
              </span>
            </div>
          )}

          {/* نکته */}
          <div
            className="flex items-start gap-1.5 p-2.5 rounded-lg border"
            style={{
              backgroundColor: colors.background,
              borderColor: colors.border,
            }}
          >
            <FiInfo size={13} style={{ color: colors.textSecondary, flexShrink: 0 }} />
            <span
              className="text-[11px] font-[Vazir] leading-[18px] flex-1"
              style={{ color: colors.textSecondary }}
            >
              پس از پرداخت بیعانه، نوبت شما تایید و رزرو می‌شود. باقیمانده
              مبلغ پس از انجام خدمت در سالن پرداخت می‌شود.
            </span>
          </div>
        </div>
      )}

      {/* توضیحات خدمت */}
      {service.description && (
        <div className="border-t" style={{ borderColor: colors.border }}>
          <button
            onClick={() => setShowDescription(!showDescription)}
            className="flex items-center gap-2 py-3 px-4 w-full"
          >
            <FiInfo size={16} style={{ color: colors.primary }} />
            <span
              className="text-[13px] font-[Vazir-Bold] flex-1 text-right"
              style={{ color: colors.primary }}
            >
              توضیحات خدمت
            </span>
            {showDescription ? (
              <FiChevronUp size={20} style={{ color: colors.primary }} />
            ) : (
              <FiChevronDown size={20} style={{ color: colors.primary }} />
            )}
          </button>
          {showDescription && (
            <div
              className="mx-4 mb-4 p-3 rounded-xl"
              style={{ backgroundColor: colors.background }}
            >
              <p
                className="text-xs font-[Vazir] leading-[21px] text-justify"
                style={{ color: colors.textSecondary }}
              >
                {service.description}
              </p>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}