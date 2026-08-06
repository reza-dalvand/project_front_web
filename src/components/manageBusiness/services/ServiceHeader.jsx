'use client';
import { FiTag } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';

export default function ServiceHeader({ servicesCount }) {
  const { colors } = useTheme();
  return (
    <div className="flex flex-col items-center gap-2 pt-4 pb-5">
      <div
        className="w-[72px] h-[72px] rounded-3xl flex items-center justify-center mb-1"
        style={{ backgroundColor: colors.primary + '15' }}
      >
        <FiTag size={32} style={{ color: colors.primary }} />
      </div>
      <h2 className="text-xl font-[Vazir-Bold]" style={{ color: colors.textMain }}>
        خدمات سالن شما
      </h2>
      <p className="text-sm text-center" style={{ color: colors.textSecondary }}>
        مدیریت، ویرایش و افزودن خدمات جدید
      </p>
    </div>
  );
}
