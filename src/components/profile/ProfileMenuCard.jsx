'use client';

import { FiChevronLeft } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import { toPersianDigit } from '@/utils/numberUtils';

export default function ProfileMenuCard({ item, onPress, rightElement = null }) {
  const { colors } = useTheme();
  const Icon = item.icon;

  return (
    <button
      onClick={onPress}
      className="flex items-center justify-between p-3.5 rounded-2xl border mb-2.5 w-full text-right
                 transition-all active:scale-[0.98]"
      style={{
        backgroundColor: colors.cardBackground,
        borderColor: colors.border,
      }}
    >
      <div className="flex items-center gap-3 flex-1">
        {/* آیکون */}
        <div
          className="relative w-12 h-12 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: item.color + '20' }}
        >
          {Icon && <Icon size={24} color={item.color} />}
          {item.badge > 0 && (
            <div
              className="absolute -top-1 -right-1 min-w-[20px] h-5 rounded-full
                         flex items-center justify-center px-1.5 border-2"
              style={{
                backgroundColor: '#E53935',
                borderColor: colors.cardBackground,
              }}
            >
              <span className="text-[11px] font-[Vazir-Bold] text-white">
                {item.badge > 9 ? '۹+' : toPersianDigit(item.badge)}
              </span>
            </div>
          )}
        </div>

        {/* متن */}
        <div className="flex flex-col gap-0.5 flex-1">
          <span className="text-[15px] font-[Vazir-Bold]" style={{ color: colors.textMain }}>
            {item.title}
          </span>
          {item.subtitle && (
            <span className="text-xs" style={{ color: colors.textSecondary }}>
              {item.subtitle}
            </span>
          )}
        </div>
      </div>

      {rightElement || <FiChevronLeft size={24} color={colors.textSecondary} />}
    </button>
  );
}
