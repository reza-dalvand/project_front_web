// src/app/explore/page.jsx
'use client';
import { useState, useMemo, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { FiFilter } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import { useAuth } from '@/stores/useAuthStore';
import ScreenWrapper from '@/components/common/ScreenWrapper';
import SectionHeader from '@/components/common/SectionHeader';
import { PostGrid, ActiveFilterChips, FilterModal, PostModal } from '@/components/explore';
import { exploreService } from '@/api';
import { USE_MOCK } from '@/api/config';
import { MOCK_POSTS } from '@/data/posts';
import { useFavoriteStore } from '@/stores/useFavoriteStore';
import {
  PROVINCES,
  CITIES,
  BUSINESS_TYPES,
  MAIN_CATEGORIES,
  SUB_CATEGORIES,
  SOURCE_FILTERS,
} from '@/constants/exploreFilters';

const INITIAL_FILTERS = {
  province: null,
  city: null,
  businessType: null,
  mainCategory: 'all',
  subCategory: 'all',
  source: 'all',
};

export default function ExplorePage() {
  const { colors } = useTheme();
  const router = useRouter();
  const { isAuthenticated, requireAuth } = useAuth();
  const togglePostFavorite = useFavoriteStore((s) => s.togglePostFavorite);
  const [allPosts, setAllPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activePost, setActivePost] = useState(null);
  const [filterVisible, setFilterVisible] = useState(false);
  const [filters, setFilters] = useState(INITIAL_FILTERS);

  // ─── دریافت پست‌ها از API ───
  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      try {
        if (USE_MOCK) {
          setAllPosts(MOCK_POSTS);
        } else {
          const result = await exploreService.getPosts();
          setAllPosts(result.data || []);
        }
      } catch (error) {
        console.error('Failed to fetch posts:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPosts();
  }, []);

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

  // ─── Toggle علاقه‌مندی ───
  const handleSave = useCallback(
    async (postId) => {
      if (!isAuthenticated) {
        requireAuth(() => {});
        return;
      }
      const post = allPosts.find((p) => p.id === postId);
      try {
        await togglePostFavorite(postId, post);
      } catch (error) {
        console.error('Toggle favorite failed:', error);
      }
    },
    [isAuthenticated, requireAuth, togglePostFavorite, allPosts]
  );

  const handlePostPress = useCallback((post) => setActivePost(post), []);
  const handlePostClose = useCallback(() => setActivePost(null), []);
  const handleFilterOpen = useCallback(() => setFilterVisible(true), []);
  const handleFilterClose = useCallback(() => setFilterVisible(false), []);
  const handleFilterChange = useCallback((newFilters) => setFilters(newFilters), []);
  const handleClearFilters = useCallback(() => setFilters(INITIAL_FILTERS), []);

  // ═══════ هندلر ناوبری به صفحه کسب‌وکار ═══════
  const handleNavigateToBusiness = useCallback(
    (businessId) => {
      if (businessId) {
        router.push(`/business/${businessId}`);
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

      {/* چیپ‌های فیلتر فعال */}
      <ActiveFilterChips filters={filters} onChange={handleFilterChange} />

      {/* Grid پست‌ها */}
      <div className="flex-1 overflow-y-auto px-2 pt-2">
        <PostGrid
          posts={filteredPosts}
          onPostPress={handlePostPress}
          onClearFilters={handleClearFilters}
          isLoading={isLoading}
        />
      </div>

      {/* مدال فیلتر */}
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
        onSave={handleSave}
        onNavigateToProfile={handleNavigateToBusiness}
      />
    </ScreenWrapper>
  );
}
