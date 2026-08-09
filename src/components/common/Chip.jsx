'use client';
import { FiX } from 'react-icons/fi';

/**
 * کامپوننت Chip مشترک
 */
export default function Chip({
  label,
  selected = false,
  onPress,
  icon,
  onRemove,
  className = '',
}) {
  const content = (
    <div
      className={`
        flex items-center gap-1.5 border-[1.5px] rounded-[20px] py-1.5 px-3.5 self-start
        ${selected
          ? 'bg-[var(--primary)]/20 border-[var(--primary)]'
          : 'bg-[var(--card)] border-[var(--border)]'
        }
        ${className}
      `}
    >
      {icon && <span className="ml-0.5">{icon}</span>}
      <span
        className={`
          font-vazir-medium text-[13px]
          ${selected ? 'text-[var(--primary)]' : 'text-[var(--text-secondary)]'}
        `}
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
          <FiX
            size={14}
            className={selected ? 'text-[var(--primary)]' : 'text-[var(--text-secondary)]'}
          />
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