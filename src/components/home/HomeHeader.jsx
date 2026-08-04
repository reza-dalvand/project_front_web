// src/components/home/HomeHeader.jsx
'use client';



import { FiSliders, FiMoon, FiSun } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import SearchBar from '@/components/common/SearchBar';
import Avatar from '@/components/common/Avatar';
import { useAuth, useAuthModal } from '@/stores/useAuth';


export default function HomeHeader({
  userName,
  userAvatar,
  searchQuery,
  onSearchChange,
  onSearchSubmit,
  onFilterPress,
  hasActiveFilter = false,
  onThemeToggle,
  onSearchClick,
}) {
  const { colors, resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  const { isAuthenticated, user } = useAuth();
  const { openAuthModal } = useAuthModal();

  return (
    <div
      suppressHydrationWarning // ✅ جلوگیری از hydration mismatch
      className="relative overflow-hidden rounded-b-[28px] pt-8 pb-6"
      style={{ backgroundColor: colors.primary }}
    >
      {/* دایره‌های تزئینی */}
      <div
        className="absolute -top-10 -left-10 w-40 h-40 rounded-full border-2 pointer-events-none"
        style={{ borderColor: 'rgba(255,255,255,0.12)' }}
      />
      <div
        className="absolute -bottom-12 -right-12 w-52 h-52 rounded-full border-2 pointer-events-none"
        style={{ borderColor: 'rgba(255,255,255,0.08)' }}
      />

      <div className="px-5 flex flex-col gap-4 relative z-10">
        {/* ردیف بالا */}
        <div className="flex items-center justify-between">
          {/* خوشامدگویی */}
          <div className="flex items-center gap-3 flex-1">
            <Avatar
              uri={userAvatar}
              name={userName}
              size="md"
              showBorder
              className="!border-white/60"
            />
            <div className="flex flex-col gap-0.5 flex-1">
              <span className="text-[12px] font-[Vazir] text-white/85">
                سلام، وقت بخیر 👋
              </span>
              <span className="text-[17px] font-[Vazir-Bold] text-white line-clamp-1">
                {userName || 'کاربر زیبانو'}
              </span>
            </div>
          </div>

          {/* دکمه‌ها */}
          <div className="flex items-center gap-2">
            <button
              onClick={onFilterPress}
              className="w-[42px] h-[42px] rounded-[14px] flex items-center justify-center border relative transition-colors"
              style={{
                backgroundColor: hasActiveFilter
                  ? 'rgba(255,255,255,0.32)'
                  : 'rgba(255,255,255,0.18)',
                borderColor: 'rgba(255,255,255,0.1)',
              }}
            >
              <FiSliders size={22} color="#fff" />
              {hasActiveFilter && (
                <div
                  className="absolute top-2 right-2 w-2 h-2 rounded-full border-[1.5px]"
                  style={{ backgroundColor: '#FFD700', borderColor: colors.primary }}
                />
              )}
            </button>

          {!isAuthenticated ? (
            <button
              onClick={() => openAuthModal()}
              className="px-4 py-2 rounded-xl text-sm font-[Vazir-Bold]"
              style={{ backgroundColor: 'rgba(255,255,255,0.25)', color: '#fff' }}
            >
              ورود / ثبت‌نام
            </button>
          ) : (
            <span className="text-white text-sm font-[Vazir-Medium]">
              سلام {user?.name?.split(' ')[0]} 👋
            </span>
          )}
          </div>
        </div>

        {/* نوار جستجو */}
        <button
          onClick={onSearchClick}
          className="w-full text-right"
        >
          <div className="pointer-events-none">
            <SearchBar
              value={searchQuery}
              onChangeText={onSearchChange}
              placeholder="جستجوی خدمات، سالن‌ها..."
              onSubmit={onSearchSubmit}
            />
          </div>
        </button>
      </div>
    </div>
  );
}