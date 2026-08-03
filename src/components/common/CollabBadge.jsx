'use client';

import { FiPieChart, FiDollarSign, FiClock } from 'react-icons/fi';

// متادیتای انواع همکاری
const COLLAB_TYPE_META = {
  percent: {
    label: 'درصدی',
    longLabel: 'همکاری درصدی',
    icon: FiPieChart,
    color: '#9C27B0',
    bg: '#9C27B018',
    border: '#9C27B040',
  },
  fixed: {
    label: 'اجاره ثابت',
    longLabel: 'اجاره ثابت',
    icon: FiDollarSign,
    color: '#2196F3',
    bg: '#2196F318',
    border: '#2196F340',
  },
  hourly: {
    label: 'ساعتی',
    longLabel: 'همکاری ساعتی',
    icon: FiClock,
    color: '#FF9800',
    bg: '#FF980018',
    border: '#FF980040',
  },
};

/**
 * کامپوننت نشانگر نوع همکاری
 *
 * @param {string} type - نوع همکاری (percent, fixed, hourly)
 * @param {string} priceDisplay - نمایش قیمت
 * @param {'default'|'solid'|'compact'} size - اندازه
 * @param {'default'|'solid'|'compact'} variant - نوع نمایش
 */
export default function CollabBadge({
  type,
  priceDisplay,
  size = 'md',
  variant = 'default',
}) {
  const meta = COLLAB_TYPE_META[type] || COLLAB_TYPE_META.percent;
  const Icon = meta.icon;

  // حالت compact - فقط برچسب
  if (variant === 'compact') {
    return (
      <div
        className="inline-flex items-center gap-1 px-2 py-1 rounded-lg border"
        style={{
          backgroundColor: meta.bg,
          borderColor: meta.border,
        }}
      >
        <Icon size={10} style={{ color: meta.color }} />
        <span
          className="text-[10px] font-[Vazir-Bold]"
          style={{ color: meta.color }}
        >
          {meta.label}
        </span>
      </div>
    );
  }

  // حالت solid - پررنگ
  if (variant === 'solid') {
    return (
      <div
        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl"
        style={{ backgroundColor: meta.color }}
      >
        <Icon size={11} color="#fff" />
        <span className="text-[11px] font-[Vazir-Bold] text-white">
          {meta.label}
        </span>
        {priceDisplay && (
          <>
            <div
              className="w-1 h-1 rounded-full mx-0.5"
              style={{ backgroundColor: 'rgba(255,255,255,0.4)' }}
            />
            <span className="text-[11px] font-[Vazir-Bold] text-white">
              {priceDisplay}
            </span>
          </>
        )}
      </div>
    );
  }

  // حالت پیش‌فرض - با border
  return (
    <div
      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border"
      style={{
        backgroundColor: meta.bg,
        borderColor: meta.border,
      }}
    >
      <Icon size={14} style={{ color: meta.color }} />
      <span
        className="text-[13px] font-[Vazir-Bold] flex-1"
        style={{ color: meta.color }}
      >
        همکاری {meta.label}
      </span>
      {priceDisplay && (
        <div className="flex items-center gap-1">
          <div
            className="w-1 h-1 rounded-full"
            style={{ backgroundColor: meta.color + '60' }}
          />
          <span
            className="text-xs font-[Vazir-Bold]"
            style={{ color: meta.color }}
          >
            {priceDisplay}
          </span>
        </div>
      )}
    </div>
  );
}