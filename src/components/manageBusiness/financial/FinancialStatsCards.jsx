'use client';

import { FiClock, FiRefreshCw } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import { formatPrice } from './constants';

const STAT_CARDS = [
  {
    id: 'blocked',
    key: 'blockedAmount',
    Icon: FiClock,
    label: 'بیعانه بلوکه',
    hint: 'در انتظار انجام خدمت',
    color: '#FF9800',
  },
  {
    id: 'settling',
    key: 'settlingAmount',
    Icon: FiRefreshCw,
    label: 'در حال تسویه',
    hint: 'واریز تا ۴۸ ساعت',
    color: '#2196F3',
  },
];

export default function FinancialStatsCards({ stats }) {
  const { colors } = useTheme();

  return (
    <div className="grid grid-cols-2 gap-3 mb-5">
      {STAT_CARDS.map((card) => {
        const { Icon } = card;
        return (
          <div
            key={card.id}
            className="rounded-2xl border p-4 shadow-sm"
            style={{
              backgroundColor: colors.cardBackground,
              borderColor: colors.border,
            }}
          >
            {/* آیکون */}
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center mb-3"
              style={{ backgroundColor: card.color + '18' }}
            >
              <Icon size={22} style={{ color: card.color }} />
            </div>

            {/* مبلغ */}
            <span
              className="block text-lg font-[Vazir-Bold] mb-1"
              style={{ color: colors.textMain }}
            >
              {formatPrice(stats[card.key] || 0).replace(' تومان', '')}
            </span>

            {/* لیبل */}
            <span
              className="block text-[13px] font-[Vazir-Bold] mb-1.5"
              style={{ color: colors.textMain }}
            >
              {card.label}
            </span>

            {/* زیرنویس */}
            {card.hint && (
              <span
                className="block text-[11px] font-[Vazir]"
                style={{ color: colors.textSecondary }}
              >
                {card.hint}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}