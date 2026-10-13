// src/components/lineRentals/detail/LineRentalPriceCard.jsx
'use client';

import Card from '@/components/common/Card';
import LineRentalPriceRows from '@/components/lineRentals/LineRentalPriceRows';
import { useTheme } from '@/stores/useThemeStore';

const getAccentColor = (collabType) => {
  if (collabType === 'percent') return '#9C27B0';
  if (collabType === 'fixed') return '#2196F3';
  if (collabType === 'hourly') return '#FF9800';
  return '#607D8B';
};

const getIcon = (collabType) => {
  if (collabType === 'percent') return '📊';
  if (collabType === 'fixed') return '💰';
  if (collabType === 'hourly') return '⏰';
  return '💰';
};

export default function LineRentalPriceCard({ collabType, priceInfo }) {
  const { colors } = useTheme();
  const accent = getAccentColor(collabType);
  const icon = getIcon(collabType);

  return (
    <Card
      variant="default"
      padding={14}
      radius={14}
      style={{ borderColor: accent + '30' }}
    >
      <div className="flex items-center gap-2 mb-2">
        <span className="text-base">{icon}</span>
        <span
          className="text-sm font-[Vazir-Bold]"
          style={{ color: colors.textMain }}
        >
          شرایط همکاری
        </span>
      </div>

      <div
        className="p-3 rounded-xl border"
        style={{
          backgroundColor: accent + '08',
          borderColor: accent + '25',
        }}
      >
        <LineRentalPriceRows
          rental={{
            ...priceInfo,
            collabType,
          }}
        />
      </div>
    </Card>
  );
}