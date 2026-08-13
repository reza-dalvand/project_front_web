// src/components/customer/ReviewModal.jsx
'use client';
import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { FiX, FiStar, FiSend, FiCheck } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import { useToast } from '@/hooks/useToast';
import Button from '@/components/common/Button';
import StarRating from '@/components/common/StarRating';
import { acquireScrollLock, releaseScrollLock } from '@/utils/scrollLock';
import { useReviewStore, REVIEW_TAGS } from '@/stores/useReviewStore';
import { toPersianDigit } from '@/utils/numberUtils';

const MAX_COMMENT_LENGTH = 300; // هماهنگ با بک‌اند: comment max_length=300

export default function ReviewModal({ visible, appointment, onClose }) {
  const { colors } = useTheme();
  const { showToast } = useToast();
  const submitReview = useReviewStore((s) => s.submitReview);
  const isLoading = useReviewStore((s) => s.isLoading);

  const [rating, setRating] = useState(0);
  const [selectedTags, setSelectedTags] = useState([]);
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
      setRating(0);
      setSelectedTags([]);
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

  const toggleTag = (tagId) => {
    setSelectedTags((prev) =>
      prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]
    );
  };

  // ─── ثبت نظر — هماهنگ با بک‌اند ───
  const handleSubmit = async () => {
    if (rating === 0 && selectedTags.length === 0 && !comment.trim()) {
      showToast('لطفاً حداقل امتیاز یا نظر خود را ثبت کنید', 'warning');
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
        rating,
        tags: selectedTags,
        comment: comment.trim(),
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
            <p className="text-xs font-[Vazir]" style={{ color: colors.textSecondary }}>
              {appointment.serviceName}
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
            /* ═══ حالت موفقیت ═══ */
            <div className="flex flex-col items-center gap-4 py-8">
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
              {selectedTags.length > 0 && (
                <div
                  className="flex items-center gap-2 px-4 py-2 rounded-xl border"
                  style={{ backgroundColor: '#43A04715', borderColor: '#43A04740' }}
                >
                  <FiStar size={14} color="#43A047" />
                  <span className="text-xs font-[Vazir-Bold]" style={{ color: '#43A047' }}>
                    {toPersianDigit(selectedTags.length)} مورد ثبت شد
                  </span>
                </div>
              )}
            </div>
          ) : (
            <>
              {/* ═══ امتیاز ═══ */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: '#FFC10720' }}
                  >
                    <FiStar size={16} color="#FFC107" />
                  </div>
                  <span className="text-sm font-[Vazir-Bold]" style={{ color: colors.textMain }}>
                    تجربه‌تان چطور بود؟
                  </span>
                </div>
                <div className="flex justify-center py-2">
                  <StarRating value={rating} size="lg" interactive onRate={setRating} />
                </div>
              </div>

              {/* ═══ تگ‌ها — هماهنگ با بک‌اند ═══ */}
              <div className="space-y-3">
                <span
                  className="text-sm font-[Vazir-Bold] block"
                  style={{ color: colors.textMain }}
                >
                  چه چیزی را دوست داشتید؟
                </span>
                <div className="flex flex-wrap gap-2">
                  {REVIEW_TAGS.map((tag) => {
                    const isSelected = selectedTags.includes(tag.id);
                    return (
                      <button
                        key={tag.id}
                        onClick={() => toggleTag(tag.id)}
                        className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl
                          border-[1.5px] text-[13px] font-[Vazir-Medium]
                          transition-all duration-200 hover:scale-[1.03] active:scale-[0.97]"
                        style={{
                          backgroundColor: isSelected
                            ? colors.primary + '15'
                            : colors.cardBackground,
                          borderColor: isSelected ? colors.primary : colors.border,
                          color: isSelected ? colors.primary : colors.textMain,
                        }}
                      >
                        {isSelected && <FiCheck size={13} />}
                        {tag.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* ═══ نظر متنی ═══ */}
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
