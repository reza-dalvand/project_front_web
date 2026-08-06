'use client';

import { FiCalendar } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import { Button } from '@/components/common';
import { formatPrice } from '@/utils/numberUtils';

export default function StickyBookingBar({ minPrice, onBookPress }) {
  const { colors } = useTheme();
  const NAVBAR_HEIGHT = 80;

  return (
    <div
      className="fixed left-0 right-0 pt-3 pb-3 border-t shadow-lg z-30"
      style={{
        backgroundColor: colors.cardBackground,
        borderTopColor: colors.border,
        bottom: `${NAVBAR_HEIGHT + 20}px`,
      }}
    >
      <div className="flex items-center px-5 gap-3">
        <div className="flex-1 flex flex-col gap-0.5">
          <span className="text-[11px]" style={{ color: colors.textSecondary }}>
            شروع از
          </span>
          <span className="text-base font-[Vazir-Bold]" style={{ color: colors.primary }}>
            {formatPrice(minPrice)}
          </span>
        </div>

        <Button
          title="رزرو نوبت"
          onPress={onBookPress}
          variant="primary"
          size="lg"
          icon={<FiCalendar size={20} color="#fff" />}
          iconPosition="right"
          className="px-7"
        />
      </div>
    </div>
  );
}
