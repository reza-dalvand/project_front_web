'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/stores/useThemeStore';
import { useBusinessStore } from '@/stores/useBusinessStore';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { useToast } from '@/hooks/useToast';
import ScreenWrapper from '@/components/common/ScreenWrapper';
import Header from '@/components/common/Header';
import EmptyState from '@/components/common/EmptyState';
import AppointmentFilters from '@/components/manageBusiness/AppointmentFilters';
import AppointmentSearchBar from '@/components/manageBusiness/AppointmentSearchBar';
import AppointmentCard from '@/components/manageBusiness/AppointmentCard';
import VerifyCodeModal from '@/components/manageBusiness/VerifyCodeModal';
import CancelReasonModal from '@/components/manageBusiness/CancelReasonModal';
import { todayJalaali } from '@/utils/dateUtils';
import AppointmentDetailSheet from '@/components/manageBusiness/AppointmentDetailSheet';

// دیتای موقت نوبت‌ها
const MOCK_APPOINTMENTS = [
  {
    id: 'apt_1',
    customerName: 'نازنین کریمی',
    customerPhone: '09121112233',
    serviceName: 'فیشیال تخصصی پوست',
    employeeName: 'سارا احمدی',
    date: { jy: 1403, jm: 4, jd: 20 },
    time: '۱۰:۳۰',
    status: 'reserved',
    price: 675000,
    depositPaid: 200000,
    verificationCode: '5892',
  },
  {
    id: 'apt_2',
    customerName: 'الهام محمدی',
    customerPhone: '09124445566',
    serviceName: 'کاشت ناخن ژله‌ای',
    employeeName: 'مریم رضایی',
    date: { jy: 1403, jm: 4, jd: 20 },
    time: '۱۴:۳۰',
    status: 'reserved',
    price: 450000,
    depositPaid: 100000,
    verificationCode: '2571',
  },
  {
    id: 'apt_3',
    customerName: 'زهرا حسینی',
    customerPhone: '09127778899',
    serviceName: 'لیزر فول بادی',
    employeeName: 'دکتر رضایی',
    date: { jy: 1403, jm: 4, jd: 18 },
    time: '۱۶:۰۰',
    status: 'done',
    price: 2125000,
    depositPaid: 500000,
    verificationCode: '7456',
  },
  {
    id: 'apt_4',
    customerName: 'مریم احمدی',
    customerPhone: '09123334455',
    serviceName: 'رنگ و لایت مو',
    employeeName: 'الناز کریمی',
    date: { jy: 1403, jm: 4, jd: 17 },
    time: '۱۱:۰۰',
    status: 'cancelled_by_salon',
    price: 1440000,
    depositPaid: 300000,
    cancellationReason: 'سالن در این تاریخ تعطیل است',
    refundAmount: 300000,
  },
  {
    id: 'apt_5',
    customerName: 'سمیرا قاسمی',
    customerPhone: '09126665544',
    serviceName: 'فیشیال VIP عروس',
    employeeName: 'سارا احمدی',
    date: { jy: 1403, jm: 4, jd: 22 },
    time: '۰۹:۰۰',
    status: 'reserved',
    price: 950000,
    depositPaid: 300000,
    verificationCode: '8147',
  },
];

