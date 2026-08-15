// src/components/lineRentals/LineRentalCard.jsx
'use client';
import { FiMapPin } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import CollabBadge from '@/components/common/CollabBadge';

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

export default function LineRentalCard({ rental, onPress }) {
  const { colors } = useTheme();

  const collabType = rental.collab_type || rental.collabType;
  const businessName = rental.business_name || rental.businessName;
  const city = rental.city || '';
  const serviceTypeName = rental.service_category_name || rental.serviceTypeName || '';
  const distance = rental.distance;

  return (
    <button
      onClick={() => onPress(rental)}
      className="w-full rounded-2xl border overflow-hidden text-right transition-all hover:shadow-md active:scale-[0.99]"
      style={{ backgroundColor: colors.cardBackground, borderColor: colors.border }}
    >
      <div
        className="relative w-full h-[160px] overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #5a67d8 50%, #764ba2 100%)',
        }}
      >
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
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            className="text-[48px]"
            style={{ filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.25))' }}
          >
            {getLineEmoji(serviceTypeName)}
          </span>
        </div>
        {serviceTypeName && (
          <div
            className="absolute top-3 left-3 px-2.5 py-1 rounded-lg shadow-md"
            style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
          >
            <span className="text-[10px] font-[Vazir-Bold] text-white">{serviceTypeName}</span>
          </div>
        )}
        <div
          className="absolute bottom-0 left-0 right-0 h-[36px] flex items-center px-3 gap-2"
          style={{ backgroundColor: 'rgba(0,0,0,0.25)', backdropFilter: 'blur(8px)' }}
        >
          <span className="text-[11px] font-[Vazir-Medium] text-white/90 truncate flex-1">
            {collabType === 'percent'
              ? `درصدی ${rental.priceDisplay || ''}`
              : collabType === 'fixed'
                ? `اجاره ثابت ${rental.priceDisplay || ''}`
                : `ساعتی ${rental.priceDisplay || ''}`}
          </span>
        </div>
      </div>

      <div className="p-3.5 space-y-2.5">
        <h3
          className="text-base font-[Vazir-Bold] leading-6 line-clamp-2"
          style={{ color: colors.textMain }}
        >
          {rental.title}
        </h3>
        <div className="flex items-center gap-1.5">
          <CollabBadge type={collabType} priceDisplay={rental.priceDisplay} variant="compact" />
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1.5">
            <span className="text-xs">🏪</span>
            <span
              className="text-[11px] font-[Vazir-Medium] line-clamp-1"
              style={{ color: colors.primary }}
            >
              {businessName}
            </span>
          </div>
          {city && (
            <div className="flex items-center gap-1">
              <FiMapPin size={11} color={colors.textSecondary} />
              <span className="text-[10px]" style={{ color: colors.textSecondary }}>
                {city}
              </span>
            </div>
          )}
          {distance !== null && distance !== undefined && (
            <div className="flex items-center gap-1">
              <FiMapPin size={11} color="#2196F3" />
              <span className="text-[10px] font-[Vazir-Bold]" style={{ color: '#2196F3' }}>
                {distance < 1
                  ? `${Math.round(distance * 1000)} متر`
                  : `${distance.toFixed(1)} کیلومتر`}
              </span>
            </div>
          )}
        </div>
      </div>
    </button>
  );
}
