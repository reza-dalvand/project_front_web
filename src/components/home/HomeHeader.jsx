'use client';
import { FiFilter, FiMoon, FiSun } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import SearchBar from '@/components/common/SearchBar';
import Avatar from '@/components/common/Avatar';
import { useGlobalLocationStore } from '@/stores/useGlobalLocationStore';

export default function HomeHeader({
  userName,
  userAvatar,
  searchQuery,
  onSearchChange,
  onSearchSubmit,
  onFilterPress,
  hasActiveFilter = false,
  isDark = false,
  onThemeToggle,
  onSearchClick,
}) {
  const { colors } = useTheme();
  const hasActiveLocationFilter = useGlobalLocationStore((s) => s.hasActiveLocationFilter());
  const getLocationLabel = useGlobalLocationStore((s) => s.getLocationLabel);

  return (
    <div
      suppressHydrationWarning
      className="relative overflow-hidden rounded-b-[28px] md:rounded-b-[32px] lg:rounded-b-[36px] pt-8 pb-6 md:pt-10 md:pb-8"
      style={{ backgroundColor: colors.primary }}
    >
      {/* دایره‌های تزئینی - ریپانسیو */}
      <div
        className="absolute -top-10 -left-10 w-32 h-32 md:w-44 md:h-44 lg:w-52 lg:h-52 rounded-full border-2 pointer-events-none"
        style={{ borderColor: 'rgba(255,255,255,0.12)' }}
      />
      <div
        className="absolute -bottom-12 -right-12 w-40 h-40 md:w-56 md:h-56 lg:w-64 lg:h-64 rounded-full border-2 pointer-events-none"
        style={{ borderColor: 'rgba(255,255,255,0.08)' }}
      />

      {/* ✅ Container ریپانسیو */}
      <div className="app-container">
        <div className="px-5 md:px-6 lg:px-8 flex flex-col gap-4 md:gap-5 relative z-10">
          {/* ردیف بالا */}
          <div className="flex items-center justify-between">
            {/* خوشامدگویی */}
            <div className="flex items-center gap-3 md:gap-4 flex-1">
              <Avatar
                uri={userAvatar}
                name={userName}
                size="md"
                showBorder
                className="!border-white/60 w-11 h-11 md:w-12 md:h-12 lg:w-14 lg:h-14"
              />
              <div className="flex flex-col gap-0.5 md:gap-1 flex-1">
                <span className="text-[11px] md:text-[12px] lg:text-sm font-[Vazir] text-white/85">
                  سلام، وقت بخیر 👋
                </span>
                <span className="text-[15px] md:text-[17px] lg:text-lg font-[Vazir-Bold] text-white line-clamp-1">
                  {userName || 'کاربر بیو کلاب'}
                </span>
              </div>
            </div>

            {/* دکمه‌ها */}
            <div className="flex items-center gap-2 md:gap-3">
              {/* دکمه تغییر تم */}
              <button
                onClick={onThemeToggle}
                className="w-[40px] h-[40px] md:w-[44px] md:h-[44px] lg:w-[48px] lg:h-[48px] rounded-[12px] md:rounded-[14px] flex items-center justify-center border transition-all duration-200 hover:scale-105 active:scale-95"
                style={{
                  backgroundColor: 'rgba(255,255,255,0.18)',
                  borderColor: 'rgba(255,255,255,0.1)',
                }}
                aria-label={isDark ? 'تغییر به تم روشن' : 'تغییر به تم تاریک'}
              >
                {isDark ? (
                  <FiSun size={18} className="md:w-5 md:h-5 lg:w-6 lg:h-6" color="#fff" />
                ) : (
                  <FiMoon size={18} className="md:w-5 md:h-5 lg:w-6 lg:h-6" color="#fff" />
                )}
              </button>

              {/* دکمه فیلتر */}
              <button
                onClick={onFilterPress}
                className="w-[40px] h-[40px] md:w-[44px] md:h-[44px] lg:w-[48px] lg:h-[48px] rounded-[12px] md:rounded-[14px] flex items-center justify-center border relative transition-colors"
                style={{
                  backgroundColor: hasActiveLocationFilter
                    ? 'rgba(255,255,255,0.32)'
                    : 'rgba(255,255,255,0.18)',
                  borderColor: 'rgba(255,255,255,0.1)',
                }}
              >
                <FiFilter size={20} className="md:w-5 md:h-5 lg:w-6 lg:h-6" color="#fff" />
                {hasActiveLocationFilter && (
                  <div
                    className="absolute top-1.5 right-1.5 w-2.5 h-2.5 md:w-3 md:h-3 rounded-full border-2"
                    style={{ backgroundColor: '#4CAF50', borderColor: colors.primary }}
                  />
                )}
              </button>
            </div>
          </div>

          {/* نوار جستجو */}
          <button onClick={onSearchClick} className="w-full text-right">
            <div className="pointer-events-none">
              <SearchBar
                value={searchQuery}
                onChangeText={onSearchChange}
                placeholder="جستجوی خدمات، سالن‌ها..."
                onSubmit={onSearchSubmit}
                variant="onPrimary"
              />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}