// src/app/nearby/page.jsx
'use client';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { FiMapPin } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import ScreenWrapper from '@/components/common/ScreenWrapper';
import CategoryGrid from '@/components/home/CategoryGrid';
import SectionHeader from '@/components/common/SectionHeader';
import { getCurrentLocation, calculateDistance } from '@/utils/geo-utils';
import NearbyHeader from '@/components/nearby/NearbyHeader';
import NearbyLoadingState from '@/components/nearby/NearbyLoadingState';
import NearbyErrorState from '@/components/nearby/NearbyErrorState';
import NearbyEmptyState from '@/components/nearby/NearbyEmptyState';
import NearbyBusinessList from '@/components/nearby/NearbyBusinessList';
import NearbyModelRequestsSection from '@/components/nearby/NearbyModelRequestsSection';
import NearbyLineRentalsSection from '@/components/nearby/NearbyLineRentalsSection';
import LocationInfoBar from '@/components/nearby/LocationInfoBar';

// ✅ FIX (فاز ۴): کش ماژول‌سطح برای موقعیت مکانی
// جلوگیری از فراخوانی مجدد GPS/WiFi در هر mount (صرفه‌جویی ۲-۱۰ ثانیه)
let cachedLocation = null;
let cachedLocationTimestamp = 0;
const LOCATION_CACHE_TTL = 5 * 60 * 1000; // ۵ دقیقه کش

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

  // ✅ FIX (فاز ۴): استفاده از کش + پارامتر forceRefresh برای refresh دستی
  const fetchLocation = useCallback(async (forceRefresh = false) => {
    // استفاده از کش اگر موجود و تازه باشد
    if (
      !forceRefresh &&
      cachedLocation &&
      Date.now() - cachedLocationTimestamp < LOCATION_CACHE_TTL
    ) {
      setUserLocation(cachedLocation);
      return;
    }

    setLocationLoading(true);
    setLocationError(null);
    try {
      const loc = await getCurrentLocation();
      cachedLocation = loc;
      cachedLocationTimestamp = Date.now();
      setUserLocation(loc);
    } catch (err) {
      setLocationError(getLocationErrorMessage(err));
    } finally {
      setLocationLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLocation();
  }, [fetchLocation]);

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

  const businessesWithDistance = useMemo(() => {
    if (!userLocation) return [];
    return MOCK_BUSINESSES_LIST.map((biz) => {
      const lat = biz.latitude || biz.location?.latitude;
      const lng = biz.longitude || biz.location?.longitude;
      if (lat && lng) {
        const dist = calculateDistance(userLocation.latitude, userLocation.longitude, lat, lng);
        return { ...biz, distance: dist };
      }
      return { ...biz, distance: null };
    }).sort((a, b) => {
      if (a.distance === null && b.distance === null) return 0;
      if (a.distance === null) return 1;
      if (b.distance === null) return -1;
      return a.distance - b.distance;
    });
  }, [userLocation]);

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

  const nearbyModelRequests = useMemo(() => {
    if (!userLocation) return [];
    return MOCK_MODEL_REQUESTS.filter((m) => m.status === 'active').slice(0, 3);
  }, [userLocation]);

  const nearbyLineRentals = useMemo(() => {
    if (!userLocation) return [];
    return MOCK_LINE_RENTALS.filter((l) => l.status === 'active').slice(0, 3);
  }, [userLocation]);

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
      {/* ✅ FIX (فاز ۴): forceRefresh=true برای refresh دستی */}
      <NearbyHeader
        onBack={() => router.back()}
        onRefresh={() => fetchLocation(true)}
        isLoading={locationLoading}
        hasLocation={!!userLocation}
      />
      {locationLoading && !userLocation && <NearbyLoadingState />}
      {!userLocation && !locationLoading && locationError && (
        <NearbyErrorState errorMessage={locationError} onRetry={() => fetchLocation(true)} />
      )}
      {!userLocation && !locationLoading && !locationError && (
        <NearbyEmptyState onEnableLocation={() => fetchLocation(true)} />
      )}
      {userLocation && (
        <div className="px-5 pt-4 pb-32 space-y-6">
          <LocationInfoBar latitude={userLocation.latitude} longitude={userLocation.longitude} />
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
          {selectedCategoryId && (
            <NearbyBusinessList
              selectedCategoryId={selectedCategoryId}
              paginatedBusinesses={paginatedBusinesses}
              filteredBusinesses={filteredBusinesses}
              hasMore={hasMore}
              isLoadingMore={isLoadingMore}
              onLoadMore={handleLoadMore}
              onBusinessPress={handleBusinessPress}
              onClearFilter={() => setSelectedCategoryId(null)}
            />
          )}
          {!selectedCategoryId && (
            <NearbyModelRequestsSection
              nearbyModelRequests={nearbyModelRequests}
              onModelPress={handleModelPress}
            />
          )}
          {!selectedCategoryId && (
            <NearbyLineRentalsSection
              nearbyLineRentals={nearbyLineRentals}
              onLinePress={handleLinePress}
            />
          )}
        </div>
      )}
    </ScreenWrapper>
  );
}
