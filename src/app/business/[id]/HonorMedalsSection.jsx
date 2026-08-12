// src/app/business/[id]/HonorMedalsSection.jsx
'use client';
import { useMemo } from 'react';
import { FiAward } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import { toPersianDigit } from '@/utils/numberUtils';
import { HONOR_MEDALS, getTagCounts } from '@/data/honorMedals';

export default function HonorMedalsSection({ businessId }) {
  const { colors } = useTheme();
  const tagCounts = getTagCounts(businessId);

  // ساخت لیست مدال‌ها + مرتب‌سازی (فعال‌ها اول)
  const medals = useMemo(() => {
    const list = HONOR_MEDALS.map((medal) => {
      const count = tagCounts[medal.tagId] || 0;
      const isActive = count >= medal.threshold;
      return { ...medal, count, isActive };
    });
    return [...list].sort((a, b) => {
      if (a.isActive && !b.isActive) return -1;
      if (!a.isActive && b.isActive) return 1;
      return b.count - a.count;
    });
  }, [tagCounts]);

  const activeCount = medals.filter((m) => m.isActive).length;

  return (
    <div className="flex flex-col gap-4 pb-2">
      {/* ═══ هدر بخش ═══ */}
      <div className="flex items-center gap-2.5">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: '#FFD70020' }}
        >
          <FiAward size={18} color="#FFD700" />
        </div>
        <div className="flex-1">
          <h3 className="text-base font-[Vazir-Bold]" style={{ color: colors.textMain }}>
            نشان‌های افتخار
          </h3>
          <p className="text-xs font-[Vazir]" style={{ color: colors.textSecondary }}>
            بر اساس نظرات مشتریان
          </p>
        </div>
        <div
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl"
          style={{ backgroundColor: '#FFD70015' }}
        >
          <span className="text-xs font-[Vazir-Bold]" style={{ color: '#B8860B' }}>
            {toPersianDigit(activeCount)} از {toPersianDigit(medals.length)}
          </span>
        </div>
      </div>

      {/* ═══ گرید مدال‌ها ═══ */}
      <div className="grid grid-cols-3 gap-3">
        {medals.map((medal) => (
          <div
            key={medal.id}
            className="flex flex-col items-center gap-2 p-3.5 rounded-2xl border text-center transition-all duration-200"
            style={{
              backgroundColor: medal.isActive ? colors.cardBackground : colors.background,
              borderColor: medal.isActive ? '#FFD70060' : colors.border,
              opacity: medal.isActive ? 1 : 0.55,
              filter: medal.isActive ? 'none' : 'grayscale(1)',
            }}
          >
            {/* دایره ایموجی */}
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center text-2xl"
              style={{
                backgroundColor: medal.isActive ? '#FFD70020' : colors.border + '30',
                border: medal.isActive ? '2px solid #FFD700' : `2px solid ${colors.border}`,
              }}
            >
              {medal.emoji}
            </div>
            {/* لیبل مدال */}
            <span
              className="text-[11px] font-[Vazir-Bold] leading-4 min-h-[32px]"
              style={{ color: medal.isActive ? colors.textMain : colors.textSecondary }}
            >
              {medal.label}
            </span>
            {/* تعداد نفرات */}
            <span className="text-[10px] font-[Vazir]" style={{ color: colors.textSecondary }}>
              {toPersianDigit(medal.count)} نفر نظر داده
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
