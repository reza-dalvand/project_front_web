'use client';
import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { FiAlertTriangle, FiPhone, FiMessageCircle } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import { useAuthStore } from '@/stores/useAuthStore';
import { useBusinessStore } from '@/stores/useBusinessStore';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { ScreenWrapper } from '@/components/common';
import QuickAccessGrid from '@/components/manageBusiness/QuickAccessGrid';
import ManageHeader from '@/components/manageBusiness/ManageHeader';
import { AppointmentsList } from '@/components/manageBusiness/appointments';

export default function ManageBusinessPage() {
  const { colors } = useTheme();
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const businessData = useBusinessStore((s) => s.businessData);
  const { isAuthenticated } = useRequireAuth({ redirectToLogin: true });

  const stats = useMemo(() => {
    const appointments = businessData?.appointments || [];
    const activeAppointments = appointments.filter(
      (apt) =>
        apt.status === 'reserved' ||
        apt.status === 'confirmed' ||
        apt.status === 'pending_verification'
    ).length;
    return { activeAppointments };
  }, [businessData]);

  // ✅ NEW: بررسی وضعیت تعلیق
  const isSuspended = businessData?.isSuspended ?? false;
  const suspensionReason = businessData?.suspensionReason ?? '';

  // ✅ NEW: دکمه‌های تماس با پشتیبانی
  const handleWhatsApp = () => {
    const message = encodeURIComponent(
      `سلام، کسب‌وکار من تعلیق شده است.\nدلیل: ${suspensionReason}\nلطفاً راهنمایی کنید.`
    );
    window.open(`https://wa.me/989120000000?text=${message}`, '_blank');
  };

  const handleTelegram = () => {
    window.open('https://t.me/beauclub_support', '_blank');
  };

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
      {/* ✅ NEW: بنر هشدار تعلیق */}
      {isSuspended && (
        <div
          className="mx-5 mt-5 mb-3 p-4 rounded-2xl shadow-md"
          style={{
            background: 'linear-gradient(135deg, #FFF3E0 0%, #FFE0B2 100%)',
            border: '2px solid #FF9800',
          }}
        >
          <div className="flex items-start gap-3 mb-3">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: '#FF9800' }}
            >
              <FiAlertTriangle size={24} color="white" />
            </div>
            <div className="flex-1">
              <h3
                className="text-base font-[Vazir-Bold] mb-1"
                style={{ color: '#E65100' }}
              >
                کسب‌وکار شما تعلیق شده است
              </h3>
              {suspensionReason && (
                <p
                  className="text-sm mb-2 font-[Vazir]"
                  style={{ color: '#BF360C' }}
                >
                  <strong>دلیل:</strong> {suspensionReason}
                </p>
              )}
              <p
                className="text-xs font-[Vazir]"
                style={{ color: '#E65100' }}
              >
                لطفاً برای رفع تعلیق با پشتیبانی در ارتباط باشید.
              </p>
            </div>
          </div>

          {/* دکمه‌های تماس */}
          <div className="flex gap-2 mt-3">
            <button
              onClick={handleWhatsApp}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-[Vazir-Bold] text-sm text-white transition-all hover:scale-[1.02] active:scale-[0.98]"
              style={{ backgroundColor: '#25D366' }}
            >
              <FiMessageCircle size={18} />
              <span>واتساپ</span>
            </button>
            <button
              onClick={handleTelegram}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-[Vazir-Bold] text-sm text-white transition-all hover:scale-[1.02] active:scale-[0.98]"
              style={{ backgroundColor: '#0088CC' }}
            >
              <FiPhone size={18} />
              <span>تلگرام</span>
            </button>
          </div>
        </div>
      )}

      {/* هدر گرادیانی */}
      <ManageHeader />

      {/* لیست ترتیبی نوبت‌های امروز */}
      <AppointmentsList />

      {/* دسترسی سریع */}
      <QuickAccessGrid
        onNavigate={(route) => router.push(route)}
        badge={stats.activeAppointments}
      />

      {/* فاصله پایین */}
      <div className="h-32" />
    </ScreenWrapper>
  );
}