// src/components/modelRequests/detail/ModelRequestHero.jsx
'use client';
import { FiArrowRight, FiShare2 } from 'react-icons/fi';
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

export default function ModelRequestHero({
  serviceName,
  costType,
  discount,
  isUrgent,
  onBack,
  onShare,
}) {
  return (
    <div
      className="relative w-full h-[320px] overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #E91E63 0%, #AD1457 60%, #880E4F 100%)',
      }}
    >
      {/* دایره‌های تزئینی */}
      <div
        className="absolute -top-12 -right-12 w-44 h-44 rounded-full"
        style={{ backgroundColor: 'rgba(255,255,255,0.10)' }}
      />
      <div
        className="absolute -bottom-10 -left-8 w-36 h-36 rounded-full"
        style={{ backgroundColor: 'rgba(255,255,255,0.07)' }}
      />
      <div
        className="absolute top-16 left-14 w-14 h-14 rounded-full"
        style={{ backgroundColor: 'rgba(255,255,255,0.12)' }}
      />
      <div
        className="absolute bottom-16 right-10 w-8 h-8 rounded-full"
        style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}
      />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full"
        style={{ backgroundColor: 'rgba(255,255,255,0.06)' }}
      />

      {/* ایموجی خدمت */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-[80px]" style={{ filter: 'drop-shadow(0 6px 16px rgba(0,0,0,0.3))' }}>
          {getServiceEmoji(serviceName)}
        </span>
      </div>

      {/* دکمه‌ها */}
      <div className="absolute top-4 left-4 right-4 flex items-center gap-3 z-10">
        <button
          onClick={onBack}
          className="w-11 h-11 rounded-full flex items-center justify-center border border-white/15 backdrop-blur-sm"
          style={{ backgroundColor: 'rgba(0,0,0,0.35)' }}
        >
          <FiArrowRight size={22} color="#fff" />
        </button>
        <div className="flex-1" />
        <button
          onClick={onShare}
          className="w-11 h-11 rounded-full flex items-center justify-center border border-white/15 backdrop-blur-sm"
          style={{ backgroundColor: 'rgba(0,0,0,0.35)' }}
        >
          <FiShare2 size={20} color="#fff" />
        </button>
      </div>

      {/* بج فوری */}
      {isUrgent && (
        <div
          className="absolute top-20 right-4 px-3 py-1.5 rounded-xl shadow-md"
          style={{ backgroundColor: '#FF9800' }}
        >
          <span className="text-[11px] font-[Vazir-Bold] text-white">🔥 فوری</span>
        </div>
      )}

      {/* بج نوع هزینه */}
      <div className="absolute top-20 left-4">
        <CostTypeBadge type={costType} variant="solid" />
      </div>

      {/* نوار شیشه‌ای پایین */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[50px] flex items-center px-5 gap-3"
        style={{ backgroundColor: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(8px)' }}
      >
        <span className="text-sm font-[Vazir-Medium] text-white/90 truncate flex-1">
          {serviceName}
        </span>
        {discount > 0 && (
          <span
            className="text-xs font-[Vazir-Bold] px-2 py-1 rounded-lg flex-shrink-0"
            style={{ backgroundColor: 'rgba(255,255,255,0.25)', color: '#fff' }}
          >
            {toPersianDigit(discount)}٪ تخفیف
          </span>
        )}
      </div>
    </div>
  );
}
