// src/app/category/[id]/CategoryBusinessesClient.jsx
'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { FiFilter } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import ScreenWrapper from '@/components/common/ScreenWrapper';
import CategoryHeader from '@/components/home/CategoryHeader';
import BusinessListCard from '@/components/home/BusinessListCard';
import EmptyState from '@/components/common/EmptyState';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import dynamic from 'next/dynamic';

// ✅ API
import { businessesService, categoriesService } from '@/api';

// ✅ Lazy Load
const CategoryFilterModal = dynamic(() => import('@/components/home/CategoryFilterModal'), {
  ssr: false,
  loading: () => null,
});

export default function CategoryBusinessesPage({categoryId}) {
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

  // ═══════ دریافت نام دسته‌بندی ═══════
  useEffect(() => {
    const fetchCategoryName = async () => {
      try {
        const result = await categoriesService.getBusinessCategories();
        const cats = result.data || [];
        const cat = cats.find((c) => String(c.id) === String(categoryId));
        if (cat) {
          setCategoryName(cat.name || cat.title || 'دسته‌بندی');
        }
      } catch (error) {
        console.error('Failed to fetch category name:', error);
      }
    };
    fetchCategoryName();
  }, [categoryId]);

  // ═══════ دریافت لیست کسب‌وکارها ═══════
  useEffect(() => {
    const fetchBusinesses = async () => {
      setIsLoading(true);
      try {
        const response = await businessesService.getBusinessList({
          category_id: categoryId,
          page_size: 50,
        });

        const data = response.data || [];
        
        setBusinesses(
          data.map((b) => ({
            id: b.id,
            bookingSlug: b.bookingSlug || b.id, // ✅ اضافه شود (Fallback به id برای احتیاط)
            name: b.name,
            // ✅ فاز ۳: فقط خوانش camelCase
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
        console.error('Failed to fetch businesses:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBusinesses();
  }, [categoryId]);

  // تشخیص فیلتر فعال
  const hasActiveFilter =
    (filters.serviceType && filters.serviceType !== 'all') || filters.sortBy !== 'all';

  // فیلتر و جستجو
  const filteredData = useMemo(() => {
    let data = [...businesses];

    // جستجو
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      data = data.filter(
        (item) =>
          item.name.toLowerCase().includes(q) ||
          (item.address && item.address.toLowerCase().includes(q)) ||
          (item.category && item.category.toLowerCase().includes(q))
      );
    }

    // مرتب‌سازی
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
    router.push(`/business?slug=${business.bookingSlug}`); // ✅ تغییر به slug
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
