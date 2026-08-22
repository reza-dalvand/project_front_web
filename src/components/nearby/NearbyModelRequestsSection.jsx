// src/components/nearby/NearbyModelRequestsSection.jsx
'use client';

import { useRouter } from 'next/navigation';
import { useTheme } from '@/stores/useThemeStore';
import SectionHeader from '@/components/common/SectionHeader';
import SeeAllButton from '@/components/home/SeeAllButton';
import AllModelRequestsCard from '@/components/home/AllModelRequestsCard';

export default function NearbyModelRequestsSection({ nearbyModelRequests, onModelPress }) {
  const { colors } = useTheme();
  const router = useRouter();

  if (!nearbyModelRequests || nearbyModelRequests.length === 0) return null;

  return (
    <section>
      <SectionHeader
        icon={<span style={{ fontSize: 18 }}>👤</span>}
        iconColor="#E91E63"
        title="فرصت‌های مدلینگ نزدیک"
        rightElement={
          <SeeAllButton onPress={() => router.push('/model-requests')} count={nearbyModelRequests.length} />
        }
      />
      <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide">
        {nearbyModelRequests.map((req) => (
          <div key={req.id} className="flex-shrink-0 w-[220px]">
            <AllModelRequestsCard request={req} onPress={onModelPress} />
          </div>
        ))}
      </div>
    </section>
  );
}