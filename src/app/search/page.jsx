// src/app/search/page.jsx
'use client';

import { useState, useMemo, useCallback, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FiArrowRight, FiSearch, FiMapPin, FiFilter } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import { SearchBar, SectionHeader, ScreenWrapper, Card } from '@/components/common';
import SearchTabs from '@/components/home/search/SearchTabs';
import SearchBusinessCard from '@/components/home/search/SearchBusinessCard';
import SearchModelCard from '@/components/home/search/SearchModelCard';
import SearchLineCard from '@/components/home/search/SearchLineCard';
import SearchEmptyState from '@/components/home/search/SearchEmptyState';
import CategoryGrid from '@/components/home/CategoryGrid';
import DistanceFilterSheet from '@/components/home/search/DistanceFilterSheet';
import { MOCK_CATEGORIES } from '@/data/businesses';
import { searchAll, getResultCounts } from '@/components/home/search/searchData';
import { searchService } from '@/api';
import { USE_MOCK } from '@/api/config';
import { getCurrentLocation, calculateDistance, formatDistance } from '@/utils/geo-utils';
import { useToast } from '@/hooks/useToast';

// ═══════ گزینه‌های فیلتر فاصله ═══════
const DISTANCE_OPTIONS = [
  { id: 'all', label: 'همه فاصله‌ها', value: null, icon: '🌍' },
  { id: '1km', label: 'تا ۱ کیلومتر', value: 1, icon: '🚶' },
  { id: '3km', label: 'تا ۳ کیلومتر', value: 3, icon: '🚲' },
  { id: '5km', label: 'تا ۵ کیلومتر', value: 5, icon: '🚗' },
  { id: '10km', label: 'تا ۱۰ کیلومتر', value: 10, icon: '🛣️' },
  { id: '20km', label: 'تا ۲۰ کیلومتر', value: 20, icon: '🏙️' },
];

