'use client';

import { FiClock, FiUser, FiChevronLeft } from 'react-icons/fi';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/stores/useThemeStore';
import { Card } from '@/components/common';
import { toPersianDigit } from '@/utils/numberUtils';
import { useBusinessStore } from '@/stores/useBusinessStore';

export default function TodayAppointments() {
  const { colors } = useTheme();
  const router = useRouter();
  const appointments = useBusinessStore((s) => s.businessData?.appointments) || [];
  // فیلتر فقط نوبت‌های امروز
  const todayAppointments = appointments.filter((apt) => {
    const now = new Date();
    const todayJalaali = { jy: 1405, jm: 5, jd: 14 }; // موقت
    return (
      apt.date.jy === todayJalaali.jy &&
      apt.date.jm === todayJalaali.jm &&
      apt.date.jd === todayJalaali.jd
    );
  });

  if (todayAppointments.length === 0) return null;

  return (
    <div className="px-5 mt-7">
      <div className="flex items-center justify-between mb-4">
        <h2
          className="text-base font-[Vazir-Bold]"
          style={{ color: colors.textMain }}
        >
          نوبت‌های امروز
        </h2>
        <button
          onClick={() => router.push('/manage/appointments')}
          className="text-xs font-[Vazir-Medium] flex items-center gap-1"
          style={{ color: colors.primary }}
        >
          مشاهده همه
          <FiChevronLeft size={14} />
        </button>
      </div>

      <div className="flex flex-col gap-3">
        {todayAppointments.slice(0, 3).map((apt) => (
          <Card key={apt.id} variant="elevated" padding={14} radius={14}>
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3 flex-1">
                <div
                  className="w-11 h-11 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: colors.primary + '18' }}
                >
                  <FiUser size={18} style={{ color: colors.primary }} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3
                    className="text-sm font-[Vazir-Bold] truncate"
                    style={{ color: colors.textMain }}
                  >
                    {apt.customerName}
                  </h3>
                  <p
                    className="text-[11px] font-[Vazir] truncate"
                    style={{ color: colors.textSecondary }}
                  >
                    {apt.serviceName}
                  </p>
                </div>
              </div>

              <div
                className="flex items-center gap-1 px-2 py-1 rounded-lg"
                style={{ backgroundColor: '#667eea18' }}
              >
                <FiClock size={12} style={{ color: '#667eea' }} />
                <span
                  className="text-[11px] font-[Vazir-Bold]"
                  style={{ color: '#667eea' }}
                >
                  {apt.time}
                </span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}