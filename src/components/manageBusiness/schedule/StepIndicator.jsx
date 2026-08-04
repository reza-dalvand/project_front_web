'use client';
import { FiCheck } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';

export const STEPS = [
  { id: 1, label: 'خدمت', icon: '💆‍♀️' },
  { id: 2, label: 'ساعات', icon: '🕐' },
  { id: 3, label: 'تاریخ‌ها', icon: '📅' },
];

export default function StepIndicator({ currentStep }) {
  const { colors } = useTheme();

  return (
    <div className="flex items-center justify-center px-5 py-4 gap-2">
      {STEPS.map((step, index) => {
        const isCompleted = currentStep > step.id;
        const isActive = currentStep === step.id;

        return (
          <div key={step.id} className="flex items-center gap-2 flex-1">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className="w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all"
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
                  <span className="text-base">{step.icon}</span>
                )}
              </div>
              <span
                className="text-[11px]"
                style={{
                  color: isCompleted || isActive ? colors.textMain : colors.textSecondary,
                  fontFamily: isActive ? 'Vazir-Bold' : 'Vazir',
                }}
              >
                {step.label}
              </span>
            </div>
            {index < STEPS.length - 1 && (
              <div
                className="flex-1 h-0.5 mb-5 rounded-full transition-all"
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