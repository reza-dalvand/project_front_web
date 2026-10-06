// src/components/explore/PostModal.jsx
'use client';

import { useEffect, useState, useRef, useMemo, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useTheme } from '@/stores/useThemeStore';
import { useToast } from '@/hooks/useToast';
import GallerySlider from './GallerySlider';
import PostModalHeader from './post/PostModalHeader';
import PostBusinessInfo from './post/PostBusinessInfo';
import PostCaptionCard from './post/PostCaptionCard';
import { acquireScrollLock, releaseScrollLock } from '@/utils/scrollLock';
import { useFavoriteStore } from '@/stores/useFavoriteStore';
import { useAuth } from '@/stores/useAuthStore';

export default function PostModal({ post, visible, onClose, onNavigateToProfile, onBooking }) {
  const { colors } = useTheme();
  const { showToast } = useToast();
  const { isAuthenticated, requireAuth } = useAuth();
  const togglePostFavorite = useFavoriteStore((s) => s.togglePostFavorite);
  
  // ✅ FIX باگ ۱۰: Subscribe روی آرایه برای Reactivity به جای صدا زدن متد
  const favoritePosts = useFavoriteStore((s) => s.favoritePosts);
  const isSaved = post?.id ? favoritePosts.some((p) => p.id === post.id) : false;

  const instanceId = useRef('portfolio-modal');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => {
      setMounted(false);
      releaseScrollLock(instanceId.current);
    };
  }, []);

  useEffect(() => {
    if (visible) {
      acquireScrollLock(instanceId.current);
    } else {
      releaseScrollLock(instanceId.current);
    }
    return () => {
      releaseScrollLock(instanceId.current);
    };
  }, [visible]);

  useEffect(() => {
    if (!visible) return;
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        onClose?.();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [visible, onClose]);

  const extractUrl = useCallback((img) => {
    if (typeof img === 'string' && img.length > 0) return img;
    if (img && typeof img === 'object') {
      return img.imageUrl || img.image_url || img.image || img.url || null;
    }
    return null;
  }, []);

  const gallery = useMemo(() => {
    if (!post) return [];
    const imagesList = [];
    if (Array.isArray(post.images)) {
      for (const img of post.images) {
        const url = extractUrl(img);
        if (url && !imagesList.includes(url)) imagesList.push(url);
      }
    }
    return imagesList;
  }, [post, extractUrl]);

  const handleSave = useCallback(async () => {
    if (!post?.id) return;

    if (!isAuthenticated) {
      requireAuth();
      return;
    }

    try {
      const postData = {
        id: post.id,
        caption: post.caption || post.title || '',
        businessName: post.businessName || '',
        businessLogo: post.businessLogo || null,
        businessBookingSlug: post.businessBookingSlug || post.businessId || post.id,
        images: post.images || [],
        image: gallery[0] || null,
        source: post.source || 'business',
      };

      const newState = await togglePostFavorite(post.id, postData);
      showToast(newState ? 'به علاقه‌مندی‌ها اضافه شد' : 'از علاقه‌مندی‌ها حذف شد', 'success');
    } catch (error) {
      console.error('Toggle favorite failed:', error);
      showToast('خطا در ذخیره علاقه‌مندی', 'error');
    }
  }, [post, isAuthenticated, requireAuth, togglePostFavorite, showToast, gallery]);

  const handleShare = useCallback(async () => {
    if (!post) return;
    const shareTitle = post.caption || post.title || 'نمونه‌کار بیو کلاب';
    const shareMessage = `🖼️ ${shareTitle}\n\n🏪 ${post.businessName || ''}\n\n📱 بیو کلاب | رزرو آنلاین خدمات زیبایی`;

    if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareMessage,
          url: typeof window !== 'undefined' ? window.location.href : undefined,
        });
        return;
      } catch (err) {
        if (err?.name === 'AbortError') return;
      }
    }

    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(shareMessage);
        showToast('لینک و توضیحات کپی شد', 'success');
      } else {
        showToast('امکان کپی وجود ندارد', 'error');
      }
    } catch {
      showToast('امکان کپی وجود ندارد', 'error');
    }
  }, [post, showToast]);

  const handleNavigate = useCallback(() => {
    onClose?.();
    setTimeout(() => onNavigateToProfile?.(post), 300);
  }, [onClose, onNavigateToProfile, post]);

  const handleBooking = useCallback(() => {
    onClose?.();
    setTimeout(() => onBooking?.(post), 300);
  }, [onClose, onBooking, post]);

  // ✅ Memoize برای جلوگیری از Render اضافه
  const businessData = useMemo(() => ({
    businessName: post?.businessName,
    businessLogo: post?.businessLogo,
    businessOwnerPhoto: post?.businessOwnerPhoto,
    businessBookingSlug: post?.businessBookingSlug || post?.businessId,
  }), [post]);

  if (!mounted || !visible || !post) return null;

  const caption = post.description || post.caption || '';

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.75)' }}
      onClick={(e) => e.target === e.currentTarget && onClose?.()}
    >
      <div
        className="relative w-full max-w-lg max-h-[92vh] rounded-3xl flex flex-col overflow-hidden shadow-2xl"
        style={{ backgroundColor: colors.background, border: `1px solid ${colors.border}` }}
        onClick={(e) => e.stopPropagation()}
      >
        <PostModalHeader onClose={onClose} onShare={handleShare} onSave={handleSave} isSaved={isSaved} />

        <div className="flex-1 overflow-y-auto" style={{ minHeight: '0px' }}>
          {gallery.length > 0 && (
            <div className="w-full bg-black">
              <GallerySlider gallery={gallery} />
            </div>
          )}
          <PostBusinessInfo post={businessData} onProfilePress={handleNavigate} onBooking={handleBooking} />
          <PostCaptionCard caption={caption} isMagazine={post.source === 'magazine'} />
          <div className="h-6 safe-bottom" />
        </div>
      </div>
    </div>,
    document.body
  );
}