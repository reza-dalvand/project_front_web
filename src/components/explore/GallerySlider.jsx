'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import useEmblaCarousel from 'embla-carousel-react';
import { FiChevronRight, FiChevronLeft } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';

export default function GallerySlider({ gallery = [] }) {
  const { colors } = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    align: 'start',
    skipSnaps: false,
  });

  // ردیابی اسلاید فعال
  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => {
      setCurrentIndex(emblaApi.selectedScrollSnap());
    };

    emblaApi.on('select', onSelect);
    return () => emblaApi.off('select', onSelect);
  }, [emblaApi]);

  if (!gallery || gallery.length === 0) return null;

  return (
    <div className="relative w-full">
      {/* Slider */}
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {gallery.map((img, index) => (
            <div key={index} className="flex-[0_0_100%] min-w-0 relative aspect-square">
              <Image
                src={img}
                alt={`gallery-${index}`}
                fill
                sizes="100vw"
                className="object-cover"
                priority={index === 0}
              />
            </div>
          ))}
        </div>
      </div>

      {/* دکمه‌های قبلی/بعدی - فقط برای چند تصویر */}
      {gallery.length > 1 && (
        <>
          {currentIndex > 0 && (
            <button
              onClick={() => emblaApi?.scrollPrev()}
              className="absolute top-1/2 -translate-y-1/2 right-3 
                         w-10 h-10 rounded-full flex items-center justify-center
                         shadow-lg transition-all hover:scale-110"
              style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
            >
              <FiChevronRight size={22} color="#fff" />
            </button>
          )}
          {currentIndex < gallery.length - 1 && (
            <button
              onClick={() => emblaApi?.scrollNext()}
              className="absolute top-1/2 -translate-y-1/2 left-3 
                         w-10 h-10 rounded-full flex items-center justify-center
                         shadow-lg transition-all hover:scale-110"
              style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
            >
              <FiChevronLeft size={22} color="#fff" />
            </button>
          )}
        </>
      )}

      {/* Indicator Dots */}
      {gallery.length > 1 && (
        <div className="flex items-center justify-center gap-1.5 py-3" dir="ltr">
          {gallery.map((_, i) => (
            <button
              key={i}
              onClick={() => emblaApi?.scrollTo(i)}
              className="h-1.5 rounded-full transition-all duration-300"
              style={{
                backgroundColor: i === currentIndex ? colors.primary : colors.border,
                width: i === currentIndex ? '20px' : '6px',
              }}
            />
          ))}
        </div>
      )}

      {/* شمارنده تصاویر */}
      {gallery.length > 1 && (
        <div
          className="absolute top-3 right-3 flex items-center gap-1.5 
                     px-2.5 py-1.5 rounded-lg shadow-lg"
          style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
        >
          <span className="text-[11px] font-bold text-white">
            {gallery.length} / {currentIndex + 1}
          </span>
        </div>
      )}
    </div>
  );
}
