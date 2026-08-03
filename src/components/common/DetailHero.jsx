'use client';

import { useState } from 'react';
import Image from 'next/image';
import { FiArrowRight, FiHeart, FiBookmark } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';

export default function DetailHero({
  imageUrl,
  images = [],
  onBack,
  onSave,
  isSaved = false,
  badges = [],
}) {
  const { colors } = useTheme();
  const [currentImage, setCurrentImage] = useState(0);
  
  const displayImages = images.length > 0 ? images : [imageUrl];

  return (
    <div className="relative w-full h-[320px] bg-black overflow-hidden">
      {/* تصویر اصلی */}
      <Image
        src={displayImages[currentImage]}
        alt="hero"
        fill
        className="object-cover"
        priority
        sizes="100vw"
      />

      {/* گرادیان پایین */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[120px]"
        style={{ backgroundColor: 'rgba(0,0,0,0.45)' }}
      />

      {/* دکمه‌های بالا */}
      <div className="absolute top-4 left-4 right-4 flex items-center gap-3 z-10">
        <button
          onClick={onBack}
          className="w-11 h-11 rounded-full flex items-center justify-center
                     border border-white/15 transition-transform hover:scale-105"
          style={{ backgroundColor: 'rgba(0,0,0,0.35)' }}
        >
          <FiArrowRight size={22} color="#fff" />
        </button>

        <div className="flex-1" />

        {onSave && (
          <button
            onClick={onSave}
            className="w-11 h-11 rounded-full flex items-center justify-center
                       border border-white/15 transition-transform hover:scale-110"
            style={{ backgroundColor: 'rgba(0,0,0,0.35)' }}
          >
            <FiBookmark
              size={20}
              color={isSaved ? '#FFD700' : '#fff'}
              fill={isSaved ? '#FFD700' : 'transparent'}
            />
          </button>
        )}
      </div>

      {/* بج‌های پایین */}
      {badges.length > 0 && (
        <div className="absolute bottom-4 left-4 right-4 flex items-center gap-2 flex-wrap">
          {badges.map((badge, i) => (
            <div
              key={i}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl"
              style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
            >
              {badge.icon && (
                <span className="text-sm">{badge.icon}</span>
              )}
              {badge.text && (
                <span className="text-xs font-[Vazir-Bold] text-white">
                  {badge.text}
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Indicator تصاویر */}
      {displayImages.length > 1 && (
        <div className="absolute bottom-4 right-4 flex items-center gap-1.5
                        px-2.5 py-1.5 rounded-lg"
             style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}>
          <span className="text-xs font-[Vazir-Bold] text-white">
            {currentImage + 1} / {displayImages.length}
          </span>
        </div>
      )}
    </div>
  );
}