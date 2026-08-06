'use client';
import Image from 'next/image';
import { FiUser, FiCheck } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';

/**
 * کارت عضو تیم برای انتخاب کارمند
 *
 * @param {object} member - داده عضو تیم
 * @param {boolean} isSelected - آیا انتخاب شده
 * @param {function} onPress - تابع کلیک
 */
export default function TeamMemberCard({ member, isSelected = false, onPress }) {
  const { colors } = useTheme();

  return (
    <button
      onClick={onPress}
      className="flex flex-col items-center p-3 rounded-xl w-[100px]
        border transition-all duration-200 hover:scale-105 active:scale-95
        relative"
      style={{
        backgroundColor: colors.cardBackground,
        borderColor: isSelected ? colors.primary : colors.border,
        borderWidth: isSelected ? 2 : 1,
      }}
    >
      {/* Badge انتخاب */}
      {isSelected && (
        <div
          className="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center"
          style={{ backgroundColor: colors.primary }}
        >
          <FiCheck size={12} color="#fff" />
        </div>
      )}

      {/* آواتار */}
      {member.avatar ? (
        <Image
          src={member.avatar}
          alt={member.name}
          width={60}
          height={60}
          className="rounded-full mb-2"
        />
      ) : (
        <div
          className="w-[60px] h-[60px] rounded-full flex items-center justify-center mb-2"
          style={{ backgroundColor: colors.border }}
        >
          <FiUser size={28} style={{ color: colors.textSecondary }} />
        </div>
      )}

      <span
        className="text-[13px] font-[Vazir-Medium] text-center line-clamp-1"
        style={{ color: colors.textMain }}
      >
        {member.name}
      </span>
      <span
        className="text-xs font-[Vazir] text-center mt-0.5 line-clamp-1"
        style={{ color: colors.textSecondary }}
      >
        {member.role}
      </span>
    </button>
  );
}
