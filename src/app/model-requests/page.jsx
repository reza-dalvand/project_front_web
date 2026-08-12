// src/app/model-requests/page.jsx
'use client';
import { useState, useMemo, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import ScreenWrapper from '@/components/common/ScreenWrapper';
import AllModelRequestsHeader from '@/components/home/AllModelRequestsHeader';
import AllModelRequestsCard from '@/components/home/AllModelRequestsCard';
import EmptyState from '@/components/common/EmptyState';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import dynamic from 'next/dynamic';
import { adsService } from '@/api';
import { USE_MOCK } from '@/api/config';
import { MOCK_MODEL_REQUESTS } from '@/data/modelRequests';

// ✅ Lazy Load مدال فیلتر
const ModelRequestFilterModal = dynamic(() => import('@/components/home/ModelRequestFilterModal'), {
  ssr: false,
  loading: () => null,
});

export default function AllModelRequestsPage() {
  const router = useRouter();
  const [requests, setRequests] = useState(MOCK_MODEL_REQUESTS);
  const [filters, setFilters] = useState({
    costType: 'all',
    serviceType: 'all',
  });
  const [filterVisible, setFilterVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // ═══ دریافت لیست از API ═══
  useEffect(() => {
    const fetchRequests = async () => {
      if (USE_MOCK) return; // در حالت mock از داده‌های محلی استفاده می‌شود
      setIsLoading(true);
      try {
        const result = await adsService.getModelRequests({ page: 1 });
        setRequests(result.data || []);
      } catch (error) {
        console.error('Failed to fetch model requests:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRequests();
  }, []);

  // ═══ فیلتر ═══
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

  const handleRequestPress = useCallback(
    (request) => {
      router.push(`/model-requests/${request.id}`);
    },
    [router]
  );

  return (
    <ScreenWrapper scrollable padding={0}>
      <AllModelRequestsHeader
        requestsCount={filteredRequests.length}
        onFilterPress={() => setFilterVisible(true)}
        hasActiveFilter={hasActiveFilter}
      />
      <div className="p-4 pb-32 space-y-4">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner label="در حال بارگذاری..." />
          </div>
        ) : filteredRequests.length > 0 ? (
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
