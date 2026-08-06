'use client';

import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { FiTrendingUp } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import { Card } from '@/components/common';
import { toPersianDigit, formatPrice } from '@/utils/numberUtils';

// داده‌های نمونه درآمد هفتگی
const MOCK_WEEKLY_DATA = [
  { day: 'شنبه', amount: 2450000 },
  { day: 'یک‌شنبه', amount: 1850000 },
  { day: 'دوشنبه', amount: 3200000 },
  { day: 'سه‌شنبه', amount: 2800000 },
  { day: 'چهارشنبه', amount: 4100000 },
  { day: 'پنج‌شنبه', amount: 5200000 },
  { day: 'جمعه', amount: 1200000 },
];

const CustomTooltip = ({ active, payload }) => {
  const { colors } = useTheme();
  if (active && payload && payload.length) {
    return (
      <div
        className="px-3 py-2 rounded-lg shadow-lg border"
        style={{
          backgroundColor: colors.cardBackground,
          borderColor: colors.border,
        }}
      >
        <p className="text-xs font-[Vazir-Bold]" style={{ color: colors.textMain }}>
          {payload[0].payload.day}
        </p>
        <p className="text-sm font-[Vazir-Bold] mt-1" style={{ color: colors.primary }}>
          {formatPrice(payload[0].value)}
        </p>
      </div>
    );
  }
  return null;
};

export default function WeeklyRevenueChart() {
  const { colors } = useTheme();

  const total = useMemo(() => MOCK_WEEKLY_DATA.reduce((sum, d) => sum + d.amount, 0), []);

  return (
    <div className="px-5 mt-7">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <FiTrendingUp size={18} style={{ color: colors.primary }} />
          <h2 className="text-base font-[Vazir-Bold]" style={{ color: colors.textMain }}>
            درآمد هفتگی
          </h2>
        </div>
        <button className="text-xs font-[Vazir-Medium]" style={{ color: colors.primary }}>
          گزارش کامل
        </button>
      </div>

      <Card variant="elevated" padding={16} radius={16}>
        <div style={{ width: '100%', height: 200 }}>
          <ResponsiveContainer>
            <BarChart data={MOCK_WEEKLY_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke={colors.border} />
              <XAxis
                dataKey="day"
                tick={{ fill: colors.textSecondary, fontSize: 11, fontFamily: 'Vazir' }}
                axisLine={{ stroke: colors.border }}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: colors.textSecondary, fontSize: 10, fontFamily: 'Vazir' }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `${(v / 1000000).toFixed(0)}M`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="amount" fill={colors.primary} radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* خلاصه هفتگی */}
        <div
          className="flex items-center justify-between pt-3 mt-3 border-t"
          style={{ borderColor: colors.border }}
        >
          <span className="text-xs font-[Vazir]" style={{ color: colors.textSecondary }}>
            مجموع هفتگی
          </span>
          <span className="text-sm font-[Vazir-Bold]" style={{ color: colors.textMain }}>
            {formatPrice(total)}
          </span>
        </div>
      </Card>
    </div>
  );
}
