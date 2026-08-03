'use client';

import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  FiSettings,
  FiCreditCard,
  FiMapPin,
  FiStar,
} from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import { useAuthStore } from '@/stores/useAuthStore';
import { useBusinessStore } from '@/stores/useBusinessStore';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { ScreenWrapper, Avatar } from '@/components/common';
import StatsSection from '@/components/manageBusiness/StatsSection';
import QuickAccessGrid from '@/components/manageBusiness/QuickAccessGrid';
import WeeklyRevenueChart from '@/components/manageBusiness/WeeklyRevenueChart';
import TodayAppointments from '@/components/manageBusiness/TodayAppointments';
import { toPersianDigit } from '@/utils/numberUtils';

export default function ManageBusinessPage() {
  const { colors } = useTheme();
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const businessData = useBusinessStore((s) => s.businessData);
  const { isAuthenticated } = useRequireAuth({ redirectToLogin: true });

  // خوشامدگویی بر اساس ساعت
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return { text: 'صبح بخیر', emoji: '🌅' };
    if (hour < 17) return { text: 'ظهر بخیر', emoji: '☀️' };
    return { text: 'عصر بخیر', emoji: '🌆' };
  }, []);

  // محاسبه آمار
  const stats = useMemo(() => {
    const appointments = businessData?.appointments || [];
    const todayJalaali = { jy: 1405, jm: 5, jd: 14 };

    const todayAppointments = appointments.filter(
      (apt) =>
        apt.date.jy === todayJalaali.jy &&
        apt.date.jm === todayJalaali.jm &&
        apt.date.jd === todayJalaali.jd
    ).length;

    const activeAppointments = appointments.filter(
      (apt) => apt.status === 'reserved' || apt.status === 'confirmed'
    ).length;

    return {
      todayAppointments,
      activeAppointments,
      totalBookings: appointments.length,
      monthlyRevenue: 20800000, // موقت
      rating: businessData?.rating || 4.9,
    };
  }, [businessData]);

  if (!isAuthenticated) {
    return (
      <ScreenWrapper>
        <div className="flex items-center justify-center min-h-screen">
          <p style={{ color: colors.textMain }}>در حال بارگذاری...</p>
        </div>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper scrollable padding={0}>
      {/* ═══════ هدر گرادیانی ═══════ */}
      <div
        className="relative overflow-hidden rounded-b-[32px] pt-6 pb-7 px-5"
        style={{
          background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
        }}
      >
        {/* دایره‌های تزئینی */}
        <div
          className="absolute -top-10 -left-10 w-44 h-44 rounded-full border-2"
          style={{ borderColor: 'rgba(255,255,255,0.15)' }}
        />
        <div
          className="absolute -bottom-14 -right-14 w-52 h-52 rounded-full border-2"
          style={{ borderColor: 'rgba(255,255,255,0.08)' }}
        />

        <div className="relative z-10 space-y-5">
          {/* خوشامدگویی */}
          <div>
            <p className="text-sm text-white/80 mb-1">
              {greeting.emoji} {greeting.text}
            </p>
            <h1 className="text-2xl font-[Vazir-Bold] text-white">
              {user?.name || 'مدیر سالن'}
            </h1>
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
              <p className="text-[11px] text-white/85 mt-0.5">
                {businessData?.category}
              </p>
              <div className="flex items-center gap-1 mt-1">
                <FiMapPin size={11} className="text-white/75" />
                <span className="text-[10px] text-white/75">
                  {businessData?.city}
                </span>
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
                {toPersianDigit(stats.rating.toFixed(1))}
              </span>
              <div className="flex items-center gap-0.5 my-1">
                <FiStar size={11} className="text-yellow-400 fill-yellow-400" />
                <FiStar size={11} className="text-yellow-400 fill-yellow-400" />
                <FiStar size={11} className="text-yellow-400 fill-yellow-400" />
                <FiStar size={11} className="text-yellow-400 fill-yellow-400" />
                <FiStar size={11} className="text-yellow-400 fill-yellow-400" />
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
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border"
              style={{
                backgroundColor: 'rgba(255,255,255,0.2)',
                borderColor: 'rgba(255,255,255,0.2)',
              }}
            >
              <FiCreditCard size={16} className="text-white" />
              <span className="text-xs font-[Vazir-Bold] text-white">
                کیف پول
              </span>
            </button>
            <button
              onClick={() => router.push('/manage/settings')}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border"
              style={{
                backgroundColor: 'rgba(255,255,255,0.2)',
                borderColor: 'rgba(255,255,255,0.2)',
              }}
            >
              <FiSettings size={16} className="text-white" />
              <span className="text-xs font-[Vazir-Bold] text-white">
                تنظیمات
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* ═══════ کارت‌های آماری ═══════ */}
      <StatsSection stats={stats} />

      {/* ═══════ نوبت‌های امروز ═══════ */}
      <TodayAppointments />

      {/* ═══════ نمودار درآمد هفتگی ═══════ */}
      <WeeklyRevenueChart />

      {/* ═══════ دسترسی سریع ═══════ */}
      <QuickAccessGrid
        onNavigate={(route) => router.push(route)}
        badge={stats.activeAppointments}
      />

      {/* فاصله پایین */}
      <div className="h-32" />
    </ScreenWrapper>
  );
}