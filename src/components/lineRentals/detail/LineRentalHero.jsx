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
  const safeTypeName = serviceTypeName || 'لاین زیبایی';

  const collabLabel =
    collabType === 'percent'
      ? 'همکاری درصدی'
      : collabType === 'fixed'
        ? 'اجاره ثابت'
        : 'همکاری ساعتی';

  return (
    <div
      className="relative h-[340px] w-full overflow-hidden"
      style={{
        background:
          'linear-gradient(135deg, #C4B5FD 0%, #8B5CF6 45%, #5B21B6 100%)',
      }}
    >
      {/* نورهای تزئینی */}
      <div
        className="absolute -left-16 -top-16 h-56 w-56 rounded-full blur-3xl"
        style={{ backgroundColor: 'rgba(255,255,255,0.20)' }}
      />
      <div
        className="absolute -bottom-20 -right-12 h-64 w-64 rounded-full blur-3xl"
        style={{ backgroundColor: 'rgba(255,255,255,0.13)' }}
      />
      <div
        className="absolute left-16 top-20 h-20 w-20 rounded-full blur-2xl"
        style={{ backgroundColor: 'rgba(255,255,255,0.12)' }}
      />
      <div
        className="absolute bottom-24 right-14 h-12 w-12 rounded-full blur-xl"
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
            {getLineEmoji(safeTypeName)}
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

      {/* بج نوع خدمت */}
      <div
        className="absolute left-4 top-20 rounded-full px-3 py-1.5 text-[11px] font-[Vazir-Bold] text-white backdrop-blur-md"
        style={{ backgroundColor: 'rgba(255,255,255,0.18)' }}
      >
        {safeTypeName}
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
              نوع همکاری
            </span>
            <h2 className="truncate text-lg font-[Vazir-Bold] text-white">
              {collabLabel}
            </h2>
          </div>

          {priceDisplay && (
            <span
              className="flex-shrink-0 rounded-full px-3 py-1.5 text-xs font-[Vazir-Bold] text-white backdrop-blur-md"
              style={{ backgroundColor: 'rgba(255,255,255,0.20)' }}
            >
              {priceDisplay}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}