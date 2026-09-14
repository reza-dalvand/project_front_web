'use client';
import { FiX } from 'react-icons/fi';

export default function Chip({ label, selected = false, onPress, icon, onRemove, className = '' }) {
  const content = (
    <div
      className={`
        flex items-center gap-1 sm:gap-1.5
        border-[1.5px] rounded-full
        py-1 sm:py-1.5
        px-2.5 sm:px-3.5
        self-start
        transition-all duration-150
        ${
          selected
            ? 'bg-[var(--primary)]/20 border-[var(--primary)]'
            : 'bg-[var(--card)] border-[var(--border)]'
        }
        ${className}
      `}
    >
      {icon && <span className="ml-0.5 flex-shrink-0 text-[14px] sm:text-[16px]">{icon}</span>}
      <span
        className={`
          font-vazir-medium
          text-[12px] sm:text-[13px]
          whitespace-nowrap
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
          className="mr-0.5 flex-shrink-0 active:scale-75 transition-transform"
        >
          <FiX
            size={12}
            className={`sm:w-[14px] sm:h-[14px] ${selected ? 'text-[var(--primary)]' : 'text-[var(--text-secondary)]'}`}
          />
        </button>
      )}
    </div>
  );

  if (onPress) {
    return (
      <button onClick={onPress} className="active:opacity-75 active:scale-95 transition-all">
        {content}
      </button>
    );
  }
  return content;
}