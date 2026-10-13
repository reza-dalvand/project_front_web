// src/components/lineRentals/LineRentalCard.jsx
'use client';

import { FiMapPin, FiChevronLeft } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import CollabBadge from '@/components/common/CollabBadge';
import { toPersianDigit } from '@/utils/numberUtils';

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

const getPriceText = (collabType, priceDisplay) => {
  const safePrice = priceDisplay || '';

  if (collabType === 'percent') {
    return safePrice ? `درصدی ${safePrice}` : 'همکاری درصدی';
  }

  if (collabType === 'fixed') {
    return safePrice ? `اجاره ثابت ${safePrice}` : 'اجاره ثابت';
  }

  return safePrice ? `ساعتی ${safePrice}` : 'همکاری ساعتی';
};

export default function LineRentalCard({ rental, onPress }) {
  const { colors } = useTheme();

  const collabType = rental.collab_type || rental.collabType;
  const businessName = rental.business_name || rental.businessName || '';
  const city = rental.city || '';
  const serviceTypeName =
    rental.service_category_name || rental.serviceTypeName || 'لاین زیبایی';
  const priceDisplay = rental.priceDisplay || '';
  const priceText = getPriceText(collabType, priceDisplay);
  const distanceText = formatDistance(rental.distance);

  return (
    <button
      onClick={() => onPress?.(rental)}
      className="group relative w-full overflow-hidden rounded-[26px] border text-right transition-all duration-300 hover:-translate-y-0.5 active:scale-[0.99]"
      style={{
        backgroundColor: colors.cardBackground,
        borderColor: colors.border,
        boxShadow: '0 14px 34px rgba(124,58,237,0.10)',
      }}
    >
      {/* ═══ هدر گرادیانی ═══ */}
      <div
        className="relative h-[168px] w-full overflow-hidden"
        style={{
          background:
            'linear-gradient(135deg, #C4B5FD 0%, #8B5CF6 45%, #5B21B6 100%)',
        }}
      >
        {/* نورهای تزئینی */}
        <div
          className="absolute -left-10 -top-10 h-36 w-36 rounded-full blur-2xl"
          style={{ backgroundColor: 'rgba(255,255,255,0.20)' }}
        />
        <div
          className="absolute -bottom-12 -right-8 h-40 w-40 rounded-full blur-2xl"
          style={{ backgroundColor: 'rgba(255,255,255,0.13)' }}
        />
        <div
          className="absolute left-10 top-10 h-16 w-16 rounded-full blur-xl"
          style={{ backgroundColor: 'rgba(255,255,255,0.12)' }}
        />

        {/* مدال مرکزی */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="flex h-20 w-20 items-center justify-center rounded-full border shadow-inner backdrop-blur-md"
            style={{
              backgroundColor: 'rgba(255,255,255,0.14)',
              borderColor: 'rgba(255,255,255,0.24)',
            }}
          >
            <span
              className="text-[40px]"
              style={{ filter: 'drop-shadow(0 6px 14px rgba(0,0,0,0.22))' }}
            >
              {getLineEmoji(serviceTypeName)}
            </span>
          </div>
        </div>

        {/* بج نوع خدمت */}
        <div
          className="absolute left-3 top-3 rounded-full px-2.5 py-1 text-[10px] font-[Vazir-Bold] text-white backdrop-blur-md"
          style={{ backgroundColor: 'rgba(255,255,255,0.18)' }}
        >
          {serviceTypeName}
        </div>

        {/* نوار پایین */}
        <div
          className="absolute bottom-0 left-0 right-0 flex h-[42px] items-center gap-2 px-3 backdrop-blur-md"
          style={{ backgroundColor: 'rgba(0,0,0,0.22)' }}
        >
          <span className="flex-1 truncate text-[12px] font-[Vazir-Medium] text-white/90">
            {priceText}
          </span>
        </div>
      </div>

      {/* ═══ بدنه کارت ═══ */}
      <div className="space-y-3 p-4">
        <h3
          className="line-clamp-2 text-base font-[Vazir-Bold] leading-6"
          style={{ color: colors.textMain }}
        >
          {rental.title}
        </h3>

        <CollabBadge
          type={collabType}
          priceDisplay={priceDisplay}
          variant="compact"
        />

        <div className="flex flex-wrap items-center gap-2">
          {businessName && (
            <span
              className="inline-flex max-w-[170px] items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-[Vazir-Medium]"
              style={{
                backgroundColor: 'rgba(139,92,246,0.12)',
                color: '#8B5CF6',
              }}
            >
              <span className="text-[11px] leading-none">🏪</span>
              <span className="truncate">{businessName}</span>
            </span>
          )}

          {city && (
            <span
              className="inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[10px] font-[Vazir-Medium]"
              style={{
                backgroundColor: colors.background,
                borderColor: colors.border,
                color: colors.textSecondary,
              }}
            >
              <FiMapPin size={10} />
              <span className="max-w-[90px] truncate">{city}</span>
            </span>
          )}

          {distanceText && (
            <span
              className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-[Vazir-Bold]"
              style={{
                backgroundColor: 'rgba(33,150,243,0.12)',
                color: '#2196F3',
              }}
            >
              <FiMapPin size={10} />
              {distanceText}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between pt-1">
          <span
            className="text-[11px] font-[Vazir-Medium]"
            style={{ color: colors.textSecondary }}
          >
            مشاهده جزئیات
          </span>
          <FiChevronLeft
            size={16}
            className="transition-transform duration-300 group-hover:-translate-x-1"
            style={{ color: '#8B5CF6' }}
          />
        </div>
      </div>
    </button>
  );
}