'use client';

import { FiCalendar, FiTrendingUp, FiStar, FiUsers } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import { Card } from '@/components/common';
import { toPersianDigit } from '@/utils/numberUtils';

export default function StatsSection({ stats }) {
  const { colors } = useTheme();

  const statsConfig = [
    {
      key: 'todayAppointments',
      label: 'نوبت امروز',
      icon: <FiCalendar size={22} />,
      color: '#667eea',
      bg: '#667eea15',
    },
    {
      key: 'monthlyRevenue',
      label: 'درآمد ماهانه',
      icon: <FiTrendingUp size={22} />,
      color: '#43e97b',
      bg: '#43e97b15',
      format: 'price',
    },
    {
      key: 'totalBookings',
      label: 'کل رزروها',
      icon: <FiUsers size={22} />,
      color: '#4facfe',
      bg: '#4facfe15',
    },
    {
      key: 'rating',
      label: 'امتیاز کل',
      icon: <FiStar size={22} />,
      color: '#FFC107',
      bg: '#FFC10715',
      format: 'rating',
    },
  ];

  const formatValue = (value, format) => {
    if (format === 'price') {
      const millions = (value / 1000000).toFixed(1);
      return `${toPersianDigit(millions)}M`;
    }
    if (format === 'rating') {
      return toPersianDigit(Number(value).toFixed(1));
    }
    return toPersianDigit(value);
  };

  return (
    <div className="grid grid-cols-2 gap-3 px-5 mt-6">
      {statsConfig.map((stat) => (
        <Card key={stat.key} variant="elevated" padding={14} radius={16}>
          <div className="flex flex-col items-center gap-2 text-center">
            <div
              className="w-11 h-11 rounded-full flex items-center justify-center"
              style={{ backgroundColor: stat.bg }}
            >
              <span style={{ color: stat.color }}>{stat.icon}</span>
            </div>
            <span className="text-2xl font-[Vazir-Bold]" style={{ color: colors.textMain }}>
              {formatValue(stats[stat.key], stat.format)}
            </span>
            <span className="text-xs font-[Vazir]" style={{ color: colors.textSecondary }}>
              {stat.label}
            </span>
          </div>
        </Card>
      ))}
    </div>
  );
}
