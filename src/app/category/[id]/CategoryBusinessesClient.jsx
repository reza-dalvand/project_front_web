'use client';
import { useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { FiFilter } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import ScreenWrapper from '@/components/common/ScreenWrapper';
import CategoryHeader from '@/components/home/CategoryHeader';
import BusinessListCard from '@/components/home/BusinessListCard';
import EmptyState from '@/components/common/EmptyState';
import dynamic from 'next/dynamic';

// ✅ Lazy Load
const CategoryFilterModal = dynamic(() => import('@/components/home/CategoryFilterModal'), {
  ssr: false,
  loading: () => null,
});

export default function CategoryBusinessesPage() {
  const params = useParams();
  const router = useRouter();
  const { colors } = useTheme();
  const categoryId = params.id;
  const categoryName = CATEGORY_NAMES[categoryId] || 'دسته‌بندی';

  const [search, setSearch] = useState('');
  const [filterVisible, setFilterVisible] = useState(false);
  const [filters, setFilters] = useState({
    serviceType: null,
    sortBy: 'all',
  });

  // تشخیص فیلتر فعال
  const hasActiveFilter =
    (filters.serviceType && filters.serviceType !== 'all') || filters.sortBy !== 'all';

  // فیلتر و جستجو
  const filteredData = useMemo(() => {
    let data = [...MOCK_BUSINESSES_LIST];

    // جستجو
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      data = data.filter(
        (item) =>
          item.name.toLowerCase().includes(q) ||
          item.address.toLowerCase().includes(q) ||
          (item.serviceType && item.serviceType.toLowerCase().includes(q))
      );
    }

    // فیلتر نوع خدمت
    if (filters.serviceType && filters.serviceType !== 'all') {
      data = data.filter((item) => item.subServiceId === filters.serviceType);
    }

    // مرتب‌سازی - فقط اگر "all" نباشد
    if (filters.sortBy === 'top_rated') {
      data.sort((a, b) => b.rating - a.rating);
    } else if (filters.sortBy === 'most_booked') {
      data.sort((a, b) => b.reviewsCount - a.reviewsCount);
    } else if (filters.sortBy === 'highest_discount') {
      data.sort((a, b) => b.discount - a.discount);
    }
    // اگر sortBy === 'all' باشد، ترتیب اصلی حفظ می‌شود

    return data;
  }, [search, filters]);

  const handleBusinessPress = (business) => {
    router.push(`/business/${business.id}`);
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
        {filteredData.length > 0 ? (
          filteredData.map((business) => (
            <BusinessListCard
              key={business.id}
              business={business}
              categoryIcon={CATEGORY_NAMES[categoryId] ? '💆‍♀️' : '💄'}
              onPress={handleBusinessPress}
            />
          ))
        ) : (
          <EmptyState
            icon="🔍"
            title="کسب‌وکاری یافت نشد"
            description={
              search ? 'با این عبارت جستجو نتیجه‌ای پیدا نشد' : 'فیلترهای خود را تغییر دهید'
            }
            actionLabel={search ? 'پاک کردن جستجو' : 'حذف فیلترها'}
            onAction={() => {
              if (search) setSearch('');
              else setFilters({ serviceType: null, sortBy: 'all' });
            }}
          />
        )}
      </div>

      {/* مدال فیلتر */}
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
