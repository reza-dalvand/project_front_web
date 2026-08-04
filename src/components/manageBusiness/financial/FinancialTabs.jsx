'use client';

import { FiClock, FiRefreshCw, FiCheckCircle, FiRotateCcw, FiList } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import { TX_TABS, TX_STATUS_META } from './constants';
import { toPersianDigit } from '@/utils/numberUtils';

const TAB_ICONS = {
  all: <FiList size={14} />,
  blocked: <FiClock size={14} />,
  settling: <FiRefreshCw size={14} />,
  settled: <FiCheckCircle size={14} />,
  refunded: <FiRotateCcw size={14} />,
};

export default function FinancialTabs({ active, counts, onChange }) {
  const { colors } = useTheme();

  return (
    <div className="overflow-x-auto pb-1 scrollbar-hide mb-4">
      <div className="flex gap-2 px-0.5">
        {TX_TABS.map((tab) => {
          const isActive = active === tab.id;
          const meta = TX_STATUS_META[tab.id];
          const color = meta ? meta.color : '#607D8B';
          const count = counts[tab.id] || 0;

          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-[22px] border whitespace-nowrap
                transition-all duration-200"
              style={{
                backgroundColor: isActive ? color : colors.cardBackground,
                borderColor: isActive ? color : colors.border,
                boxShadow: isActive ? `0 3px 8px ${color}40` : 'none',
              }}
            >
              <span style={{ color: isActive ? '#fff' : color }}>
                {TAB_ICONS[tab.id]}
              </span>
              <span
                className="text-xs font-[Vazir-Bold]"
                style={{ color: isActive ? '#fff' : colors.textMain }}
              >
                {tab.label}
              </span>
              {count > 0 && (
                <span
                  className="min-w-[22px] h-[22px] rounded-full flex items-center justify-center
                    px-1.5 text-[11px] font-[Vazir-Bold]"
                  style={{
                    backgroundColor: isActive ? 'rgba(255,255,255,0.28)' : colors.border + '60',
                    color: isActive ? '#fff' : colors.textSecondary,
                  }}
                >
                  {toPersianDigit(count)}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}