'use client';

import { FiClock, FiRefreshCw, FiCheckCircle, FiTrendingUp } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import StatsCard from '@/components/common/StatsCard';
import { formatPrice } from './constants';

const STAT_CARDS = [
  {
    id: 'blocked',
    key: 'blockedAmount',
    icon: <FiClock size={18} />,
    label: 'بیعانه بلوکه',
    hint: 'در انتظار انجام خدمت',
    color: '#FF9800',
  },
  {
    id: 'settling',
    key: 'settlingAmount',
    icon: <FiRefreshCw size={18} />,
    label: 'در حال تسویه',
    hint: 'واریز تا ۴۸ ساعت',
    color: '#2196F3',
  },
  {
    id: 'settled',
    key: 'settledAmount',
    icon: <FiCheckCircle size={18} />,
    label: 'کل درآمد تسویه‌شده',
    hint: 'به حساب شما واریز شده',
    color: '#43A047',
  },
  {
    id: 'total',
    key: 'totalAmount',
    icon: <FiTrendingUp size={18} />,
    label: 'کل تراکنش‌ها',
    hint: 'از ابتدا تا امروز',
    color: '#9C27B0',
  },
];

export default function FinancialStatsCards({ stats }) {
  const { colors } = useTheme();

  return (
    <div className="grid grid-cols-2 gap-2.5 mb-5">
      {STAT_CARDS.map((card) => (
        <StatsCard
          key={card.id}
          icon={card.icon}
          label={card.label}
          value={formatPrice(stats[card.key]).replace(' تومان', '')}
          subtitle={card.hint}
          color={card.color}
          variant="horizontal"
        />
      ))}
    </div>
  );
}
