// src/app/profile/appointments/page.jsx
'use client';
import { useState, useEffect, useCallback } from 'react';
import { FiCalendar, FiClock, FiXCircle, FiChevronLeft } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { useToast } from '@/hooks/useToast';
import EmptyState from '@/components/common/EmptyState';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { appointmentsService } from '@/api';
import { toPersianDigit } from '@/utils/numberUtils';
import dynamic from 'next/dynamic';

const AppointmentDetailModal = dynamic(
  () => import('@/components/profile/appointments/AppointmentDetailModal'),
  { ssr: false, loading: () => null }
);

const CancelAppointmentModal = dynamic(
  () => import('@/components/profile/appointments/CancelAppointmentModal'),
  { ssr: false, loading: () => null }
);

// ═══════ تنظیمات تب‌ها ═══════
const TABS = [
  { id: 'upcoming', label: 'آینده', icon: FiCalendar, color: '#2196F3' },
  { id: 'past', label: 'گذشته', icon: FiClock, color: '#4CAF50' },
  { id: 'cancelled', label: 'لغو شده', icon: FiXCircle, color: '#E53935' },
];

// ═══════ وضعیت‌های نوبت ═══════
const STATUS_CONFIG = {
  reserved: { label: 'رزرو شده', color: '#2196F3' },
  done: { label: 'انجام شده', color: '#4CAF50' },
  cancelled_by_salon: { label: 'لغو توسط سالن', color: '#E53935' },
  cancelled_by_customer: { label: 'لغو توسط شما', color: '#FF9800' },
};

// ═══════ ایموجی خدمت ═══════
const getServiceEmoji = (name = '') => {
  if (name.includes('ناخن')) return '💅';
  if (name.includes('میکاپ') || name.includes('گریم')) return '💄';
  if (name.includes('فیشیال') || name.includes('پوست')) return '✨';
  if (name.includes('لیزر')) return '⚡';
  if (name.includes('مو') || name.includes('رنگ')) return '🎨';
  if (name.includes('مژه') || name.includes('ابرو')) return '👁️';
  if (name.includes('ماساژ')) return '💆‍♀️';
  return '💆‍♀️';
};

