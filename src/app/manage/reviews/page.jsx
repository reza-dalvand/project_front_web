// src/app/manage/reviews/page.jsx
'use client';
import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FiStar, FiMessageSquare, FiFilter } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { useToast } from '@/hooks/useToast';
import ScreenWrapper from '@/components/common/ScreenWrapper';
import Header from '@/components/common/Header';
import Card from '@/components/common/Card';
import EmptyState from '@/components/common/EmptyState';
import ReviewCard from '@/components/customer/ReviewCard';
import { reviewsService } from '@/api';
import { USE_MOCK } from '@/api/config';
import { MOCK_REVIEWS } from '@/data/reviews';
import { toPersianDigit } from '@/utils/numberUtils';

const FILTER_OPTIONS = [
  { id: 'all', label: 'همه' },
  { id: '5', label: '۵ ستاره' },
  { id: '4', label: '۴ ستاره' },
  { id: '3', label: '۳ ستاره' },
  { id: '2', label: '۲ ستاره' },
  { id: '1', label: '۱ ستاره' },
];

export default function ReviewsPage() {
  const { colors } = useTheme();
  const router = useRouter(); // ✅ اضافه شد
  const { isAuthenticated } = useRequireAuth({ redirectToLogin: true });
  const { showToast } = useToast();

  const [activeFilter, setActiveFilter] = useState('all');
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // ─── دریافت نظرات از API ───
  useEffect(() => {
    const fetchReviews = async () => {
      setIsLoading(true);
      try {
        if (USE_MOCK) {
          setReviews(MOCK_REVIEWS);
        } else {
          const result = await reviewsService.getBusinessReviews(1);
          setReviews(result.data?.reviews || []);
        }
      } catch (error) {
        console.error('Failed to fetch reviews:', error);
        showToast('خطا در بارگذاری نظرات', 'error');
      } finally {
        setIsLoading(false);
      }
    };
    fetchReviews();
  }, [showToast]);

  // فیلتر نظرات
  const filteredReviews = useMemo(() => {
    if (activeFilter === 'all') return reviews;
    return reviews.filter((r) => Math.round(r.rating) === parseInt(activeFilter));
  }, [reviews, activeFilter]);

  // آمار
  const stats = useMemo(() => {
    const total = reviews.length;
    const avg = total > 0 ? reviews.reduce((s, r) => s + r.rating, 0) / total : 0;
    return { total, avg };
  }, [reviews]);

  if (!isAuthenticated) {
    return (
      <ScreenWrapper>
        <div className="flex items-center justify-center min-h-screen">
          <p style={{ color: colors.textMain }}>در حال بارگذاری...</p>
        </div>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper padding={0}>
      {/* ✅ اصلاح شد: router.back() به جای router که undefined بود */}
      <Header title="نظرات و امتیازات" onBackPress={() => router.back()} />

      <div className="p-4 pb-32 space-y-4">
        {/* آمار کلی */}
        <Card variant="elevated" padding={16} radius={18}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: '#FFC10720' }}
              >
                <FiStar size={24} color="#FFC107" fill="#FFC107" />
              </div>
              <div>
                <span className="text-2xl font-[Vazir-Bold]" style={{ color: colors.textMain }}>
                  {toPersianDigit(stats.avg.toFixed(1))}
                </span>
                <span className="text-xs block" style={{ color: colors.textSecondary }}>
                  از ۵
                </span>
              </div>
            </div>
            <div className="text-left">
              <span className="text-lg font-[Vazir-Bold]" style={{ color: colors.textMain }}>
                {toPersianDigit(stats.total)}
              </span>
              <span className="text-xs block" style={{ color: colors.textSecondary }}>
                نظر
              </span>
            </div>
          </div>
        </Card>

        {/* فیلتر امتیاز */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {FILTER_OPTIONS.map((opt) => {
            const isActive = activeFilter === opt.id;
            return (
              <button
                key={opt.id}
                onClick={() => setActiveFilter(opt.id)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border-[1.5px] whitespace-nowrap transition-all flex-shrink-0"
                style={{
                  backgroundColor: isActive ? colors.primary : colors.cardBackground,
                  borderColor: isActive ? colors.primary : colors.border,
                }}
              >
                {opt.id !== 'all' && (
                  <FiStar
                    size={12}
                    color={isActive ? '#fff' : '#FFC107'}
                    fill={isActive ? '#fff' : '#FFC107'}
                  />
                )}
                <span
                  className="text-xs font-[Vazir-Bold]"
                  style={{ color: isActive ? '#fff' : colors.textMain }}
                >
                  {opt.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* لیست نظرات */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div
              className="w-8 h-8 border-3 border-current border-t-transparent rounded-full animate-spin"
              style={{ color: colors.primary }}
            />
          </div>
        ) : filteredReviews.length > 0 ? (
          <div className="space-y-3">
            {filteredReviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon="⭐"
            title="نظری یافت نشد"
            description={
              activeFilter === 'all'
                ? 'هنوز هیچ مشتری نظری ثبت نکرده است'
                : `نظری با امتیاز ${activeFilter} ستاره وجود ندارد`
            }
          />
        )}
      </div>
    </ScreenWrapper>
  );
}
