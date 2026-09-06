'use client';
import { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { FiFilter } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import ScreenWrapper from '@/components/common/ScreenWrapper';
import CategoryHeader from '@/components/home/CategoryHeader';
import BusinessListCard from '@/components/home/BusinessListCard';
import EmptyState from '@/components/common/EmptyState';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import dynamic from 'next/dynamic';
import { businessesService } from '@/api';
import { useGlobalLocationStore } from '@/stores/useGlobalLocationStore';

const CategoryFilterModal = dynamic(() => import('@/components/home/CategoryFilterModal'), {
  ssr: false,
  loading: () => null,
});

export default function CategoryBusinessesPage({ categoryId }) {
  const router = useRouter();
  const { colors } = useTheme();

  const [categoryName, setCategoryName] = useState('دسته‌بندی');
  const [businesses, setBusinesses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterVisible, setFilterVisible] = useState(false);
  const [filters, setFilters] = useState({
    serviceType: null,
    sortBy: 'all',
  });

  // ✅ FIX: استفاده از subscribe برای اطمینان از re-render
  const [locationState, setLocationState] = useState({
    provinceId: null,
    cityId: null,
    latitude: null,
    longitude: null,
    gpsEnabled: false,
    locationType: 'all',
  });

  useEffect(() => {
    // Subscribe به تغییرات استور
    const unsubscribe = useGlobalLocationStore.subscribe((state) => {
      setLocationState({
        provinceId: state.provinceId,
        cityId: state.cityId,
        latitude: state.latitude,
        longitude: state.longitude,
        gpsEnabled: state.gpsEnabled,
        locationType: state.locationType,
      });
    });
    
    // Initial state
    const initialState = useGlobalLocationStore.getState();
    setLocationState({
      provinceId: initialState.provinceId,
      cityId: initialState.cityId,
      latitude: initialState.latitude,
      longitude: initialState.longitude,
      gpsEnabled: initialState.gpsEnabled,
      locationType: initialState.locationType,
    });

    return () => unsubscribe();
  }, []);

  const getLocationParams = useCallback(() => {
    return useGlobalLocationStore.getState().getLocationParams();
  }, []);

  // ═══════ FIX: دریافت لیست با dependency صحیح ═══════
  useEffect(() => {
    const fetchBusinesses = async () => {
      setIsLoading(true);
      try {
        const locationParams = getLocationParams();
        const response = await businessesService.getBusinessList({
          category_id: categoryId,
          page_size: 50,
          ...locationParams,
          _t: Date.now(), // ✅ Cache buster
        });
        const data = response.data || [];
        setBusinesses(
          data.map((b) => ({
            id: b.id,
            bookingSlug: b.bookingSlug || b.id,
            name: b.name,
            category: b.categoryName || '',
            city: b.cityName || '',
            address: b.address,
            rating: b.rating || 0,
            reviewsCount: b.reviewsCount || 0,
            logo: b.logo,
            VIP: b.isVip,
            discount: b.discount || 0,
            distanceText: b.distance ? `${b.distance.toFixed(1)} km` : null,
          }))
        );
      } catch (error) {
        console.error('Failed to fetch category businesses:', error);
        setBusinesses([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBusinesses();
  }, [
    categoryId,
    locationState.provinceId,
    locationState.cityId,
    locationState.latitude,
    locationState.longitude,
    locationState.gpsEnabled,
    locationState.locationType,
    getLocationParams,
  ]);

  const hasActiveFilter =
    (filters.serviceType && filters.serviceType !== 'all') || filters.sortBy !== 'all';

  const filteredData = useMemo(() => {
    let data = [...businesses];
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      data = data.filter(
        (item) =>
          item.name.toLowerCase().includes(q) ||
          (item.address && item.address.toLowerCase().includes(q)) ||
          (item.category && item.category.toLowerCase().includes(q))
      );
    }
    if (filters.sortBy === 'top_rated') {
      data.sort((a, b) => b.rating - a.rating);
    } else if (filters.sortBy === 'most_booked') {
      data.sort((a, b) => b.reviewsCount - a.reviewsCount);
    } else if (filters.sortBy === 'highest_discount') {
      data.sort((a, b) => (b.discount || 0) - (a.discount || 0));
    }
    return data;
  }, [businesses, search, filters]);

  const handleBusinessPress = (business) => {
    router.push(`/business?slug=${business.bookingSlug}`);
  };

  return (
    <ScreenWrapper scrollable padding={0}>
      <CategoryHeader
        categoryId={categoryId}
        categoryName={categoryName}
        resultCount={filteredData.length}
        searchQuery={search}
        onSearchChange={setSearch}
        onFilterPress={() => setFilterVisible(true)}
        hasActiveFilter={hasActiveFilter}
      />
      <div className="p-4 pb-32 space-y-3">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner label="در حال بارگذاری..." />
          </div>
        ) : filteredData.length > 0 ? (
          filteredData.map((business) => (
            <BusinessListCard
              key={business.id}
              business={business}
              categoryIcon="💆‍♀️"
              onPress={handleBusinessPress}
            />
          ))
        ) : (
          <EmptyState
            icon="🔍"
            title="کسب‌وکاری یافت نشد"
            description={
              search
                ? 'با این عبارت جستجو نتیجه‌ای پیدا نشد'
                : 'در این منطقه کسب‌وکاری ثبت نشده یا فیلترهای خود را تغییر دهید'
            }
            actionLabel={search ? 'پاک کردن جستجو' : 'حذف فیلترها'}
            onAction={() => {
              if (search) setSearch('');
              else setFilters({ serviceType: null, sortBy: 'all' });
            }}
          />
        )}
      </div>
      <CategoryFilterModal
        visible={filterVisible}
        onClose={() => setFilterVisible(false)}
        onApply={setFilters}
        currentFilters={filters}
        categoryId={categoryId}
      />
    </ScreenWrapper>
  );
}