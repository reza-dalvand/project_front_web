'use client';
import { FiMapPin } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import { Card, CollabBadge } from '@/components/common';

const getLineEmoji = (typeName = '') => {
  if (typeName.includes('ناخن')) return '💅';
  if (typeName.includes('میکاپ') || typeName.includes('گریم')) return '💄';
  if (typeName.includes('فیشیال') || typeName.includes('پوست')) return '✨';
  if (typeName.includes('لیزر')) return '⚡';
  if (typeName.includes('مو') || typeName.includes('رنگ') || typeName.includes('کراتین')) return '🎨';
  if (typeName.includes('مژه') || typeName.includes('ابرو')) return '👁️';
  if (typeName.includes('ماساژ')) return '💆‍♀️';
  return '🏢';
};

export default function AllLineRentalsCard({ ad, onPress }) {
  const { colors } = useTheme();
  return (
    <Card variant="elevated" padding={0} radius={20}>
      <button onClick={() => onPress?.(ad)} className="w-full text-right">
        {/* ═══ هدر گرادیانی (بدون تصویر) ═══ */}
        <div
          className="relative w-full h-[160px] overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #5a67d8 50%, #764ba2 100%)',
          }}
        >
          {/* دایره‌های تزئینی */}
          <div
            className="absolute -top-6 -left-6 w-24 h-24 rounded-full"
            style={{ backgroundColor: 'rgba(255,255,255,0.10)' }}
          />
          <div
            className="absolute -bottom-8 -right-6 w-28 h-28 rounded-full"
            style={{ backgroundColor: 'rgba(255,255,255,0.07)' }}
          />
          <div
            className="absolute top-10 right-12 w-8 h-8 rounded-full"
            style={{ backgroundColor: 'rgba(255,255,255,0.12)' }}
          />
          <div
            className="absolute bottom-6 left-8 w-5 h-5 rounded-full"
            style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}
          />
          {/* ایموجی خدمت */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span
              className="text-[48px]"
              style={{ filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.25))' }}
            >
              {getLineEmoji(ad.serviceTypeName)}
            </span>
          </div>
          {/* بج نوع خدمت */}
          <div
            className="absolute top-3 left-3 px-2.5 py-1 rounded-lg shadow-md"
            style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
          >
            <span className="text-[10px] font-[Vazir-Bold] text-white">
              {ad.serviceTypeName}
            </span>
          </div>
          {/* نوار شیشه‌ای */}
          <div
            className="absolute bottom-0 left-0 right-0 h-[36px] flex items-center px-3 gap-2"
            style={{ backgroundColor: 'rgba(0,0,0,0.25)', backdropFilter: 'blur(8px)' }}
          >
            <span className="text-[11px] font-[Vazir-Medium] text-white/90 truncate flex-1">
              {ad.collabType === 'percent'
                ? `درصدی ${ad.priceDisplay}`
                : ad.collabType === 'hourly'
                  ? `ساعتی ${ad.priceDisplay}`
                  : `اجاره ثابت ${ad.priceDisplay}`}
            </span>
          </div>
        </div>
        {/* ═══ محتوا ═══ */}
        <div className="p-3.5 space-y-2">
          <h3
            className="text-base font-[Vazir-Bold] leading-[23px] line-clamp-2 min-h-[46px]"
            style={{ color: colors.textMain }}
          >
            {ad.title}
          </h3>
          <div className="flex items-center gap-1.5">
            <span className="text-sm">🏪</span>
            <span
              className="text-[11px] font-[Vazir-Medium] line-clamp-1"
              style={{ color: colors.primary }}
            >
              {ad.businessName}
            </span>
          </div>
          <CollabBadge type={ad.collabType} priceDisplay={ad.priceDisplay} variant="compact" />
          <div className="flex items-center gap-1">
            <FiMapPin size={12} color={colors.textSecondary} />
            <span className="text-[10px]" style={{ color: colors.textSecondary }}>
              {ad.city}
            </span>
          </div>
        </div>
      </button>
    </Card>
  );
}