// src/components/customer/ReviewModal.jsx
'use client';
import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { FiX, FiCheck, FiStar, FiSend } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import Button from '@/components/common/Button';
import Avatar from '@/components/common/Avatar';
import StarRating from '@/components/common/StarRating';
import { useToast } from '@/hooks/useToast';
import { reviewsService } from '@/api';
import { USE_MOCK } from '@/api/config';
import { acquireScrollLock, releaseScrollLock } from '@/utils/scrollLock';

const REVIEW_TAGS = [
  { id: 'clean', label: 'مکان تمیز بود' },
  { id: 'punctual', label: 'سر وقت انجام شد' },
  { id: 'quality', label: 'کیفیت عالی بود' },
  { id: 'polite', label: 'رفتار محترمانه' },
  { id: 'fair_price', label: 'قیمت مناسب بود' },
  { id: 'recommend', label: 'پیشنهاد می‌کنم' },
];

export default function ReviewModal({ visible, appointment, onClose, onSubmit }) {
  const { colors } = useTheme();
  const { showToast } = useToast();
  const [mounted, setMounted] = useState(false);
  const instanceId = useRef('review-modal');
  const [rating, setRating] = useState(0);
  const [selectedTags, setSelectedTags] = useState([]);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

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
      setIsSubmitting(false);
      setShowSuccess(false);
      acquireScrollLock(instanceId.current);
    } else {
      releaseScrollLock(instanceId.current);
    }
    return () => {
      releaseScrollLock(instanceId.current);
    };
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

  const handleSubmit = async () => {
    if (rating === 0 && selectedTags.length === 0 && !comment.trim()) {
      showToast('لطفاً حداقل امتیاز یا نظر خود را ثبت کنید', 'warning');
      return;
    }

    setIsSubmitting(true);

    try {
      // ✅ فراخوانی API (در حالت mock از سرویس استفاده می‌شود)
      if (!USE_MOCK) {
        await reviewsService.createReview({
          appointment_id: appointment?.id,
          rating,
          comment: comment.trim(),
          tags: selectedTags,
        });
      }

      // در حالت mock، شبیه‌سازی تأخیر
      if (USE_MOCK) {
        await new Promise((r) => setTimeout(r, 800));
      }

      // فراخوانی callback برای آپدیت store
      onSubmit?.({
        appointmentId: appointment?.id,
        rating,
        tags: selectedTags,
        comment: comment.trim(),
      });

      setIsSubmitting(false);
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        onClose?.();
      }, 2500);
    } catch (error) {
      setIsSubmitting(false);
      showToast(error.message || 'خطا در ثبت نظر', 'error');
    }
  };

  if (!mounted || !visible || !appointment) return null;

  const canSubmit = rating > 0 || selectedTags.length > 0 || comment.trim();

  const content = (
    <div
      className="fixed inset-0 z-[9999] flex items-end md:items-center justify-center"
      style={{ backgroundColor: 'rgba(0,0,0,0.55)' }}
      onClick={(e) => e.target === e.currentTarget && onClose?.()}
    >
      <div
        className="relative w-full max-w-md rounded-t-3xl md:rounded-3xl flex flex-col
max-h-[90vh] overflow-hidden shadow-2xl"
        style={{
          backgroundColor: colors.cardBackground,
          borderTop: `1px solid ${colors.border}`,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Handle Bar (موبایل) */}
        <div className="flex justify-center pt-3 pb-1 md:hidden">
          <div className="w-10 h-1 rounded-full" style={{ backgroundColor: colors.border }} />
        </div>

        {/* هدر */}
        <div
          className="flex items-center gap-3 px-5 py-4 border-b"
          style={{ borderColor: colors.border }}
        >
          <Avatar uri={appointment.businessLogo} name={appointment.businessName} size="sm" />
          <div className="flex flex-col gap-0.5 flex-1">
            <span className="text-sm font-[Vazir-Bold]" style={{ color: colors.textMain }}>
              {appointment.businessName}
            </span>
            <span className="text-xs font-[Vazir]" style={{ color: colors.textSecondary }}>
              {appointment.serviceName}
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: colors.background }}
          >
            <FiX size={20} style={{ color: colors.textMain }} />
          </button>
        </div>

        {/* محتوای اسکرولی */}
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
                  style={{
                    backgroundColor: '#43A04715',
                    borderColor: '#43A04740',
                  }}
                >
                  <FiStar size={14} color="#43A047" />
                  <span className="text-xs font-[Vazir-Bold]" style={{ color: '#43A047' }}>
                    {selectedTags.length} مورد ثبت شد
                  </span>
                </div>
              )}
            </div>
          ) : (
            <>
              {/* ═══ سوال ═══ */}
              <div className="flex items-center gap-2.5">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: colors.primary + '15' }}
                >
                  <FiStar size={18} style={{ color: colors.primary }} />
                </div>
                <span className="text-[15px] font-[Vazir-Bold]" style={{ color: colors.textMain }}>
                  تجربه‌تان چطور بود؟
                </span>
              </div>

              {/* ═══ ستاره‌ها ═══ */}
              <div className="flex justify-center py-2">
                <StarRating value={rating} size="lg" interactive onRate={setRating} />
              </div>

              {/* ═══ تگ‌ها ═══ */}
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
border-[1.5px] transition-all duration-200
hover:scale-105 active:scale-95"
                        style={{
                          backgroundColor: isSelected
                            ? colors.primary + '22'
                            : colors.cardBackground,
                          borderColor: isSelected ? colors.primary : colors.border,
                        }}
                      >
                        {isSelected && <FiCheck size={14} style={{ color: colors.primary }} />}
                        <span
                          className="text-[13px] font-[Vazir-Medium]"
                          style={{
                            color: isSelected ? colors.primary : colors.textSecondary,
                          }}
                        >
                          {tag.label}
                        </span>
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
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="اگه توضیح بیشتری دارید بنویسید..."
                  maxLength={300}
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
                  <span
                    className="text-[11px] font-[Vazir]"
                    style={{ color: colors.textSecondary }}
                  >
                    {comment.length}/300
                  </span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* فوتر */}
        {!showSuccess && (
          <div className="px-5 py-4 border-t space-y-3" style={{ borderColor: colors.border }}>
            <Button
              title={isSubmitting ? 'در حال ثبت...' : 'ثبت نظر'}
              onPress={handleSubmit}
              loading={isSubmitting}
              disabled={!canSubmit || isSubmitting}
              variant="primary"
              size="lg"
              fullWidth
              icon={<FiSend size={18} color="#fff" />}
              iconPosition="right"
            />
            <button onClick={onClose} className="w-full py-2 text-center">
              <span className="text-sm font-[Vazir-Medium]" style={{ color: colors.textSecondary }}>
                بعداً
              </span>
            </button>
          </div>
        )}
      </div>
    </div>
  );

  return createPortal(content, document.body);
}
