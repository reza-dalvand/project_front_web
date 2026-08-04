'use client';
import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import { createPortal } from 'react-dom';
import { FiX, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import { acquireScrollLock, releaseScrollLock } from '@/utils/scrollLock';

export default function PortfolioModal({ visible, onClose, portfolio }) {
  const { colors } = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [mounted, setMounted] = useState(false);
  const instanceId = useRef('portfolio-modal');

  useEffect(() => {
    setMounted(true);
    return () => {
      setMounted(false);
      releaseScrollLock(instanceId.current);
    };
  }, []);

  useEffect(() => {
    setCurrentIndex(0);
  }, [portfolio, visible]);

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

  // بستن با Escape
  useEffect(() => {
    if (!visible) return;
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [visible, onClose]);

  if (!mounted || !visible || !portfolio) return null;

  const images = portfolio.images || [portfolio.coverImage];

  const goToPrev = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };

  const goToNext = () => {
    if (currentIndex < images.length - 1) setCurrentIndex(currentIndex + 1);
  };

  const content = (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.75)' }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl h-[80vh] rounded-3xl overflow-hidden shadow-2xl"
        style={{ backgroundColor: '#000' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* دکمه بستن */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 z-20 w-11 h-11 rounded-full
          flex items-center justify-center transition-transform hover:scale-110"
          style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
        >
          <FiX size={22} color="#fff" />
        </button>

        {/* تصویر اصلی */}
        <div className="relative w-full h-[60%]">
          <Image
            src={images[currentIndex]}
            alt={portfolio.title || 'portfolio'}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 800px"
            priority
          />

          {/* دکمه‌های ناوبری */}
          {images.length > 1 && currentIndex > 0 && (
            <button
              onClick={goToPrev}
              className="absolute top-1/2 -translate-y-1/2 right-3 w-12 h-12
              rounded-full flex items-center justify-center
              transition-transform hover:scale-110"
              style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
            >
              <FiChevronRight size={28} color="#fff" />
            </button>
          )}

          {images.length > 1 && currentIndex < images.length - 1 && (
            <button
              onClick={goToNext}
              className="absolute top-1/2 -translate-y-1/2 left-3 w-12 h-12
              rounded-full flex items-center justify-center
              transition-transform hover:scale-110"
              style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
            >
              <FiChevronLeft size={28} color="#fff" />
            </button>
          )}

          {/* شمارنده تصاویر */}
          {images.length > 1 && (
            <div
              className="absolute top-4 right-4 flex items-center gap-1.5
              px-3 py-1.5 rounded-xl"
              style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
            >
              <span className="text-xs font-[Vazir-Bold] text-white">
                {currentIndex + 1} / {images.length}
              </span>
            </div>
          )}
        </div>

        {/* محتوای پایین */}
        <div
          className="h-[40%] overflow-y-auto p-5 flex flex-col gap-4"
          style={{ backgroundColor: colors.background }}
        >
          {/* عنوان */}
          {portfolio.title && (
            <div>
              <h3
                className="text-lg font-[Vazir-Bold] mb-2"
                style={{ color: colors.textMain }}
              >
                {portfolio.title}
              </h3>
            </div>
          )}

          {/* توضیحات */}
          {portfolio.description ? (
            <p
              className="text-sm leading-6 text-justify"
              style={{ color: colors.textSecondary }}
            >
              {portfolio.description}
            </p>
          ) : (
            <p
              className="text-sm italic"
              style={{ color: colors.textSecondary }}
            >
              توضیحاتی برای این نمونه‌کار ثبت نشده است
            </p>
          )}
        </div>

        {/* Indicator Dots */}
        {images.length > 1 && (
          <div
            className="absolute bottom-[40%] left-1/2 -translate-x-1/2
            flex items-center gap-1.5 py-3 z-10"
          >
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className="h-1.5 rounded-full transition-all duration-300"
                style={{
                  backgroundColor:
                    i === currentIndex ? colors.primary : colors.border,
                  width: i === currentIndex ? '20px' : '6px',
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );

  return createPortal(content, document.body);
}