'use client';
import { useTheme } from '@/stores/useThemeStore';
import { Card } from '@/components/common';
import StatsCard from '@/components/common/StatsCard';
import { toPersianDigit } from '@/utils/numberUtils';

export default function LineRentalStats({ ads }) {
  const { colors } = useTheme();

  const stats = {
    total: ads.length,
    active: ads.filter((a) => a.status === 'active').length,
  };

  return (
    <Card variant="elevated" padding={14} radius={18}>
      <div className="flex items-center">
        <StatsCard
          icon="🏢"
          label="کل آگهی‌ها"
          value={toPersianDigit(stats.total)}
          color="#667eea"
          variant="compact"
        />
        <div className="w-px h-10 mx-2" style={{ backgroundColor: colors.border }} />
        <StatsCard
          icon="✅"
          label="فعال"
          value={toPersianDigit(stats.active)}
          color="#4CAF50"
          variant="compact"
        />
      </div>
    </Card>
  );
}
