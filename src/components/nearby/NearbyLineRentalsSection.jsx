// src/components/nearby/NearbyLineRentalsSection.jsx
'use client';

import { useRouter } from 'next/navigation';
import { useTheme } from '@/stores/useThemeStore';
import SectionHeader from '@/components/common/SectionHeader';
import SeeAllButton from '@/components/home/SeeAllButton';
import AllLineRentalsCard from '@/components/home/AllLineRentalsCard';

export default function NearbyLineRentalsSection({ nearbyLineRentals, onLinePress }) {
  const { colors } = useTheme();
  const router = useRouter();

  if (!nearbyLineRentals || nearbyLineRentals.length === 0) return null;

  return (
    <section>
      <SectionHeader
        icon={<span style={{ fontSize: 18 }}>🏢</span>}
        iconColor="#667eea"
        title="فرصت‌های همکاری نزدیک"
        rightElement={
          <SeeAllButton
            onPress={() => router.push('/line-rentals')}
            count={nearbyLineRentals.length}
          />
        }
      />
      <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide">
        {nearbyLineRentals.map((ad) => (
          <div key={ad.id} className="flex-shrink-0 w-[220px]">
            <AllLineRentalsCard ad={ad} onPress={onLinePress} />
          </div>
        ))}
      </div>
    </section>
  );
}
