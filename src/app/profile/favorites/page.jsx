// src/app/profile/favorites/page.jsx
'use client';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { FiChevronLeft } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import ScreenWrapper from '@/components/common/ScreenWrapper';
import Header from '@/components/common/Header';
import EmptyState from '@/components/common/EmptyState';
import { useFavoriteStore } from '@/stores/useFavoriteStore';
import { toPersianDigit } from '@/utils/numberUtils';

export default function FavoritesPage() {
  const { colors } = useTheme();
  const router = useRouter();
  const { isAuthenticated } = useRequireAuth({ redirectToLogin: true });
  const favoriteBusinesses = useFavoriteStore((s) => s.favoriteBusinesses);
  const favoritePosts = useFavoriteStore((s) => s.favoritePosts);
  const fetchFavorites = useFavoriteStore((s) => s.fetchFavorites);
  const toggleBusinessFavorite = useFavoriteStore((s) => s.toggleBusinessFavorite);
  const togglePostFavorite = useFavoriteStore((s) => s.togglePostFavorite);
  const [activeTab, setActiveTab] = useState('businesses');

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  const tabs = [
    { id: 'businesses', label: 'کسب‌وکار', count: favoriteBusinesses.length },
    { id: 'posts', label: 'ویترین', count: favoritePosts.length },
  ];

  const handleBusinessPress = useCallback((biz) => router.push(`/business/${biz.id}`), [router]);

  const handleRemoveBusiness = useCallback(
    async (biz) => {
      try {
        await toggleBusinessFavorite(biz.id);
      } catch (error) {
        console.error('Remove favorite failed:', error);
      }
    },
    [toggleBusinessFavorite]
  );

  const handleRemovePost = useCallback(
    async (post) => {
      try {
        await togglePostFavorite(post.id);
      } catch (error) {
        console.error('Remove favorite failed:', error);
      }
    },
    [togglePostFavorite]
  );

  if (!isAuthenticated) {
    return (
      <ScreenWrapper>
        <div className="flex items-center justify-center min-h-screen">
          <p style={{ color: colors.textMain }}>در حال بارگذاری...</p>
        </div>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper padding={0}>
      <Header title="علاقه‌مندی‌های من" onBackPress={() => router.back()} />
      <div className="px-4 pt-3 pb-2">
        <div
          className="flex p-1 rounded-xl border gap-1"
          style={{ backgroundColor: colors.cardBackground, borderColor: colors.border }}
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg transition-colors"
              style={{ backgroundColor: activeTab === tab.id ? colors.primary : 'transparent' }}
            >
              <span
                className="text-sm font-[Vazir-Bold]"
                style={{ color: activeTab === tab.id ? '#fff' : colors.textMain }}
              >
                {tab.label}
              </span>
              <span
                className="min-w-[22px] h-5 px-1.5 rounded-full flex items-center justify-center text-[11px] font-[Vazir-Bold]"
                style={{
                  backgroundColor:
                    activeTab === tab.id ? 'rgba(255,255,255,0.3)' : colors.primary + '20',
                  color: activeTab === tab.id ? '#fff' : colors.primary,
                }}
              >
                {toPersianDigit(tab.count)}
              </span>
            </button>
          ))}
        </div>
      </div>
      <div className="p-4 pb-32 space-y-3">
        {activeTab === 'businesses' && (
          <>
            {favoriteBusinesses.length > 0 ? (
              favoriteBusinesses.map((biz) => (
                <div
                  key={biz.id}
                  className="rounded-2xl border overflow-hidden"
                  style={{ backgroundColor: colors.cardBackground, borderColor: colors.border }}
                >
                  <button
                    onClick={() => handleBusinessPress(biz)}
                    className="w-full flex items-center gap-3 p-3.5 text-right"
                  >
                    {/* ✅ FIX (فاز ۴): width/height به جای fill بدون ابعاد والد */}
                    <Image
                      src={biz.logo}
                      alt={biz.name}
                      width={46}
                      height={46}
                      className="rounded-xl"
                      loading="lazy"
                      quality={80}
                    />
                    <div className="flex-1 min-w-0 flex flex-col gap-1.5">
                      <span
                        className="text-sm font-[Vazir-Bold] truncate"
                        style={{ color: colors.textMain }}
                      >
                        {biz.name}
                      </span>
                      <span className="text-xs" style={{ color: colors.textSecondary }}>
                        {biz.category} • {biz.city}
                      </span>
                    </div>
                    <FiChevronLeft size={18} style={{ color: colors.textSecondary }} />
                  </button>
                  <div
                    className="flex items-center justify-between px-3.5 py-2.5 border-t"
                    style={{ borderColor: colors.border }}
                  >
                    <span className="text-[11px]" style={{ color: colors.textSecondary }}>
                      ذخیره‌شده در علاقه‌مندی‌ها
                    </span>
                    <button
                      onClick={() => handleRemoveBusiness(biz)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg"
                      style={{ backgroundColor: '#E91E6315' }}
                    >
                      <span className="text-sm">🔖</span>
                      <span className="text-[11px] font-[Vazir-Bold]" style={{ color: '#E91E63' }}>
                        حذف
                      </span>
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <EmptyState
                icon="💔"
                title="کسب‌وکار ذخیره‌شده‌ای ندارید"
                description="با زدن دکمه ذخیره در صفحه کسب‌وکارها، آن‌ها اینجا نمایش داده می‌شوند"
              />
            )}
          </>
        )}
        {activeTab === 'posts' && (
          <>
            {favoritePosts.length > 0 ? (
              <div className="grid grid-cols-2 gap-3">
                {favoritePosts.map((post) => (
                  <div
                    key={post.id}
                    className="rounded-2xl border overflow-hidden"
                    style={{ backgroundColor: colors.cardBackground, borderColor: colors.border }}
                  >
                    {/* ✅ FIX (فاز ۴): ابعاد مشخص + lazy loading */}
                    <div className="relative w-full h-[120px]">
                      <Image
                        src={post.image || post.gallery?.[0]}
                        alt={post.businessName}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 50vw, 25vw"
                        loading="lazy"
                        quality={80}
                      />
                    </div>
                    <div className="p-2.5 space-y-1.5">
                      <span
                        className="text-[11px] font-[Vazir-Bold] truncate block"
                        style={{ color: colors.textMain }}
                      >
                        {post.businessName}
                      </span>
                      <p
                        className="text-[10px] line-clamp-2"
                        style={{ color: colors.textSecondary }}
                      >
                        {post.caption}
                      </p>
                      <button
                        onClick={() => handleRemovePost(post)}
                        className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-lg"
                        style={{ backgroundColor: '#E91E6315' }}
                      >
                        <span className="text-[10px]">🔖</span>
                        <span
                          className="text-[10px] font-[Vazir-Bold]"
                          style={{ color: '#E91E63' }}
                        >
                          حذف
                        </span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState
                icon="🖼️"
                title="پست ذخیره‌شده‌ای ندارید"
                description="با زدن دکمه ذخیره در ویترین، پست‌ها اینجا نمایش داده می‌شوند"
              />
            )}
          </>
        )}
      </div>
    </ScreenWrapper>
  );
}
