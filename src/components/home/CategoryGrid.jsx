'use client';

import { useTheme } from '@/stores/useThemeStore';
import { toPersianDigit } from '@/utils/numberUtils';

const ICON_MAP = {
  face: '💄',
  brush: '💅',
  'flash-on': '⚡',
  spa: '🧖‍♀️',
  palette: '🎨',
  'auto-awesome': '✨',
  visibility: '👁️',
  'self-improvement': '💆‍♀️',
};

export default function CategoryGrid({ categories = [], onSelect, selectedId }) {
  const { colors } = useTheme();

  return (
    <div className="grid grid-cols-4 gap-3 px-3">
      {categories.map((item) => {
        const isSelected = item.id === selectedId;
        const hasCount = item.count && item.count > 0;
        const emoji = ICON_MAP[item.icon] || '💆‍♀️';

        return (
          <div key={item.id} className="flex flex-col items-center relative">
            <button
              onClick={() => onSelect?.(item)}
              className="w-full aspect-square rounded-2xl border-2 flex flex-col items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95"
              style={{
                backgroundColor: isSelected ? colors.primary : colors.cardBackground,
                borderColor: isSelected ? colors.primary : colors.border,
              }}
            >
              <span className="text-3xl">{emoji}</span>
              <span
                className="text-[11px] font-[Vazir-Medium] text-center line-clamp-1 px-1"
                style={{ color: isSelected ? '#fff' : colors.textMain }}
              >
                {item.name}
              </span>
            </button>

            {hasCount && (
              <div
                className="absolute -top-2 -left-2 min-w-[22px] h-[22px] rounded-full flex items-center justify-center px-1.5 border-2"
                style={{
                  backgroundColor: '#E53935',
                  borderColor: colors.background,
                }}
              >
                <span className="text-[10px] font-[Vazir-Bold] text-white">
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
