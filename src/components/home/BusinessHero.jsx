"use client";

import { useState } from "react";
import { FiShare2, FiHeart, FiArrowRight, FiImage } from "react-icons/fi";
import Image from "next/image";
import { useTheme } from "@/stores/useThemeStore";
import { useAuth } from "@/stores/useAuth";
import { toPersianDigit } from "@/utils/numberUtils";

/**
 * 🏪 BusinessHero - هدر تصویری صفحه جزئیات کسب‌وکار
 *
 * @param {Array<string>} gallery - آرایه تصاویر گالری
 * @param {string} businessId - شناسه کسب‌وکار
 * @param {string} businessName - نام کسب‌وکار
 * @param {function} onBackPress - هندلر دکمه بازگشت
 * @param {boolean} isFavorite - آیا در علاقه‌مندی‌ها هست؟
 * @param {function} onFavoritePress - هندلر کلیک روی علاقه‌مندی
 */
export default function BusinessHero({
  gallery = [],
  businessId,
  businessName,
  onBackPress,
  isFavorite = false,
  onFavoritePress,
}) {
  const { colors } = useTheme();
  const { isAuthenticated, requireAuth } = useAuth();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showShareToast, setShowShareToast] = useState(false);

  const coverImage = gallery[0] || "https://picsum.photos/800/600?random=45";
  const hasMultipleImages = gallery.length > 1;

  // لینک رزرو اختصاصی
  const bookingLink = `https://zibano.app/book/${businessId || "biz_1"}`;

  // ═══════ هندلر اشتراک‌گذاری ═══════
  const handleShare = async () => {
    const shareMessage = `🌸 ${businessName || "سالن زیبایی"}
📱 با این لینک می‌توانید مستقیماً از من نوبت بگیرید:
${bookingLink}
✨ رزرو از اپلیکیشن زیبانو`;

    // استفاده از Web Share API در صورت پشتیبانی
    if (navigator.share) {
      try {
        await navigator.share({
          title: businessName || "رزرو نوبت",
          text: shareMessage,
          url: bookingLink,
        });
        return;
      } catch (err) {
        console.log("Share cancelled");
      }
    }

    // Fallback: کپی در کلیپ‌بورد
    try {
      await navigator.clipboard.writeText(shareMessage);
      setShowShareToast(true);
      setTimeout(() => setShowShareToast(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  // ═══════ هندلر علاقه‌مندی ═══════
  const handleFavorite = () => {
    if (!isAuthenticated) {
      requireAuth(() => {
        onFavoritePress?.();
      });
      return;
    }
    onFavoritePress?.();
  };

  // ═══════ هندلرهای ناوبری گالری ═══════
  const goToPrev = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };

  const goToNext = () => {
    if (currentIndex < gallery.length - 1) setCurrentIndex(currentIndex + 1);
  };

  const goToIndex = (index) => {
    setCurrentIndex(index);
  };

  return (
    <div className="relative w-full h-[320px] bg-black overflow-hidden">
      {/* ═══════ تصویر اصلی ═══════ */}
      {hasMultipleImages ? (
        <div className="relative w-full h-full">
          <Image
            src={gallery[currentIndex]}
            alt={businessName || "تصویر کسب‌وکار"}
            fill
            className="object-cover transition-opacity duration-300"
            sizes="100vw"
            priority
          />
        </div>
      ) : (
        <div className="relative w-full h-full">
          <Image
            src={coverImage}
            alt={businessName || "تصویر کسب‌وکار"}
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
        </div>
      )}

      {/* ═══════ گرادیان پایین ═══════ */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[120px] pointer-events-none"
        style={{ backgroundColor: "rgba(0,0,0,0.45)" }}
      />

      {/* ═══════ دکمه‌های بالا ═══════ */}
      <div className="absolute top-4 left-4 right-4 flex items-center gap-3 z-10">
        {/* دکمه بازگشت */}
        <button
          onClick={onBackPress}
          className="w-11 h-11 rounded-full flex items-center justify-center
                     border border-white/15 backdrop-blur-sm
                     transition-all hover:scale-110 active:scale-95"
          style={{ backgroundColor: "rgba(0,0,0,0.35)" }}
          aria-label="بازگشت"
        >
          <FiArrowRight size={22} color="#fff" />
        </button>

        <div className="flex-1" />

        {/* دکمه اشتراک‌گذاری */}
        <button
          onClick={handleShare}
          className="w-11 h-11 rounded-full flex items-center justify-center
                     border border-white/15 backdrop-blur-sm
                     transition-all hover:scale-110 active:scale-95"
          style={{ backgroundColor: "rgba(0,0,0,0.35)" }}
          aria-label="اشتراک‌گذاری"
        >
          <FiShare2 size={20} color="#fff" />
        </button>

        {/* دکمه علاقه‌مندی */}
        {isAuthenticated && (
          <button
            onClick={handleFavorite}
            className="w-11 h-11 rounded-full flex items-center justify-center
              border border-white/15 backdrop-blur-sm
              transition-all hover:scale-110 active:scale-95"
            style={{ backgroundColor: "rgba(0,0,0,0.35)" }}
            aria-label={isFavorite ? "حذف از علاقه‌مندی" : "افزودن به علاقه‌مندی"}
          >
            <FiHeart
              size={22}
              color={isFavorite ? "#FFD700" : "#fff"}
              fill={isFavorite ? "#FFD700" : "transparent"}
            />
          </button>
        )}
      </div>

      {/* ═══════ فلش‌های ناوبری گالری ═══════ */}
      {hasMultipleImages && currentIndex > 0 && (
        <button
          onClick={goToPrev}
          className="absolute top-1/2 -translate-y-1/2 right-3
                     w-12 h-12 rounded-full flex items-center justify-center
                     border border-white/25 backdrop-blur-sm
                     transition-all hover:scale-110 active:scale-95 z-10"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          aria-label="تصویر قبلی"
        >
          <FiArrowRight size={24} color="#fff" />
        </button>
      )}

      {hasMultipleImages && currentIndex < gallery.length - 1 && (
        <button
          onClick={goToNext}
          className="absolute top-1/2 -translate-y-1/2 left-3
                     w-12 h-12 rounded-full flex items-center justify-center
                     border border-white/25 backdrop-blur-sm
                     transition-all hover:scale-110 active:scale-95 z-10"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          aria-label="تصویر بعدی"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#fff"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
      )}

      {/* ═══════ Badge تعداد تصاویر ═══════ */}
      {hasMultipleImages && (
        <div
          className="absolute bottom-4 right-4 flex items-center gap-1.5
                     px-3 py-1.5 rounded-xl z-10"
          style={{ backgroundColor: "rgba(0,0,0,0.65)" }}
        >
          <FiImage size={13} color="#fff" />
          <span className="text-xs font-[Vazir-Bold] text-white" dir="rtl">
            {toPersianDigit(currentIndex + 1)} از{" "}
            {toPersianDigit(gallery.length)}
          </span>
        </div>
      )}

      {/* ═══════ Indicator Dots ═══════ */}
      {hasMultipleImages && (
        <div
          className="absolute bottom-4 left-1/2 -translate-x-1/2
                        flex items-center gap-1.5 z-10"
        >
          {gallery.map((_, i) => (
            <button
              key={i}
              onClick={() => goToIndex(i)}
              className="h-1.5 rounded-full transition-all duration-300"
              style={{
                backgroundColor:
                  i === currentIndex
                    ? "rgba(255,255,255,0.95)"
                    : "rgba(255,255,255,0.5)",
                width: i === currentIndex ? "20px" : "6px",
              }}
              aria-label={`رفتن به تصویر ${i + 1}`}
            />
          ))}
        </div>
      )}

      {/* ═══════ Toast کپی ═══════ */}
      {showShareToast && (
        <div
          className="absolute top-20 left-1/2 -translate-x-1/2
                     px-4 py-2.5 rounded-xl shadow-lg z-20
                     animate-in fade-in slide-in-from-top-4 duration-300"
          style={{ backgroundColor: "#4CAF50" }}
          dir="rtl"
        >
          <span className="text-sm font-[Vazir-Bold] text-white">
            ✓ لینک کپی شد
          </span>
        </div>
      )}
    </div>
  );
}
