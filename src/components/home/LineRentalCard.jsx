// src/components/home/LineRentalCard.jsx
'use client';

import { FiMapPin } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import CollabBadge from '@/components/common/CollabBadge';
import LineRentalPriceRows from '@/components/lineRentals/LineRentalPriceRows';
import {
  toPersianDigit,
  getLineRentalCollabLabel,
} from '@/utils/numberUtils';

/**
 * کارت اجاره لاین — صفحه هوم
 */

// ═══ ایموجی بر اساس نام خدمت ═══
const getLineEmoji = (typeName = '') => {
  if (typeName.includes('ناخن')) return '💅';
  if (typeName.includes('میکاپ') || typeName.includes('گریم')) return '💄';
  if (typeName.includes('فیشیال') || typeName.includes('پوست')) return '✨';
  if (typeName.includes('لیزر')) return '⚡';
  if (typeName.includes('مو') || typeName.includes('رنگ') || typeName.includes('کراتین'))
    return '🎨';
  if (typeName.includes('مژه') || typeName.includes('ابرو')) return '👁️';
  if (typeName.includes('ماساژ')) return '💆‍♀️';
  return '🏢';
};

const formatDistance = (distance) => {
  if (distance === null || distance === undefined || distance === '') return '';

  const numericDistance = Number(distance);
  if (Number.isNaN(numericDistance)) return '';

  if (numericDistance < 1) {
    return `${toPersianDigit(Math.round(numericDistance * 1000))} متر`;
  }

  return `${toPersianDigit(numericDistance.toFixed(1))} کیلومتر`;
};

export default function LineRentalCard({ rental, onPress }) {
  const { colors } = useTheme();

  if (!rental) return null;

  const collabType = rental.collab_type || rental.collabType;
  const collabLabel = getLineRentalCollabLabel(rental);

  const businessName = rental.business_name || rental.businessName || '';
  const city = rental.city || '';
  const serviceTypeName =
    rental.service_category_name || rental.serviceCategoryName || '';
  const subServiceName = rental.sub_service_name || rental.subServiceName || '';
  const distanceText = formatDistance(rental.distance);

  return (
    <button
      onClick={() => onPress?.(rental)}
      className="
        flex-shrink-0
        w-full min-w-[270px] sm:min-w-[290px] md:min-w-0 md:w-full
        rounded-xl sm:rounded-2xl md:rounded-[20px]
        border overflow-hidden text-right transition-all
        hover:shadow-md active:scale-[0.99]
      "
      style={{
        backgroundColor: colors.cardBackground,
        borderColor: colors.border,
      }}
    >
      {/* ═══ هدر گرادیانی ═══ */}
      <div
        className="relative w-full h-[140px] sm:h-[160px] md:h-[170px] lg:h-[180px] overflow-hidden"
        style={{
          background:
            'linear-gradient(135deg, #667eea 0%, #5a67d8 50%, #764ba2 100%)',
        }}
      >
        {/* دایره‌های تزئینی */}
        <div
          className="absolute -top-6 -left-6 w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full"
          style={{ backgroundColor: 'rgba(255,255,255,0.10)' }}
        />
        <div
          className="absolute -bottom-8 -right-6 w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full"
          style={{ backgroundColor: 'rgba(255,255,255,0.07)' }}
        />
        <div
          className="absolute top-10 right-12 w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-full"
          style={{ backgroundColor: 'rgba(255,255,255,0.12)' }}
        />
        <div
          className="absolute bottom-6 left-8 w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 rounded-full"
          style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}
        />

        {/* ایموجی خدمت */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            className="text-[40px] sm:text-[48px] md:text-[52px]"
            style={{ filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.25))' }}
          >
            {getLineEmoji(serviceTypeName || subServiceName)}
          </span>
        </div>

        {/* بج نوع خدمت */}
        {(serviceTypeName || subServiceName) && (
          <div
            className="absolute top-3 left-3 px-2 sm:px-2.5 py-1 rounded-lg shadow-md"
            style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
          >
            <span className="text-[9px] sm:text-[10px] md:text-[11px] font-[Vazir-Bold] text-white">
              {serviceTypeName || subServiceName}
            </span>
          </div>
        )}

        {/* نوار شیشه‌ای پایین هدر */}
        <div
          className="absolute bottom-0 left-0 right-0 h-[32px] sm:h-[36px] md:h-[40px] flex items-center px-2.5 sm:px-3 gap-2"
          style={{
            backgroundColor: 'rgba(0,0,0,0.25)',
            backdropFilter: 'blur(8px)',
          }}
        >
          <span className="text-[10px] sm:text-[11px] md:text-xs font-[Vazir-Medium] text-white/90 truncate flex-1">
            {collabLabel}
          </span>
        </div>
      </div>

      {/* ═══ بدنه کارت ═══ */}
      <div className="p-3 sm:p-3.5 md:p-4 space-y-2 sm:space-y-2.5 md:space-y-3">
        {/* عنوان */}
        <h3
          className="text-[14px] sm:text-base md:text-lg font-[Vazir-Bold] leading-[22px] sm:leading-6 md:leading-[26px] line-clamp-2"
          style={{ color: colors.textMain }}
        >
          {rental.title}
        </h3>

        {/* نمایش جدا مبالغ — حالت B */}
        <LineRentalPriceRows rental={rental} />

        {/* بج نوع همکاری بدون تکرار مبلغ */}
        <div className="flex items-center gap-1.5">
          <CollabBadge type={collabType} variant="compact" />
        </div>

        {/* کسب‌وکار + شهر + فاصله */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <div className="flex items-center gap-1 sm:gap-1.5">
            <span className="text-[11px] sm:text-xs">🏪</span>
            <span
              className="text-[10px] sm:text-[11px] md:text-xs font-[Vazir-Medium] line-clamp-1"
              style={{ color: colors.primary }}
            >
              {businessName}
            </span>
          </div>

          {city && (
            <div className="flex items-center gap-1">
              <FiMapPin size={11} className="sm:w-3 sm:h-3" color={colors.textSecondary} />
              <span
                className="text-[9px] sm:text-[10px] md:text-[11px]"
                style={{ color: colors.textSecondary }}
              >
                {city}
              </span>
            </div>
          )}

          {distanceText && (
            <div className="flex items-center gap-1">
              <FiMapPin size={11} className="sm:w-3 sm:h-3" color="#2196F3" />
              <span
                className="text-[9px] sm:text-[10px] md:text-[11px] font-[Vazir-Bold]"
                style={{ color: '#2196F3' }}
              >
                {distanceText}
              </span>
            </div>
          )}
        </div>
      </div>
    </button>
  );
}