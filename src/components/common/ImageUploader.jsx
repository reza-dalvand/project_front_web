// src/components/common/ImageUploader.jsx
'use client';
import { useCallback, useState, useEffect, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { FiCamera, FiEdit, FiX, FiUpload } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import { UPLOAD_CONFIG } from '@/api/config';
import { compressImage } from '@/utils/image-compression';
import { revokePreviewUrl } from '@/utils/image-utils'; // ✅ Import تابع کمکی
import Image from 'next/image';

export default function ImageUploader({
  value,
  onChange,
  variant = 'cover',
  label,
  hint,
  required = false,
  error,
}) {
  const { colors } = useTheme();
  const [localPreview, setLocalPreview] = useState(value || null);
  const [isCompressing, setIsCompressing] = useState(false);
  const [validationError, setValidationError] = useState(null);

  const objectUrlRef = useRef(null);

  // ✅ FIX 1: همگام‌سازی با تغییرات پراپ value از بیرون (مثلاً ریست شدن فرم)
  useEffect(() => {
    if (value !== localPreview) {
      // اگر preview قبلی یک blob URL ساخته شده توسط این کامپوننت بود، آن را آزاد کن
      if (objectUrlRef.current) {
        revokePreviewUrl(objectUrlRef.current);
        objectUrlRef.current = null;
      }
      
      // اگر value جدید یک فایل بود، برایش blob URL بساز
      if (value instanceof File) {
        const url = URL.createObjectURL(value);
        objectUrlRef.current = url;
        setLocalPreview(url);
      } else {
        setLocalPreview(value || null);
      }
    }
  }, [value]);

  // ✅ FIX 2: پاک‌سازی حافظه هنگام Unmount شدن کامپوننت
  useEffect(() => {
    return () => {
      if (objectUrlRef.current) {
        revokePreviewUrl(objectUrlRef.current);
        objectUrlRef.current = null;
      }
    };
  }, []);

  const onDrop = useCallback(
    async (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (!file) return;

      setValidationError(null);
      setIsCompressing(true);
      
      try {
        const compressed = await compressImage(file, variant);

        // آزاد کردن blob URL قبلی قبل از ساخت جدید
        if (objectUrlRef.current) {
          revokePreviewUrl(objectUrlRef.current);
          objectUrlRef.current = null;
        }

        const previewUrl = URL.createObjectURL(compressed);
        objectUrlRef.current = previewUrl;
        setLocalPreview(previewUrl);
        onChange?.(compressed);
      } catch (err) {
        console.error('Image compression failed:', err);
        setValidationError(err.message || 'خطا در پردازش تصویر');
      } finally {
        setIsCompressing(false);
      }
    },
    [onChange, variant]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpeg', '.jpg', '.png', '.webp'] },
    maxFiles: 1,
    maxSize: UPLOAD_CONFIG.MAX_INPUT_SIZE_MB * 1024 * 1024,
    onDropRejected: (fileRejections) => {
      const rejection = fileRejections[0];
      if (rejection?.errors?.[0]?.code === 'file-too-large') {
        setValidationError(
          `حجم فایل نباید بیشتر از ${UPLOAD_CONFIG.MAX_INPUT_SIZE_MB} مگابایت باشد`
        );
      } else if (rejection?.errors?.[0]?.code === 'file-invalid-type') {
        setValidationError('فرمت فایل معتبر نیست. فقط JPEG، PNG و WebP مجاز است.');
      } else {
        setValidationError('خطا در انتخاب فایل');
      }
    },
  });

  const handleRemove = (e) => {
    e.stopPropagation();
    if (objectUrlRef.current) {
      revokePreviewUrl(objectUrlRef.current);
      objectUrlRef.current = null;
    }
    setLocalPreview(null);
    setValidationError(null);
    onChange?.(null);
  };

  const dimensions = {
    cover: { width: '100%', height: '200px' },
    avatar: { width: '120px', height: '120px' },
    square: { width: '100%', height: '250px' },
  };
  const styleDim = dimensions[variant] || dimensions.cover;

  const displayError = error || validationError;

  return (
    <div className="w-full">
      {label && (
        <label
          className="block text-sm mb-2 text-right font-[Vazir-Medium]"
          style={{ color: colors.textSecondary }}
        >
          {label}
          {required && <span style={{ color: '#E53935' }}> *</span>}
        </label>
      )}
      <div
        {...getRootProps()}
        className={`relative overflow-hidden rounded-2xl border-2 cursor-pointer transition-all duration-200 group flex items-center justify-center
        ${isDragActive ? 'scale-[1.02]' : 'hover:scale-[1.01]'}
        ${variant === 'avatar' ? 'mx-auto' : ''}`}
        style={{
          width: styleDim.width,
          height: styleDim.height,
          borderColor: displayError
            ? '#E53935'
            : localPreview
              ? colors.primary
              : isDragActive
                ? colors.primary
                : colors.border,
          borderStyle: localPreview ? 'solid' : 'dashed',
          backgroundColor: colors.cardBackground,
        }}
      >
        <input {...getInputProps()} />
        {localPreview ? (
          <>
            <Image
              src={localPreview}
              alt="preview"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center z-10">
              <div
                className="flex items-center gap-2 px-4 py-2 rounded-xl"
                style={{ backgroundColor: colors.primary }}
              >
                <FiEdit size={14} color="#fff" />
                <span className="text-xs font-[Vazir-Bold] text-white">تغییر تصویر</span>
              </div>
            </div>
            <button
              onClick={handleRemove}
              className="absolute top-3 left-3 w-9 h-9 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-110 z-20"
              style={{ backgroundColor: '#E53935' }}
            >
              <FiX size={16} color="#fff" />
            </button>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full gap-3 p-6">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center"
              style={{ backgroundColor: colors.primary + '20' }}
            >
              {isCompressing ? (
                <div
                  className="w-7 h-7 border-2 border-current border-t-transparent rounded-full animate-spin"
                  style={{ color: colors.primary }}
                />
              ) : isDragActive ? (
                <FiUpload size={28} style={{ color: colors.primary }} />
              ) : (
                <FiCamera size={28} style={{ color: colors.primary }} />
              )}
            </div>
            <div className="text-center">
              <p className="text-sm font-[Vazir-Bold] mb-1" style={{ color: colors.textMain }}>
                {isCompressing
                  ? 'در حال فشرده‌سازی...'
                  : isDragActive
                    ? 'تصویر را رها کنید'
                    : 'آپلود تصویر'}
              </p>
              {hint && (
                <p className="text-xs font-[Vazir]" style={{ color: colors.textSecondary }}>
                  {hint}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
      {displayError && (
        <p className="text-xs mt-2 text-right font-[Vazir]" style={{ color: '#E53935' }}>
          {displayError}
        </p>
      )}
    </div>
  );
}