// src/components/home/AdSlider.jsx
'use client';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { FiCalendar } from 'react-icons/fi';
import useEmblaCarousel from 'embla-carousel-react';
import { useTheme } from '@/stores/useThemeStore';

export default function AdSlider({ ads = [], onPress, autoPlayInterval = 4000 }) {
  const { colors } = useTheme();
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [activeIndex, setActiveIndex] = useState(0);

  // ✅ FIX (فاز ۴): تشخیص visibility اسلایدر
  const [isInView, setIsInView] = useState(true);
  const sliderRef = useRef(null);

  useEffect(() => {
    if (!sliderRef.current) return;
    const observer = new IntersectionObserver(([entry]) => setIsInView(entry.isIntersecting), {
      threshold: 0.1,
    });
    observer.observe(sliderRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setActiveIndex(emblaApi.selectedScrollSnap());
    emblaApi.on('select', onSelect);
    return () => emblaApi.off('select', onSelect);
  }, [emblaApi]);

  // ✅ FIX (فاز ۴): Auto-play فقط وقتی visible است
  useEffect(() => {
    if (!emblaApi || ads.length <= 1 || !isInView) return;
    const interval = setInterval(() => emblaApi.scrollNext(), autoPlayInterval);
    return () => clearInterval(interval);
  }, [emblaApi, ads.length, autoPlayInterval, isInView]);

  if (!ads || ads.length === 0) return null;

  return (
    <div className="relative" ref={sliderRef}>
      <div className="overflow-hidden rounded-2xl sm:rounded-3xl md:rounded-[28px] lg:rounded-[32px]" ref={emblaRef}>
        <div className="flex">
          {ads.map((ad) => (
            <div
              key={ad.id}
              className="flex-[0_0_100%] min-w-0 relative h-[200px] sm:h-[220px] md:h-[280px] lg:h-[340px] xl:h-[380px] cursor-pointer group"
              onClick={() => onPress?.(ad)}
            >
              <Image
                src={ad.imageUrl}
                alt={ad.title}
                fill
                className="object-cover rounded-2xl sm:rounded-3xl md:rounded-[28px] lg:rounded-[32px]"
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 100vw, (max-width: 1024px) 768px, 1024px"
              />
              <div
                className="absolute bottom-0 left-0 right-0 h-[55%] sm:h-[58%] md:h-[60%] rounded-b-2xl sm:rounded-b-3xl md:rounded-b-[28px] lg:rounded-b-[32px] pointer-events-none"
                style={{ backgroundColor: 'rgba(0,0,0,0.30)' }}
              />
              <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 md:p-6 lg:p-8 flex flex-col gap-1.5 sm:gap-2 md:gap-3">
                <h3 className="text-[16px] sm:text-[18px] md:text-xl lg:text-2xl font-[Vazir-Bold] text-white leading-6 md:leading-7 lg:leading-8 line-clamp-2 drop-shadow-lg">
                  {ad.title}
                </h3>
                {ad.subtitle && (
                  <p className="text-[12px] sm:text-[13px] md:text-sm lg:text-base font-[Vazir] text-white/92 line-clamp-1">
                    {ad.subtitle}
                  </p>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onPress?.(ad);
                  }}
                  className="flex items-center gap-1.5 sm:gap-2 self-start bg-[#43A047] px-3.5 sm:px-4 md:px-5 py-2 sm:py-2.5 md:py-3 rounded-lg sm:rounded-xl md:rounded-2xl shadow-md hover:shadow-lg transition-shadow"
                >
                  <FiCalendar size={14} className="sm:w-4 sm:h-4 md:w-[18px] md:h-[18px]" color="#fff" />
                  <span className="text-[12px] sm:text-[13px] md:text-sm font-[Vazir-Bold] text-white">رزرو نوبت</span>
                </button>
              </div>
              {ad.badge && (
                <div className="absolute top-3 right-3 md:top-4 md:right-4 bg-[#E53935] px-2 sm:px-2.5 md:px-3 py-1 md:py-1.5 rounded-lg md:rounded-xl shadow-md">
                  <span className="text-[10px] sm:text-[11px] md:text-xs font-[Vazir-Bold] text-white">{ad.badge}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      {/* ═══ Dots ═══ */}
      <div className="flex items-center justify-center gap-1.5 sm:gap-2 mt-3 sm:mt-4 md:mt-5">
        {ads.map((_, i) => (
          <button
            key={i}
            onClick={() => emblaApi?.scrollTo(i)}
            className="h-1.5 sm:h-2 md:h-2.5 rounded-full transition-all duration-300"
            style={{
              backgroundColor: i === activeIndex ? colors.primary : colors.border,
              width: i === activeIndex ? '20px' : '7px',
            }}
          />
        ))}
      </div>
    </div>
  );
}