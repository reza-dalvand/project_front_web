// src/components/manageBusiness/services/ServiceStats.jsx
'use client';
import { FiBox, FiCheckCircle } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import Card from '@/components/common/Card';
import StatsCard from '@/components/common/StatsCard';
import { toPersianDigit } from '@/utils/numberUtils';

export default function ServiceStats({ services }) {
  const { colors } = useTheme();
  const total = services.length;
  const active = services.filter((s) => s.isActive !== false).length;

  return (
    <Card variant="elevated" padding={16} radius={20} className="mx-5 mb-4">
      <div className="flex items-center">
        <StatsCard
          icon={<FiBox size={18} />}
          label="کل خدمات"
          value={toPersianDigit(total)}
          color="#667eea"
          variant="compact"
        />
        <div className="w-px h-10 mx-2" style={{ backgroundColor: colors.border }} />
        <StatsCard
          icon={<FiCheckCircle size={18} />}
          label="فعال"
          value={toPersianDigit(active)}
          color="#43A047"
          variant="compact"
        />
      </div>
    </Card>
  );
}
