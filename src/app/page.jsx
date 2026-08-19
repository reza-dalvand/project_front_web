'use client';
import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { FiGrid, FiUser, FiStar, FiAward } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import { useAuth } from '@/stores/useAuthStore';
import { useReviewStore } from '@/stores/useReviewStore';
import { useNearbyStore } from '@/stores/useNearbyStore';
import { SectionHeader, BottomTabBar } from '@/components/common';
import HomeHeader from '@/components/home/HomeHeader';
import AdSlider from '@/components/home/AdSlider';
import CategoryGrid from '@/components/home/CategoryGrid';
import SeeAllButton from '@/components/home/SeeAllButton';
import ActiveFiltersBar from '@/components/home/ActiveFiltersBar';
import ModelRequestCard from '@/components/home/ModelRequestCard';
import LineRentalCard from '@/components/home/LineRentalCard';
import NearbyToggle from '@/components/home/NearbyToggle';
import RegisterBanner from '@/components/home/RegisterBanner';
import { useToast } from '@/hooks/useToast';
import { getCurrentLocation, calculateDistance } from '@/utils/geo-utils';
import { MOCK_CATEGORIES } from '@/data/businesses';
import { MOCK_ADS } from '@/data/ads';
import { MOCK_MODEL_REQUESTS } from '@/data/modelRequests';
import { MOCK_LINE_RENTALS } from '@/data/lineRentals';
import { MOCK_DONE_APPOINTMENTS } from '@/data/appointments';
import { SplashScreen } from '@capacitor/splash-screen';
import { Capacitor } from '@capacitor/core';

// ✅ Lazy Load
const NotificationModal = dynamic(() => import('@/components/home/NotificationModal'), {
  ssr: false,
  loading: () => null,
});
const HomeFilterModal = dynamic(() => import('@/components/home/HomeFilterModal'), {
  ssr: false,
  loading: () => null,
});
const ReviewModal = dynamic(() => import('@/components/customer/ReviewModal'), {
  ssr: false,
  loading: () => null,
});

