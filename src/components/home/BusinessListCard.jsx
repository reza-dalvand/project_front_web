'use client';
import Image from 'next/image';
import { FiMapPin, FiStar, FiChevronLeft } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import { Card } from '@/components/common';
import { toPersianDigit } from '@/utils/numberUtils';

export default function BusinessListCard({ business, categoryIcon, onPress }) {
  const { colors } = useTheme();
  const hasDiscount = business.discount > 0;

  return (
    <Card variant="elevated" padding={14} radius={18}>
      <button onClick={() => onPress?.(business)} className="w-full text-right">
        {/* ردیف بالا */}
        <div className="flex items-start gap-3">
          {/* آیکون دسته‌بندی */}
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
            style={{ backgroundColor: colors.primary + '15' }}
          >
            {categoryIcon || '💆‍♀️'}
          </div>

          {/* اطلاعات */}
          <div className="flex-1 min-w-0">
            <h3
              className="text-sm font-[Vazir-Bold] line-clamp-1"
              style={{ color: colors.textMain }}
            >
              {business.serviceType || business.name}
            </h3>
            <p className="text-xs font-[Vazir-Medium] mt-0.5" style={{ color: colors.primary }}>
              {business.name}
            </p>
            <p
              className="text-[11px] font-[Vazir] mt-0.5 line-clamp-1"
              style={{ color: colors.textSecondary }}
            >
              {business.category}
            </p>
          </div>

          {/* امتیاز */}
          <div
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl flex-shrink-0"
            style={{ backgroundColor: '#FFC10720' }}
          >
            <FiStar size={12} color="#FFC107" fill="#FFC107" />
            <span className="text-xs font-[Vazir-Bold]" style={{ color: colors.textMain }}>
              {toPersianDigit(business.rating)}
            </span>
          </div>
        </div>

        {/* ردیف میانی: آدرس + تخفیف */}
        <div className="flex items-center gap-2 mt-3">
          {hasDiscount && (
            <div
              className="flex items-center gap-1 px-2 py-1 rounded-lg"
              style={{ backgroundColor: '#E53935' }}
            >
              <span className="text-[10px] font-[Vazir-Bold] text-white">
                {toPersianDigit(business.discount)}٪
              </span>
            </div>
          )}
          <div className="flex items-center gap-1 flex-1 min-w-0">
            <FiMapPin size={12} color={colors.textSecondary} />
            <span
              className="text-[11px] font-[Vazir] line-clamp-1"
              style={{ color: colors.textSecondary }}
            >
              {business.address}
            </span>
          </div>
        </div>

        {/* فوتر: دکمه رزرو */}
        <div className="mt-3 pt-3 border-t" style={{ borderColor: colors.border }}>
          <div
            className="flex items-center justify-center gap-2 py-2.5 rounded-xl
              transition-all"
            style={{ backgroundColor: '#43A047' }}
          >
            <span className="text-sm">📅</span>
            <span className="text-sm font-[Vazir-Bold] text-white">رزرو و دیدن نمونه‌کارها</span>
            <FiChevronLeft size={16} color="#fff" />
          </div>
        </div>
      </button>
    </Card>
  );
}
