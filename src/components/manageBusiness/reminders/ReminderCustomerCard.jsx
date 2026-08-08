'use client';
import {
  FiCheckSquare,
  FiSquare,
  FiPhone,
  FiCalendar,
  FiClock,
  FiSend,
  FiLock,
  FiRefreshCw,
} from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import Avatar from '@/components/common/Avatar';
import { toPersianDigit } from '@/utils/numberUtils';

/**
 * کارت مشتری در لیست یادآوری
 *
 * @param {object}  customer      - داده مشتری
 * @param {boolean} selected      - آیا انتخاب شده
 * @param {boolean} canSend       - آیا می‌توان پیام ارسال کرد
 * @param {function} onToggle     - تغییر وضعیت انتخاب
 */
export default function ReminderCustomerCard({ customer, selected, canSend, onToggle }) {
  const { colors } = useTheme();

  // وضعیت‌های مختلف مشتری
  const isOverdue = customer.daysRemaining < 0;
  const isToday = customer.daysRemaining === 0;
  const isSent = customer.reminderSent;
  const canSendAgain = customer.hasNewBookingAfterSend;

  // رنگ و لیبل badge بر اساس وضعیت
  const getStatusBadge = () => {
    if (isSent && !canSendAgain) {
      return {
        label: 'ارسال شده',
        icon: FiLock,
        color: '#9E9E9E',
        bg: '#9E9E9E15',
      };
    }
    if (isSent && canSendAgain) {
      return {
        label: 'رزرو مجدد - ارسال دوباره',
        icon: FiRefreshCw,
        color: '#2196F3',
        bg: '#2196F315',
      };
    }
    if (isOverdue) {
      return {
        label: `${toPersianDigit(Math.abs(customer.daysRemaining))} روز گذشته`,
        icon: FiClock,
        color: '#E53935',
        bg: '#E5393515',
      };
    }
    if (isToday) {
      return {
        label: 'امروز موعد تمدید',
        icon: FiClock,
        color: '#FF9800',
        bg: '#FF980015',
      };
    }
    return {
      label: `${toPersianDigit(customer.daysRemaining)} روز تا موعد`,
      icon: FiClock,
      color: '#FF9800',
      bg: '#FF980015',
    };
  };

  const status = getStatusBadge();
  const StatusIcon = status.icon;

  return (
    <button
      onClick={() => canSend && onToggle(customer.id)}
      disabled={!canSend}
      className="w-full flex items-start gap-3 p-3.5 rounded-2xl border-[1.5px]
        text-right transition-all duration-200
        disabled:cursor-not-allowed disabled:opacity-60"
      style={{
        backgroundColor: selected ? colors.primary + '08' : colors.cardBackground,
        borderColor: selected ? colors.primary : canSend ? colors.border : colors.border + '60',
      }}
    >
      {/* چک‌باکس */}
      <div className="flex-shrink-0 mt-1">
        {selected ? (
          <FiCheckSquare size={22} style={{ color: colors.primary }} />
        ) : (
          <FiSquare size={22} style={{ color: canSend ? colors.textSecondary : colors.border }} />
        )}
      </div>

      {/* آواتار */}
      <Avatar name={customer.customerName} size="md" />

      {/* اطلاعات */}
      <div className="flex-1 min-w-0 flex flex-col gap-1.5">
        {/* نام + تلفن */}
        <div className="flex items-center justify-between gap-2">
          <span className="text-sm font-[Vazir-Bold] truncate" style={{ color: colors.textMain }}>
            {customer.customerName}
          </span>
          <div className="flex items-center gap-1 flex-shrink-0">
            <FiPhone size={11} color={colors.textSecondary} />
            <span className="text-[11px] font-[Vazir]" style={{ color: colors.textSecondary }}>
              {toPersianDigit(customer.customerPhone)}
            </span>
          </div>
        </div>

        {/* خدمت + تاریخ انجام قبلی */}
        <div className="flex items-center gap-1.5">
          <span className="text-[11px]" style={{ color: colors.textSecondary }}>
            💆‍♀️
          </span>
          <span
            className="text-[11px] font-[Vazir-Medium] truncate"
            style={{ color: colors.textSecondary }}
          >
            {customer.serviceName}
          </span>
          <span className="text-[10px] font-[Vazir]" style={{ color: colors.textSecondary }}>
            • انجام: {customer.lastServiceDate}
          </span>
        </div>

        {/* موعد تمدید */}
        <div className="flex items-center gap-1.5">
          <FiCalendar size={11} color={colors.primary} />
          <span className="text-[11px] font-[Vazir-Medium]" style={{ color: colors.textMain }}>
            موعد تمدید: {customer.dueDate}
          </span>
        </div>

        {/* Badge وضعیت + ارسال قبلی */}
        <div className="flex items-center gap-2 mt-0.5 flex-wrap">
          <div
            className="flex items-center gap-1 px-2 py-1 rounded-lg"
            style={{ backgroundColor: status.bg }}
          >
            <StatusIcon size={10} style={{ color: status.color }} />
            <span className="text-[10px] font-[Vazir-Bold]" style={{ color: status.color }}>
              {status.label}
            </span>
          </div>

          {/* اگر قبلاً ارسال شده */}
          {isSent && (
            <div className="flex items-center gap-1">
              <FiSend size={10} color="#9E9E9E" />
              <span className="text-[10px] font-[Vazir]" style={{ color: colors.textSecondary }}>
                ارسال: {customer.sentDate}
              </span>
            </div>
          )}
        </div>
      </div>
    </button>
  );
}
