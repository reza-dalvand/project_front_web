// src/components/profile/edit/ProfileFormSection.jsx
'use client';
import { FiUser, FiTag, FiAlertCircle } from 'react-icons/fi';
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
    <Card
      variant="elevated"
      padding={0}
      radius={22}
      className="relative overflow-hidden"
    >
      <div
        className="absolute inset-x-0 top-0 h-1"
        style={{
          background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
        }}
        aria-hidden="true"
      />

      <div className="p-5">
        <div className="flex items-start gap-3 mb-5">
          <div
            className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: colors.primary + '18' }}
          >
            <FiUser size={18} style={{ color: colors.primary }} />
          </div>

          <div className="flex-1 min-w-0">
            <span
              className="block text-sm font-[Vazir-Bold]"
              style={{ color: colors.textMain }}
            >
              اطلاعات شخصی
            </span>
            <span
              className="block text-[11px] font-[Vazir] mt-0.5"
              style={{ color: colors.textSecondary }}
            >
              نام و نام خانوادگی خود را دقیق وارد کنید
            </span>
          </div>
        </div>

        <div
          className="flex items-start gap-2.5 p-3.5 rounded-2xl border mb-5"
          style={{
            backgroundColor: '#FF980012',
            borderColor: '#FF980030',
          }}
        >
          <FiAlertCircle
            size={17}
            color="#FF9800"
            className="flex-shrink-0 mt-0.5"
          />
          <p
            className="text-[12px] font-[Vazir] leading-5"
            style={{ color: colors.textMain }}
          >
            جهت جلوگیری از مشکلات مالی، مشخصات خود را بصورت صحیح و کامل وارد نمایید.
          </p>
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
      </div>
    </Card>
  );
}