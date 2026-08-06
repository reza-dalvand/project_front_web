'use client';
import { useMemo } from 'react';
import { FiCalendar, FiClock, FiChevronLeft } from 'react-icons/fi';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/stores/useThemeStore';
import { useBusinessStore } from '@/stores/useBusinessStore';
import { todayJalaali, PERSIAN_MONTHS, PERSIAN_WEEKDAYS } from '@/utils/dateUtils';
import { toPersianDigit, toEnglishDigits } from '@/utils/numberUtils';

const HOURS = Array.from({ length: 24 }, (_, i) => i);

const STATUS_CONFIG = {
  reserved: { label: 'رزرو شده', color: '#2196F3', bg: '#2196F318' },
  confirmed: { label: 'تایید شده', color: '#FF9800', bg: '#FF980018' },
  done: { label: 'انجام شده', color: '#43A047', bg: '#43A04718' },
  cancelled_by_salon: { label: 'لغو شده', color: '#E53935', bg: '#E5393518' },
};

const timeToMinutes = (timeStr) => {
  if (!timeStr) return 0;
  const english = toEnglishDigits(String(timeStr));
  const parts = english.split(':');
  if (parts.length !== 2) return 0;
  const h = parseInt(parts[0], 10);
  const m = parseInt(parts[1], 10);
  if (isNaN(h) || isNaN(m)) return 0;
  return h * 60 + m;
};

