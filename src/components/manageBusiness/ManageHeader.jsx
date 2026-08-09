'use client';
import { useRouter } from 'next/navigation';
import { FiStar, FiMapPin, FiCreditCard, FiSettings, FiAlertTriangle } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import { useAuthStore } from '@/stores/useAuthStore';
import { useBusinessStore } from '@/stores/useBusinessStore';
import { toPersianDigit } from '@/utils/numberUtils';
import Avatar from '@/components/common/Avatar';

export default function ManageHeader() {
  const { colors } = useTheme();
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const businessData = useBusinessStore((s) => s.businessData);

  // ✅ بررسی وضعیت حساب بانکی
  const needsBankRegistration = !businessData?.bankInfo?.isRegistered;

  // خوشامدگویی بر اساس ساعت
  const hour = new Date().getHours();
  const greeting =
    hour < 12
      ? { text: 'صبح بخیر', emoji: '🌅' }
      : hour < 17
        ? { text: 'ظهر بخیر', emoji: '☀️' }
        : { text: 'عصر بخیر', emoji: '🌆' };

  return (
    <div
      className="relative overflow-hidden rounded-b-[32px] pt-6 pb-7 px-5"
      style={{
        background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
      }}
    >
      {/* دایره‌های تزئینی */}
      <div
        className="absolute -top-10 -left-10 w-44 h-44 rounded-full border-2 pointer-events-none"
        style={{ borderColor: 'rgba(255,255,255,0.15)' }}
      />
      <div
        className="absolute -bottom-14 -right-14 w-52 h-52 rounded-full border-2 pointer-events-none"
        style={{ borderColor: 'rgba(255,255,255,0.08)' }}
      />

      <div className="relative z-10 space-y-5">
        {/* خوشامدگویی */}
        <div>
          <p className="text-sm text-white/80 mb-1">
            {greeting.emoji} {greeting.text}
          </p>
          <h1 className="text-2xl font-[Vazir-Bold] text-white">{user?.name || 'مدیر سالن'}</h1>
        </div>

        {/* کارت کسب‌وکار */}
        <div
          className="flex items-center gap-3 p-3.5 rounded-2xl"
          style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}
        >
          <Avatar
            uri={businessData?.logo}
            name={businessData?.name}
            size="lg"
            showBorder
            className="!border-white/50"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <h3 className="text-[15px] font-[Vazir-Bold] text-white truncate">
                {businessData?.name}
              </h3>
              {businessData?.VIP && (
                <div className="w-5 h-5 rounded-full flex items-center justify-center bg-yellow-400/25">
                  <span className="text-[10px]">👑</span>
                </div>
              )}
            </div>
            <p className="text-[11px] text-white/85 mt-0.5">{businessData?.category}</p>
            <div className="flex items-center gap-1 mt-1">
              <FiMapPin size={11} className="text-white/75" />
              <span className="text-[10px] text-white/75">{businessData?.city}</span>
            </div>
          </div>

          {/* باکس امتیاز */}
          <div
            className="flex flex-col items-center px-3 py-2 rounded-2xl border"
            style={{
              backgroundColor: 'rgba(255,255,255,0.2)',
              borderColor: 'rgba(255,255,255,0.25)',
            }}
          >
            <span className="text-xl font-[Vazir-Bold] text-white leading-tight">
              {toPersianDigit((businessData?.rating || 4.9).toFixed(1))}
            </span>
            <div className="flex items-center gap-0.5 my-1">
              {[...Array(5)].map((_, i) => (
                <FiStar key={i} size={11} className="text-yellow-400 fill-yellow-400" />
              ))}
            </div>
            <span className="text-[9px] text-white/80">
              ({toPersianDigit(businessData?.reviewsCount || 142)})
            </span>
          </div>
        </div>

        {/* دکمه‌های سریع */}
        <div className="flex gap-2.5">
          <button
            onClick={() => router.push('/manage/financial')}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border transition-all hover:opacity-80"
            style={{
              backgroundColor: 'rgba(255,255,255,0.2)',
              borderColor: 'rgba(255,255,255,0.2)',
            }}
          >
            <FiCreditCard size={16} className="text-white" />
            <span className="text-xs font-[Vazir-Bold] text-white">مدیریت مالی</span>
          </button>

          <button
            onClick={() => router.push('/manage/settings')}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border transition-all hover:opacity-80"
            style={{
              backgroundColor: 'rgba(255,255,255,0.2)',
              borderColor: 'rgba(255,255,255,0.2)',
            }}
          >
            <FiSettings size={16} className="text-white" />
            <span className="text-xs font-[Vazir-Bold] text-white">تنظیمات</span>
          </button>
        </div>

        {/* ✅ هشدار ثبت حساب بانکی */}
        {needsBankRegistration && (
          <button
            onClick={() => router.push('/manage/financial')}
            className="w-full flex items-center gap-2.5 p-3 rounded-xl border transition-all hover:opacity-90 active:scale-[0.99]"
            style={{
              backgroundColor: '#FF980015',
              borderColor: '#FF980040',
            }}
          >
            <FiAlertTriangle size={16} color="#FF9800" className="flex-shrink-0" />
            <span
              className="text-[11px] font-[Vazir-Bold] leading-[18px] flex-1 text-right"
              style={{ color: '#FF9800' }}
            >
              برای انجام فرآیند تسویه، حساب بانکی خود را ثبت کنید.
            </span>
          </button>
        )}
      </div>
    </div>
  );
}
