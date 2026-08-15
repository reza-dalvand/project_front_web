// src/components/explore/post/PostRatingCard.jsx
'use client';
import { FiStar } from 'react-icons/fi';
import StarRating from '@/components/common/StarRating';
import { useTheme } from '@/stores/useThemeStore';

export default function PostRatingCard({ rating }) {
  const { colors } = useTheme();

  return (
    <div
      className="flex items-center justify-between p-3 mx-4 mt-4
      rounded-2xl border"
      style={{
        backgroundColor: colors.cardBackground,
        borderColor: colors.border,
      }}
    >
      <div className="flex items-center gap-2">
        <FiStar size={18} color="#FFC107" fill="#FFC107" />
        <span className="text-lg font-bold" style={{ color: colors.textMain }}>
          {rating.toFixed(1)}
        </span>
        <span className="text-xs" style={{ color: colors.textSecondary }}>
          از ۵
        </span>
      </div>
      <div className="w-px h-6" style={{ backgroundColor: colors.border }} />
      <StarRating value={rating} size="md" />
    </div>
  );
}
