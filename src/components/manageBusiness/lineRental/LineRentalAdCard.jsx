'use client';

import { FiChevronLeft } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import CollabBadge from '@/components/common/CollabBadge';
import { getLineRentalPriceDisplay } from '@/utils/numberUtils';


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

export default function LineRentalAdCard({ ad, onPress }) {
  const { colors } = useTheme();

  const isActive = ad.isActive !== false;
  const emoji = getLineEmoji(ad.serviceTypeName || ad.title || '');
  const collabType = ad.collab_type || ad.collabType;
  const priceDisplay = getLineRentalPriceDisplay(ad);

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

      <div className="min-w-0 flex-1 space-y-1.5">
        <h4
          className="line-clamp-1 text-sm font-[Vazir-Bold]"
          style={{ color: colors.textMain }}
        >
          {ad.title}
        </h4>

        <div className="flex flex-wrap items-center gap-2">
          <CollabBadge
            type={collabType}
            priceDisplay={priceDisplay}
            variant="compact"
          />

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