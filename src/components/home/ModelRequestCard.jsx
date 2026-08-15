// src/components/home/ModelRequestCard.jsx
'use client';
import { FiMapPin } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import { toPersianDigit } from '@/utils/numberUtils';
import CostTypeBadge from '@/components/common/CostTypeBadge';

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

  return (
    <button
      onClick={() => onPress?.(request)}
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
          background: 'linear-gradient(135deg, #E91E63 0%, #AD1457 60%, #880E4F 100%)',
        }}
      >
        {/* دایره‌های تزئینی */}
        <div
          className="absolute -top-8 -right-8 w-28 h-28 rounded-full"
          style={{ backgroundColor: 'rgba(255,255,255,0.10)' }}
        />
        <div
          className="absolute -bottom-6 -left-4 w-20 h-20 rounded-full"
          style={{ backgroundColor: 'rgba(255,255,255,0.07)' }}
        />
        <div
          className="absolute top-8 left-10 w-10 h-10 rounded-full"
          style={{ backgroundColor: 'rgba(255,255,255,0.12)' }}
        />
        <div
          className="absolute bottom-4 right-6 w-6 h-6 rounded-full"
          style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}
        />
        {/* ایموجی خدمت */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            className="text-[48px]"
            style={{ filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.25))' }}
          >
            {getServiceEmoji(request.serviceName)}
          </span>
        </div>
        {/* بج فوری */}
        {request.isUrgent && (
          <div
            className="absolute top-3 left-3 px-2.5 py-1 rounded-lg backdrop-blur-sm"
            style={{ backgroundColor: 'rgba(255,152,0,0.9)' }}
          >
            <span className="text-[10px] font-[Vazir-Bold] text-white">🔥 فوری</span>
          </div>
        )}
        {/* بج نوع هزینه */}
        <div className="absolute top-3 right-3">
          <CostTypeBadge type={request.costType} variant="solid" />
        </div>
        {/* نوار شیشه‌ای پایین هدر */}
        <div
          className="absolute bottom-0 left-0 right-0 h-[36px] flex items-center px-3 gap-2"
          style={{ backgroundColor: 'rgba(0,0,0,0.25)', backdropFilter: 'blur(8px)' }}
        >
          <span className="text-[11px] font-[Vazir-Medium] text-white/90 truncate flex-1">
            {request.serviceName}
          </span>
          {request.discount > 0 && (
            <span
              className="text-[10px] font-[Vazir-Bold] px-1.5 py-0.5 rounded-md flex-shrink-0"
              style={{ backgroundColor: 'rgba(255,255,255,0.25)', color: '#fff' }}
            >
              {toPersianDigit(request.discount)}٪ تخفیف
            </span>
          )}
        </div>
      </div>
      {/* ═══ بدنه کارت ═══ */}
      <div className="p-3.5 space-y-2">
        <h4
          className="text-[13px] font-[Vazir-Bold] leading-[20px] line-clamp-2 min-h-[40px]"
          style={{ color: colors.textMain }}
        >
          {request.title}
        </h4>
        {/* کسب‌وکار */}
        <div className="flex items-center gap-1.5">
          <span className="text-[13px]">🏪</span>
          <span
            className="text-[11px] font-[Vazir-Medium] truncate flex-1"
            style={{ color: colors.primary }}
          >
            {request.businessName}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <FiMapPin size={11} style={{ color: colors.textSecondary }} />
          <span className="text-[10px]" style={{ color: colors.textSecondary }}>
            {request.city}
          </span>
        </div>
      </div>
    </button>
  );
}
