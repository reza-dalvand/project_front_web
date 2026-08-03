'use client';

import { FiSearch, FiAlertCircle } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';

export default function SearchEmptyState({ query, activeTab }) {
  const { colors } = useTheme();

  const getTabMessage = () => {
    switch (activeTab) {
      case 'businesses':
        return { icon: '🏪', title: 'کسب‌وکاری یافت نشد' };
      case 'modelRequests':
        return { icon: '👤', title: 'فرصت مدلینگی یافت نشد' };
      case 'lineRentals':
        return { icon: '🏢', title: 'آگهی لاینی یافت نشد' };
      default:
        return { icon: '🔍', title: 'نتیجه‌ای یافت نشد' };
    }
  };

  const { icon, title } = getTabMessage();

  return (
    <div className="flex flex-col items-center justify-center py-12 px-6 gap-4">
      <div
        className="w-24 h-24 rounded-full flex items-center justify-center"
        style={{ backgroundColor: colors.primary + '15' }}
      >
        <span className="text-5xl">{icon}</span>
      </div>
      <h3
        className="text-lg font-[Vazir-Bold] text-center"
        style={{ color: colors.textMain }}
      >
        {title}
      </h3>
      <p
        className="text-sm font-[Vazir] text-center leading-6"
        style={{ color: colors.textSecondary }}
      >
        عبارت «{query}» در این دسته نتیجه‌ای نداشت
      </p>

      {/* راهنما */}
      <div
        className="w-full max-w-md p-4 rounded-2xl border gap-3"
        style={{
          backgroundColor: colors.cardBackground,
          borderColor: colors.border,
        }}
      >
        <div className="flex items-center gap-2 mb-2">
          <FiAlertCircle size={18} color={colors.primary} />
          <span
            className="text-sm font-[Vazir-Bold]"
            style={{ color: colors.textMain }}
          >
            💡 پیشنهاد‌ها:
          </span>
        </div>
        <div className="space-y-2">
          {[
            'املای کلمه را بررسی کنید',
            'از کلمات کلیدی ساده‌تر استفاده کنید',
            'تب‌های دیگر را بررسی کنید',
          ].map((tip, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="text-xs" style={{ color: colors.primary }}>
                ✓
              </span>
              <span
                className="text-xs font-[Vazir]"
                style={{ color: colors.textSecondary }}
              >
                {tip}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}