'use client';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import {
  FiZap,
  FiGrid,
  FiUser,
  FiUserPlus,
  FiArrowLeft,
  FiStar,
  FiCalendar,
  FiTrendingUp,
  FiAward,
  FiCreditCard,
  FiMapPin,
} from 'react-icons/fi';
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
import { useToast } from '@/hooks/useToast';
import { getCurrentLocation, calculateDistance } from '@/utils/geo-utils';
import { toPersianDigit } from '@/utils/numberUtils';
import { MOCK_CATEGORIES } from '@/data/businesses';
import { MOCK_ADS } from '@/data/ads';
import { MOCK_MODEL_REQUESTS } from '@/data/modelRequests';
import { MOCK_LINE_RENTALS } from '@/data/lineRentals';
import { MOCK_DONE_APPOINTMENTS } from '@/data/appointments';
import CostTypeBadge from '@/components/common/CostTypeBadge';
import CollabBadge from '@/components/common/CollabBadge';

// ─── انتخاب ایموجی بر اساس نام خدمت ───
const getServiceEmoji = (serviceName = '') => {
  if (serviceName.includes('ناخن')) return '💅';
  if (serviceName.includes('میکاپ') || serviceName.includes('گریم')) return '💄';
  if (
    serviceName.includes('فیشیال') ||
    serviceName.includes('پوست') ||
    serviceName.includes('پاکسازی')
  )
    return '✨';
  if (serviceName.includes('لیزر')) return '⚡';
  if (serviceName.includes('مو') || serviceName.includes('رنگ') || serviceName.includes('کراتین'))
    return '🎨';
  if (serviceName.includes('مژه') || serviceName.includes('ابرو')) return '👁️';
  if (serviceName.includes('ماساژ')) return '💆‍♀️';
  return '💆‍♀️';
};

