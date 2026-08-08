'use client';
import { FiKey, FiChevronLeft, FiCheckCircle } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';

const STATUS_META = {
  reserved: {
    label: 'تایید شده',
    color: '#43A047',
    bg: '#43A04712',
    border: '#43A04750',
  },
  confirmed: {
    label: 'تایید شده)',
    color: '#43A047',
    bg: '#43A04712',
    border: '#43A04750',
  },
  pending_verification: {
    label: 'نیاز به کد',
    color: '#FF9800',
    bg: '#FF980008',
    border: '#FF9800',
  },
};

export default function AppointmentListItem({ appointment, onPress }) {
  const { colors } = useTheme();
  const status = STATUS_META[appointment.status] || STATUS_META.reserved;
  const needsCode = appointment.status === 'pending_verification';

  // محتوای مشترک
  const cardContent = (
    <>
      {/* ساعت + نقطه وضعیت */}
      <div className="flex items-center justify-between">
        <span className="text-[13px] font-[Vazir-Bold]" style={{ color: status.color }}>
          {appointment.time}
        </span>
        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: status.color }} />
      </div>

      {/* نام مشتری */}
      <span className="text-xs font-[Vazir-Bold] line-clamp-1" style={{ color: colors.textMain }}>
        {appointment.customerName}
      </span>

      {/* نام خدمت */}
      <span
        className="text-[10px] font-[Vazir] line-clamp-1"
        style={{ color: colors.textSecondary }}
      >
        {appointment.serviceName}
      </span>

      {/* برچسب وضعیت */}
      <div
        className="self-start px-2 py-0.5 rounded-lg"
        style={{ backgroundColor: status.color + '20' }}
      >
        <span className="text-[9px] font-[Vazir-Bold]" style={{ color: status.color }}>
          {status.label}
        </span>
      </div>
    </>
  );

  // ═══ نیاز به کد: دکمه کلیک‌پذیر نارنجی ═══
  if (needsCode) {
    return (
      <button
        onClick={() => onPress?.(appointment)}
        className="flex-shrink-0 w-[140px] flex flex-col gap-1.5 p-3 rounded-2xl
          border-2 text-right transition-all duration-200
          hover:scale-[1.04] hover:shadow-md active:scale-[0.96] cursor-pointer"
        style={{
          backgroundColor: status.bg,
          borderColor: status.border,
          boxShadow: '0 2px 8px rgba(255, 152, 0, 0.15)',
        }}
      >
        {cardContent}

        {/* دکمه وارد کردن کد */}
        <div
          className="flex items-center justify-center gap-1 mt-1 py-1.5 px-2 rounded-lg w-full"
          style={{ backgroundColor: '#FF9800' }}
        >
          <FiKey size={11} color="#fff" />
          <span className="text-[9px] font-[Vazir-Bold] text-white">وارد کردن کد</span>
          <FiChevronLeft size={11} color="#fff" />
        </div>
      </button>
    );
  }

  // ═══ تایید شده: div ثابت سبز ═══
  return (
    <div
      className="flex-shrink-0 w-[140px] flex flex-col gap-1.5 p-3 rounded-2xl
        border cursor-default select-none"
      style={{
        backgroundColor: status.bg,
        borderColor: status.border,
      }}
    >
      {cardContent}

      {/* نشان سبز تایید */}
      <div
        className="flex items-center justify-center gap-1 mt-1 py-1.5 px-2 rounded-lg w-full"
        style={{ backgroundColor: '#43A04718' }}
      >
        <FiCheckCircle size={11} color="#43A047" />
        <span className="text-[9px] font-[Vazir-Bold]" style={{ color: '#43A047' }}>
          بدون نیاز به کد
        </span>
      </div>
    </div>
  );
}
