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
  const safeServiceName = serviceName || 'خدمات زیبایی';

  return (
    <div
      className="relative h-[340px] w-full overflow-hidden"
      style={{
        background:
          'linear-gradient(135deg, #FF8FAB 0%, #E91E63 48%, #880E4F 100%)',
      }}
    >
      {/* نورهای تزئینی */}
      <div
        className="absolute -right-16 -top-16 h-56 w-56 rounded-full blur-3xl"
        style={{ backgroundColor: 'rgba(255,255,255,0.22)' }}
      />
      <div
        className="absolute -bottom-20 -left-12 h-64 w-64 rounded-full blur-3xl"
        style={{ backgroundColor: 'rgba(255,255,255,0.14)' }}
      />
      <div
        className="absolute right-16 top-20 h-20 w-20 rounded-full blur-2xl"
        style={{ backgroundColor: 'rgba(255,255,255,0.12)' }}
      />
      <div
        className="absolute bottom-24 left-14 h-12 w-12 rounded-full blur-xl"
        style={{ backgroundColor: 'rgba(255,255,255,0.16)' }}
      />

      {/* مدال مرکزی */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className="flex h-28 w-28 items-center justify-center rounded-full border shadow-2xl backdrop-blur-xl"
          style={{
            backgroundColor: 'rgba(255,255,255,0.13)',
            borderColor: 'rgba(255,255,255,0.24)',
            boxShadow: '0 24px 70px rgba(0,0,0,0.18)',
          }}
        >
          <span
            className="text-[64px]"
            style={{ filter: 'drop-shadow(0 8px 18px rgba(0,0,0,0.28))' }}
          >
            {getServiceEmoji(safeServiceName)}
          </span>
        </div>
      </div>

      {/* دکمه‌های بالا */}
      <div className="absolute left-4 right-4 top-4 z-10 flex items-center gap-3">
        <button
          onClick={onBack}
          className="flex h-11 w-11 items-center justify-center rounded-full border backdrop-blur-md transition-all hover:scale-105 active:scale-95"
          style={{
            backgroundColor: 'rgba(0,0,0,0.28)',
            borderColor: 'rgba(255,255,255,0.16)',
          }}
        >
          <FiArrowRight size={22} color="#fff" />
        </button>

        <div className="flex-1" />

        <button
          onClick={onShare}
          className="flex h-11 w-11 items-center justify-center rounded-full border backdrop-blur-md transition-all hover:scale-105 active:scale-95"
          style={{
            backgroundColor: 'rgba(0,0,0,0.28)',
            borderColor: 'rgba(255,255,255,0.16)',
          }}
        >
          <FiShare2 size={20} color="#fff" />
        </button>
      </div>

      {/* بج‌ها */}
      {isUrgent && (
        <div
          className="absolute right-4 top-20 rounded-full px-3 py-1.5 shadow-md"
          style={{
            background: 'linear-gradient(135deg, #F59E0B, #EA580C)',
            boxShadow: '0 10px 24px rgba(245,158,11,0.30)',
          }}
        >
          <span className="text-[11px] font-[Vazir-Bold] text-white">🔥 فوری</span>
        </div>
      )}

      <div className="absolute left-4 top-20">
        <CostTypeBadge type={costType} variant="solid" />
      </div>

      {/* پنل پایین */}
      <div
        className="absolute bottom-0 left-0 right-0 px-5 pb-5 pt-20"
        style={{
          background:
            'linear-gradient(to top, rgba(0,0,0,0.58) 0%, rgba(0,0,0,0.28) 45%, rgba(0,0,0,0) 100%)',
        }}
      >
        <div className="flex items-end justify-between gap-3">
          <div className="min-w-0 flex-1">
            <span className="mb-1 block text-[11px] font-[Vazir-Medium] text-white/70">
              خدمت مورد نیاز
            </span>
            <h2 className="truncate text-lg font-[Vazir-Bold] text-white">
              {safeServiceName}
            </h2>
          </div>

          {discount > 0 && (
            <span
              className="flex-shrink-0 rounded-full px-3 py-1.5 text-xs font-[Vazir-Bold] text-white backdrop-blur-md"
              style={{ backgroundColor: 'rgba(255,255,255,0.20)' }}
            >
              {toPersianDigit(discount)}٪ تخفیف
            </span>
          )}
        </div>
      </div>
    </div>
  );
}