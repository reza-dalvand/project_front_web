'use client';
import Image from 'next/image';
import { FiCheckCircle, FiXCircle, FiClock, FiRotateCcw, FiChevronLeft } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import { toPersianDigit, formatPrice } from '@/utils/numberUtils';

const STATUS_CONFIG = {
  blocked: { label: 'بلوکه', color: '#FF9800', Icon: FiClock },
  settling: { label: 'در حال تسویه', color: '#2196F3', Icon: FiClock },
  settled: { label: 'تسویه شده', color: '#43A047', Icon: FiCheckCircle },
  refunded: { label: 'مسترد شده', color: '#1E88E5', Icon: FiRotateCcw },
  failed: { label: 'ناموفق', color: '#E53935', Icon: FiXCircle },
};

const TYPE_LABELS = {
  deposit: 'بیعانه',
  full_payment: 'پرداخت کامل',
  refund: 'استرداد',
  settlement: 'تسویه',
};

/**
 * ✅ Helper: استخراج تاریخ و ساعت از createdAt
 * @param {string} createdAt - ISO string از بک‌اند
 * @returns {{ date: string, time: string, dayName: string }}
 */
const formatDateTime = (createdAt) => {
  if (!createdAt) {
    return { date: '-', time: '-', dayName: '' };
  }
  try {
    const d = new Date(createdAt);
    const dayNames = ['یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنج‌شنبه', 'جمعه', 'شنبه'];
    const dayName = dayNames[d.getDay()];

    // فرمت تاریخ: ۱۵ شهریور
    const months = [
      'فروردین', 'اردیبهشت', 'خرداد',
      'تیر', 'مرداد', 'شهریور',
      'مهر', 'آبان', 'آذر',
      'دی', 'بهمن', 'اسفند',
    ];

    // ✅ تبدیل به جلالی (اگر تابع موجود است)
    let dateStr = '';
    let timeStr = '';

    try {
      const jFormatter = new Intl.DateTimeFormat('fa-IR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
      dateStr = jFormatter.format(d);
    } catch {
      dateStr = `${d.getDate()} ${months[d.getMonth()]}`;
    }

    try {
      const tFormatter = new Intl.DateTimeFormat('fa-IR', {
        hour: '2-digit',
        minute: '2-digit',
      });
      timeStr = tFormatter.format(d);
    } catch {
      timeStr = `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
    }

    return { date: dateStr, time: timeStr, dayName };
  } catch {
    return { date: '-', time: '-', dayName: '' };
  }
};

export default function PaymentCompactCard({ payment, onPress }) {
  const { colors } = useTheme();
  const status = STATUS_CONFIG[payment.status] || STATUS_CONFIG.blocked;
  const StatusIcon = status.Icon;

  // ✅ سازگاری با هر دو حالت (camelCase و snake_case)
  const createdAt = payment.createdAt || payment.created_at;
  const { date, time, dayName } = formatDateTime(createdAt);

  const businessName = payment.businessName || payment.business_name || 'کسب‌وکار';
  const businessLogo =
    payment.businessLogo ||
    payment.business_logo ||
    payment.business?.logo ||
    null;

  const amount = payment.amount || payment.paidAmount || 0;
  const trackingCode = payment.trackingCode || payment.tracking_code || '';
  const type = payment.type || 'deposit';

  return (
    <button
      onClick={() => onPress?.(payment)}
      className="w-full rounded-2xl border overflow-hidden text-right transition-all
        hover:shadow-sm active:scale-[0.99]"
      style={{ backgroundColor: colors.cardBackground, borderColor: colors.border }}
    >
      {/* ═══ ردیف اصلی ═══ */}
      <div className="flex items-center gap-3 p-3.5">
        {/* لوگو */}
        <div className="relative flex-shrink-0">
          {businessLogo ? (
            <Image
              src={businessLogo}
              alt={businessName}
              width={46}
              height={46}
              className="rounded-xl object-cover"
            />
          ) : (
            <div
              className="w-[46px] h-[46px] rounded-xl flex items-center justify-center text-lg"
              style={{
                backgroundColor: colors.primary + '20',
                color: colors.primary,
              }}
            >
              💼
            </div>
          )}
          {/* نقطه وضعیت */}
          <div
            className="absolute -bottom-0.5 -left-0.5 w-3 h-3 rounded-full border-2"
            style={{ backgroundColor: status.color, borderColor: colors.cardBackground }}
          />
        </div>

        {/* اطلاعات */}
        <div className="flex-1 min-w-0 flex flex-col gap-1.5">
          {/* نام + تگ نوع */}
          <div className="flex items-center gap-2">
            <span
              className="text-sm font-[Vazir-Bold] truncate flex-1"
              style={{ color: colors.textMain }}
            >
              {businessName}
            </span>
            {/* تگ نوع */}
            <span
              className="text-[10px] font-[Vazir-Bold] px-2 py-0.5 rounded-md flex-shrink-0"
              style={{
                backgroundColor: type === 'deposit' ? '#FF980018' : '#2196F318',
                color: type === 'deposit' ? '#FF9800' : '#2196F3',
              }}
            >
              {TYPE_LABELS[type] || 'پرداخت'}
            </span>
          </div>

          {/* تاریخ + ساعت */}
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-[11px] font-[Vazir]" style={{ color: colors.textSecondary }}>
              📅 {dayName} {date}
            </span>
            <span className="text-[11px] font-[Vazir]" style={{ color: colors.textSecondary }}>
              🕐 {time}
            </span>
          </div>

          {/* مبلغ پرداختی */}
          <span className="text-[13px] font-[Vazir-Bold]" style={{ color: colors.primary }}>
            {formatPrice(amount)}
          </span>
        </div>

        {/* وضعیت + فلش */}
        <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
          <span
            className="flex items-center gap-1 text-[10px] font-[Vazir-Bold] px-2.5 py-1.5 rounded-lg"
            style={{ backgroundColor: status.color + '18', color: status.color }}
          >
            <StatusIcon size={11} />
            {status.label}
          </span>
          <FiChevronLeft size={16} style={{ color: colors.textSecondary }} />
        </div>
      </div>
    </button>
  );
}