'use client';
import { useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { FiFilter } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import ScreenWrapper from '@/components/common/ScreenWrapper';
import CategoryHeader from '@/components/home/CategoryHeader';
import BusinessListCard from '@/components/home/BusinessListCard';
import CategoryFilterModal from '@/components/home/CategoryFilterModal';
import EmptyState from '@/components/common/EmptyState';

// داده‌های MOCK
const MOCK_BUSINESSES = [
  {
    id: '1',
    name: 'کلینیک زیبایی صدف',
    serviceType: 'فیشیال VIP عروس',
    subServiceId: 'facial_vip',
    address: 'تهران، سعادت آباد، خیابان سرو غربی',
    rating: 5.0,
    reviewsCount: 142,
    discount: 20,
    category: 'کلینیک پوست و مو',
    provinceId: 'tehran',
    cityId: 'tehran-city',
    VIP: true,
  },
  {
    id: '2',
    name: 'سالن زیبایی ماهرو',
    serviceType: 'میکاپ عروس اروپایی',
    subServiceId: 'makeup_bride',
    address: 'تهران، نیاوران',
    rating: 4.7,
    reviewsCount: 89,
    discount: 15,
    category: 'سالن زیبایی',
    provinceId: 'tehran',
    cityId: 'shemiran',
    VIP: false,
  },
  {
    id: '3',
    name: 'کلینیک رویال لیزر',
    serviceType: 'لیزر الکساندرایت فول بادی',
    subServiceId: 'laser_alex',
    address: 'اصفهان، خیابان چهارباغ',
    rating: 4.9,
    reviewsCount: 215,
    discount: 30,
    category: 'مرکز لیزر',
    provinceId: 'isfahan',
    cityId: 'isfahan-city',
    VIP: true,
  },
  {
    id: '4',
    name: 'ناخن گالری پریا',
    serviceType: 'کاشت ناخن ژله‌ای طرح‌دار',
    subServiceId: 'nail_gel',
    address: 'کرج، میدان کرج',
    rating: 4.6,
    reviewsCount: 67,
    discount: 0,
    category: 'مرکز کاشت ناخن',
    provinceId: 'alborz',
    cityId: 'karaj',
    VIP: false,
  },
  {
    id: '5',
    name: 'سالن افرا',
    serviceType: 'رنگ و لایت مو',
    subServiceId: 'hair_color',
    address: 'تهران، ونک',
    rating: 4.9,
    reviewsCount: 124,
    discount: 10,
    category: 'سالن زیبایی',
    provinceId: 'tehran',
    cityId: 'tehran-city',
    VIP: true,
  },
];

const CATEGORY_NAMES = {
  1: 'میکاپ',
  2: 'کاشت ناخن',
  3: 'لیزر مو',
  4: 'پاکسازی',
  5: 'رنگ مو',
  6: 'کراتین',
  7: 'مژه',
  8: 'ماساژ',
};

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
    let data = [...MOCK_BUSINESSES];

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
