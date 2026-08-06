// src/components/profile/paymentHistory/PaymentStatsCard.jsx
'use client';
import { useTheme } from '@/stores/useThemeStore';
import Card from '@/components/common/Card';
import StatsCard from '@/components/common/StatsCard';
import { toPersianDigit, formatPrice } from '@/utils/numberUtils';

export default function PaymentStatsCard({ stats }) {
  const { colors } = useTheme();

  if (!stats) return null;

  return (
    <div className="mb-4">
      <Card variant="elevated" padding={14} radius={18}>
        <div className="flex items-center">
          <StatsCard
            icon="account-balance-wallet"
            label="مجموع پرداختی"
            value={formatPrice(stats.totalPaid).replace(' تومان', '')}
            color="#43A047"
            variant="compact"
          />
          <div className="w-px h-10 mx-2" style={{ backgroundColor: colors.border }} />
          <StatsCard
            icon="tag"
            label="مجموع تخفیف‌ها"
            value={formatPrice(stats.totalDiscount).replace(' تومان', '')}
            color="#FF9800"
            variant="compact"
          />
          <div className="w-px h-10 mx-2" style={{ backgroundColor: colors.border }} />
          <StatsCard
            icon="check-circle"
            label="تراکنش موفق"
            value={toPersianDigit(stats.successCount)}
            color={colors.primary}
            variant="compact"
          />
        </div>
      </Card>
    </div>
  );
}
