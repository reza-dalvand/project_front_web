'use client';
import { FiPieChart, FiDollarSign, FiClock } from 'react-icons/fi';

const COLLAB_TYPE_META = {
  percent: {
    label: 'درصدی',
    longLabel: 'همکاری درصدی',
    icon: FiPieChart,
    color: '#9C27B0',
  },
  fixed: {
    label: 'اجاره ثابت',
    longLabel: 'اجاره ثابت',
    icon: FiDollarSign,
    color: '#2196F3',
  },
  hourly: {
    label: 'ساعتی',
    longLabel: 'همکاری ساعتی',
    icon: FiClock,
    color: '#FF9800',
  },
};

export default function CollabBadge({ type, priceDisplay, size = 'md', variant = 'default' }) {
  const meta = COLLAB_TYPE_META[type] || COLLAB_TYPE_META.percent;
  const Icon = meta.icon;

  // حالت compact
  if (variant === 'compact') {
    return (
      <div
        className="inline-flex items-center gap-1 px-2 py-1 rounded-lg border"
        style={{ backgroundColor: meta.color + '18', borderColor: meta.color + '40' }}
      >
        <Icon size={10} style={{ color: meta.color }} />
        <span className="text-[10px] font-vazir-bold" style={{ color: meta.color }}>
          {meta.label}
        </span>
      </div>
    );
  }

  // حالت solid
  if (variant === 'solid') {
    return (
      <div
        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl"
        style={{ backgroundColor: meta.color }}
      >
        <Icon size={11} color="#fff" />
        <span className="text-[11px] font-vazir-bold text-white">{meta.label}</span>
        {priceDisplay && (
          <>
            <div className="w-1 h-1 rounded-full mx-0.5 bg-white/40" />
            <span className="text-[11px] font-vazir-bold text-white">{priceDisplay}</span>
          </>
        )}
      </div>
    );
  }

  // حالت پیش‌فرض
  return (
    <div
      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border self-start"
      style={{ backgroundColor: meta.color + '18', borderColor: meta.color + '40' }}
    >
      <Icon size={14} style={{ color: meta.color }} />
      <span className="text-[13px] font-vazir-bold flex-1" style={{ color: meta.color }}>
        همکاری {meta.label}
      </span>
      {priceDisplay && (
        <div className="flex items-center gap-1">
          <div className="w-1 h-1 rounded-full" style={{ backgroundColor: meta.color + '60' }} />
          <span className="text-xs font-vazir-bold" style={{ color: meta.color }}>
            {priceDisplay}
          </span>
        </div>
      )}
    </div>
  );
}
