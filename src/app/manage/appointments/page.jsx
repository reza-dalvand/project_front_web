// src/app/manage/appointments/page.jsx
'use client';
import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { useTheme } from '@/stores/useThemeStore';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import ScreenWrapper from '@/components/common/ScreenWrapper';
import Header from '@/components/common/Header';
import EmptyState from '@/components/common/EmptyState';
import AppointmentFilters from '@/components/manageBusiness/AppointmentFilters';
import AppointmentSearchBar from '@/components/manageBusiness/AppointmentSearchBar';
import AppointmentCard from '@/components/manageBusiness/AppointmentCard';
import { useAppointmentsManager } from '@/hooks/useAppointmentsManager';

// ✅ Lazy Load — مودال‌های سنگین
const AppointmentDetailSheet = dynamic(
  () => import('@/components/manageBusiness/AppointmentDetailSheet'),
  { ssr: false, loading: () => null }
);

const VerifyCodeModal = dynamic(
  () => import('@/components/manageBusiness/VerifyCodeModal'),
  { ssr: false, loading: () => null }
);

const CancelReasonModal = dynamic(
  () => import('@/components/manageBusiness/CancelReasonModal'),
  { ssr: false, loading: () => null }
);

export default function AllAppointmentsPage() {
  const { colors } = useTheme();
  const router = useRouter();
  const { isAuthenticated } = useRequireAuth({ redirectToLogin: true });
  const {
    appointments,
    counts,
    activeFilter,
    setActiveFilter,
    searchQuery,
    setSearchQuery,
    dateFilter,
    setDateFilter,
    handleVerify,
    handleTrustConfirm,
    handleCancel,
  } = useAppointmentsManager();

  const [selectedApt, setSelectedApt] = useState(null);
  const [detailVisible, setDetailVisible] = useState(false);
  const [verifyTarget, setVerifyTarget] = useState(null);
  const [verifyVisible, setVerifyVisible] = useState(false);
  const [cancelTarget, setCancelTarget] = useState(null);
  const [cancelVisible, setCancelVisible] = useState(false);

  // ═══ Handlers با useCallback ═══
  const openDetail = useCallback((apt) => {
    setSelectedApt(apt);
    setDetailVisible(true);
  }, []);

  const closeDetail = useCallback(() => {
    setDetailVisible(false);
    setTimeout(() => setSelectedApt(null), 300);
  }, []);

  const openVerify = useCallback((apt) => {
    setVerifyTarget(apt);
    setVerifyVisible(true);
  }, []);

  const confirmVerify = useCallback((aptId) => {
    handleVerify(aptId);
    setVerifyVisible(false);
    setVerifyTarget(null);
  }, [handleVerify]);

  const handleTrust = useCallback((apt) => {
    handleTrustConfirm(apt.id);
    setDetailVisible(false);
  }, [handleTrustConfirm]);

  const openCancel = useCallback((apt) => {
    setDetailVisible(false);
    setCancelTarget(apt);
    setCancelVisible(true);
  }, []);

  const confirmCancel = useCallback((aptId, reason) => {
    handleCancel(aptId, reason);
    setCancelVisible(false);
    setCancelTarget(null);
  }, [handleCancel]);

  const closeVerify = useCallback(() => {
    setVerifyVisible(false);
    setVerifyTarget(null);
  }, []);

  const closeCancel = useCallback(() => {
    setCancelVisible(false);
    setCancelTarget(null);
  }, []);

  const goBack = useCallback(() => router.push('/manage'), [router]);

  // ═══ حالت خالی ═══
  const getEmptyConfig = () => {
    if (searchQuery || dateFilter) {
      return { icon: '🔍', title: 'نتیجه‌ای یافت نشد', description: 'فیلترها را تغییر دهید' };
    }
    const configs = {
      all: { icon: '📅', title: 'هنوز نوبتی ثبت نشده', description: 'پس از رزرو اولین نوبت، اینجا نمایش داده می‌شود' },
      reserved: { icon: '📋', title: 'نوبت رزرو شده‌ای نیست', description: 'در حال حاضر نوبت فعالی وجود ندارد' },
      needs_code: { icon: '🔑', title: 'نوبتی بدون کد تایید نیست', description: 'همه نوبت‌ها اعتمادی هستند' },
      trust_based: { icon: '🛡️', title: 'نوبت اعتمادی نیست', description: 'هنوز مشتری‌ای گزینه اعتماد را فعال نکرده' },
      done: { icon: '✅', title: 'نوبت انجام شده‌ای نیست', description: 'هنوز خدمتی تکمیل نشده' },
      cancelled: { icon: '❌', title: 'نوبت لغو شده‌ای نیست', description: 'هیچ نوبتی لغو نشده' },
    };
    return configs[activeFilter] || configs.all;
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
    <ScreenWrapper padding={0}>
      <Header title="مدیریت نوبت‌ها" onBackPress={goBack} />
      <AppointmentSearchBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        dateFilter={dateFilter}
        onDateFilterChange={setDateFilter}
      />
      <AppointmentFilters activeFilter={activeFilter} counts={counts} onChange={setActiveFilter} />

      {/* لیست نوبت‌ها */}
      <div className="flex-1 overflow-y-auto p-4 pb-32">
        {appointments.length > 0 ? (
          <div className="flex flex-col gap-3">
            {appointments.map((apt) => (
              <AppointmentCard
                key={apt.id}
                appointment={apt}
                onPress={openDetail}
                onVerify={openVerify}
              />
            ))}
          </div>
        ) : (
          <EmptyState {...getEmptyConfig()} />
        )}
      </div>

      {/* مدال‌ها (Lazy) */}
      <AppointmentDetailSheet
        visible={detailVisible}
        appointment={selectedApt}
        onClose={closeDetail}
        onVerify={openVerify}
        onTrustConfirm={handleTrust}
        onCancel={openCancel}
      />
      <VerifyCodeModal
        visible={verifyVisible}
        appointment={verifyTarget}
        onClose={closeVerify}
        onConfirm={confirmVerify}
      />
      <CancelReasonModal
        visible={cancelVisible}
        appointment={cancelTarget}
        onClose={closeCancel}
        onConfirm={confirmCancel}
      />
    </ScreenWrapper>
  );
}