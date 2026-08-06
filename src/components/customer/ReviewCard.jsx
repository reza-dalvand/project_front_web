'use client';
import Image from 'next/image';
import { FiStar } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import Card from '@/components/common/Card';
import Avatar from '@/components/common/Avatar';
import { toPersianDigit } from '@/utils/numberUtils';

/**
 * کامپوننت کارت نظر مشتری
 *
 * @param {object} review - داده نظر
 * @param {string} review.userName - نام کاربر
 * @param {string} review.userAvatar - آواتار کاربر
 * @param {number} review.rating - امتیاز (۱ تا ۵)
 * @param {string} review.date - تاریخ نظر
 * @param {string} review.serviceName - نام خدمت
 * @param {string} review.comment - متن نظر
 */
export default function ReviewCard({ review }) {
  const { colors } = useTheme();

  return (
    <Card variant="elevated" padding={16} radius={16}>
      {/* هدر: کاربر + امتیاز */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3 flex-1">
          <Avatar uri={review.userAvatar} name={review.userName} size="md" />
          <div className="flex flex-col gap-1">
            <span className="text-sm font-[Vazir-Bold]" style={{ color: colors.textMain }}>
              {review.userName}
            </span>
            <span className="text-[11px] font-[Vazir]" style={{ color: colors.textSecondary }}>
              {review.date}
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
            {toPersianDigit(review.rating.toFixed(1))}
          </span>
        </div>
      </div>

      {/* Badge خدمت */}
      {review.serviceName && (
        <div
          className="self-start px-3 py-1.5 rounded-xl mb-3"
          style={{ backgroundColor: colors.primary + '15' }}
        >
          <span className="text-[11px] font-[Vazir-Bold]" style={{ color: colors.primary }}>
            {review.serviceName}
          </span>
        </div>
      )}

      {/* متن نظر */}
      {review.comment && (
        <p
          className="text-sm font-[Vazir] leading-6 text-justify"
          style={{ color: colors.textMain }}
        >
          {review.comment}
        </p>
      )}
    </Card>
  );
}
