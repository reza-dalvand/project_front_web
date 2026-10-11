// src/components/businessMap/NavigationModal.jsx
'use client';

import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { FiNavigation, FiX, FiExternalLink } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import { acquireScrollLock, releaseScrollLock } from '@/utils/scrollLock';

const NAVIGATION_APPS = [
  {
    id: 'balad',
    name: 'بلد',
    subtitle: 'مسیریاب ایرانی',
    icon: '🗺️',
    color: '#00B4AA',
  },
  {
    id: 'neshan',
    name: 'نشان',
    subtitle: 'مسیریاب ایرانی',
    icon: '📍',
    color: '#FF6600',
  },
  {
    id: 'google',
    name: 'گوگل مپ',
    subtitle: 'Google Maps',
    icon: '🌍',
    color: '#4285F4',
  },
];

export default function NavigationModal({ visible, onClose, onSelect, navLoading }) {
  const { colors } = useTheme();
  const lockId = useRef('navigation-modal');

  // قفل اسکرول صفحه پشت مودال
  useEffect(() => {
    if (!visible) return;

    acquireScrollLock(lockId.current);

    return () => {
      releaseScrollLock(lockId.current);
    };
  }, [visible]);

  // بستن با Escape در دسکتاپ
  useEffect(() => {
    if (!visible) return;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [visible, onClose]);

  if (!visible) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-end justify-center md:items-center"
      style={{
        backgroundColor: 'rgba(0,0,0,0.6)',
        backdropFilter: 'blur(2px)',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="انتخاب اپلیکیشن مسیریابی"
        className="w-full max-w-md rounded-t-3xl md:rounded-3xl flex flex-col overflow-hidden shadow-2xl animate-slide-up"
        style={{
          backgroundColor: colors.cardBackground,
          borderTop: `1px solid ${colors.border}`,
          // مهم: ارتفاع مودال از viewport بالاتر نرود
          maxHeight: 'calc(100dvh - env(safe-area-inset-top, 0px))',
          // مهم: محتوای پایین زیر نوار پایین گوشی نرود
          paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* دستگیره Bottom Sheet در موبایل */}
        <div className="md:hidden flex justify-center pt-3">
          <div
            className="w-10 h-1 rounded-full"
            style={{ backgroundColor: colors.border }}
          />
        </div>

        {/* هدر */}
        <div
          className="shrink-0 flex items-center justify-between px-5 py-4 border-b"
          style={{ borderColor: colors.border }}
        >
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div
              className="w-11 h-11 rounded-[14px] flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: '#43A04715' }}
            >
              <FiNavigation size={22} color="#43A047" />
            </div>

            <div className="flex-1 min-w-0">
              <h3
                className="text-base font-[Vazir-Bold] truncate"
                style={{ color: colors.textMain }}
              >
                مسیریابی
              </h3>
              <p
                className="text-[11px] font-[Vazir] truncate"
                style={{ color: colors.textSecondary }}
              >
                اپلیکیشن مسیریاب خود را انتخاب کنید
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="بستن"
            className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 transition-all hover:scale-105 active:scale-95"
            style={{ backgroundColor: colors.background }}
          >
            <FiX size={20} style={{ color: colors.textMain }} />
          </button>
        </div>

        {/* محتوای اسکرول‌شونده */}
        <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain p-5 space-y-3">
          {NAVIGATION_APPS.map((app) => {
            const isLoading = navLoading === app.id;

            return (
              <button
                key={app.id}
                onClick={() => onSelect(app)}
                disabled={isLoading}
                className="w-full min-h-[72px] flex items-center gap-3 sm:gap-4 p-3.5 sm:p-4 rounded-2xl border-2 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60 touch-manipulation"
                style={{
                  backgroundColor: isLoading ? app.color + '10' : colors.cardBackground,
                  borderColor: isLoading ? app.color : colors.border,
                }}
              >
                <div
                  className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center text-xl sm:text-2xl flex-shrink-0"
                  style={{ backgroundColor: app.color + '18' }}
                >
                  {app.icon}
                </div>

                <div className="flex-1 min-w-0 text-right">
                  <p
                    className="text-sm sm:text-[15px] font-[Vazir-Bold] truncate"
                    style={{ color: colors.textMain }}
                  >
                    {app.name}
                  </p>
                  <p
                    className="text-[10px] sm:text-[11px] font-[Vazir] mt-0.5 truncate"
                    style={{ color: colors.textSecondary }}
                  >
                    {app.subtitle}
                  </p>
                </div>

                {isLoading ? (
                  <div
                    className="w-6 h-6 border-2 border-current border-t-transparent rounded-full animate-spin flex-shrink-0"
                    style={{ color: app.color }}
                  />
                ) : (
                  <FiExternalLink
                    size={18}
                    className="flex-shrink-0"
                    style={{ color: colors.textSecondary }}
                  />
                )}
              </button>
            );
          })}

          <div
            className="flex items-start gap-2.5 p-3 rounded-xl border"
            style={{
              backgroundColor: colors.primary + '08',
              borderColor: colors.primary + '25',
            }}
          >
            <span className="text-base flex-shrink-0">💡</span>
            <p
              className="text-[11px] font-[Vazir] leading-5 flex-1"
              style={{ color: colors.textSecondary }}
            >
              اگر اپلیکیشن مسیریاب روی گوشی شما نصب باشد، مستقیماً باز می‌شود. در غیر این صورت،
              نسخه وب آن باز خواهد شد.
            </p>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}