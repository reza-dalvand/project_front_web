'use client';
import { useState } from 'react';
import { FiSearch, FiX } from 'react-icons/fi';

/**
 * کامپوننت نوار جستجو مشترک
 */
export default function SearchBar({
  value,
  onChangeText,
  placeholder = 'جستجوی خدمات و کسب‌وکارها...',
  onSubmit,
  onClear,
  autoFocus = false,
  className = '',
}) {
  const [focused, setFocused] = useState(false);

  const handleClear = () => {
    onChangeText?.('');
    onClear?.();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') onSubmit?.();
  };

  return (
    <div
      className={`
        flex items-center gap-3 px-4 rounded-2xl border transition-all duration-200 h-[52px]
        bg-[var(--card)]
        ${focused ? 'border-[var(--primary)]' : 'border-[var(--border)]'}
        ${className}
      `}
    >
      <FiSearch
        size={22}
        className={`flex-shrink-0 ${focused ? 'text-[var(--primary)]' : 'text-[var(--text-secondary)]'}`}
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChangeText?.(e.target.value)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onKeyDown={handleKeyDown}
        className="flex-1 bg-transparent outline-none text-right text-[var(--text-main)] text-sm font-vazir rtl"
      />
      {value?.length > 0 && (
        <button
          onClick={handleClear}
          className="p-1 rounded-lg hover:bg-black/5 transition-colors bg-[var(--bg)]"
        >
          <FiX size={16} className="text-[var(--text-secondary)]" />
        </button>
      )}
    </div>
  );
}