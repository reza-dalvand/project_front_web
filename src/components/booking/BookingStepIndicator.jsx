// src/components/booking/BookingStepIndicator.jsx
'use client';
import { FiInfo, FiCalendar, FiClock, FiCheck, FiUser } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';

// ✅ نگاشت رشته به کامپوننت آیکون
const ICON_MAP = {
  user: FiUser,
  info: FiInfo,
  calendar: FiCalendar,
  clock: FiClock,
};

const DEFAULT_STEPS = [
  { id: 1, label: 'بررسی', icon: 'info' },
  { id: 2, label: 'تاریخ', icon: 'calendar' },
  { id: 3, label: 'ساعت', icon: 'clock' },
];

export default function BookingStepIndicator({ currentStep, steps = DEFAULT_STEPS }) {
  const { colors } = useTheme();

  return (
    <div className="flex items-center justify-center px-5 py-4 gap-2">
      {steps.map((step, index) => {
        const isCompleted = currentStep > step.id;
        const isActive = currentStep === step.id;

        // ✅ FIX: تبدیل رشته یا کامپوننت به کامپوننت قابل رندر
        const IconComponent =
          typeof step.icon === 'string' ? ICON_MAP[step.icon] || FiInfo : step.icon;

        return (
          <div key={step.id} className="flex items-center gap-2 flex-1">
            {/* دایره مرحله */}
            <div className="flex flex-col items-center gap-1.5 flex-shrink-0">
              <div
                className="w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all duration-300"
                style={{
                  backgroundColor: isCompleted
                    ? colors.primary
                    : isActive
                      ? colors.primary + '20'
                      : colors.cardBackground,
                  borderColor: isCompleted || isActive ? colors.primary : colors.border,
                }}
              >
                {isCompleted ? (
                  <FiCheck size={18} color="#fff" />
                ) : (
                  <IconComponent
                    size={16}
                    style={{
                      color: isActive ? colors.primary : colors.textSecondary,
                    }}
                  />
                )}
              </div>
              <span
                className="text-[11px] font-[Vazir]"
                style={{
                  color: isCompleted || isActive ? colors.textMain : colors.textSecondary,
                  fontFamily: isActive ? 'Vazir-Bold' : 'Vazir',
                }}
              >
                {step.label}
              </span>
            </div>

            {/* خط رابط */}
            {index < steps.length - 1 && (
              <div
                className="flex-1 h-0.5 mb-5 rounded-full transition-all duration-300"
                style={{
                  backgroundColor: currentStep > step.id ? colors.primary : colors.border,
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
