'use client';

import { FiDollarSign, FiBox, FiGift } from 'react-icons/fi';

// متادیتای انواع هزینه مدلینگ
const COST_TYPE_META = {
  paid: {
    label: 'با هزینه',
    icon: FiDollarSign,
    color: '#2196F3',
    bg: '#2196F318',
    border: '#2196F340',
  },
  material_cost: {
    label: 'با هزینه مواد',
    icon: FiBox,
    color: '#FF9800',
    bg: '#FF980018',
    border: '#FF980040',
  },
  free: {
    label: 'کاملاً رایگان',
    icon: FiGift,
    color: '#4CAF50',
    bg: '#4CAF5018',
    border: '#4CAF5040',
  },
};

/**
 * کامپوننت نشانگر نوع هزینه مدلینگ
 *
 * @param {string} type - نوع هزینه (paid, material_cost, free)
 * @param {'default'|'solid'|'compact'} variant - نوع نمایش
 */
export default function CostTypeBadge({ type, variant = 'default' }) {
  const meta = COST_TYPE_META[type] || COST_TYPE_META.material_cost;
  const Icon = meta.icon;

  // Compact - کوچک
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
        <span className="text-[10px] font-[Vazir-Bold]" style={{ color: meta.color }}>
          {meta.label}
        </span>
      </div>
    );
  }

  // Solid - پررنگ
  if (variant === 'solid') {
    return (
      <div
        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl shadow-md"
        style={{ backgroundColor: meta.color }}
      >
        <Icon size={11} color="#fff" />
        <span className="text-[11px] font-[Vazir-Bold] text-white">{meta.label}</span>
      </div>
    );
  }

  // Default
  return (
    <div
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border self-start"
      style={{
        backgroundColor: meta.bg,
        borderColor: meta.border,
      }}
    >
      <span className="text-xs font-[Vazir-Bold]" style={{ color: meta.color }}>
        {meta.label}
      </span>
    </div>
  );
}
