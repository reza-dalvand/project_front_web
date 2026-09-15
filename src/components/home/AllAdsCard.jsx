// src/components/home/AllAdsCard.jsx
'use client';
import Image from 'next/image';
import { FiCalendar, FiMapPin, FiChevronLeft } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import { Card } from '@/components/common';

// ═══ ایموجی بر اساس نام خدمت ═══
const getServiceEmoji = (name = '') => {
  if (name.includes('ناخن')) return '💅';
  if (name.includes('میکاپ') || name.includes('گریم')) return '💄';
  if (name.includes('فیشیال') || name.includes('پوست') || name.includes('پاکسازی')) return '✨';
  if (name.includes('لیزر')) return '⚡';
  if (name.includes('مو') || name.includes('رنگ') || name.includes('کراتین')) return '🎨';
  if (name.includes('مژه') || name.includes('ابرو')) return '👁️';
  if (name.includes('ماساژ')) return '💆‍♀️';
  return '💆‍♀️';
};

// ═══ گرادیان بر اساس نوع آگهی ═══
const getGradient = (type) =>
  type === 'model'
    ? 'linear-gradient(135deg, #E91E63 0%, #AD1457 60%, #880E4F 100%)'
    : 'linear-gradient(135deg, #667eea 0%, #5a67d8 50%, #764ba2 100%)';

export default function AllAdsCard({ ad, onPress }) {
  const { colors } = useTheme();

  const adType = ad.adType || (ad.costType ? 'model' : ad.collabType ? 'line' : 'ad');
  const hasImage = Boolean(ad.imageUrl);
  const emoji = getServiceEmoji(ad.serviceTypeName || ad.serviceName || '');

  return (
    <Card variant="elevated" padding={0} radius={20} className="w-full">
      <button onClick={() => onPress?.(ad)} className="w-full text-right">
        {/* ═══ هدر: تصویر یا گرادیان + ایموجی ═══ */}
        <div className="relative w-full h-[180px] sm:h-[200px] md:h-[220px] lg:h-[240px] overflow-hidden">
          {hasImage ? (
            <>
              <Image
                src={ad.imageUrl}
                alt={ad.title}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 400px"
              />
              <div
                className="absolute bottom-0 left-0 right-0 h-[70px] sm:h-[80px] md:h-[90px]"
                style={{ backgroundColor: 'rgba(0,0,0,0.25)' }}
              />
            </>
          ) : (
            <div className="absolute inset-0" style={{ background: getGradient(adType) }}>
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
                  className="text-[44px] sm:text-[56px] md:text-[64px]"
                  style={{ filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.25))' }}
                >
                  {emoji}
                </span>
              </div>
              {/* بج نوع خدمت */}
              {(ad.serviceTypeName || ad.serviceName) && (
                <div
                  className="absolute top-3 right-3 px-2 sm:px-2.5 py-1 rounded-lg"
                  style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
                >
                  <span className="text-[9px] sm:text-[10px] md:text-[11px] font-[Vazir-Bold] text-white">
                    {ad.serviceTypeName || ad.serviceName}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Badge */}
          {ad.badge && (
            <div
              className="absolute top-3 sm:top-3.5 left-3 sm:left-3.5 flex items-center gap-1 px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-lg sm:rounded-xl shadow-md"
              style={{ backgroundColor: '#E53935' }}
            >
              <span className="text-[10px] sm:text-[11px] md:text-xs font-[Vazir-Bold] text-white">{ad.badge}</span>
            </div>
          )}
        </div>

        {/* محتوا */}
        <div className="p-3.5 sm:p-4 md:p-5 space-y-2 sm:space-y-2.5 md:space-y-3">
          <h3
            className="text-[14px] sm:text-base md:text-lg font-[Vazir-Bold] leading-[22px] sm:leading-[23px] md:leading-[26px] line-clamp-2"
            style={{ color: colors.textMain }}
          >
            {ad.title}
          </h3>
          {ad.subtitle && (
            <p
              className="text-[12px] sm:text-[13px] md:text-sm font-[Vazir] leading-[18px] sm:leading-[19px] md:leading-[21px] line-clamp-1"
              style={{ color: colors.textSecondary }}
            >
              {ad.subtitle}
            </p>
          )}

          {/* متا */}
          <div className="flex gap-2 md:gap-3 mt-1">
            <div
              className="flex-1 flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1.5 sm:py-2 rounded-lg sm:rounded-xl"
              style={{ backgroundColor: colors.background }}
            >
              <span className="text-[13px] sm:text-sm">🏪</span>
              <span
                className="text-[10px] sm:text-[11px] md:text-xs font-[Vazir] line-clamp-1 flex-1"
                style={{ color: colors.textSecondary }}
              >
                {ad.businessName || 'سالن زیبایی'}
              </span>
            </div>
            <div
              className="flex-1 flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1.5 sm:py-2 rounded-lg sm:rounded-xl"
              style={{ backgroundColor: colors.background }}
            >
              <FiMapPin size={13} className="sm:w-3.5 sm:h-3.5" color="#E53935" />
              <span
                className="text-[10px] sm:text-[11px] md:text-xs font-[Vazir] line-clamp-1 flex-1"
                style={{ color: colors.textSecondary }}
              >
                {ad.city || 'تهران'}
              </span>
            </div>
          </div>

          {/* دکمه رزرو */}
          <div
            className="flex items-center justify-center gap-1.5 sm:gap-2 py-3 sm:py-3.5 md:py-4 rounded-xl sm:rounded-2xl mt-1.5 shadow-md hover:shadow-lg transition-shadow"
            style={{ backgroundColor: '#43A047' }}
          >
            <FiCalendar size={16} className="sm:w-[18px] sm:h-[18px]" color="#fff" />
            <span className="text-[13px] sm:text-sm md:text-[15px] font-[Vazir-Bold] text-white text-center">
              رزرو نوبت با تخفیف ویژه
            </span>
            <FiChevronLeft size={16} className="sm:w-[18px] sm:h-[18px]" color="#fff" />
          </div>
        </div>
      </button>
    </Card>
  );
}