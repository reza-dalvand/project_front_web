'use client';

import { FiMessageSquare } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import Card from '@/components/common/Card';
import Avatar from '@/components/common/Avatar';
import StarRating from '@/components/common/StarRating';

/**
 * کارت نظر مشتری — هماهنگ با ReviewListSerializer بک‌اند
 *
 * فیلدهای بک‌اند:
 *   customer_name, rating, comment, tags, service_name,
 *   reply, replied_at, has_reply, created_at
 */
export default function ReviewCard({ review }) {
  const { colors } = useTheme();

  const rating = (() => {
    const parsed = Number(review?.rating);
    if (!Number.isFinite(parsed)) return 0;
    return Math.max(0, Math.min(5, parsed));
  })();

  const userName = review?.customer_name || review?.userName || 'کاربر';
  const userAvatar = review?.user_avatar || review?.userAvatar || null;
  const date = review?.created_at || review?.date || '';
  const serviceName = review?.service_name || review?.serviceName || '';
  const comment = review?.comment || '';
  const tags = Array.isArray(review?.tags) ? review.tags : [];
  const reply = review?.reply || '';
  const hasReply = review?.has_reply || Boolean(reply);

  return (
    <Card variant="elevated" padding={16} radius={16}>
      {/* هدر: کاربر + امتیاز */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <Avatar uri={userAvatar} name={userName} size="md" />

          <div className="flex flex-col gap-1 min-w-0">
            <span
              className="text-sm font-[Vazir-Bold] truncate"
              style={{ color: colors.textMain }}
            >
              {userName}
            </span>

            <span
              className="text-[11px] font-[Vazir] truncate"
              style={{ color: colors.textSecondary }}
            >
              {date}
            </span>
          </div>
        </div>

        {/* امتیاز */}
        <div className="flex-shrink-0">
          <StarRating value={rating} size="xs" showLabel />
        </div>
      </div>

      {/* Badge خدمت */}
      {serviceName && (
        <div
          className="self-start px-3 py-1.5 rounded-xl mb-3 inline-block"
          style={{ backgroundColor: colors.primary + '10' }}
        >
          <span
            className="text-[11px] font-[Vazir-Bold]"
            style={{ color: colors.primary }}
          >
            {serviceName}
          </span>
        </div>
      )}

      {/* تگ‌ها */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {tags.map((tag, i) => (
            <span
              key={i}
              className="text-[10px] font-[Vazir-Bold] px-2 py-1 rounded-lg"
              style={{
                backgroundColor: colors.primary + '10',
                color: colors.primary,
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* متن نظر */}
      {comment && (
        <p
          className="text-sm font-[Vazir] leading-6 text-justify mb-3"
          style={{ color: colors.textSecondary }}
        >
          {comment}
        </p>
      )}

      {/* پاسخ کسب‌وکار */}
      {hasReply && (
        <div
          className="mt-3 p-3 rounded-xl border"
          style={{
            backgroundColor: colors.primary + '08',
            borderColor: colors.primary + '25',
          }}
        >
          <div className="flex items-center gap-1.5 mb-1">
            <FiMessageSquare size={12} style={{ color: colors.primary }} />

            <span
              className="text-xs font-[Vazir-Bold]"
              style={{ color: colors.primary }}
            >
              پاسخ کسب‌وکار:
            </span>
          </div>

          <p
            className="text-xs font-[Vazir] leading-5"
            style={{ color: colors.textSecondary }}
          >
            {reply}
          </p>
        </div>
      )}
    </Card>
  );
}