// src/components/explore/PostGrid.jsx
'use client';
import { useEffect, useRef } from 'react';
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
  isLoading = false, // ✅ اضافه شد برای لود اولیه
  hasMore = true,
  totalLoaded = 0,
}) {
  const { colors } = useTheme();
  const sentinelRef = useRef(null);

  // ✅ FIX (فاز ۴): guard برای جلوگیری از load همزمان
  const isLoadingRef = useRef(false);

  useEffect(() => {
    if (!onLoadMore || !hasMore || isLoadingMore) return;
    if (!sentinelRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoadingRef.current) {
          isLoadingRef.current = true;
          onLoadMore();
        }
      },
      { rootMargin: '300px', threshold: 0 }
    );
    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [onLoadMore, hasMore, isLoadingMore]);

  // ✅ FIX (فاز ۴): reset guard وقتی loading تمام شد
  useEffect(() => {
    if (!isLoadingMore) {
      isLoadingRef.current = false;
    }
  }, [isLoadingMore]);

  // ✅ حالت لود اولیه
  if (isLoading && (!posts || posts.length === 0)) {
    return (
      <div className="flex items-center justify-center py-16">
        <LoadingSpinner />
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
        // actionLabel={onClearFilters ? 'حذف فیلترها' : null}
        // onAction={onClearFilters}
      />
    );
  }

  return (
    <div className="pb-24">
      {/* Grid سه‌ستونه */}
      <div className="grid grid-cols-3 gap-1">
        {posts.map((post) => (
          <PostThumbnail key={post.id} post={post} onPress={onPostPress} />
        ))}
      </div>

      {/* Sentinel نامرئی برای trigger لود بعدی */}
      {hasMore && <div ref={sentinelRef} className="h-1" />}

      {/* اسپینر لود صفحه بعدی */}
      {isLoadingMore && (
        <div className="flex items-center justify-center gap-3 py-6">
          <LoadingSpinner size="sm" />
          <span
            className="text-sm"
            style={{ color: colors.textSecondary, fontFamily: 'Vazir-Medium' }}
          >
            در حال بارگذاری پست‌های بیشتر...
          </span>
        </div>
      )}

      {/* پیام پایان لیست */}
      {!hasMore && !isLoadingMore && posts.length > 0 && (
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
