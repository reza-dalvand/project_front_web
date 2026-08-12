// src/app/profile/favorites/page.jsx
'use client';
import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { FiMapPin, FiStar, FiBookmark, FiChevronLeft } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import { Card } from '@/components/common';
import { toPersianDigit } from '@/utils/numberUtils';
import { favoritesService } from '@/api';
import { USE_MOCK } from '@/api/config';
import { MOCK_FAVORITE_BUSINESSES, MOCK_FAVORITE_POSTS } from '@/data/businesses';
import dynamic from 'next/dynamic';

const PostModal = dynamic(() => import('@/components/explore/PostModal'), {
  ssr: false,
  loading: () => null,
});

export default function FavoritesPage() {
  const { colors } = useTheme();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('businesses');
  const [savedBusinesses, setSavedBusinesses] = useState(MOCK_FAVORITE_BUSINESSES);
  const [savedPosts, setSavedPosts] = useState(MOCK_FAVORITE_POSTS);
  const [activePost, setActivePost] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // ═══ دریافت علاقه‌مندی‌ها از API ═══
  useEffect(() => {
    const fetchFavorites = async () => {
      if (USE_MOCK) return;

      setIsLoading(true);
      try {
        const response = await favoritesService.getFavorites();
        setSavedBusinesses(response.data?.businesses || []);
        setSavedPosts(response.data?.posts || []);
      } catch (error) {
        console.error('Failed to fetch favorites:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  const tabs = [
    { id: 'businesses', label: 'کسب‌وکار', count: savedBusinesses.length },
    { id: 'posts', label: 'ویترین', count: savedPosts.length },
  ];

  // ═══ کسب‌وکار ═══
  const handleBusinessPress = (business) => router.push(`/business/${business.id}`);

  const handleRemoveBusiness = async (business) => {
    if (USE_MOCK) {
      setSavedBusinesses((prev) => prev.filter((b) => b.id !== business.id));
      return;
    }

    try {
      await favoritesService.toggleFavorite('business', business.id);
      setSavedBusinesses((prev) => prev.filter((b) => b.id !== business.id));
    } catch (error) {
      console.error('Failed to remove favorite:', error);
    }
  };

  // ═══ پست ویترین ═══
  const handlePostPress = (post) => setActivePost(post);
  const handlePostClose = () => setActivePost(null);

  const handleSavePost = async (postId) => {
    if (USE_MOCK) {
      setSavedPosts((prev) => prev.filter((p) => p.id !== postId));
      setActivePost(null);
      return;
    }

    try {
      await favoritesService.toggleFavorite('post', postId);
      setSavedPosts((prev) => prev.filter((p) => p.id !== postId));
      setActivePost(null);
    } catch (error) {
      console.error('Failed to remove favorite post:', error);
    }
  };

  const handleNavigateToProfile = (businessId) => {
    if (businessId && businessId !== 'magazine') {
      router.push(`/business/${businessId}`);
    }
  };

  const getPostForModal = (post) => ({
    ...post,
    saved: true,
    source: post.source || 'business',
    gallery: post.gallery || (post.image ? [post.image] : []),
    rating: post.rating || 0,
    discount: post.discount || 0,
  });

  return (
    <div className="min-h-screen pb-20" style={{ backgroundColor: colors.background }}>
      {/* Tabs */}
      <div className="px-4 pt-3 pb-2">
        <div className="flex gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl border transition-colors"
              style={{
                backgroundColor: activeTab === tab.id ? colors.primary : colors.cardBackground,
                borderColor: activeTab === tab.id ? colors.primary : colors.border,
              }}
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

      <div className="p-4">
        {/* ═══════ تب کسب‌وکارها ═══════ */}
        {activeTab === 'businesses' && (
          <>
            {savedBusinesses.length > 0 ? (
              <div className="flex flex-col gap-3">
                {savedBusinesses.map((biz) => (
                  <Card key={biz.id} variant="elevated" padding={14} radius={18}>
                    <button onClick={() => handleBusinessPress(biz)} className="w-full text-right">
                      <div className="flex items-center gap-3">
                        {/* لوگو */}
                        <div className="relative flex-shrink-0">
                          <Image
                            src={biz.logo}
                            alt={biz.name}
                            width={64}
                            height={64}
                            className="rounded-2xl"
                          />
                          {biz.VIP && (
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
                            {biz.name}
                          </h3>
                          <p
                            className="text-xs font-[Vazir-Medium] line-clamp-1"
                            style={{ color: colors.primary }}
                          >
                            {biz.category}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <FiMapPin size={11} color={colors.textSecondary} />
                            <span
                              className="text-[11px] font-[Vazir] line-clamp-1"
                              style={{ color: colors.textSecondary }}
                            >
                              {biz.city}
                            </span>
                            <div
                              className="w-1 h-1 rounded-full"
                              style={{ backgroundColor: colors.border }}
                            />
                            <FiStar size={11} color="#FFC107" fill="#FFC107" />
                            <span
                              className="text-xs font-[Vazir-Bold]"
                              style={{ color: colors.textMain }}
                            >
                              {toPersianDigit(biz.rating)}
                            </span>
                            <span
                              className="text-[10px] font-[Vazir]"
                              style={{ color: colors.textSecondary }}
                            >
                              ({toPersianDigit(biz.reviewsCount)})
                            </span>
                          </div>
                        </div>
                        {/* فلش */}
                        <FiChevronLeft size={20} color={colors.textSecondary} />
                      </div>
                    </button>
                    <div
                      className="mt-3 pt-3 border-t flex items-center justify-between"
                      style={{ borderColor: colors.border }}
                    >
                      <span
                        className="text-[11px] font-[Vazir]"
                        style={{ color: colors.textSecondary }}
                      >
                        ذخیره‌شده در علاقه‌مندی‌ها
                      </span>
                      <button
                        onClick={() => handleRemoveBusiness(biz)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all hover:scale-[1.03] active:scale-[0.97]"
                        style={{ backgroundColor: '#E91E6315' }}
                      >
                        <FiBookmark size={14} color="#E91E63" fill="#E91E63" />
                        <span
                          className="text-[11px] font-[Vazir-Bold]"
                          style={{ color: '#E91E63' }}
                        >
                          حذف از علاقه‌مندی
                        </span>
                      </button>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 gap-4">
                <div
                  className="w-20 h-20 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: '#E91E6312' }}
                >
                  <span className="text-4xl">💔</span>
                </div>
                <h3 className="text-lg font-[Vazir-Bold]" style={{ color: colors.textMain }}>
                  کسب‌وکار ذخیره‌شده‌ای ندارید
                </h3>
                <p
                  className="text-sm text-center leading-6"
                  style={{ color: colors.textSecondary }}
                >
                  با زدن دکمه ذخیره در صفحه کسب‌وکارها، آن‌ها اینجا نمایش داده می‌شوند
                </p>
              </div>
            )}
          </>
        )}

        {/* ═══════ تب پست‌های ویترین ═══════ */}
        {activeTab === 'posts' && (
          <>
            {savedPosts.length > 0 ? (
              <div className="grid grid-cols-2 gap-3">
                {savedPosts.map((post) => {
                  const gallery = post.gallery || (post.image ? [post.image] : []);
                  const totalImages = gallery.length;
                  const firstImage = gallery[0] || post.image;
                  const hasMultipleImages = totalImages > 1;

                  return (
                    <Card key={post.id} variant="elevated" padding={0} radius={14}>
                      {/* ✅ کل کارت یک دکمه → کلیک روی هر قسمت = باز شدن مدال */}
                      <button
                        onClick={() => handlePostPress(post)}
                        className="w-full text-right transition-all active:scale-[0.98]"
                      >
                        {/* تصویر */}
                        <div className="relative">
                          <Image
                            src={firstImage}
                            alt={post.businessName}
                            width={400}
                            height={150}
                            className="w-full h-[150px] object-cover"
                          />
                          {/* Badge تعداد تصاویر */}
                          {hasMultipleImages && (
                            <div
                              className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 rounded-lg z-10"
                              style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
                            >
                              <span className="text-white text-[10px]">📷</span>
                              <span className="text-white text-[10px] font-[Vazir-Bold]">
                                {toPersianDigit(totalImages)}
                              </span>
                            </div>
                          )}
                        </div>
                        {/* اطلاعات پست */}
                        <div className="p-2.5 flex flex-col gap-1.5">
                          <div className="flex items-center gap-1.5">
                            <Image
                              src={post.businessLogo}
                              alt={post.businessName}
                              width={22}
                              height={22}
                              className="rounded-full"
                            />
                            <span
                              className="text-[11px] font-[Vazir-Bold] flex-1 truncate"
                              style={{ color: colors.textMain }}
                            >
                              {post.businessName}
                            </span>
                          </div>
                          <p
                            className="text-[11px] leading-4 line-clamp-2"
                            style={{ color: colors.textSecondary }}
                          >
                            {post.caption}
                          </p>
                        </div>
                      </button>
                      {/* دکمه حذف از علاقه‌مندی — جدا از دکمه اصلی */}
                      <div className="px-2.5 pb-2.5 flex justify-end">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSavePost(post.id);
                          }}
                          className="w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-110 active:scale-95"
                          style={{ backgroundColor: '#E91E6315' }}
                        >
                          <FiBookmark size={16} color="#E91E63" fill="#E91E63" />
                        </button>
                      </div>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 gap-4">
                <div
                  className="w-20 h-20 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: '#E91E6312' }}
                >
                  <span className="text-4xl">🖼️</span>
                </div>
                <h3 className="text-lg font-[Vazir-Bold]" style={{ color: colors.textMain }}>
                  پست ذخیره‌شده‌ای ندارید
                </h3>
                <p
                  className="text-sm text-center leading-6"
                  style={{ color: colors.textSecondary }}
                >
                  با زدن دکمه ذخیره در ویترین، پست‌ها اینجا نمایش داده می‌شوند
                </p>
              </div>
            )}
          </>
        )}
      </div>

      {/* ═══════ مدال پست ویترین ═══════ */}
      <PostModal
        post={activePost ? getPostForModal(activePost) : null}
        visible={!!activePost}
        onClose={handlePostClose}
        onSave={handleSavePost}
        onNavigateToProfile={handleNavigateToProfile}
      />
    </div>
  );
}
