'use client';
import { useTheme } from '@/stores/useThemeStore';
import Card from '@/components/common/Card';
import StatsCard from '@/components/common/StatsCard';
import { toPersianDigit, formatPriceShort } from '@/utils/numberUtils';

export default function ServiceStats({ services }) {
  const { colors } = useTheme();
  const total = services.length;
  const active = services.filter((s) => s.isActive !== false).length;
  const avgPrice = total > 0
    ? Math.round(services.reduce((sum, s) => sum + (s.finalPrice || s.originalPrice || 0), 0) / total)
    : 0;

  return (
    <Card variant="elevated" padding={16} radius={20} className="mx-5 mb-4">
      <div className="flex items-center">
        <StatsCard
          icon="apps"
          label="کل خدمات"
          value={toPersianDigit(total)}
          color="#667eea"
          variant="compact"
        />
        <div className="w-px h-10 mx-2" style={{ backgroundColor: colors.border }} />
        <StatsCard
          icon="check-circle"
          label="فعال"
          value={toPersianDigit(active)}
          color="#43A047"
          variant="compact"
        />
        <div className="w-px h-10 mx-2" style={{ backgroundColor: colors.border }} />
        <StatsCard
          icon="trending-up"
          label="میانگین قیمت"
          value={formatPriceShort(avgPrice)}
          color="#FF9800"
          variant="compact"
        />
      </div>
    </Card>
  );
}