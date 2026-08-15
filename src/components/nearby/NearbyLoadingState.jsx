// src/components/nearby/NearbyLoadingState.jsx
'use client';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { useTheme } from '@/stores/useThemeStore';

export default function NearbyLoadingState() {
  const { colors } = useTheme();

  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <LoadingSpinner label="در حال دریافت موقعیت شما..." />
      <p className="text-xs text-center px-6" style={{ color: colors.textSecondary }}>
        لطفاً در صورت نمایش پیام مرورگر، اجازه دسترسی به موقعیت را بدهید
      </p>
    </div>
  );
}