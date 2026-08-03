'use client';

import { FiPhone, FiShare2 } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import { toPersianDigit } from '@/utils/numberUtils';

export default function ActionButtons({ phone, shareMessage, shareUrl }) {
  const { colors } = useTheme();

  const handleCall = async () => {
    if (!phone) {
      alert('شماره تماسی ثبت نشده است');
      return;
    }
    window.location.href = `tel:${phone}`;
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          message: shareMessage,
          url: shareUrl || window.location.href,
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard?.writeText(shareMessage);
      alert('لینک کپی شد');
    }
  };

  return (
    <div className="flex flex-col gap-3">
      {/* دکمه تماس */}
      {phone && (
        <button
          onClick={handleCall}
          className="flex items-center gap-3 py-3.5 px-4 rounded-2xl transition-all
                     hover:scale-[1.01] active:scale-[0.99]"
          style={{ backgroundColor: '#4CAF50' }}
        >
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
          >
            <FiPhone size={20} color="#fff" />
          </div>
          <div className="flex-1 text-right">
            <p className="text-base font-[Vazir-Bold] text-white">
              تلفن تماس
            </p>
            <p className="text-xs text-white/90">
              {toPersianDigit(phone)}
            </p>
          </div>
          <span className="text-xl text-white">←</span>
        </button>
      )}

      {/* دکمه اشتراک‌گذاری */}
      <button
        onClick={handleShare}
        className="flex items-center gap-3 py-3.5 px-4 rounded-2xl border transition-all
                   hover:scale-[1.01] active:scale-[0.99]"
        style={{
          backgroundColor: colors.cardBackground,
          borderColor: colors.border,
        }}
      >
        <FiShare2 size={20} style={{ color: colors.primary }} />
        <span
          className="flex-1 text-right text-base font-[Vazir-Bold]"
          style={{ color: colors.textMain }}
        >
          اشتراک‌گذاری
        </span>
        <span className="text-lg" style={{ color: colors.textSecondary }}>
          ←
        </span>
      </button>
    </div>
  );
}