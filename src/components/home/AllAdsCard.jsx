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

  // ✅ تشخیص نوع: مدلینگ / اجاره لاین / آگهی معمولی
  const adType = ad.adType || (ad.costType ? 'model' : ad.collabType ? 'line' : 'ad');
  // ✅ شرط اصلی: آیا تصویر داریم یا نه
  const hasImage = Boolean(ad.imageUrl);
  const emoji = getServiceEmoji(ad.serviceTypeName || ad.serviceName || '');

  return (
    <Card variant="elevated" padding={0} radius={20}>
      <button onClick={() => onPress?.(ad)} className="w-full text-right">
        {/* ═══ هدر: تصویر یا گرادیان + ایموجی ═══ */}
        <div className="relative w-full h-[200px] overflow-hidden">
          {hasImage ? (
            <>
              <Image
                src={ad.imageUrl}
                alt={ad.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 600px"
              />
              <div
                className="absolute bottom-0 left-0 right-0 h-[80px]"
                style={{ backgroundColor: 'rgba(0,0,0,0.25)' }}
              />
            </>
          ) : (
            <div className="absolute inset-0" style={{ background: getGradient(adType) }}>
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
                  className="text-[56px]"
                  style={{ filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.25))' }}
                >
                  {emoji}
                </span>
              </div>
              {/* بج نوع خدمت */}
              {(ad.serviceTypeName || ad.serviceName) && (
                <div
                  className="absolute top-3 right-3 px-2.5 py-1 rounded-lg"
                  style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
                >
                  <span className="text-[10px] font-[Vazir-Bold] text-white">
                    {ad.serviceTypeName || ad.serviceName}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Badge — در هر دو حالت نمایش داده می‌شود */}
          {ad.badge && (
            <div
              className="absolute top-3.5 left-3.5 flex items-center gap-1 px-2.5 py-1.5 rounded-xl shadow-md"
              style={{ backgroundColor: '#E53935' }}
            >
              <span className="text-[11px] font-[Vazir-Bold] text-white">{ad.badge}</span>
            </div>
          )}
        </div>

        {/* محتوا */}
        <div className="p-4 space-y-2.5">
          <h3
            className="text-base font-[Vazir-Bold] leading-[23px] line-clamp-2"
            style={{ color: colors.textMain }}
          >
            {ad.title}
          </h3>
          {ad.subtitle && (
            <p
              className="text-[13px] font-[Vazir] leading-[19px] line-clamp-1"
              style={{ color: colors.textSecondary }}
            >
              {ad.subtitle}
            </p>
          )}

          {/* متا */}
          <div className="flex gap-2 mt-1">
            <div
              className="flex-1 flex items-center gap-1.5 px-2.5 py-2 rounded-xl"
              style={{ backgroundColor: colors.background }}
            >
              <span className="text-sm">🏪</span>
              <span
                className="text-[11px] font-[Vazir] line-clamp-1 flex-1"
                style={{ color: colors.textSecondary }}
              >
                {ad.businessName || 'سالن زیبایی'}
              </span>
            </div>
            <div
              className="flex-1 flex items-center gap-1.5 px-2.5 py-2 rounded-xl"
              style={{ backgroundColor: colors.background }}
            >
              <FiMapPin size={13} color="#E53935" />
              <span
                className="text-[11px] font-[Vazir] line-clamp-1 flex-1"
                style={{ color: colors.textSecondary }}
              >
                {ad.city || 'تهران'}
              </span>
            </div>
          </div>

          {/* دکمه رزرو */}
          <div
            className="flex items-center justify-center gap-2 py-3.5 rounded-2xl mt-1.5 shadow-md"
            style={{ backgroundColor: '#43A047' }}
          >
            <FiCalendar size={16} color="#fff" />
            <span className="text-sm font-[Vazir-Bold] text-white text-center">
              رزرو نوبت با تخفیف ویژه
            </span>
            <FiChevronLeft size={16} color="#fff" />
          </div>
        </div>
      </button>
    </Card>
  );
}
