// src/components/explore/GallerySlider.jsx
'use client';
import { useState, useMemo, useRef } from 'react';
import Image from 'next/image';
import { FiChevronRight, FiChevronLeft } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import { toPersianDigit } from '@/utils/numberUtils';

export default function GallerySlider({ gallery = [] }) {
  const { colors } = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);
  const touchStartX = useRef(0);

  // ✅ FIX اصلی: حذف تصاویر تکراری
  // کاور معمولاً داخل images هم وجود دارد → بدون Set، تعداد غلط نشان داده می‌شود
  const images = useMemo(
    () => [...new Set((gallery || []).filter((g) => typeof g === 'string' && g.trim() !== ''))],
    [gallery]
  );

  // ✅ ایندکس ایمن — اگر لیست کوتاه شد، از محدوده خارج نشود
  const index = Math.min(currentIndex, Math.max(0, images.length - 1));

  const goPrev = () => {
    if (index > 0) setCurrentIndex(index - 1);
  };
  const goNext = () => {
    if (index < images.length - 1) setCurrentIndex(index + 1);
  };

  // ═══ Swipe ═══
  const onTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (diff > 50) goNext();
    else if (diff < -50) goPrev();
  };

  if (images.length === 0) return null;

  return (
    <div className="relative w-full" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
      {/* ═══ تصویر فعلی ═══ */}
      <div className="relative w-full aspect-square bg-black">
        <Image
          src={images[index]}
          alt={`تصویر ${index + 1}`}
          fill
          sizes="(max-width: 768px) 100vw, 512px"
          className="object-cover"
          priority={index === 0}
        />
      </div>

      {/* ✅ FIX: شمارنده — بالای تصویر، سمت چپ */}
      {images.length > 1 && (
        <div
          dir="ltr"
          className="absolute top-3 left-3 z-10 px-2.5 py-1.5 rounded-lg shadow-lg"
          style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
        >
          <span className="text-[11px] font-bold text-white">
            {toPersianDigit(index + 1)} / {toPersianDigit(images.length)}
          </span>
        </div>
      )}

      {/* ═══ فلش قبلی (سمت راست) ═══ */}
      {images.length > 1 && index > 0 && (
        <button
          onClick={goPrev}
          className="absolute top-1/2 -translate-y-1/2 right-3 z-10 w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
          aria-label="تصویر قبلی"
        >
          <FiChevronRight size={22} color="#fff" />
        </button>
      )}

      {/* ═══ فلش بعدی (سمت چپ) ═══ */}
      {images.length > 1 && index < images.length - 1 && (
        <button
          onClick={goNext}
          className="absolute top-1/2 -translate-y-1/2 left-3 z-10 w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
          aria-label="تصویر بعدی"
        >
          <FiChevronLeft size={22} color="#fff" />
        </button>
      )}
    </div>
  );
}
