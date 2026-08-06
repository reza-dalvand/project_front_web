// src/app/manage/page.jsx
'use client';
import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/stores/useThemeStore';
import { useAuthStore } from '@/stores/useAuthStore';
import { useBusinessStore } from '@/stores/useBusinessStore';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { ScreenWrapper } from '@/components/common';
import QuickAccessGrid from '@/components/manageBusiness/QuickAccessGrid';
import TodayScheduleTimeline from '@/components/manageBusiness/TodayScheduleTimeline';
import ManageHeader from '@/components/manageBusiness/ManageHeader';

export default function ManageBusinessPage() {
  const { colors } = useTheme();
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const businessData = useBusinessStore((s) => s.businessData);
  const { isAuthenticated } = useRequireAuth({ redirectToLogin: true });

  const stats = useMemo(() => {
    const appointments = businessData?.appointments || [];
    const activeAppointments = appointments.filter(
      (apt) => apt.status === 'reserved' || apt.status === 'confirmed'
    ).length;
    return { activeAppointments };
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

      {/* ═══════ تقویم ساعتی نوبت‌های امروز ═══════ */}
      <TodayScheduleTimeline />

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