const getLineEmoji = (typeName = '') => {
  if (typeName.includes('ناخن')) return '💅';
  if (typeName.includes('میکاپ') || typeName.includes('گریم')) return '💄';
  if (typeName.includes('فیشیال') || typeName.includes('پوست')) return '✨';
  if (typeName.includes('لیزر')) return '⚡';
  if (typeName.includes('مو') || typeName.includes('رنگ') || typeName.includes('کراتین'))
    return '🎨';
  if (typeName.includes('مژه') || typeName.includes('ابرو')) return '👁️';
  if (typeName.includes('ماساژ')) return '💆‍♀️';
  return '🏢';
};

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
        // ✅ فقط در صورت رد دسترسی، denied شود
        setNearbyDenied(true);
        showToast('دسترسی به موقعیت مکانی رد شد. از تنظیمات اجازه دهید.', 'error');
      } else if (err.code === 2) {
        // ✅ GPS خاموش — راهنمایی
        showToast('موقعیت مکانی در دسترس نیست. GPS را روشن کنید.', 'warning');
      } else if (err.code === 3) {
        // ✅ Timeout — نباید denied شود! کاربر دوباره تلاش کند
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
  useEffect(() => {
    MOCK_DONE_APPOINTMENTS.forEach((apt) => {
      addPendingReview(apt);
    });
  }, [addPendingReview]);

  // ─── نمایش خودکار مدال نظردهی ───
  useEffect(() => {
    if (pendingReviews.length > 0 && !reviewVisible) {
      const timer = setTimeout(() => {
        setCurrentReviewAppointment(pendingReviews[0]);
        setReviewVisible(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [pendingReviews, reviewVisible]);

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
    (request) => {
      router.push(`/model-requests/${request.id}`);
    },
    [router]
  );

  const handleLineRentalPress = useCallback(
    (ad) => {
      router.push(`/line-rentals/${ad.id}`);
    },
    [router]
  );

  const handleReviewClose = useCallback(() => {
    setReviewVisible(false);
    setCurrentReviewAppointment(null);
  }, []);

  const handleFilterChange = useCallback((newFilters) => {
    setFilters(newFilters);
  }, []);

  const handleClearAllFilters = useCallback(() => {
    setFilters({});
  }, []);

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

      {/* ═══════════ بنر دعوت به ثبت‌نام (فقط لاگین‌نشده) ═══════════ */}
      {!isAuthenticated && (
        <div
          className="mx-5 mt-3 p-4 rounded-2xl border relative overflow-hidden"
          style={{
            backgroundColor: colors.cardBackground,
            borderColor: colors.border,
          }}
        >
          <div
            className="absolute -top-3 -left-3 w-16 h-16 rounded-full"
            style={{ backgroundColor: colors.primary + '18' }}
          />
          <div
            className="absolute -bottom-4 -right-4 w-14 h-14 rounded-full"
            style={{ backgroundColor: '#FFC10720' }}
          />
          <div className="flex items-center justify-between gap-3 relative z-10">
            <div className="flex items-center gap-3 flex-1">
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center border"
                style={{
                  backgroundColor: colors.primary + '15',
                  borderColor: colors.primary + '30',
                }}
              >
                <FiZap size={22} color={colors.primary} />
              </div>
              <div className="flex flex-col gap-0.5 flex-1">
                <span className="text-[13px] font-[Vazir-Bold]" style={{ color: colors.textMain }}>
                  امکانات بیشتری می‌خوای؟ ✨
                </span>
                <span className="text-[11px] font-[Vazir]" style={{ color: colors.textSecondary }}>
                  رزرو آنلاین، ساخت آگهی، ذخیره و اشتراک پست‌ها و ...
                </span>
              </div>
            </div>
            <button
              onClick={() => requireAuth()}
              className="flex items-center gap-1 px-4 py-2.5 rounded-xl whitespace-nowrap"
              style={{ backgroundColor: colors.primary }}
            >
              <span className="text-white text-xs font-[Vazir-Bold]">ورود</span>
              <FiArrowLeft size={14} color="#fff" />
            </button>
          </div>
        </div>
      )}

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
          <button
            onClick={handleNearbyToggle}
            disabled={nearbyLoading}
            className="w-full flex items-center gap-3 p-4 rounded-2xl border-2 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60"
            style={{
              backgroundColor: nearbyEnabled ? '#2196F315' : colors.cardBackground,
              borderColor: nearbyEnabled ? '#2196F3' : colors.border,
            }}
          >
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: nearbyEnabled ? '#2196F320' : colors.primary + '15' }}
            >
              {nearbyLoading ? (
                <div
                  className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"
                  style={{ color: '#2196F3' }}
                />
              ) : (
                <FiMapPin size={24} color={nearbyEnabled ? '#2196F3' : colors.primary} />
              )}
            </div>
            <div className="flex-1 text-right">
              <span
                className="text-sm font-[Vazir-Bold] block"
                style={{ color: nearbyEnabled ? '#2196F3' : colors.textMain }}
              >
                {nearbyEnabled ? 'نزدیک‌ترین‌ها فعال است' : 'نزدیک‌ترین‌ها به من'}
              </span>
              <span
                className="text-[11px] font-[Vazir] block mt-0.5"
                style={{ color: colors.textSecondary }}
              >
                {nearbyEnabled
                  ? `تا ${toPersianDigit(maxDistanceKm)} کیلومتری شما`
                  : 'سالن‌ها، کلینیک‌ها و مراکز اطراف شما'}
              </span>
            </div>
            <div
              className="relative w-11 h-6 rounded-full transition-colors flex-shrink-0"
              style={{ backgroundColor: nearbyEnabled ? '#2196F3' : colors.border }}
            >
              <div
                className="absolute top-0.5 w-5 h-5 rounded-full shadow-md transition-all"
                style={{
                  backgroundColor: '#fff',
                  [nearbyEnabled ? 'right' : 'left']: '2px',
                }}
              />
            </div>
          </button>
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
                <button
                  key={request.id}
                  onClick={() => handleModelRequestPress(request)}
                  className="flex-shrink-0 w-[230px] rounded-[20px] overflow-hidden text-right
            transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                  style={{
                    backgroundColor: colors.cardBackground,
                    border: `1px solid ${colors.border}`,
                  }}
                >
                  {/* ═══ هدر گرادیانی ═══ */}
                  <div
                    className="relative h-[130px] overflow-hidden"
                    style={{
                      background: 'linear-gradient(135deg, #E91E63 0%, #AD1457 60%, #880E4F 100%)',
                    }}
                  >
                    {/* دایره‌های تزئینی */}
                    <div
                      className="absolute -top-8 -right-8 w-28 h-28 rounded-full"
                      style={{ backgroundColor: 'rgba(255,255,255,0.10)' }}
                    />
                    <div
                      className="absolute -bottom-6 -left-4 w-20 h-20 rounded-full"
                      style={{ backgroundColor: 'rgba(255,255,255,0.07)' }}
                    />
                    <div
                      className="absolute top-8 left-10 w-10 h-10 rounded-full"
                      style={{ backgroundColor: 'rgba(255,255,255,0.12)' }}
                    />
                    <div
                      className="absolute bottom-4 right-6 w-6 h-6 rounded-full"
                      style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}
                    />

                    {/* ایموجی خدمت */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span
                        className="text-[48px]"
                        style={{ filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.25))' }}
                      >
                        {getServiceEmoji(request.serviceName)}
                      </span>
                    </div>

                    {/* بج فوری */}
                    {request.isUrgent && (
                      <div
                        className="absolute top-3 left-3 px-2.5 py-1 rounded-lg
                  backdrop-blur-sm"
                        style={{ backgroundColor: 'rgba(255,152,0,0.9)' }}
                      >
                        <span className="text-[10px] font-[Vazir-Bold] text-white">🔥 فوری</span>
                      </div>
                    )}

                    {/* بج نوع هزینه */}
                    <div
                      className="absolute top-3 right-3 px-2.5 py-1 rounded-lg backdrop-blur-sm"
                      style={{
                        backgroundColor:
                          request.costType === 'free'
                            ? 'rgba(76,175,80,0.9)'
                            : request.costType === 'paid'
                              ? 'rgba(33,150,243,0.9)'
                              : 'rgba(255,152,0,0.9)',
                      }}
                    >
                      <span className="text-[10px] font-[Vazir-Bold] text-white">
                        {request.costType === 'free'
                          ? 'رایگان'
                          : request.costType === 'paid'
                            ? 'با هزینه'
                            : 'هزینه مواد'}
                      </span>
                    </div>

                    {/* نوار شیشه‌ای پایین هدر */}
                    <div
                      className="absolute bottom-0 left-0 right-0 h-[36px] flex items-center px-3 gap-2"
                      style={{ backgroundColor: 'rgba(0,0,0,0.25)', backdropFilter: 'blur(8px)' }}
                    >
                      <span className="text-[11px] font-[Vazir-Medium] text-white/90 truncate flex-1">
                        {request.serviceName}
                      </span>
                      {request.discount > 0 && (
                        <span
                          className="text-[10px] font-[Vazir-Bold] px-1.5 py-0.5 rounded-md flex-shrink-0"
                          style={{ backgroundColor: 'rgba(255,255,255,0.25)', color: '#fff' }}
                        >
                          {toPersianDigit(request.discount)}٪ تخفیف
                        </span>
                      )}
                    </div>
                  </div>

                  {/* ═══ بدنه کارت ═══ */}
                  <div className="p-3.5 space-y-2">
                    <h4
                      className="text-[13px] font-[Vazir-Bold] leading-[20px] line-clamp-2 min-h-[40px]"
                      style={{ color: colors.textMain }}
                    >
                      {request.title}
                    </h4>

                    {/* کسب‌وکار + شهر */}
                    <div className="flex items-center gap-1.5">
                      <span className="text-[13px]">🏪</span>
                      <span
                        className="text-[11px] font-[Vazir-Medium] truncate flex-1"
                        style={{ color: colors.primary }}
                      >
                        {request.businessName}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <FiMapPin size={11} style={{ color: colors.textSecondary }} />
                      <span className="text-[10px]" style={{ color: colors.textSecondary }}>
                        {request.city}
                      </span>
                    </div>
                  </div>
                </button>
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
                <button
                  key={ad.id}
                  onClick={() => handleLineRentalPress(ad)}
                  className="flex-shrink-0 w-[230px] rounded-[20px] overflow-hidden text-right
            transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                  style={{
                    backgroundColor: colors.cardBackground,
                    border: `1px solid ${colors.border}`,
                  }}
                >
                  {/* ═══ هدر گرادیانی ═══ */}
                  <div
                    className="relative h-[130px] overflow-hidden"
                    style={{
                      background: 'linear-gradient(135deg, #667eea 0%, #5a67d8 50%, #764ba2 100%)',
                    }}
                  >
                    {/* دایره‌های تزئینی */}
                    <div
                      className="absolute -top-6 -left-6 w-24 h-24 rounded-full"
                      style={{ backgroundColor: 'rgba(255,255,255,0.10)' }}
                    />
                    <div
                      className="absolute -bottom-8 -right-6 w-28 h-28 rounded-full"
                      style={{ backgroundColor: 'rgba(255,255,255,0.07)' }}
                    />
                    <div
                      className="absolute top-10 right-12 w-8 h-8 rounded-full"
                      style={{ backgroundColor: 'rgba(255,255,255,0.12)' }}
                    />
                    <div
                      className="absolute bottom-6 left-8 w-5 h-5 rounded-full"
                      style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}
                    />

                    {/* ایموجی خدمت */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span
                        className="text-[48px]"
                        style={{ filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.25))' }}
                      >
                        {getLineEmoji(ad.serviceTypeName)}
                      </span>
                    </div>

                    {/* بج نوع خدمت */}
                    <div
                      className="absolute top-3 right-3 px-2.5 py-1 rounded-lg backdrop-blur-sm"
                      style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
                    >
                      <span className="text-[10px] font-[Vazir-Bold] text-white">
                        {ad.serviceTypeName}
                      </span>
                    </div>

                    {/* نوار شیشه‌ای پایین هدر */}
                    <div
                      className="absolute bottom-0 left-0 right-0 h-[36px] flex items-center px-3 gap-2"
                      style={{ backgroundColor: 'rgba(0,0,0,0.25)', backdropFilter: 'blur(8px)' }}
                    >
                      <span className="text-[11px] font-[Vazir-Medium] text-white/90 truncate flex-1">
                        {ad.collabType === 'percent'
                          ? `درصدی ${ad.priceDisplay}`
                          : ad.collabType === 'hourly'
                            ? `ساعتی ${ad.priceDisplay}`
                            : `اجاره ثابت ${ad.priceDisplay}`}
                      </span>
                    </div>
                  </div>

                  {/* ═══ بدنه کارت ═══ */}
                  <div className="p-3.5 space-y-2">
                    <h4
                      className="text-[13px] font-[Vazir-Bold] leading-[20px] line-clamp-2 min-h-[40px]"
                      style={{ color: colors.textMain }}
                    >
                      {ad.title}
                    </h4>

                    {/* بج نوع همکاری */}
                    <div className="flex items-center gap-1.5">
                      <span
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-[Vazir-Bold]"
                        style={{
                          backgroundColor:
                            ad.collabType === 'percent'
                              ? '#9C27B018'
                              : ad.collabType === 'hourly'
                                ? '#FF980018'
                                : '#2196F318',
                          color:
                            ad.collabType === 'percent'
                              ? '#9C27B0'
                              : ad.collabType === 'hourly'
                                ? '#FF9800'
                                : '#2196F3',
                        }}
                      >
                        {ad.collabType === 'percent'
                          ? '📊'
                          : ad.collabType === 'hourly'
                            ? '⏰'
                            : '💰'}
                        {ad.collabType === 'percent'
                          ? 'درصدی'
                          : ad.collabType === 'hourly'
                            ? 'ساعتی'
                            : 'اجاره ثابت'}
                      </span>
                    </div>

                    {/* شهر */}
                    <div className="flex items-center gap-1.5">
                      <FiMapPin size={11} style={{ color: colors.textSecondary }} />
                      <span className="text-[10px]" style={{ color: colors.textSecondary }}>
                        {ad.city}
                      </span>
                    </div>
                  </div>
                </button>
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
