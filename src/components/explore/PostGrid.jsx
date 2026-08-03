'use client';

import { useEffect, useRef, useState } from 'react';
import { FiCheckCircle } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import PostThumbnail from './PostThumbnail';
import EmptyState from '@/components/common/EmptyState';
import LoadingSpinner from '@/components/common/LoadingSpinner';

export default function PostGrid({
  posts,
  onPostPress,
  onClearFilters,
  onLoadMore,
  isLoadingMore = false,
  hasMore = true,
  totalLoaded = 0,
}) {
  const { colors } = useTheme();
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const sentinelRef = useRef(null);

  // شبیه‌سازی لود اولیه
  useEffect(() => {
    const timer = setTimeout(() => setIsInitialLoad(false), 300);
    return () => clearTimeout(timer);
  }, []);

  // Intersection Observer برای Lazy Loading
  useEffect(() => {
    if (!onLoadMore || !hasMore || isLoadingMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoadingMore) {
          onLoadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (sentinelRef.current) {
      observer.observe(sentinelRef.current);
    }

    return () => observer.disconnect();
  }, [onLoadMore, hasMore, isLoadingMore]);

  // حالت لود اولیه
  if (isInitialLoad) {
    return (
      <div className="flex items-center justify-center py-20">
        <LoadingSpinner size="lg" label="در حال بارگذاری پست‌ها..." />
      </div>
    );
  }

  // حالت خالی
  if (!posts || posts.length === 0) {
    return (
      <EmptyState
        icon="🖼️"
        title="نتیجه‌ای یافت نشد"
        description="فیلترهای خود را تغییر دهید"
        actionLabel={onClearFilters ? 'حذف فیلترها' : null}
        onAction={onClearFilters}
      />
    );
  }

  return (
    <div className="pb-24">
      {/* Grid سه‌ستونه */}
      <div className="grid grid-cols-3 gap-1">
        {posts.map((post) => (
          <PostThumbnail
            key={post.id}
            post={post}
            onPress={onPostPress}
          />
        ))}
      </div>

      {/* Sentinel برای Lazy Loading */}
      {hasMore && (
        <div ref={sentinelRef} className="h-20 flex items-center justify-center py-8">
          {isLoadingMore && (
            <div className="flex items-center gap-3">
              <LoadingSpinner size="sm" />
              <span
                className="text-sm"
                style={{ color: colors.textSecondary, fontFamily: 'Vazir-Medium' }}
              >
                در حال بارگذاری پست‌های بیشتر...
              </span>
            </div>
          )}
        </div>
      )}

      {/* پیام پایان لیست */}
      {!hasMore && posts.length > 0 && (
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
              style={{ color: colors.textSecondary, fontFamily: 'Vazir-Medium' }}
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