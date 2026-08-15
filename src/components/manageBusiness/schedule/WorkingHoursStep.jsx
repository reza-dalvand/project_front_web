// src/components/manageBusiness/schedule/WorkingHoursStep.jsx
'use client';
import { FiInfo } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import WorkRangeSection from './WorkRangeSection';
import BreaksSection from './BreaksSection';
import SlotsPreview from './SlotsPreview';
import { toPersianDigit } from '@/utils/numberUtils';

const formatDuration = (minutes) => {
  if (minutes >= 60) {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return m > 0
      ? `${toPersianDigit(h)} ساعت و ${toPersianDigit(m)} دقیقه`
      : `${toPersianDigit(h)} ساعت`;
  }
  return `${toPersianDigit(minutes)} دقیقه`;
};

export default function WorkingHoursStep({
  workStart,
  workEnd,
  slotDuration,
  breaks,
  onWorkStartChange,
  onWorkEndChange,
  onBreaksChange,
}) {
  const { colors } = useTheme();

  return (
    <div className="flex flex-col gap-4 px-3 sm:px-4 w-full max-w-full overflow-hidden">
      {/* بخش ۱: بازه کاری */}
      <WorkRangeSection
        workStart={workStart}
        workEnd={workEnd}
        onWorkStartChange={onWorkStartChange}
        onWorkEndChange={onWorkEndChange}
      />

      {/* بخش ۲: اطلاعات مدت نوبت (فقط خواندنی) */}
      <div
        className="flex items-center gap-3 p-3.5 rounded-2xl border"
        style={{
          backgroundColor: colors.primary + '06',
          borderColor: colors.primary + '25',
        }}
      >
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: colors.primary + '15' }}
        >
          <FiInfo size={18} style={{ color: colors.primary }} />
        </div>
        <div className="flex-1">
          <span className="text-xs font-[Vazir] block" style={{ color: colors.textSecondary }}>
            مدت هر نوبت (از تنظیمات خدمت)
          </span>
          <span className="text-sm font-[Vazir-Bold]" style={{ color: colors.primary }}>
            ⏱️ {formatDuration(slotDuration)}
          </span>
        </div>
      </div>

      {/* بخش ۳: بازه‌های استراحت */}
      <BreaksSection
        breaks={breaks}
        workStart={workStart}
        workEnd={workEnd}
        onBreaksChange={onBreaksChange}
      />

      {/* بخش ۴: پیش‌نمایش نوبت‌ها */}
      <SlotsPreview
        workStart={workStart}
        workEnd={workEnd}
        slotDuration={slotDuration}
        breaks={breaks}
      />
    </div>
  );
}
