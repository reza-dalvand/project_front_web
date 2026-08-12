// src/components/customer/ReviewCard.jsx
'use client';
import { FiStar } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import Card from '@/components/common/Card';
import Avatar from '@/components/common/Avatar';
import { toPersianDigit } from '@/utils/numberUtils';

/**
 * کامپوننت کارت نظر مشتری
 *
 * @param {object} review - داده نظر
 * @param {string} review.customer_name - نام کاربر
 * @param {string} review.user_avatar - آواتار کاربر
 * @param {number} review.rating - امتیاز (۱ تا ۵)
 * @param {string} review.created_at - تاریخ نظر
 * @param {string} review.service_name - نام خدمت
 * @param {string} review.comment - متن نظر
 * @param {string} review.reply - پاسخ کسب‌وکار
 */
export default function ReviewCard({ review }) {
  const { colors } = useTheme();

  // پشتیبانی از فرمت API بک‌اند و فرمت محلی
  const userName = review.customer_name || review.userName || 'کاربر';
  const userAvatar = review.user_avatar || review.userAvatar || null;
  const rating = review.rating || 0;
  const date = review.created_at || review.date || '';
  const serviceName = review.service_name || review.serviceName || '';
  const comment = review.comment || '';
  const reply = review.reply || '';

  return (
    <Card variant="elevated" padding={16} radius={16}>
      {/* هدر: کاربر + امتیاز */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3 flex-1">
          <Avatar uri={userAvatar} name={userName} size="md" />
          <div className="flex flex-col gap-1">
            <span className="text-sm font-[Vazir-Bold]" style={{ color: colors.textMain }}>
              {userName}
            </span>
            <span className="text-[11px] font-[Vazir]" style={{ color: colors.textSecondary }}>
              {date}
            </span>
          </div>
        </div>
        {/* امتیاز */}
        <div
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl"
          style={{ backgroundColor: '#FFC10720' }}
        >
          <FiStar size={12} color="#FFC107" fill="#FFC107" />
          <span className="text-xs font-[Vazir-Bold]" style={{ color: colors.textMain }}>
            {toPersianDigit(rating.toFixed(1))}
          </span>
        </div>
      </div>

      {/* Badge خدمت */}
      {serviceName && (
        <div
          className="self-start px-3 py-1.5 rounded-xl mb-3"
          style={{ backgroundColor: colors.primary + '15' }}
        >
          <span className="text-[11px] font-[Vazir-Bold]" style={{ color: colors.primary }}>
            {serviceName}
          </span>
        </div>
      )}

      {/* متن نظر */}
      {comment && (
        <p
          className="text-sm font-[Vazir] leading-6 text-justify"
          style={{ color: colors.textMain }}
        >
          {comment}
        </p>
      )}

      {/* پاسخ کسب‌وکار */}
      {reply && (
        <div
          className="mt-3 p-3 rounded-xl border"
          style={{
            backgroundColor: colors.primary + '08',
            borderColor: colors.primary + '25',
          }}
        >
          <p className="text-xs font-[Vazir-Bold] mb-1" style={{ color: colors.primary }}>
            پاسخ کسب‌وکار:
          </p>
          <p className="text-xs font-[Vazir] leading-5" style={{ color: colors.textSecondary }}>
            {reply}
          </p>
        </div>
      )}
    </Card>
  );
}
