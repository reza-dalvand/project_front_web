// src/components/nearby/NearbyHeader.jsx
'use client';
import { FiArrowRight, FiRefreshCw } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';

export default function NearbyHeader({ onBack, onRefresh, isLoading, hasLocation }) {
  const { colors } = useTheme();

  return (
    <div
      className="flex items-center justify-between px-5 py-4 border-b sticky top-0 z-30"
      style={{ backgroundColor: colors.background, borderColor: colors.border }}
    >
      <button
        onClick={onBack}
        className="w-10 h-10 rounded-full flex items-center justify-center border"
        style={{ backgroundColor: colors.cardBackground, borderColor: colors.border }}
      >
        <FiArrowRight size={22} style={{ color: colors.textMain }} />
      </button>
      <h1 className="text-base font-[Vazir-Bold]" style={{ color: colors.textMain }}>
        نزدیک‌ترین‌ها به من
      </h1>
      {hasLocation ? (
        <button
          onClick={onRefresh}
          disabled={isLoading}
          className="w-10 h-10 rounded-full flex items-center justify-center border transition-all active:scale-95"
          style={{
            backgroundColor: colors.cardBackground,
            borderColor: colors.border,
            opacity: isLoading ? 0.6 : 1,
          }}
        >
          <FiRefreshCw
            size={18}
            style={{ color: colors.primary }}
            className={isLoading ? 'animate-spin' : ''}
          />
        </button>
      ) : (
        <div className="w-10" />
      )}
    </div>
  );
}