// src/components/manageBusiness/services/edit/ServiceDurationSection.jsx
'use client';
import { FiClock, FiTag } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import Card from '@/components/common/Card';
import Input from '@/components/common/Input';
import SectionHeader from '@/components/common/SectionHeader';
import CharCounter from '@/components/common/CharCounter';

const MAX_DESCRIPTION_LENGTH = 300;

export default function ServiceDurationSection({
  duration,
  renewalDays,
  description,
  errors,
  onDurationChange,
  onRenewalDaysChange,
  onDescriptionChange,
}) {
  const { colors } = useTheme();

  return (
    <>
      {/* مدت و یادآوری */}
      <div className="space-y-3">
        <SectionHeader icon={<FiClock size={18} />} iconColor="#2196F3" title="مدت و یادآوری" />
        <Card variant="elevated" padding={16} radius={18}>
          <Input
            label="مدت هر نوبت (دقیقه)"
            placeholder="مثال: ۶۰"
            value={duration}
            onChangeText={onDurationChange}
          />
          <Input
            label="یادآوری تمدید (روز)"
            placeholder="۰ = بدون یادآوری"
            value={renewalDays}
            onChangeText={onRenewalDaysChange}
            error={errors.renewalDays}
            hint="پس از انجام خدمت، بعد از این تعداد روز یادآوری ارسال می‌شود"
          />
        </Card>
      </div>

      {/* توضیحات */}
      <div className="space-y-3">
        <SectionHeader icon={<FiTag size={18} />} iconColor="#9C27B0" title="توضیحات" />
        <Card variant="elevated" padding={16} radius={18}>
          <Input
            label="توضیحات (اختیاری)"
            placeholder="توضیحاتی درباره این خدمت..."
            value={description}
            onChangeText={onDescriptionChange}
            multiline
          />
          <CharCounter current={description.length} max={MAX_DESCRIPTION_LENGTH} />
        </Card>
      </div>
    </>
  );
}