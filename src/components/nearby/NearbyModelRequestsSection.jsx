'use client';

import { useRouter } from 'next/navigation';
import SectionHeader from '@/components/common/SectionHeader';
import SeeAllButton from '@/components/home/SeeAllButton';
import AllModelRequestsCard from '@/components/home/AllModelRequestsCard';

export default function NearbyModelRequestsSection({ nearbyModelRequests, onModelPress }) {
  const router = useRouter();

  if (!nearbyModelRequests || nearbyModelRequests.length === 0) return null;

  return (
    <section>
      <SectionHeader
        icon={<span style={{ fontSize: 18 }}>👤</span>}
        iconColor="#E91E63"
        title="فرصت‌های مدلینگ نزدیک"
        rightElement={
          <SeeAllButton
            onPress={() => router.push('/model-requests')}
            count={nearbyModelRequests.length}
          />
        }
      />

      <div className="-mx-1 flex gap-3.5 overflow-x-auto px-1 pb-2 scrollbar-hide">
        {nearbyModelRequests.map((req) => (
          <div key={req.id} className="w-[235px] flex-shrink-0 snap-start">
            <AllModelRequestsCard request={req} onPress={onModelPress} />
          </div>
        ))}
      </div>
    </section>
  );
}