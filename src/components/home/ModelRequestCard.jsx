'use client';

import { FiMapPin, FiTag, FiChevronLeft } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import CostTypeBadge from '@/components/common/CostTypeBadge';
import { toPersianDigit } from '@/utils/numberUtils';

const getServiceEmoji = (serviceName = '') => {
  if (serviceName.includes('ناخن')) return '💅';
  if (serviceName.includes('میکاپ') || serviceName.includes('گریم')) return '💄';
  if (
    serviceName.includes('فیشیال') ||
    serviceName.includes('پوست') ||
    serviceName.includes('پاکسازی')
  )
    return '✨';
  if (serviceName.includes('لیزر')) return '⚡';
  if (serviceName.includes('مو') || serviceName.includes('رنگ') || serviceName.includes('کراتین'))
    return '🎨';
  if (serviceName.includes('مژه') || serviceName.includes('ابرو')) return '👁️';
  if (serviceName.includes('ماساژ')) return '💆‍♀️';
  return '💆‍♀️';
};

export default function ModelRequestCard({ request, onPress }) {
  const { colors } = useTheme();

  const costType = request.costType;
  const discount = request.discount || 0;
  const isUrgent = request.isUrgent || false;
  const businessName = request.businessName || 'کسب‌وکار بیو کلاب';
  const serviceName = request.serviceName || 'خدمات زیبایی';
  const city = request.city || '';
  const rawDistance = request.distance;

  const numericDistance =
    rawDistance === null || rawDistance === undefined || rawDistance === ''
      ? null
      : Number(rawDistance);

  const hasDistance = numericDistance !== null && !Number.isNaN(numericDistance);

  const distanceText = hasDistance
    ? numericDistance < 1
      ? `${toPersianDigit(Math.round(numericDistance * 1000))} متر`
      : `${toPersianDigit(numericDistance.toFixed(1))} کیلومتر`
    : '';

  return (
    <button
      onClick={() => onPress?.(request)}
      className="group relative flex-shrink-0 w-full min-w-[270px] sm:min-w-[290px] md:min-w-0 md:w-full overflow-hidden rounded-[26px] border text-right transition-all duration-300 hover:-translate-y-1 active:scale-[0.99]"
      style={{
        backgroundColor: colors.cardBackground,
        borderColor: colors.border,
        boxShadow: '0 14px 34px rgba(233,30,99,0.10)',
      }}
    >
      {/* ═══ هدر گرادیانی ═══ */}
      <div
        className="relative h-[155px] w-full overflow-hidden sm:h-[165px] md:h-[175px]"
        style={{
          background:
            'linear-gradient(135deg, #FF8FAB 0%, #E91E63 48%, #880E4F 100%)',
        }}
      >
        {/* نورهای تزئینی */}
        <div
          className="absolute -right-10 -top-10 h-36 w-36 rounded-full blur-2xl"
          style={{ backgroundColor: 'rgba(255,255,255,0.22)' }}
        />
        <div
          className="absolute -bottom-12 -left-8 h-40 w-40 rounded-full blur-2xl"
          style={{ backgroundColor: 'rgba(255,255,255,0.14)' }}
        />
        <div
          className="absolute right-10 top-10 h-16 w-16 rounded-full blur-xl"
          style={{ backgroundColor: 'rgba(255,255,255,0.12)' }}
        />

        {/* مدال مرکزی */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="flex h-20 w-20 items-center justify-center rounded-full border shadow-inner backdrop-blur-md sm:h-24 sm:w-24"
            style={{
              backgroundColor: 'rgba(255,255,255,0.14)',
              borderColor: 'rgba(255,255,255,0.24)',
            }}
          >
            <span
              className="text-[34px] sm:text-[40px] md:text-[44px]"
              style={{ filter: 'drop-shadow(0 6px 14px rgba(0,0,0,0.22))' }}
            >
              {getServiceEmoji(serviceName)}
            </span>
          </div>
        </div>

        {/* بج فوری */}
        {isUrgent && (
          <div
            className="absolute left-3 top-3 rounded-full px-2.5 py-1 shadow-md"
            style={{
              background: 'linear-gradient(135deg, #F59E0B, #EA580C)',
              boxShadow: '0 8px 20px rgba(245,158,11,0.28)',
            }}
          >
            <span className="text-[10px] font-[Vazir-Bold] text-white sm:text-[11px]">
              🔥 فوری
            </span>
          </div>
        )}

        {/* بج نوع هزینه */}
        <div className="absolute right-3 top-3">
          <CostTypeBadge type={costType} variant="solid" />
        </div>

        {/* نوار پایین */}
        <div
          className="absolute bottom-0 left-0 right-0 flex h-[42px] items-center gap-2 px-3 backdrop-blur-md"
          style={{ backgroundColor: 'rgba(0,0,0,0.22)' }}
        >
          <span className="flex-1 truncate text-[11px] font-[Vazir-Medium] text-white/90 sm:text-[12px]">
            {serviceName}
          </span>

          {discount > 0 && (
            <span
              className="flex-shrink-0 rounded-full px-2 py-0.5 text-[10px] font-[Vazir-Bold] text-white"
              style={{ backgroundColor: 'rgba(255,255,255,0.22)' }}
            >
              {toPersianDigit(discount)}٪ تخفیف
            </span>
          )}
        </div>
      </div>

      {/* ═══ بدنه کارت ═══ */}
      <div className="space-y-3 p-4">
        <h3
          className="line-clamp-2 text-[15px] font-[Vazir-Bold] leading-6 sm:text-base md:text-[17px]"
          style={{ color: colors.textMain }}
        >
          {request.title}
        </h3>

        <div className="flex flex-wrap items-center gap-2">
          <span
            className="inline-flex max-w-[150px] items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-[Vazir-Medium]"
            style={{
              backgroundColor: `${colors.primary}14`,
              color: colors.primary,
            }}
          >
            <span className="text-[11px] leading-none">🏪</span>
            <span className="truncate">{businessName}</span>
          </span>

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

          {hasDistance && (
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

        {discount > 0 && (
          <div
            className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1"
            style={{ backgroundColor: 'rgba(229,57,53,0.10)' }}
          >
            <FiTag size={12} color="#E53935" />
            <span className="text-[11px] font-[Vazir-Bold]" style={{ color: '#E53935' }}>
              {toPersianDigit(discount)}٪ تخفیف مدل‌ها
            </span>
          </div>
        )}

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
            style={{ color: colors.primary }}
          />
        </div>
      </div>
    </button>
  );
}