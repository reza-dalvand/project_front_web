// src/components/common/ActionButtons.jsx
'use client';

import { FiPhone, FiShare2 } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import { toPersianDigit } from '@/utils/numberUtils';

/**
 * کامپوننت دکمه‌های تماس و اشتراک‌گذاری
 *
 * @param {string} phone - شماره تماس
 * @param {string} shareMessage - پیام اشتراک‌گذاری
 * @param {string} shareUrl - لینک اشتراک‌گذاری
 */
export default function ActionButtons({ phone, shareMessage, shareUrl }) {
  const { colors } = useTheme();

  const handleCall = () => {
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
          title: 'زیبانو',
          text: shareMessage,
          url: shareUrl || window.location.href,
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      // Fallback: کپی در کلیپ‌بورد
      try {
        await navigator.clipboard.writeText(shareMessage);
        alert('لینک کپی شد');
      } catch (err) {
        alert('امکان اشتراک‌گذاری وجود ندارد');
      }
    }
  };

  return (
    <div className="flex flex-col gap-3">
      {/* دکمه تماس */}
      {phone && (
        <button
          onClick={handleCall}
          className="flex items-center gap-3 py-4 px-5 rounded-2xl
                     transition-all hover:scale-[1.02] active:scale-[0.98]
                     shadow-lg"
          style={{ backgroundColor: '#4CAF50' }}
        >
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
          >
            <FiPhone size={22} color="#fff" />
          </div>
          <div className="flex-1 text-right">
            <p className="text-base font-[Vazir-Bold] text-white">
              تلفن تماس
            </p>
            <p className="text-sm text-white/90">
              {toPersianDigit(phone)}
            </p>
          </div>
          <span className="text-2xl text-white">←</span>
        </button>
      )}

      {/* دکمه اشتراک‌گذاری */}
      <button
        onClick={handleShare}
        className="flex items-center gap-3 py-4 px-5 rounded-2xl border
                   transition-all hover:scale-[1.02] active:scale-[0.98]"
        style={{
          backgroundColor: colors.cardBackground,
          borderColor: colors.border,
        }}
      >
        <FiShare2 size={22} style={{ color: colors.primary }} />
        <span
          className="flex-1 text-right text-base font-[Vazir-Bold]"
          style={{ color: colors.textMain }}
        >
          اشتراک‌گذاری
        </span>
        <span className="text-xl" style={{ color: colors.textSecondary }}>
          ←
        </span>
      </button>
    </div>
  );
}