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
import ManageHeader from '@/components/manageBusiness/ManageHeader';
import BusinessStatsCard from '@/components/manageBusiness/BusinessStatsCard';


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
      <ManageHeader />

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