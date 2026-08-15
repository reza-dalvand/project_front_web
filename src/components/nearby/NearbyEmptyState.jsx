// src/components/nearby/NearbyEmptyState.jsx
'use client';
import { FiMapPin, FiNavigation } from 'react-icons/fi';
import Button from '@/components/common/Button';
import { useTheme } from '@/stores/useThemeStore';

export default function NearbyEmptyState({ onEnableLocation }) {
  const { colors } = useTheme();

  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 gap-4">
      <div
        className="w-24 h-24 rounded-full flex items-center justify-center"
        style={{ backgroundColor: '#2196F315' }}
      >
        <FiMapPin size={48} color="#2196F3" />
      </div>
      <h3 className="text-lg font-[Vazir-Bold] text-center" style={{ color: colors.textMain }}>
        موقعیت مکانی لازم است
      </h3>
      <p className="text-sm text-center leading-6 max-w-xs" style={{ color: colors.textSecondary }}>
        برای نمایش کسب‌وکارهای نزدیک، لطفاً دسترسی موقعیت مکانی را فعال کنید
      </p>
      <Button
        title="فعال‌سازی موقعیت مکانی"
        onPress={onEnableLocation}
        variant="primary"
        size="lg"
        icon={<FiNavigation size={18} color="#fff" />}
        iconPosition="right"
      />
    </div>
  );
}
