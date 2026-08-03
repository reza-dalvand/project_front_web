'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { FiX } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';

/**
 * کامپوننت BottomSheet - پنل پایین صفحه
 *
 * @param {boolean} visible - وضعیت نمایش
 * @param {function} onClose - تابع بستن
 * @param {string} title - عنوان (اختیاری)
 * @param {React.ReactNode} children - محتوای اصلی
 * @param {React.ReactNode} footer - فوتر (اختیاری)
 * @param {number} snapPoint - ارتفاع پنل (0 تا 1)
 */
export default function BottomSheet({
  visible,
  onClose,
  title,
  children,
  footer,
  snapPoint = 0.7,
}) {
  const { colors } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [animating, setAnimating] = useState(false);
  const [show, setShow] = useState(false);
  const sheetRef = useRef(null);
  const dragStartY = useRef(0);
  const currentTranslateY = useRef(0);

  // مونت شدن در مرورگر
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // مدیریت انیمیشن باز/بسته
  useEffect(() => {
    if (visible) {
      setShow(true);
      setAnimating(true);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setAnimating(false);
        });
      });
      // جلوگیری از اسکرول بدنه
      document.body.style.overflow = 'hidden';
    } else {
      setAnimating(true);
      const timer = setTimeout(() => {
        setShow(false);
        setAnimating(false);
        document.body.style.overflow = '';
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [visible]);

  // بستن با Escape
  useEffect(() => {
    if (!visible) return;
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [visible, onClose]);

  // هندلر Drag برای بستن با کشیدن
  const handleTouchStart = (e) => {
    dragStartY.current = e.touches[0].clientY;
    currentTranslateY.current = 0;
  };

  const handleTouchMove = (e) => {
    const deltaY = e.touches[0].clientY - dragStartY.current;
    if (deltaY > 0 && sheetRef.current) {
      currentTranslateY.current = deltaY;
      sheetRef.current.style.transform = `translateY(${deltaY}px)`;
    }
  };

  const handleTouchEnd = () => {
    if (sheetRef.current) {
      sheetRef.current.style.transform = '';
      // اگر بیش از ۳۰٪ صفحه کشیده شده، ببند
      if (currentTranslateY.current > window.innerHeight * 0.3) {
        onClose?.();
      }
    }
    currentTranslateY.current = 0;
  };

  if (!mounted || !show) return null;

  const maxHeight = `${snapPoint * 100}vh`;

  const content = (
    <>
      {/* Backdrop */}
      <div
        className={`
          fixed inset-0 z-[9998]
          transition-opacity duration-300
          ${animating && !visible ? 'opacity-0' : 'opacity-100'}
          ${visible && !animating ? 'opacity-100' : 'opacity-0'}
        `}
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.55)' }}
        onClick={onClose}
      />

      {/* Sheet */}
      <div
        ref={sheetRef}
        className={`
          fixed bottom-0 left-0 right-0 z-[9999]
          rounded-t-3xl border-t
          transition-transform duration-300 ease-out
          flex flex-col
          ${visible && !animating ? 'translate-y-0' : 'translate-y-full'}
        `}
        style={{
          backgroundColor: colors.cardBackground,
          borderColor: colors.border,
          maxHeight,
          boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.15)',
        }}
      >
        {/* Handle Bar */}
        <div
          className="flex justify-center pt-3 pb-2 cursor-grab active:cursor-grabbing"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div
            className="w-10 h-1 rounded-full"
            style={{ backgroundColor: colors.border }}
          />
        </div>

        {/* Title */}
        {title && (
          <div
            className="flex items-center justify-between px-5 py-3 border-b"
            style={{ borderColor: colors.border }}
          >
            <h2
              className="text-base font-bold text-center flex-1"
              style={{
                color: colors.textMain,
                fontFamily: 'Vazir-Bold',
              }}
            >
              {title}
            </h2>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center
                         transition-colors duration-200"
              style={{ backgroundColor: colors.background }}
            >
              <FiX size={18} style={{ color: colors.textMain }} />
            </button>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div
            className="px-5 py-4 border-t"
            style={{
              borderColor: colors.border,
              backgroundColor: colors.cardBackground,
            }}
          >
            {footer}
          </div>
        )}
      </div>
    </>
  );

  return createPortal(content, document.body);
}