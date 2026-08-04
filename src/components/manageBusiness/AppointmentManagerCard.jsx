'use client';
import { FiCheck, FiX } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import Card from '@/components/common/Card';

const STATUS_META = {
  pending:   { label: 'در انتظار',  color: '#FFA000' },
  confirmed: { label: 'تأیید شده',  color: '#43A047' },
  cancelled: { label: 'لغو شده',    color: '#E53935' },
  done:      { label: 'انجام شده',  color: '#1E88E5' },
};

export default function AppointmentManagerCard({ appointment, onStatusChange }) {
  const { colors } = useTheme();
  const meta = STATUS_META[appointment.status] || STATUS_META.pending;

  return (
    <Card variant="elevated" padding={14} radius={14}>
      {/* هدر */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-[15px] font-[Vazir-Medium]" style={{ color: colors.textMain }}>
          {appointment.customerName}
        </span>
        <div
          className="flex items-center gap-1 px-2 py-1 rounded-full"
          style={{ backgroundColor: meta.color + '22' }}
        >
          <span className="text-xs font-[Vazir]" style={{ color: meta.color }}>
            {meta.label}
          </span>
        </div>
      </div>

      {/* اطلاعات */}
      <p className="text-xs mb-3" style={{ color: colors.textSecondary }}>
        {appointment.serviceName} · {appointment.date} · {appointment.time}
      </p>

      {/* دکمه‌ها */}
      <div className="flex gap-2 justify-end">
        {appointment.status === 'pending' && (
          <>
            <button
              onClick={() => onStatusChange?.(appointment.id, 'confirmed')}
              className="px-4 py-1.5 rounded-lg text-[13px] font-[Vazir-Medium]"
              style={{ backgroundColor: '#43A04722', color: '#43A047' }}
            >
              تأیید
            </button>
            <button
              onClick={() => onStatusChange?.(appointment.id, 'cancelled')}
              className="px-4 py-1.5 rounded-lg text-[13px] font-[Vazir-Medium]"
              style={{ backgroundColor: '#E5393522', color: '#E53935' }}
            >
              لغو
            </button>
          </>
        )}
        {appointment.status === 'confirmed' && (
          <button
            onClick={() => onStatusChange?.(appointment.id, 'done')}
            className="px-4 py-1.5 rounded-lg text-[13px] font-[Vazir-Medium]"
            style={{ backgroundColor: '#1E88E522', color: '#1E88E5' }}
          >
            انجام شد
          </button>
        )}
      </div>
    </Card>
  );
}