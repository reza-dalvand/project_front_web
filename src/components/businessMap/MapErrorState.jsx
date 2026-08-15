// src/components/businessMap/MapErrorState.jsx
'use client';
import { FiMapPin } from 'react-icons/fi';
import Button from '@/components/common/Button';
import { useTheme } from '@/stores/useThemeStore';

export default function MapErrorState({ isLoading }) {
  const { colors } = useTheme();

  return (
    <div className="flex items-center justify-center h-full">
      <div className="flex flex-col items-center gap-3">
        {isLoading ? (
          <>
            <div
              className="w-12 h-12 border-4 border-current border-t-transparent rounded-full animate-spin"
              style={{ color: colors.primary }}
            />
            <p className="text-sm font-[Vazir]" style={{ color: colors.textSecondary }}>
              در حال بارگذاری نقشه...
            </p>
          </>
        ) : (
          <>
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center"
              style={{ backgroundColor: '#E5393518' }}
            >
              <FiMapPin size={40} color="#E53935" />
            </div>
            <div className="text-center">
              <p className="text-base font-[Vazir-Bold] mb-1" style={{ color: colors.textMain }}>
                خطا در بارگذاری نقشه
              </p>
              <p className="text-xs font-[Vazir]" style={{ color: colors.textSecondary }}>
                لطفاً اتصال اینترنت خود را بررسی کنید
              </p>
            </div>
            <Button
              title="تلاش مجدد"
              onPress={() => window.location.reload()}
              variant="outline"
              size="md"
            />
          </>
        )}
      </div>
    </div>
  );
}
