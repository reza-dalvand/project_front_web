// src/components/manageBusiness/lineRental/LineRentalAdCard.jsx
'use client';
import { FiChevronLeft } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import CollabBadge from '@/components/common/CollabBadge';
import Badge from '@/components/common/Badge';

export default function LineRentalAdCard({ ad, onPress }) {
  const { colors } = useTheme();

  const isActive = ad.isActive !== false;

  return (
    <button
      onClick={() => onPress?.(ad)}
      className="w-full flex items-center gap-3 p-3.5 rounded-2xl border mb-2.5
        transition-all hover:scale-[1.01] active:scale-[0.99] text-right"
      style={{
        backgroundColor: colors.cardBackground,
        borderColor: colors.border,
      }}
    >
      {/* ✅ آیکون به جای تصویر (هم‌سبک کارت مدل) */}
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: '#667eea15' }}
      >
        <span className="text-xl">🏢</span>
      </div>

      {/* محتوا */}
      <div className="flex-1 min-w-0 gap-1.5">
        <h4 className="text-sm font-[Vazir-Bold] line-clamp-1" style={{ color: colors.textMain }}>
          {ad.title}
        </h4>
        <div className="flex items-center gap-2">
          <CollabBadge type={ad.collabType} priceDisplay={ad.priceDisplay} variant="compact" />
          <div className="flex-1" />
          <Badge
            label={isActive ? 'فعال' : 'غیرفعال'}
            variant={isActive ? 'success' : 'error'}
            size="sm"
          />
        </div>
      </div>

      {/* فلش */}
      <FiChevronLeft size={20} style={{ color: colors.textSecondary }} />
    </button>
  );
}
