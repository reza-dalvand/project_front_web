'use client';

import Image from 'next/image';
import { FiMapPin, FiStar, FiChevronLeft } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import { Card } from '@/components/common';
import { toPersianDigit } from '@/utils/numberUtils';

export default function SearchBusinessCard({ business, onPress }) {
  const { colors } = useTheme();

  return (
    <Card variant="elevated" padding={14} radius={18}>
      <button onClick={() => onPress?.(business)} className="w-full text-right">
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
                  backgroundColor: colors.primary,
                  borderColor: colors.cardBackground,
                }}
              >
                <span className="text-[9px]">👑</span>
              </div>
            )}
          </div>

          {/* اطلاعات */}
          <div className="flex-1 min-w-0 gap-1">
            <h3
              className="text-sm font-[Vazir-Bold] line-clamp-1"
              style={{ color: colors.textMain }}
            >
              {business.name}
            </h3>
            <p
              className="text-xs font-[Vazir-Medium] line-clamp-1"
              style={{ color: colors.primary }}
            >
              {business.category}
            </p>
            <div className="flex items-center gap-2 mt-1">
              <FiMapPin size={11} color={colors.textSecondary} />
              <span
                className="text-[11px] font-[Vazir] line-clamp-1"
                style={{ color: colors.textSecondary }}
              >
                {business.city}
              </span>
              <div className="w-1 h-1 rounded-full" style={{ backgroundColor: colors.border }} />
              <FiStar size={11} color="#FFC107" fill="#FFC107" />
              <span className="text-xs font-[Vazir-Bold]" style={{ color: colors.textMain }}>
                {toPersianDigit(business.rating)}
              </span>
              <span className="text-[10px] font-[Vazir]" style={{ color: colors.textSecondary }}>
                ({toPersianDigit(business.reviewsCount)})
              </span>
            </div>
          </div>

          {/* فلش */}
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: colors.primary + '15' }}
          >
            <FiChevronLeft size={18} color={colors.primary} />
          </div>
        </div>
      </button>
    </Card>
  );
}
