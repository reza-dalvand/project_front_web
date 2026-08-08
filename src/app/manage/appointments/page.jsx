'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/stores/useThemeStore';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import ScreenWrapper from '@/components/common/ScreenWrapper';
import Header from '@/components/common/Header';
import EmptyState from '@/components/common/EmptyState';
import AppointmentFilters from '@/components/manageBusiness/AppointmentFilters';
import AppointmentSearchBar from '@/components/manageBusiness/AppointmentSearchBar';
import AppointmentCard from '@/components/manageBusiness/AppointmentCard';
import VerifyCodeModal from '@/components/manageBusiness/VerifyCodeModal';
import CancelReasonModal from '@/components/manageBusiness/CancelReasonModal';
import AppointmentDetailSheet from '@/components/manageBusiness/AppointmentDetailSheet';
import { useAppointmentsManager } from '@/hooks/useAppointmentsManager';

export default function AllAppointmentsPage() {
  const { colors } = useTheme();
  const router = useRouter();
  const { isAuthenticated } = useRequireAuth({ redirectToLogin: true });

  // تمام منطق از Hook
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
    handleCancel,
  } = useAppointmentsManager();

  // فقط State مدال‌ها در صفحه
  const [verifyTarget, setVerifyTarget] = useState(null);
  const [verifyVisible, setVerifyVisible] = useState(false);
  const [cancelTarget, setCancelTarget] = useState(null);
  const [cancelVisible, setCancelVisible] = useState(false);
  const [selectedApt, setSelectedApt] = useState(null);
  const [detailVisible, setDetailVisible] = useState(false);

  // ═══ هندلرهای مدال ═══
  const openDetail = (apt) => {
    setSelectedApt(apt);
    setDetailVisible(true);
  };
  const closeDetail = () => {
    setDetailVisible(false);
    setTimeout(() => setSelectedApt(null), 300);
  };

  const openVerify = (apt) => {
    setVerifyTarget(apt);
    setVerifyVisible(true);
  };
  const confirmVerify = (aptId) => {
    handleVerify(aptId);
    setVerifyVisible(false);
    setVerifyTarget(null);
  };

  const openCancel = (apt) => {
    setCancelTarget(apt);
    setCancelVisible(true);
  };
  const confirmCancel = (aptId, reason) => {
    handleCancel(aptId, reason);
    setCancelVisible(false);
    setCancelTarget(null);
  };

  // ═══ تنظیمات حالت خالی ═══
  const getEmptyConfig = () => {
    if (searchQuery || dateFilter) {
      return {
        icon: '🔍',
        title: 'نتیجه‌ای یافت نشد',
        description: 'فیلترهای جستجو را تغییر دهید',
      };
    }
    const configs = {
      all: {
        icon: '📅',
        title: 'هنوز نوبتی ثبت نشده',
        description: 'پس از رزرو اولین نوبت، اینجا نمایش داده می‌شود',
      },
      reserved: {
        icon: '📋',
        title: 'نوبت رزرو شده‌ای وجود ندارد',
        description: 'در حال حاضر نوبت فعالی نیست',
      },
      cancelled: {
        icon: '❌',
        title: 'نوبت لغو شده‌ای وجود ندارد',
        description: 'هیچ نوبتی لغو نشده',
      },
      done: {
        icon: '✅',
        title: 'نوبت انجام شده‌ای وجود ندارد',
        description: 'هنوز خدمتی تکمیل نشده',
      },
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
      <Header title="همه نوبت‌ها" onBackPress={() => router.push('/manage')} />

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
                onDetails={openDetail}
                onVerify={openVerify}
                onCancel={openCancel}
              />
            ))}
          </div>
        ) : (
          <EmptyState {...getEmptyConfig()} />
        )}
      </div>

      {/* مدال تایید کد */}
      <VerifyCodeModal
        visible={verifyVisible}
        appointment={verifyTarget}
        onClose={() => {
          setVerifyVisible(false);
          setVerifyTarget(null);
        }}
        onConfirm={confirmVerify}
      />

      {/* مدال دلیل لغو */}
      <CancelReasonModal
        visible={cancelVisible}
        appointment={cancelTarget}
        onClose={() => {
          setCancelVisible(false);
          setCancelTarget(null);
        }}
        onConfirm={confirmCancel}
      />

      {/* شیت جزئیات */}
      <AppointmentDetailSheet
        visible={detailVisible}
        appointment={selectedApt}
        onClose={closeDetail}
      />
    </ScreenWrapper>
  );
}