export default function AppointmentsPage() {
  const { colors } = useTheme();
  const { isAuthenticated } = useRequireAuth({ redirectToLogin: true });
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState('upcoming');
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [detailVisible, setDetailVisible] = useState(false);
  const [cancelTarget, setCancelTarget] = useState(null);
  const [cancelVisible, setCancelVisible] = useState(false);
  const [copiedCode, setCopiedCode] = useState(null);

  // ═══════ دریافت نوبت‌ها ═══════
  const fetchAppointments = useCallback(async (status) => {
    setIsLoading(true);
    try {
      const result = await appointmentsService.getMyAppointments(status);
      const mapped = (result.data || []).map((apt) => ({
        id: apt.id,
        businessName: apt.businessName || apt.business_name || '',
        serviceName: apt.serviceName || apt.service_name || '',
        date: apt.dateKey || apt.date_key || '',
        dateObj: apt.jm && apt.jd ? { jy: apt.jy, jm: apt.jm, jd: apt.jd } : null,
        time: apt.timeSlot || apt.time_slot || '',
        status: apt.status || '',
        totalPrice: apt.totalPrice || apt.total_price || 0,
        depositPaid: apt.depositPaid || apt.deposit_paid || 0,
        verificationCode: apt.verificationCode || apt.verification_code || null,
        isUpcoming: apt.isUpcoming ?? apt.is_upcoming ?? false,
        canCancel: apt.canCancel ?? apt.can_cancel ?? false,
        hoursLeft: apt.hoursLeft ?? apt.hours_left ?? null,
        trustBased: apt.trustBased ?? apt.trust_based ?? false,
        isVerified: apt.isVerified ?? apt.is_verified ?? false,
        cancellationReason: apt.cancellationReason || apt.cancellation_reason || '',
      }));
      setAppointments(mapped);
    } catch (err) {
      console.error('Failed to fetch appointments:', err);
      showToast('خطا در دریافت نوبت‌ها', 'error');
      setAppointments([]);
    } finally {
      setIsLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchAppointments(activeTab);
  }, [activeTab, fetchAppointments]);

  // ═══════ هندلرها ═══════
  const handleCopyCode = async (code) => {
    try {
      await navigator.clipboard.writeText(code);
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

  const handleConfirmCancel = async (aptId, reason) => {
    try {
      await appointmentsService.cancelAppointment(aptId, reason);
      showToast('نوبت لغو شد. بیعانه ظرف ۴۸ ساعت واریز می‌شود.', 'success');
      setCancelVisible(false);
      setCancelTarget(null);
      // رفرش لیست
      fetchAppointments(activeTab);
    } catch (err) {
      showToast(err.message || 'خطا در لغو نوبت', 'error');
    }
  };

  // ═══════ رندر ═══════
  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p style={{ color: colors.textMain }}>در حال بارگذاری...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24" style={{ backgroundColor: colors.background }}>
      {/* ═══ هدر + تب‌ها ═══ */}
      <div
        className="px-4 pt-4 pb-3 border-b sticky top-0 z-20"
        style={{ backgroundColor: colors.background, borderBottomColor: colors.border }}
      >
        <h2 className="text-base font-[Vazir-Bold] mb-3" style={{ color: colors.textMain }}>
          نوبت‌های من
        </h2>
        {/* تب‌ها */}
        <div
          className="flex p-1 rounded-xl border gap-1"
          style={{ backgroundColor: colors.cardBackground, borderColor: colors.border }}
        >
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg transition-colors"
                style={{
                  backgroundColor: isActive ? tab.color + '18' : 'transparent',
                }}
              >
                <Icon size={15} style={{ color: isActive ? tab.color : colors.textSecondary }} />
                <span
                  className="text-[13px] font-[Vazir-Bold]"
                  style={{ color: isActive ? tab.color : colors.textMain }}
                >
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ═══ لیست نوبت‌ها ═══ */}
      <div className="px-4 py-4 space-y-3">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner label="در حال بارگذاری نوبت‌ها..." />
          </div>
        ) : appointments.length === 0 ? (
          <EmptyState
            icon={activeTab === 'upcoming' ? '📅' : activeTab === 'past' ? '📜' : '🚫'}
            title={
              activeTab === 'upcoming'
                ? 'نوبت آینده‌ای ندارید'
                : activeTab === 'past'
                ? 'نوبت گذشته‌ای ثبت نشده'
                : 'نوبت لغو شده‌ای وجود ندارد'
            }
            description={
              activeTab === 'upcoming'
                ? 'از صفحه کسب‌وکارها نوبت رزرو کنید'
                : activeTab === 'past'
                ? 'پس از انجام اولین نوبت، اینجا نمایش داده می‌شود'
                : 'هنوز نوبتی لغو نشده است'
            }
          />
        ) : (
          appointments.map((apt) => (
            <AppointmentCard
              key={apt.id}
              appointment={apt}
              onPress={handleOpenDetail}
              onCopyCode={handleCopyCode}
              copiedCode={copiedCode}
              activeTab={activeTab}
            />
          ))
        )}
      </div>

      {/* ═══ مدال‌ها ═══ */}
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

// ═══════════════════════════════════════════════════════
//    کارت نوبت
// ═══════════════════════════════════════════════════════
function AppointmentCard({ appointment, onPress, onCopyCode, copiedCode, activeTab }) {
  const { colors } = useTheme();
  const status = STATUS_CONFIG[appointment.status] || STATUS_CONFIG.reserved;
  const showCode =
    appointment.isUpcoming &&
    appointment.status === 'reserved' &&
    appointment.verificationCode &&
    appointment.verificationCode !== '0000';

  return (
    <div
      className="rounded-2xl border overflow-hidden transition-all hover:shadow-sm"
      style={{ backgroundColor: colors.cardBackground, borderColor: colors.border }}
    >
      {/* بدنه اصلی */}
      <button
        onClick={() => onPress(appointment)}
        className="w-full flex items-center gap-3 p-3.5 text-right active:bg-black/[0.02]"
      >
        {/* آیکن خدمت */}
        <div
          className="relative flex-shrink-0 w-[46px] h-[46px] rounded-xl flex items-center justify-center text-2xl"
          style={{ backgroundColor: colors.primary + '15' }}
        >
          {getServiceEmoji(appointment.serviceName)}
          {/* نقطه وضعیت */}
          <div
            className="absolute -bottom-0.5 -left-0.5 w-3 h-3 rounded-full border-2"
            style={{ backgroundColor: status.color, borderColor: colors.cardBackground }}
          />
        </div>

        {/* اطلاعات */}
        <div className="flex-1 min-w-0 flex flex-col gap-1.5">
          <span className="text-sm font-[Vazir-Bold] truncate" style={{ color: colors.textMain }}>
            {appointment.businessName}
          </span>
          <div className="flex items-center gap-3">
            <span className="text-[11px] font-[Vazir]" style={{ color: colors.textSecondary }}>
              📅 {appointment.date}
            </span>
            <span className="text-[11px] font-[Vazir]" style={{ color: colors.textSecondary }}>
              🕐 {appointment.time}
            </span>
          </div>
          <span className="text-[11px] font-[Vazir] truncate" style={{ color: colors.textSecondary }}>
            {appointment.serviceName}
          </span>
        </div>

        {/* وضعیت + فلش */}
        <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
          <span
            className="flex items-center gap-1 text-[10px] font-[Vazir-Bold] px-2.5 py-1.5 rounded-lg"
            style={{ backgroundColor: status.color + '18', color: status.color }}
          >
            {status.label}
          </span>
          <FiChevronLeft size={16} style={{ color: colors.textSecondary }} />
        </div>
      </button>

      {/* کد تایید - فقط نوبت‌های آینده */}
      {showCode && activeTab === 'upcoming' && (
        <div
          className="flex items-center gap-2.5 px-3.5 py-2.5 border-t"
          style={{ borderColor: colors.border, backgroundColor: colors.background }}
        >
          <span className="text-[10px] font-[Vazir] flex-shrink-0" style={{ color: colors.textSecondary }}>
            کد تایید:
          </span>
          <div className="flex items-center gap-1" dir="ltr">
            {appointment.verificationCode.split('').map((digit, idx) => (
              <span
                key={idx}
                className="w-[22px] h-[26px] rounded-md border flex items-center justify-center text-xs font-[Vazir-Bold]"
                style={{
                  borderColor: colors.primary + '40',
                  color: colors.primary,
                  backgroundColor: colors.cardBackground,
                }}
              >
                {digit}
              </span>
            ))}
          </div>
          <div className="flex-1" />
          <button
            onClick={(e) => {
              e.stopPropagation();
              onCopyCode(appointment.verificationCode);
            }}
            className="w-7 h-7 rounded-lg flex items-center justify-center transition-all hover:scale-110"
            style={{
              backgroundColor:
                copiedCode === appointment.verificationCode ? '#4CAF5020' : colors.primary + '15',
            }}
          >
            {copiedCode === appointment.verificationCode ? (
              <span className="text-xs" style={{ color: '#4CAF50' }}>✓</span>
            ) : (
              <span className="text-xs" style={{ color: colors.primary }}>📋</span>
            )}
          </button>
        </div>
      )}

      {/* دلیل لغو - فقط تب لغو شده */}
      {activeTab === 'cancelled' && appointment.cancellationReason && (
        <div
          className="flex items-start gap-2 px-3.5 py-2.5 border-t"
          style={{ borderColor: colors.border, backgroundColor: '#E5393508' }}
        >
          <FiXCircle size={13} color="#E53935" className="flex-shrink-0 mt-0.5" />
          <span className="text-[11px] font-[Vazir] leading-4" style={{ color: colors.textSecondary }}>
            {appointment.cancellationReason}
          </span>
        </div>
      )}
    </div>
  );
}