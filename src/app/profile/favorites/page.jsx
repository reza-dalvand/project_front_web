'use client';
import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { FiMapPin, FiStar, FiBookmark, FiChevronLeft } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import { Card } from '@/components/common';
import { toPersianDigit } from '@/utils/numberUtils';
import { MOCK_FAVORITE_BUSINESSES, MOCK_FAVORITE_POSTS } from '@/data/businesses';
import { useToast } from '@/hooks/useToast';

const PostModal = dynamic(() => import('@/components/explore/PostModal'), {
  ssr: false,
  loading: () => null,
});

export default function FavoritesPage() {
  const { colors } = useTheme();
  const router = useRouter();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState('businesses');
  const [savedBusinesses, setSavedBusinesses] = useState(MOCK_FAVORITE_BUSINESSES);
  const [savedPosts, setSavedPosts] = useState(MOCK_FAVORITE_POSTS);
  const [activePost, setActivePost] = useState(null);

  const tabs = [
    { id: 'businesses', label: 'کسب‌وکار', count: savedBusinesses.length },
    { id: 'posts', label: 'ویترین', count: savedPosts.length },
  ];

  // ═══════ کسب‌وکار ═══════
  const handleBusinessPress = useCallback(
    (business) => router.push(`/business/${business.id}`),
    [router]
  );

  const handleRemoveBusiness = useCallback(
    (business) => {
      setSavedBusinesses((prev) => prev.filter((b) => b.id !== business.id));
      showToast('از علاقه‌مندی‌ها حذف شد', 'info');
    },
    [showToast]
  );

  // ═══════ پست ویترین ═══════
  const handlePostPress = useCallback((post) => setActivePost(post), []);
  const handlePostClose = useCallback(() => setActivePost(null), []);

  const handleSavePost = useCallback(
    (postId) => {
      setSavedPosts((prev) => prev.filter((p) => p.id !== postId));
      setActivePost(null);
      showToast('از علاقه‌مندی‌ها حذف شد', 'info');
    },
    [showToast]
  );

  // رزرو → صفحه کسب‌وکار
  const handleNavigateToProfile = useCallback(
    (businessId) => {
      if (businessId && businessId !== 'magazine') {
        router.push(`/business/${businessId}`);
      }
    },
    [router]
  );

  // تبدیل پست برای PostModal
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
                    <button
                      onClick={() => handleBusinessPress(biz)}
                      className="w-full text-right transition-all active:scale-[0.99]"
                    >
                      <div className="flex items-center gap-3">
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
                              <span className="text-[10px]">👑</span>
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col gap-1 flex-1 min-w-0">
                          <span
                            className="text-sm font-[Vazir-Bold] truncate"
                            style={{ color: colors.textMain }}
                          >
                            {biz.name}
                          </span>
                          <span
                            className="text-xs font-[Vazir-Medium]"
                            style={{ color: colors.primary }}
                          >
                            {biz.category}
                          </span>
                          <div className="flex items-center gap-1 mt-0.5">
                            <FiMapPin size={12} color={colors.textSecondary} />
                            <span className="text-[11px]" style={{ color: colors.textSecondary }}>
                              {biz.city}
                            </span>
                            <div
                              className="w-1 h-1 rounded-full mx-0.5"
                              style={{ backgroundColor: colors.border }}
                            />
                            <FiStar size={12} color="#FFC107" fill="#FFC107" />
                            <span
                              className="text-xs font-[Vazir-Bold]"
                              style={{ color: colors.textMain }}
                            >
                              {toPersianDigit(biz.rating)}
                            </span>
                            <span className="text-[10px]" style={{ color: colors.textSecondary }}>
                              ({toPersianDigit(biz.reviewsCount)})
                            </span>
                          </div>
                        </div>
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
