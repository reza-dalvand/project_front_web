// src/components/manageBusiness/services/edit/ServiceDepositSection.jsx
'use client';
import { FiShield } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import Card from '@/components/common/Card';
import Input from '@/components/common/Input';
import SectionHeader from '@/components/common/SectionHeader';
import { toPersianDigit } from '@/utils/numberUtils';
import { MIN_DEPOSIT } from '@/utils/price-utils';

export default function ServiceDepositSection({ depositAmount, errors, onDepositChange }) {
  const { colors } = useTheme();

  return (
    <div className="space-y-3">
      <SectionHeader icon={<FiShield size={18} />} iconColor="#FF9800" title="بیعانه رزرو" />
      <Card variant="elevated" padding={16} radius={18}>
        {/* پیام الزامی بودن */}
        <div
          className="flex items-start gap-2.5 p-3 rounded-xl border mb-4"
          style={{
            backgroundColor: '#FF980008',
            borderColor: '#FF980030',
          }}
        >
          <span className="text-base flex-shrink-0">🔒</span>
          <p
            className="text-xs font-[Vazir] leading-5 flex-1"
            style={{ color: colors.textSecondary }}
          >
            بیعانه برای تمام خدمات{' '}
            <span className="font-[Vazir-Bold]" style={{ color: '#FF9800' }}>
              الزامی
            </span>{' '}
            است. مشتری برای تایید رزرو باید بیعانه را آنلاین پرداخت کند.
          </p>
        </div>
        <Input
          label="مبلغ بیعانه (تومان) *"
          placeholder="مثال: ۲۰۰,۰۰۰"
          value={depositAmount}
          onChangeText={onDepositChange}
          error={errors.depositAmount}
          hint={`حداقل: ${toPersianDigit(MIN_DEPOSIT.toLocaleString())} تومان`}
        />
      </Card>
    </div>
  );
}
