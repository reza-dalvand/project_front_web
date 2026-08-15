// src/components/nearby/NearbyErrorState.jsx
'use client';
import { FiAlertTriangle, FiRefreshCw } from 'react-icons/fi';
import Button from '@/components/common/Button';
import { useTheme } from '@/stores/useThemeStore';

export default function NearbyErrorState({ errorMessage, onRetry }) {
  const { colors } = useTheme();

  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 gap-4">
      <div
        className="w-24 h-24 rounded-full flex items-center justify-center"
        style={{ backgroundColor: '#FF980015' }}
      >
        <FiAlertTriangle size={48} color="#FF9800" />
      </div>
      <h3 className="text-lg font-[Vazir-Bold] text-center" style={{ color: colors.textMain }}>
        خطا در دریافت موقعیت
      </h3>
      <p className="text-sm text-center leading-6 max-w-xs" style={{ color: colors.textSecondary }}>
        {errorMessage}
      </p>
      <Button
        title="تلاش مجدد"
        onPress={onRetry}
        variant="primary"
        size="lg"
        icon={<FiRefreshCw size={18} color="#fff" />}
        iconPosition="right"
      />
    </div>
  );
}