export default function HomePage() {
  useEffect(() => {
    if (Capacitor.isNativePlatform()) {
      SplashScreen.hide({ fadeOutDuration: 300 });
    }
  }, []);

  const router = useRouter();
  const { colors, resolvedTheme, setTheme } = useTheme();
  const { isAuthenticated, user, requireAuth } = useAuth();
  const { showToast } = useToast();
  const { pendingReviews, addPendingReview } = useReviewStore();
  const isDark = resolvedTheme === 'dark';

  // ═══════ Nearby States ═══════
  const nearbyEnabled = useNearbyStore((s) => s.enabled);
  const nearbyLoading = useNearbyStore((s) => s.loading);
  const nearbyDenied = useNearbyStore((s) => s.denied);
  const userLocation = useNearbyStore((s) => s.userLocation);
  const maxDistanceKm = useNearbyStore((s) => s.maxDistanceKm);
  const enableNearby = useNearbyStore((s) => s.enable);
  const disableNearby = useNearbyStore((s) => s.disable);
  const setNearbyLoading = useNearbyStore((s) => s.setLoading);
  const setNearbyDenied = useNearbyStore((s) => s.setDenied);

  // ─── State‌ها ───
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [notificationVisible, setNotificationVisible] = useState(false);
  const [filterVisible, setFilterVisible] = useState(false);
  const [filters, setFilters] = useState({});
  const [reviewVisible, setReviewVisible] = useState(false);
  const [currentReviewAppointment, setCurrentReviewAppointment] = useState(null);

  // ═══════ Nearby Toggle Handler ═══════
  const handleNearbyToggle = useCallback(async () => {
    if (nearbyEnabled) {
      disableNearby();
      showToast('نمایش نزدیک‌ترین‌ها غیرفعال شد', 'info');
      return;
    }
    if (nearbyDenied) {
      showToast('دسترسی به موقعیت مکانی رد شده است. از تنظیمات گوشی اجازه دهید.', 'error');
      return;
    }
    setNearbyLoading(true);
    try {
      const location = await getCurrentLocation();
      enableNearby(location);
      showToast('نمایش نزدیک‌ترین‌ها فعال شد', 'success');
    } catch (err) {
      setNearbyLoading(false);
      if (err.code === 1) {
        setNearbyDenied(true);
        showToast('دسترسی به موقعیت مکانی رد شد. از تنظیمات اجازه دهید.', 'error');
      } else if (err.code === 2) {
        showToast('موقعیت مکانی در دسترس نیست. GPS را روشن کنید.', 'warning');
      } else if (err.code === 3) {
        showToast('دریافت موقعیت طول کشید. دوباره تلاش کنید.', 'warning');
      } else {
        showToast('خطا در دریافت موقعیت مکانی', 'error');
      }
    }
  }, [
    nearbyEnabled,
    nearbyDenied,
    showToast,
    enableNearby,
    disableNearby,
    setNearbyLoading,
    setNearbyDenied,
  ]);

  // ═══════ فیلتر مدلینگ بر اساس فاصله ═══════
  const filteredModelRequests = useMemo(() => {
    if (!nearbyEnabled || !userLocation) return MOCK_MODEL_REQUESTS;
    return MOCK_MODEL_REQUESTS.filter((req) => {
      if (!req.latitude || !req.longitude) return false;
      const dist = calculateDistance(
        userLocation.latitude,
        userLocation.longitude,
        req.latitude,
        req.longitude
      );
      return dist <= maxDistanceKm;
    });
  }, [nearbyEnabled, userLocation, maxDistanceKm]);

  // ═══════ فیلتر اجاره لاین بر اساس فاصله ═══════
  const filteredLineRentals = useMemo(() => {
    if (!nearbyEnabled || !userLocation) return MOCK_LINE_RENTALS;
    return MOCK_LINE_RENTALS.filter((ad) => {
      if (!ad.latitude || !ad.longitude) return false;
      const dist = calculateDistance(
        userLocation.latitude,
        userLocation.longitude,
        ad.latitude,
        ad.longitude
      );
      return dist <= maxDistanceKm;
    });
  }, [nearbyEnabled, userLocation, maxDistanceKm]);

  // ═══════ hasActiveFilter ═══════
  const hasActiveFilter = useMemo(
    () => Object.values(filters).some((v) => v && v !== 'all' && v !== 'recommended'),
    [filters]
  );

  // ─── افزودن نوبت‌های انجام‌شده به pendingReviews ───
  const pendingReviewsInitialized = useRef(false);

  useEffect(() => {
    if (pendingReviewsInitialized.current) return;
    pendingReviewsInitialized.current = true;
    MOCK_DONE_APPOINTMENTS.forEach((apt) => {
      addPendingReview(apt);
    });
  }, [addPendingReview]);

  // ─── نمایش خودکار مدال نظردهی ───
  // useEffect(() => {
  //   if (pendingReviews.length > 0 && !reviewVisible) {
  //     const timer = setTimeout(() => {
  //       setCurrentReviewAppointment(pendingReviews[0]);
  //       setReviewVisible(true);
  //     }, 3000);
  //     return () => clearTimeout(timer);
  //   }
  // }, [pendingReviews, reviewVisible]);

  // ─── Handlers ───
  const handleThemeToggle = useCallback(
    () => setTheme(isDark ? 'light' : 'dark'),
    [isDark, setTheme]
  );
  const handleAdPress = useCallback(
    (ad) => {
      if (ad.businessId) router.push(`/business/${ad.businessId}`);
    },
    [router]
  );
  const handleCategorySelect = useCallback(
    (item) => {
      setSelectedCategory(item.id);
      router.push(`/category/${item.id}`);
    },
    [router]
  );
  const handleModelRequestPress = useCallback(
    (request) => router.push(`/model-requests/${request.id}`),
    [router]
  );
  const handleLineRentalPress = useCallback(
    (ad) => router.push(`/line-rentals/${ad.id}`),
    [router]
  );
  const handleReviewClose = useCallback(() => {
    setReviewVisible(false);
    setCurrentReviewAppointment(null);
  }, []);
  const handleFilterChange = useCallback((newFilters) => setFilters(newFilters), []);
  const handleClearAllFilters = useCallback(() => setFilters({}), []);

  return (
    <div className="min-h-screen pb-28" style={{ backgroundColor: colors.background }}>
      {/* ═══════════ هدر ═══════════ */}
      <HomeHeader
        userName={user?.name}
        userAvatar={user?.avatar}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSearchSubmit={() => {
          if (searchQuery.trim()) {
            router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
          }
        }}
        onSearchClick={() => router.push('/search')}
        onFilterPress={() => setFilterVisible(true)}
        hasActiveFilter={hasActiveFilter}
        isDark={isDark}
        onThemeToggle={handleThemeToggle}
        onNotificationPress={() => {
          if (isAuthenticated) {
            setNotificationVisible(true);
          } else {
            requireAuth(() => setNotificationVisible(true));
          }
        }}
        notificationCount={3}
      />

      {/* ═══════════ نوار فیلترهای فعال ═══════════ */}
      <ActiveFiltersBar
        filters={filters}
        onChange={handleFilterChange}
        onClearAll={handleClearAllFilters}
      />

      {/* ═══════════ بنر دعوت به ثبت‌نام ═══════════ */}
      {!isAuthenticated && <RegisterBanner onLogin={() => requireAuth()} />}

      {/* ═══════════ محتوای اصلی ═══════════ */}
      <div className="px-5 pt-4 flex flex-col gap-6">
        {/* ─── ۱. اسلایدر تبلیغات ─── */}
        <section>
          <SectionHeader
            icon={<FiStar size={18} />}
            iconColor={colors.primary}
            title="پیشنهادات ویژه"
            rightElement={
              <SeeAllButton onPress={() => router.push('/ads')} count={MOCK_ADS.length} />
            }
          />
          <AdSlider ads={MOCK_ADS} onPress={handleAdPress} />
        </section>

        {/* ─── 📍 دکمه نزدیک‌ترین‌ها ─── */}
        <section>
          <NearbyToggle
            nearbyEnabled={nearbyEnabled}
            nearbyLoading={nearbyLoading}
            maxDistanceKm={maxDistanceKm}
            onToggle={handleNearbyToggle}
          />
        </section>

        {/* ─── ۲. دسته‌بندی خدمات ─── */}
        <section>
          <SectionHeader icon={<FiGrid size={18} />} iconColor="#FF9800" title="دسته‌بندی خدمات" />
          <CategoryGrid
            categories={MOCK_CATEGORIES}
            selectedId={selectedCategory}
            onSelect={handleCategorySelect}
          />
        </section>

        {/* ─── ۳. فرصت‌های مدلینگ ─── */}
        <section>
          <SectionHeader
            icon={<FiUser size={18} />}
            iconColor="#E91E63"
            title="فرصت‌های مدلینگ"
            subtitle="با تخفیف ویژه مدل شوید و نمونه‌کار بسازید"
            rightElement={
              <SeeAllButton
                onPress={() => router.push('/model-requests')}
                count={filteredModelRequests.length}
              />
            }
          />
          {filteredModelRequests.length > 0 ? (
            <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide">
              {filteredModelRequests.map((request) => (
                <ModelRequestCard
                  key={request.id}
                  request={request}
                  onPress={handleModelRequestPress}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center py-8 gap-2">
              <span className="text-3xl">📍</span>
              <p className="text-sm font-[Vazir-Bold]" style={{ color: colors.textMain }}>
                فرصت مدلینگی در این فاصله پیدا نشد
              </p>
              <button
                onClick={disableNearby}
                className="text-xs font-[Vazir-Bold] underline"
                style={{ color: colors.primary }}
              >
                نمایش همه
              </button>
            </div>
          )}
        </section>

        {/* ─── ۴. فرصت‌های همکاری / اجاره لاین ─── */}
        <section>
          <SectionHeader
            icon={<FiAward size={18} />}
            iconColor="#667eea"
            title="فرصت‌های همکاری"
            subtitle="با اجاره لاین، کسب‌وکار خود را گسترش دهید"
            rightElement={
              <SeeAllButton
                onPress={() => router.push('/line-rentals')}
                count={filteredLineRentals.length}
              />
            }
          />
          {filteredLineRentals.length > 0 ? (
            <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide">
              {filteredLineRentals.map((ad) => (
                <LineRentalCard key={ad.id} ad={ad} onPress={handleLineRentalPress} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center py-8 gap-2">
              <span className="text-3xl">📍</span>
              <p className="text-sm font-[Vazir-Bold]" style={{ color: colors.textMain }}>
                فرصت همکاری در این فاصله پیدا نشد
              </p>
              <button
                onClick={disableNearby}
                className="text-xs font-[Vazir-Bold] underline"
                style={{ color: colors.primary }}
              >
                نمایش همه
              </button>
            </div>
          )}
        </section>
      </div>

      {/* ═══════════ Bottom Tab Bar ═══════════ */}
      <BottomTabBar />

      {/* ═══════════ مدال‌ها ═══════════ */}
      <NotificationModal
        visible={notificationVisible}
        onClose={() => setNotificationVisible(false)}
      />
      <HomeFilterModal
        visible={filterVisible}
        onClose={() => setFilterVisible(false)}
        onApply={setFilters}
        currentFilters={filters}
      />
      <ReviewModal
        visible={reviewVisible}
        appointment={currentReviewAppointment}
        onClose={handleReviewClose}
      />
    </div>
  );
}
