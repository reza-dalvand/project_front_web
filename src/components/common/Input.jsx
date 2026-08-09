'use client';
import { useState } from 'react';

/**
 * کامپوننت ورودی مشترک
 */
export default function Input({
  label,
  placeholder,
  value,
  onChangeText,
  variant = 'default',
  error,
  hint,
  secureTextEntry = false,
  type = 'text',
  multiline = false,
  maxLength,
  editable = true,
  rightIcon = null,
  leftIcon = null,
  onRightIconPress,
  className = '',
  onBlur,
}) {
  const [focused, setFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const borderColor = error
    ? 'border-red-400'
    : focused
      ? 'border-[var(--primary)]'
      : 'border-[var(--border)]';

  const bgColor = variant === 'filled' ? 'bg-[var(--card)]' : 'bg-transparent';

  const InputComponent = multiline ? 'textarea' : 'input';

  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label className="block text-sm mb-2 text-right font-vazir-medium text-[var(--text-secondary)]">
          {label}
        </label>
      )}
      <div
        className={`
          flex items-center border-2 rounded-2xl px-4 min-h-[52px]
          transition-all duration-200
          ${borderColor}
          ${bgColor}
          ${!editable ? 'opacity-50' : ''}
          ${multiline ? 'py-3' : ''}
        `}
      >
        {rightIcon && (
          <button
            onClick={onRightIconPress}
            className={`ml-3 flex items-center ${onRightIconPress ? 'cursor-pointer' : 'cursor-default'}`}
            disabled={!onRightIconPress}
            type="button"
          >
            {rightIcon}
          </button>
        )}
        <InputComponent
          value={value}
          onChange={(e) => onChangeText?.(e.target.value)}
          placeholder={placeholder}
          type={secureTextEntry && !showPassword ? 'password' : type}
          maxLength={maxLength}
          disabled={!editable}
          onFocus={() => setFocused(true)}
          onBlur={(e) => {
            setFocused(false);
            onBlur?.(e);
          }}
          rows={multiline ? 3 : undefined}
          className="flex-1 bg-transparent outline-none text-right text-[var(--text-main)] font-vazir text-[15px] rtl"
        />
        {leftIcon && !secureTextEntry && (
          <span className="mr-3 flex items-center">{leftIcon}</span>
        )}
        {secureTextEntry && (
          <button
            onClick={() => setShowPassword(!showPassword)}
            className="mr-3 flex items-center text-xs text-[var(--text-secondary)] font-vazir"
            type="button"
          >
            {showPassword ? 'پنهان' : 'نمایش'}
          </button>
        )}
      </div>
      {error && (
        <p className="text-right text-xs mt-1 text-red-400 font-vazir">{error}</p>
      )}
      {!error && hint && (
        <p className="text-right text-xs mt-1 text-[var(--text-secondary)] font-vazir">{hint}</p>
      )}
    </div>
  );
}