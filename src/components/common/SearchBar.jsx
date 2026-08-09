'use client';
import { useState } from 'react';
import { FiSearch, FiX } from 'react-icons/fi';

export default function SearchBar({
  value,
  onChangeText,
  placeholder = 'جستجوی خدمات و کسب‌وکارها...',
  onSubmit,
  onClear,
  autoFocus = false,
  variant = 'default', // ✅ 'default' | 'onPrimary'
  className = '',
}) {
  const [focused, setFocused] = useState(false);
  const isOnPrimary = variant === 'onPrimary';

  const handleClear = () => {
    onChangeText?.('');
    onClear?.();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') onSubmit?.();
  };

  // ✅ رنگ‌بندی بر اساس variant
  const borderColor = focused
    ? isOnPrimary
      ? 'border-white/50'
      : 'border-[var(--primary)]'
    : isOnPrimary
      ? 'border-white/30'
      : 'border-[var(--border)]';

  const iconColor = isOnPrimary
    ? 'text-white/80'
    : focused
      ? 'text-[var(--primary)]'
      : 'text-[var(--text-secondary)]';

  const textColor = isOnPrimary ? 'text-white' : 'text-[var(--text-main)]';

  const placeholderColor = isOnPrimary ? 'placeholder:text-white/60' : '';

  const clearBg = isOnPrimary ? 'bg-white/20' : 'bg-[var(--bg)]';
  const clearIcon = isOnPrimary ? 'text-white/80' : 'text-[var(--text-secondary)]';
  const bgColor = isOnPrimary ? 'bg-white/15' : 'bg-[var(--card)]';

  return (
    <div
      className={`
        flex items-center gap-3 px-4 rounded-2xl border transition-all duration-200 h-[52px]
        ${bgColor}
        ${borderColor}
        ${className}
      `}
    >
      <FiSearch size={22} className={`flex-shrink-0 ${iconColor}`} />
      <input
        type="text"
        value={value}
        onChange={(e) => onChangeText?.(e.target.value)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onKeyDown={handleKeyDown}
        className={`flex-1 bg-transparent outline-none text-right text-sm font-vazir rtl ${textColor} ${placeholderColor}`}
        suppressHydrationWarning // ✅ این خط را اضافه کنید
      />
      {value?.length > 0 && (
        <button
          onClick={handleClear}
          className={`p-1 rounded-lg hover:opacity-70 transition-opacity ${clearBg}`}
        >
          <FiX size={16} className={clearIcon} />
        </button>
      )}
    </div>
  );
}
