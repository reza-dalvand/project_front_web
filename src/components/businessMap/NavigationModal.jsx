// src/components/businessMap/NavigationModal.jsx
'use client';
import { createPortal } from 'react-dom';
import { FiNavigation, FiX, FiExternalLink } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';

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

  if (!visible) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-end md:items-center justify-center"
      style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="w-full max-w-md rounded-t-3xl md:rounded-3xl flex flex-col overflow-hidden"
        style={{
          backgroundColor: colors.cardBackground,
          borderTop: `1px solid ${colors.border}`,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="flex items-center justify-between px-5 py-4 border-b"
          style={{ borderColor: colors.border }}
        >
          <div className="flex items-center gap-3 flex-1">
            <div
              className="w-11 h-11 rounded-[14px] flex items-center justify-center"
              style={{ backgroundColor: '#43A04715' }}
            >
              <FiNavigation size={22} color="#43A047" />
            </div>
            <div className="flex-1">
              <h3 className="text-base font-[Vazir-Bold]" style={{ color: colors.textMain }}>
                مسیریابی
              </h3>
              <p className="text-[11px] font-[Vazir]" style={{ color: colors.textSecondary }}>
                اپلیکیشن مسیریاب خود را انتخاب کنید
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full flex items-center justify-center"
            style={{ backgroundColor: colors.background }}
          >
            <FiX size={20} style={{ color: colors.textMain }} />
          </button>
        </div>

        <div className="p-5 space-y-3">
          {NAVIGATION_APPS.map((app) => {
            const isLoading = navLoading === app.id;
            return (
              <button
                key={app.id}
                onClick={() => onSelect(app)}
                disabled={isLoading}
                className="w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60"
                style={{
                  backgroundColor: isLoading ? app.color + '10' : colors.cardBackground,
                  borderColor: isLoading ? app.color : colors.border,
                }}
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
                  style={{ backgroundColor: app.color + '18' }}
                >
                  {app.icon}
                </div>
                <div className="flex-1 text-right">
                  <p className="text-[15px] font-[Vazir-Bold]" style={{ color: colors.textMain }}>
                    {app.name}
                  </p>
                  <p className="text-[11px] font-[Vazir] mt-0.5" style={{ color: colors.textSecondary }}>
                    {app.subtitle}
                  </p>
                </div>
                {isLoading ? (
                  <div
                    className="w-6 h-6 border-2 border-current border-t-transparent rounded-full animate-spin"
                    style={{ color: app.color }}
                  />
                ) : (
                  <FiExternalLink size={18} style={{ color: colors.textSecondary }} />
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
            <p className="text-[11px] font-[Vazir] leading-5 flex-1" style={{ color: colors.textSecondary }}>
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