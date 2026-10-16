// src/components/explore/PostGrid.jsx
'use client';

import { useEffect, useRef } from 'react';
import { FiCheckCircle, FiRefreshCw } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import PostThumbnail from './PostThumbnail';
import EmptyState from '@/components/common/EmptyState';
import LoadingSpinner from '@/components/common/LoadingSpinner';

export default function PostGrid({
  posts,
  onPostPress,
  onClearFilters,
  onLoadMore,
  onRetryLoadMore,
  isLoadingMore = false,
  isLoading = false,
  loadMoreError = false,
  hasMore = true,
  totalLoaded = 0,
}) {
  const { colors } = useTheme();
  const sentinelRef = useRef(null);
  const isLoadingRef = useRef(false);

  const hasPosts = Array.isArray(posts) && posts.length > 0;

  useEffect(() => {
    if (!onLoadMore || !hasMore || isLoadingMore || loadMoreError) return;

    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoadingRef.current) {
          isLoadingRef.current = true;
          onLoadMore();
          observer.unobserve(sentinel);
        }
      },
      {
        rootMargin: '300px',
        threshold: 0,
      }
    );

    observer.observe(sentinel);

    return () => observer.disconnect();
  }, [onLoadMore, hasMore, isLoadingMore, loadMoreError]);

  useEffect(() => {
    if (!isLoadingMore) {
      isLoadingRef.current = false;
    }
  }, [isLoadingMore]);

  if (isLoading && !hasPosts) {
    return (
      <div className="flex items-center justify-center py-16">
        <LoadingSpinner />
      </div>
    );
  }

  if (!hasPosts && !hasMore && !loadMoreError) {
    return (
      <EmptyState
        icon="🖼️"
        title="نتیجه‌ای یافت نشد"
        description="فیلترهای خود را تغییر دهید"
      />
    );
  }

  return (
    <div className="pb-24">
      {hasPosts && (
        <div className="grid grid-cols-3 gap-1">
          {posts.map((post, index) => (
            <PostThumbnail
              key={post.id ?? index}
              post={post}
              onPress={onPostPress}
              index={index}
            />
          ))}
        </div>
      )}

      {hasMore && !loadMoreError && <div ref={sentinelRef} className="h-1" />}

      {isLoadingMore && (
        <div className="flex items-center justify-center gap-3 py-6">
          <LoadingSpinner size="sm" />
          <span
            className="text-sm"
            style={{
              color: colors.textSecondary,
              fontFamily: 'Vazir-Medium',
            }}
          >
            در حال بارگذاری پست‌های بیشتر...
          </span>
        </div>
      )}

      {loadMoreError && (
        <div className="flex flex-col items-center justify-center gap-3 py-6">
          <span
            className="text-sm"
            style={{
              color: colors.textSecondary,
              fontFamily: 'Vazir-Medium',
            }}
          >
            بارگذاری پست‌های بیشتر با خطا مواجه شد
          </span>

          {onRetryLoadMore && (
            <button
              type="button"
              onClick={onRetryLoadMore}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border text-xs font-[Vazir-Medium]"
              style={{
                backgroundColor: colors.cardBackground,
                borderColor: colors.border,
                color: colors.primary,
              }}
            >
              <FiRefreshCw size={14} />
              تلاش مجدد
            </button>
          )}
        </div>
      )}

      {!hasMore && !isLoadingMore && !loadMoreError && hasPosts && (
        <div className="flex items-center justify-center gap-3 py-8 px-6">
          <div className="flex-1 h-px" style={{ backgroundColor: colors.border }} />

          <div
            className="flex items-center gap-2 px-4 py-2 rounded-xl border"
            style={{
              backgroundColor: colors.cardBackground,
              borderColor: colors.border,
            }}
          >
            <FiCheckCircle size={14} style={{ color: colors.primary }} />
            <span
              className="text-xs"
              style={{
                color: colors.textSecondary,
                fontFamily: 'Vazir-Medium',
              }}
            >
              همه {totalLoaded} پست نمایش داده شد
            </span>
          </div>

          <div className="flex-1 h-px" style={{ backgroundColor: colors.border }} />
        </div>
      )}
    </div>
  );
}