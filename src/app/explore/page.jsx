// src/app/explore/page.jsx
'use client';
import { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { FiFilter } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import { useAuth } from '@/stores/useAuthStore';
import ScreenWrapper from '@/components/common/ScreenWrapper';
import SectionHeader from '@/components/common/SectionHeader';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import EmptyState from '@/components/common/EmptyState';
import { PostGrid, ActiveFilterChips, FilterModal, PostModal } from '@/components/explore';

// ✅ FIX: خواندن از پورتفولیو نه اکسپلور
import { exploreService } from '@/api';
import { useFavoriteStore } from '@/stores/useFavoriteStore';

const PAGE_SIZE = 21; // ۲۱ آیتم = ۳ ستون × ۷ ردیف

// ✅ تابع شافل (Fisher-Yates)
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

  // ─── Ref برای جلوگیری از لود همزمان ───
  const isFetchingRef = useRef(false);

  /**
   * ✅ FIX: دریافت داده از /portfolios/ (نمونه‌کارها)
   * و نگاشت به فرمت مورد انتظار کامپوننت‌های ویترین
   */
  const fetchPortfolios = useCallback(async (pageNum = 1, append = false) => {
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;

    if (pageNum === 1) setIsLoading(true);
    else setIsLoadingMore(true);

    try {
      const params = {
        page: pageNum,
        page_size: PAGE_SIZE,
      };

      // ✅ فیلتر دسته‌بندی
      if (filters.mainCategory && filters.mainCategory !== 'all') {
        params.category_id = filters.mainCategory;
      }

      const result = await exploreService.getPortfolios(params);

      // ✅ نگاشت نمونه‌کار به فرمت ویترین
      // نمونه‌کار: { id, title, description, cover_image, images,
      //               business, business_name, business_logo,
      //               category, category_name, sub_service, ... }
      const mappedData = (result.data || []).map((portfolio) => ({
        // شناسه‌ها
        id: portfolio.id,
        type: 'portfolio',

        // محتوای نمونه‌کار
        caption: portfolio.title || 'نمونه‌کار',
        description: portfolio.description || '',

        // تصاویر — کاور + تصاویر گالری
        coverImage: portfolio.coverImageUrl || portfolio.cover_image_url || null,
        images: (portfolio.images || []).map(
          (img) => img.image_url || img.imageUrl || img.image || img
        ),

        // اطلاعات کسب‌وکار (برای نمایش در مودال)
        businessId: portfolio.business || portfolio.businessId,
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
        businessBookingSlug:
          portfolio.businessBookingSlug ||
          portfolio.business_booking_slug ||
          '',

        // دسته‌بندی
        mainCategory: portfolio.category || portfolio.categoryId || null,
        mainCategoryName:
          portfolio.categoryName ||
          portfolio.category_name ||
          portfolio.category?.name ||
          '',
        subCategory: portfolio.subService || portfolio.sub_service || null,
        subCategoryName:
          portfolio.subServiceName ||
          portfolio.sub_service_name ||
          portfolio.sub_service?.name ||
          '',

        // منبع — همیشه 'business' چون نمونه‌کار است
        source: 'business',

        // تاریخ ایجاد
        createdAt: portfolio.createdAt || portfolio.created_at || '',
      }));

      // ✅ شافل رندوم
      const shuffled = shuffleArray(mappedData);

      if (append) {
        setAllPosts((prev) => [...prev, ...shuffled]);
      } else {
        setAllPosts(shuffled);
      }

      // Pagination meta
      const pagination = result.meta || result.pagination || {};
      const total = pagination.count || totalCount;
      setTotalCount(total);

      const hasNext =
        pagination.hasNext !== undefined
          ? pagination.hasNext
          : pageNum * PAGE_SIZE < total;
      setHasMore(hasNext);
      setPage(pageNum);
    } catch (error) {
      console.error('Failed to fetch portfolios:', error);
      if (!append) {
        setAllPosts([]);
      }
    } finally {
      isFetchingRef.current = false;
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  }, [filters.mainCategory]);

  // ─── بارگذاری اولیه + تغییر فیلتر ───
  useEffect(() => {
    setAllPosts([]);
    setPage(1);
    fetchPortfolios(1, false);
  }, [fetchPortfolios]);

  // ─── فیلتر محلی (زیردسته) ───
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

  // ─── لود صفحه بعد ───
  const handleLoadMore = useCallback(() => {
    if (!isLoadingMore && hasMore) {
      fetchPortfolios(page + 1, true);
    }
  }, [page, isLoadingMore, hasMore, fetchPortfolios]);

  // ─── هندلرها ───
  const handlePostPress = useCallback((post) => setActivePost(post), []);
  const handlePostClose = useCallback(() => setActivePost(null), []);
  const handleFilterOpen = useCallback(() => setFilterVisible(true), []);
  const handleFilterClose = useCallback(() => setFilterVisible(false), []);

  const handleFilterChange = useCallback((newFilters) => {
    setFilters(newFilters);
  }, []);

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
      if (slug) {
        router.push(`/business?slug=${slug}`);
      }
    },
    [router]
  );

  return (
    <ScreenWrapper scrollable={false} padding={0}>
      {/* هدر */}
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

      {/* چیپ‌های فیلتر */}
      <ActiveFilterChips filters={filters} onChange={handleFilterChange} />

      {/* گرید نمونه‌کارها */}
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

      {/* مودال فیلتر */}
      <FilterModal
        visible={filterVisible}
        onClose={handleFilterClose}
        onApply={handleFilterChange}
        currentFilters={filters}
      />

      {/* مودال جزئیات نمونه‌کار */}
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