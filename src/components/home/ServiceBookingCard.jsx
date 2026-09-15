// src/components/home/ServiceBookingCard.jsx
'use client';
import { FiClock, FiCalendar } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import { toPersianDigit } from '@/utils/numberUtils';
import ServiceTypeIcon from '@/components/manageBusiness/services/ServiceTypeIcon';

/**
 * 💆 ردیف فشرده خدمت + دکمه رزرو تمام‌عرض چسبیده به پایین کارت
 */
export default function ServiceBookingCard({ service, onBook }) {
  const { colors } = useTheme();
  const discount = service.discountPercent || service.discount || 0;
  const hasDiscount = discount > 0;
  const price = service.price ?? service.finalPrice ?? 0;

  return (
    <div
      className="rounded-xl sm:rounded-2xl md:rounded-[20px] border overflow-hidden"
      style={{ backgroundColor: colors.cardBackground, borderColor: colors.border }}
    >
      {/* ═══ ردیف اطلاعات: آیکون + نام + قیمت ═══ */}
      <div className="flex items-center gap-2.5 sm:gap-3 md:gap-4 px-3.5 sm:px-4 md:px-5 py-3 sm:py-3.5 md:py-4">
        {/* آیکون خدمت */}
        <ServiceTypeIcon typeId={service.typeId} size={46} className="sm:!w-[52px] sm:!h-[52px] md:!w-[56px] md:!h-[56px]" />

        {/* نام + مدت */}
        <div className="flex-1 min-w-0">
          <p
            className="text-[12px] sm:text-[13px] md:text-sm lg:text-[15px] font-[Vazir-Bold] line-clamp-1"
            style={{ color: colors.textMain }}
          >
            {service.name}
          </p>
          <div className="flex items-center gap-1 sm:gap-1.5 mt-0.5 sm:mt-1">
            <FiClock size={11} className="sm:w-3 sm:h-3" style={{ color: colors.textSecondary }} />
            <span className="text-[9px] sm:text-[10px] md:text-[11px]" style={{ color: colors.textSecondary }}>
              {toPersianDigit(service.duration || 60)} دقیقه
            </span>
            {hasDiscount && (
              <span
                className="text-[8px] sm:text-[9px] md:text-[10px] font-[Vazir-Bold] px-1 sm:px-1.5 py-0.5 rounded-md"
                style={{ backgroundColor: '#E5393515', color: '#E53935' }}
              >
                {toPersianDigit(discount)}٪ تخفیف
              </span>
            )}
          </div>
        </div>

        {/* قیمت */}
        <div className="flex flex-col items-end gap-0.5 flex-shrink-0">
          {hasDiscount && (
            <span className="text-[9px] sm:text-[10px] md:text-[11px] line-through" style={{ color: colors.textSecondary }}>
              {toPersianDigit((service.originalPrice || 0).toLocaleString('en-US'))}
            </span>
          )}
          <span className="text-[12px] sm:text-[13px] md:text-sm lg:text-[15px] font-[Vazir-Bold]" style={{ color: colors.primary }}>
            {toPersianDigit(price.toLocaleString('en-US'))}
            <span className="text-[8px] sm:text-[9px] md:text-[10px] font-[Vazir] mr-1">تومان</span>
          </span>
        </div>
      </div>

      {/* ═══ دکمه رزرو تمام‌عرض چسبیده به پایین کارت ═══ */}
      <button
        onClick={() => onBook(service)}
        className="w-full flex items-center justify-center gap-1.5 sm:gap-2 py-2.5 sm:py-3 md:py-3.5 border-t transition-all active:opacity-80 hover:opacity-90"
        style={{ backgroundColor: '#43A047', borderColor: 'rgba(0,0,0,0.1)' }}
      >
        <FiCalendar size={14} className="sm:w-4 sm:h-4 md:w-[18px] md:h-[18px]" color="#fff" />
        <span className="text-[11px] sm:text-[12px] md:text-[13px] font-[Vazir-Bold] text-white">رزرو نوبت</span>
      </button>
    </div>
  );
}