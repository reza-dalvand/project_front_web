'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { FiCalendar } from 'react-icons/fi';
import useEmblaCarousel from 'embla-carousel-react';
import { useTheme } from '@/stores/useThemeStore';

export default function AdSlider({ ads = [], onPress, autoPlayInterval = 4000 }) {
  const { colors } = useTheme();
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setActiveIndex(emblaApi.selectedScrollSnap());
    emblaApi.on('select', onSelect);
    return () => emblaApi.off('select', onSelect);
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi || ads.length <= 1) return;
    const interval = setInterval(() => emblaApi.scrollNext(), autoPlayInterval);
    return () => clearInterval(interval);
  }, [emblaApi, ads.length, autoPlayInterval]);

  if (!ads || ads.length === 0) return null;

  return (
    <div className="relative">
      <div className="overflow-hidden rounded-3xl" ref={emblaRef}>
        <div className="flex">
          {ads.map((ad) => (
            <div
              key={ad.id}
              className="flex-[0_0_100%] min-w-0 relative h-[220px] cursor-pointer group"
              onClick={() => onPress?.(ad)}
            >
              <Image
                src={ad.imageUrl}
                alt={ad.title}
                fill
                className="object-cover rounded-3xl"
                sizes="(max-width: 768px) 100vw, 768px"
              />
              <div className="absolute bottom-0 left-0 right-0 h-[62%] rounded-b-3xl pointer-events-none"
                   style={{ backgroundColor: 'rgba(0,0,0,0.30)' }} />
              
              <div className="absolute bottom-0 left-0 right-0 p-5 flex flex-col gap-2">
                <h3 className="text-[18px] font-[Vazir-Bold] text-white leading-6 line-clamp-2 drop-shadow-lg">
                  {ad.title}
                </h3>
                {ad.subtitle && (
                  <p className="text-[13px] font-[Vazir] text-white/92 line-clamp-1">{ad.subtitle}</p>
                )}
                <button
                  onClick={(e) => { e.stopPropagation(); onPress?.(ad); }}
                  className="flex items-center gap-1.5 self-start bg-[#43A047] px-4 py-2.5 rounded-xl shadow-md hover:shadow-lg transition-shadow"
                >
                  <FiCalendar size={14} color="#fff" />
                  <span className="text-[13px] font-[Vazir-Bold] text-white">رزرو نوبت</span>
                </button>
              </div>

              {ad.badge && (
                <div className="absolute top-3 left-3 bg-[#E53935] px-2.5 py-1 rounded-lg shadow-md">
                  <span className="text-[11px] font-[Vazir-Bold] text-white">{ad.badge}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-center gap-1.5 mt-4">
        {ads.map((_, i) => (
          <button
            key={i}
            onClick={() => emblaApi?.scrollTo(i)}
            className="h-2 rounded-full transition-all duration-300"
            style={{
              backgroundColor: i === activeIndex ? colors.primary : colors.border,
              width: i === activeIndex ? '24px' : '8px',
            }}
          />
        ))}
      </div>
    </div>
  );
}