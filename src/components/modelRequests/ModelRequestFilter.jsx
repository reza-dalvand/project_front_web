// src/components/modelRequests/ModelRequestFilter.jsx
'use client';
import { useTheme } from '@/stores/useThemeStore';

const COST_FILTER_OPTIONS = [
  { id: 'all', label: 'همه' },
  { id: 'free', label: 'رایگان' },
  { id: 'material_cost', label: 'هزینه مواد' },
  { id: 'paid', label: 'با هزینه' },
];

export default function ModelRequestFilter({ activeFilter, onFilterChange }) {
  const { colors } = useTheme();

  return (
    <div className="flex gap-2 overflow-x-auto px-5 py-3 scrollbar-hide">
      {COST_FILTER_OPTIONS.map((option) => {
        const isActive = activeFilter === option.id;
        return (
          <button
            key={option.id}
            onClick={() => onFilterChange(option.id)}
            className="px-3.5 py-2 rounded-[14px] border-[1.5px] whitespace-nowrap text-xs font-[Vazir-Bold] transition-all flex-shrink-0"
            style={{
              backgroundColor: isActive ? '#E91E63' : colors.cardBackground,
              borderColor: isActive ? '#E91E63' : colors.border,
              color: isActive ? '#fff' : colors.textMain,
            }}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
