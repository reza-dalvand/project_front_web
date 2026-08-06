'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FiArrowRight, FiSearch } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import { SearchBar, SectionHeader, ScreenWrapper } from '@/components/common';
import SearchTabs from '@/components/home/search/SearchTabs';
import SearchBusinessCard from '@/components/home/search/SearchBusinessCard';
import SearchModelCard from '@/components/home/search/SearchModelCard';
import SearchLineCard from '@/components/home/search/SearchLineCard';
import SearchEmptyState from '@/components/home/search/SearchEmptyState';
import CategoryGrid from '@/components/home/CategoryGrid';
import { Card } from '@/components/common';

// داده‌های MOCK
const MOCK_BUSINESSES = [
  {
    id: '1',
    name: 'کلینیک زیبایی صدف',
    category: 'کلینیک پوست و مو',
    city: 'تهران، سعادت‌آباد',
    rating: 4.8,
    reviewsCount: 142,
    logo: 'https://picsum.photos/150?random=21',
    VIP: true,
  },
  {
    id: '2',
    name: 'سالن زیبایی ماهرو',
    category: 'سالن زیبایی',
    city: 'تهران، نیاوران',
    rating: 4.6,
    reviewsCount: 89,
    logo: 'https://picsum.photos/150?random=22',
    VIP: false,
  },
  {
    id: '3',
    name: 'مرکز لیزر رویال',
    category: 'مرکز لیزر',
    city: 'تهران، شهرک غرب',
    rating: 4.9,
    reviewsCount: 178,
    logo: 'https://picsum.photos/150?random=25',
    VIP: true,
  },
];

const MOCK_MODEL_REQUESTS = [
  {
    id: 'mr_1',
    title: 'مدل فیشیال VIP عروس',
    businessName: 'کلینیک زیبایی صدف',
    city: 'تهران، سعادت‌آباد',
    serviceImage: 'https://picsum.photos/400/300?random=50',
    costType: 'paid',
    discount: 50,
  },
  {
    id: 'mr_2',
    title: 'مدل طراحی ناخن ژورنالی',
    businessName: 'ناخن گالری پریا',
    city: 'کرج، فردیس',
    serviceImage: 'https://picsum.photos/400/300?random=51',
    costType: 'material_cost',
    discount: 70,
  },
];

const MOCK_LINE_RENTALS = [
  {
    id: 'lr_1',
    title: 'لاین ناخن VIP با تجهیزات کامل',
    businessName: 'سالن زیبایی نیلارام',
    city: 'تهران، سعادت‌آباد',
    lineImage: 'https://picsum.photos/400/300?random=70',
    collabType: 'percent',
    priceDisplay: '۴۰-۶۰٪',
  },
  {
    id: 'lr_2',
    title: 'لاین میکاپ با نور طبیعی',
    businessName: 'استودیو لاویا',
    city: 'تهران، نیاوران',
    lineImage: 'https://picsum.photos/400/300?random=71',
    collabType: 'hourly',
    priceDisplay: '۱۵۰K / ساعت',
  },
];

const POPULAR_CATEGORIES = [
  { id: 1, name: 'میکاپ', icon: 'face', count: 6 },
  { id: 2, name: 'کاشت ناخن', icon: 'brush', count: 6 },
  { id: 3, name: 'لیزر مو', icon: 'flash-on', count: 5 },
  { id: 4, name: 'پاکسازی', icon: 'spa', count: 6 },
  { id: 5, name: 'رنگ مو', icon: 'palette', count: 6 },
  { id: 6, name: 'کراتین', icon: 'auto-awesome', count: 5 },
  { id: 7, name: 'مژه', icon: 'visibility', count: 6 },
  { id: 8, name: 'ماساژ', icon: 'self-improvement', count: 4 },
];

