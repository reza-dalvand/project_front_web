'use client';

import { FiBriefcase, FiShield } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import { toPersianDigit } from '@/utils/numberUtils';

const STEPS = [
  { id: 1, label: 'اطلاعات', icon: FiBriefcase },
  { id: 2, label: 'احراز هویت', icon: FiShield },
];

export default function StepProgress({ currentStep, totalSteps }) {
  const { colors } = useTheme();
  const progress = ((currentStep - 1) / (totalSteps - 1 || 1)) * 100;

  return (
    <div className="px-5 py-6 space-y-5">
      {/* نوار پیشرفت */}
      <div className="relative h-1 rounded-full overflow-hidden"
           style={{ backgroundColor: colors.border }}>
        <div
          className="absolute top-0 left-0 bottom-0 rounded-full transition-all duration-500"
          style={{
            width: `${progress}%`,
            backgroundColor: colors.primary,
          }}
        />
      </div>

      {/* اطلاعات مرحله فعلی */}
      <div className="flex items-center justify-between">
        <div
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl"
          style={{ backgroundColor: colors.primary + '20' }}
        >
          {(() => {
            const CurrentIcon = STEPS[currentStep - 1]?.icon || FiStore;
            return <CurrentIcon size={14} style={{ color: colors.primary }} />;
          })()}
          <span
            className="text-xs font-[Vazir-Bold]"
            style={{ color: colors.primary }}
          >
            مرحله {toPersianDigit(currentStep)} از {toPersianDigit(totalSteps)}
          </span>
        </div>
        <span
          className="text-base font-[Vazir-Bold]"
          style={{ color: colors.textMain }}
        >
          {STEPS[currentStep - 1]?.label}
        </span>
      </div>

      {/* نقاط مراحل */}
      <div className="flex items-center justify-center gap-2">
        {STEPS.map((step) => {
          const isCompleted = currentStep > step.id;
          const isActive = currentStep === step.id;

          return (
            <div
              key={step.id}
              className="rounded-full transition-all duration-300"
              style={{
                backgroundColor:
                  isCompleted || isActive ? colors.primary : colors.border,
                width: isActive ? '24px' : isCompleted ? '10px' : '8px',
                height: isActive ? '10px' : isCompleted ? '10px' : '8px',
                opacity: isActive || isCompleted ? 1 : 0.5,
              }}
            />
          );
        })}
      </div>
    </div>
  );
}