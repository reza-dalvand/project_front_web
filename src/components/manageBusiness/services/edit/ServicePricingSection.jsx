// src/components/manageBusiness/services/edit/ServicePricingSection.jsx
'use client';
import { FiDollarSign } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import Card from '@/components/common/Card';
import Input from '@/components/common/Input';
import SectionHeader from '@/components/common/SectionHeader';
import { toPersianDigit, formatPriceInput } from '@/utils/numberUtils';

export default function ServicePricingSection({
  originalPrice,
  discountPercent,
  finalPrice,
  errors,
  onOriginalPriceChange,
  onDiscountChange,
}) {
  const { colors } = useTheme();

  return (
    <div className="space-y-3">
      <SectionHeader icon={<FiDollarSign size={18} />} iconColor="#43A047" title="قیمت‌گذاری" />
      <Card variant="elevated" padding={16} radius={18}>
        <Input
          label="قیمت اصلی (تومان) *"
          placeholder="مثال: ۷۵۰,۰۰۰"
          value={originalPrice}
          onChangeText={onOriginalPriceChange}
          error={errors.originalPrice}
        />
        <Input
          label="درصد تخفیف (اختیاری)"
          placeholder="مثال: ۲۰"
          value={discountPercent}
          onChangeText={onDiscountChange}
          error={errors.discountPercent}
        />
        {/* پیش‌نمایش قیمت */}
        {parseInt(originalPrice.replace(/[^0-9]/g, '') || '0') > 0 && (
          <div
            className="mt-3 p-3 rounded-xl border"
            style={{ backgroundColor: colors.background, borderColor: colors.border }}
          >
            <div className="flex justify-between mb-1">
              <span className="text-xs" style={{ color: colors.textSecondary }}>
                قیمت نهایی:
              </span>
              <span className="text-sm font-[Vazir-Bold]" style={{ color: colors.primary }}>
                {toPersianDigit(finalPrice.toLocaleString())} تومان
              </span>
            </div>
            {parseInt(discountPercent.replace(/[^0-9]/g, '') || '0') > 0 && (
              <div className="flex justify-between">
                <span className="text-xs" style={{ color: colors.textSecondary }}>
                  مبلغ تخفیف:
                </span>
                <span className="text-xs" style={{ color: '#4CAF50' }}>
                  -{' '}
                  {toPersianDigit(
                    Math.round(
                      (parseInt(originalPrice.replace(/[^0-9]/g, '') || '0') *
                        parseInt(discountPercent.replace(/[^0-9]/g, '') || '0')) /
                        100
                    ).toLocaleString()
                  )}{' '}
                  تومان
                </span>
              </div>
            )}
          </div>
        )}
      </Card>
    </div>
  );
}
