// src/components/lineRentals/detail/LineRentalPriceCard.jsx
'use client';
import Card from '@/components/common/Card';
import { toPersianDigit } from '@/utils/numberUtils';
import { useTheme } from '@/stores/useThemeStore';

export default function LineRentalPriceCard({ collabType, priceInfo }) {
  const { colors } = useTheme();

  const getPriceInfo = () => {
    switch (collabType) {
      case 'percent':
        return {
          label: 'تقسیم درآمد',
          value: `سالن ${toPersianDigit(priceInfo.percentSalon || 0)}٪ - همکار ${toPersianDigit(priceInfo.percentPartner || 0)}٪`,
          color: '#9C27B0',
          icon: '📊',
        };
      case 'fixed':
        return {
          label: priceInfo.fixedDeposit > 0 ? 'اجاره ماهانه + رهن' : 'اجاره ماهانه',
          value:
            priceInfo.fixedDeposit > 0
              ? `${toPersianDigit((priceInfo.fixedAmount || 0).toLocaleString('en-US'))} + ${toPersianDigit((priceInfo.fixedDeposit || 0).toLocaleString('en-US'))} رهن`
              : `${toPersianDigit((priceInfo.fixedAmount || 0).toLocaleString('en-US'))} تومان`,
          color: '#2196F3',
          icon: '💰',
        };
      case 'hourly':
        return {
          label: 'نرخ ساعتی',
          value: `${toPersianDigit((priceInfo.hourlyRate || 0).toLocaleString('en-US'))} تومان / ساعت`,
          color: '#FF9800',
          icon: '⏰',
        };
      default:
        return { label: 'قیمت', value: priceInfo.priceDisplay || '—', color: '#607D8B', icon: '💰' };
    }
  };

  const pi = getPriceInfo();

  return (
    <Card variant="default" padding={14} radius={14} style={{ borderColor: pi.color + '30' }}>
      <div className="flex items-center gap-2 mb-2">
        <span className="text-base">{pi.icon}</span>
        <span className="text-sm font-[Vazir-Bold]" style={{ color: colors.textMain }}>
          شرایط همکاری
        </span>
      </div>
      <div
        className="p-3 rounded-xl border"
        style={{ backgroundColor: pi.color + '08', borderColor: pi.color + '25' }}
      >
        <p className="text-xs mb-1" style={{ color: colors.textSecondary }}>
          {pi.label}
        </p>
        <p className="text-sm font-[Vazir-Bold]" style={{ color: pi.color }}>
          {pi.value}
        </p>
      </div>
    </Card>
  );
}