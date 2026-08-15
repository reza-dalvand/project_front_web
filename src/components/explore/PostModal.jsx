// src/components/explore/PostModal.jsx
'use client';
import { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useTheme } from '@/stores/useThemeStore';
import { useAuth } from '@/stores/useAuthStore';
import { useToast } from '@/hooks/useToast';
import GallerySlider from './GallerySlider';
import PostModalHeader from './post/PostModalHeader';
import PostBusinessInfo from './post/PostBusinessInfo';
import PostMagazineInfo from './post/PostMagazineInfo';
import PostRatingCard from './post/PostRatingCard';
import PostCaptionCard from './post/PostCaptionCard';
import PostFooterHint from './post/PostFooterHint';
import { acquireScrollLock, releaseScrollLock } from '@/utils/scrollLock';

export default function PostModal({ post, visible, onClose, onSave, onNavigateToProfile }) {
  const { colors } = useTheme();
  const { isAuthenticated, requireAuth } = useAuth();
  const [isSaved, setIsSaved] = useState(post?.saved || false);
  const [mounted, setMounted] = useState(false);
  const instanceId = useRef('post-modal');
  const { showToast } = useToast();

  useEffect(() => {
    setMounted(true);
    return () => {
      setMounted(false);
      releaseScrollLock(instanceId.current);
    };
  }, []);

  useEffect(() => {
    if (post) {
      setIsSaved(post.saved);
    }
  }, [post]);

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
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [visible, onClose]);

  if (!mounted || !visible || !post) return null;

  const isMagazine = post.source === 'magazine';
  const media = post.gallery || post.images || [];

  // ═══ اشتراک‌گذاری ═══
  const handleShare = async () => {
    const postUrl =
      typeof window !== 'undefined'
        ? `${window.location.origin}/post/${post.id}`
        : `https://zibano.app/post/${post.id}`;
    const shareMessage = [
      `🌟 ${post.businessName || 'زیبانو'}`,
      post.caption ? post.caption : '',
      '',
      `🔗 ${postUrl}`,
      '📱 مشاهده در اپلیکیشن زیبانو',
    ]
      .filter(Boolean)
      .join('\n');
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.businessName || 'زیبانو',
          text: post.caption || '',
          url: postUrl,
        });
        return;
      } catch (err) {
        if (err.name === 'AbortError') return;
        console.log('Web Share failed, trying clipboard...');
      }
    }
    try {
      await navigator.clipboard.writeText(shareMessage);
      showToast('✓ لینک و توضیحات پست کپی شد', 'success');
    } catch {
      showToast('امکان اشتراک‌گذاری وجود ندارد', 'error');
    }
  };

  const handleSave = () => {
    requireAuth(() => {
      const newState = !isSaved;
      setIsSaved(newState);
      onSave?.(post.id);
    });
  };

  const handleProfilePress = () => {
    onClose();
    setTimeout(() => {
      onNavigateToProfile?.(post.businessId);
    }, 300);
  };

  const handleBooking = () => {
    onClose();
    setTimeout(() => {
      onNavigateToProfile?.(post.businessId);
    }, 300);
  };

  const content = (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose?.();
      }}
    >
      <div
        className="relative w-full max-w-lg max-h-[90vh] rounded-3xl overflow-hidden
        flex flex-col shadow-2xl animate-in fade-in zoom-in-95 duration-300"
        style={{
          backgroundColor: colors.background,
          border: `1px solid ${colors.border}`,
        }}
      >
        {/* هدر */}
        <PostModalHeader
          isSaved={isSaved}
          onShare={handleShare}
          onSave={handleSave}
          onClose={onClose}
        />

        {/* گالری تصاویر */}
        <div className="w-full bg-black">
          <GallerySlider gallery={media} />
        </div>

        {/* محتوای اسکرولی */}
        <div className="flex-1 overflow-y-auto">
          {/* اطلاعات کسب‌وکار یا مجله */}
          {isMagazine ? (
            <PostMagazineInfo post={post} />
          ) : (
            <PostBusinessInfo
              post={post}
              onProfilePress={handleProfilePress}
              onBooking={handleBooking}
            />
          )}

          {/* امتیاز */}
          {!isMagazine && post.rating > 0 && <PostRatingCard rating={post.rating} />}

          {/* کپشن */}
          <PostCaptionCard caption={post.caption} isMagazine={isMagazine} />

          {/* راهنما */}
          <PostFooterHint isMagazine={isMagazine} />
        </div>
      </div>
    </div>
  );

  return createPortal(content, document.body);
}