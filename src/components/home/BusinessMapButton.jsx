'use client';

import { FiMap } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';

export default function BusinessMapButton({ business, onPress }) {
  const { colors } = useTheme();
  const hasLocation = business?.location?.latitude && business?.location?.longitude;

  return (
    <button
      onClick={onPress}
      className="w-full flex items-center gap-3 p-3.5 rounded-2xl border transition-all
                 hover:scale-[1.01] active:scale-[0.99]"
      style={{
        backgroundColor: colors.cardBackground,
        borderColor: colors.border,
      }}
    >
      <div
        className="w-[52px] h-[52px] rounded-2xl flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: '#E5393518' }}
      >
        <FiMap size={26} color="#E53935" />
      </div>

      <div className="flex-1 text-right">
        <p
          className="text-sm font-[Vazir-Bold] mb-0.5"
          style={{ color: colors.textMain }}
        >
          آدرس روی نقشه
        </p>
        <p
          className="text-[11px] font-[Vazir] line-clamp-1"
          style={{ color: colors.textSecondary }}
        >
          {business?.address || 'مشاهده موقعیت کسب‌وکار'}
        </p>
      </div>

      <div
        className="flex items-center gap-1 px-3 py-2 rounded-xl flex-shrink-0"
        style={{ backgroundColor: colors.primary }}
      >
        <span className="text-sm">🧭</span>
        <span className="text-[11px] font-[Vazir-Bold] text-white">
          مسیریابی
        </span>
      </div>
    </button>
  );
}