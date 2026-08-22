// src/app/nearby/page.jsx
'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { FiMapPin } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import ScreenWrapper from '@/components/common/ScreenWrapper';
import CategoryGrid from '@/components/home/CategoryGrid';
import SectionHeader from '@/components/common/SectionHeader';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { getCurrentLocation, calculateDistance } from '@/utils/geo-utils';
import NearbyHeader from '@/components/nearby/NearbyHeader';
import NearbyLoadingState from '@/components/nearby/NearbyLoadingState';
import NearbyErrorState from '@/components/nearby/NearbyErrorState';
import NearbyEmptyState from '@/components/nearby/NearbyEmptyState';
import NearbyBusinessList from '@/components/nearby/NearbyBusinessList';
import NearbyModelRequestsSection from '@/components/nearby/NearbyModelRequestsSection';
import NearbyLineRentalsSection from '@/components/nearby/NearbyLineRentalsSection';
import LocationInfoBar from '@/components/nearby/LocationInfoBar';

// ✅ API Services
import { businessesService, categoriesService, adsService } from '@/api';

// ✅ کش ماژول‌سطح برای موقعیت مکانی
let cachedLocation = null;
let cachedLocationTimestamp = 0;
const LOCATION_CACHE_TTL = 5 * 60 * 1000;

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

  // ✅ State‌های API
  const [categories, setCategories] = useState([]);
  const [nearbyBusinesses, setNearbyBusinesses] = useState([]);
  const [nearbyModelRequests, setNearbyModelRequests] = useState([]);
  const [nearbyLineRentals, setNearbyLineRentals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // ═══════ دریافت موقعیت مکانی ═══════
  const fetchLocation = useCallback(async (forceRefresh = false) => {
    if (!forceRefresh && cachedLocation && Date.now() - cachedLocationTimestamp < LOCATION_CACHE_TTL) {
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

  // ═══════ دریافت داده‌ها از API ═══════
  useEffect(() => {
    if (!userLocation) return;

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const params = {
          lat: userLocation.latitude,
          lng: userLocation.longitude,
          radius: 10,
          page_size: 30,
        };

        const [catRes, bizRes, modelRes, lineRes] = await Promise.allSettled([
          categoriesService.getBusinessCategories(),
          businessesService.getBusinessList(params),
          adsService.getModelRequests(params),
          adsService.getLineRentals(params),
        ]);

        if (catRes.status === 'fulfilled') {
          const cats = catRes.value.data || [];
          setCategories(
            cats.map((c) => ({
              id: String(c.id),
              name: c.name || c.title,
              icon: c.icon || 'face',
              count: c.count || 0,
            }))
          );
        }

        if (bizRes.status === 'fulfilled') {
          const bizList = bizRes.value.data || [];
          setNearbyBusinesses(
            bizList.map((b) => ({
              id: b.id,
              name: b.name,
              category: b.category?.name || b.category_name || '',
              address: b.address,
              rating: b.rating || 0,
              reviewsCount: b.reviews_count || 0,
              logo: b.logo,
              discount: b.discount || 0,
              latitude: b.latitude,
              longitude: b.longitude,
              distance: b.distance
                ? calculateDistance(userLocation.latitude, userLocation.longitude, b.latitude, b.longitude)
                : null,
            }))
          );
        }

        if (modelRes.status === 'fulfilled') {
          setNearbyModelRequests((modelRes.value.data || []).slice(0, 5));
        }

        if (lineRes.status === 'fulfilled') {
          setNearbyLineRentals((lineRes.value.data || []).slice(0, 5));
        }
      } catch (error) {
        console.error('Failed to fetch nearby data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [userLocation]);

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

  // ═══════ فیلتر بر اساس فاصله ═══════
  const businessesWithDistance = useMemo(() => {
    if (!userLocation) return [];
    return nearbyBusinesses
      .filter((biz) => biz.latitude && biz.longitude)
      .map((biz) => ({
        ...biz,
        distance: calculateDistance(userLocation.latitude, userLocation.longitude, biz.latitude, biz.longitude),
      }))
      .sort((a, b) => (a.distance || 0) - (b.distance || 0));
  }, [userLocation, nearbyBusinesses]);

  const filteredBusinesses = useMemo(() => {
    let list = businessesWithDistance.filter((b) => b.distance !== null);
    if (selectedCategoryId) {
      list = list.filter((b) => b.category_id === selectedCategoryId || b.categoryId === selectedCategoryId);
    }
    return list;
  }, [businessesWithDistance, selectedCategoryId]);

  const paginatedBusinesses = useMemo(() => {
    return filteredBusinesses.slice(0, page * PAGE_SIZE);
  }, [filteredBusinesses, page]);

  const hasMore = paginatedBusinesses.length < filteredBusinesses.length;

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

          {isLoading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner label="در حال بارگذاری..." />
            </div>
          ) : (
            <>
              <section>
                <SectionHeader
                  icon={<FiMapPin size={18} />}
                  iconColor="#FF9800"
                  title="دسته‌بندی خدمات"
                  subtitle="یک دسته انتخاب کنید تا نزدیک‌ترین‌ها را ببینید"
                />
                <CategoryGrid categories={categories} selectedId={selectedCategoryId} onSelect={handleCategorySelect} />
              </section>

              {selectedCategoryId && (
                <NearbyBusinessList
                  selectedCategoryId={selectedCategoryId}
                  categories={categories}
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
                <NearbyModelRequestsSection nearbyModelRequests={nearbyModelRequests} onModelPress={handleModelPress} />
              )}

              {!selectedCategoryId && (
                <NearbyLineRentalsSection nearbyLineRentals={nearbyLineRentals} onLinePress={handleLinePress} />
              )}
            </>
          )}
        </div>
      )}
    </ScreenWrapper>
  );
}