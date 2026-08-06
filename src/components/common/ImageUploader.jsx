// src/components/common/ImageUploader.jsx
'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { FiCamera, FiEdit, FiX, FiUpload } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';

/**
 * کامپوننت آپلود تصویر (اصلاح شده برای پشتیبانی از Blob URL)
 */
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
  // state داخلی برای نگهداری blob url موقت
  const [localPreview, setLocalPreview] = useState(value);

  // همگام‌سازی با prop ورودی (مثلاً وقتی فرم ریست می‌شود)
  useState(() => {
    if (value !== localPreview) {
      setLocalPreview(value);
    }
  }, [value]);

  const onDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (!file) return;

      // ایجاد URL موقت برای پیش‌نمایش آنی
      const previewUrl = URL.createObjectURL(file);
      setLocalPreview(previewUrl);

      // ارسال به والد
      onChange?.(previewUrl);
    },
    [onChange]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp'],
    },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024, // 5MB
  });

  const handleRemove = (e) => {
    e.stopPropagation();
    setLocalPreview(null);
    onChange?.(null);
  };

  // ابعاد بر اساس variant
  const dimensions = {
    cover: { width: '100%', height: '200px' },
    avatar: { width: '120px', height: '120px' },
    square: { width: '100%', height: '250px' },
  };

  const styleDim = dimensions[variant] || dimensions.cover;

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
        className={`
          relative overflow-hidden rounded-2xl border-2 cursor-pointer
          transition-all duration-200 group flex items-center justify-center
          ${isDragActive ? 'scale-[1.02]' : 'hover:scale-[1.01]'}
          ${variant === 'avatar' ? 'mx-auto' : ''}
        `}
        style={{
          width: styleDim.width,
          height: styleDim.height,
          borderColor: error
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
            {/* ✅ FIX: استفاده از تگ img استاندارد برای نمایش Blob URL */}
            <img src={localPreview} alt="preview" className="object-cover w-full h-full" />

            {/* Overlay با دکمه تغییر */}
            <div
              className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100
                transition-opacity duration-200 flex items-center justify-center z-10"
            >
              <div
                className="flex items-center gap-2 px-4 py-2 rounded-xl"
                style={{ backgroundColor: colors.primary }}
              >
                <FiEdit size={14} color="#fff" />
                <span className="text-xs font-[Vazir-Bold] text-white">تغییر تصویر</span>
              </div>
            </div>

            {/* دکمه حذف */}
            <button
              onClick={handleRemove}
              className="absolute top-3 left-3 w-9 h-9 rounded-full flex items-center
                justify-center shadow-lg transition-transform hover:scale-110 z-20"
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
              {isDragActive ? (
                <FiUpload size={28} style={{ color: colors.primary }} />
              ) : (
                <FiCamera size={28} style={{ color: colors.primary }} />
              )}
            </div>
            <div className="text-center">
              <p className="text-sm font-[Vazir-Bold] mb-1" style={{ color: colors.textMain }}>
                {isDragActive ? 'تصویر را رها کنید' : 'آپلود تصویر'}
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

      {/* پیام خطا */}
      {error && (
        <p className="text-xs mt-2 text-right font-[Vazir]" style={{ color: '#E53935' }}>
          {error}
        </p>
      )}
    </div>
  );
}
