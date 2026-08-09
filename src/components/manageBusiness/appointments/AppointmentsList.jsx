// src/components/manageBusiness/appointments/AppointmentsList.jsx
'use client';
import { useMemo, useState } from 'react';
import { FiCalendar } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import { useBusinessStore } from '@/stores/useBusinessStore';
import { useToast } from '@/hooks/useToast';
import { toPersianDigit } from '@/utils/numberUtils';
import { todayJalaali, PERSIAN_MONTHS, PERSIAN_WEEKDAYS } from '@/utils/dateUtils';
import AppointmentListItem from './AppointmentListItem';
// ✅ تغییر: import از کامپوننت ادغام‌شده
import VerifyCodeModal from '@/components/manageBusiness/VerifyCodeModal';

const timeToMinutes = (timeStr) => {
  if (!timeStr) return 0;
  const english = String(timeStr)
    .replace(/[۰-۹]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d))
    .replace(/[٠-٩]/g, (d) => '٠١٢٣٤٥٦٧٨٩'.indexOf(d));
  const parts = english.split(':');
  if (parts.length !== 2) return 0;
  const h = parseInt(parts[0], 10) || 0;
  const m = parseInt(parts[1], 10) || 0;
  return h * 60 + m;
};

export default function AppointmentsList() {
  const { colors } = useTheme();
  const { showToast } = useToast();
  const appointments = useBusinessStore((s) => s.businessData?.appointments) || [];
  const updateAppointmentStatus = useBusinessStore((s) => s.updateAppointmentStatus);
  const [verifyTarget, setVerifyTarget] = useState(null);
  const [verifyVisible, setVerifyVisible] = useState(false);

  const today = useMemo(() => todayJalaali(), []);

  const todayAppointments = useMemo(() => {
    const activeStatuses = ['reserved', 'confirmed', 'pending_verification'];
    const filtered = appointments.filter((apt) => activeStatuses.includes(apt.status));
    if (filtered.length === 0) return [];
    return [...filtered].sort((a, b) => {
      const aNeedsCode = a.status === 'pending_verification' ? 0 : 1;
      const bNeedsCode = b.status === 'pending_verification' ? 0 : 1;
      if (aNeedsCode !== bNeedsCode) return aNeedsCode - bNeedsCode;
      return timeToMinutes(a.time) - timeToMinutes(b.time);
    });
  }, [appointments]);

  const statusCounts = useMemo(() => {
    const counts = { confirmed: 0, pending_verification: 0 };
    todayAppointments.forEach((apt) => {
      if (apt.status === 'pending_verification') counts.pending_verification++;
      else counts.confirmed++;
    });
    return counts;
  }, [todayAppointments]);

  const weekdayName = PERSIAN_WEEKDAYS[(new Date().getDay() + 1) % 7];
  const dateLabel = `${weekdayName} ${toPersianDigit(today.jd)} ${PERSIAN_MONTHS[today.jm - 1]}`;

  const handlePress = (apt) => {
    if (apt.status === 'pending_verification') {
      setVerifyTarget(apt);
      setVerifyVisible(true);
    }
  };

  const handleVerifySuccess = (aptId) => {
    updateAppointmentStatus(aptId, 'done');
    setVerifyVisible(false);
    setVerifyTarget(null);
    showToast('✓ خدمت با موفقیت تایید شد', 'success');
  };

  if (todayAppointments.length === 0) {
    return (
      <div className="px-5 mt-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <FiCalendar size={18} style={{ color: colors.primary }} />
            <h2 className="text-base font-[Vazir-Bold]" style={{ color: colors.textMain }}>
              نوبت‌های امروز
            </h2>
          </div>
          <span className="text-xs font-[Vazir]" style={{ color: colors.textSecondary }}>
            {dateLabel}
          </span>
        </div>
        <div
          className="rounded-2xl border p-8 flex flex-col items-center gap-3"
          style={{ backgroundColor: colors.cardBackground, borderColor: colors.border }}
        >
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center"
            style={{ backgroundColor: colors.primary + '15' }}
          >
            <span className="text-3xl">📅</span>
          </div>
          <p className="text-sm font-[Vazir-Bold]" style={{ color: colors.textMain }}>
            نوبت فعالی برای امروز وجود ندارد
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-5 mt-5">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <FiCalendar size={18} style={{ color: colors.primary }} />
          <h2 className="text-base font-[Vazir-Bold]" style={{ color: colors.textMain }}>
            نوبت‌های امروز
          </h2>
        </div>
        <span className="text-xs font-[Vazir]" style={{ color: colors.textSecondary }}>
          {dateLabel}
        </span>
      </div>

      <div className="flex items-center gap-2 mb-3 flex-wrap">
        {statusCounts.pending_verification > 0 && (
          <span
            className="text-[11px] px-2.5 py-1 rounded-lg font-[Vazir-Bold]"
            style={{ backgroundColor: '#FF980020', color: '#FF9800' }}
          >
            {toPersianDigit(statusCounts.pending_verification)} نیاز به کد
          </span>
        )}
        {statusCounts.confirmed > 0 && (
          <span
            className="text-[11px] px-2.5 py-1 rounded-lg font-[Vazir-Bold]"
            style={{ backgroundColor: '#43A04720', color: '#43A047' }}
          >
            {toPersianDigit(statusCounts.confirmed)} تایید شده
          </span>
        )}
      </div>

      <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-hide">
        {todayAppointments.map((apt) => (
          <AppointmentListItem key={apt.id} appointment={apt} onPress={handlePress} />
        ))}
      </div>

      {/* ✅ استفاده از کامپوننت ادغام‌شده */}
      <VerifyCodeModal
        visible={verifyVisible}
        appointment={verifyTarget}
        onClose={() => {
          setVerifyVisible(false);
          setVerifyTarget(null);
        }}
        onConfirm={handleVerifySuccess}
        showCall={true}
        usePortal={true}
        variant="orange"
      />
    </div>
  );
}