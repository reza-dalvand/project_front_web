// src/components/home/LineRentalCard.jsx
'use client';
import { FiMapPin } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';

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

export default function LineRentalCard({ ad, onPress }) {
  const { colors } = useTheme();

  return (
    <button
      onClick={() => onPress?.(ad)}
      className="flex-shrink-0 w-[230px] rounded-[20px] overflow-hidden text-right
        transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
      style={{
        backgroundColor: colors.cardBackground,
        border: `1px solid ${colors.border}`,
      }}
    >
      {/* ═══ هدر گرادیانی ═══ */}
      <div
        className="relative h-[130px] overflow-hidden"
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
          className="absolute top-3 right-3 px-2.5 py-1 rounded-lg backdrop-blur-sm"
          style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
        >
          <span className="text-[10px] font-[Vazir-Bold] text-white">{ad.serviceTypeName}</span>
        </div>
        {/* نوار شیشه‌ای پایین هدر */}
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
      {/* ═══ بدنه کارت ═══ */}
      <div className="p-3.5 space-y-2">
        <h4
          className="text-[13px] font-[Vazir-Bold] leading-[20px] line-clamp-2 min-h-[40px]"
          style={{ color: colors.textMain }}
        >
          {ad.title}
        </h4>
        {/* بج نوع همکاری */}
        <div className="flex items-center gap-1.5">
          <span
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-[Vazir-Bold]"
            style={{
              backgroundColor:
                ad.collabType === 'percent'
                  ? '#9C27B018'
                  : ad.collabType === 'hourly'
                    ? '#FF980018'
                    : '#2196F318',
              color:
                ad.collabType === 'percent'
                  ? '#9C27B0'
                  : ad.collabType === 'hourly'
                    ? '#FF9800'
                    : '#2196F3',
            }}
          >
            {ad.collabType === 'percent' ? '📊' : ad.collabType === 'hourly' ? '⏰' : '💰'}
            {ad.collabType === 'percent' ? 'درصدی' : ad.collabType === 'hourly' ? 'ساعتی' : 'اجاره ثابت'}
          </span>
        </div>
        {/* شهر */}
        <div className="flex items-center gap-1.5">
          <FiMapPin size={11} style={{ color: colors.textSecondary }} />
          <span className="text-[10px]" style={{ color: colors.textSecondary }}>
            {ad.city}
          </span>
        </div>
      </div>
    </button>
  );
}