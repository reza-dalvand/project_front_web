'use client';
import { useState, useEffect, useMemo } from 'react';
import {
  FiX,
  FiChevronLeft,
  FiChevronRight,
  FiEdit2,
  FiTrash2,
  FiImage,
  FiTag,
} from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import Button from '@/components/common/Button';
import { toPersianDigit } from '@/utils/numberUtils';
import ConfirmDialog from '@/components/common/ConfirmDialog';

export default function PortfolioDetailModal({
  visible,
  portfolio,
  services = [],
  onClose,
  onEdit,
  onDelete,
}) {
  const { colors } = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);

  useEffect(() => {
    setCurrentIndex(0);
  }, [portfolio, visible]);

  const images = useMemo(() => {
    // اگر تصاویر گالری وجود دارند
    if (portfolio?.images && portfolio.images.length > 0) {
      return portfolio.images
        .map((img) => {
          // اگر مستقیماً مسیر باشد (رشته)
          if (typeof img === 'string') return img;
          // اگر آبجکت باشد → مسیر کامل را استخراج کن
          return img.imageUrl || img.image_url || img.image || null;
        })
        .filter(Boolean); // مقادیر خالی را حذف کن
    }

    // اگر فقط کاور وجود دارد
    if (portfolio?.coverImageUrl) {
      return [portfolio.coverImageUrl];
    }
    if (portfolio?.coverImage) {
      // مسیر نسبی را به مسیر کامل تبدیل کن
      if (typeof portfolio.coverImage === 'string') {
        if (portfolio.coverImage.startsWith('http')) {
          return [portfolio.coverImage];
        }
        // مسیر نسبی → با دامنه کامل کن
        return [getFullImageUrl(portfolio.coverImage)];
      }
      return [portfolio.coverImage];
    }

    return [];
  }, [portfolio]);

  if (!visible || !portfolio) return null;

  const serviceName = services.find((s) => s.id === portfolio.serviceId)?.name || null;

  const goToPrev = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };

  const goToNext = () => {
    if (currentIndex < images.length - 1) setCurrentIndex(currentIndex + 1);
  };

  const handleDeleteRequest = () => {
    setDeleteDialogVisible(true);
  };

  const handleDeleteConfirm = () => {
    setDeleteDialogVisible(false);
    onClose();
    onDelete?.(portfolio);
  };

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="relative w-full max-w-lg max-h-[90vh] rounded-3xl overflow-hidden flex flex-col"
        style={{ backgroundColor: colors.background, border: `1px solid ${colors.border}` }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ═══════ هدر ═══════ */}
        <div
          className="flex items-center justify-between px-4 py-3 border-b"
          style={{ backgroundColor: colors.cardBackground, borderColor: colors.border }}
        >
          <span
            className="text-sm font-[Vazir-Bold] flex-1 min-w-0 truncate pr-2"
            style={{ color: colors.textMain }}
          >
            {portfolio.title || 'نمونه‌کار'}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                setTimeout(() => onEdit?.(portfolio), 300);
              }}
              className="w-9 h-9 rounded-full flex items-center justify-center"
              style={{ backgroundColor: colors.primary + '15' }}
            >
              <FiEdit2 size={16} style={{ color: colors.primary }} />
            </button>
            <button
              onClick={handleDeleteRequest}
              className="w-9 h-9 rounded-full flex items-center justify-center"
              style={{ backgroundColor: '#E5393515' }}
            >
              <FiTrash2 size={16} color="#E53935" />
            </button>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full flex items-center justify-center"
              style={{ backgroundColor: colors.background }}
            >
              <FiX size={18} style={{ color: colors.textMain }} />
            </button>
          </div>
        </div>

        {/* ═══════ گالری تصاویر ═══════ */}
        <div className="relative w-full aspect-square bg-black">
          {images.length > 0 && (
            <img
              src={images[currentIndex]}
              alt={`${portfolio.title} - تصویر ${currentIndex + 1}`}
              className="w-full h-full object-cover"
            />
          )}

          {/* فلش قبلی */}
          {images.length > 1 && currentIndex > 0 && (
            <button
              onClick={goToPrev}
              className="absolute top-1/2 -translate-y-1/2 right-3 w-10 h-10 rounded-full flex items-center justify-center transition-transform hover:scale-110"
              style={{
                backgroundColor: 'rgba(0,0,0,0.5)',
                border: '1px solid rgba(255,255,255,0.25)',
              }}
            >
              <FiChevronRight size={24} color="#fff" />
            </button>
          )}

          {/* فلش بعدی */}
          {images.length > 1 && currentIndex < images.length - 1 && (
            <button
              onClick={goToNext}
              className="absolute top-1/2 -translate-y-1/2 left-3 w-10 h-10 rounded-full flex items-center justify-center transition-transform hover:scale-110"
              style={{
                backgroundColor: 'rgba(0,0,0,0.5)',
                border: '1px solid rgba(255,255,255,0.25)',
              }}
            >
              <FiChevronLeft size={24} color="#fff" />
            </button>
          )}

          {/* شمارنده تصاویر */}
          {images.length > 1 && (
            <div
              className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-xl"
              style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
            >
              <FiImage size={12} color="#fff" />
              <span className="text-[11px] font-[Vazir-Bold] text-white">
                {toPersianDigit(images.length)} از {toPersianDigit(currentIndex + 1)}
              </span>
            </div>
          )}
        </div>

        {/* ═══════ Indicator Dots ═══════ */}
        {images.length > 1 && (
          <div
            className="flex items-center justify-center gap-1.5 py-3"
            style={{
              backgroundColor: colors.cardBackground,
              borderBottom: `1px solid ${colors.border}`,
            }}
          >
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className="h-1.5 rounded-full transition-all duration-300"
                style={{
                  backgroundColor: i === currentIndex ? colors.primary : colors.border,
                  width: i === currentIndex ? '20px' : '6px',
                }}
              />
            ))}
          </div>
        )}

        {/* ═══════ محتوای اسکرولی ═══════ */}
        <div className="flex-1 overflow-y-auto min-w-0 overflow-x-hidden p-4 space-y-4">
          {/* عنوان و دسته‌بندی */}
          <div
            className="p-4 rounded-2xl border"
            style={{ backgroundColor: colors.cardBackground, borderColor: colors.border }}
          >
            <div className="flex items-center gap-2 mb-3">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: colors.primary + '15' }}
              >
                <FiImage size={16} style={{ color: colors.primary }} />
              </div>
              <span className="text-xs font-[Vazir-Bold]" style={{ color: colors.textSecondary }}>
                عنوان نمونه‌کار
              </span>
            </div>
            <p
              className="text-base font-[Vazir-Bold] w-full min-w-0 break-words whitespace-normal leading-7"
              style={{ color: colors.textMain }}
            >
              {portfolio.title || 'نمونه‌کار'}
            </p>

            {/* خدمت مرتبط - ساختار سلسله‌مراتبی */}
            {(portfolio.categoryLabel || portfolio.subServiceLabel || serviceName) && (
              <div className="flex items-center gap-1.5 mt-3 flex-wrap">
                {portfolio.categoryLabel && (
                  <div
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg"
                    style={{ backgroundColor: '#9C27B015' }}
                  >
                    <FiTag size={11} color="#9C27B0" />
                    <span className="text-[11px] font-[Vazir-Bold]" style={{ color: '#9C27B0' }}>
                      {portfolio.categoryLabel}
                    </span>
                  </div>
                )}
                {portfolio.subServiceLabel && (
                  <div
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg"
                    style={{ backgroundColor: colors.primary + '15' }}
                  >
                    <FiTag size={11} style={{ color: colors.primary }} />
                    <span
                      className="text-[11px] font-[Vazir-Bold]"
                      style={{ color: colors.primary }}
                    >
                      {portfolio.subServiceLabel}
                    </span>
                  </div>
                )}
                {/* Fallback برای داده‌های قدیمی */}
                {!portfolio.categoryLabel && serviceName && (
                  <div
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg"
                    style={{ backgroundColor: colors.primary + '15' }}
                  >
                    <FiTag size={11} style={{ color: colors.primary }} />
                    <span
                      className="text-[11px] font-[Vazir-Bold]"
                      style={{ color: colors.primary }}
                    >
                      {serviceName}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* توضیحات */}
          <div
            className="p-4 rounded-2xl border"
            style={{ backgroundColor: colors.cardBackground, borderColor: colors.border }}
          >
            <div className="flex items-center gap-2 mb-3">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: '#2196F315' }}
              >
                <FiTag size={16} color="#2196F3" />
              </div>
              <span className="text-xs font-[Vazir-Bold]" style={{ color: colors.textSecondary }}>
                توضیحات
              </span>
            </div>
            {portfolio.description ? (
              <p
                className="text-sm w-full min-w-0 break-words whitespace-normal text-justify leading-7"
                style={{ color: colors.textMain }}
              >
                {portfolio.description}
              </p>
            ) : (
              <p className="text-xs italic w-full min-w-0" style={{ color: colors.textSecondary }}>
                توضیحاتی برای این نمونه‌کار ثبت نشده است
              </p>
            )}
          </div>

          {/* راهنما */}
          <div
            className="flex items-center gap-2.5 p-3 rounded-xl border"
            style={{ backgroundColor: colors.primary + '08', borderColor: colors.primary + '25' }}
          >
            <span className="text-sm">💡</span>
            <p
              className="text-[11px] flex-1 min-w-0 break-words leading-5"
              style={{ color: colors.textSecondary }}
            >
              برای ویرایش این نمونه‌کار، روی آیکون ویرایش در بالای صفحه ضربه بزنید
            </p>
          </div>
        </div>

        {/* ═══════ فوتر ═══════ */}
        <div className="px-4 py-3 border-t" style={{ borderColor: colors.border }}>
          <div className="flex gap-3">
            <Button
              title="ویرایش"
              onPress={() => {
                onClose();
                setTimeout(() => onEdit?.(portfolio), 300);
              }}
              variant="outline"
              size="lg"
              className="flex-1"
              icon={<FiEdit2 size={16} style={{ color: colors.primary }} />}
              iconPosition="right"
            />
            <Button
              title="حذف"
              onPress={handleDeleteRequest} // ✅ تغییر
              variant="primary"
              size="lg"
              className="flex-1"
              style={{ backgroundColor: '#E53935', borderColor: '#E53935' }}
              icon={<FiTrash2 size={16} color="#fff" />}
              iconPosition="right"
            />
          </div>
        </div>
      </div>
      <ConfirmDialog
        visible={deleteDialogVisible}
        title="حذف نمونه‌کار"
        message={`آیا از حذف "${portfolio.title}" مطمئن هستید؟ این عمل قابل بازگشت نیست.`}
        confirmText="حذف"
        cancelText="انصراف"
        variant="danger"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteDialogVisible(false)}
      />
    </div>
  );
}
