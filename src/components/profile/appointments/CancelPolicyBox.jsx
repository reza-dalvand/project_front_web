// src/components/profile/appointments/CancelPolicyBox.jsx
'use client';
import { FiCheckCircle, FiAlertTriangle } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import { formatHoursLeft, CANCELLATION_THRESHOLD_HOURS } from '@/utils/cancellation-utils';
import { toPersianDigit } from '@/utils/numberUtils';

export default function CancelPolicyBox({ canCancel, hoursLeft }) {
  const { colors } = useTheme();

  if (canCancel) {
    return (
      <div
        className="flex items-start gap-3 p-4 rounded-2xl border"
        style={{ backgroundColor: '#43A04708', borderColor: '#43A04730' }}
      >
        <FiCheckCircle size={18} color="#43A047" className="flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="text-sm font-[Vazir] leading-6" style={{ color: colors.textMain }}>
            امکان لغو این نوبت وجود دارد ({formatHoursLeft(hoursLeft)} تا نوبت). بیعانه به صورت کامل
            به شما مسترد می‌شود.
          </p>
          <a
            href="https://zibano.app/rules/cancellation"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-[Vazir] underline mt-1 inline-block"
            style={{ color: colors.primary }}
          >
            برای مطالعه قوانین این قسمت به این لینک مراجعه کنید
          </a>
        </div>
      </div>
    );
  }

  return (
    <div
      className="flex items-start gap-3 p-4 rounded-2xl border"
      style={{ backgroundColor: '#E5393508', borderColor: '#E5393530' }}
    >
      <FiAlertTriangle size={18} color="#E53935" className="flex-shrink-0 mt-0.5" />
      <div className="flex-1">
        <p className="text-sm font-[Vazir] leading-6" style={{ color: colors.textMain }}>
          امکان لغو این نوبت وجود ندارد ({formatHoursLeft(hoursLeft ?? 0)} تا نوبت). طبق قوانین، لغو
          فقط تا {toPersianDigit(CANCELLATION_THRESHOLD_HOURS)} ساعت قبل امکان‌پذیر است.
        </p>
        <a
          href="https://zibano.app/rules/cancellation"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-[Vazir] underline mt-1 inline-block"
          style={{ color: colors.primary }}
        >
          برای مطالعه قوانین این قسمت به این لینک مراجعه کنید
        </a>
      </div>
    </div>
  );
}
