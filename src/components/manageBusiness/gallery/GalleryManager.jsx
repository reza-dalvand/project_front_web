// src/components/manageBusiness/gallery/GalleryManager.jsx
'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import {
  FiImage,
  FiTrash2,
  FiPlus,
  FiArrowRight,
  FiArrowLeft,
  FiAlertTriangle,
  FiUpload,
} from 'react-icons/fi';
import { UPLOAD_CONFIG } from '@/api/config';

import { useTheme } from '@/stores/useThemeStore';
import { useBusinessStore } from '@/stores/useBusinessStore';
import { useToast } from '@/hooks/useToast';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { toPersianDigit } from '@/utils/numberUtils';
import { USE_MOCK } from '@/api/config';

const MAX_GALLERY_IMAGES = 3; // بک‌اند: حداکثر ۳ تصویر

export default function GalleryManager() {
  const { colors } = useTheme();
  const { showToast } = useToast();

  // State از store
  const gallery = useBusinessStore((s) => s.gallery);
  const fetchGallery = useBusinessStore((s) => s.fetchGallery);
  const uploadGalleryImageApi = useBusinessStore((s) => s.uploadGalleryImageApi);
  const deleteGalleryImageApi = useBusinessStore((s) => s.deleteGalleryImageApi);
  const reorderGalleryApi = useBusinessStore((s) => s.reorderGalleryApi);

  // State محلی
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const fileInputRef = useRef(null);

  // ═══════ دریافت گالری از API ═══════
  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        if (!USE_MOCK) {
          await fetchGallery();
        }
      } catch (e) {
        console.error('Failed to load gallery:', e);
        showToast('خطا در بارگذاری گالری', 'error');
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [fetchGallery, showToast]);

  // ═══════ آپلود تصویر ═══════
  const handleFileSelect = useCallback(
    async (e) => {
      const file = e.target.files?.[0];
      if (!file) return;

      // بررسی محدودیت تعداد
      if (gallery.length >= MAX_GALLERY_IMAGES) {
        showToast(`حداکثر ${toPersianDigit(MAX_GALLERY_IMAGES)} تصویر مجاز است`, 'warning');
        return;
      }

      // بررسی نوع فایل
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        showToast('فرمت فایل مجاز نیست (JPEG, PNG, WebP)', 'error');
        return;
      }

      // بررسی حجم فایل (حداکثر ۵ مگابایت)
      const maxBytes = UPLOAD_CONFIG.MAX_FILE_SIZE_MB * 1024 * 1024;
      if (file.size > maxBytes) {
        showToast(
          `حجم تصویر نباید بیشتر از ${toPersianDigit(UPLOAD_CONFIG.MAX_FILE_SIZE_MB)} مگابایت باشد`,
          'error'
        );
        return;
      }

      setIsUploading(true);
      try {
        if (!USE_MOCK) {
          await uploadGalleryImageApi(file, gallery.length);
        } else {
          // حالت Mock — شبیه‌سازی آپلود
          await new Promise((r) => setTimeout(r, 1200));
        }
        showToast('تصویر با موفقیت به گالری اضافه شد', 'success');
      } catch (error) {
        showToast(error.message || 'خطا در آپلود تصویر', 'error');
      } finally {
        setIsUploading(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    },
    [gallery.length, uploadGalleryImageApi, showToast]
  );

  // ═══════ حذف تصویر ═══════
  const handleDeleteRequest = useCallback((img) => {
    setDeleteTarget(img);
    setDeleteDialogVisible(true);
  }, []);

  const handleDeleteConfirm = useCallback(async () => {
    if (!deleteTarget) return;

    try {
      if (!USE_MOCK) {
        await deleteGalleryImageApi(deleteTarget.id);
      } else {
        await new Promise((r) => setTimeout(r, 600));
      }
      showToast('تصویر از گالری حذف شد', 'success');
    } catch (error) {
      showToast(error.message || 'خطا در حذف تصویر', 'error');
    }
    setDeleteDialogVisible(false);
    setDeleteTarget(null);
  }, [deleteTarget, deleteGalleryImageApi, showToast]);

  const handleDeleteCancel = useCallback(() => {
    setDeleteDialogVisible(false);
    setDeleteTarget(null);
  }, []);

  // ═══════ جابجایی ترتیب ═══════
  const moveImage = useCallback(
    async (index, direction) => {
      const newOrder = [...gallery];
      const targetIndex = index + direction;
      if (targetIndex < 0 || targetIndex >= newOrder.length) return;

      [newOrder[index], newOrder[targetIndex]] = [newOrder[targetIndex], newOrder[index]];
      const ids = newOrder.map((img) => img.id);

      try {
        if (!USE_MOCK) {
          await reorderGalleryApi(ids);
        }
      } catch (e) {
        console.error('Failed to reorder:', e);
      }
    },
    [gallery, reorderGalleryApi]
  );

  // ═══════ رندر ═══════
  return (
    <div className="space-y-5">
      {/* هدر */}
      <div className="flex items-center gap-3">
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center"
          style={{ backgroundColor: colors.primary + '15' }}
        >
          <FiImage size={24} style={{ color: colors.primary }} />
        </div>
        <div className="flex-1">
          <h3 className="text-base font-[Vazir-Bold]" style={{ color: colors.textMain }}>
            گالری تصاویر
          </h3>
          <p className="text-xs" style={{ color: colors.textSecondary }}>
            حداکثر {toPersianDigit(MAX_GALLERY_IMAGES)} تصویر • {toPersianDigit(gallery.length)}{' '}
            تصویر ثبت شده
          </p>
        </div>
      </div>

      {/* هشدار محدودیت */}
      {gallery.length >= MAX_GALLERY_IMAGES && (
        <div
          className="flex items-start gap-2.5 p-3.5 rounded-xl border"
          style={{ backgroundColor: '#FF980008', borderColor: '#FF980030' }}
        >
          <FiAlertTriangle size={16} color="#FF9800" className="flex-shrink-0 mt-0.5" />
          <p className="text-xs font-[Vazir] leading-5" style={{ color: colors.textSecondary }}>
            به حداکثر {toPersianDigit(MAX_GALLERY_IMAGES)} تصویر رسیده‌اید. برای افزودن تصویر جدید،
            ابتدا یک تصویر را حذف کنید.
          </p>
        </div>
      )}

      {/* ═══════ لیست تصاویر ═══════ */}
      {isLoading ? (
        <div className="flex justify-center py-8">
          <LoadingSpinner label="در حال بارگذاری گالری..." />
        </div>
      ) : gallery.length > 0 ? (
        <div className="space-y-3">
          {gallery.map((img, index) => (
            <Card key={img.id} variant="elevated" padding={12} radius={16}>
              <div className="flex items-center gap-3">
                {/* تصویر */}
                <div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                  <Image
                    src={img.image_url || img.image}
                    alt={`تصویر ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </div>

                {/* اطلاعات */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-[Vazir-Bold]" style={{ color: colors.textMain }}>
                    تصویر {toPersianDigit(index + 1)}
                  </p>
                  {index === 0 && (
                    <span
                      className="text-[10px] font-[Vazir-Bold] px-2 py-0.5 rounded-md mt-1 inline-block"
                      style={{ backgroundColor: '#4CAF5015', color: '#4CAF50' }}
                    >
                      تصویر اصلی
                    </span>
                  )}
                </div>

                {/* دکمه‌های ترتیب */}
                <div className="flex flex-col gap-1">
                  <button
                    onClick={() => moveImage(index, -1)}
                    disabled={index === 0}
                    className="w-8 h-8 rounded-lg flex items-center justify-center disabled:opacity-30 transition-opacity"
                    style={{ backgroundColor: colors.background }}
                  >
                    <FiArrowRight size={14} style={{ color: colors.textMain }} />
                  </button>
                  <button
                    onClick={() => moveImage(index, 1)}
                    disabled={index === gallery.length - 1}
                    className="w-8 h-8 rounded-lg flex items-center justify-center disabled:opacity-30 transition-opacity"
                    style={{ backgroundColor: colors.background }}
                  >
                    <FiArrowLeft size={14} style={{ color: colors.textMain }} />
                  </button>
                </div>

                {/* دکمه حذف */}
                <button
                  onClick={() => handleDeleteRequest(img)}
                  className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform hover:scale-105 active:scale-95"
                  style={{ backgroundColor: '#E5393515' }}
                >
                  <FiTrash2 size={16} color="#E53935" />
                </button>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        /* حالت خالی */
        <div className="flex flex-col items-center py-12 gap-4">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center"
            style={{ backgroundColor: colors.primary + '10' }}
          >
            <FiImage size={40} style={{ color: colors.textSecondary + '60' }} />
          </div>
          <p className="text-sm font-[Vazir-Bold]" style={{ color: colors.textMain }}>
            هنوز تصویری در گالری نیست
          </p>
          <p className="text-xs text-center" style={{ color: colors.textSecondary }}>
            تصاویر با کیفیت از محیط سالن و نمونه‌کارها اضافه کنید
          </p>
        </div>
      )}

      {/* ═══════ دکمه آپلود ═══════ */}
      {gallery.length < MAX_GALLERY_IMAGES && (
        <>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={handleFileSelect}
          />
          <Button
            title={isUploading ? 'در حال آپلود...' : 'افزودن تصویر جدید'}
            onPress={() => fileInputRef.current?.click()}
            loading={isUploading}
            disabled={isUploading}
            variant="primary"
            size="lg"
            fullWidth
            icon={<FiPlus size={18} color="#fff" />}
            iconPosition="right"
          />
        </>
      )}

      {/* ═══════ ConfirmDialog حذف ═══════ */}
      <ConfirmDialog
        visible={deleteDialogVisible}
        title="حذف تصویر گالری"
        message="آیا از حذف این تصویر مطمئن هستید؟ این عمل قابل بازگشت نیست."
        confirmText="حذف"
        cancelText="انصراف"
        variant="danger"
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </div>
  );
}
