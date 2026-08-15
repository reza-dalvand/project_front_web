// src/components/common/auth/AuthProfileStep.jsx
'use client';
import { FiCheck } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';

export default function AuthProfileStep({
  firstName,
  lastName,
  onFirstNameChange,
  onLastNameChange,
  error,
  loading,
  onSave,
}) {
  const { colors } = useTheme();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col items-center gap-3 mb-2">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center"
          style={{ backgroundColor: '#4CAF5015' }}
        >
          <FiCheck size={32} color="#4CAF50" />
        </div>
        <p className="text-sm text-center" style={{ color: colors.textSecondary }}>
          ورود موفق! لطفاً نام خود را وارد کنید
        </p>
      </div>
      <Input
        label="نام *"
        placeholder="مثال: مریم"
        value={firstName}
        onChangeText={(t) => {
          onFirstNameChange(t);
        }}
        error={error && !firstName.trim() ? error : ''}
      />
      <Input
        label="نام خانوادگی *"
        placeholder="مثال: حسینی"
        value={lastName}
        onChangeText={(t) => {
          onLastNameChange(t);
        }}
        error={error && !lastName.trim() ? error : ''}
      />
      <div className="pb-6">
        <Button
          title="ذخیره و ادامه"
          onPress={onSave}
          loading={loading}
          disabled={loading}
          variant="primary"
          size="lg"
          fullWidth
        />
      </div>
    </div>
  );
}
