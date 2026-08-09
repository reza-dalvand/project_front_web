'use client';
import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import ScreenWrapper from '@/components/common/ScreenWrapper';
import AllModelRequestsHeader from '@/components/home/AllModelRequestsHeader';
import AllModelRequestsCard from '@/components/home/AllModelRequestsCard';
import EmptyState from '@/components/common/EmptyState';
import dynamic from 'next/dynamic';
import { MOCK_MODEL_REQUESTS } from '@/data/modelRequests';

// ✅ Lazy Load
const ModelRequestFilterModal = dynamic(() => import('@/components/home/ModelRequestFilterModal'), {
  ssr: false,
  loading: () => null,
});

export default function AllModelRequestsPage() {
  const router = useRouter();
  const [requests] = useState(MOCK_MODEL_REQUESTS);
  const [filters, setFilters] = useState({
    costType: 'all',
    serviceType: 'all',
  });
  const [filterVisible, setFilterVisible] = useState(false);

  const filteredRequests = useMemo(() => {
    let data = [...requests];
    if (filters.costType !== 'all') {
      data = data.filter((r) => r.costType === filters.costType);
    }
    if (filters.serviceType !== 'all') {
      data = data.filter((r) => r.serviceTypeId === filters.serviceType);
    }
    return data;
  }, [requests, filters]);

  const hasActiveFilter = filters.costType !== 'all' || filters.serviceType !== 'all';

  const handleRequestPress = (request) => {
    router.push(`/model-requests/${request.id}`);
  };

  return (
    <ScreenWrapper scrollable padding={0}>
      <AllModelRequestsHeader
        requestsCount={filteredRequests.length}
        onFilterPress={() => {
          // TODO: باز کردن مدال فیلتر
        }}
        hasActiveFilter={hasActiveFilter}
      />

      <div className="p-4 pb-32 space-y-4">
        {filteredRequests.length > 0 ? (
          filteredRequests.map((request) => (
            <AllModelRequestsCard key={request.id} request={request} onPress={handleRequestPress} />
          ))
        ) : (
          <EmptyState
            icon="👤"
            title="فعلاً فرصت مدلینگی وجود ندارد"
            description="به زودی فرصت‌های جدید اضافه می‌شود"
          />
        )}
      </div>
      <ModelRequestFilterModal
        visible={filterVisible}
        onClose={() => setFilterVisible(false)}
        onApply={setFilters}
        currentFilters={filters}
      />
    </ScreenWrapper>
  );
}
