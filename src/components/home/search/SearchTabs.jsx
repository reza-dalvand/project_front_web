'use client';

import { FiGrid, FiHome, FiUsers, FiBriefcase } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import { toPersianDigit } from '@/utils/numberUtils';

const TABS = [
  { id: 'all', label: 'همه', icon: FiGrid },
  { id: 'businesses', label: 'کسب‌وکار', icon: FiHome },
  { id: 'modelRequests', label: 'مدلینگ', icon: FiUsers },
  { id: 'lineRentals', label: 'اجاره لاین', icon: FiBriefcase },
];

export default function SearchTabs({ activeTab, counts, onChange }) {
  const { colors } = useTheme();

  return (
    <div
      className="flex gap-2 px-4 py-3 overflow-x-auto scrollbar-hide"
      style={{ backgroundColor: colors.background }}
    >
      {TABS.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        const count = counts[tab.id] || 0;

        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl border whitespace-nowrap transition-all"
            style={{
              backgroundColor: isActive ? colors.primary : colors.cardBackground,
              borderColor: isActive ? colors.primary : colors.border,
            }}
          >
            <Icon size={16} color={isActive ? '#fff' : colors.textSecondary} />
            <span
              className="text-sm font-[Vazir-Bold]"
              style={{ color: isActive ? '#fff' : colors.textMain }}
            >
              {tab.label}
            </span>
            {count > 0 && (
              <span
                className="min-w-[22px] h-5 px-1.5 rounded-full flex items-center justify-center text-xs font-[Vazir-Bold]"
                style={{
                  backgroundColor: isActive ? 'rgba(255,255,255,0.3)' : colors.primary + '20',
                  color: isActive ? '#fff' : colors.primary,
                }}
              >
                {toPersianDigit(count)}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}