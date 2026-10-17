// src/app/explore/page.jsx
'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { FiFilter } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import { useAuthStore } from '@/stores/useAuthStore';
import { useFavoriteStore } from '@/stores/useFavoriteStore';
import ScreenWrapper from '@/components/common/ScreenWrapper';
import SectionHeader from '@/components/common/SectionHeader';
import { PostGrid, ActiveFilterChips, FilterModal, PostModal } from '@/components/explore';
import { useGlobalLocationStore } from '@/stores/useGlobalLocationStore';
import { exploreService } from '@/api';
import { useShallow } from 'zustand/react/shallow';
import { BottomTabBar } from '@/components/common';

const PAGE_SIZE = 21;
// ✅ FIX: محدودیت حداکثر اندازه آرایه برای جلوگیری از memory leak
const MAX_POSTS_SIZE = 500;

const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export default function ExplorePage() {
  const { colors } = useTheme();
  const router = useRouter();

  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const authHydrated = useAuthStore((s) => s._hydrated);
  const fetchFavorites = useFavoriteStore((s) => s.fetchFavorites);

  const [allPosts, setAllPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [loadMoreError, setLoadMoreError] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [activePost, setActivePost] = useState(null);
  const [filterVisible, setFilterVisible] = useState(false);

  const [filters, setFilters] = useState({
    mainCategory: 'all',
    subCategory: 'all',
    source: 'all',
  });

  // ✅ برای جلوگیری از race condition و ignore شدن response های قدیمی
  const requestIdRef = useRef(0);

  // ✅ برای جلوگیری از ارسال همزمان چند درخواست load-more
  const loadMoreLockRef = useRef(false);

  const locationState = useGlobalLocationStore(
    useShallow((state) => ({
      provinceId: state.provinceId,
      cityId: state.cityId,
      latitude: state.latitude,
      longitude: state.longitude,
      gpsEnabled: state.gpsEnabled,
      locationType: state.locationType,
    }))
  );

  const getLocationParams = useCallback(
    () => useGlobalLocationStore.getState().getLocationParams(),
    []
  );

  // ✅ همگام‌سازی علاقه‌مندی‌ها هنگام ورود کاربر
  useEffect(() => {
    if (!authHydrated || !isAuthenticated) return;
    fetchFavorites();
  }, [authHydrated, isAuthenticated, fetchFavorites]);

  const fetchPortfolios = useCallback(
    async (pageNum = 1, append = false) => {
      const requestId = ++requestIdRef.current;

      if (pageNum === 1) {
        // ✅ درخواست صفحه اول همیشه load-more قبلی را cancel/ignore می‌کند
        loadMoreLockRef.current = false;
        setLoadMoreError(false);
        setIsLoadingMore(false);
        setIsLoading(true);
      } else {
        // ✅ از ارسال موازی چند صفحه بعدی جلوگیری می‌کند
        if (loadMoreLockRef.current) return;
        loadMoreLockRef.current = true;
        setIsLoadingMore(true);
      }

      try {
        const params = {
          page: pageNum,
          page_size: PAGE_SIZE,
        };

        if (filters.mainCategory !== 'all') {
          params.category_id = filters.mainCategory;
        }

        // ✅ فیلتر زیردسته حالا سمت بک‌اند اعمال می‌شود
        // این کار باعث می‌شود lazy loading با فیلتر زیردسته نشکند
        if (filters.subCategory && filters.subCategory !== 'all') {
          params.sub_service_id = filters.subCategory;
        }

        const locationParams = getLocationParams();
        Object.assign(params, locationParams);

        const result = await exploreService.getPortfolios(params);

        // ✅ اگر این response مربوط به درخواست قدیمی باشد، state را تغییر نده
        if (requestId !== requestIdRef.current) return;

        const rawItems = Array.isArray(result?.data) ? result.data : [];

        const mappedData = rawItems.map((portfolio) => ({
          id: portfolio.id,
          type: 'portfolio',
          caption: portfolio.title || 'نمونه‌کار',
          description: portfolio.description || '',
          images: Array.isArray(portfolio.images)
            ? portfolio.images.map(
                (img) => img?.imageUrl || img?.image_url || img?.image || img
              )
            : [],
          businessId: portfolio.business ?? portfolio.businessId,
          businessName:
            portfolio.businessName ||
            portfolio.business_name ||
            portfolio.business?.name ||
            '',
          businessLogo:
            portfolio.businessLogo ||
            portfolio.business_logo ||
            portfolio.business?.logo ||
            null,
          businessOwnerPhoto:
            portfolio.businessOwnerPhoto ||
            portfolio.business_owner_photo ||
            null,
          businessBookingSlug:
            portfolio.businessBookingSlug ||
            portfolio.business_booking_slug ||
            '',
          mainCategory: portfolio.category ?? portfolio.categoryId ?? null,
          mainCategoryName:
            portfolio.categoryName ||
            portfolio.category_name ||
            portfolio.category?.name ||
            '',
          subCategory: portfolio.subService ?? portfolio.sub_service ?? null,
          subCategoryName:
            portfolio.subServiceName ||
            portfolio.sub_service_name ||
            portfolio.sub_service?.name ||
            '',
          source: 'business',
          createdAt: portfolio.createdAt || portfolio.created_at || '',
        }));

        const shuffled = shuffleArray(mappedData);

        if (append) {
          // ✅ FIX: جلوگیری از duplicate و محدود کردن اندازه آرایه
          setAllPosts((prev) => {
            const seen = new Set(prev.map((post) => post.id));
            const newPosts = shuffled.filter((post) => !seen.has(post.id));
            const combined = [...prev, ...newPosts];
            
            // ✅ FIX: محدود کردن اندازه آرایه برای جلوگیری از memory leak
            if (combined.length > MAX_POSTS_SIZE) {
              return combined.slice(combined.length - MAX_POSTS_SIZE);
            }
            return combined;
          });
        } else {
          setAllPosts(shuffled);
        }

        const pagination = result?.meta || result?.pagination || {};
        const total = Number(pagination.count) || 0;

        const hasNext =
          pagination.hasNext !== undefined
            ? Boolean(pagination.hasNext)
            : pageNum * PAGE_SIZE < total;

        // ✅ اگر صفحه بعدی خالی برگشت، دیگر hasMore را true نگه ندار
        if (append && mappedData.length === 0) {
          setHasMore(false);
        } else {
          setHasMore(hasNext);
        }

        setPage(pageNum);
      } catch (error) {
        // ✅ response خطای درخواست قدیمی را هم ignore کن
        if (requestId !== requestIdRef.current) return;

        console.error('Failed to fetch portfolios:', error);

        if (append) {
          // ✅ به‌جای retry بی‌پایان، خطای load-more را نگه دار
          setLoadMoreError(true);
        } else {
          setAllPosts([]);
          setHasMore(false);
        }
      } finally {
        // ✅ فقط درخواست فعلی وضعیت loading را پاک کند
        if (requestId === requestIdRef.current) {
          setIsLoading(false);
          setIsLoadingMore(false);

          if (pageNum !== 1) {
            loadMoreLockRef.current = false;
          }
        }
      }
    },
    [
      filters.mainCategory,
      filters.subCategory,
      locationState.provinceId,
      locationState.cityId,
      locationState.latitude,
      locationState.longitude,
      locationState.gpsEnabled,
      locationState.locationType,
      getLocationParams,
    ]
  );

  useEffect(() => {
    setAllPosts([]);
    setPage(1);
    setHasMore(true);
    setLoadMoreError(false);
    fetchPortfolios(1, false);
  }, [fetchPortfolios]);

  const handleLoadMore = useCallback(() => {
    if (!hasMore || isLoadingMore || loadMoreError || loadMoreLockRef.current) {
      return;
    }

    fetchPortfolios(page + 1, true);
  }, [page, hasMore, isLoadingMore, loadMoreError, fetchPortfolios]);

  const handleRetryLoadMore = useCallback(() => {
    if (loadMoreLockRef.current) return;

    setLoadMoreError(false);
    fetchPortfolios(page + 1, true);
  }, [page, fetchPortfolios]);

  const handlePostPress = useCallback((post) => setActivePost(post), []);
  const handlePostClose = useCallback(() => setActivePost(null), []);
  const handleFilterOpen = useCallback(() => setFilterVisible(true), []);
  const handleFilterClose = useCallback(() => setFilterVisible(false), []);
  const handleFilterChange = useCallback((newFilters) => setFilters(newFilters), []);
  const handleClearFilters = useCallback(
    () => setFilters({ mainCategory: 'all', subCategory: 'all', source: 'all' }),
    []
  );

  const handleNavigateToBusiness = useCallback(
    (data) => {
      const slug =
        data?.businessBookingSlug ||
        data?.business_booking_slug ||
        data?.businessId ||
        data?.business_id ||
        data;

      if (slug) {
        router.push(`/business?slug=${slug}`);
      }
    },
    [router]
  );

  return (
    <ScreenWrapper scrollable={false} padding={0} hasBottomTab={true}>
      <div
        className="px-5 pt-3.5 border-b"
        style={{
          borderBottomColor: colors.border,
          backgroundColor: colors.background,
        }}
      >
        <SectionHeader
          icon={<span className="text-lg">🖼️</span>}
          title="ویترین"
          subtitle="نمونه‌کار کسب‌وکارها"
          centered
          rightElement={
            <button
              onClick={handleFilterOpen}
              className="w-10 h-10 rounded-xl border flex items-center justify-center"
              style={{
                backgroundColor: colors.cardBackground,
                borderColor: colors.border,
              }}
            >
              <FiFilter size={18} style={{ color: colors.textMain }} />
            </button>
          }
        />
      </div>

      <ActiveFilterChips filters={filters} onChange={handleFilterChange} />

      <div className="flex-1 overflow-y-auto px-2 pt-2">
        <PostGrid
          posts={allPosts}
          onPostPress={handlePostPress}
          onClearFilters={handleClearFilters}
          onLoadMore={handleLoadMore}
          onRetryLoadMore={handleRetryLoadMore}
          isLoading={isLoading}
          isLoadingMore={isLoadingMore}
          loadMoreError={loadMoreError}
          hasMore={hasMore}
          totalLoaded={allPosts.length}
        />
      </div>

      <BottomTabBar showSpacer={false} />

      <FilterModal
        visible={filterVisible}
        onClose={handleFilterClose}
        onApply={handleFilterChange}
        currentFilters={filters}
      />

      <PostModal
        post={activePost}
        visible={!!activePost}
        onClose={handlePostClose}
        onNavigateToProfile={() => handleNavigateToBusiness(activePost)}
        onBooking={() => handleNavigateToBusiness(activePost)}
      />
    </ScreenWrapper>
  );
}