// ═══════════ کامپوننت داخلی با useSearchParams ═══════════
function SearchPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { colors } = useTheme();
  const { showToast } = useToast();

  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [activeQuery, setActiveQuery] = useState(searchParams.get('q') || '');
  const [activeTab, setActiveTab] = useState('all');
  const [distanceFilter, setDistanceFilter] = useState(null);
  const [distanceFilterVisible, setDistanceFilterVisible] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [locationLoading, setLocationLoading] = useState(false);

  // ═══════ دریافت موقعیت کاربر ═══════
  const fetchUserLocation = useCallback(async () => {
    if (userLocation) return userLocation;
    setLocationLoading(true);
    try {
      const location = await getCurrentLocation();
      setUserLocation(location);
      setLocationLoading(false);
      return location;
    } catch (error) {
      setLocationLoading(false);
      showToast('دسترسی به موقعیت مکانی امکان‌پذیر نیست', 'warning');
      return null;
    }
  }, [userLocation, showToast]);

  // ═══════ جستجو با debounce ═══════
  useEffect(() => {
    const timer = setTimeout(() => {
      setActiveQuery(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // ═══════ محاسبه فاصله برای کسب‌وکارها ═══════
  const businessesWithDistance = useMemo(() => {
    const results = searchAll(activeQuery);
    let businesses = results.businesses || [];

    if (userLocation) {
      businesses = businesses.map((business) => {
        const businessLat = business.latitude || business.location?.latitude;
        const businessLng = business.longitude || business.location?.longitude;
        if (businessLat && businessLng) {
          const distance = calculateDistance(
            userLocation.latitude,
            userLocation.longitude,
            businessLat,
            businessLng
          );
          return { ...business, distance, distanceText: formatDistance(distance) };
        }
        return { ...business, distance: null, distanceText: null };
      });

      businesses = [...businesses].sort((a, b) => {
        if (a.distance === null && b.distance === null) return 0;
        if (a.distance === null) return 1;
        if (b.distance === null) return -1;
        return a.distance - b.distance;
      });
    }

    if (distanceFilter && userLocation) {
      businesses = businesses.filter((b) => b.distance !== null && b.distance <= distanceFilter);
    }

    return businesses;
  }, [activeQuery, userLocation, distanceFilter]);

  // ═══════ نتایج جستجو ═══════
  const searchResults = useMemo(() => {
    const results = searchAll(activeQuery);
    return {
      ...results,
      businesses: businessesWithDistance,
    };
  }, [activeQuery, businessesWithDistance]);

  const resultCounts = useMemo(() => getResultCounts(searchResults), [searchResults]);

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

  // ═══════ Handlers ═══════
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
    setDistanceFilter(null);
  }, []);

  const handleBusinessPress = useCallback(
    (business) => {
      router.push(`/business/${business.id}`);
    },
    [router]
  );

  const handleModelPress = useCallback(
    (request) => {
      router.push(`/model-requests/${request.id}`);
    },
    [router]
  );

  const handleLinePress = useCallback(
    (ad) => {
      router.push(`/line-rentals/${ad.id}`);
    },
    [router]
  );

  const handleCategoryPress = useCallback(
    (category) => {
      router.push(`/category/${category.id}`);
    },
    [router]
  );

  const handleDistanceFilterPress = useCallback(async () => {
    if (!userLocation) {
      const location = await fetchUserLocation();
      if (!location) return;
    }
    setDistanceFilterVisible(true);
  }, [userLocation, fetchUserLocation]);

  const handleDistanceApply = useCallback(
    (value) => {
      setDistanceFilter(value);
      setDistanceFilterVisible(false);
      if (value) {
        showToast(`نمایش کسب‌وکارها تا ${value} کیلومتر`, 'info');
      }
    },
    [showToast]
  );

  const handleLocationRequest = useCallback(async () => {
    const location = await fetchUserLocation();
    if (location) {
      showToast('موقعیت شما دریافت شد', 'success');
    }
  }, [fetchUserLocation, showToast]);

  // ═══════ رندر نتایج ═══════
  const renderResults = () => {
    const hasResults = resultCounts.all > 0;

    if (!hasResults && activeQuery.trim()) {
      return <SearchEmptyState query={activeQuery} activeTab={activeTab} />;
    }

    if (activeTab === 'all') {
      return (
        <div className="space-y-6">
          {searchResults.businesses.length > 0 && (
            <div>
              <SectionHeader
                icon={<FiSearch size={18} />}
                iconColor={colors.primary}
                title="کسب‌وکارها"
                subtitle={userLocation ? 'مرتب‌شده بر اساس نزدیک‌ترین فاصله' : 'نتایج جستجو'}
              />
              <div className="space-y-3">
                {searchResults.businesses.slice(0, 5).map((business) => (
                  <SearchBusinessCard
                    key={business.id}
                    business={business}
                    onPress={handleBusinessPress}
                    userLocation={userLocation}
                  />
                ))}
              </div>
              {searchResults.businesses.length > 5 && (
                <button
                  onClick={() => setActiveTab('businesses')}
                  className="w-full mt-3 py-3 text-center text-sm font-[Vazir-Bold] rounded-xl border"
                  style={{ color: colors.primary, borderColor: colors.border }}
                >
                  مشاهده همه {searchResults.businesses.length} کسب‌وکار
                </button>
              )}
            </div>
          )}

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

    switch (activeTab) {
      case 'businesses':
        return (
          <div className="space-y-3">
            {filteredResults.map((business) => (
              <SearchBusinessCard
                key={business.id}
                business={business}
                onPress={handleBusinessPress}
                userLocation={userLocation}
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

  const renderEmptyState = () => (
    <div className="px-4 py-6 space-y-6">
      <div>
        <SectionHeader
          icon={<FiSearch size={18} />}
          iconColor="#FF9800"
          title="دسته‌بندی‌های محبوب"
          subtitle="یک دسته‌بندی انتخاب کنید"
        />
        <CategoryGrid categories={MOCK_CATEGORIES} onSelect={handleCategoryPress} />
      </div>

      <Card variant="elevated" padding={20} radius={18}>
        <div className="flex flex-col items-center gap-4">
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center"
            style={{ backgroundColor: colors.primary + '15' }}
          >
            <FiSearch size={28} style={{ color: colors.primary }} />
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
                <span className="text-sm" style={{ color: colors.primary }}>
                  ✓
                </span>
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
        style={{ backgroundColor: colors.background, borderBottomColor: colors.border }}
      >
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="w-11 h-11 rounded-2xl flex items-center justify-center border"
            style={{ backgroundColor: colors.cardBackground, borderColor: colors.border }}
          >
            <FiArrowRight size={22} style={{ color: colors.textMain }} />
          </button>
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

        {/* ردیف فیلتر فاصله */}
        {activeQuery.trim() && (
          <div className="flex items-center gap-2 mt-3">
            <button
              onClick={handleDistanceFilterPress}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border-[1.5px] transition-all"
              style={{
                backgroundColor: distanceFilter ? colors.primary + '15' : colors.cardBackground,
                borderColor: distanceFilter ? colors.primary : colors.border,
              }}
            >
              <FiMapPin
                size={16}
                style={{ color: distanceFilter ? colors.primary : colors.textMain }}
              />
              <span
                className="text-xs font-[Vazir-Bold]"
                style={{ color: distanceFilter ? colors.primary : colors.textMain }}
              >
                {distanceFilter ? `تا ${distanceFilter} کیلومتر` : 'فیلتر فاصله'}
              </span>
              {distanceFilter && (
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: colors.primary }}
                />
              )}
            </button>

            {!userLocation && (
              <button
                onClick={handleLocationRequest}
                disabled={locationLoading}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border-[1.5px] transition-all"
                style={{
                  backgroundColor: colors.cardBackground,
                  borderColor: colors.border,
                }}
              >
                {locationLoading ? (
                  <div
                    className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"
                    style={{ color: colors.primary }}
                  />
                ) : (
                  <FiMapPin size={16} style={{ color: colors.textSecondary }} />
                )}
                <span className="text-xs font-[Vazir]" style={{ color: colors.textSecondary }}>
                  دریافت موقعیت
                </span>
              </button>
            )}

            {distanceFilter && (
              <button
                onClick={() => setDistanceFilter(null)}
                className="flex items-center gap-1 px-3 py-2.5 rounded-xl text-xs font-[Vazir-Bold]"
                style={{ backgroundColor: '#E5393515', color: '#E53935' }}
              >
                حذف فیلتر
              </button>
            )}
          </div>
        )}
      </div>

      {/* تب‌ها */}
      {activeQuery.trim() && resultCounts.all > 0 && (
        <SearchTabs activeTab={activeTab} counts={resultCounts} onChange={setActiveTab} />
      )}

      {/* نتایج */}
      {activeQuery.trim() ? <div className="px-4 py-4">{renderResults()}</div> : renderEmptyState()}

      {/* مدال فیلتر فاصله */}
      <DistanceFilterSheet
        visible={distanceFilterVisible}
        onClose={() => setDistanceFilterVisible(false)}
        onApply={handleDistanceApply}
        currentFilter={distanceFilter}
        options={DISTANCE_OPTIONS}
        userLocation={userLocation}
      />
    </ScreenWrapper>
  );
}

// ═══════════ کامپوننت اصلی با Suspense ═══════════
export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-app">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <SearchPageContent />
    </Suspense>
  );
}
