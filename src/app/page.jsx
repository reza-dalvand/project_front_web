'use client';

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { FiGrid, FiUser, FiStar, FiAward } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import { useAuth } from '@/stores/useAuthStore';
import { useReviewStore } from '@/stores/useReviewStore';
import { SectionHeader, BottomTabBar } from '@/components/common';
import HomeHeader from '@/components/home/HomeHeader';
import AdSlider from '@/components/home/AdSlider';
import CategoryGrid from '@/components/home/CategoryGrid';
import SeeAllButton from '@/components/home/SeeAllButton';
import ActiveFiltersBar from '@/components/home/ActiveFiltersBar';
import LineRentalCard from '@/components/home/LineRentalCard';
import NearbyToggle from '@/components/home/NearbyToggle';
import RegisterBanner from '@/components/home/RegisterBanner';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { useToast } from '@/hooks/useToast';
import { getCurrentLocation, calculateDistance } from '@/utils/geo-utils';
import { useGlobalLocationStore } from '@/stores/useGlobalLocationStore';
import { adsService, categoriesService, exploreService, reviewsService } from '@/api';

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
  const router = useRouter();
  const { colors, resolvedTheme, setTheme } = useTheme();
  const { isAuthenticated, user, requireAuth } = useAuth();
  const { showToast } = useToast();
  const { addPendingReview } = useReviewStore();
  const isDark = resolvedTheme === 'dark';

  // ═══════ ✅ FIX: استفاده از subscribe برای اطمینان از re-render ═══════
  const [locationState, setLocationState] = useState({
    provinceId: null,
    cityId: null,
    latitude: null,
    longitude: null,
    gpsEnabled: false,
    gpsLoading: false,
    locationType: 'all',
  });

  useEffect(() => {
    const unsubscribe = useGlobalLocationStore.subscribe((state) => {
      setLocationState({
        provinceId: state.provinceId,
        cityId: state.cityId,
        latitude: state.latitude,
        longitude: state.longitude,
        gpsEnabled: state.gpsEnabled,
        gpsLoading: state.gpsLoading,
        locationType: state.locationType,
      });
    });

    const initialState = useGlobalLocationStore.getState();
    setLocationState({
      provinceId: initialState.provinceId,
      cityId: initialState.cityId,
      latitude: initialState.latitude,
      longitude: initialState.longitude,
      gpsEnabled: initialState.gpsEnabled,
      gpsLoading: initialState.gpsLoading,
      locationType: initialState.locationType,
    });

    return () => unsubscribe();
  }, []);

  const getLocationParams = useCallback(() => {
    return useGlobalLocationStore.getState().getLocationParams();
  }, []);

  // ─── State‌ها ───
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [notificationVisible, setNotificationVisible] = useState(false);
  const [filterVisible, setFilterVisible] = useState(false);
  const [filters, setFilters] = useState({});
  const [reviewVisible, setReviewVisible] = useState(false);
  const [currentReviewAppointment, setCurrentReviewAppointment] = useState(null);
  const [ads, setAds] = useState([]);
  const [categories, setCategories] = useState([]);
  const [lineRentals, setLineRentals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // ═══════ دریافت داده‌ها از API ═══════
  useEffect(() => {
    const fetchAllData = async () => {
      setIsLoading(true);
      try {
        const locationParams = getLocationParams();
        const [adsRes, catRes, lineRes] = await Promise.allSettled([
          exploreService.getPosts({ page_size: 6, ...locationParams }),
          categoriesService.getServiceCategories({ ...locationParams }),
          adsService.getLineRentals({ page_size: 6, ...locationParams }),
        ]);
        if (adsRes.status === 'fulfilled') {
          const posts = adsRes.value.data || [];
          setAds(
            posts.map((p, i) => ({
              id: p.id || i,
              title: p.caption || p.businessName || 'بیو کلاب',
              subtitle: p.businessName || '',
              imageUrl: p.gallery?.[0] || p.images?.[0] || '',
              businessId: p.businessId || p.business_id,
              businessSlug: p.businessBookingSlug || p.business_booking_slug,
              badge: p.discount > 0 ? `${p.discount}%` : null,
            }))
          );
        }
        if (catRes.status === 'fulfilled') {
          const cats = catRes.value.data || [];
          setCategories(
            cats.map((c) => ({
              id: String(c.id),
              name: c.name || c.title,
              icon: c.iconName || c.icon_name || 'default',
              gradientStart: c.gradientStart || c.gradient_start || '#A88B7D',
              gradientEnd: c.gradientEnd || c.gradient_end || '#8D7468',
              count: c.count || 0,
            }))
          );
        }
        if (lineRes.status === 'fulfilled') {
          setLineRentals(lineRes.value.data || []);
        }
      } catch (error) {
        console.error('Failed to fetch home data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAllData();
  }, [
    locationState.provinceId,
    locationState.cityId,
    locationState.latitude,
    locationState.longitude,
    locationState.gpsEnabled,
    locationState.locationType,
    getLocationParams,
  ]);

  // ═══════ بررسی خودکار نوبت‌های آماده نظردهی (اصلاح شده) ═══════
  const pendingCheckDone = useRef(false);
  useEffect(() => {
    if (!isAuthenticated || pendingCheckDone.current) return;

    const checkPendingReviews = async () => {
      try {
        const result = await reviewsService.getPendingReviews();
        const pending = result.data || [];

        if (pending.length > 0) {
          const { dismissedAppointments, reviewedBusinessIds } = useReviewStore.getState();

          // ✅ پیدا کردن اولین نوبتی که:
          // 1. قبلاً بسته (dismiss) نشده باشد
          // 2. کسب‌وکار آن قبلاً نظر داده نشده باشد
          const reviewableApt = pending.find((apt) => {
            const bizId = apt.business_id || apt.businessId;
            return !dismissedAppointments.includes(apt.id) && !reviewedBusinessIds.includes(bizId);
          });

          if (reviewableApt) {
            const aptData = {
              id: reviewableApt.id,
              businessId: reviewableApt.business_id || reviewableApt.businessId,
              businessName: reviewableApt.business_name || reviewableApt.businessName,
              businessLogo: reviewableApt.business_logo || reviewableApt.businessLogo,
              serviceName: reviewableApt.service_name || reviewableApt.serviceName,
              date: reviewableApt.date_key || reviewableApt.dateKey,
              time: reviewableApt.time_slot || reviewableApt.timeSlot,
            };

            // ✅ اضافه کردن به استور تا موقع ثبت نظر، businessId در دسترس باشد
            addPendingReview(aptData);

            setCurrentReviewAppointment(aptData);
            setReviewVisible(true);
          }
        }
        pendingCheckDone.current = true;
      } catch (error) {
        console.error('Failed to check pending reviews:', error);
      }
    };

    checkPendingReviews();
  }, [isAuthenticated, addPendingReview]);

  // ═══════ ✅ تغییر: NearbyToggle با استفاده از getState ═══════
  const handleNearbyToggle = useCallback(async () => {
    const { gpsEnabled, disableGps, enableGps, handleGpsError, setGpsLoading } =
      useGlobalLocationStore.getState();

    if (gpsEnabled) {
      disableGps();
      showToast('فیلتر موقعیت مکانی غیرفعال شد', 'info');
      return;
    }

    setGpsLoading(true);
    try {
      const loc = await getCurrentLocation();
      enableGps(loc.latitude, loc.longitude);
      showToast('موقعیت مکانی شما فعال شد', 'success');
    } catch (err) {
      handleGpsError();
      if (err.code === 1) {
        showToast('دسترسی به موقعیت رد شد. از تنظیمات اجازه دهید.', 'error');
      } else if (err.code === 2) {
        showToast('GPS در دسترس نیست. روشن کنید.', 'warning');
      } else {
        showToast('خطا در دریافت موقعیت', 'error');
      }
    } finally {
      setGpsLoading(false);
    }
  }, [showToast]);

  // ═══════ ✅ تغییر: فیلتر اجاره لاین بر اساس locationState ═══════
  const filteredLineRentals = useMemo(() => {
    if (!locationState.gpsEnabled || !locationState.latitude || !locationState.longitude)
      return lineRentals;
    return lineRentals.filter((ad) => {
      const lat = ad.latitude || ad.lat;
      const lng = ad.longitude || ad.lng;
      if (!lat || !lng) return false;
      const dist = calculateDistance(locationState.latitude, locationState.longitude, lat, lng);
      return dist <= 10;
    });
  }, [locationState.gpsEnabled, locationState.latitude, locationState.longitude, lineRentals]);

  // ═══════ hasActiveFilter ═══════
  const hasActiveFilter = useMemo(
    () => Object.values(filters).some((v) => v && v !== 'all' && v !== 'recommended'),
    [filters]
  );

  // ─── Handlers ───
  const handleThemeToggle = useCallback(
    () => setTheme(isDark ? 'light' : 'dark'),
    [isDark, setTheme]
  );
  const handleAdPress = useCallback(
    (ad) => {
      const slug = ad.businessSlug || ad.businessId;
      if (slug) router.push(`/business?slug=${slug}`);
    },
    [router]
  );
  const handleCategorySelect = useCallback(
    (item) => {
      setSelectedCategory(item.id);
      router.push(`/category?id=${item.id}`);
    },
    [router]
  );
  const handleLineRentalPress = useCallback(
    (ad) => router.push(`/line-rentals/detail?id=${ad.id}`),
    [router]
  );
  const handleReviewClose = useCallback(() => {
    if (currentReviewAppointment) {
      // ✅ وقتی کاربر مدال را می‌بندد، این نوبت خاص dismiss می‌شود
      // اما اگر نوبت جدیدی از همین کسب‌وکار بگیرد، چون ID جدید است، دوباره مدال نمایش داده می‌شود
      useReviewStore.getState().dismissPendingReview(currentReviewAppointment.id);
    }
    setReviewVisible(false);
    setCurrentReviewAppointment(null);
  }, [currentReviewAppointment]);

  const handleFilterChange = useCallback((newFilters) => setFilters(newFilters), []);
  const handleClearAllFilters = useCallback(() => setFilters({}), []);

  // ═══════ Loading State ═══════
  if (isLoading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: colors.background }}
      >
        <LoadingSpinner label="در حال بارگذاری..." />
      </div>
    );
  }

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
        {ads.length > 0 && (
          <section>
            <SectionHeader
              icon={<FiStar size={18} />}
              iconColor={colors.primary}
              title="پیشنهادات ویژه"
              rightElement={<SeeAllButton onPress={() => router.push('/ads')} count={ads.length} />}
            />
            <AdSlider ads={ads} onPress={handleAdPress} />
          </section>
        )}

        {/* ─── 📍 دکمه نزدیک‌ترین‌ها ═══ */}
        <section>
          <NearbyToggle
            nearbyEnabled={locationState.gpsEnabled}
            nearbyLoading={locationState.gpsLoading}
            onToggle={handleNearbyToggle}
          />
        </section>

        {/* ─── ۲. دسته‌بندی خدمات ─── */}
        {categories.length > 0 && (
          <section>
            <SectionHeader
              icon={<FiGrid size={18} />}
              iconColor="#FF9800"
              title="دسته‌بندی خدمات"
            />
            <CategoryGrid
              categories={categories}
              selectedId={selectedCategory}
              onSelect={handleCategorySelect}
            />
          </section>
        )}

        {/* ─── ۳. فرصت‌های همکاری / اجاره لاین ─── */}
        {filteredLineRentals.length > 0 && (
          <section>
            <SectionHeader
              icon={<span style={{ fontSize: 18 }}>🏢</span>}
              iconColor="#667eea"
              title="فرصت‌های همکاری"
              rightElement={
                <SeeAllButton
                  onPress={() => router.push('/line-rentals')}
                  count={filteredLineRentals.length}
                />
              }
            />
            <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide">
              {filteredLineRentals.map((rental) => (
                <LineRentalCard key={rental.id} rental={rental} onPress={handleLineRentalPress} />
              ))}
            </div>
          </section>
        )}
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
