'use client';
import { FiBell } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';

export default function ReminderEmptyState() {
  const { colors } = useTheme();

  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 gap-4">
      <div
        className="w-24 h-24 rounded-full flex items-center justify-center"
        style={{ backgroundColor: '#FF980012' }}
      >
        <FiBell size={48} color="#FF9800" />
      </div>
      <h3 className="text-lg font-[Vazir-Bold] text-center" style={{ color: colors.textMain }}>
        مشتری برای یادآوری وجود ندارد
      </h3>
      <p
        className="text-sm font-[Vazir] text-center leading-6 max-w-xs"
        style={{ color: colors.textSecondary }}
      >
        در حال حاضر هیچ مشتری‌ای در این بازه زمانی نیاز به یادآوری تمدید ندارد. پس از نزدیک شدن موعد
        تمدید خدمات، مشتریان اینجا نمایش داده می‌شوند.
      </p>
    </div>
  );
}
