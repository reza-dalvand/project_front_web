// src/components/lineRentals/LineRentalFilter.jsx
'use client';
import { useTheme } from '@/stores/useThemeStore';

const COLLAB_FILTER_OPTIONS = [
  { id: 'all', label: 'همه', icon: '📋' },
  { id: 'percent', label: 'درصدی', icon: '📊' },
  { id: 'fixed', label: 'اجاره ثابت', icon: '💰' },
  { id: 'hourly', label: 'ساعتی', icon: '⏰' },
];

export default function LineRentalFilter({ activeFilter, onFilterChange }) {
  const { colors } = useTheme();

  return (
    <div className="flex gap-2 overflow-x-auto px-5 py-3 scrollbar-hide">
      {COLLAB_FILTER_OPTIONS.map((option) => {
        const isActive = activeFilter === option.id;
        return (
          <button
            key={option.id}
            onClick={() => onFilterChange(option.id)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-[14px] border-[1.5px] whitespace-nowrap text-xs font-[Vazir-Bold] transition-all flex-shrink-0"
            style={{
              backgroundColor: isActive ? '#667eea' : colors.cardBackground,
              borderColor: isActive ? '#667eea' : colors.border,
              color: isActive ? '#fff' : colors.textMain,
            }}
          >
            <span>{option.icon}</span>
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
