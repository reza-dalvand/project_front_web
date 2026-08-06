'use client';
import { useState, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation'; // ✅ ۱. ایمپورت useRouter
import { FiSliders, FiGrid } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import ScreenWrapper from '@/components/common/ScreenWrapper';
import SectionHeader from '@/components/common/SectionHeader';
import { FilterModal, PostModal, PostGrid, ActiveFilterChips } from '@/components/explore';
import { MOCK_POSTS } from '@/constants/exploreFilters';

const INITIAL_FILTERS = {
  province: null,
  city: null,
  businessType: null,
  mainCategory: 'all',
  subCategory: 'all',
  source: 'all',
};

// تنظیمات لیزی لودینگ
const PAGE_SIZE = 12;
const MAX_PAGES = 10;

// ✅ ۲. تولید پست‌های بیشتر (این تابع باید کاملاً Pure باشد و هیچ هوکی داخل آن استفاده نشود)
const generateMorePosts = (page, size) => {
  if (page > MAX_PAGES) return [];
  const samplePosts = MOCK_POSTS.filter((p) => p.source === 'business');
  const newPosts = [];
  for (let i = 0; i < size; i++) {
    const sample = samplePosts[Math.floor(Math.random() * samplePosts.length)];
    const randomId = Math.random().toString(36).substring(7);
    const randomImageId = Math.floor(Math.random() * 1000) + page * 100;
    newPosts.push({
      ...sample,
      id: `p_${page}_${i}_${randomId}`,
      businessLogo: `https://picsum.photos/100/100?random=${randomImageId}`,
      gallery: sample.gallery?.map(
        (_, idx) => `https://picsum.photos/800/800?random=${randomImageId + idx}`
      ) || [`https://picsum.photos/800/800?random=${randomImageId}`],
      saved: false,
    });
  }
  return newPosts;
};

export default function ExplorePage() {
  const router = useRouter(); // ✅ ۳. مقداردهی هوک useRouter در بدنه اصلی کامپوننت
  const { colors } = useTheme();

  // State های لیزی لودینگ
  const [allPosts, setAllPosts] = useState(MOCK_POSTS.slice(0, PAGE_SIZE));
  const [page, setPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // State های مدال‌ها
  const [activePost, setActivePost] = useState(null);
  const [filterVisible, setFilterVisible] = useState(false);
  const [filters, setFilters] = useState(INITIAL_FILTERS);

  // فیلتر پست‌ها
  const filteredPosts = useMemo(() => {
    return allPosts.filter((post) => {
      if (filters.province && post.provinceId !== filters.province) return false;
      if (filters.city && post.cityId !== filters.city) return false;
      if (filters.businessType && post.businessTypeId !== filters.businessType) return false;
      if (filters.source !== 'all') {
        if (filters.source === 'business' && post.source === 'magazine') return false;
        if (filters.source === 'magazine' && post.source !== 'magazine') return false;
      }
      if (filters.mainCategory !== 'all') {
        if (post.mainCategory && post.mainCategory !== filters.mainCategory) return false;
      }
      if (filters.subCategory !== 'all' && filters.mainCategory !== 'all') {
        if (post.subCategory && post.subCategory !== filters.subCategory) return false;
      }
      return true;
    });
  }, [allPosts, filters]);

  const hasActiveFilter =
    filters.province ||
    filters.city ||
    filters.businessType ||
    filters.mainCategory !== 'all' ||
    filters.subCategory !== 'all' ||
    filters.source !== 'all';

  // لود پست‌های بیشتر
  const loadMorePosts = useCallback(async () => {
    if (isLoadingMore || !hasMore) return;
    setIsLoadingMore(true);
    await new Promise((r) => setTimeout(r, 800 + Math.random() * 700));
    const nextPage = page + 1;
    const newPosts = generateMorePosts(nextPage, PAGE_SIZE);
    if (newPosts.length === 0 || nextPage >= MAX_PAGES) {
      setHasMore(false);
    }
    if (newPosts.length > 0) {
      setAllPosts((prev) => [...prev, ...newPosts]);
      setPage(nextPage);
    }
    setIsLoadingMore(false);
  }, [isLoadingMore, hasMore, page]);

  // Save/Unsave
  const handleSave = (postId) => {
    setAllPosts((prev) => prev.map((p) => (p.id === postId ? { ...p, saved: !p.saved } : p)));
    if (activePost?.id === postId) {
      setActivePost((prev) => ({ ...prev, saved: !prev.saved }));
    }
  };

  // ✅ ۴. رفع خطای router is not defined
  const handleNavigateToProfile = (businessId) => {
    if (businessId && businessId !== 'magazine') {
      router.push(`/business/${businessId}`);
    }
  };

  const handleClearFilters = () => setFilters(INITIAL_FILTERS);

  return (
    <ScreenWrapper scrollable={false} padding={0}>
      {/* هدر */}
      <div
        className="px-5 py-3.5 border-b"
        style={{
          backgroundColor: colors.background,
          borderBottomColor: colors.border,
        }}
      >
        <SectionHeader
          icon={<FiGrid size={18} />}
          iconColor={colors.primary}
          title="ویترین"
          subtitle="نمونه‌کار کسب‌وکارها در زیبانو"
          rightElement={
            <button
              onClick={() => setFilterVisible(true)}
              className="w-10 h-10 rounded-xl border flex items-center justify-center
                relative transition-colors hover:opacity-80"
              style={{
                backgroundColor: hasActiveFilter ? colors.primary + '15' : colors.cardBackground,
                borderColor: hasActiveFilter ? colors.primary : colors.border,
              }}
            >
              <FiSliders
                size={18}
                style={{
                  color: hasActiveFilter ? colors.primary : colors.textMain,
                }}
              />
              {hasActiveFilter && (
                <div
                  className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full border"
                  style={{
                    backgroundColor: colors.primary,
                    borderColor: colors.cardBackground,
                  }}
                />
              )}
            </button>
          }
        />
      </div>

      {/* چیپ‌های فیلتر فعال */}
      <ActiveFilterChips filters={filters} onChange={setFilters} />

      {/* Grid پست‌ها */}
      <div className="flex-1 overflow-y-auto px-2 pt-2">
        <PostGrid
          posts={filteredPosts}
          onPostPress={setActivePost}
          onClearFilters={hasActiveFilter ? handleClearFilters : null}
          onLoadMore={loadMorePosts}
          isLoadingMore={isLoadingMore}
          hasMore={hasMore}
          totalLoaded={allPosts.length}
        />
      </div>

      {/* مدال فیلتر */}
      <FilterModal
        visible={filterVisible}
        onClose={() => setFilterVisible(false)}
        onApply={setFilters}
        currentFilters={filters}
      />

      {/* مدال پست */}
      <PostModal
        post={activePost}
        visible={!!activePost}
        onClose={() => setActivePost(null)}
        onSave={handleSave}
        onNavigateToProfile={handleNavigateToProfile}
      />
    </ScreenWrapper>
  );
}
