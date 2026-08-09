'use client';
import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { FiStar, FiMessageSquare, FiThumbsUp, FiFilter, FiUser } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import ScreenWrapper from '@/components/common/ScreenWrapper';
import Header from '@/components/common/Header';
import Card from '@/components/common/Card';
import Avatar from '@/components/common/Avatar';
import StarRating from '@/components/common/StarRating';
import StatsCard from '@/components/common/StatsCard';
import EmptyState from '@/components/common/EmptyState';
import { toPersianDigit } from '@/utils/numberUtils';
import { MOCK_REVIEWS } from '@/data/reviews';


const FILTER_OPTIONS = [
  { id: 'all', label: 'همه' },
  { id: '5', label: '۵ ستاره' },
  { id: '4', label: '۴ ستاره' },
  { id: '3', label: '۳ ستاره' },
  { id: '2', label: '۲ ستاره' },
  { id: '1', label: '۱ ستاره' },
];

export default function ReviewsPage() {
  const router = useRouter();
  const { colors } = useTheme();
  const { isAuthenticated } = useRequireAuth({ redirectToLogin: true });
  const [activeFilter, setActiveFilter] = useState('all');

  const reviews = MOCK_REVIEWS;

  // آمار کلی
  const stats = useMemo(() => {
    const total = reviews.length;
    const avg = total > 0 ? reviews.reduce((s, r) => s + r.rating, 0) / total : 0;
    const dist = [5, 4, 3, 2, 1].map((star) => ({
      star,
      count: reviews.filter((r) => Math.round(r.rating) === star).length,
    }));
    return { total, avg, dist };
  }, [reviews]);

  // فیلتر نظرات
  const filteredReviews = useMemo(() => {
    if (activeFilter === 'all') return reviews;
    return reviews.filter((r) => Math.round(r.rating) === parseInt(activeFilter));
  }, [reviews, activeFilter]);

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
      <Header title="نظرات و امتیازات" onBackPress={() => router.back()} />

      <div className="flex-1 overflow-y-auto p-5 pb-32 space-y-6">
        {/* ═══════ کارت خلاصه امتیاز ═══════ */}
        <Card variant="elevated" padding={20} radius={20}>
          <div className="flex items-center gap-6">
            {/* امتیاز کلی */}
            <div className="flex flex-col items-center gap-2 min-w-[100px]">
              <span className="text-5xl font-[Vazir-Bold]" style={{ color: colors.textMain }}>
                {toPersianDigit(stats.avg.toFixed(1))}
              </span>
              <StarRating value={stats.avg} size="md" />
              <span className="text-xs font-[Vazir]" style={{ color: colors.textSecondary }}>
                {toPersianDigit(stats.total)} نظر
              </span>
            </div>

            {/* نوارهای توزیع */}
            <div className="flex-1 space-y-1.5">
              {stats.dist.map((item) => {
                const percentage = stats.total > 0 ? (item.count / stats.total) * 100 : 0;
                return (
                  <div key={item.star} className="flex items-center gap-2">
                    <span
                      className="text-xs font-[Vazir-Bold] w-4 text-right"
                      style={{ color: colors.textMain }}
                    >
                      {toPersianDigit(item.star)}
                    </span>
                    <FiStar size={12} color="#FFC107" fill="#FFC107" />
                    <div
                      className="flex-1 h-2 rounded-full overflow-hidden"
                      style={{ backgroundColor: colors.border }}
                    >
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${percentage}%`,
                          backgroundColor: '#FFC107',
                        }}
                      />
                    </div>
                    <span
                      className="text-xs font-[Vazir] w-6"
                      style={{ color: colors.textSecondary }}
                    >
                      {toPersianDigit(item.count)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </Card>

        {/* ═══════ فیلتر امتیاز ═══════ */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {FILTER_OPTIONS.map((opt) => {
            const isActive = activeFilter === opt.id;
            return (
              <button
                key={opt.id}
                onClick={() => setActiveFilter(opt.id)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full border whitespace-nowrap transition-all"
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

        {/* ═══════ لیست نظرات ═══════ */}
        {filteredReviews.length > 0 ? (
          <div className="space-y-3">
            {filteredReviews.map((review) => (
              <Card key={review.id} variant="elevated" padding={16} radius={18}>
                {/* هدر نظر */}
                <div className="flex items-start gap-3 mb-3">
                  <Avatar uri={review.userAvatar} name={review.userName} size="md" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span
                        className="text-sm font-[Vazir-Bold]"
                        style={{ color: colors.textMain }}
                      >
                        {review.userName}
                      </span>
                      <span
                        className="text-[11px] font-[Vazir]"
                        style={{ color: colors.textSecondary }}
                      >
                        {review.date}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <StarRating value={review.rating} size="sm" />
                      {review.serviceName && (
                        <span
                          className="text-[10px] font-[Vazir] px-2 py-0.5 rounded-md"
                          style={{
                            backgroundColor: colors.primary + '10',
                            color: colors.primary,
                          }}
                        >
                          {review.serviceName}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* متن نظر */}
                <p
                  className="text-sm font-[Vazir] leading-6 text-justify"
                  style={{ color: colors.textSecondary }}
                >
                  {review.comment}
                </p>

                {/* دکمه پاسخ */}
                <div className="mt-3 pt-3 border-t" style={{ borderColor: colors.border }}>
                  <button
                    className="flex items-center gap-1.5 text-xs font-[Vazir-Bold] transition-colors"
                    style={{ color: colors.primary }}
                  >
                    <FiMessageSquare size={14} />
                    <span>پاسخ به نظر</span>
                  </button>
                </div>
              </Card>
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
