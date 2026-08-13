// src/app/nearby/page.jsx
'use client';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { FiArrowRight, FiMapPin, FiNavigation, FiRefreshCw, FiAlertTriangle } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import ScreenWrapper from '@/components/common/ScreenWrapper';
import CategoryGrid from '@/components/home/CategoryGrid';
import SectionHeader from '@/components/common/SectionHeader';
import BusinessListCard from '@/components/home/BusinessListCard';
import EmptyState from '@/components/common/EmptyState';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import Button from '@/components/common/Button';
import { MOCK_CATEGORIES, MOCK_BUSINESSES_LIST } from '@/data/businesses';
import { MOCK_MODEL_REQUESTS } from '@/data/modelRequests';
import { MOCK_LINE_RENTALS } from '@/data/lineRentals';
import { getCurrentLocation, calculateDistance, formatDistance } from '@/utils/geo-utils';
import { toPersianDigit } from '@/utils/numberUtils';
import AllModelRequestsCard from '@/components/home/AllModelRequestsCard';
import AllLineRentalsCard from '@/components/home/AllLineRentalsCard';
import SeeAllButton from '@/components/home/SeeAllButton';

export default function NearbyPage() {
  const router = useRouter();
  const { colors } = useTheme();

  const [userLocation, setUserLocation] = useState(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [page, setPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const PAGE_SIZE = 10;

  // ═══ دریافت موقعیت کاربر ═══
  const fetchLocation = useCallback(async () => {
    setLocationLoading(true);
    setLocationError(null);
    try {
      const loc = await getCurrentLocation();
      setUserLocation(loc);
    } catch (err) {
      setLocationError(getLocationErrorMessage(err));
    } finally {
      setLocationLoading(false);
    }
  }, []);

  // درخواست خودکار GPS هنگام ورود به صفحه
  useEffect(() => {
    fetchLocation();
  }, [fetchLocation]);

  // ═══ Helper: پیام خطای موقعیت مکانی ═══
  const getLocationErrorMessage = (err) => {
    if (!err) return 'خطای ناشناخته در دریافت موقعیت';

    const code = err.code;

    switch (code) {
      case 1:
        return 'دسترسی به موقعیت مکانی رد شد. لطفاً از تنظیمات گوشی اجازه دهید.';
      case 2:
        return 'موقعیت مکانی در دسترس نیست. لطفاً GPS گوشی را روشن کنید.';
      case 3:
        return 'دریافت موقعیت زمان‌بر شد. لطفاً دوباره تلاش کنید.';
      default:
        return err.message || 'خطا در دریافت موقعیت مکانی';
    }
  };

  // ═══ Helper: پیدا کردن دسته اصلی از subServiceId ═══
  const getCategoryForSubService = (subServiceId) => {
    const map = {
      makeup_bride: '1',
      makeup_party: '1',
      makeup_natural: '1',
      makeup_european: '1',
      makeup_grim: '1',
      shinyon: '1',
      nail_gel: '2',
      nail_powder: '2',
      nail_design: '2',
      nail_gelish: '2',
      nail_repair: '2',
      pedicure: '2',
      laser_alex: '3',
      laser_diode: '3',
      laser_fullbody: '3',
      laser_face: '3',
      laser_bikini: '3',
      facial_basic: '4',
      facial_vip: '4',
      facial_gold: '4',
      facial_hydro: '4',
      facial_acne: '4',
      facial_antiage: '4',
      hair_color_full: '5',
      hair_highlight: '5',
      hair_balayage: '5',
      hair_ombre: '5',
      hair_bleach: '5',
      hair_root: '5',
      keratin_brazilian: '6',
      keratin_protein: '6',
      keratin_botox: '6',
      keratin_nanoplasty: '6',
      hair_straighten: '6',
      lash_classic: '7',
      lash_hollywood: '7',
      lash_volume: '7',
      lash_lift: '7',
      lash_tint: '7',
      lash_removal: '7',
      massage_swedish: '8',
      massage_thai: '8',
      massage_sports: '8',
      massage_stone: '8',
      massage_aroma: '8',
    };
    return map[subServiceId] || null;
  };

  // ═══ محاسبه فاصله برای کسب‌وکارها ═══
  const businessesWithDistance = useMemo(() => {
    if (!userLocation) return [];
    return MOCK_BUSINESSES_LIST.map((biz) => {
      const lat = biz.latitude || biz.location?.latitude;
      const lng = biz.longitude || biz.location?.longitude;
      if (lat && lng) {
        const dist = calculateDistance(userLocation.latitude, userLocation.longitude, lat, lng);
        return { ...biz, distance: dist, distanceText: formatDistance(dist) };
      }
      return { ...biz, distance: null, distanceText: null };
    }).sort((a, b) => {
      if (a.distance === null && b.distance === null) return 0;
      if (a.distance === null) return 1;
      if (b.distance === null) return -1;
      return a.distance - b.distance;
    });
  }, [userLocation]);

  // ═══ فیلتر دسته‌بندی + Pagination ═══
  const filteredBusinesses = useMemo(() => {
    let list = businessesWithDistance.filter((b) => b.distance !== null);
    if (selectedCategoryId) {
      list = list.filter(
        (b) => b.subServiceId && getCategoryForSubService(b.subServiceId) === selectedCategoryId
      );
    }
    return list;
  }, [businessesWithDistance, selectedCategoryId]);

  const paginatedBusinesses = useMemo(() => {
    return filteredBusinesses.slice(0, page * PAGE_SIZE);
  }, [filteredBusinesses, page]);

  const hasMore = paginatedBusinesses.length < filteredBusinesses.length;

  // ═══ مدلینگ و همکاری نزدیک ═══
  const nearbyModelRequests = useMemo(() => {
    if (!userLocation) return [];
    return MOCK_MODEL_REQUESTS.filter((m) => m.status === 'active').slice(0, 3);
  }, [userLocation]);

  const nearbyLineRentals = useMemo(() => {
    if (!userLocation) return [];
    return MOCK_LINE_RENTALS.filter((l) => l.status === 'active').slice(0, 3);
  }, [userLocation]);

  // ═══ Handlers ═══
  const handleCategorySelect = useCallback((item) => {
    setSelectedCategoryId((prev) => (prev === item.id ? null : item.id));
    setPage(1);
  }, []);

  const handleLoadMore = useCallback(() => {
    if (isLoadingMore || !hasMore) return;
    setIsLoadingMore(true);
    setTimeout(() => {
      setPage((p) => p + 1);
      setIsLoadingMore(false);
    }, 500);
  }, [isLoadingMore, hasMore]);

  const handleBusinessPress = useCallback((biz) => router.push(`/business/${biz.id}`), [router]);

  const handleModelPress = useCallback((req) => router.push(`/model-requests/${req.id}`), [router]);

  const handleLinePress = useCallback((ad) => router.push(`/line-rentals/${ad.id}`), [router]);

  return (
    <ScreenWrapper scrollable padding={0}>
      {/* ═══ هدر ═══ */}
      <div
        className="flex items-center justify-between px-5 py-4 border-b sticky top-0 z-30"
        style={{ backgroundColor: colors.background, borderColor: colors.border }}
      >
        <button
          onClick={() => router.back()}
          className="w-10 h-10 rounded-full flex items-center justify-center border"
          style={{ backgroundColor: colors.cardBackground, borderColor: colors.border }}
        >
          <FiArrowRight size={22} style={{ color: colors.textMain }} />
        </button>
        <h1 className="text-base font-[Vazir-Bold]" style={{ color: colors.textMain }}>
          نزدیک‌ترین‌ها به من
        </h1>
        {/* دکمه رفرش موقعیت - فقط وقتی GPS فعال است */}
        {userLocation ? (
          <button
            onClick={fetchLocation}
            disabled={locationLoading}
            className="w-10 h-10 rounded-full flex items-center justify-center border transition-all active:scale-95"
            style={{
              backgroundColor: colors.cardBackground,
              borderColor: colors.border,
              opacity: locationLoading ? 0.6 : 1,
            }}
          >
            <FiRefreshCw
              size={18}
              style={{ color: colors.primary }}
              className={locationLoading ? 'animate-spin' : ''}
            />
          </button>
        ) : (
          <div className="w-10" />
        )}
      </div>

      {/* ═══ حالت Loading: در حال دریافت موقعیت ═══ */}
      {locationLoading && !userLocation && (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <LoadingSpinner label="در حال دریافت موقعیت شما..." />
          <p className="text-xs text-center px-6" style={{ color: colors.textSecondary }}>
            لطفاً در صورت نمایش پیام مرورگر، اجازه دسترسی به موقعیت را بدهید
          </p>
        </div>
      )}

      {/* ═══ حالت Error: خطا در دریافت موقعیت ═══ */}
      {!userLocation && !locationLoading && locationError && (
        <div className="flex flex-col items-center justify-center py-20 px-6 gap-4">
          <div
            className="w-24 h-24 rounded-full flex items-center justify-center"
            style={{ backgroundColor: '#FF980015' }}
          >
            <FiAlertTriangle size={48} color="#FF9800" />
          </div>
          <h3 className="text-lg font-[Vazir-Bold] text-center" style={{ color: colors.textMain }}>
            خطا در دریافت موقعیت
          </h3>
          <p
            className="text-sm text-center leading-6 max-w-xs"
            style={{ color: colors.textSecondary }}
          >
            {locationError}
          </p>
          <Button
            title="تلاش مجدد"
            onPress={fetchLocation}
            variant="primary"
            size="lg"
            icon={<FiRefreshCw size={18} color="#fff" />}
            iconPosition="right"
          />
        </div>
      )}

      {/* ═══ حالت بدون موقعیت: درخواست GPS ═══ */}
      {!userLocation && !locationLoading && !locationError && (
        <div className="flex flex-col items-center justify-center py-20 px-6 gap-4">
          <div
            className="w-24 h-24 rounded-full flex items-center justify-center"
            style={{ backgroundColor: '#2196F315' }}
          >
            <FiMapPin size={48} color="#2196F3" />
          </div>
          <h3 className="text-lg font-[Vazir-Bold] text-center" style={{ color: colors.textMain }}>
            موقعیت مکانی لازم است
          </h3>
          <p
            className="text-sm text-center leading-6 max-w-xs"
            style={{ color: colors.textSecondary }}
          >
            برای نمایش کسب‌وکارهای نزدیک، لطفاً دسترسی موقعیت مکانی را فعال کنید
          </p>
          <Button
            title="فعال‌سازی موقعیت مکانی"
            onPress={fetchLocation}
            variant="primary"
            size="lg"
            icon={<FiNavigation size={18} color="#fff" />}
            iconPosition="right"
          />
        </div>
      )}

      {/* ═══ محتوای اصلی (فقط وقتی GPS فعال است) ═══ */}
      {userLocation && (
        <div className="px-5 pt-4 pb-32 space-y-6">
          {/* نمایش مختصات فعلی (اختیاری) */}
          <div
            className="flex items-center justify-between p-3 rounded-xl border"
            style={{ backgroundColor: colors.cardBackground, borderColor: colors.border }}
          >
            <div className="flex items-center gap-2">
              <FiMapPin size={16} style={{ color: colors.primary }} />
              <span className="text-xs font-[Vazir-Medium]" style={{ color: colors.textSecondary }}>
                موقعیت فعلی شما
              </span>
            </div>
            <span
              className="text-[10px] font-mono"
              style={{ color: colors.textSecondary, direction: 'ltr' }}
            >
              {userLocation.latitude.toFixed(4)}°, {userLocation.longitude.toFixed(4)}°
            </span>
          </div>

          {/* ─── دسته‌بندی خدمات ─── */}
          <section>
            <SectionHeader
              icon={<FiMapPin size={18} />}
              iconColor="#FF9800"
              title="دسته‌بندی خدمات"
              subtitle="یک دسته انتخاب کنید تا نزدیک‌ترین‌ها را ببینید"
            />
            <CategoryGrid
              categories={MOCK_CATEGORIES}
              selectedId={selectedCategoryId}
              onSelect={handleCategorySelect}
            />
          </section>

          {/* ─── لیست کسب‌وکارهای نزدیک (پس از انتخاب دسته) ─── */}
          {selectedCategoryId && (
            <section>
              <SectionHeader
                icon={<FiNavigation size={18} />}
                iconColor="#2196F3"
                title={`نزدیک‌ترین ${MOCK_CATEGORIES.find((c) => c.id === selectedCategoryId)?.name || ''}`}
                subtitle={`${toPersianDigit(filteredBusinesses.length)} کسب‌وکار یافت شد`}
              />
              {paginatedBusinesses.length > 0 ? (
                <div className="space-y-3">
                  {paginatedBusinesses.map((biz) => (
                    <BusinessListCard
                      key={biz.id}
                      business={biz}
                      categoryIcon="💆‍♀️"
                      onPress={handleBusinessPress}
                    />
                  ))}
                  {hasMore && (
                    <button
                      onClick={handleLoadMore}
                      disabled={isLoadingMore}
                      className="w-full py-3 text-center text-sm font-[Vazir-Bold] rounded-xl border transition-all active:scale-[0.98]"
                      style={{ color: colors.primary, borderColor: colors.border }}
                    >
                      {isLoadingMore ? 'در حال بارگذاری...' : 'مشاهده بیشتر'}
                    </button>
                  )}
                </div>
              ) : (
                <EmptyState
                  icon="📍"
                  title="کسب‌وکاری در این دسته نزدیک شما نیست"
                  description="دسته دیگری را امتحان کنید یا فاصله جستجو را بیشتر کنید"
                  actionLabel="حذف فیلتر"
                  onAction={() => setSelectedCategoryId(null)}
                />
              )}
            </section>
          )}

          {/* ─── فرصت‌های مدلینگ نزدیک (قبل از انتخاب دسته) ─── */}
          {!selectedCategoryId && nearbyModelRequests.length > 0 && (
            <section>
              <SectionHeader
                icon={<span style={{ fontSize: 18 }}>👤</span>}
                iconColor="#E91E63"
                title="فرصت‌های مدلینگ نزدیک"
                rightElement={
                  <SeeAllButton
                    onPress={() => router.push('/model-requests?nearby=true')}
                    count={MOCK_MODEL_REQUESTS.filter((m) => m.status === 'active').length}
                  />
                }
              />
              <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide">
                {nearbyModelRequests.map((req) => (
                  <div key={req.id} className="flex-shrink-0 w-[220px]">
                    <AllModelRequestsCard request={req} onPress={handleModelPress} />
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ─── فرصت‌های همکاری نزدیک (قبل از انتخاب دسته) ─── */}
          {!selectedCategoryId && nearbyLineRentals.length > 0 && (
            <section>
              <SectionHeader
                icon={<span style={{ fontSize: 18 }}>🏢</span>}
                iconColor="#667eea"
                title="فرصت‌های همکاری نزدیک"
                rightElement={
                  <SeeAllButton
                    onPress={() => router.push('/line-rentals?nearby=true')}
                    count={MOCK_LINE_RENTALS.filter((l) => l.status === 'active').length}
                  />
                }
              />
              <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide">
                {nearbyLineRentals.map((ad) => (
                  <div key={ad.id} className="flex-shrink-0 w-[220px]">
                    <AllLineRentalsCard ad={ad} onPress={handleLinePress} />
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </ScreenWrapper>
  );
}
