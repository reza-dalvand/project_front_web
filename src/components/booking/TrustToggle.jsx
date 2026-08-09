// src/components/booking/TrustToggle.jsx
'use client';
import { FiShield, FiInfo } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';

export default function TrustToggle({ enabled, onToggle }) {
  const { colors } = useTheme();

  return (
    <div
      className="rounded-2xl border-[1.5px] p-4 transition-all duration-200"
      style={{
        backgroundColor: enabled ? colors.primary + '08' : colors.cardBackground,
        borderColor: enabled ? colors.primary : colors.border,
      }}
    >
      <div className="flex items-start gap-3">
        {/* آیکون */}
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: enabled ? colors.primary + '20' : colors.primary + '10' }}
        >
          <FiShield size={20} style={{ color: colors.primary }} />
        </div>

        {/* متن‌ها */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[13px] font-[Vazir-Bold]" style={{ color: colors.textMain }}>
              اعتماد به سالن
            </span>

            {/* سوئیچ */}
            <button
              onClick={() => onToggle(!enabled)}
              className="relative w-11 h-6 rounded-full transition-colors flex-shrink-0"
              style={{ backgroundColor: enabled ? colors.primary : colors.border }}
            >
              <div
                className="absolute top-0.5 w-5 h-5 rounded-full shadow-md transition-all"
                style={{
                  backgroundColor: enabled ? '#fff' : '#ccc',
                  [enabled ? 'right' : 'left']: '2px',
                }}
              />
            </button>
          </div>

          <p
            className="text-[11px] font-[Vazir] leading-[18px] mt-1.5"
            style={{ color: colors.textSecondary }}
          >
            اگه به این سالن اعتماد دارید، این گزینه رو فعال کنید. دیگه نیازی به تحویل کد ۴ رقمی نیست
            و عملیات تایید به‌صورت خودکار انجام میشه.
          </p>
        </div>
      </div>
    </div>
  );
}
