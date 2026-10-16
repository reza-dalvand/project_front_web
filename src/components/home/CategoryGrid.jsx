// src/components/home/CategoryGrid.jsx
'use client';
import { useTheme } from '@/stores/useThemeStore';
import { toPersianDigit } from '@/utils/numberUtils';
import { getServiceTypeConfig } from '@/constants/serviceTypes';

export default function CategoryGrid({ categories = [], onSelect, selectedId }) {
  const { colors } = useTheme();

  if (!categories || categories.length === 0) return null;

  return (
    <div className="responsive-grid-3-4-5 px-1 sm:px-2">
      {categories.map((item) => {
        const isSelected = item.id === selectedId;
        const count = Number(item.count || 0);
        const hasCount = count > 0;

        const iconKey = (item.icon || 'default').toLowerCase().replace(/\s+/g, '_');
        const config = getServiceTypeConfig(iconKey);
        const IconComponent = config.icon;
        const iconColor = config.color || colors.primary;
        const gradientStart = item.gradientStart || iconColor;
        const gradientEnd = item.gradientEnd || `${iconColor}CC`;

        return (
          <div
            key={item.id}
            className="flex flex-col items-center relative group"
          >
            <button
              type="button"
              onClick={() => onSelect?.(item)}
              aria-pressed={isSelected}
              className="
                w-full aspect-square rounded-[22px] sm:rounded-[26px]
                border-2 overflow-hidden
                flex flex-col items-center justify-center gap-2
                transition-all duration-300 ease-out
                hover:-translate-y-1 active:scale-[0.96]
                focus:outline-none
              "
              style={{
                background: isSelected
                  ? `linear-gradient(135deg, ${gradientStart}, ${gradientEnd})`
                  : colors.cardBackground,
                borderColor: isSelected ? 'transparent' : colors.border,
                boxShadow: isSelected
                  ? `0 18px 34px ${iconColor}35`
                  : `0 10px 24px ${colors.border}45`,
              }}
            >
              {/* نور ملایم پس‌زمینه */}
              <div
                className="pointer-events-none absolute inset-0"
                style={{
                  background: isSelected
                    ? `
                      radial-gradient(circle at 22% 20%, rgba(255,255,255,0.32), transparent 38%),
                      radial-gradient(circle at 78% 78%, rgba(255,255,255,0.18), transparent 34%)
                    `
                    : `
                      radial-gradient(circle at 25% 20%, ${iconColor}14, transparent 42%),
                      radial-gradient(circle at 78% 75%, ${iconColor}0D, transparent 38%)
                    `,
                }}
              />

              {/* آیکون */}
              <div
                className="
                  relative z-10
                  w-11 h-11 sm:w-12 sm:h-12 lg:w-14 lg:h-14
                  rounded-2xl flex items-center justify-center
                  transition-all duration-300 group-hover:scale-110
                "
                style={{
                  backgroundColor: isSelected
                    ? 'rgba(255,255,255,0.22)'
                    : `${iconColor}18`,
                  boxShadow: isSelected
                    ? 'inset 0 1px 1px rgba(255,255,255,0.25)'
                    : 'none',
                }}
              >
                <IconComponent
                  size={20}
                  className="sm:w-6 sm:h-6 lg:w-7 lg:h-7"
                  style={{
                    color: isSelected ? '#fff' : iconColor,
                  }}
                />
              </div>

              {/* نام دسته */}
              <span
                className="
                  relative z-10
                  text-[10px] sm:text-[11px] lg:text-xs
                  font-[Vazir-Bold]
                  text-center line-clamp-2 leading-4
                  px-1 w-full
                "
                style={{
                  color: isSelected ? '#fff' : colors.textMain,
                  textShadow: isSelected
                    ? '0 1px 8px rgba(0,0,0,0.12)'
                    : 'none',
                }}
              >
                {item.name}
              </span>
            </button>

            {/* بج تعداد */}
            {hasCount && (
              <div
                className="
                  absolute -top-1 -left-1 sm:-top-1.5 sm:-left-1.5 z-20
                  min-w-[20px] sm:min-w-[22px] h-5
                  rounded-full flex items-center justify-center px-1.5
                  border-2
                "
                style={{
                  backgroundColor: '#E53935',
                  borderColor: colors.background,
                  boxShadow: '0 4px 10px rgba(229,57,53,0.25)',
                }}
              >
                <span className="text-[9px] sm:text-[10px] font-[Vazir-Bold] text-white">
                  {toPersianDigit(count > 99 ? '99+' : count)}
                </span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}