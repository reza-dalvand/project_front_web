// src/components/common/BottomSheet.jsx
'use client';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { FiX } from 'react-icons/fi';
import { acquireScrollLock, releaseScrollLock } from '@/utils/scrollLock';

let bottomSheetCounter = 0;
const activeBottomSheets = new Set();

export default function BottomSheet({
  visible,
  onClose,
  title,
  children,
  footer,
  snapPoint = 0.7,
}) {
  const [mounted, setMounted] = useState(false);
  const [animating, setAnimating] = useState(false);
  const [show, setShow] = useState(false);
  const sheetRef = useRef(null);
  const dragStartY = useRef(0);
  const currentTranslateY = useRef(0);
  const instanceId = useRef(`bottomsheet-${++bottomSheetCounter}`);

  useEffect(() => {
    setMounted(true);
    const id = instanceId.current;
    activeBottomSheets.add(id);
    return () => {
      setMounted(false);
      activeBottomSheets.delete(id);
      releaseScrollLock(id);
    };
  }, []);

  useEffect(() => {
    if (visible) {
      setShow(true);
      setAnimating(true);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setAnimating(false));
      });
      acquireScrollLock(instanceId.current);
    } else {
      setAnimating(true);
      const timer = setTimeout(() => {
        setShow(false);
        setAnimating(false);
        releaseScrollLock(instanceId.current);
      }, 300);
      return () => {
        clearTimeout(timer);
        releaseScrollLock(instanceId.current);
      };
    }
  }, [visible]);

  useEffect(() => {
    if (!visible) return;
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [visible, onClose]);

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
      if (currentTranslateY.current > window.innerHeight * 0.3) onClose?.();
    }
    currentTranslateY.current = 0;
  };

  if (!mounted || !show) return null;

  const content = (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-[9998] transition-opacity duration-300
          ${animating && !visible ? 'opacity-0' : 'opacity-100'}
          ${visible && !animating ? 'opacity-100' : 'opacity-0'}
        `}
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.55)' }}
        onClick={onClose}
      />

      {/* Sheet / Modal - ریسپانسیو کامل */}
      <div
        ref={sheetRef}
        className={`
          fixed z-[9999] transition-all duration-300 ease-out flex flex-col
          bg-[var(--card)] shadow-[0_-4px_20px_rgba(0,0,0,0.15)]
          
          /* ─── Mobile: Bottom Sheet (<640px) ─── */
          bottom-0 left-0 right-0
          rounded-t-3xl border-t border-[var(--border)]
          safe-bottom
          max-h-[95dvh]
          
          /* ─── Tablet (≥640px): centered, slightly smaller ─── */
          sm:bottom-auto sm:top-1/2 sm:left-1/2 sm:right-auto
          sm:-translate-x-1/2
          sm:rounded-3xl sm:max-w-lg sm:w-[calc(100%-2rem)] sm:max-h-[90vh]
          sm:border sm:border-[var(--border)] sm:shadow-2xl
          sm:rounded-t-3xl
          
          /* ─── Desktop (≥1024px): wider modal ─── */
          lg:max-w-xl lg:max-h-[85vh]
          
          /* ─── XL (≥1280px): max-width cap ─── */
          xl:max-w-2xl
          
          /* ─── States ─── */
          ${
            visible && !animating
              ? 'translate-y-0 sm:translate-y-[-50%] sm:opacity-100'
              : 'translate-y-full sm:translate-y-[-40%] sm:opacity-0 pointer-events-none'
          }
        `}
        style={{ maxHeight: `min(${snapPoint * 100}dvh, 95dvh)` }}
      >
        {/* Drag Handle (فقط در موبایل) */}
        <div
          className="flex justify-center pt-3 pb-2 cursor-grab active:cursor-grabbing sm:hidden"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className="w-10 h-1 rounded-full bg-[var(--border)]" />
        </div>

        {/* Title + Close - ریسپانسیو */}
        {title && (
          <div className="flex items-center justify-between px-4 sm:px-5 py-3 sm:py-4 border-b border-[var(--border)]">
            <h2 className="text-sm sm:text-base font-vazir-bold text-center flex-1 text-[var(--text)] leading-relaxed">
              {title}
            </h2>
            <button
              onClick={onClose}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center transition-colors duration-200 bg-[var(--bg)] hover:opacity-80 shrink-0"
            >
              <FiX size={18} className="text-[var(--text)]" />
            </button>
          </div>
        )}

        {/* Content - ریسپانسیو با safe area */}
        <div
          className="flex-1 overflow-y-auto px-4 sm:px-5 py-4 sm:py-5 overscroll-contain"
          style={{
            paddingBottom: 'calc(16px + env(safe-area-inset-bottom, 0px))',
            WebkitOverflowScrolling: 'touch',
          }}
        >
          {children}
        </div>

        {/* Footer - ریسپانسیو */}
        {footer && (
          <div
            className="px-4 sm:px-5 py-3 sm:py-4 border-t border-[var(--border)] bg-[var(--card)]"
            style={{
              paddingBottom: 'calc(16px + env(safe-area-inset-bottom, 0px))',
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