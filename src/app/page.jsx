// src/app/page.jsx
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
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { useToast } from '@/hooks/useToast';
import { getCurrentLocation, calculateDistance } from '@/utils/geo-utils';

// ✅ API Services
import { adsService, categoriesService, exploreService, appointmentsService } from '@/api';

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

  // ✅ State‌های داده از API
  const [ads, setAds] = useState([]);
  const [categories, setCategories] = useState([]);
  const [modelRequests, setModelRequests] = useState([]);
  const [lineRentals, setLineRentals] = useState([]);
  const [doneAppointments, setDoneAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // ═══════ دریافت داده‌ها از API ═══════
  useEffect(() => {
    const fetchAllData = async () => {
      setIsLoading(true);
      try {
        const [adsRes, catRes, modelRes, lineRes] = await Promise.allSettled([
          exploreService.getPosts({ page_size: 6 }),
          categoriesService.getServiceCategories(),
          adsService.getModelRequests(
            nearbyEnabled && userLocation
              ? { lat: userLocation.latitude, lng: userLocation.longitude, page_size: 6 }
              : { page_size: 6 }
          ),
          adsService.getLineRentals(
            nearbyEnabled && userLocation
              ? { lat: userLocation.latitude, lng: userLocation.longitude, page_size: 6 }
              : { page_size: 6 }
          ),
        ]);

        if (adsRes.status === 'fulfilled') {
          const posts = adsRes.value.data || [];
          // تبدیل پست‌های ویترین به فرمت اسلایدر تبلیغاتی
          setAds(
            posts.map((p, i) => ({
              id: p.id || i,
              title: p.caption || p.businessName || 'بیو کلاب',
              subtitle: p.businessName || '',
              imageUrl: p.gallery?.[0] || p.images?.[0] || '',
              businessId: p.businessId || p.business_id,
              businessSlug: p.businessBookingSlug || p.business_booking_slug, // ✅ اضافه شود
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

        if (modelRes.status === 'fulfilled') {
          setModelRequests(modelRes.value.data || []);
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
  }, [nearbyEnabled, userLocation]);

  // ═══════ دریافت نوبت‌های گذشته برای نظردهی ═══════
  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchDoneAppointments = async () => {
      try {
        const result = await appointmentsService.getMyAppointments('past');
        const appointments = result.data || [];
        // فقط نوبت‌های انجام‌شده که هنوز نظر ندارند
        const done = appointments.filter((a) => a.status === 'done');
        setDoneAppointments(done);
      } catch (error) {
        console.error('Failed to fetch done appointments:', error);
      }
    };

    fetchDoneAppointments();
  }, [isAuthenticated]);

  // ─── افزودن نوبت‌های انجام‌شده به pendingReviews ───
  const pendingReviewsInitialized = useRef(false);
  useEffect(() => {
    if (pendingReviewsInitialized.current || doneAppointments.length === 0) return;
    pendingReviewsInitialized.current = true;
    doneAppointments.forEach((apt) => {
      addPendingReview({
        id: apt.id,
        businessName: apt.business_name || apt.businessName,
        businessLogo: apt.business_logo || apt.businessLogo,
        serviceName: apt.service_name || apt.serviceName,
        date: apt.date_key || apt.dateKey,
        time: apt.time_slot || apt.timeSlot,
      });
    });
  }, [doneAppointments, addPendingReview]);

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
    if (!nearbyEnabled || !userLocation) return modelRequests;
    return modelRequests.filter((req) => {
      const lat = req.latitude || req.lat;
      const lng = req.longitude || req.lng;
      if (!lat || !lng) return false;
      const dist = calculateDistance(userLocation.latitude, userLocation.longitude, lat, lng);
      return dist <= maxDistanceKm;
    });
  }, [nearbyEnabled, userLocation, modelRequests, maxDistanceKm]);

  // ═══════ فیلتر اجاره لاین بر اساس فاصله ═══════
  const filteredLineRentals = useMemo(() => {
    if (!nearbyEnabled || !userLocation) return lineRentals;
    return lineRentals.filter((ad) => {
      const lat = ad.latitude || ad.lat;
      const lng = ad.longitude || ad.lng;
      if (!lat || !lng) return false;
      const dist = calculateDistance(userLocation.latitude, userLocation.longitude, lat, lng);
      return dist <= maxDistanceKm;
    });
  }, [nearbyEnabled, userLocation, lineRentals, maxDistanceKm]);

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
      if (slug) router.push(`/business?slug=${slug}`); // ✅ تغییر مسیر
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

  const handleModelRequestPress = useCallback(
    (request) => router.push(`/model-requests/detail?id=${request.id}`),
    [router]
  );

  const handleLineRentalPress = useCallback(
    (ad) => router.push(`/line-rentals/detail?id=${ad.id}`),
    [router]
  );

  const handleReviewClose = useCallback(() => {
    setReviewVisible(false);
    setCurrentReviewAppointment(null);
  }, []);

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

        {/* ─── ۳. فرصت‌های مدلینگ ─── */}
        {modelRequests.length > 0 && (
          <section>
            <SectionHeader
              icon={<span style={{ fontSize: 18 }}>👤</span>}
              iconColor="#E91E63"
              title="فرصت‌های مدلینگ"
              rightElement={
                <SeeAllButton
                  onPress={() => router.push('/model-requests')}
                  count={modelRequests.length}
                />
              }
            />
            <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide">
              {modelRequests.map((request) => (
                <ModelRequestCard
                  key={request.id}
                  request={request}
                  onPress={handleModelRequestPress}
                />
              ))}
            </div>
          </section>
        )}
        {/* ─── ۴. فرصت‌های همکاری / اجاره لاین ─── */}
        {lineRentals.length > 0 && (
          <section>
            <SectionHeader
              icon={<span style={{ fontSize: 18 }}>🏢</span>}
              iconColor="#667eea"
              title="فرصت‌های همکاری"
              rightElement={
                <SeeAllButton
                  onPress={() => router.push('/line-rentals')}
                  count={lineRentals.length}
                />
              }
            />
            <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide">
              {lineRentals.map((rental) => (
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
