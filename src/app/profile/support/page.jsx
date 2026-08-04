'use client';
import { useTheme } from '@/stores/useThemeStore';
import FaqSection from '@/components/profile/support/FaqSection';
import SupportChannels from '@/components/profile/support/SupportChannels';
import { FiHeadphones } from 'react-icons/fi';

export default function SupportPage() {
  const { colors } = useTheme();

  return (
    <div className="min-h-screen pb-20" style={{ backgroundColor: colors.background }}>
      {/* هدر */}
      <div
        className="rounded-b-3xl pb-7 px-5 pt-6"
        style={{ backgroundColor: colors.primary }}
      >
        <div className="flex flex-col items-center gap-3">
          <div className="relative w-[90px] h-[90px] flex items-center justify-center">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center z-10"
              style={{ backgroundColor: 'rgba(255,255,255,0.25)' }}
            >
              <FiHeadphones size={40} color="#fff" />
            </div>
            <div
              className="absolute w-[90px] h-[90px] rounded-full border-2"
              style={{ borderColor: 'rgba(255,255,255,0.4)' }}
            />
          </div>
          <h2 className="text-xl font-[Vazir-Bold] text-white">پشتیبانی زیبانو</h2>
          <p className="text-xs text-center leading-5 text-white/85 px-4">
            تیم ما آماده پاسخگویی به سوالات و حل مشکلات شماست
          </p>
        </div>
      </div>

      {/* محتوا */}
      <div className="px-5 pt-5 pb-32 space-y-8">
        {/* راهنمای سریع */}
        <div
          className="flex items-center gap-2.5 p-3 rounded-2xl border"
          style={{
            backgroundColor: colors.primary + '08',
            borderColor: colors.primary + '25',
          }}
        >
          <span className="text-base flex-shrink-0">💡</span>
          <p className="text-xs leading-5 flex-1" style={{ color: colors.textSecondary }}>
            برای دریافت سریع‌تر پاسخ، ابتدا سوالات متداول را بررسی کنید
          </p>
        </div>

        {/* بخش کانال‌های ارتباطی */}
        <SupportChannels />

        {/* بخش سوالات متداول */}
        <FaqSection />

        {/* فوتر */}
        <div className="flex flex-col items-center gap-1 pt-6">
          <p className="text-xs font-[Vazir-Medium]" style={{ color: colors.textSecondary }}>
            زیبانو - همراه شما در مسیر زیبایی و سلامت
          </p>
          <p className="text-[10px]" style={{ color: colors.textSecondary }}>
            نسخه ۱.۰.۰
          </p>
        </div>
      </div>
    </div>
  );
}