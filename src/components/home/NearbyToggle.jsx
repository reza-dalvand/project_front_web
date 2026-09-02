// src/components/home/NearbyToggle.jsx
'use client';

import { FiMapPin } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';

export default function NearbyToggle({ nearbyEnabled, nearbyLoading, onToggle }) {
  const { colors } = useTheme();

  return (
    <button
      onClick={onToggle}
      disabled={nearbyLoading}
      className="w-full flex items-center gap-3 p-4 rounded-2xl border-2 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60"
      style={{
        backgroundColor: nearbyEnabled ? '#2196F315' : colors.cardBackground,
        borderColor: nearbyEnabled ? '#2196F3' : colors.border,
      }}
    >
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: nearbyEnabled ? '#2196F320' : colors.primary + '15' }}
      >
        {nearbyLoading ? (
          <div
            className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"
            style={{ color: '#2196F3' }}
          />
        ) : (
          <FiMapPin size={24} color={nearbyEnabled ? '#2196F3' : colors.primary} />
        )}
      </div>

      <div className="flex-1 text-right">
        <span
          className="text-sm font-[Vazir-Bold] block"
          style={{ color: nearbyEnabled ? '#2196F3' : colors.textMain }}
        >
          {nearbyEnabled ? 'در حال نمایش نزدیک‌ترین موارد' : 'نزدیک‌ترین‌ها به من'}
        </span>
        <span
          className="text-[11px] font-[Vazir] block mt-1"
          style={{ color: colors.textSecondary }}
        >
          {nearbyEnabled
            ? ' فیلتر استان و شهر با فعال بودن این گزینه غیر فعال می‌شود.'
            : 'سالن‌ها، کلینیک‌ها و مراکز اطراف شما'}
        </span>
      </div>

      <div
        className="relative w-11 h-6 rounded-full transition-colors flex-shrink-0"
        style={{ backgroundColor: nearbyEnabled ? '#2196F3' : colors.border }}
      >
        <div
          className="absolute top-0.5 w-5 h-5 rounded-full shadow-md transition-all"
          style={{
            backgroundColor: '#fff',
            [nearbyEnabled ? 'right' : 'left']: '2px',
          }}
        />
      </div>
    </button>
  );
}