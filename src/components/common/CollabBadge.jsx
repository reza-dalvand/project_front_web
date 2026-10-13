'use client';

import { FiPieChart, FiDollarSign, FiClock } from 'react-icons/fi';

const COLLAB_TYPE_META = {
  percent: {
    label: 'درصدی',
    longLabel: 'همکاری درصدی',
    icon: FiPieChart,
    color: '#A855F7',
  },
  fixed: {
    label: 'اجاره ثابت',
    longLabel: 'اجاره ثابت',
    icon: FiDollarSign,
    color: '#6366F1',
  },
  hourly: {
    label: 'ساعتی',
    longLabel: 'همکاری ساعتی',
    icon: FiClock,
    color: '#F59E0B',
  },
};

export default function CollabBadge({ type, priceDisplay, size = 'md', variant = 'default' }) {
  const meta = COLLAB_TYPE_META[type] || COLLAB_TYPE_META.percent;
  const Icon = meta.icon;

  if (variant === 'compact') {
    return (
      <div
        className="inline-flex items-center gap-1 rounded-full border px-2 py-1"
        style={{
          backgroundColor: `${meta.color}14`,
          borderColor: `${meta.color}33`,
        }}
      >
        <Icon size={10} style={{ color: meta.color }} />
        <span
          className="text-[10px] font-[Vazir-Bold] leading-none"
          style={{ color: meta.color }}
        >
          {meta.label}
        </span>
        {priceDisplay && (
          <span
            className="text-[10px] font-[Vazir-Medium] leading-none opacity-80"
            style={{ color: meta.color }}
          >
            {priceDisplay}
          </span>
        )}
      </div>
    );
  }

  if (variant === 'solid') {
    return (
      <div
        className="inline-flex items-center gap-1 rounded-full px-2.5 py-1.5 shadow-md"
        style={{
          backgroundColor: meta.color,
          boxShadow: `0 8px 20px ${meta.color}33`,
        }}
      >
        <Icon size={11} color="#fff" />
        <span className="text-[11px] font-[Vazir-Bold] leading-none text-white">
          {meta.label}
        </span>
        {priceDisplay && (
          <>
            <div className="mx-0.5 h-1 w-1 rounded-full bg-white/40" />
            <span className="text-[11px] font-[Vazir-Bold] leading-none text-white">
              {priceDisplay}
            </span>
          </>
        )}
      </div>
    );
  }

  return (
    <div
      className="inline-flex items-center gap-1.5 self-start rounded-full border px-3 py-2"
      style={{
        backgroundColor: `${meta.color}12`,
        borderColor: `${meta.color}30`,
      }}
    >
      <Icon size={14} style={{ color: meta.color }} />
      <span
        className="text-[12px] font-[Vazir-Bold] leading-none"
        style={{ color: meta.color }}
      >
        همکاری {meta.label}
      </span>
      {priceDisplay && (
        <div className="flex items-center gap-1">
          <div
            className="h-1 w-1 rounded-full"
            style={{ backgroundColor: `${meta.color}60` }}
          />
          <span
            className="text-[11px] font-[Vazir-Bold] leading-none"
            style={{ color: meta.color }}
          >
            {priceDisplay}
          </span>
        </div>
      )}
    </div>
  );
}