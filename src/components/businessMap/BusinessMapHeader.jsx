// src/components/businessMap/BusinessMapHeader.jsx
'use client';
import { FiArrowRight } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';

export default function BusinessMapHeader({ businessName, onBack }) {
  const { colors } = useTheme();

  return (
    <div
      className="flex items-center justify-between px-5 py-4 border-b z-10 relative"
      style={{
        backgroundColor: colors.cardBackground,
        borderColor: colors.border,
      }}
    >
      <button
        onClick={onBack}
        className="w-10 h-10 rounded-full flex items-center justify-center border"
        style={{
          backgroundColor: colors.background,
          borderColor: colors.border,
        }}
      >
        <FiArrowRight size={22} style={{ color: colors.textMain }} />
      </button>
      <div className="flex-1 text-center px-4 min-w-0">
        <h1 className="text-base font-[Vazir-Bold] truncate" style={{ color: colors.textMain }}>
          موقعیت روی نقشه
        </h1>
        <p className="text-xs font-[Vazir] mt-0.5 truncate" style={{ color: colors.textSecondary }}>
          {businessName}
        </p>
      </div>
      <div className="w-10" />
    </div>
  );
}