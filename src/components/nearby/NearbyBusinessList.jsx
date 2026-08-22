// src/components/nearby/NearbyBusinessList.jsx
'use client';

import { FiNavigation } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import SectionHeader from '@/components/common/SectionHeader';
import BusinessListCard from '@/components/home/BusinessListCard';
import EmptyState from '@/components/common/EmptyState';
import { toPersianDigit } from '@/utils/numberUtils';

export default function NearbyBusinessList({
  selectedCategoryId,
  categories = [], // ✅ categories از پروپ می‌آید
  paginatedBusinesses,
  filteredBusinesses,
  hasMore,
  isLoadingMore,
  onLoadMore,
  onBusinessPress,
  onClearFilter,
}) {
  const { colors } = useTheme();
  const categoryName = categories.find((c) => c.id === selectedCategoryId)?.name || '';

  return (
    <section>
      <SectionHeader
        icon={<FiNavigation size={18} />}
        iconColor="#2196F3"
        title={`نزدیک‌ترین ${categoryName}`}
        subtitle={`${toPersianDigit(filteredBusinesses.length)} کسب‌وکار یافت شد`}
      />

      {paginatedBusinesses.length > 0 ? (
        <div className="space-y-3">
          {paginatedBusinesses.map((biz) => (
            <BusinessListCard key={biz.id} business={biz} categoryIcon="💆‍♀️" onPress={onBusinessPress} />
          ))}
          {hasMore && (
            <button
              onClick={onLoadMore}
              disabled={isLoadingMore}
              className="w-full py-3 text-center text-sm font-[Vazir-Bold] rounded-xl border transition-all active:scale-[0.98]"
              style={{ color: colors.primary, borderColor: colors.border }}
            >
              {isLoadingMore ? 'در حال بارگذاری...' : 'مشاهده بیشتر'}
            </button>
          )}
        </div>
      ) : (
        <EmptyState
          icon="📍"
          title="کسب‌وکاری در این دسته نزدیک شما نیست"
          description="دسته دیگری را امتحان کنید یا فاصله جستجو را بیشتر کنید"
          actionLabel="حذف فیلتر"
          onAction={onClearFilter}
        />
      )}
    </section>
  );
}