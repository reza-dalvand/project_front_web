'use client';
import { FiDollarSign, FiBox, FiGift } from 'react-icons/fi';

const COST_TYPE_META = {
  paid: {
    label: 'با هزینه',
    icon: FiDollarSign,
    color: '#2196F3',
  },
  material_cost: {
    label: 'با هزینه مواد',
    icon: FiBox,
    color: '#FF9800',
  },
  free: {
    label: 'کاملاً رایگان',
    icon: FiGift,
    color: '#4CAF50',
  },
};

export default function CostTypeBadge({ type, variant = 'default' }) {
  const meta = COST_TYPE_META[type] || COST_TYPE_META.material_cost;
  const Icon = meta.icon;

  // Compact
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

  // Solid
  if (variant === 'solid') {
    return (
      <div
        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl shadow-md"
        style={{ backgroundColor: meta.color }}
      >
        <Icon size={11} color="#fff" />
        <span className="text-[11px] font-vazir-bold text-white">{meta.label}</span>
      </div>
    );
  }

  // Default
  return (
    <div
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border self-start"
      style={{ backgroundColor: meta.color + '18', borderColor: meta.color + '40' }}
    >
      <span className="text-xs font-vazir-bold" style={{ color: meta.color }}>
        {meta.label}
      </span>
    </div>
  );
}
