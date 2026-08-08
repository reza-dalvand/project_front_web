'use client';
import { FiMessageSquare, FiEye } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';

/**
 * پیش‌نمایش متن پیام یادآوری
 *
 * @param {string} businessName - نام کسب‌وکار
 * @param {string} bookingLink  - لینک رزرو
 * @param {number} selectedCount - تعداد مشتریان انتخاب شده
 */
export default function ReminderMessagePreview({ businessName, bookingLink, selectedCount }) {
  const { colors } = useTheme();

  // متن پیام با placeholder ها
  const messageTemplate = `سلام {نام مشتری} عزیز 🌸

خدمت «{نام خدمت}» شما که در تاریخ {تاریخ انجام} انجام شده، در تاریخ {تاریخ موعد} نیاز به تمدید دارد.

برای رزرو نوبت تمدید، روی لینک زیر کلیک کنید:
${bookingLink}

با احترام، ${businessName} 🌹`;

  // یک نمونه پرشده برای نمایش
  const sampleMessage = `سلام نازنین کریمی عزیز 🌸

خدمت «فیشیال تخصصی پوست» شما که در تاریخ ۱۴۰۵/۰۳/۲۰ انجام شده، در تاریخ ۱۴۰۵/۰۴/۲۰ نیاز به تمدید دارد.

برای رزرو نوبت تمدید، روی لینک زیر کلیک کنید:
${bookingLink}

با احترام، ${businessName} 🌹`;

  return (
    <div
      className="rounded-2xl border overflow-hidden"
      style={{
        backgroundColor: colors.cardBackground,
        borderColor: colors.border,
      }}
    >
      {/* هدر */}
      <div
        className="flex items-center gap-2.5 px-4 py-3 border-b"
        style={{ borderColor: colors.border }}
      >
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: colors.primary + '15' }}
        >
          <FiMessageSquare size={16} style={{ color: colors.primary }} />
        </div>
        <div className="flex-1">
          <span className="text-[13px] font-[Vazir-Bold] block" style={{ color: colors.textMain }}>
            متن پیام یادآوری
          </span>
          <span className="text-[10px] font-[Vazir]" style={{ color: colors.textSecondary }}>
            {selectedCount > 0
              ? `برای ${selectedCount} مشتری ارسال می‌شود`
              : 'متن پیش‌فرض - اطلاعات هر مشتری به صورت خودکار جایگذاری می‌شود'}
          </span>
        </div>
        <FiEye size={16} color={colors.textSecondary} />
      </div>

      {/* متن پیام */}
      <div className="p-4">
        <div
          className="p-3.5 rounded-xl border-2 border-dashed"
          style={{
            backgroundColor: colors.background,
            borderColor: colors.primary + '30',
          }}
        >
          <pre
            className="text-[12px] font-[Vazir] leading-[22px] text-right whitespace-pre-wrap"
            style={{ color: colors.textMain, direction: 'rtl' }}
          >
            {sampleMessage}
          </pre>
        </div>

        {/* راهنمای متغیرها */}
        <div className="flex flex-wrap gap-1.5 mt-3">
          {['{نام مشتری}', '{نام خدمت}', '{تاریخ انجام}', '{تاریخ موعد}'].map((variable) => (
            <span
              key={variable}
              className="text-[10px] font-[Vazir-Bold] px-2 py-1 rounded-md"
              style={{
                backgroundColor: colors.primary + '12',
                color: colors.primary,
              }}
            >
              {variable}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
