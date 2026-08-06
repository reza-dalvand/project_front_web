'use client';
import Image from 'next/image';
import { FiCalendar, FiClock, FiUser, FiMapPin } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import Card from '@/components/common/Card';
import { toPersianDigit } from '@/utils/numberUtils';

const STATUS_CONFIG = {
  pending: { label: 'در انتظار', color: '#FFA000', bg: '#FFA00020' },
  confirmed: { label: 'تأیید شده', color: '#43A047', bg: '#43A04720' },
  cancelled: { label: 'لغو شده', color: '#F44336', bg: '#F4433620' },
  completed: { label: 'انجام شده', color: '#757575', bg: '#75757520' },
};

/**
 * کارت نوبت مشتری
 *
 * @param {object} appointment - داده نوبت
 * @param {function} onPress - تابع کلیک
 * @param {function} onCancel - تابع لغو
 */
export default function AppointmentCard({ appointment, onPress, onCancel }) {
  const { colors } = useTheme();
  const statusConfig = STATUS_CONFIG[appointment.status] || STATUS_CONFIG.pending;

  return (
    <Card
      variant="elevated"
      padding={14}
      radius={12}
      onPress={onPress}
      className="cursor-pointer hover:scale-[1.01] transition-transform"
    >
      {/* هدر: کسب‌وکار + وضعیت */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3 flex-1">
          {appointment.businessLogo && (
            <Image
              src={appointment.businessLogo}
              alt={appointment.businessName}
              width={48}
              height={48}
              className="rounded-xl"
            />
          )}
          <div className="flex flex-col gap-1">
            <span className="text-sm font-[Vazir-Bold]" style={{ color: colors.textMain }}>
              {appointment.businessName}
            </span>
            <span className="text-xs font-[Vazir]" style={{ color: colors.textSecondary }}>
              {appointment.serviceName}
            </span>
          </div>
        </div>
        {/* Badge وضعیت */}
        <div className="px-2.5 py-1 rounded-lg" style={{ backgroundColor: statusConfig.bg }}>
          <span className="text-xs font-[Vazir]" style={{ color: statusConfig.color }}>
            {statusConfig.label}
          </span>
        </div>
      </div>

      {/* جزئیات */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <FiCalendar size={14} style={{ color: colors.textSecondary }} />
          <span className="text-[13px] font-[Vazir]" style={{ color: colors.textMain }}>
            {appointment.date}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <FiClock size={14} style={{ color: colors.textSecondary }} />
          <span className="text-[13px] font-[Vazir]" style={{ color: colors.textMain }}>
            {appointment.time}
          </span>
        </div>
        {appointment.teamMember && (
          <div className="flex items-center gap-2">
            <FiUser size={14} style={{ color: colors.textSecondary }} />
            <span className="text-[13px] font-[Vazir]" style={{ color: colors.textMain }}>
              {appointment.teamMember}
            </span>
          </div>
        )}
      </div>

      {/* دکمه لغو - فقط برای نوبت‌های تأیید شده */}
      {appointment.status === 'confirmed' && onCancel && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onCancel();
          }}
          className="w-full mt-3 py-2 rounded-lg border text-center transition-colors"
          style={{ borderColor: colors.border }}
        >
          <span className="text-[13px] font-[Vazir]" style={{ color: '#F44336' }}>
            لغو نوبت
          </span>
        </button>
      )}
    </Card>
  );
}
