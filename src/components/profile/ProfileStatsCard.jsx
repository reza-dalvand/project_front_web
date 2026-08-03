'use client';

import { useTheme } from '@/stores/useThemeStore';
import { Card } from '@/components/common';
import { toPersianDigit } from '@/utils/numberUtils';

export default function ProfileStatsCard({ stats }) {
  const { colors } = useTheme();

  return (
    <Card variant="elevated" padding={0} radius={20} className="mb-6">
      <div className="flex py-5">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={stat.id} className="flex flex-1 flex-col items-center gap-2 relative">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center mb-1"
                style={{ backgroundColor: stat.color + '20' }}
              >
                {Icon && <Icon size={24} color={stat.color} />}
              </div>
              <span
                className="text-xl font-[Vazir-Bold]"
                style={{ color: colors.textMain }}
              >
                {toPersianDigit(stat.value)}
              </span>
              <span
                className="text-xs"
                style={{ color: colors.textSecondary }}
              >
                {stat.label}
              </span>

              {index < stats.length - 1 && (
                <div
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-px h-[60%]"
                  style={{ backgroundColor: colors.border }}
                />
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
}