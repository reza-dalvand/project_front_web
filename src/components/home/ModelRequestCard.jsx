// src/components/home/ModelRequestCard.jsx
'use client';
import { FiMapPin, FiTag } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import CostTypeBadge from '@/components/common/CostTypeBadge';
import { toPersianDigit } from '@/utils/numberUtils';

/**
 * کارت درخواست مدل — هماهنگ با بک‌اند
 */

// ═══ ایموجی بر اساس نام خدمت ═══
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
  const businessName = request.businessName || '';
  const serviceName = request.serviceName || '';
  const city = request.city || '';
  const distance = request.distance;

  return (
    <button
      onClick={() => onPress?.(request)}
      className="
        flex-shrink-0
        w-full min-w-[270px] sm:min-w-[290px] md:min-w-0 md:w-full
        rounded-xl sm:rounded-2xl md:rounded-[20px]
        border overflow-hidden text-right transition-all
        hover:shadow-md active:scale-[0.99]
      "
      style={{ backgroundColor: colors.cardBackground, borderColor: colors.border }}
    >
      {/* ═══ هدر گرادیانی ═══ */}
      <div
        className="relative w-full h-[140px] sm:h-[160px] md:h-[170px] lg:h-[180px] overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #E91E63 0%, #AD1457 60%, #880E4F 100%)',
        }}
      >
        {/* دایره‌های تزئینی */}
        <div
          className="absolute -top-8 -right-8 w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full"
          style={{ backgroundColor: 'rgba(255,255,255,0.10)' }}
        />
        <div
          className="absolute -bottom-6 -left-4 w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full"
          style={{ backgroundColor: 'rgba(255,255,255,0.07)' }}
        />
        <div
          className="absolute top-8 left-10 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full"
          style={{ backgroundColor: 'rgba(255,255,255,0.12)' }}
        />
        <div
          className="absolute bottom-4 right-6 w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 rounded-full"
          style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}
        />

        {/* ایموجی خدمت */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            className="text-[40px] sm:text-[48px] md:text-[52px]"
            style={{ filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.25))' }}
          >
            {getServiceEmoji(serviceName)}
          </span>
        </div>

        {/* بج فوری */}
        {isUrgent && (
          <div
            className="absolute top-3 left-3 px-2 sm:px-2.5 py-1 rounded-lg shadow-md"
            style={{ backgroundColor: '#FF9800' }}
          >
            <span className="text-[10px] sm:text-[11px] md:text-xs font-[Vazir-Bold] text-white">🔥 فوری</span>
          </div>
        )}

        {/* بج نوع هزینه */}
        <div className="absolute top-3 right-3">
          <CostTypeBadge type={costType} variant="solid" />
        </div>

        {/* نوار شیشه‌ای پایین هدر */}
        <div
          className="absolute bottom-0 left-0 right-0 h-[32px] sm:h-[36px] md:h-[40px] flex items-center px-2.5 sm:px-3 gap-2"
          style={{ backgroundColor: 'rgba(0,0,0,0.25)', backdropFilter: 'blur(8px)' }}
        >
          <span className="text-[10px] sm:text-[11px] md:text-xs font-[Vazir-Medium] text-white/90 truncate flex-1">
            {serviceName}
          </span>
          {discount > 0 && (
            <span
              className="text-[9px] sm:text-[10px] md:text-[11px] font-[Vazir-Bold] px-1 sm:px-1.5 py-0.5 rounded-md flex-shrink-0"
              style={{ backgroundColor: 'rgba(255,255,255,0.25)', color: '#fff' }}
            >
              {toPersianDigit(discount)}٪ تخفیف
            </span>
          )}
        </div>
      </div>

      {/* ═══ بدنه کارت ═══ */}
      <div className="p-3 sm:p-3.5 md:p-4 space-y-2 sm:space-y-2.5 md:space-y-3">
        {/* عنوان */}
        <h3
          className="text-[14px] sm:text-base md:text-lg font-[Vazir-Bold] leading-[22px] sm:leading-6 md:leading-[26px] line-clamp-2"
          style={{ color: colors.textMain }}
        >
          {request.title}
        </h3>

        {/* کسب‌وکار + شهر */}
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
              <span className="text-[9px] sm:text-[10px] md:text-[11px]" style={{ color: colors.textSecondary }}>
                {city}
              </span>
            </div>
          )}
          {distance !== null && distance !== undefined && (
            <div className="flex items-center gap-1">
              <FiMapPin size={11} className="sm:w-3 sm:h-3" color="#2196F3" />
              <span className="text-[9px] sm:text-[10px] md:text-[11px] font-[Vazir-Bold]" style={{ color: '#2196F3' }}>
                {distance < 1
                  ? `${Math.round(distance * 1000)} متر`
                  : `${distance.toFixed(1)} کیلومتر`}
              </span>
            </div>
          )}
        </div>

        {/* تخفیف */}
        {discount > 0 && (
          <div className="flex items-center gap-1 sm:gap-1.5">
            <FiTag size={12} className="sm:w-3.5 sm:h-3.5" color="#E53935" />
            <span className="text-[10px] sm:text-[11px] md:text-xs font-[Vazir-Bold]" style={{ color: '#E53935' }}>
              {toPersianDigit(discount)}٪ تخفیف مدل‌ها
            </span>
          </div>
        )}
      </div>
    </button>
  );
}