// src/components/profile/edit/ProfileFormSection.jsx
'use client';
import { FiUser, FiTag } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import Card from '@/components/common/Card';
import Input from '@/components/common/Input';

export default function ProfileFormSection({
  firstName,
  lastName,
  errors,
  onFirstNameChange,
  onLastNameChange,
}) {
  const { colors } = useTheme();

  return (
    <Card variant="elevated" padding={20} radius={18}>
      <div className="flex items-center gap-2 mb-5">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: colors.primary + '15' }}
        >
          <FiUser size={16} style={{ color: colors.primary }} />
        </div>
        <span className="text-sm font-[Vazir-Bold]" style={{ color: colors.textMain }}>
          اطلاعات شخصی
        </span>
      </div>
      <Input
        label="نام *"
        placeholder="مثال: مریم"
        value={firstName}
        onChangeText={onFirstNameChange}
        error={errors.firstName}
        rightIcon={<FiUser size={18} style={{ color: colors.textSecondary }} />}
      />
      <Input
        label="نام خانوادگی *"
        placeholder="مثال: حسینی"
        value={lastName}
        onChangeText={onLastNameChange}
        error={errors.lastName}
        rightIcon={<FiTag size={18} style={{ color: colors.textSecondary }} />}
      />
    </Card>
  );
}