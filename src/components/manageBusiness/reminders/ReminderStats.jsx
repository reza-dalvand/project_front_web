'use client';
import { FiBell, FiSend, FiClock } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import Card from '@/components/common/Card';
import StatsCard from '@/components/common/StatsCard';
import { toPersianDigit } from '@/utils/numberUtils';

/**
 * آمار کلی بخش یادآوری خدمت
 * @param {number} totalDue      - تعداد کل مشتریان نیازمند یادآوری
 * @param {number} sentToday     - تعداد ارسال‌شده‌های امروز
 * @param {number} overdue       - تعداد گذشته از موعد
 */
export default function ReminderStats({ totalDue = 0, sentToday = 0, overdue = 0 }) {
  const { colors } = useTheme();

  return (
    <Card variant="elevated" padding={14} radius={18} className="mx-4 mb-4">
      <div className="flex items-center">
        <StatsCard
          icon={<FiBell size={18} />}
          label="نیازمند یادآوری"
          value={toPersianDigit(totalDue)}
          color="#FF9800"
          variant="compact"
        />
        <div className="w-px h-10 mx-2" style={{ backgroundColor: colors.border }} />
        <StatsCard
          icon={<FiClock size={18} />}
          label="گذشته از موعد"
          value={toPersianDigit(overdue)}
          color="#E53935"
          variant="compact"
        />
        <div className="w-px h-10 mx-2" style={{ backgroundColor: colors.border }} />
        <StatsCard
          icon={<FiSend size={18} />}
          label="ارسال شده امروز"
          value={toPersianDigit(sentToday)}
          color="#43A047"
          variant="compact"
        />
      </div>
    </Card>
  );
}
