'use client';
import { useTheme } from '@/stores/useThemeStore';
import { Card } from '@/components/common';
import StatsCard from '@/components/common/StatsCard';
import { toPersianDigit } from '@/utils/numberUtils';

export default function ModelRequestStats({ requests }) {
  const { colors } = useTheme();

  const stats = {
    total: requests.length,
    active: requests.filter((r) => r.status === 'active').length,
    inactive: requests.filter((r) => r.status === 'inactive').length,
  };

  return (
    <Card variant="elevated" padding={14} radius={18}>
      <div className="flex items-center">
        <StatsCard
          icon="📋"
          label="کل درخواست‌ها"
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
        <div className="w-px h-10 mx-2" style={{ backgroundColor: colors.border }} />
        <StatsCard
          icon="🚫"
          label="غیرفعال"
          value={toPersianDigit(stats.inactive)}
          color="#E53935"
          variant="compact"
        />
      </div>
    </Card>
  );
}
