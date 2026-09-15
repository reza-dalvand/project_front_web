'use client';
import { FiMapPin, FiStar, FiChevronLeft, FiNavigation } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import { Card } from '@/components/common';
import { toPersianDigit } from '@/utils/numberUtils';

const MIN_REVIEWS_THRESHOLD = 3;
const DEFAULT_RATING = 5.0;

export default function BusinessListCard({ business, categoryIcon, onPress }) {
  const { colors } = useTheme();
  const hasDiscount = business.discount > 0;

  const reviewsCount = business.reviewsCount || business.reviews_count || 0;
  const displayRating =
    reviewsCount < MIN_REVIEWS_THRESHOLD ? DEFAULT_RATING : business.rating || 0;

  return (
    <Card variant="elevated" padding={14} radius={18} className="w-full">
      <button onClick={() => onPress?.(business)} className="w-full text-right">
        {/* ✅ Layout ریپانسیو - در صفحات بزرگتر افقی شود */}
        <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
          {/* ردیف بالا - آیکون و اطلاعات */}
          <div className="flex items-start gap-3 md:flex-1">
            {/* آیکون دسته‌بندی */}
            <div
              className="w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 rounded-xl md:rounded-2xl flex items-center justify-center text-xl md:text-2xl flex-shrink-0"
              style={{ backgroundColor: colors.primary + '15' }}
            >
              {categoryIcon || '💆‍♀️'}
            </div>

            {/* اطلاعات */}
            <div className="flex-1 min-w-0">
              <h3
                className="text-[13px] md:text-sm lg:text-base font-[Vazir-Bold] line-clamp-1"
                style={{ color: colors.textMain }}
              >
                {business.serviceType || business.name}
              </h3>
              <p className="text-[11px] md:text-xs font-[Vazir-Medium] mt-0.5" style={{ color: colors.primary }}>
                {business.name}
              </p>
              <p
                className="text-[10px] md:text-[11px] font-[Vazir] mt-0.5 line-clamp-1"
                style={{ color: colors.textSecondary }}
              >
                {business.category}
              </p>
            </div>
          </div>

          {/* امتیاز - در موبایل بالا، در دسکتاپ سمت چپ */}
          <div
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl flex-shrink-0 self-start md:self-center"
            style={{ backgroundColor: '#FFC10720' }}
          >
            <FiStar size={11} className="md:w-3 md:h-3" color="#FFC107" fill="#FFC107" />
            <span className="text-[11px] md:text-xs font-[Vazir-Bold]" style={{ color: colors.textMain }}>
              {toPersianDigit(displayRating)}
            </span>
          </div>
        </div>

        {/* ردیف میانی: فاصله + آدرس + تخفیف */}
        <div className="flex flex-wrap items-center gap-2 mt-3 md:mt-4">
          {/* فاصله */}
          {business.distanceText && (
            <div
              className="flex items-center gap-1 px-2 py-0.5 rounded-lg flex-shrink-0"
              style={{ backgroundColor: '#2196F318' }}
            >
              <FiNavigation size={9} className="md:w-2.5 md:h-2.5" color="#2196F3" />
              <span className="text-[9px] md:text-[10px] font-[Vazir-Bold]" style={{ color: '#2196F3' }}>
                {business.distanceText}
              </span>
            </div>
          )}

          {hasDiscount && (
            <div
              className="flex items-center gap-1 px-2 py-1 rounded-lg"
              style={{ backgroundColor: '#E53935' }}
            >
              <span className="text-[9px] md:text-[10px] font-[Vazir-Bold] text-white">
                {toPersianDigit(business.discount)}٪
              </span>
            </div>
          )}

          <div className="flex items-center gap-1 flex-1 min-w-0">
            <FiMapPin size={11} className="md:w-3 md:h-3" color={colors.textSecondary} />
            <span
              className="text-[10px] md:text-[11px] font-[Vazir] line-clamp-1"
              style={{ color: colors.textSecondary }}
            >
              {business.address}
            </span>
          </div>
        </div>

        {/* فوتر: دکمه رزرو */}
        <div className="mt-3 pt-3 md:mt-4 md:pt-4 border-t" style={{ borderColor: colors.border }}>
          <div
            className="flex items-center justify-center gap-2 py-2.5 md:py-3 rounded-xl transition-all hover:opacity-90"
            style={{ backgroundColor: '#43A047' }}
          >
            <span className="text-sm md:text-base">📅</span>
            <span className="text-[13px] md:text-sm font-[Vazir-Bold] text-white">
              رزرو و دیدن نمونه‌کارها
            </span>
            <FiChevronLeft size={14} className="md:w-4 md:h-4" color="#fff" />
          </div>
        </div>
      </button>
    </Card>
  );
}