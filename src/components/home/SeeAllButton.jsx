'use client';
import { FiChevronLeft } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';

export default function SeeAllButton({ onPress, count }) {
  const { colors } = useTheme();

  return (
    <button
      onClick={onPress}
      className="relative flex items-center gap-1.5 py-[7px] px-3 rounded-[14px] border transition-all hover:opacity-80 active:scale-[0.97]"
      style={{
        backgroundColor: colors.primary + '12',
        borderColor: colors.primary + '35',
      }}
    >
      <span className="text-xs font-[Vazir-Bold]" style={{ color: colors.primary }}>
        مشاهده همه
      </span>
      <span
        className="w-5 h-5 rounded-full flex items-center justify-center"
        style={{ backgroundColor: colors.primary }}
      >
        <FiChevronLeft size={14} color="#fff" />
      </span>
      {count !== undefined && count > 0 && (
        <span
          className="absolute -top-1.5 -left-1.5 min-w-[18px] h-[18px] rounded-full flex items-center justify-center px-1 text-[9px] font-[Vazir-Bold] text-white border-2"
          style={{
            backgroundColor: colors.primary,
            borderColor: colors.background,
          }}
        >
          {count > 99 ? '۹۹+' : count}
        </span>
      )}
    </button>
  );
}