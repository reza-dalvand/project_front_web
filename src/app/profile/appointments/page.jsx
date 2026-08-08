'use client';
import { useState, useMemo } from 'react';
import { useTheme } from '@/stores/useThemeStore';
import { useToast } from '@/hooks/useToast';
import { toPersianDigit } from '@/utils/numberUtils';
import {
  AppointmentCompactCard,
  AppointmentDetailModal,
  CancelAppointmentModal,
} from '@/components/profile/appointments';

// ═══════ داده‌های موقت ═══════
const MOCK_APPOINTMENTS = [
  {
    id: 'apt_1',
    businessName: 'سالن زیبایی نیلارام',
    businessLogo: 'https://picsum.photos/100/100?random=21',
    serviceName: 'فیشیال تخصصی پوست',
    employeeName: 'سارا احمدی',
    date: '۱۴۰۳/۰۴/۱۵',
    time: '۱۰:۳۰',
    status: 'reserved',
    totalPrice: 675000,
    depositPaid: 200000,
    isUpcoming: true,
    hoursLeft: 28,
    verificationCode: '۵۸۹۲',
  },
  {
    id: 'apt_2',
    businessName: 'مرکز لیزر رویال',
    businessLogo: 'https://picsum.photos/100/100?random=25',
    serviceName: 'لیزر فول بادی',
    employeeName: 'دکتر رضایی',
    date: '۱۴۰۳/۰۴/۲۰',
    time: '۱۶:۰۰',
    status: 'reserved',
    totalPrice: 2125000,
    depositPaid: 500000,
    isUpcoming: true,
    hoursLeft: 6,
    verificationCode: '۲۵۷۱',
  },
  {
    id: 'apt_3',
    businessName: 'ناخن گالری پریا',
    businessLogo: 'https://picsum.photos/100/100?random=26',
    serviceName: 'کاشت ناخن ژلیش',
    employeeName: 'مریم',
    date: '۱۴۰۳/۰۳/۱۰',
    time: '۱۴:۰۰',
    status: 'done',
    totalPrice: 450000,
    depositPaid: 0,
    isUpcoming: false,
  },
];

export default function AppointmentsPage() {
  const { colors } = useTheme();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState('upcoming');
  const [appointments, setAppointments] = useState(MOCK_APPOINTMENTS);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [detailVisible, setDetailVisible] = useState(false);
  const [cancelTarget, setCancelTarget] = useState(null);
  const [cancelVisible, setCancelVisible] = useState(false);
  const [copiedCode, setCopiedCode] = useState(null);

  // ═══ فیلتر بر اساس تب ═══
  const filteredAppointments = useMemo(() => {
    if (activeTab === 'upcoming') {
      return appointments.filter((a) => a.isUpcoming);
    }
    return appointments.filter((a) => !a.isUpcoming);
  }, [activeTab, appointments]);

  const stats = {
    upcoming: appointments.filter((a) => a.isUpcoming).length,
    past: appointments.filter((a) => !a.isUpcoming).length,
  };

  // ═══ کپی کد تایید ═══
  const handleCopyCode = async (code) => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(code);
      } else {
        const ta = document.createElement('textarea');
        ta.value = code;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      }
      setCopiedCode(code);
      showToast('کد تایید کپی شد', 'success');
      setTimeout(() => setCopiedCode(null), 2000);
    } catch {
      showToast('امکان کپی وجود ندارد', 'error');
    }
  };

  // ═══ باز کردن جزئیات ═══
  const handleOpenDetail = (apt) => {
    setSelectedAppointment(apt);
    setDetailVisible(true);
  };

  // ═══ درخواست لغو (از مدال جزئیات) ═══
  const handleCancelRequest = (apt) => {
    setDetailVisible(false);
    setCancelTarget(apt);
    setTimeout(() => setCancelVisible(true), 200);
  };

  // ═══ تایید لغو ═══
  const handleConfirmCancel = (aptId) => {
    setAppointments((prev) =>
      prev.map((a) =>
        a.id === aptId ? { ...a, status: 'cancelled', isUpcoming: false } : a
      )
    );
    setCancelVisible(false);
    setCancelTarget(null);
    setSelectedAppointment(null);
    showToast('نوبت شما با موفقیت لغو شد. وجه ظرف ۴۸ ساعت واریز می‌شود.', 'success');
  };

  return (
    <div className="min-h-screen pb-20" style={{ backgroundColor: colors.background }}>
      {/* ═══ Tabs ═══ */}
      <div className="px-4 pt-3 pb-2">
        <div
          className="flex p-1 rounded-xl border gap-1"
          style={{ backgroundColor: colors.cardBackground, borderColor: colors.border }}
        >
          {[
            { id: 'upcoming', label: 'آینده', count: stats.upcoming },
            { id: 'past', label: 'گذشته', count: stats.past },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg transition-colors"
              style={{ backgroundColor: activeTab === tab.id ? colors.primary : 'transparent' }}
            >
              <span
                className="text-sm font-[Vazir-Bold]"
                style={{ color: activeTab === tab.id ? '#fff' : colors.textMain }}
              >
                {tab.label}
              </span>
              <span
                className="min-w-[22px] h-5 px-1.5 rounded-full flex items-center justify-center
                  text-[11px] font-[Vazir-Bold]"
                style={{
                  backgroundColor:
                    activeTab === tab.id ? 'rgba(255,255,255,0.3)' : colors.primary + '20',
                  color: activeTab === tab.id ? '#fff' : colors.primary,
                }}
              >
                {toPersianDigit(tab.count)}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* ═══ لیست نوبت‌ها ═══ */}
      <div className="p-4 flex flex-col gap-3">
        {filteredAppointments.length > 0 ? (
          filteredAppointments.map((apt) => (
            <AppointmentCompactCard
              key={apt.id}
              appointment={apt}
              onPress={handleOpenDetail}
              onCopyCode={handleCopyCode}
              copiedCode={copiedCode}
            />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <span className="text-5xl">{activeTab === 'upcoming' ? '📅' : '📜'}</span>
            <h3 className="text-lg font-[Vazir-Bold]" style={{ color: colors.textMain }}>
              {activeTab === 'upcoming' ? 'نوبت آینده‌ای ندارید' : 'سابقه‌ای ثبت نشده'}
            </h3>
          </div>
        )}
      </div>

      {/* ═══ مدال جزئیات ═══ */}
      <AppointmentDetailModal
        visible={detailVisible}
        appointment={selectedAppointment}
        onClose={() => {
          setDetailVisible(false);
          setSelectedAppointment(null);
        }}
        onCancelRequest={handleCancelRequest}
      />

      {/* ═══ مدال لغو ═══ */}
      <CancelAppointmentModal
        visible={cancelVisible}
        appointment={cancelTarget}
        onClose={() => {
          setCancelVisible(false);
          setCancelTarget(null);
        }}
        onConfirmCancel={handleConfirmCancel}
      />
    </div>
  );
}