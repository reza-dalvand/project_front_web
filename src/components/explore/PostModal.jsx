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

export default function PostModal({ post, visible, onClose, onNavigateToProfile, onBooking }) {
  const { colors } = useTheme();
  const { showToast } = useToast();

  const instanceId = useRef('portfolio-modal');

  const [mounted, setMounted] = useState(false);

  // =========================================================
  // Mount / Unmount
  // =========================================================

  useEffect(() => {
    setMounted(true);

    return () => {
      setMounted(false);
      releaseScrollLock(instanceId.current);
    };
  }, []);

  // =========================================================
  // Scroll Lock
  // =========================================================

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

  // =========================================================
  // ESC Key
  // =========================================================

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

  // =========================================================
  // Extract image URL
  // =========================================================

  const extractUrl = useCallback((img) => {
    if (typeof img === 'string' && img.length > 0) {
      return img;
    }

    if (img && typeof img === 'object') {
      return img.imageUrl || img.image_url || img.image || img.url || null;
    }

    return null;
  }, []);

  // =========================================================
  // Gallery
  //
  // IMPORTANT:
  // این Hook باید قبل از return شرطی اجرا شود.
  // =========================================================

  const gallery = useMemo(() => {
    if (!post) {
      return [];
    }

    const allImages = [
      ...(post.coverImage ? [extractUrl(post.coverImage)] : []),

      ...(Array.isArray(post.images) ? post.images.map(extractUrl) : []),
    ].filter(Boolean);

    // حذف تصاویر تکراری
    return [...new Set(allImages)];
  }, [post, extractUrl]);

  // =========================================================
  // Share
  // =========================================================

  const handleShare = useCallback(async () => {
    if (!post) return;

    const shareTitle = post.caption || post.title || 'نمونه‌کار بیو کلاب';

    const shareMessage = `🖼️ ${shareTitle}

🏪 ${post.businessName || ''}

📱 بیو کلاب | رزرو آنلاین خدمات زیبایی`;

    // Native Share
    if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareMessage,
          url: typeof window !== 'undefined' ? window.location.href : undefined,
        });

        return;
      } catch (err) {
        // کاربر Share را بسته است
        if (err?.name === 'AbortError') {
          return;
        }
      }
    }

    // Clipboard fallback
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

  // =========================================================
  // Navigate to Business Profile
  // =========================================================

  const handleNavigate = useCallback(() => {
    onClose?.();

    setTimeout(() => {
      onNavigateToProfile?.(post);
    }, 300);
  }, [onClose, onNavigateToProfile, post]);

  // =========================================================
  // Booking
  // =========================================================

  const handleBooking = useCallback(() => {
    onClose?.();

    setTimeout(() => {
      onBooking?.(post);
    }, 300);
  }, [onClose, onBooking, post]);

  // =========================================================
  // Conditional rendering
  //
  // این return باید بعد از تمام Hookها باشد.
  // =========================================================

  if (!mounted || !visible || !post) {
    return null;
  }

  // =========================================================
  // Business data
  // =========================================================

  const businessData = {
    businessName: post.businessName,
    businessLogo: post.businessLogo,
    businessOwnerPhoto: post.businessOwnerPhoto,

    // اولویت با slug
    // اگر slug نبود از businessId استفاده می‌کنیم
    businessBookingSlug: post.businessBookingSlug || post.businessId,
  };

  // =========================================================
  // Caption
  // =========================================================

  const caption = post.description || post.caption || '';

  // =========================================================
  // Render
  // =========================================================

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      style={{
        backgroundColor: 'rgba(0,0,0,0.75)',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose?.();
        }
      }}
    >
      <div
        className="
          relative
          w-full
          max-w-lg
          max-h-[92vh]
          rounded-3xl
          flex
          flex-col
          overflow-hidden
          shadow-2xl
        "
        style={{
          backgroundColor: colors.background,
          border: `1px solid ${colors.border}`,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* =====================================================
            Header
        ====================================================== */}

        <PostModalHeader onClose={onClose} onShare={handleShare} />

        {/* =====================================================
            Scrollable Content
        ====================================================== */}

        <div
          className="flex-1 overflow-y-auto"
          style={{
            minHeight: '0px',
          }}
        >
          {/* ===================================================
              Gallery
          ==================================================== */}

          {gallery.length > 0 && (
            <div className="w-full bg-black">
              <GallerySlider gallery={gallery} />
            </div>
          )}

          {/* ===================================================
              Business Information + Booking
          ==================================================== */}

          <PostBusinessInfo
            post={businessData}
            onProfilePress={handleNavigate}
            onBooking={handleBooking}
          />

          {/* ===================================================
              Caption / Description
          ==================================================== */}

          <PostCaptionCard caption={caption} isMagazine={post.source === 'magazine'} />

          {/* ===================================================
              Safe Area
          ==================================================== */}

          <div className="h-6 safe-bottom" />
        </div>
      </div>
    </div>,
    document.body
  );
}
