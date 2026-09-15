'use client';
import { FiArrowRight, FiFilter } from 'react-icons/fi';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/stores/useThemeStore';
import SearchBar from '@/components/common/SearchBar';

const CATEGORY_META = {
  1: { icon: '💄', color: '#E91E63' },
  2: { icon: '💅', color: '#9C27B0' },
  3: { icon: '⚡', color: '#2196F3' },
  4: { icon: '🧖‍♀️', color: '#4CAF50' },
  5: { icon: '🎨', color: '#FF9800' },
  6: { icon: '✨', color: '#00BCD4' },
  7: { icon: '👁️', color: '#795548' },
  8: { icon: '💆‍♀️', color: '#607D8B' },
};

export default function CategoryHeader({
  categoryId,
  categoryName,
  resultCount = 0,
  searchQuery,
  onSearchChange,
  onFilterPress,
  hasActiveFilter = false,
}) {
  const { colors } = useTheme();
  const router = useRouter();
  const meta = CATEGORY_META[categoryId] || { icon: '💆‍♀️', color: colors.primary };

  return (
    <div
      className="rounded-b-3xl md:rounded-b-[36px] lg:rounded-b-[40px] pb-6 sm:pb-7 md:pb-8 lg:pb-10 pt-4 md:pt-5"
      style={{ backgroundColor: meta.color }}
    >
      {/* ✅ کانتینر مرکزی */}
      <div className="max-w-6xl mx-auto px-5 md:px-6 lg:px-8">
        {/* ردیف بالا */}
        <div className="flex items-center gap-2.5 sm:gap-3 md:gap-4 mb-4 md:mb-5 lg:mb-6">
          {/* دکمه بازگشت */}
          <button
            onClick={() => router.back()}
            className="w-10 h-10 md:w-11 md:h-11 lg:w-12 lg:h-12 rounded-xl md:rounded-2xl flex items-center justify-center
              transition-transform hover:scale-105 active:scale-95"
            style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
          >
            <FiArrowRight size={22} className="md:w-6 md:h-6" color="#fff" />
          </button>

          {/* اطلاعات دسته‌بندی */}
          <div className="flex items-center gap-2.5 sm:gap-3 md:gap-4 flex-1">
            <div
              className="w-11 h-11 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 rounded-xl sm:rounded-2xl md:rounded-[20px] flex items-center justify-center text-xl sm:text-2xl md:text-3xl shadow-md"
              style={{ backgroundColor: 'rgba(255,255,255,0.95)' }}
            >
              {meta.icon}
            </div>
            <div className="flex flex-col gap-0.5 md:gap-1">
              <span className="text-[11px] sm:text-xs md:text-sm text-white/80 font-[Vazir]">دسته‌بندی</span>
              <h1 className="text-base sm:text-lg md:text-xl lg:text-2xl font-[Vazir-Bold] text-white">{categoryName}</h1>
            </div>
          </div>

          {/* شمارنده + فیلتر */}
          <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3">
            <div
              className="w-10 h-10 md:w-11 md:h-11 lg:w-12 lg:h-12 rounded-xl md:rounded-2xl flex items-center justify-center
                flex-col gap-0.5"
              style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
            >
              <span className="text-sm md:text-base lg:text-lg font-[Vazir-Bold] text-white">{resultCount}</span>
            </div>
            {onFilterPress && (
              <button
                onClick={onFilterPress}
                className="w-10 h-10 md:w-11 md:h-11 lg:w-12 lg:h-12 rounded-xl md:rounded-2xl flex items-center justify-center relative border transition-colors hover:opacity-80"
                style={{
                  backgroundColor: hasActiveFilter
                    ? 'rgba(255,255,255,0.32)'
                    : 'rgba(255,255,255,0.2)',
                  borderColor: 'rgba(255,255,255,0.15)',
                }}
              >
                <FiFilter size={20} className="md:w-5 md:h-5 lg:w-6 lg:h-6" color="#fff" />
                {hasActiveFilter && (
                  <div
                    className="absolute top-1.5 right-1.5 md:top-2 md:right-2 w-2 h-2 md:w-2.5 md:h-2.5 rounded-full border-2"
                    style={{
                      backgroundColor: '#FFD700',
                      borderColor: 'rgba(0,0,0,0.15)',
                    }}
                  />
                )}
              </button>
            )}
          </div>
        </div>

        {/* نوار جستجو */}
        <div className="max-w-2xl">
          <SearchBar
            value={searchQuery}
            onChangeText={onSearchChange}
            placeholder={`جستجو در ${categoryName}...`}
          />
        </div>
      </div>
    </div>
  );
}