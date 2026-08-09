'use client';
import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/stores/useThemeStore';
import ScreenWrapper from '@/components/common/ScreenWrapper';
import EmptyState from '@/components/common/EmptyState';
import AllLineRentalsHeader from '@/components/home/AllLineRentalsHeader';
import AllLineRentalsCard from '@/components/home/AllLineRentalsCard';
import dynamic from 'next/dynamic';
import { MOCK_LINE_RENTALS } from '@/data/lineRentals';

// ✅ Lazy Load
const LineRentalFilterModal = dynamic(() => import('@/components/home/LineRentalFilterModal'), {
  ssr: false,
  loading: () => null,
});

export default function AllLineRentalsPage() {
  const { colors } = useTheme();
  const router = useRouter();
  const [filterVisible, setFilterVisible] = useState(false);
  const [filters, setFilters] = useState({
    collabType: 'all',
    serviceType: 'all',
  });

  // فیلتر آگهی‌ها
  const filteredAds = useMemo(() => {
    let data = [...MOCK_LINE_RENTALS];

    if (filters.collabType !== 'all') {
      data = data.filter((a) => a.collabType === filters.collabType);
    }

    if (filters.serviceType !== 'all') {
      data = data.filter((a) => a.serviceTypeId === filters.serviceType);
    }

    return data;
  }, [filters]);

  const hasActiveFilter = filters.collabType !== 'all' || filters.serviceType !== 'all';

  const handleAdPress = (ad) => {
    router.push(`/line-rentals/${ad.id}`);
  };

  return (
    <ScreenWrapper scrollable={false} padding={0}>
      <AllLineRentalsHeader
        adsCount={filteredAds.length}
        onFilterPress={() => setFilterVisible(true)}
        hasActiveFilter={hasActiveFilter}
      />

      {/* لیست آگهی‌ها */}
      <div className="flex-1 overflow-y-auto p-4 pb-28">
        {filteredAds.length > 0 ? (
          filteredAds.map((ad) => (
            <AllLineRentalsCard key={ad.id} ad={ad} onPress={handleAdPress} />
          ))
        ) : (
          <EmptyState title="آگهی لاینی یافت نشد" description="فیلترهای خود را تغییر دهید" />
        )}
      </div>

      {/* مدال فیلتر */}
      <LineRentalFilterModal
        visible={filterVisible}
        onClose={() => setFilterVisible(false)}
        onApply={setFilters}
        currentFilters={filters}
      />
    </ScreenWrapper>
  );
}
