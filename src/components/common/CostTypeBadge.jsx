'use client';

import { FiDollarSign, FiBox, FiGift } from 'react-icons/fi';

const COST_TYPE_META = {
  paid: {
    label: 'با هزینه',
    icon: FiDollarSign,
    color: '#EC4899',
  },
  material_cost: {
    label: 'با هزینه مواد',
    icon: FiBox,
    color: '#D97706',
  },
  free: {
    label: 'کاملاً رایگان',
    icon: FiGift,
    color: '#059669',
  },
};

export default function CostTypeBadge({ type, variant = 'default' }) {
  const meta = COST_TYPE_META[type] || COST_TYPE_META.material_cost;
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
      </div>
    );
  }

  return (
    <div
      className="inline-flex items-center gap-1.5 self-start rounded-full border px-3 py-1.5"
      style={{
        backgroundColor: `${meta.color}12`,
        borderColor: `${meta.color}30`,
      }}
    >
      <Icon size={13} style={{ color: meta.color }} />
      <span
        className="text-[12px] font-[Vazir-Bold] leading-none"
        style={{ color: meta.color }}
      >
        {meta.label}
      </span>
    </div>
  );
}