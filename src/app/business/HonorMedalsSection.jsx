'use client';

import { useMemo, useState, useEffect, useCallback } from 'react';
import { FiAward, FiThumbsUp, FiThumbsDown } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import { useAuth } from '@/stores/useAuthStore';
import { useToast } from '@/hooks/useToast';
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
  const { isAuthenticated, requireAuth } = useAuth();
  const { showToast } = useToast();

  const [tagStats, setTagStats] = useState({});
  const [userVotes, setUserVotes] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [votingTag, setVotingTag] = useState(null); // tag در حال رای‌گیری

  // ═══════ دریافت آمار تگ‌ها از بک‌اند ═══════
  useEffect(() => {
    if (!businessId) return;

    const fetchTagVotes = async () => {
      setIsLoading(true);
      try {
        const result = await reviewsService.getTagVotes(businessId);
        setTagStats(result.data?.tagStats || result.data?.tag_stats || {});
        setUserVotes(result.data?.userVotes || result.data?.user_votes || {});
      } catch (error) {
        console.error('Failed to fetch tag votes:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTagVotes();
  }, [businessId]);

  // ═══════ ثبت رای ═══════
  const handleVote = useCallback(
    async (tagId, voteType) => {
      if (!isAuthenticated) {
        requireAuth(() => {});
        return;
      }

      if (votingTag) return; // جلوگیری از کلیک همزمان
      setVotingTag(tagId);

      // Optimistic update
      const prevStats = { ...tagStats };
      const prevUserVotes = { ...userVotes };
      const currentVote = userVotes[tagId];
      const stat = tagStats[tagId] || { selected_count: 0, likes: 0, dislikes: 0 };

      let newStat = { ...stat };
      let newUserVote = null;

      if (currentVote === voteType) {
        // حذف رای
        if (voteType === 'like') newStat.likes = Math.max(0, newStat.likes - 1);
        else newStat.dislikes = Math.max(0, newStat.dislikes - 1);
        newUserVote = null;
      } else {
        // اگر رای قبلی داشت، کمش کن
        if (currentVote === 'like') newStat.likes = Math.max(0, newStat.likes - 1);
        if (currentVote === 'dislike') newStat.dislikes = Math.max(0, newStat.dislikes - 1);
        // رای جدید اضافه کن
        if (voteType === 'like') newStat.likes += 1;
        else newStat.dislikes += 1;
        newUserVote = voteType;
      }

      setTagStats((prev) => ({ ...prev, [tagId]: newStat }));
      setUserVotes((prev) => {
        const updated = { ...prev };
        if (newUserVote) updated[tagId] = newUserVote;
        else delete updated[tagId];
        return updated;
      });

      try {
        await reviewsService.toggleTagVote(businessId, tagId, voteType);
      } catch (error) {
        // Rollback
        console.error('Vote failed:', error);
        setTagStats(prevStats);
        setUserVotes(prevUserVotes);
        showToast('خطا در ثبت رای', 'error');
      } finally {
        setVotingTag(null);
      }
    },
    [businessId, isAuthenticated, requireAuth, tagStats, userVotes, votingTag, showToast]
  );

  // ساخت لیست مدال‌ها — همه فعال
  const medals = useMemo(() => {
    return HONOR_MEDALS.map((medal) => {
      const stat = tagStats[medal.tagId] || { selected_count: 0, likes: 0, dislikes: 0 };
      const myVote = userVotes[medal.tagId] || null;
      return {
        ...medal,
        selectedCount: stat.selected_count || stat.selectedCount || 0,
        likes: stat.likes || 0,
        dislikes: stat.dislikes || 0,
        myVote,
      };
    });
  }, [tagStats, userVotes]);

  const totalVotes = medals.reduce((sum, m) => sum + m.likes, 0);

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
            بر اساس نظرات مشتریان • {toPersianDigit(totalVotes)} رای
          </p>
        </div>
      </div>

      {/* ═══ گرید مدال‌ها ═══ */}
      <div className="grid grid-cols-3 gap-3">
        {medals.map((medal) => (
          <div
            key={medal.id}
            className="flex flex-col items-center gap-2 p-3 rounded-2xl border text-center transition-all duration-200"
            style={{
              backgroundColor: colors.cardBackground,
              borderColor: medal.likes > 0 ? '#FFD70060' : colors.border,
            }}
          >
            {/* دایره ایموجی */}
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center text-xl"
              style={{
                backgroundColor: medal.likes > 0 ? '#FFD70020' : colors.border + '30',
                border: medal.likes > 0 ? '2px solid #FFD700' : `2px solid ${colors.border}`,
              }}
            >
              {medal.emoji}
            </div>

            {/* لیبل مدال */}
            <span
              className="text-[11px] font-[Vazir-Bold] leading-4 min-h-[32px]"
              style={{ color: colors.textMain }}
            >
              {medal.label}
            </span>

            {/* تعداد انتخاب */}
            <span className="text-[10px] font-[Vazir]" style={{ color: colors.textSecondary }}>
              {toPersianDigit(medal.selectedCount)} نفر انتخاب کرده
            </span>

            {/* ✅ دکمه‌های لایک/دیسلایک */}
            <div
              className="flex items-center gap-3 mt-1 pt-2 w-full justify-center border-t"
              style={{ borderColor: colors.border }}
            >
              {/* لایک */}
              <button
                onClick={() => handleVote(medal.tagId, 'like')}
                disabled={votingTag === medal.tagId}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg
                  transition-all duration-200 hover:scale-110 active:scale-95"
                style={{
                  backgroundColor: medal.myVote === 'like' ? '#4CAF5020' : 'transparent',
                }}
              >
                <FiThumbsUp
                  size={13}
                  style={{
                    color: medal.myVote === 'like' ? '#4CAF50' : colors.textSecondary,
                  }}
                  fill={medal.myVote === 'like' ? '#4CAF50' : 'transparent'}
                />
                <span
                  className="text-[11px] font-[Vazir-Bold]"
                  style={{
                    color: medal.myVote === 'like' ? '#4CAF50' : colors.textSecondary,
                  }}
                >
                  {toPersianDigit(medal.likes)}
                </span>
              </button>

              {/* جداکننده */}
              <div
                className="w-[1px] h-4"
                style={{ backgroundColor: colors.border }}
              />

              {/* دیسلایک */}
              <button
                onClick={() => handleVote(medal.tagId, 'dislike')}
                disabled={votingTag === medal.tagId}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg
                  transition-all duration-200 hover:scale-110 active:scale-95"
                style={{
                  backgroundColor: medal.myVote === 'dislike' ? '#F4433620' : 'transparent',
                }}
              >
                <FiThumbsDown
                  size={13}
                  style={{
                    color: medal.myVote === 'dislike' ? '#F44336' : colors.textSecondary,
                  }}
                  fill={medal.myVote === 'dislike' ? '#F44336' : 'transparent'}
                />
                <span
                  className="text-[11px] font-[Vazir-Bold]"
                  style={{
                    color: medal.myVote === 'dislike' ? '#F44336' : colors.textSecondary,
                  }}
                >
                  {toPersianDigit(medal.dislikes)}
                </span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}