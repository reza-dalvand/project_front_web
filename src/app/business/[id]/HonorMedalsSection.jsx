// src/app/business/[id]/HonorMedalsSection.jsx
'use client';

import { useMemo, useState, useEffect } from 'react';
import { FiAward } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import { toPersianDigit } from '@/utils/numberUtils';
import { reviewsService } from '@/api';

// ═══════ ثابت محلی: ساختار مدال‌ها ═══════
// این ساختار ثابت است — فقط تعداد هر تگ از بک‌اند خوانده می‌شود
const HONOR_MEDALS = [
  { id: 1, tagId: 'clean', label: 'مکان تمیز', emoji: '🧹', threshold: 1 },
  { id: 2, tagId: 'punctual', label: 'وقت‌شناسی', emoji: '⏰', threshold: 1 },
  { id: 3, tagId: 'quality', label: 'کیفیت عالی', emoji: '💎', threshold: 1 },
  { id: 4, tagId: 'polite', label: 'رفتار محترمانه', emoji: '🙏', threshold: 1 },
  { id: 5, tagId: 'fair_price', label: 'قیمت مناسب', emoji: '💰', threshold: 1 },
  { id: 6, tagId: 'recommend', label: 'پیشنهاد می‌کنم', emoji: '👍', threshold: 1 },
];

export default function HonorMedalsSection({ businessId }) {
  const { colors } = useTheme();
  const [tagCounts, setTagCounts] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  // ═══════ دریافت نظرات و شمارش تگ‌ها از بک‌اند ═══════
  useEffect(() => {
    if (!businessId) return;

    const fetchReviews = async () => {
      setIsLoading(true);
      try {
        const result = await reviewsService.getBusinessReviews(businessId);
        const reviews = result.data?.reviews || [];

        // شمارش هر تگ در تمام نظرات
        const counts = {};
        reviews.forEach((review) => {
          const tags = review.tags || [];
          tags.forEach((tag) => {
            counts[tag] = (counts[tag] || 0) + 1;
          });
        });

        setTagCounts(counts);
      } catch (error) {
        console.error('Failed to fetch reviews for honor medals:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReviews();
  }, [businessId]);

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

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <div
          className="w-8 h-8 border-3 border-current border-t-transparent rounded-full animate-spin"
          style={{ color: colors.primary }}
        />
      </div>
    );
  }

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