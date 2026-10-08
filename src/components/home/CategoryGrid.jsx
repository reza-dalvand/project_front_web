// src/components/home/CategoryGrid.jsx
'use client';
import { useTheme } from '@/stores/useThemeStore';
import { toPersianDigit } from '@/utils/numberUtils';
import { getServiceTypeConfig } from '@/constants/serviceTypes';

export default function CategoryGrid({ categories = [], onSelect, selectedId }) {
  const { colors } = useTheme();

  if (!categories || categories.length === 0) return null;

  return (
    /* ✅ استفاده از کلاس responsive-grid-3-4-5 */
    <div className="responsive-grid-3-4-5 px-1 sm:px-2">
      {categories.map((item) => {
        const isSelected = item.id === selectedId;
        const hasCount = (item.count || 0) > 0;

        const iconKey = (item.icon || 'default').toLowerCase().replace(/\s+/g, '_');
        const config = getServiceTypeConfig(iconKey);
        const IconComponent = config.icon;
        const iconColor = config.color;
        const gradientStart = item.gradientStart || iconColor;
        const gradientEnd = item.gradientEnd || iconColor + 'CC';

        return (
          <div key={item.id} className="flex flex-col items-center relative">
            <button
              onClick={() => onSelect?.(item)}
              className="w-full aspect-square rounded-xl sm:rounded-2xl border-2 flex flex-col items-center justify-center gap-1.5 sm:gap-2 transition-all hover:scale-105 active:scale-95"
              style={{
                backgroundColor: isSelected
                  ? `linear-gradient(135deg, ${gradientStart}, ${gradientEnd})`
                  : colors.cardBackground,
                borderColor: isSelected ? gradientStart : colors.border,
                background: isSelected
                  ? `linear-gradient(135deg, ${gradientStart}, ${gradientEnd})`
                  : colors.cardBackground,
              }}
            >
              {/* آیکون */}
              <div
                className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-lg sm:rounded-xl flex items-center justify-center"
                style={{
                  backgroundColor: isSelected ? 'rgba(255,255,255,0.2)' : `${iconColor}15`,
                }}
              >
                <IconComponent
                  size={16}
                  className="sm:w-5 sm:h-5 lg:w-6 lg:h-6"
                  style={{
                    color: isSelected ? '#fff' : iconColor,
                  }}
                />
              </div>
              {/* نام */}
              <span
                className="text-[10px] sm:text-[11px] lg:text-xs font-[Vazir-Medium] text-center line-clamp-1 px-1 w-full"
                style={{
                  color: isSelected ? '#fff' : colors.textMain,
                }}
              >
                {item.name}
              </span>
            </button>
            {/* Badge تعداد */}
            {hasCount && (
              <div
                className="absolute -top-1.5 -left-1.5 sm:-top-2 sm:-left-2 min-w-[18px] sm:min-w-[20px] h-4 sm:h-5 rounded-full flex items-center justify-center px-1 sm:px-1.5 border-2"
                style={{
                  backgroundColor: '#E53935',
                  borderColor: colors.background,
                }}
              >
                <span className="text-[9px] sm:text-[10px] font-[Vazir-Bold] text-white">
                  {toPersianDigit(item.count > 99 ? '99+' : item.count)}
                </span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}