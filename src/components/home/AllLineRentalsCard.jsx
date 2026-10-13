'use client';

import { FiMapPin, FiChevronLeft } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import { Card, CollabBadge } from '@/components/common';
import { getLineRentalPriceDisplay } from '@/utils/numberUtils';


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

export default function AllLineRentalsCard({ ad, onPress }) {
  const { colors } = useTheme();

  const typeName = ad.serviceTypeName || 'لاین زیبایی';
  const businessName = ad.businessName || 'کسب‌وکار بیو کلاب';
  const city = ad.city || '';
  const collabType = ad.collab_type || ad.collabType;
  const priceDisplay = getLineRentalPriceDisplay(ad);

  const priceText =
    collabType === 'percent'
      ? `درصدی ${priceDisplay}`
      : collabType === 'hourly'
        ? `ساعتی ${priceDisplay}`
        : `اجاره ثابت ${priceDisplay}`;

  return (
    <Card
      variant="elevated"
      padding={0}
      radius={26}
      className="group overflow-hidden transition-all duration-300 hover:-translate-y-1"
      style={{ boxShadow: '0 14px 34px rgba(124,58,237,0.10)' }}
    >
      <button onClick={() => onPress?.(ad)} className="w-full text-right">
        {/* ═══ هدر ═══ */}
        <div
          className="relative h-[145px] w-full overflow-hidden"
          style={{
            background:
              'linear-gradient(135deg, #C4B5FD 0%, #8B5CF6 45%, #5B21B6 100%)',
          }}
        >
          <div
            className="absolute -left-8 -top-8 h-28 w-28 rounded-full blur-2xl"
            style={{ backgroundColor: 'rgba(255,255,255,0.20)' }}
          />
          <div
            className="absolute -bottom-10 -right-6 h-32 w-32 rounded-full blur-2xl"
            style={{ backgroundColor: 'rgba(255,255,255,0.13)' }}
          />

          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className="flex items-center justify-center rounded-full border backdrop-blur-md"
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
                {getLineEmoji(typeName)}
              </span>
            </div>
          </div>

          <div
            className="absolute left-3 top-3 rounded-full px-2.5 py-1 text-[10px] font-[Vazir-Bold] text-white backdrop-blur-md"
            style={{ backgroundColor: 'rgba(255,255,255,0.18)' }}
          >
            {typeName}
          </div>

          <div
            className="absolute bottom-0 left-0 right-0 flex h-[38px] items-center gap-2 px-3 backdrop-blur-md"
            style={{ backgroundColor: 'rgba(0,0,0,0.22)' }}
          >
            <span className="flex-1 truncate text-[11px] font-[Vazir-Medium] text-white/90">
              {priceText}
            </span>
          </div>
        </div>

        {/* ═══ محتوا ═══ */}
        <div className="space-y-2.5 p-3.5">
          <h3
            className="line-clamp-2 min-h-[44px] text-[15px] font-[Vazir-Bold] leading-6"
            style={{ color: colors.textMain }}
          >
            {ad.title}
          </h3>

          <div className="flex flex-wrap items-center gap-1.5">
            <span
              className="inline-flex max-w-[130px] items-center gap-1 rounded-full px-2 py-1 text-[10px] font-[Vazir-Medium]"
              style={{
                backgroundColor: 'rgba(139,92,246,0.12)',
                color: '#8B5CF6',
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
          </div>

          <CollabBadge
            type={collabType}
            priceDisplay={priceDisplay}
            variant="compact"
          />

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
              style={{ color: '#8B5CF6' }}
            />
          </div>
        </div>
      </button>
    </Card>
  );
}