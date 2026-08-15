// src/components/modelRequests/ModelRequestCard.jsx
'use client';
import { FiMapPin, FiTag } from 'react-icons/fi';
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

  const costType = request.cost_type || request.costType;
  const discount = request.discount || 0;
  const isUrgent = request.is_urgent || request.isUrgent;
  const businessName = request.business_name || request.businessName;
  const serviceName = request.service_name || request.serviceName;
  const city = request.city || '';
  const distance = request.distance;

  return (
    <button
      onClick={() => onPress(request)}
      className="w-full rounded-2xl border overflow-hidden text-right transition-all hover:shadow-md active:scale-[0.99]"
      style={{ backgroundColor: colors.cardBackground, borderColor: colors.border }}
    >
      <div
        className="relative w-full h-[160px] overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #E91E63 0%, #AD1457 60%, #880E4F 100%)',
        }}
      >
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
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            className="text-[48px]"
            style={{ filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.25))' }}
          >
            {getServiceEmoji(serviceName)}
          </span>
        </div>
        {isUrgent && (
          <div
            className="absolute top-3 left-3 px-2.5 py-1 rounded-lg shadow-md"
            style={{ backgroundColor: 'rgba(255,152,0,0.9)' }}
          >
            <span className="text-[11px] font-[Vazir-Bold] text-white">🔥 فوری</span>
          </div>
        )}
        <div className="absolute top-3 right-3">
          <CostTypeBadge type={costType} variant="solid" />
        </div>
        <div
          className="absolute bottom-0 left-0 right-0 h-[36px] flex items-center px-3 gap-2"
          style={{ backgroundColor: 'rgba(0,0,0,0.25)', backdropFilter: 'blur(8px)' }}
        >
          <span className="text-[11px] font-[Vazir-Medium] text-white/90 truncate flex-1">
            {serviceName}
          </span>
          {discount > 0 && (
            <span
              className="text-[10px] font-[Vazir-Bold] px-1.5 py-0.5 rounded-md flex-shrink-0"
              style={{ backgroundColor: 'rgba(255,255,255,0.25)', color: '#fff' }}
            >
              {toPersianDigit(discount)}٪ تخفیف
            </span>
          )}
        </div>
      </div>

      <div className="p-3.5 space-y-2.5">
        <h3
          className="text-base font-[Vazir-Bold] leading-6 line-clamp-2"
          style={{ color: colors.textMain }}
        >
          {request.title}
        </h3>
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
        {discount > 0 && (
          <div className="flex items-center gap-1.5">
            <FiTag size={12} color="#E53935" />
            <span className="text-[11px] font-[Vazir-Bold]" style={{ color: '#E53935' }}>
              {toPersianDigit(discount)}٪ تخفیف مدل‌ها
            </span>
          </div>
        )}
      </div>
    </button>
  );
}