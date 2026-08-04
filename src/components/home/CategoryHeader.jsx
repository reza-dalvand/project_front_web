'use client';
import { FiArrowRight, FiSliders } from 'react-icons/fi';
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
      className="rounded-b-3xl pb-7 pt-4 px-5"
      style={{ backgroundColor: meta.color }}
    >
      {/* ردیف بالا */}
      <div className="flex items-center gap-3 mb-4">
        {/* دکمه بازگشت */}
        <button
          onClick={() => router.back()}
          className="w-10 h-10 rounded-xl flex items-center justify-center
            transition-transform hover:scale-105"
          style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
        >
          <FiArrowRight size={22} color="#fff" />
        </button>

        {/* اطلاعات دسته‌بندی */}
        <div className="flex items-center gap-3 flex-1">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-md"
            style={{ backgroundColor: 'rgba(255,255,255,0.95)' }}
          >
            {meta.icon}
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-xs text-white/80 font-[Vazir]">
              دسته‌بندی
            </span>
            <h1 className="text-lg font-[Vazir-Bold] text-white">
              {categoryName}
            </h1>
          </div>
        </div>

        {/* شمارنده + فیلتر */}
        <div className="flex items-center gap-2">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center
              flex-col gap-0.5"
            style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
          >
            <span className="text-sm font-[Vazir-Bold] text-white">
              {resultCount}
            </span>
          </div>
          {onFilterPress && (
            <button
              onClick={onFilterPress}
              className="w-10 h-10 rounded-xl flex items-center justify-center
                relative transition-transform hover:scale-105"
              style={{
                backgroundColor: hasActiveFilter
                  ? 'rgba(255,255,255,0.32)'
                  : 'rgba(255,255,255,0.2)',
              }}
            >
              <FiSliders size={20} color="#fff" />
              {hasActiveFilter && (
                <div
                  className="absolute top-2 right-2 w-2 h-2 rounded-full border"
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
      <SearchBar
        value={searchQuery}
        onChangeText={onSearchChange}
        placeholder={`جستجو در ${categoryName}...`}
      />
    </div>
  );
}