export default function TodayScheduleTimeline() {
  const { colors } = useTheme();
  const router = useRouter();
  const businessData = useBusinessStore((s) => s.businessData);
  const appointments = businessData?.appointments || [];

  const today = useMemo(() => todayJalaali(), []);

  // ✅ فیلتر نوبت‌ها: اول امروز، اگر نبود همه نوبت‌ها
  const todayAppointments = useMemo(() => {
    const todayFiltered = appointments.filter((apt) => {
      if (!apt.date) return false;
      return apt.date.jy === today.jy && apt.date.jm === today.jm && apt.date.jd === today.jd;
    });
    // ✅ FALLBACK: اگر نوبتی برای امروز نبود، همه نوبت‌ها را نشان بده
    if (todayFiltered.length === 0 && appointments.length > 0) {
      return appointments;
    }
    return todayFiltered;
  }, [appointments, today]);

  const appointmentsByHour = useMemo(() => {
    const map = {};
    todayAppointments.forEach((apt) => {
      const minutes = timeToMinutes(apt.time);
      const hour = Math.floor(minutes / 60);
      if (!map[hour]) map[hour] = [];
      map[hour].push(apt);
    });
    return map;
  }, [todayAppointments]);

  const statusCounts = useMemo(() => {
    const counts = { reserved: 0, done: 0, cancelled: 0 };
    todayAppointments.forEach((apt) => {
      if (apt.status === 'reserved' || apt.status === 'confirmed') counts.reserved++;
      else if (apt.status === 'done') counts.done++;
      else if (apt.status === 'cancelled_by_salon') counts.cancelled++;
    });
    return counts;
  }, [todayAppointments]);

  const weekdayName = PERSIAN_WEEKDAYS[(new Date().getDay() + 1) % 7];
  const dateLabel = `${weekdayName} ${toPersianDigit(today.jd)} ${PERSIAN_MONTHS[today.jm - 1]} ${toPersianDigit(today.jy)}`;

  const hoursWithAppointments = Object.keys(appointmentsByHour).length;
  const currentHour = new Date().getHours();

  // ═══════ حالت خالی مطلق (هیچ نوبتی در store نیست) ═══════
  if (appointments.length === 0) {
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
          className="rounded-2xl border p-6 flex flex-col items-center gap-3"
          style={{ backgroundColor: colors.cardBackground, borderColor: colors.border }}
        >
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center"
            style={{ backgroundColor: colors.primary + '15' }}
          >
            <span className="text-3xl">📅</span>
          </div>
          <p className="text-sm font-[Vazir-Bold]" style={{ color: colors.textMain }}>
            امروز نوبتی ثبت نشده است
          </p>
          <p className="text-xs text-center leading-5" style={{ color: colors.textSecondary }}>
            پس از رزرو اولین نوبت، برنامه زمانی اینجا نمایش داده می‌شود
          </p>
        </div>
      </div>
    );
  }

  // ═══════ حالت دارای نوبت ═══════
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
        <button
          onClick={() => router.push('/manage/appointments')}
          className="flex items-center gap-1 text-xs font-[Vazir-Bold]"
          style={{ color: colors.primary }}
        >
          همه نوبت‌ها
          <FiChevronLeft size={14} />
        </button>
      </div>

      {/* تاریخ + شمارنده */}
      <div className="flex items-center gap-2 mb-3 flex-wrap">
        <span
          className="text-[11px] px-2.5 py-1 rounded-lg font-[Vazir-Bold]"
          style={{ backgroundColor: colors.primary + '15', color: colors.primary }}
        >
          {dateLabel}
        </span>
        <span
          className="text-[11px] px-2.5 py-1 rounded-lg font-[Vazir-Bold]"
          style={{ backgroundColor: '#2196F320', color: '#2196F3' }}
        >
          {toPersianDigit(todayAppointments.length)} نوبت
        </span>
        {statusCounts.reserved > 0 && (
          <span
            className="text-[11px] px-2.5 py-1 rounded-lg font-[Vazir-Bold]"
            style={{ backgroundColor: '#FF980020', color: '#FF9800' }}
          >
            {toPersianDigit(statusCounts.reserved)} رزرو شده
          </span>
        )}
        {statusCounts.done > 0 && (
          <span
            className="text-[11px] px-2.5 py-1 rounded-lg font-[Vazir-Bold]"
            style={{ backgroundColor: '#43A04720', color: '#43A047' }}
          >
            {toPersianDigit(statusCounts.done)} انجام شده
          </span>
        )}
        {statusCounts.cancelled > 0 && (
          <span
            className="text-[11px] px-2.5 py-1 rounded-lg font-[Vazir-Bold]"
            style={{ backgroundColor: '#E5393520', color: '#E53935' }}
          >
            {toPersianDigit(statusCounts.cancelled)} لغو شده
          </span>
        )}
      </div>

      {/* ═══ Timeline ۲۴ ساعته ═══ */}
      <div
        className="rounded-2xl border overflow-hidden"
        style={{ backgroundColor: colors.cardBackground, borderColor: colors.border }}
      >
        <div className="overflow-x-auto scrollbar-hide">
          <div className="flex min-w-max">
            {HOURS.map((hour) => {
              const hourAppointments = appointmentsByHour[hour] || [];
              const hasAppointments = hourAppointments.length > 0;
              const isNow = currentHour === hour;

              return (
                <div key={hour} className="flex flex-col items-center min-w-[54px]">
                  {/* ستون ساعت */}
                  <div
                    className="w-full flex flex-col items-center py-2 border-b"
                    style={{
                      borderColor: colors.border,
                      backgroundColor: isNow ? colors.primary + '12' : 'transparent',
                    }}
                  >
                    <span
                      className="text-[11px] font-[Vazir-Bold]"
                      style={{ color: isNow ? colors.primary : colors.textSecondary }}
                    >
                      {toPersianDigit(String(hour).padStart(2, '0'))}
                    </span>
                    {isNow && (
                      <div
                        className="w-1.5 h-1.5 rounded-full mt-1"
                        style={{ backgroundColor: colors.primary }}
                      />
                    )}
                  </div>

                  {/* بلوک‌های نوبت */}
                  <div className="flex flex-col gap-1 py-1.5 w-full px-0.5">
                    {hasAppointments ? (
                      hourAppointments.map((apt) => {
                        const config = STATUS_CONFIG[apt.status] || STATUS_CONFIG.reserved;
                        return (
                          <div
                            key={apt.id}
                            className="w-full rounded-lg px-1.5 py-1.5 border"
                            style={{
                              backgroundColor: config.bg,
                              borderColor: config.color + '40',
                            }}
                          >
                            <div className="flex items-center gap-1 mb-0.5">
                              <div
                                className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                                style={{ backgroundColor: config.color }}
                              />
                              <span
                                className="text-[9px] font-[Vazir-Bold] truncate"
                                style={{ color: config.color }}
                              >
                                {apt.time}
                              </span>
                            </div>
                            <p
                              className="text-[9px] font-[Vazir-Medium] truncate leading-3"
                              style={{ color: colors.textMain }}
                            >
                              {apt.customerName}
                            </p>
                            <p
                              className="text-[8px] font-[Vazir] truncate leading-3 mt-0.5"
                              style={{ color: colors.textSecondary }}
                            >
                              {apt.serviceName}
                            </p>
                          </div>
                        );
                      })
                    ) : (
                      <div
                        className="w-full h-[3px] rounded-full mx-1"
                        style={{ backgroundColor: colors.border + '60' }}
                      />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* راهنمای رنگ‌ها */}
        <div
          className="flex items-center gap-3 px-3 py-2.5 border-t flex-wrap"
          style={{ borderColor: colors.border }}
        >
          {Object.entries(STATUS_CONFIG).map(([key, config]) => (
            <div key={key} className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: config.color }} />
              <span className="text-[9px] font-[Vazir]" style={{ color: colors.textSecondary }}>
                {config.label}
              </span>
            </div>
          ))}
          <div className="flex-1" />
          <div className="flex items-center gap-1">
            <FiClock size={10} style={{ color: colors.textSecondary }} />
            <span className="text-[9px] font-[Vazir]" style={{ color: colors.textSecondary }}>
              {toPersianDigit(todayAppointments.length)} نوبت در{' '}
              {toPersianDigit(hoursWithAppointments)} ساعت
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
