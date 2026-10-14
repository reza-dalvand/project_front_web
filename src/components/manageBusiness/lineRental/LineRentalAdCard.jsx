'use client';

import { FiChevronLeft } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import { parseNumber, toPersianDigit } from '@/utils/numberUtils';

const getLineEmoji = (typeName = '') => {
  if (typeName.includes('ناخن')) return '💅';
  if (typeName.includes('میکاپ') || typeName.includes('گریم')) return '💄';
  if (typeName.includes('فیشیال') || typeName.includes('پوست')) return '✨';
  if (typeName.includes('لیزر')) return '⚡';
  if (typeName.includes('مو') || typeName.includes('رنگ') || typeName.includes('کراتین'))
    return '🎨';
  if (typeName.includes('مژه') || typeName.includes('ابرو')) return '👁️';
  if (typeName.includes('ماساژ')) return '💆‍♀️';
  return '🏢';
};

const toPositiveNumber = (value) => {
  const parsed = parseNumber(value);
  const num = Number(parsed);

  if (!Number.isFinite(num) || num <= 0) {
    return 0;
  }

  return num;
};

const formatToman = (value) => {
  const num = toPositiveNumber(value);

  if (!num) return '';

  const formatted = new Intl.NumberFormat('en-US').format(num);

  return `${toPersianDigit(formatted)} تومان`;
};

const getPriceItems = (ad) => {
  const collabType = String(ad?.collab_type || ad?.collabType || '').toLowerCase();

  if (collabType === 'fixed') {
    const value = formatToman(ad?.fixed_amount ?? ad?.fixedAmount);

    if (!value) return [];

    return [
      {
        id: 'fixed',
        label: 'ثابت',
        value,
      },
    ];
  }

  if (collabType === 'hourly') {
    const value = formatToman(ad?.hourly_rate ?? ad?.hourlyRate);

    if (!value) return [];

    return [
      {
        id: 'hourly',
        label: 'اجاره',
        value,
      },
    ];
  }

  if (collabType === 'percent') {
    const salon = toPositiveNumber(ad?.percent_salon ?? ad?.percentSalon);
    const partner = toPositiveNumber(ad?.percent_partner ?? ad?.percentPartner);

    if (!salon || !partner) return [];

    return [
      {
        id: 'percent',
        label: 'درصدی',
        value: `${toPersianDigit(salon)}٪ - ${toPersianDigit(partner)}٪`,
      },
    ];
  }

  return [];
};

export default function LineRentalAdCard({ ad, onPress }) {
  const { colors } = useTheme();

  const isActive = ad?.isActive !== false;
  const emoji = getLineEmoji(ad?.serviceTypeName || ad?.title || '');
  const priceItems = getPriceItems(ad);

  return (
    <button
      onClick={() => onPress?.(ad)}
      className="group mb-2.5 flex w-full items-center gap-3 rounded-[22px] border p-3.5 text-right transition-all duration-300 hover:-translate-y-0.5 active:scale-[0.99]"
      style={{
        backgroundColor: colors.cardBackground,
        borderColor: colors.border,
        boxShadow: '0 10px 26px rgba(124,58,237,0.08)',
      }}
    >
      <div
        className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl text-xl shadow-sm"
        style={{
          background: 'linear-gradient(135deg, #C4B5FD 0%, #8B5CF6 50%, #6D28D9 100%)',
        }}
      >
        <span style={{ filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.18))' }}>{emoji}</span>
      </div>

      <div className="min-w-0 flex-1 space-y-2">
        <h4
          className="line-clamp-1 text-sm font-[Vazir-Bold]"
          style={{ color: colors.textMain }}
        >
          {ad?.title}
        </h4>

        {priceItems.length > 0 && (
          <div
            className="flex flex-wrap items-center gap-x-2 gap-y-1 rounded-2xl border px-2.5 py-1.5"
            style={{
              backgroundColor: 'rgba(16,185,129,0.08)',
              borderColor: 'rgba(16,185,129,0.18)',
            }}
          >
            {priceItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-1 text-[11px] leading-5"
              >
                <span style={{ color: colors.textSecondary }}>
                  {item.label}:
                </span>

                <span
                  className="whitespace-nowrap font-[Vazir-Bold]"
                  style={{ color: '#10B981' }}
                >
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        )}

        <div className="flex flex-wrap items-center gap-2">
          <span
            className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-[Vazir-Bold]"
            style={{
              backgroundColor: isActive ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.12)',
              color: isActive ? '#10B981' : '#EF4444',
            }}
          >
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{ backgroundColor: isActive ? '#10B981' : '#EF4444' }}
            />
            {isActive ? 'فعال' : 'غیرفعال'}
          </span>
        </div>
      </div>

      <FiChevronLeft
        size={20}
        className="transition-transform duration-300 group-hover:-translate-x-1"
        style={{ color: colors.textSecondary }}
      />
    </button>
  );
}