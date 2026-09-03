// src/components/manageBusiness/appointments/AppointmentsList.jsx
'use client';
import { useMemo } from 'react';
import { FiCalendar, FiRefreshCw } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import { toPersianDigit } from '@/utils/numberUtils';
import { todayJalaali, PERSIAN_MONTHS, PERSIAN_WEEKDAYS } from '@/utils/dateUtils';
import { useTodayAppointments } from '@/hooks/useTodayAppointments';
import AppointmentListItem from './AppointmentListItem';

export default function AppointmentsList() {
  const { colors } = useTheme();
  const {
    appointments,
    isLoading,
    refetch,
    handleVerifyCode,
    handleTrustConfirm,
    handleCancel,
  } = useTodayAppointments();

  const today = useMemo(() => todayJalaali(), []);
  const weekdayName = PERSIAN_WEEKDAYS[(new Date().getDay() + 1) % 7];
  const dateLabel = `${weekdayName} ${toPersianDigit(today.jd)} ${PERSIAN_MONTHS[today.jm - 1]}`;

  const statusCounts = useMemo(() => {
    const counts = { confirmed: 0, pending_verification: 0, reserved: 0 };
    for (const apt of appointments) {
      if (counts[apt.status] !== undefined) counts[apt.status]++;
    }
    return counts;
  }, [appointments]);

  return (
    <div className="px-5 mt-5">
      {/* هدر */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <FiCalendar size={18} style={{ color: colors.primary }} />
          <h2 className="text-base font-[Vazir-Bold]" style={{ color: colors.textMain }}>
            نوبت‌های امروز
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-[Vazir]" style={{ color: colors.textSecondary }}>
            {dateLabel}
          </span>
          <button
            onClick={refetch}
            disabled={isLoading}
            className="w-7 h-7 rounded-full flex items-center justify-center border transition-all active:scale-95 disabled:opacity-50"
            style={{ borderColor: colors.border, backgroundColor: colors.cardBackground }}
          >
            <FiRefreshCw
              size={13}
              style={{ color: colors.primary }}
              className={isLoading ? 'animate-spin' : ''}
            />
          </button>
        </div>
      </div>

      {/* شمارنده وضعیت‌ها */}
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
            style={{ backgroundColor: '#2196F320', color: '#2196F3' }}
          >
            {toPersianDigit(statusCounts.confirmed)} اعتمادی
          </span>
        )}
        {statusCounts.reserved > 0 && (
          <span
            className="text-[11px] px-2.5 py-1 rounded-lg font-[Vazir-Bold]"
            style={{ backgroundColor: '#43A04720', color: '#43A047' }}
          >
            {toPersianDigit(statusCounts.reserved)} تایید شده
          </span>
        )}
      </div>

      {/* ─── لودینگ ─── */}
      {isLoading && (
        <div className="flex items-center justify-center py-8">
          <div
            className="w-8 h-8 border-3 border-current border-t-transparent rounded-full animate-spin"
            style={{ color: colors.primary }}
          />
        </div>
      )}

      {/* ─── حالت خالی ─── */}
      {!isLoading && appointments.length === 0 && (
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
          <p className="text-xs text-center" style={{ color: colors.textSecondary }}>
            نوبت‌های رزرو شده، اعتمادی و نیاز به کد اینجا نمایش داده می‌شوند
          </p>
        </div>
      )}

      {/* ─── لیست نوبت‌ها ─── */}
      {!isLoading && appointments.length > 0 && (
        <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-hide">
          {appointments.map((apt) => (
            <AppointmentListItem
              key={apt.id}
              appointment={apt}
              onPress={() => {
                // در صورت نیاز می‌توان مودال جزئیات را باز کرد
              }}
              onVerifyCode={handleVerifyCode}
              onTrustConfirm={handleTrustConfirm}
            />
          ))}
        </div>
      )}
    </div>
  );
}