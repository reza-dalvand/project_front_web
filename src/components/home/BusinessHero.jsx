// src/components/home/BusinessHero.jsx
'use client';
import { useState } from 'react';
import { FiShare2, FiBookmark, FiArrowRight } from 'react-icons/fi';
import Image from 'next/image';
import { useTheme } from '@/stores/useThemeStore';
import { useAuth } from '@/stores/useAuthStore';
import { useToast } from '@/hooks/useToast';

// ✅ fallback ثابت — نه random! هر بار یک تصویر ثابت نمایش می‌دهد
const FALLBACK_COVER = '/images/placeholder-cover.jpg';

/**
 * 🏪 BusinessHero - هدر تصویری صفحه جزئیات کسب‌وکار
 *
 * ✅ فاز ۵: لوگو و کاور مستقیماً از API خوانده می‌شوند
 */
export default function BusinessHero({
  gallery = [],
  coverUrl, // ✅ جدید: URL کاور از API
  logo, // ✅ جدید: URL لوگو از API
  businessId,
  businessName,
  onBackPress,
  isFavorite = false,
  onFavoritePress,
  ownerPhoto,
}) {
  const { colors } = useTheme();
  const { isAuthenticated, requireAuth } = useAuth();
  const { showToast } = useToast();
  const [showShareToast, setShowShareToast] = useState(false);

  // ✅ اولویت: coverUrl از API → gallery[0] → fallback ثابت
  const coverImage = coverUrl || gallery[0] || FALLBACK_COVER;

  // لینک رزرو اختصاصی
  const bookingLink = `https://beauclub.ir/book/${businessId || 'biz_1'}`;

  // ═══════ هندلر اشتراک‌گذاری ═══════
  const handleShare = async () => {
    const shareMessage = `🌸 ${businessName || 'سالن زیبایی'}
📱 با این لینک می‌توانید مستقیماً از من نوبت بگیرید:
${bookingLink}
✨ رزرو از اپلیکیشن بیو کلاب`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: businessName || 'رزرو نوبت',
          text: shareMessage,
          url: bookingLink,
        });
        return;
      } catch (err) {
        console.log('Share cancelled or failed');
      }
    }

    try {
      let copied = false;
      if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
        await navigator.clipboard.writeText(shareMessage);
        copied = true;
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = shareMessage;
        textarea.style.position = 'fixed';
        textarea.style.top = '0';
        textarea.style.left = '0';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        copied = document.execCommand('copy');
        document.body.removeChild(textarea);
      }

      if (copied) {
        setShowShareToast(true);
        showToast('✓ لینک کپی شد', 'success');
        setTimeout(() => setShowShareToast(false), 2000);
      } else {
        showToast('امکان کپی کردن لینک وجود ندارد', 'error');
      }
    } catch (err) {
      console.error('Failed to copy:', err);
      showToast('خطا در کپی کردن لینک', 'error');
    }
  };

  // ═══════ هندلر ذخیره (علاقه‌مندی) ═══════
  const handleFavorite = () => {
    if (!isAuthenticated) {
      requireAuth(() => {
        onFavoritePress?.();
      });
      return;
    }
    onFavoritePress?.();
  };

  return (
    <div className="relative w-full h-[320px] bg-black overflow-hidden">
      {/* ═══════ تصویر کاور از API ═══════ */}
      <div className="relative w-full h-full">
        <Image
          src={coverImage}
          alt={businessName || 'تصویر کسب‌وکار'}
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
      </div>

      {/* ═══════ لوگو کسب‌وکار (از API) ═══════ */}
      {/* {ownerPhoto && (
        <div
          className="absolute bottom-4 right-4 w-16 h-16 rounded-2xl overflow-hidden border-[3px] shadow-lg z-10"
          style={{ borderColor: '#fff' }}
        >
          <Image
            src={ownerPhoto}
            alt={`لوگوی ${businessName || 'کسب‌وکار'}`}
            width={64}
            height={64}
            className="w-full h-full object-cover"
          />
        </div>
      )} */}

      {/* ═══════ گرادیان پایین ═══════ */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[120px] pointer-events-none"
        style={{ backgroundColor: 'rgba(0,0,0,0.45)' }}
      />

      {/* ═══════ دکمه‌های بالا ═══════ */}
      <div className="absolute top-4 left-4 right-4 flex items-center gap-3 z-10">
        <button
          onClick={onBackPress}
          className="w-11 h-11 rounded-full flex items-center justify-center
            border border-white/15 backdrop-blur-sm
            transition-all hover:scale-110 active:scale-95"
          style={{ backgroundColor: 'rgba(0,0,0,0.35)' }}
          aria-label="بازگشت"
        >
          <FiArrowRight size={22} color="#fff" />
        </button>

        <div className="flex-1" />

        <button
          onClick={handleShare}
          className="w-11 h-11 rounded-full flex items-center justify-center
            border border-white/15 backdrop-blur-sm
            transition-all hover:scale-110 active:scale-95"
          style={{ backgroundColor: 'rgba(0,0,0,0.35)' }}
          aria-label="اشتراک‌گذاری"
        >
          <FiShare2 size={20} color="#fff" />
        </button>

        <button
          onClick={handleFavorite}
          className="w-11 h-11 rounded-full flex items-center justify-center
            border border-white/15 backdrop-blur-sm
            transition-all hover:scale-110 active:scale-95"
          style={{ backgroundColor: 'rgba(0,0,0,0.35)' }}
          aria-label={isFavorite ? 'حذف از ذخیره‌ها' : 'افزودن به ذخیره‌ها'}
        >
          <FiBookmark
            size={22}
            color={isFavorite ? '#FFD700' : '#fff'}
            fill={isFavorite ? '#FFD700' : 'transparent'}
          />
        </button>
      </div>

      {/* ═══════ Toast کپی شدن لینک ═══════ */}
      {showShareToast && (
        <div
          className="absolute top-20 left-1/2 -translate-x-1/2
            px-4 py-2.5 rounded-xl shadow-lg z-20
            animate-in fade-in slide-in-from-top-4 duration-300"
          style={{ backgroundColor: '#4CAF50' }}
          dir="rtl"
        >
          <span className="text-sm font-[Vazir-Bold] text-white">✓ لینک کپی شد</span>
        </div>
      )}
    </div>
  );
}
