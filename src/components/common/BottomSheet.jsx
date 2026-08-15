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
        requestAnimationFrame(() => {
          setAnimating(false);
        });
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
        className={`fixed inset-0 z-[9998] transition-opacity duration-300
          ${animating && !visible ? 'opacity-0' : 'opacity-100'}
          ${visible && !animating ? 'opacity-100' : 'opacity-0'}
        `}
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.55)' }}
        onClick={onClose}
      />
      {/* Sheet */}
      <div
        ref={sheetRef}
        className={`fixed bottom-0 left-0 right-0 z-[9999]
          rounded-t-3xl border-t border-[var(--border)]
          transition-transform duration-300 ease-out flex flex-col
          bg-[var(--card)] shadow-[0_-4px_20px_rgba(0,0,0,0.15)]
          safe-bottom
          ${visible && !animating ? 'translate-y-0' : 'translate-y-full'}
        `}
        style={{ maxHeight }}
      >
        {/* Drag Handle */}
        <div
          className="flex justify-center pt-3 pb-2 cursor-grab active:cursor-grabbing"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className="w-10 h-1 rounded-full bg-[var(--border)]" />
        </div>
        {/* Title + Close */}
        {title && (
          <div className="flex items-center justify-between px-5 py-3 border-b border-[var(--border)]">
            <h2 className="text-base font-vazir-bold text-center flex-1 text-[var(--text)]">
              {title}
            </h2>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center
                transition-colors duration-200 bg-[var(--bg)]"
            >
              <FiX size={18} className="text-[var(--text)]" />
            </button>
          </div>
        )}
        {/* Content */}
        <div className="flex-1 overflow-y-auto px-5 py-4">{children}</div>
        {/* Footer */}
        {footer && (
          <div className="px-5 py-4 pb-8 border-t border-[var(--border)] bg-[var(--card)]">
            {footer}
          </div>
        )}
      </div>
    </>
  );

  return createPortal(content, document.body);
}