'use client';

import { FiLink, FiCopy, FiShare2, FiMousePointer, FiCalendar } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import Card from '@/components/common/Card';
import { toPersianDigit } from '@/utils/numberUtils';

export default function BookingLinkCard({ bookingLink, onShare, onCopy }) {
  const { colors } = useTheme();

  // استخراج مقدار لینک
  const linkUrl = typeof bookingLink === 'string' ? bookingLink : bookingLink?.link || '';
  const clicks = bookingLink?.clicks || 0;
  const bookings = bookingLink?.bookings || 0;

  const handleCopy = () => {
    navigator.clipboard?.writeText(linkUrl);
    onCopy?.();
  };

  return (
    <Card variant="elevated" padding={20} radius={20}>
      {/* هدر */}
      <div className="flex items-center gap-3 mb-4">
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center"
          style={{ backgroundColor: colors.primary + '20' }}
        >
          <FiLink size={28} style={{ color: colors.primary }} />
        </div>
        <div className="flex-1">
          <h3 className="text-base font-[Vazir-Bold]" style={{ color: colors.textMain }}>
            لینک اختصاصی رزرو
          </h3>
          <p className="text-xs" style={{ color: colors.textSecondary }}>
            این لینک را در شبکه‌های اجتماعی خود به اشتراک بگذارید
          </p>
        </div>
      </div>

      {/* باکس لینک */}
      <div
        className="flex items-center gap-3 p-3.5 rounded-xl border mb-4"
        style={{
          backgroundColor: colors.background,
          borderColor: colors.border,
        }}
      >
        <span className="text-base">🔗</span>
        <span
          className="flex-1 text-sm font-[Vazir-Medium] truncate"
          style={{ color: colors.textMain }}
          dir="ltr"
        >
          {linkUrl}
        </span>
      </div>

      {/* راهنما */}
      <div
        className="flex items-start gap-2 p-3 rounded-xl border mb-4"
        style={{
          backgroundColor: colors.primary + '10',
          borderColor: colors.primary + '30',
        }}
      >
        <span className="text-base flex-shrink-0">💡</span>
        <p className="text-[11px] font-[Vazir] leading-[18px] flex-1" style={{ color: colors.textSecondary }}>
          مشتریان با کلیک روی این لینک مستقیماً به صفحه رزرو شما در اپلیکیشن هدایت می‌شوند
        </p>
      </div>

      {/* دکمه‌ها */}
      <div className="flex gap-3 mb-5">
        <button
          onClick={handleCopy}
          className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl
            transition-all hover:scale-[1.01] active:scale-[0.99]"
          style={{ backgroundColor: colors.primary }}
        >
          <FiCopy size={18} color="#fff" />
          <span className="text-sm font-[Vazir-Bold] text-white">کپی لینک</span>
        </button>
        <button
          onClick={onShare}
          className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl border
            transition-all hover:scale-[1.01] active:scale-[0.99]"
          style={{ backgroundColor: '#25D366' }}
        >
          <FiShare2 size={18} color="#fff" />
          <span className="text-sm font-[Vazir-Bold] text-white">اشتراک‌گذاری</span>
        </button>
      </div>

      {/* آمار لینک */}
      <div
        className="flex items-center justify-around pt-4 border-t"
        style={{ borderColor: colors.border }}
      >
        <div className="flex items-center gap-2">
          <FiMousePointer size={16} style={{ color: colors.primary }} />
          <span className="text-xs" style={{ color: colors.textSecondary }}>
            {toPersianDigit(clicks)} کلیک
          </span>
        </div>
        <div className="flex items-center gap-2">
          <FiCalendar size={16} style={{ color: '#43A047' }} />
          <span className="text-xs" style={{ color: colors.textSecondary }}>
            {toPersianDigit(bookings)} رزرو
          </span>
        </div>
      </div>
    </Card>
  );
}