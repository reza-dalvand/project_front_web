'use client';

import { FiMapPin, FiChevronLeft } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import { Card } from '@/components/common';
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

export default function AllModelRequestsCard({ request, onPress }) {
  const { colors } = useTheme();

  const serviceName = request.serviceName || 'خدمات زیبایی';
  const businessName = request.businessName || 'کسب‌وکار بیو کلاب';
  const city = request.city || '';
  const discount = request.discount || 0;
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
    <Card
      variant="elevated"
      padding={0}
      radius={26}
      className="group overflow-hidden transition-all duration-300 hover:-translate-y-1"
      style={{ boxShadow: '0 14px 34px rgba(233,30,99,0.10)' }}
    >
      <button onClick={() => onPress?.(request)} className="w-full text-right">
        {/* ═══ هدر ═══ */}
        <div
          className="relative h-[145px] w-full overflow-hidden"
          style={{
            background:
              'linear-gradient(135deg, #FF8FAB 0%, #E91E63 48%, #880E4F 100%)',
          }}
        >
          <div
            className="absolute -right-8 -top-8 h-28 w-28 rounded-full blur-2xl"
            style={{ backgroundColor: 'rgba(255,255,255,0.22)' }}
          />
          <div
            className="absolute -bottom-10 -left-6 h-32 w-32 rounded-full blur-2xl"
            style={{ backgroundColor: 'rgba(255,255,255,0.14)' }}
          />

          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className="flex h-18 w-18 items-center justify-center rounded-full border backdrop-blur-md"
              style={{
                width: '72px',
                height: '72px',
                backgroundColor: 'rgba(255,255,255,0.14)',
                borderColor: 'rgba(255,255,255,0.24)',
              }}
            >
              <span
                className="text-[34px]"
                style={{ filter: 'drop-shadow(0 6px 14px rgba(0,0,0,0.22))' }}
              >
                {getServiceEmoji(serviceName)}
              </span>
            </div>
          </div>

          {request.isUrgent && (
            <div
              className="absolute left-3 top-3 rounded-full px-2.5 py-1 shadow-md"
              style={{
                background: 'linear-gradient(135deg, #F59E0B, #EA580C)',
                boxShadow: '0 8px 20px rgba(245,158,11,0.28)',
              }}
            >
              <span className="text-[10px] font-[Vazir-Bold] text-white">🔥 فوری</span>
            </div>
          )}

          <div className="absolute right-3 top-3">
            <CostTypeBadge type={request.costType} variant="solid" />
          </div>

          <div
            className="absolute bottom-0 left-0 right-0 flex h-[38px] items-center gap-2 px-3 backdrop-blur-md"
            style={{ backgroundColor: 'rgba(0,0,0,0.22)' }}
          >
            <span className="flex-1 truncate text-[11px] font-[Vazir-Medium] text-white/90">
              {serviceName}
            </span>
            {discount > 0 && (
              <span
                className="flex-shrink-0 rounded-full px-2 py-0.5 text-[10px] font-[Vazir-Bold] text-white"
                style={{ backgroundColor: 'rgba(255,255,255,0.22)' }}
              >
                {toPersianDigit(discount)}٪
              </span>
            )}
          </div>
        </div>

        {/* ═══ محتوا ═══ */}
        <div className="space-y-2.5 p-3.5">
          <h3
            className="line-clamp-2 min-h-[44px] text-[15px] font-[Vazir-Bold] leading-6"
            style={{ color: colors.textMain }}
          >
            {request.title}
          </h3>

          <div className="flex flex-wrap items-center gap-1.5">
            <span
              className="inline-flex max-w-[130px] items-center gap-1 rounded-full px-2 py-1 text-[10px] font-[Vazir-Medium]"
              style={{
                backgroundColor: `${colors.primary}14`,
                color: colors.primary,
              }}
            >
              <span className="text-[10px] leading-none">🏪</span>
              <span className="truncate">{businessName}</span>
            </span>

            {city && (
              <span
                className="inline-flex items-center gap-1 rounded-full border px-2 py-1 text-[10px]"
                style={{
                  backgroundColor: colors.background,
                  borderColor: colors.border,
                  color: colors.textSecondary,
                }}
              >
                <FiMapPin size={10} />
                <span className="max-w-[70px] truncate">{city}</span>
              </span>
            )}

            {hasDistance && (
              <span
                className="inline-flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-[Vazir-Bold]"
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

          <div className="flex items-center justify-between pt-0.5">
            <span
              className="text-[10px] font-[Vazir-Medium]"
              style={{ color: colors.textSecondary }}
            >
              مشاهده
            </span>
            <FiChevronLeft
              size={14}
              className="transition-transform duration-300 group-hover:-translate-x-1"
              style={{ color: colors.primary }}
            />
          </div>
        </div>
      </button>
    </Card>
  );
}