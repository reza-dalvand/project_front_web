'use client';

import { useTheme } from '@/stores/useThemeStore';
import { Card } from '@/components/common';
import { toPersianDigit } from '@/utils/numberUtils';

export default function ProfileStatsCard({ stats }) {
  const { colors } = useTheme();

  const items = Array.isArray(stats) ? stats : [];
  const isCompact = items.length >= 3;

  if (items.length === 0) {
    return null;
  }

  return (
    <Card variant="elevated" padding={0} radius={20} className="mb-6">
      <div
        className="grid"
        style={{
          gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))`,
        }}
      >
        {items.map((stat, index) => {
          const Icon = stat.icon;
          const iconColor = stat.color || colors.primary;

          return (
            <div
              key={stat.id ?? index}
              className={`relative flex min-w-0 flex-col items-center justify-center ${
                isCompact ? 'gap-1.5 px-1.5 py-4' : 'gap-2 px-2 py-5'
              }`}
            >
              <div
                className={`flex items-center justify-center rounded-full ${
                  isCompact ? 'h-10 w-10' : 'h-12 w-12'
                }`}
                style={{ backgroundColor: `${iconColor}1A` }}
              >
                {Icon && <Icon size={isCompact ? 20 : 24} color={iconColor} />}
              </div>

              <span
                className={`${
                  isCompact ? 'text-base' : 'text-xl'
                } font-[Vazir-Bold] leading-none`}
                style={{ color: colors.textMain }}
              >
                {toPersianDigit(stat.value)}
              </span>

              <span
                className={`w-full truncate text-center font-[Vazir] ${
                  isCompact ? 'text-[10px]' : 'text-xs'
                }`}
                style={{ color: colors.textSecondary }}
              >
                {stat.label}
              </span>

              {index < items.length - 1 && (
                <div
                  className={`absolute left-0 top-1/2 -translate-y-1/2 w-px ${
                    isCompact ? 'h-8' : 'h-10'
                  }`}
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