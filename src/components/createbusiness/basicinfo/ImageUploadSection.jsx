// src/components/createbusiness/basicinfo/ImageUploadSection.jsx
'use client';
import { FiCamera, FiCheckCircle } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import ImageUploader from '@/components/common/ImageUploader';

function RequiredLabel({ children }) {
  const { colors } = useTheme();
  return (
    <label className="block text-sm font-[Vazir-Medium] mb-2" style={{ color: colors.textMain }}>
      {children} <span style={{ color: '#E53935' }}>*</span>
    </label>
  );
}

function FieldError({ message }) {
  if (!message) return null;
  return (
    <div className="flex items-center gap-1.5 mt-1.5">
      <FiAlertCircle size={12} color="#E53935" />
      <span className="text-xs" style={{ color: '#E53935' }}>
        {message}
      </span>
    </div>
  );
}

export default function ImageUploadSection({
  coverUrl,
  ownerPhoto,
  errors,
  onCoverChange,
  onOwnerPhotoChange,
  onCoverTouched,
  onOwnerPhotoTouched,
}) {
  const { colors } = useTheme();

  return (
    <div className="space-y-3">
      {/* هدر بخش */}
      <div className="flex items-center gap-2.5">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: '#E91E6315' }}
        >
          <FiCamera size={18} color="#E91E63" />
        </div>
        <span className="text-sm font-[Vazir-Bold]" style={{ color: colors.textMain }}>
          تصاویر کسب‌وکار
        </span>
      </div>

      {/* تصویر کاور */}
      <div
        className="rounded-2xl border p-4"
        style={{
          backgroundColor: colors.cardBackground,
          borderColor: errors.coverUrl ? '#E5393540' : colors.border,
        }}
      >
        <RequiredLabel>تصویر کاور سالن</RequiredLabel>
        <ImageUploader
          value={coverUrl}
          onChange={(url) => {
            onCoverChange(url);
            onCoverTouched();
          }}
          variant="cover"
          hint="تصویر با کیفیت از محیط سالن (۱۲۰۰×۴۰۰)"
        />
        <FieldError message={errors.coverUrl} />
      </div>

      {/* تصویر صاحب کسب‌وکار */}
      <div
        className="rounded-2xl border p-4"
        style={{
          backgroundColor: colors.cardBackground,
          borderColor: errors.ownerPhoto ? '#E5393540' : colors.border,
        }}
      >
        <RequiredLabel>تصویر صاحب کسب‌وکار</RequiredLabel>
        <div className="flex flex-col items-center gap-3">
          <ImageUploader
            value={ownerPhoto}
            onChange={(url) => {
              onOwnerPhotoChange(url);
              onOwnerPhotoTouched();
            }}
            variant="avatar"
          />
          <div
            className="flex items-start gap-2 p-3 rounded-xl w-full"
            style={{ backgroundColor: colors.primary + '08' }}
          >
            <FiCheckCircle
              size={14}
              style={{ color: colors.primary, flexShrink: 0, marginTop: 2 }}
            />
            <span className="text-xs leading-5" style={{ color: colors.textSecondary }}>
              عکس واقعی مدیر، اعتماد مشتریان را افزایش می‌دهد
            </span>
          </div>
        </div>
        <FieldError message={errors.ownerPhoto} />
      </div>
    </div>
  );
}