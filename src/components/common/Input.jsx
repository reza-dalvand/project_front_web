// src/components/common/Input.jsx
'use client';

import { useState } from 'react';
import { useTheme } from '@/stores/useThemeStore';

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
  const { colors } = useTheme();
  const [focused, setFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const borderColor = error
    ? '#E57373'
    : focused
    ? colors.primary
    : colors.border;

  const bgColor =
    variant === 'filled' ? colors.cardBackground : 'transparent';

  const InputComponent = multiline ? 'textarea' : 'input';

  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label
          className="block text-sm mb-2 text-right"
          style={{ color: colors.textSecondary, fontFamily: 'Vazir-Medium' }}
        >
          {label}
        </label>
      )}

      <div
        className={`
          flex items-center border-2 rounded-2xl px-4 min-h-[52px]
          transition-all duration-200
          ${focused ? 'border-2' : ''}
          ${!editable ? 'opacity-50' : ''}
          ${multiline ? 'py-3' : ''}
        `}
        style={{
          borderColor,
          backgroundColor: bgColor,
        }}
      >
        {rightIcon && (
          <button
            onClick={onRightIconPress}
            className={`ml-3 flex items-center ${!onRightIconPress ? 'cursor-default' : 'cursor-pointer'}`}
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
          className={`
            flex-1 bg-transparent outline-none
            text-right
          `}
          style={{
            color: colors.textMain,
            fontFamily: 'Vazir',
            fontSize: '15px',
            direction: 'rtl',
          }}
        />

        {leftIcon && !secureTextEntry && (
          <span className="mr-3 flex items-center">{leftIcon}</span>
        )}

        {secureTextEntry && (
          <button
            onClick={() => setShowPassword(!showPassword)}
            className="mr-3 flex items-center"
            type="button"
          >
            <span
              className="text-xs"
              style={{ color: colors.textSecondary, fontFamily: 'Vazir' }}
            >
              {showPassword ? 'پنهان' : 'نمایش'}
            </span>
          </button>
        )}
      </div>

      {error && (
        <p
          className="text-right text-xs mt-1"
          style={{ color: '#E57373', fontFamily: 'Vazir' }}
        >
          {error}
        </p>
      )}

      {!error && hint && (
        <p
          className="text-right text-xs mt-1"
          style={{ color: colors.textSecondary, fontFamily: 'Vazir' }}
        >
          {hint}
        </p>
      )}
    </div>
  );
}