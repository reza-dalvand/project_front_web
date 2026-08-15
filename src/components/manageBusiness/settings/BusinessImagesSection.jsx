// src/components/manageBusiness/settings/BusinessImagesSection.jsx
'use client';
import { FiCamera } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import Card from '@/components/common/Card';
import ImageUploader from '@/components/common/ImageUploader';
import SectionHeader from '@/components/common/SectionHeader';

export default function BusinessImagesSection({
  coverUrl,
  ownerPhoto,
  onCoverChange,
  onOwnerPhotoChange,
}) {
  const { colors } = useTheme();

  return (
    <div className="space-y-3">
      <SectionHeader icon={<FiCamera size={18} />} iconColor="#E91E63" title="تصاویر کسب‌وکار" />

      {/* کاور */}
      <Card variant="elevated" padding={16} radius={18}>
        <label
          className="block text-sm mb-2 text-right font-[Vazir-Medium]"
          style={{ color: colors.textSecondary }}
        >
          تصویر کاور سالن
        </label>
        <ImageUploader
          value={coverUrl}
          onChange={onCoverChange}
          variant="cover"
          hint="تصویر با کیفیت از محیط سالن (۱۲۰۰×۴۰۰)"
        />
      </Card>

      {/* عکس صاحب کسب‌وکار */}
      <Card variant="elevated" padding={16} radius={18}>
        <label
          className="block text-sm mb-2 text-right font-[Vazir-Medium]"
          style={{ color: colors.textSecondary }}
        >
          تصویر صاحب کسب‌وکار <span style={{ color: '#E53935' }}>*</span>
        </label>
        <div className="flex flex-col items-center gap-3">
          <ImageUploader value={ownerPhoto} onChange={onOwnerPhotoChange} variant="avatar" />
          <p className="text-xs font-[Vazir] text-center" style={{ color: colors.textSecondary }}>
            عکس واقعی مدیر کسب‌وکار (جهت احراز هویت و اعتماد مشتریان)
          </p>
        </div>
      </Card>
    </div>
  );
}
