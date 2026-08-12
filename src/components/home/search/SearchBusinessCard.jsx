// src/components/home/search/SearchBusinessCard.jsx
'use client';
import Image from 'next/image';
import { FiMapPin, FiStar, FiChevronLeft, FiNavigation } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import { Card } from '@/components/common';
import { toPersianDigit } from '@/utils/numberUtils';

/**
 * کارت کسب‌وکار در نتایج جستجو
 * با پشتیبانی از نمایش فاصله
 *
 * @param {object} business - داده کسب‌وکار
 * @param {function} onPress - کلیک روی کارت
 * @param {object} userLocation - موقعیت کاربر (اختیاری)
 */
export default function SearchBusinessCard({ business, onPress, userLocation }) {
  const { colors } = useTheme();
  const hasDistance = business.distance !== null && business.distance !== undefined;

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

            {/* ردیف فاصله و شهر */}
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              {/* فاصله - اگر موجود باشد */}
              {hasDistance && (
                <div
                  className="flex items-center gap-1 px-2 py-0.5 rounded-lg"
                  style={{ backgroundColor: '#2196F318' }}
                >
                  <FiNavigation size={10} color="#2196F3" />
                  <span className="text-[10px] font-[Vazir-Bold]" style={{ color: '#2196F3' }}>
                    {business.distanceText}
                  </span>
                </div>
              )}
              {/* شهر */}
              <div className="flex items-center gap-1">
                <FiMapPin size={11} color={colors.textSecondary} />
                <span
                  className="text-[11px] font-[Vazir] line-clamp-1"
                  style={{ color: colors.textSecondary }}
                >
                  {business.city}
                </span>
              </div>
            </div>

            {/* امتیاز */}
            <div className="flex items-center gap-1.5 mt-1">
              <FiStar size={11} color="#FFC107" fill="#FFC107" />
              <span className="text-xs font-[Vazir-Bold]" style={{ color: colors.textMain }}>
                {toPersianDigit(business.rating)}
              </span>
              <span className="text-[10px] font-[Vazir]" style={{ color: colors.textSecondary }}>
                ({toPersianDigit(business.reviewsCount)})
              </span>
              {business.discount > 0 && (
                <span
                  className="text-[10px] font-[Vazir-Bold] px-2 py-0.5 rounded-md"
                  style={{ backgroundColor: '#E5393515', color: '#E53935' }}
                >
                  {toPersianDigit(business.discount)}٪ تخفیف
                </span>
              )}
            </div>
          </div>

          {/* فلش */}
          <FiChevronLeft size={18} color={colors.textSecondary} />
        </div>
      </button>
    </Card>
  );
}
