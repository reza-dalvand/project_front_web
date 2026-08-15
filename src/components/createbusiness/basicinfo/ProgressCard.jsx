// src/components/createbusiness/basicinfo/ProgressCard.jsx
'use client';
import { useTheme } from '@/stores/useThemeStore';
import { toPersianDigit } from '@/utils/numberUtils';

export default function ProgressCard({ filledCount, totalCount }) {
  const { colors } = useTheme();

  return (
    <div
      className="rounded-2xl border p-4"
      style={{ backgroundColor: colors.cardBackground, borderColor: colors.border }}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-[Vazir-Medium]" style={{ color: colors.textSecondary }}>
          تکمیل اطلاعات
        </span>
        <span className="text-xs font-[Vazir-Bold]" style={{ color: colors.primary }}>
          {toPersianDigit(filledCount)} از {toPersianDigit(totalCount)}
        </span>
      </div>
      <div
        className="h-2 rounded-full overflow-hidden"
        style={{ backgroundColor: colors.border }}
      >
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${(filledCount / totalCount) * 100}%`,
            backgroundColor: filledCount === totalCount ? '#4CAF50' : colors.primary,
          }}
        />
      </div>
    </div>
  );
}