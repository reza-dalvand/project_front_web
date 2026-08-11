'use client';
import { FiCreditCard, FiTag, FiCheckCircle } from 'react-icons/fi';
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
            icon={<FiCreditCard size={18} />}
            label="مجموع پرداختی"
            value={formatPrice(stats.totalPaid).replace(' تومان', '')}
            color="#43A047"
            variant="compact"
          />
          <div className="w-px h-10 mx-2" style={{ backgroundColor: colors.border }} />
          <StatsCard
            icon={<FiTag size={18} />}
            label="مجموع تخفیف‌ها"
            value={formatPrice(stats.totalDiscount).replace(' تومان', '')}
            color="#FF9800"
            variant="compact"
          />
          <div className="w-px h-10 mx-2" style={{ backgroundColor: colors.border }} />
          <StatsCard
            icon={<FiCheckCircle size={18} />}
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