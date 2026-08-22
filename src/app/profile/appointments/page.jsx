// src/app/profile/appointments/page.jsx
'use client';

import { useState, useMemo, useEffect } from 'react';
import { FiFilter } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import { useToast } from '@/hooks/useToast';
import EmptyState from '@/components/common/EmptyState';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { AppointmentCompactCard } from '@/components/profile/appointments';
import dynamic from 'next/dynamic';
import { appointmentsService } from '@/api';

const AppointmentDetailModal = dynamic(
  () => import('@/components/profile/appointments/AppointmentDetailModal'),
  { ssr: false, loading: () => null }
);

const CancelAppointmentModal = dynamic(
  () => import('@/components/profile/appointments/CancelAppointmentModal'),
  { ssr: false, loading: () => null }
);

export default function AppointmentsPage() {
  const { colors } = useTheme();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState('upcoming');
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [detailVisible, setDetailVisible] = useState(false);
  const [cancelTarget, setCancelTarget] = useState(null);
  const [cancelVisible, setCancelVisible] = useState(false);
  const [copiedCode, setCopiedCode] = useState(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      setIsLoading(true);
      try {
        const result = await appointmentsService.getMyAppointments(activeTab);
        setAppointments(result.data || []);
      } catch (err) {
        console.error('Failed to fetch appointments:', err);
        showToast('خطا در دریافت نوبت‌ها', 'error');
      } finally {
        setIsLoading(false);
      }
    };
    fetchAppointments();
  }, [activeTab]);

  const stats = {
    upcoming: appointments.filter((a) => a.isUpcoming).length,
    past: appointments.filter((a) => !a.isUpcoming).length,
  };

  const handleCopyCode = async (code) => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(code);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = code;
        textarea.style.position = 'fixed';
        textarea.style.left = '-9999px';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopiedCode(code);
      showToast('کد تایید کپی شد', 'success');
      setTimeout(() => setCopiedCode(null), 2000);
    } catch {
      showToast('امکان کپی وجود ندارد', 'error');
    }
  };

  const handleOpenDetail = (apt) => {
    setSelectedAppointment(apt);
    setDetailVisible(true);
  };

  const handleCancelRequest = (apt) => {
    setDetailVisible(false);
    setCancelTarget(apt);
    setTimeout(() => setCancelVisible(true), 200);
  };

  // ✅ حذف USE_MOCK — فقط API
  const handleConfirmCancel = async (aptId) => {
    try {
      await appointmentsService.cancelAppointment(aptId);
    } catch (err) {
      showToast(err.message || 'خطا در لغو نوبت', 'error');
      return;
    }

    setAppointments((prev) =>
      prev.map((a) => (a.id === aptId ? { ...a, status: 'cancelled', isUpcoming: false } : a))
    );
    setCancelVisible(false);
    setCancelTarget(null);
    setSelectedAppointment(null);
    showToast('نوبت لغو شد. بیعانه ظرف ۴۸ ساعت واریز می‌شود.', 'success');
  };

  return (
    <div className="min-h-screen pb-20" style={{ backgroundColor: colors.background }}>
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
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 flex flex-col gap-3">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner label="در حال بارگذاری نوبت‌ها..." />
          </div>
        ) : appointments.length > 0 ? (
          appointments.map((apt) => (
            <AppointmentCompactCard
              key={apt.id}
              appointment={apt}
              onPress={handleOpenDetail}
              onCopyCode={handleCopyCode}
              copiedCode={copiedCode}
            />
          ))
        ) : (
          <EmptyState
            icon={activeTab === 'upcoming' ? '📅' : '📜'}
            title={activeTab === 'upcoming' ? 'نوبت آینده‌ای ندارید' : 'سابقه‌ای ثبت نشده'}
            description={
              activeTab === 'upcoming'
                ? 'از صفحه کسب‌وکارها نوبت رزرو کنید'
                : 'پس از اولین رزرو، سابقه شما اینجا نمایش داده می‌شود'
            }
          />
        )}
      </div>

      <AppointmentDetailModal
        visible={detailVisible}
        appointment={selectedAppointment}
        onClose={() => {
          setDetailVisible(false);
          setSelectedAppointment(null);
        }}
        onCancelRequest={handleCancelRequest}
      />

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