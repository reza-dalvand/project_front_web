// src/components/manageBusiness/lineRental/PercentPriceFields.jsx
'use client';
import { useTheme } from '@/stores/useThemeStore';
import Card from '@/components/common/Card';
import Input from '@/components/common/Input';
import { toPersianDigit, parseNumber } from '@/utils/numberUtils';

export default function PercentPriceFields({
  percentSalon,
  percentPartner,
  onPercentSalonChange,
  onPercentPartnerChange,
}) {
  const { colors } = useTheme();
  const total = parseNumber(percentSalon) + parseNumber(percentPartner);

  return (
    <Card variant="default" padding={14} radius={14}>
      <p className="text-xs mb-3" style={{ color: colors.textSecondary }}>
        درصد سالن و همکار را وارد کنید (مجموع باید ۱۰۰٪ باشد)
      </p>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label
            className="text-xs mb-1.5 block font-[Vazir-Medium]"
            style={{ color: colors.primary }}
          >
            سهم سالن (٪)
          </label>
          <div className="mb-0 [&>div]:mb-0">
            <Input
              placeholder="۴۰"
              value={percentSalon}
              onChangeText={onPercentSalonChange}
              type="tel"
              maxLength={3}
            />
          </div>
        </div>
        <div>
          <label
            className="text-xs mb-1.5 block font-[Vazir-Medium]"
            style={{ color: '#9C27B0' }}
          >
            سهم همکار (٪)
          </label>
          <div className="mb-0 [&>div]:mb-0">
            <Input
              placeholder="۶۰"
              value={percentPartner}
              onChangeText={onPercentPartnerChange}
              type="tel"
              maxLength={3}
            />
          </div>
        </div>
      </div>
      {/* نمایش مجموع */}
      {parseNumber(percentSalon) > 0 && (
        <div
          className="flex items-center gap-2 mt-3 p-2.5 rounded-lg border"
          style={{
            backgroundColor: total === 100 ? '#4CAF5010' : '#FF980010',
            borderColor: total === 100 ? '#4CAF5040' : '#FF980040',
          }}
        >
          <span
            className="text-xs font-[Vazir-Bold]"
            style={{
              color: total === 100 ? '#4CAF50' : '#FF9800',
            }}
          >
            {total === 100
              ? '✓ مجموع: ۱۰۰٪'
              : `مجموع: ${toPersianDigit(total)}٪`}
          </span>
        </div>
      )}
    </Card>
  );
}