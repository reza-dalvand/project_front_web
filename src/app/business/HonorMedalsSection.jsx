'use client';

import { useMemo, useState, useEffect } from 'react';
import { FiAward, FiThumbsUp, FiThumbsDown } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import { toPersianDigit } from '@/utils/numberUtils';
import { reviewsService } from '@/api';

const HONOR_MEDALS = [
  { id: 1, tagId: 'clean', label: 'مکان تمیز', emoji: '🧹' },
  { id: 2, tagId: 'punctual', label: 'وقت‌شناسی', emoji: '⏰' },
  { id: 3, tagId: 'quality', label: 'کیفیت عالی', emoji: '💎' },
  { id: 4, tagId: 'polite', label: 'رفتار محترمانه', emoji: '🙏' },
  { id: 5, tagId: 'fair_price', label: 'قیمت مناسب', emoji: '💰' },
  { id: 6, tagId: 'recommend', label: 'پیشنهاد می‌کنم', emoji: '👍' },
];

export default function HonorMedalsSection({ businessId }) {
  const { colors } = useTheme();
  const [tagStats, setTagStats] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!businessId) return;
    const fetchTagVotes = async () => {
      setIsLoading(true);
      try {
        const result = await reviewsService.getTagVotes(businessId);
        setTagStats(result.data?.tagStats || {});
      } catch (error) {
        console.error('Failed to fetch tag votes:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTagVotes();
  }, [businessId]);

  const medals = useMemo(() => {
    return HONOR_MEDALS.map((medal) => {
      const stat = tagStats[medal.tagId] || { selectedCount: 0, likes: 0, dislikes: 0 };
      return {
        ...medal,
        selectedCount: stat.selectedCount || 0,
        likes: stat.likes || 0,
        dislikes: stat.dislikes || 0,
      };
    });
  }, [tagStats]);

  const totalVotes = medals.reduce((sum, m) => sum + m.selectedCount, 0);

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <div className="w-8 h-8 border-3 border-current border-t-transparent rounded-full animate-spin" style={{ color: colors.primary }} />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 pb-2">
      <div className="flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#FFD70020' }}>
          <FiAward size={18} color="#FFD700" />
        </div>
        <div className="flex-1">
          <h3 className="text-base font-[Vazir-Bold]" style={{ color: colors.textMain }}>نشان‌های افتخار</h3>
          <p className="text-xs font-[Vazir]" style={{ color: colors.textSecondary }}>
            بر اساس نظرات مشتریان • {toPersianDigit(totalVotes)} رای
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {medals.map((medal) => (
          <div
            key={medal.id}
            className="flex flex-col items-center gap-2 p-3 rounded-2xl border text-center"
            style={{
              backgroundColor: colors.cardBackground,
              borderColor: medal.likes > 0 ? '#FFD70060' : colors.border,
            }}
          >
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center text-xl"
              style={{
                backgroundColor: medal.likes > 0 ? '#FFD70020' : colors.border + '30',
                border: medal.likes > 0 ? '2px solid #FFD700' : `2px solid ${colors.border}`,
              }}
            >
              {medal.emoji}
            </div>

            <span className="text-[11px] font-[Vazir-Bold] leading-4 min-h-[32px]" style={{ color: colors.textMain }}>
              {medal.label}
            </span>

            {/* ✅ بخش جدید: فقط نمایش آمار (بدون دکمه کلیک) */}
            <div className="flex items-center gap-3 mt-1 pt-2 w-full justify-center border-t" style={{ borderColor: colors.border }}>
              <div className="flex items-center gap-1">
                <FiThumbsUp size={13} color="#4CAF50" />
                <span className="text-[11px] font-[Vazir-Bold]" style={{ color: colors.textSecondary }}>
                  {toPersianDigit(medal.likes)}
                </span>
              </div>
              <div className="w-[1px] h-4" style={{ backgroundColor: colors.border }} />
              <div className="flex items-center gap-1">
                <FiThumbsDown size={13} color="#F44336" />
                <span className="text-[11px] font-[Vazir-Bold]" style={{ color: colors.textSecondary }}>
                  {toPersianDigit(medal.dislikes)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}