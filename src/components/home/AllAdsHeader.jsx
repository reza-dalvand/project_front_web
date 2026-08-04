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
      className="rounded-b-3xl pb-6 pt-4 px-5"
      style={{ backgroundColor: colors.primary }}
    >
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="w-10 h-10 rounded-xl flex items-center justify-center
            transition-transform hover:scale-105"
          style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
        >
          <FiArrowRight size={22} color="#fff" />
        </button>

        <div className="flex items-center gap-3 flex-1">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-md"
            style={{ backgroundColor: 'rgba(255,255,255,0.95)' }}
          >
            <span className="text-2xl">🔥</span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-xs text-white/80 font-[Vazir]">
              پیشنهادات ویژه
            </span>
            <h1 className="text-lg font-[Vazir-Bold] text-white">
              تخفیف‌ها و جشنواره‌ها
            </h1>
          </div>
        </div>

        <div
          className="px-3.5 py-2 rounded-2xl flex flex-col items-center"
          style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
        >
          <span className="text-lg font-[Vazir-Bold] text-white">
            {toPersianDigit(adsCount)}
          </span>
          <span className="text-[10px] text-white/85 font-[Vazir]">
            پیشنهاد
          </span>
        </div>
      </div>
    </div>
  );
}