// src/components/nearby/LocationInfoBar.jsx
'use client';
import { FiMapPin } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';

export default function LocationInfoBar({ latitude, longitude }) {
  const { colors } = useTheme();

  return (
    <div
      className="flex items-center justify-between p-3 rounded-xl border"
      style={{ backgroundColor: colors.cardBackground, borderColor: colors.border }}
    >
      <div className="flex items-center gap-2">
        <FiMapPin size={16} style={{ color: colors.primary }} />
        <span className="text-xs font-[Vazir-Medium]" style={{ color: colors.textSecondary }}>
          موقعیت فعلی شما
        </span>
      </div>
      <span
        className="text-[10px] font-mono"
        style={{ color: colors.textSecondary, direction: 'ltr' }}
      >
        {latitude.toFixed(4)}°, {longitude.toFixed(4)}°
      </span>
    </div>
  );
}