'use client';

import { FiX } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';

export default function Chip({
  label,
  selected = false,
  onPress,
  icon,
  onRemove,
  className = '',
}) {
  const { colors } = useTheme();

  const bgColor = selected ? colors.primary + '22' : colors.cardBackground;
  const borderColor = selected ? colors.primary : colors.border;
  const textColor = selected ? colors.primary : colors.textSecondary;

  const content = (
    <div
      className={`
        flex items-center gap-1.5 border-[1.5px] rounded-[20px] py-1.5 px-3.5 self-start
        ${className}
      `}
      style={{
        backgroundColor: bgColor,
        borderColor,
      }}
    >
      {icon && <span className="ml-0.5">{icon}</span>}
      <span
        className="font-[Vazir-Medium] text-[13px]"
        style={{ color: textColor }}
      >
        {label}
      </span>
      {onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="mr-0.5"
        >
          <FiX size={14} style={{ color: textColor }} />
        </button>
      )}
    </div>
  );

  if (onPress) {
    return (
      <button onClick={onPress} className="active:opacity-75 transition-opacity">
        {content}
      </button>
    );
  }

  return content;
}