'use client';

import { useRouter } from 'next/navigation';
import SectionHeader from '@/components/common/SectionHeader';
import SeeAllButton from '@/components/home/SeeAllButton';
import AllLineRentalsCard from '@/components/home/AllLineRentalsCard';

export default function NearbyLineRentalsSection({ nearbyLineRentals, onLinePress }) {
  const router = useRouter();

  if (!nearbyLineRentals || nearbyLineRentals.length === 0) return null;

  return (
    <section>
      <SectionHeader
        icon={<span style={{ fontSize: 18 }}>🏢</span>}
        iconColor="#8B5CF6"
        title="فرصت‌های همکاری نزدیک"
        rightElement={
          <SeeAllButton
            onPress={() => router.push('/line-rentals')}
            count={nearbyLineRentals.length}
          />
        }
      />

      <div className="-mx-1 flex gap-3.5 overflow-x-auto px-1 pb-2 scrollbar-hide">
        {nearbyLineRentals.map((ad) => (
          <div key={ad.id} className="w-[235px] flex-shrink-0 snap-start">
            <AllLineRentalsCard ad={ad} onPress={onLinePress} />
          </div>
        ))}
      </div>
    </section>
  );
}