'use client';
import { FiArrowRight } from 'react-icons/fi';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/stores/useThemeStore';
import { toPersianDigit } from '@/utils/numberUtils';

export default function AllAdsHeader({ adsCount = 0 }) {
  const { colors } = useTheme();
  const router = useRouter();

  return (
    <div
      className="rounded-b-3xl md:rounded-b-[36px] lg:rounded-b-[40px] pb-5 sm:pb-6 md:pb-8 pt-4 md:pt-5"
      style={{ backgroundColor: colors.primary }}
    >
      {/* ✅ کانتینر مرکزی */}
      <div className="max-w-6xl mx-auto px-5 md:px-6 lg:px-8">
        <div className="flex items-center gap-2.5 sm:gap-3 md:gap-4">
          <button
            onClick={() => router.back()}
            className="w-10 h-10 md:w-11 md:h-11 lg:w-12 lg:h-12 rounded-xl md:rounded-2xl flex items-center justify-center
              transition-transform hover:scale-105 active:scale-95"
            style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
          >
            <FiArrowRight size={22} className="md:w-6 md:h-6" color="#fff" />
          </button>

          <div className="flex items-center gap-2.5 sm:gap-3 md:gap-4 flex-1">
            <div
              className="w-11 h-11 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 rounded-xl sm:rounded-2xl md:rounded-[20px] flex items-center justify-center shadow-md"
              style={{ backgroundColor: 'rgba(255,255,255,0.95)' }}
            >
              <span className="text-xl sm:text-2xl md:text-3xl">🔥</span>
            </div>
            <div className="flex flex-col gap-0.5 md:gap-1">
              <span className="text-[11px] sm:text-xs md:text-sm text-white/80 font-[Vazir]">پیشنهادات ویژه</span>
              <h1 className="text-base sm:text-lg md:text-xl lg:text-2xl font-[Vazir-Bold] text-white">تخفیف‌ها و جشنواره‌ها</h1>
            </div>
          </div>

          <div
            className="px-3 sm:px-3.5 md:px-4 py-1.5 sm:py-2 md:py-2.5 rounded-xl sm:rounded-2xl flex flex-col items-center"
            style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
          >
            <span className="text-base sm:text-lg md:text-xl font-[Vazir-Bold] text-white">{toPersianDigit(adsCount)}</span>
            <span className="text-[9px] sm:text-[10px] md:text-[11px] text-white/85 font-[Vazir]">پیشنهاد</span>
          </div>
        </div>
      </div>
    </div>
  );
}