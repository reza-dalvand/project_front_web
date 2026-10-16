// src/components/explore/PostThumbnail.jsx
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { FiBookmark, FiImage, FiStar } from 'react-icons/fi';
import { MdAutoAwesome } from 'react-icons/md';
import { useTheme } from '@/stores/useThemeStore';
import { useAuthStore } from '@/stores/useAuthStore';
import { useFavoriteStore } from '@/stores/useFavoriteStore';
import { useToast } from '@/hooks/useToast';

const normalizeId = (id) => {
  if (id === undefined || id === null || id === '') return '';
  return String(id);
};

export default function PostThumbnail({ post, onPress, index = 0 }) {
  const { colors } = useTheme();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const favoritePosts = useFavoriteStore((s) => s.favoritePosts);
  const togglePostFavorite = useFavoriteStore((s) => s.togglePostFavorite);
  const { showToast } = useToast();

  const [isSaving, setIsSaving] = useState(false);

  if (!post) return null;

  const isMagazine = post.source === 'magazine';
  const hasDiscount = Number(post.discount) > 0;
  const media = Array.isArray(post.images) ? post.images : [];
  const firstImage = media[0] || 'https://picsum.photos/400/400?random=0';
  const rating = Number(post.rating) || 0;

  // ✅ PERF-03: فقط ۶ تصویر اول priority داشته باشند
  const shouldPrioritize = index < 6;

  const postId = normalizeId(post.id);
  const isSaved = postId
    ? favoritePosts.some((p) => normalizeId(p?.id) === postId)
    : false;

  const handleSaveClick = async (e) => {
    e.stopPropagation();
    e.preventDefault();

    if (!isAuthenticated || !post?.id || isSaving) return;

    setIsSaving(true);

    const postData = {
      id: post.id,
      caption: post.caption || '',
      businessName: post.businessName || '',
      businessLogo: post.businessLogo || null,
      businessBookingSlug:
        post.businessBookingSlug || post.businessId || post.id || null,
      images: Array.isArray(post.images) ? post.images : [],
      image: Array.isArray(post.images) && post.images[0] ? post.images[0] : null,
      source: post.source || 'business',
    };

    try {
      const newState = await togglePostFavorite(post.id, postData);
      showToast(
        newState ? 'به علاقه‌مندی‌ها اضافه شد' : 'از علاقه‌مندی‌ها حذف شد',
        'success'
      );
    } catch (error) {
      console.error('Toggle post favorite failed:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div
      onClick={() => onPress?.(post)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onPress?.(post);
        }
      }}
      role="button"
      tabIndex={0}
      className="relative block w-full aspect-square rounded-lg overflow-hidden group cursor-pointer"
      style={{
        backgroundColor: colors.cardBackground,
      }}
    >
      <Image
        src={firstImage}
        alt={post.businessName || 'نمونه‌کار'}
        fill
        priority={shouldPrioritize}
        sizes="(max-width: 768px) 33vw, 200px"
        className="object-cover group-hover:scale-105 transition-transform duration-300"
      />

      {/* تگ مجله */}
      {isMagazine && (
        <div
          className="absolute top-2 right-2 flex items-center gap-1
            px-2 py-1 rounded-md shadow-lg"
          style={{ backgroundColor: 'rgba(156, 39, 176, 0.85)' }}
        >
          <MdAutoAwesome size={10} color="#fff" />
          <span className="text-[9px] font-bold text-white">مجله</span>
        </div>
      )}

      {/* تگ تخفیف */}
      {hasDiscount && !isMagazine && (
        <div
          className="absolute top-2 right-2 px-2 py-1 rounded-md shadow-lg"
          style={{ backgroundColor: '#E53935' }}
        >
          <span className="text-[10px] font-bold text-white">{post.discount}٪</span>
        </div>
      )}

      {/* آیکون چندتصویری */}
      {media.length > 1 && (
        <div
          className="absolute top-2 right-2 p-1 rounded shadow-lg"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
        >
          <FiImage size={14} color="#fff" />
        </div>
      )}

      {/* ✅ دکمه ذخیره - فقط برای کاربران لاگین‌شده */}
      {isAuthenticated && (
        <button
          type="button"
          onClick={handleSaveClick}
          disabled={isSaving}
          className="absolute bottom-2 left-2 w-8 h-8 rounded-full
            flex items-center justify-center shadow-lg
            transition-all duration-200 hover:scale-110
            disabled:opacity-60 disabled:cursor-not-allowed"
          style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}
          aria-label={isSaved ? 'حذف از علاقه‌مندی' : 'افزودن به علاقه‌مندی'}
          aria-pressed={isSaved}
        >
          <FiBookmark
            size={16}
            color={isSaved ? '#FFD700' : '#fff'}
            fill={isSaved ? '#FFD700' : 'transparent'}
          />
        </button>
      )}

      {/* امتیاز - برای پست‌های کسب‌وکار */}
      {!isMagazine && rating > 0 && (
        <div
          className="absolute bottom-2 right-2 flex items-center gap-1
            px-2 py-1 rounded-md shadow-lg"
          style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
        >
          <FiStar size={10} color="#FFD700" fill="#FFD700" />
          <span className="text-[10px] font-bold text-white">{rating.toFixed(1)}</span>
        </div>
      )}
    </div>
  );
}