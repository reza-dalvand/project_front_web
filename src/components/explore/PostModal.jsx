// src/components/explore/PostModal.jsx
'use client';
import { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useTheme } from '@/stores/useThemeStore';
import { useToast } from '@/hooks/useToast';
import GallerySlider from './GallerySlider';
import PostModalHeader from './post/PostModalHeader';
import PostBusinessInfo from './post/PostBusinessInfo';
import PostCaptionCard from './post/PostCaptionCard';
import { acquireScrollLock, releaseScrollLock } from '@/utils/scrollLock';

export default function PostModal({
  post,
  visible,
  onClose,
  onNavigateToProfile,
  onBooking, // ✅ FIX: پروپ جدید برای دکمه رزرو
}) {
  const { colors } = useTheme();
  const { showToast } = useToast();
  const instanceId = useRef('portfolio-modal');

  // ✅ FIX: تعریف state قبل از همه useEffect‌ها (قبلاً بعد بود → خطای ران‌تایم)
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
    return () => releaseScrollLock(instanceId.current);
  }, [visible]);

  useEffect(() => {
    if (!visible) return;
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [visible, onClose]);

  if (!mounted || !visible || !post) return null;

  // استخراج تصاویر: اول کاور، بعد گالری
  const gallery = [
    ...(post.coverImage ? [post.coverImage] : []),
    ...(post.images || []),
  ];

  const handleShare = async () => {
    const shareMessage = `🖼️ ${post.caption || 'نمونه‌کار'}
🏪 ${post.businessName || ''}
📱 بیو کلاب`;
    if (navigator.share) {
      try {
        await navigator.share({ title: post.caption, text: shareMessage });
        return;
      } catch {}
    }
    try {
      await navigator.clipboard.writeText(shareMessage);
      showToast('لینک کپی شد', 'success');
    } catch {
      showToast('امکان کپی وجود ندارد', 'error');
    }
  };

  const handleNavigate = () => {
    onClose();
    setTimeout(() => {
      onNavigateToProfile?.(post);
    }, 300);
  };

  // ✅ FIX: هندلر دکمه رزرو
  const handleBooking = () => {
    onClose();
    setTimeout(() => {
      onBooking?.(post);
    }, 300);
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="relative w-full max-w-lg max-h-[90vh] rounded-3xl overflow-hidden flex flex-col"
        style={{ backgroundColor: colors.background }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* هدر — چسبیده به بالا */}
        <PostModalHeader onClose={onClose} onShare={handleShare} />

        {/* ✅ FIX: کانتینر اسکرول‌پذیر برای تمام محتوای زیر هدر */}
        <div className="flex-1 overflow-y-auto min-h-0">
          {/* گالری تصاویر */}
          {gallery.length > 0 && (
            <div className="w-full bg-black">
              <GallerySlider gallery={gallery} />
            </div>
          )}

          {/* اطلاعات کسب‌وکار + دکمه رزرو */}
          <PostBusinessInfo
            post={{
              businessName: post.businessName,
              businessLogo: post.businessLogo,
              businessBookingSlug: post.businessBookingSlug,
            }}
            onProfilePress={handleNavigate}
            onBooking={handleBooking}
          />

          {/* کپشن / توضیحات نمونه‌کار */}
          <PostCaptionCard
            caption={post.description || post.caption || ''}
            isMagazine={false}
          />
        </div>
      </div>
    </div>,
    document.body
  );
}