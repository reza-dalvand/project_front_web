// src/app/line-rentals/page.jsx
'use client';
import { useState, useMemo, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import ScreenWrapper from '@/components/common/ScreenWrapper';
import AllLineRentalsHeader from '@/components/home/AllLineRentalsHeader';
import AllLineRentalsCard from '@/components/home/AllLineRentalsCard';
import EmptyState from '@/components/common/EmptyState';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import dynamic from 'next/dynamic';
import { adsService } from '@/api';
import { USE_MOCK } from '@/api/config';
import { MOCK_LINE_RENTALS } from '@/data/lineRentals';

// ✅ Lazy Load مدال فیلتر
const LineRentalFilterModal = dynamic(() => import('@/components/home/LineRentalFilterModal'), {
  ssr: false,
  loading: () => null,
});

export default function AllLineRentalsPage() {
  const router = useRouter();
  const [ads, setAds] = useState(MOCK_LINE_RENTALS);
  const [filters, setFilters] = useState({
    collabType: 'all',
    serviceType: 'all',
  });
  const [filterVisible, setFilterVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // ═══ دریافت لیست از API ═══
  useEffect(() => {
    const fetchAds = async () => {
      if (USE_MOCK) return;
      setIsLoading(true);
      try {
        const result = await adsService.getLineRentals({ page: 1 });
        setAds(result.data || []);
      } catch (error) {
        console.error('Failed to fetch line rentals:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAds();
  }, []);

  // ═══ فیلتر ═══
  const filteredAds = useMemo(() => {
    let data = [...ads];
    if (filters.collabType !== 'all') {
      data = data.filter((a) => a.collabType === filters.collabType);
    }
    if (filters.serviceType !== 'all') {
      data = data.filter((a) => a.serviceTypeId === filters.serviceType);
    }
    return data;
  }, [ads, filters]);

  const hasActiveFilter = filters.collabType !== 'all' || filters.serviceType !== 'all';

  const handleAdPress = useCallback(
    (ad) => {
      router.push(`/line-rentals/${ad.id}`);
    },
    [router]
  );

  return (
    <ScreenWrapper scrollable padding={0}>
      <AllLineRentalsHeader
        adsCount={filteredAds.length}
        onFilterPress={() => setFilterVisible(true)}
        hasActiveFilter={hasActiveFilter}
      />
      <div className="p-4 pb-32 space-y-4">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner label="در حال بارگذاری..." />
          </div>
        ) : filteredAds.length > 0 ? (
          filteredAds.map((ad) => (
            <AllLineRentalsCard key={ad.id} ad={ad} onPress={handleAdPress} />
          ))
        ) : (
          <EmptyState
            icon="🏢"
            title="فعلاً آگهی لاینی وجود ندارد"
            description="به زودی آگهی‌های جدید اضافه می‌شود"
          />
        )}
      </div>
      <LineRentalFilterModal
        visible={filterVisible}
        onClose={() => setFilterVisible(false)}
        onApply={setFilters}
        currentFilters={filters}
      />
    </ScreenWrapper>
  );
}
