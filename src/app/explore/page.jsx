// src/app/explore/page.jsx
'use client';
import { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { FiFilter } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import { useAuth } from '@/stores/useAuthStore';
import ScreenWrapper from '@/components/common/ScreenWrapper';
import SectionHeader from '@/components/common/SectionHeader';
import { PostGrid, ActiveFilterChips, FilterModal, PostModal } from '@/components/explore';
import { useGlobalLocationStore } from '@/stores/useGlobalLocationStore';
import { exploreService } from '@/api';
import { useFavoriteStore } from '@/stores/useFavoriteStore';

const PAGE_SIZE = 21;

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
  const { isAuthenticated, requireAuth } = useAuth();
  const togglePostFavorite = useFavoriteStore((s) => s.togglePostFavorite);

  const [allPosts, setAllPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [activePost, setActivePost] = useState(null);
  const [filterVisible, setFilterVisible] = useState(false);

  const [filters, setFilters] = useState({
    mainCategory: 'all',
    subCategory: 'all',
    source: 'all',
  });

  const isFetchingRef = useRef(false);

  // ✅ هوک‌ها باید دقیقاً اینجا (داخل بدنه کامپوننت) تعریف شوند:
  const getLocationParams = useGlobalLocationStore((s) => s.getLocationParams);
  const globalProvinceId = useGlobalLocationStore((s) => s.provinceId);
  const globalCityId = useGlobalLocationStore((s) => s.cityId);
  const globalLatitude = useGlobalLocationStore((s) => s.latitude);
  const globalLongitude = useGlobalLocationStore((s) => s.longitude);

  const fetchPortfolios = useCallback(
    async (pageNum = 1, append = false) => {
      if (isFetchingRef.current) return;
      isFetchingRef.current = true;

      if (pageNum === 1) setIsLoading(true);
      else setIsLoadingMore(true);

      try {
        const params = {
          page: pageNum,
          page_size: PAGE_SIZE,
        };

        if (filters.mainCategory !== 'all') {
          params.category_id = filters.mainCategory;
        }

        // استفاده از getLocationParams برای دریافت پارامترهای مکان
        const locationParams = getLocationParams();
        Object.assign(params, locationParams);

        const result = await exploreService.getPortfolios(params);

        const mappedData = (result.data || []).map((portfolio) => ({
          id: portfolio.id,
          type: 'portfolio',
          caption: portfolio.title || 'نمونه‌کار',
          description: portfolio.description || '',
          coverImage: portfolio.coverImageUrl || portfolio.cover_image_url || null,
          images: (portfolio.images || []).map(
            (img) => img.image_url || img.imageUrl || img.image || img
          ),
          businessId: portfolio.business || portfolio.businessId,
          businessName:
            portfolio.businessName || portfolio.business_name || portfolio.business?.name || '',
          businessLogo:
            portfolio.businessLogo || portfolio.business_logo || portfolio.business?.logo || null,
          businessOwnerPhoto:
            portfolio.businessOwnerPhoto || portfolio.business_owner_photo || null,
          businessBookingSlug:
            portfolio.businessBookingSlug || portfolio.business_booking_slug || '',
          mainCategory: portfolio.category || portfolio.categoryId || null,
          mainCategoryName:
            portfolio.categoryName || portfolio.category_name || portfolio.category?.name || '',
          subCategory: portfolio.subService || portfolio.sub_service || null,
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
          setAllPosts((prev) => [...prev, ...shuffled]);
        } else {
          setAllPosts(shuffled);
        }

        const pagination = result.meta || result.pagination || {};
        const total = pagination.count || totalCount;
        setTotalCount(total);

        const hasNext =
          pagination.hasNext !== undefined ? pagination.hasNext : pageNum * PAGE_SIZE < total;
        setHasMore(hasNext);
        setPage(pageNum);
      } catch (error) {
        console.error('Failed to fetch portfolios:', error);
        if (!append) setAllPosts([]);
      } finally {
        isFetchingRef.current = false;
        setIsLoading(false);
        setIsLoadingMore(false);
      }
    },
    [
      filters.mainCategory,
      getLocationParams,
      globalProvinceId,
      globalCityId,
      globalLatitude,
      globalLongitude,
    ]
  );

  useEffect(() => {
    setAllPosts([]);
    setPage(1);
    fetchPortfolios(1, false);
  }, [fetchPortfolios]);

  const filteredPosts = useMemo(() => {
    return allPosts.filter((post) => {
      if (filters.subCategory && filters.subCategory !== 'all') {
        if (post.subCategory && post.subCategory !== filters.subCategory) {
          return false;
        }
      }
      return true;
    });
  }, [allPosts, filters.subCategory]);

  const handleLoadMore = useCallback(() => {
    if (!isLoadingMore && hasMore) {
      fetchPortfolios(page + 1, true);
    }
  }, [page, isLoadingMore, hasMore, fetchPortfolios]);

  const handlePostPress = useCallback((post) => setActivePost(post), []);
  const handlePostClose = useCallback(() => setActivePost(null), []);
  const handleFilterOpen = useCallback(() => setFilterVisible(true), []);
  const handleFilterClose = useCallback(() => setFilterVisible(false), []);
  const handleFilterChange = useCallback((newFilters) => setFilters(newFilters), []);
  const handleClearFilters = useCallback(() => {
    setFilters({ mainCategory: 'all', subCategory: 'all', source: 'all' });
  }, []);

  const handleNavigateToBusiness = useCallback(
    (data) => {
      const slug =
        data?.businessBookingSlug ||
        data?.business_booking_slug ||
        data?.businessId ||
        data?.business_id ||
        data;
      if (slug) router.push(`/business?slug=${slug}`);
    },
    [router]
  );

  return (
    <ScreenWrapper scrollable={false} padding={0}>
      <div
        className="px-5 pt-3.5 border-b"
        style={{ borderBottomColor: colors.border, backgroundColor: colors.background }}
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
              style={{ backgroundColor: colors.cardBackground, borderColor: colors.border }}
            >
              <FiFilter size={18} style={{ color: colors.textMain }} />
            </button>
          }
        />
      </div>

      <ActiveFilterChips filters={filters} onChange={handleFilterChange} />

      <div className="flex-1 overflow-y-auto px-2 pt-2">
        <PostGrid
          posts={filteredPosts}
          onPostPress={handlePostPress}
          onClearFilters={handleClearFilters}
          onLoadMore={handleLoadMore}
          isLoading={isLoading}
          isLoadingMore={isLoadingMore}
          hasMore={hasMore}
          totalLoaded={filteredPosts.length}
        />
      </div>

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