export default function AllAppointmentsPage() {
  const { colors } = useTheme();
  const router = useRouter();
  const { isAuthenticated } = useRequireAuth({ redirectToLogin: true });
  const { showToast } = useToast();

  const [appointments, setAppointments] = useState(MOCK_APPOINTMENTS);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState(null);
  const [verifyTarget, setVerifyTarget] = useState(null);
  const [verifyVisible, setVerifyVisible] = useState(false);
  const [cancelTarget, setCancelTarget] = useState(null);
  const [cancelVisible, setCancelVisible] = useState(false);
  const [selectedApt, setSelectedApt] = useState(null);
  const [detailVisible, setDetailVisible] = useState(false);
  // فیلتر نوبت‌ها
  const filteredAppointments = useMemo(() => {
    let result = appointments;

    if (activeFilter !== 'all') {
      if (activeFilter === 'cancelled') {
        result = result.filter((a) => a.status === 'cancelled_by_salon');
      } else {
        result = result.filter((a) => a.status === activeFilter);
      }
    }

    if (searchQuery.trim()) {
      const query = searchQuery.trim().toLowerCase();
      result = result.filter(
        (a) =>
          a.customerName.toLowerCase().includes(query) ||
          a.serviceName.toLowerCase().includes(query) ||
          a.employeeName.toLowerCase().includes(query) ||
          a.customerPhone.includes(query)
      );
    }

    if (dateFilter) {
      const today = todayJalaali();
      result = result.filter((a) => {
        const aptDate = a.date;
        if (dateFilter === 'today') {
          return aptDate.jy === today.jy && aptDate.jm === today.jm && aptDate.jd === today.jd;
        }
        if (dateFilter === 'week') {
          return aptDate.jd >= today.jd && aptDate.jd <= today.jd + 7;
        }
        if (dateFilter === 'month') {
          return aptDate.jm === today.jm;
        }
        return true;
      });
    }

    return result;
  }, [appointments, activeFilter, searchQuery, dateFilter]);

  // شمارش‌ها
  const counts = useMemo(
    () => ({
      all: appointments.length,
      reserved: appointments.filter((a) => a.status === 'reserved').length,
      cancelled: appointments.filter((a) => a.status === 'cancelled_by_salon').length,
      done: appointments.filter((a) => a.status === 'done').length,
    }),
    [appointments]
  );

  // هندلرها
  const handleOpenVerify = (apt) => {
    setVerifyTarget(apt);
    setVerifyVisible(true);
  };

  const handleConfirmVerify = (aptId) => {
    setAppointments((prev) =>
      prev.map((a) =>
        a.id === aptId ? { ...a, status: 'done', verifiedAt: new Date().toISOString() } : a
      )
    );
    setVerifyVisible(false);
    setVerifyTarget(null);
    showToast('✓ خدمت تایید شد • بیعانه به حساب شما واریز می‌شود', 'success');
  };

  const handleOpenCancel = (apt) => {
    setCancelTarget(apt);
    setCancelVisible(true);
  };

  const handleConfirmCancel = (aptId, reason) => {
    setAppointments((prev) =>
      prev.map((a) =>
        a.id === aptId
          ? {
              ...a,
              status: 'cancelled_by_salon',
              cancellationReason: reason,
              refundAmount: a.depositPaid,
            }
          : a
      )
    );
    setCancelVisible(false);
    setCancelTarget(null);
    showToast('نوبت لغو شد • بیعانه به مشتری مسترد می‌شود', 'info');
  };
  const openDetail = (apt) => {
    setSelectedApt(apt);
    setDetailVisible(true);
  };

  const closeDetail = () => {
    setDetailVisible(false);
    setTimeout(() => setSelectedApt(null), 300);
  };

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
        {filteredAppointments.length > 0 ? (
          <div className="flex flex-col gap-3">
            {filteredAppointments.map((apt) => (
              <AppointmentCard
                key={apt.id}
                appointment={apt}
                onDetails={openDetail}
                onVerify={handleOpenVerify}
                onCancel={handleOpenCancel}
              />
            ))}
          </div>
        ) : (
          <EmptyState {...getEmptyConfig()} />
        )}
      </div>

      {/* مدال‌ها */}
      <VerifyCodeModal
        visible={verifyVisible}
        appointment={verifyTarget}
        onClose={() => {
          setVerifyVisible(false);
          setVerifyTarget(null);
        }}
        onConfirm={handleConfirmVerify}
      />

      <CancelReasonModal
        visible={cancelVisible}
        appointment={cancelTarget}
        onClose={() => {
          setCancelVisible(false);
          setCancelTarget(null);
        }}
        onConfirm={handleConfirmCancel}
      />
      <AppointmentDetailSheet
        visible={detailVisible}
        appointment={selectedApt}
        onClose={closeDetail}
      />
    </ScreenWrapper>
  );
}