export default function SearchPage() {
  const router = useRouter();
  const { colors } = useTheme();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeQuery, setActiveQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  // Debounce جستجو
  useEffect(() => {
    const timer = setTimeout(() => {
      setActiveQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // جستجو در داده‌ها
  const searchResults = useMemo(() => {
    if (!activeQuery.trim()) {
      return { businesses: [], modelRequests: [], lineRentals: [] };
    }

    const q = activeQuery.trim().toLowerCase();

    const businesses = MOCK_BUSINESSES.filter(
      (b) =>
        b.name.toLowerCase().includes(q) ||
        b.category.toLowerCase().includes(q) ||
        b.city.toLowerCase().includes(q)
    );

    const modelRequests = MOCK_MODEL_REQUESTS.filter(
      (m) =>
        m.title.toLowerCase().includes(q) ||
        m.businessName.toLowerCase().includes(q) ||
        m.city.toLowerCase().includes(q)
    );

    const lineRentals = MOCK_LINE_RENTALS.filter(
      (l) =>
        l.title.toLowerCase().includes(q) ||
        l.businessName.toLowerCase().includes(q) ||
        l.city.toLowerCase().includes(q)
    );

    return { businesses, modelRequests, lineRentals };
  }, [activeQuery]);

  const resultCounts = useMemo(
    () => ({
      all:
        searchResults.businesses.length +
        searchResults.modelRequests.length +
        searchResults.lineRentals.length,
      businesses: searchResults.businesses.length,
      modelRequests: searchResults.modelRequests.length,
      lineRentals: searchResults.lineRentals.length,
    }),
    [searchResults]
  );

  // فیلتر نتایج بر اساس تب
  const filteredResults = useMemo(() => {
    switch (activeTab) {
      case 'businesses':
        return searchResults.businesses;
      case 'modelRequests':
        return searchResults.modelRequests;
      case 'lineRentals':
        return searchResults.lineRentals;
      default:
        return null;
    }
  }, [searchResults, activeTab]);

  const handleSearch = useCallback(
    (query) => {
      const q = typeof query === 'string' ? query : searchQuery;
      setActiveQuery(q);
      setActiveTab('all');
    },
    [searchQuery]
  );

  const handleClear = useCallback(() => {
    setSearchQuery('');
    setActiveQuery('');
    setActiveTab('all');
  }, []);

  const handleBusinessPress = useCallback(
    (business) => {
      router.push(`/business/${business.id}`);
    },
    [router]
  );

  const handleModelPress = useCallback((request) => {
    console.log('Model request:', request);
  }, []);

  const handleLinePress = useCallback((ad) => {
    console.log('Line rental:', ad);
  }, []);

  const handleCategoryPress = useCallback(
    (category) => {
      router.push(`/category/${category.id}`);
    },
    [router]
  );

  // رندر نتایج بر اساس تب
  const renderResults = () => {
    const hasResults = resultCounts.all > 0;

    if (!hasResults && activeQuery.trim()) {
      return <SearchEmptyState query={activeQuery} activeTab={activeTab} />;
    }

    // تب «همه»
    if (activeTab === 'all') {
      return (
        <div className="space-y-6">
          {/* کسب‌وکارها */}
          {searchResults.businesses.length > 0 && (
            <div>
              <SectionHeader
                icon={<FiSearch size={18} />}
                iconColor={colors.primary}
                title="کسب‌وکارها"
                subtitle="سالن‌ها و کلینیک‌های مرتبط"
              />
              <div className="space-y-3">
                {searchResults.businesses.slice(0, 3).map((business) => (
                  <SearchBusinessCard
                    key={business.id}
                    business={business}
                    onPress={handleBusinessPress}
                  />
                ))}
              </div>
              {searchResults.businesses.length > 3 && (
                <button
                  onClick={() => setActiveTab('businesses')}
                  className="w-full mt-3 py-3 text-center text-sm font-[Vazir-Bold] rounded-xl border"
                  style={{
                    color: colors.primary,
                    borderColor: colors.border,
                  }}
                >
                  مشاهده همه {searchResults.businesses.length} کسب‌وکار
                </button>
              )}
            </div>
          )}

          {/* مدلینگ */}
          {searchResults.modelRequests.length > 0 && (
            <div>
              <SectionHeader
                icon={<FiSearch size={18} />}
                iconColor="#E91E63"
                title="فرصت‌های مدلینگ"
                subtitle="با تخفیف ویژه مدل شوید"
              />
              <div className="grid grid-cols-2 gap-3">
                {searchResults.modelRequests.slice(0, 4).map((request) => (
                  <SearchModelCard key={request.id} request={request} onPress={handleModelPress} />
                ))}
              </div>
            </div>
          )}

          {/* لاین */}
          {searchResults.lineRentals.length > 0 && (
            <div>
              <SectionHeader
                icon={<FiSearch size={18} />}
                iconColor="#667eea"
                title="اجاره لاین"
                subtitle="فرصت‌های همکاری و اجاره"
              />
              <div className="grid grid-cols-2 gap-3">
                {searchResults.lineRentals.slice(0, 4).map((ad) => (
                  <SearchLineCard key={ad.id} ad={ad} onPress={handleLinePress} />
                ))}
              </div>
            </div>
          )}
        </div>
      );
    }

    // تب‌های خاص
    switch (activeTab) {
      case 'businesses':
        return (
          <div className="space-y-3">
            {filteredResults.map((business) => (
              <SearchBusinessCard
                key={business.id}
                business={business}
                onPress={handleBusinessPress}
              />
            ))}
          </div>
        );
      case 'modelRequests':
        return (
          <div className="grid grid-cols-2 gap-3">
            {filteredResults.map((request) => (
              <SearchModelCard key={request.id} request={request} onPress={handleModelPress} />
            ))}
          </div>
        );
      case 'lineRentals':
        return (
          <div className="grid grid-cols-2 gap-3">
            {filteredResults.map((ad) => (
              <SearchLineCard key={ad.id} ad={ad} onPress={handleLinePress} />
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  // حالت خالی
  const renderEmptyState = () => (
    <div className="px-4 py-6 space-y-6">
      {/* دسته‌بندی‌های محبوب */}
      <div>
        <SectionHeader
          icon={<FiSearch size={18} />}
          iconColor="#FF9800"
          title="دسته‌بندی‌های محبوب"
          subtitle="یک دسته‌بندی انتخاب کنید"
        />
        <CategoryGrid categories={POPULAR_CATEGORIES} onSelect={handleCategoryPress} />
      </div>

      {/* راهنمای جستجو */}
      <Card variant="elevated" padding={20} radius={18}>
        <div className="flex flex-col items-center gap-4">
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center"
            style={{ backgroundColor: colors.primary + '15' }}
          >
            <FiSearch size={28} color={colors.primary} />
          </div>
          <h3
            className="text-base font-[Vazir-Bold] text-center"
            style={{ color: colors.textMain }}
          >
            چه چیزهایی می‌توانید جستجو کنید؟
          </h3>
          <div className="w-full space-y-3">
            {[
              { icon: '🏪', text: 'نام کسب‌وکارها', color: colors.primary },
              { icon: '👤', text: 'فرصت‌های مدلینگ', color: '#E91E63' },
              { icon: '🏢', text: 'آگهی‌های اجاره لاین', color: '#667eea' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 py-2">
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: item.color + '18' }}
                >
                  <span className="text-sm">{item.icon}</span>
                </div>
                <span className="text-sm font-[Vazir]" style={{ color: colors.textSecondary }}>
                  {item.text}
                </span>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );

  return (
    <ScreenWrapper scrollable padding={0}>
      {/* هدر */}
      <div
        className="px-4 py-3 border-b"
        style={{
          backgroundColor: colors.background,
          borderBottomColor: colors.border,
        }}
      >
        <div className="flex items-center gap-3">
          {/* دکمه بازگشت */}
          <button
            onClick={() => router.back()}
            className="w-11 h-11 rounded-2xl flex items-center justify-center border"
            style={{
              backgroundColor: colors.cardBackground,
              borderColor: colors.border,
            }}
          >
            <FiArrowRight size={22} color={colors.textMain} />
          </button>

          {/* نوار جستجو */}
          <div className="flex-1">
            <SearchBar
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmit={() => handleSearch(searchQuery)}
              onClear={handleClear}
              placeholder="جستجوی خدمات، کسب‌وکارها..."
              autoFocus
            />
          </div>
        </div>
      </div>

      {/* تب‌ها */}
      {activeQuery.trim() && resultCounts.all > 0 && (
        <SearchTabs activeTab={activeTab} counts={resultCounts} onChange={setActiveTab} />
      )}

      {/* محتوا */}
      {activeQuery.trim() ? <div className="px-4 py-4">{renderResults()}</div> : renderEmptyState()}
    </ScreenWrapper>
  );
}
