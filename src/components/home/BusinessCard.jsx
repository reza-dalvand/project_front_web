'use client';
import Image from 'next/image';
import { FiStar, FiMapPin, FiChevronLeft } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import { toPersianDigit } from '@/utils/numberUtils';

export default function BusinessCard({ business, onPress }) {
  const { colors } = useTheme();

  return (
    <button
      onClick={() => onPress?.(business)}
      className="w-full rounded-2xl border p-4 transition-all hover:shadow-md active:scale-[0.98] text-right"
      style={{
        backgroundColor: colors.cardBackground,
        borderColor: colors.border,
      }}
    >
      <div className="flex items-center gap-3">
        {/* لوگو */}
        <div className="relative flex-shrink-0">
          <Image
            src={business.logo}
            alt={business.name}
            width={64}
            height={64}
            className="rounded-2xl object-cover"
          />
          {business.VIP && (
            <div
              className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center border-2"
              style={{
                backgroundColor: '#FFD700',
                borderColor: colors.cardBackground,
              }}
            >
              <span className="text-[8px]">👑</span>
            </div>
          )}
        </div>

        {/* اطلاعات */}
        <div className="flex-1 min-w-0 gap-1">
          <p className="text-sm font-[Vazir-Bold] truncate" style={{ color: colors.textMain }}>
            {business.name}
          </p>
          <p className="text-xs font-[Vazir-Medium] truncate" style={{ color: colors.primary }}>
            {business.category}
          </p>
          <div className="flex items-center gap-1.5 mt-1">
            <FiMapPin size={11} color={colors.textSecondary} />
            <span
              className="text-[11px] font-[Vazir] truncate"
              style={{ color: colors.textSecondary }}
            >
              {business.city}
            </span>
          </div>
        </div>

        {/* امتیاز و خدمات */}
        <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
          <div className="flex items-center gap-1">
            <FiStar size={12} color="#FFC107" fill="#FFC107" />
            <span className="text-xs font-[Vazir-Bold]" style={{ color: colors.textMain }}>
              {toPersianDigit(business.rating)}
            </span>
            <span className="text-[10px] font-[Vazir]" style={{ color: colors.textSecondary }}>
              ({toPersianDigit(business.reviewsCount)})
            </span>
          </div>
          <span className="text-[10px] font-[Vazir]" style={{ color: colors.textSecondary }}>
            {toPersianDigit(business.servicesCount)} خدمت
          </span>
        </div>

        <FiChevronLeft size={18} color={colors.textSecondary} />
      </div>
    </button>
  );
}
