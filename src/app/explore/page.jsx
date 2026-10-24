// src/app/explore/page.jsx
'use client';

import { useState, useEffect, useCallback, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
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
import { useToast } from '@/hooks/useToast';
import { sharePortfolio } from '@/utils/share';

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

/**
 * استخراج URL تصاویر از response بک‌اند
 */
const extractImages = (images) => {
  if (!Array.isArray(images)) return [];

  return images
    .map((img) => {
      if (!img) return null;
      if (typeof img === 'string') return img;
      return img.imageUrl || img.image_url || img.image || img.url || null;
    })
    .filter(Boolean);
};

/**
 * Map کردن response جزئیات Portfolio به shape مورد انتظار PostModal
 */
const mapPortfolioToPost = (portfolio) => {
  const images = extractImages(portfolio.images);

  return {
    id: portfolio.id,
    type: 'portfolio',
    caption: portfolio.title || 'نمونه‌کار',
    description: portfolio.description || '',
    images,
    coverImage:
      portfolio.coverImageUrl ||
      portfolio.cover_image_url ||
      images[0] ||
      null,
    businessId: portfolio.business ?? portfolio.businessId ?? null,
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
  };
};

function ExplorePageContent() {
  const { colors } = useTheme();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showToast } = useToast();

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

  // ✅ برای جلوگیری از fetch تکراری لینک عمیق
  const processedDeepLinkIdRef = useRef(null);

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
          images: extractImages(portfolio.images),
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

  /**
   * 🔗 پشتیبانی از لینک عمیق اکسپلور
   *
   * نمونه:
   * /explore?post=123
   * /explore?portfolio=123
   */
  const deepLinkId = searchParams.get('portfolio') || searchParams.get('post');

  useEffect(() => {
    if (!deepLinkId) {
      processedDeepLinkIdRef.current = null;
      return;
    }

    const id = String(deepLinkId);

    // اگر همین id قبلاً پردازش شده، دوباره fetch نکن
    if (processedDeepLinkIdRef.current === id) {
      return;
    }

    // فقط id عددی معتبر
    if (!/^\d+$/.test(id)) {
      processedDeepLinkIdRef.current = id;
      router.replace('/explore', { scroll: false });
      return;
    }

    processedDeepLinkIdRef.current = id;

    let cancelled = false;

    (async () => {
      try {
        const result = await exploreService.getPortfolioDetail(id);

        if (cancelled) return;

        const portfolio = result?.data;

        if (!portfolio?.id) {
          throw new Error('NOT_FOUND');
        }

        setActivePost(mapPortfolioToPost(portfolio));
      } catch (error) {
        if (cancelled) return;

        console.warn('Deep link portfolio failed:', error);

        setActivePost(null);
        showToast('پست مورد نظر یافت نشد یا در دسترس نیست.', 'error');

        // پاک کردن پارامتر از URL تا صفحه به حالت عادی برگردد
        processedDeepLinkIdRef.current = null;
        router.replace('/explore', { scroll: false });
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [deepLinkId, router, showToast]);

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

  /**
   * ✅ باز کردن modal از روی کارت
   *
   * علاوه بر ست کردن activePost، URL را هم sync می‌کند تا:
   * - آدرس بار قابل share باشد
   * - با refresh همان modal باز بماند
   */
  const handlePostPress = useCallback(
    (post) => {
      if (!post?.id) return;

      processedDeepLinkIdRef.current = String(post.id);
      setActivePost(post);

      router.replace(`/explore?post=${encodeURIComponent(post.id)}`, {
        scroll: false,
      });
    },
    [router]
  );

  const handlePostClose = useCallback(() => {
    setActivePost(null);
    processedDeepLinkIdRef.current = null;

    router.replace('/explore', { scroll: false });
  }, [router]);

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

  /**
   * ✅ Handler اشتراک‌گذاری از اکسپلور
   */
  const handleShare = useCallback(
    async (postToShare) => {
      const target = postToShare || activePost;
      if (!target?.id) return;

      const result = await sharePortfolio(target.id, {
        title: target.caption || 'پست بیو کلاب',
      });

      if (result === 'copied') {
        showToast('لینک پست کپی شد', 'success');
      } else if (result === 'failed') {
        showToast('امکان اشتراک‌گذاری وجود ندارد', 'error');
      }
    },
    [activePost, showToast]
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
        onShare={handleShare}
      />
    </ScreenWrapper>
  );
}

export default function ExplorePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <ExplorePageContent />
    </Suspense>
  );
}