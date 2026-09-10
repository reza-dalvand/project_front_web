'use client';
import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { useTheme } from '@/stores/useThemeStore';
import { useToast } from '@/hooks/useToast';
import Button from '@/components/common/Button';
import { acquireScrollLock, releaseScrollLock } from '@/utils/scrollLock';
import { useReviewStore, REVIEW_TAGS } from '@/stores/useReviewStore';
import { toPersianDigit } from '@/utils/numberUtils';
import { FiX, FiSend, FiCheck, FiThumbsUp, FiThumbsDown } from 'react-icons/fi';

const MAX_COMMENT_LENGTH = 300;

const TAG_EMOJIS = {
  clean: '🧹',
  punctual: '⏰',
  quality: '💎',
  polite: '🙏',
  fair_price: '💰',
  recommend: '👍',
};

export default function ReviewModal({ visible, appointment, onClose }) {
  const { colors } = useTheme();
  const { showToast } = useToast();
  const submitReview = useReviewStore((s) => s.submitReview);
  const isLoading = useReviewStore((s) => s.isLoading);

  const [tagVotes, setTagVotes] = useState({});
  const [comment, setComment] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [mounted, setMounted] = useState(false);
  const instanceId = useRef('review-modal');

  useEffect(() => {
    setMounted(true);
    return () => {
      setMounted(false);
      releaseScrollLock(instanceId.current);
    };
  }, []);

  useEffect(() => {
    if (visible) {
      setTagVotes({});
      setComment('');
      setShowSuccess(false);
      acquireScrollLock(instanceId.current);
    } else {
      releaseScrollLock(instanceId.current);
    }
    return () => releaseScrollLock(instanceId.current);
  }, [visible]);

  useEffect(() => {
    if (!visible) return;
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [visible, onClose]);

  const voteTag = (tagId, voteType) => {
    setTagVotes((prev) => {
      const current = prev[tagId];
      if (current === voteType) {
        const newVotes = { ...prev };
        delete newVotes[tagId];
        return newVotes;
      }
      return { ...prev, [tagId]: voteType };
    });
  };

  const handleSubmit = async () => {
    const tagVotesArray = Object.entries(tagVotes).map(([tagId, voteType]) => ({
      tag_id: tagId,
      vote_type: voteType,
    }));

    if (tagVotesArray.length === 0 && !comment.trim()) {
      showToast('لطفاً حداقل یک نشان را انتخاب کنید یا نظر بدهید', 'warning');
      return;
    }

    if (comment.length > MAX_COMMENT_LENGTH) {
      showToast(
        `نظر نمی‌تواند بیشتر از ${toPersianDigit(MAX_COMMENT_LENGTH)} کاراکتر باشد`,
        'error'
      );
      return;
    }

    try {
      await submitReview(appointment.id, {
        comment: comment.trim(),
        tag_votes: tagVotesArray,
      });

      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        onClose?.();
      }, 2500);
    } catch (error) {
      showToast(error.message || 'خطا در ثبت نظر', 'error');
    }
  };

  if (!mounted || !visible || !appointment) return null;

  const content = (
    <div
      className="fixed inset-0 z-[9999] flex items-end md:items-center justify-center"
      style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
      onClick={(e) => e.target === e.currentTarget && onClose?.()}
    >
      <div
        className="w-full max-w-md max-h-[90vh] rounded-t-3xl md:rounded-3xl
          flex flex-col overflow-hidden shadow-2xl"
        style={{
          backgroundColor: colors.cardBackground,
          borderTop: `1px solid ${colors.border}`,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* هدر */}
        <div
          className="flex items-center gap-3 px-5 py-4 border-b"
          style={{ borderColor: colors.border }}
        >
          {appointment.businessLogo && (
            <Image
              src={appointment.businessLogo}
              alt={appointment.businessName}
              width={44}
              height={44}
              className="rounded-xl"
            />
          )}
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-[Vazir-Bold] truncate" style={{ color: colors.textMain }}>
              {appointment.businessName}
            </h3>
            <p
              className="text-[11px] font-[Vazir] truncate"
              style={{ color: colors.textSecondary }}
            >
              {appointment.serviceName}
              {appointment.date && (
                <span> • {toPersianDigit(String(appointment.date).replace(/\//g, '/'))}</span>
              )}
              {appointment.time && (
                <span> • {toPersianDigit(String(appointment.time).substring(0, 5))}</span>
              )}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: colors.background }}
          >
            <FiX size={20} style={{ color: colors.textMain }} />
          </button>
        </div>

        {/* محتوا */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {showSuccess ? (
            <div className="flex flex-col items-center gap-4 py-10">
              <div
                className="w-24 h-24 rounded-full flex items-center justify-center shadow-lg"
                style={{ backgroundColor: '#43A047' }}
              >
                <FiCheck size={48} color="#fff" />
              </div>
              <h3
                className="text-xl font-[Vazir-Bold] text-center"
                style={{ color: colors.textMain }}
              >
                نظر شما ثبت شد!
              </h3>
              <p
                className="text-sm font-[Vazir] text-center leading-6"
                style={{ color: colors.textSecondary }}
              >
                ممنون که تجربه‌تان را با دیگران به اشتراک گذاشتید
              </p>
            </div>
          ) : (
            <>
              {/* عنوان */}
              <div className="text-center space-y-1">
                <h3 className="text-lg font-[Vazir-Bold]" style={{ color: colors.textMain }}>
                  تجربه‌تان چطور بود؟
                </h3>
                <p className="text-xs font-[Vazir]" style={{ color: colors.textSecondary }}>
                  نظرتان به بهبود خدمات کمک می‌کند
                </p>
              </div>

              {/* تگ‌ها با لایک/دیسلایک */}
              <div className="space-y-2">
                {REVIEW_TAGS.map((tag) => {
                  const vote = tagVotes[tag.id];
                  const isLike = vote === 'like';
                  const isDislike = vote === 'dislike';
                  const emoji = TAG_EMOJIS[tag.id] || '⭐';

                  return (
                    <div
                      key={tag.id}
                      className="flex items-center gap-3 p-3 rounded-2xl border transition-all duration-200"
                      style={{
                        backgroundColor: isLike
                          ? '#4CAF5008'
                          : isDislike
                            ? '#F4433608'
                            : colors.background,
                        borderColor: isLike ? '#4CAF5040' : isDislike ? '#F4433640' : colors.border,
                      }}
                    >
                      {/* ایموجی */}
                      <span className="text-xl flex-shrink-0">{emoji}</span>

                      {/* نام تگ */}
                      <span
                        className="flex-1 text-[13px] font-[Vazir-Medium]"
                        style={{ color: colors.textMain }}
                      >
                        {tag.label}
                      </span>

                      {/* دکمه‌های لایک/دیسلایک */}
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => voteTag(tag.id, 'like')}
                          className="flex items-center justify-center w-10 h-10 rounded-xl
                            transition-all duration-200 hover:scale-110 active:scale-95"
                          style={{
                            backgroundColor: isLike ? '#4CAF50' : colors.cardBackground,
                            border: `1.5px solid ${isLike ? '#4CAF50' : colors.border}`,
                          }}
                          aria-label={`لایک ${tag.label}`}
                        >
                          <FiThumbsUp
                            size={16}
                            style={{ color: isLike ? '#fff' : colors.textSecondary }}
                            fill={isLike ? '#fff' : 'transparent'}
                          />
                        </button>

                        <button
                          onClick={() => voteTag(tag.id, 'dislike')}
                          className="flex items-center justify-center w-10 h-10 rounded-xl
                            transition-all duration-200 hover:scale-110 active:scale-95"
                          style={{
                            backgroundColor: isDislike ? '#F44336' : colors.cardBackground,
                            border: `1.5px solid ${isDislike ? '#F44336' : colors.border}`,
                          }}
                          aria-label={`دیسلایک ${tag.label}`}
                        >
                          <FiThumbsDown
                            size={16}
                            style={{ color: isDislike ? '#fff' : colors.textSecondary }}
                            fill={isDislike ? '#fff' : 'transparent'}
                          />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* نظر متنی */}
              <div className="space-y-2">
                <label
                  className="text-sm font-[Vazir-Bold] block"
                  style={{ color: colors.textMain }}
                >
                  نظر شما (اختیاری)
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => {
                    if (e.target.value.length <= MAX_COMMENT_LENGTH) {
                      setComment(e.target.value);
                    }
                  }}
                  placeholder="اگه توضیح بیشتری دارید بنویسید..."
                  maxLength={MAX_COMMENT_LENGTH}
                  rows={3}
                  className="w-full p-4 rounded-2xl border-2 outline-none resize-none
                    text-sm font-[Vazir] leading-6 transition-colors"
                  style={{
                    backgroundColor: colors.background,
                    borderColor: colors.border,
                    color: colors.textMain,
                    direction: 'rtl',
                  }}
                />
                <div className="flex justify-between items-center">
                  <span className="text-[11px]" style={{ color: colors.textSecondary }}>
                    {toPersianDigit(comment.length)}/{toPersianDigit(MAX_COMMENT_LENGTH)}
                  </span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* فوتر */}
        {!showSuccess && (
          <div
            className="px-5 pt-4 border-t"
            style={{
              borderColor: colors.border,
              paddingBottom: 'calc(16px + env(safe-area-inset-bottom, 0px))',
            }}
          >
            <Button
              title={isLoading ? 'در حال ثبت...' : 'ثبت نظر'}
              onPress={handleSubmit}
              loading={isLoading}
              disabled={isLoading}
              variant="primary"
              size="lg"
              fullWidth
              icon={<FiSend size={18} color="#fff" />}
              iconPosition="right"
            />
          </div>
        )}
      </div>
    </div>
  );

  return createPortal(content, document.body);
}
