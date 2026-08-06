// src/components/common/SearchBar.jsx
'use client';

import { useState } from 'react';
import { FiSearch, FiX } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';

export default function SearchBar({
  value,
  onChangeText,
  placeholder = 'جستجوی خدمات و کسب‌وکارها...',
  onSubmit,
  onClear,
  autoFocus = false,
  className = '',
}) {
  const { colors } = useTheme();
  const [focused, setFocused] = useState(false);

  const handleClear = () => {
    onChangeText?.('');
    onClear?.();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      onSubmit?.();
    }
  };

  return (
    <div
      className={`
        flex items-center gap-3 px-4 rounded-2xl border transition-all duration-200
        ${className}
      `}
      style={{
        backgroundColor: colors.cardBackground,
        borderColor: focused ? colors.primary : colors.border,
        height: '52px',
      }}
    >
      <FiSearch
        size={22}
        style={{ color: focused ? colors.primary : colors.textSecondary, flexShrink: 0 }}
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
        className="flex-1 bg-transparent outline-none text-right"
        suppressHydrationWarning
        style={{
          color: colors.textMain,
          fontSize: '14px',
          fontFamily: 'Vazir',
          direction: 'rtl',
        }}
        // ❌ placeholderTextColor حذف شد - از CSS استفاده می‌کنیم
      />

      {value?.length > 0 && (
        <button
          onClick={handleClear}
          className="p-1 rounded-lg hover:bg-black/5 transition-colors"
          style={{ backgroundColor: colors.background }}
        >
          <FiX size={16} style={{ color: colors.textSecondary }} />
        </button>
      )}
    </div>
  );
}
