'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import Image from 'next/image';
import { FiCamera, FiEdit, FiX, FiUpload } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';

/**
 * کامپوننت آپلود تصویر
 * @param {string} value - URL تصویر فعلی
 * @param {function} onChange - تابع تغییر (URL جدید)
 * @param {'cover'|'avatar'|'square'} variant - نوع نمایش
 * @param {string} label - برچسب
 * @param {string} hint - راهنما
 * @param {boolean} required - الزامی بودن
 * @param {string} error - پیام خطا
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
  const [preview, setPreview] = useState(value || null);

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;

    // ایجاد URL موقت برای پیش‌نمایش
    const previewUrl = URL.createObjectURL(file);
    setPreview(previewUrl);

    // در production واقعی: آپلود به سرور و دریافت URL
    // برای demo: استفاده از URL موقت
    onChange?.(previewUrl);
  }, [onChange]);

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
    setPreview(null);
    onChange?.(null);
  };

  // ابعاد بر اساس variant
  const dimensions = {
    cover: { width: '100%', height: '200px', ratio: '2/1' },
    avatar: { width: '120px', height: '120px', ratio: '1/1' },
    square: { width: '100%', height: '250px', ratio: '1/1' },
  };

  const { width, height } = dimensions[variant] || dimensions.cover;

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
          transition-all duration-200 group
          ${isDragActive ? 'scale-[1.02]' : 'hover:scale-[1.01]'}
          ${variant === 'avatar' ? 'mx-auto' : ''}
        `}
        style={{
          width,
          height,
          aspectRatio: dimensions[variant].ratio,
          borderColor: error
            ? '#E53935'
            : preview
            ? colors.primary
            : isDragActive
            ? colors.primary
            : colors.border,
          borderStyle: preview ? 'solid' : 'dashed',
          backgroundColor: colors.cardBackground,
        }}
      >
        <input {...getInputProps()} />

        {preview ? (
          <>
            <Image
              src={preview}
              alt="preview"
              fill
              className="object-cover"
              sizes={variant === 'avatar' ? '120px' : '600px'}
              unoptimized={preview.startsWith('blob:')}
            />
            
            {/* Overlay با دکمه تغییر */}
            <div
              className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100
                         transition-opacity duration-200 flex items-center justify-center"
            >
              <div
                className="flex items-center gap-2 px-4 py-2 rounded-xl"
                style={{ backgroundColor: colors.primary }}
              >
                <FiEdit size={14} color="#fff" />
                <span className="text-xs font-[Vazir-Bold] text-white">
                  تغییر تصویر
                </span>
              </div>
            </div>

            {/* دکمه حذف */}
            <button
              onClick={handleRemove}
              className="absolute top-3 left-3 w-9 h-9 rounded-full flex items-center
                         justify-center shadow-lg transition-transform hover:scale-110"
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
              <p
                className="text-sm font-[Vazir-Bold] mb-1"
                style={{ color: colors.textMain }}
              >
                {isDragActive ? 'تصویر را رها کنید' : 'آپلود تصویر'}
              </p>
              {hint && (
                <p
                  className="text-xs font-[Vazir]"
                  style={{ color: colors.textSecondary }}
                >
                  {hint}
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* پیام خطا */}
      {error && (
        <p
          className="text-xs mt-2 text-right font-[Vazir]"
          style={{ color: '#E53935' }}
        >
          {error}
        </p>
      )}
    </div>
  );
}