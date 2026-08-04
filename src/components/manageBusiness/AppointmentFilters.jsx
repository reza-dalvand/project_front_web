'use client';

import { FiGrid, FiCalendar, FiXCircle, FiCheckCircle } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import { toPersianDigit } from '@/utils/numberUtils';

const FILTERS = [
  { id: 'all', label: 'همه', icon: FiGrid, color: '#607D8B' },
  { id: 'reserved', label: 'رزرو شده', icon: FiCalendar, color: '#2196F3' },
  { id: 'cancelled', label: 'لغو شده', icon: FiXCircle, color: '#E53935' },
  { id: 'done', label: 'انجام شده', icon: FiCheckCircle, color: '#43A047' },
];

export default function AppointmentFilters({ activeFilter, counts, onChange }) {
  const { colors } = useTheme();

  return (
    <div
      className="py-3 border-b overflow-x-auto"
      style={{
        borderBottomColor: colors.border,
        backgroundColor: colors.background,
      }}
    >
      <div className="flex gap-2 px-4 whitespace-nowrap">
        {FILTERS.map((f) => {
          const Icon = f.icon;
          const isActive = activeFilter === f.id;
          const count = counts[f.id] || 0;

          return (
            <button
              key={f.id}
              onClick={() => onChange(f.id)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-[20px] border-[1.5px] transition-all"
              style={{
                backgroundColor: isActive ? f.color + '20' : colors.cardBackground,
                borderColor: isActive ? f.color : colors.border,
              }}
            >
              <Icon
                size={15}
                style={{ color: isActive ? f.color : colors.textSecondary }}
              />
              <span
                className="text-[13px] font-[Vazir-Bold]"
                style={{ color: isActive ? f.color : colors.textMain }}
              >
                {f.label}
              </span>
              <span
                className="min-w-[22px] h-[22px] rounded-full flex items-center justify-center px-1.5 text-[11px] font-[Vazir-Bold] text-white"
                style={{ backgroundColor: isActive ? f.color : colors.border }}
              >
                {toPersianDigit(count)}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}