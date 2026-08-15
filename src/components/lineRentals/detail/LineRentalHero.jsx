// src/components/lineRentals/detail/LineRentalHero.jsx
'use client';
import { FiArrowRight, FiShare2 } from 'react-icons/fi';

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

export default function LineRentalHero({
  serviceTypeName,
  collabType,
  priceDisplay,
  onBack,
  onShare,
}) {
  return (
    <div
      className="relative w-full h-[320px] overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #667eea 0%, #5a67d8 50%, #764ba2 100%)',
      }}
    >
      {/* دایره‌های تزئینی */}
      <div
        className="absolute -top-12 -left-12 w-44 h-44 rounded-full"
        style={{ backgroundColor: 'rgba(255,255,255,0.10)' }}
      />
      <div
        className="absolute -bottom-10 -right-8 w-36 h-36 rounded-full"
        style={{ backgroundColor: 'rgba(255,255,255,0.07)' }}
      />
      <div
        className="absolute top-16 right-14 w-14 h-14 rounded-full"
        style={{ backgroundColor: 'rgba(255,255,255,0.12)' }}
      />
      <div
        className="absolute bottom-16 left-10 w-8 h-8 rounded-full"
        style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}
      />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full"
        style={{ backgroundColor: 'rgba(255,255,255,0.06)' }}
      />

      {/* ایموجی خدمت */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span
          className="text-[80px]"
          style={{ filter: 'drop-shadow(0 6px 16px rgba(0,0,0,0.3))' }}
        >
          {getLineEmoji(serviceTypeName)}
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

      {/* بج نوع خدمت */}
      {serviceTypeName && (
        <div
          className="absolute top-20 left-4 px-3 py-1.5 rounded-xl shadow-md"
          style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
        >
          <span className="text-[11px] font-[Vazir-Bold] text-white">{serviceTypeName}</span>
        </div>
      )}

      {/* نوار شیشه‌ای پایین */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[50px] flex items-center px-5 gap-3"
        style={{ backgroundColor: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(8px)' }}
      >
        <span className="text-sm font-[Vazir-Medium] text-white/90 truncate flex-1">
          {collabType === 'percent'
            ? `درصدی ${priceDisplay}`
            : collabType === 'fixed'
              ? `اجاره ثابت ${priceDisplay}`
              : `ساعتی ${priceDisplay}`}
        </span>
      </div>
    </div>
  );
}