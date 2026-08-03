'use client';

import Image from 'next/image';
import { FaUser } from 'react-icons/fa';
import { useTheme } from '@/stores/useThemeStore';

/**
 * کامپوننت آواتار مشترک
 *
 * @param {string} uri - آدرس تصویر
 * @param {string} name - نام (برای نمایش حرف اول)
 * @param {'xs'|'sm'|'md'|'lg'|'xl'} size - اندازه
 * @param {boolean} showBorder - نمایش حاشیه
 * @param {string} className - کلاس‌های اضافی
 */
export default function Avatar({
  uri,
  name,
  size = 'md',
  showBorder = false,
  className = '',
}) {
  const { colors } = useTheme();

  // اندازه‌های مختلف
  const sizes = {
    xs: { dim: 28, icon: 16, font: 11 },
    sm: { dim: 36, icon: 20, font: 13 },
    md: { dim: 48, icon: 28, font: 17 },
    lg: { dim: 64, icon: 36, font: 22 },
    xl: { dim: 88, icon: 50, font: 30 },
  };

  const { dim, icon, font } = sizes[size] || sizes.md;

  // استخراج حرف اول از نام
  const initials = name ? name.trim().charAt(0).toUpperCase() : null;

  const borderColor = showBorder ? colors.primary : colors.border;
  const borderWidth = showBorder ? 2 : 1;

  return (
    <div
      className={`
        relative flex items-center justify-center
        rounded-full overflow-hidden
        ${className}
      `}
      style={{
        width: `${dim}px`,
        height: `${dim}px`,
        backgroundColor: colors.primary + '20',
        border: `${borderWidth}px solid ${borderColor}`,
      }}
    >
      {uri ? (
        <Image
          src={uri}
          alt={name || 'avatar'}
          width={dim}
          height={dim}
          className="object-cover"
          style={{
            width: '100%',
            height: '100%',
          }}
        />
      ) : initials ? (
        <span
          style={{
            color: colors.primary,
            fontSize: `${font}px`,
            fontFamily: 'Vazir-Bold',
          }}
        >
          {initials}
        </span>
      ) : (
        <FaUser
          style={{
            color: colors.primary,
            fontSize: `${icon}px`,
          }}
        />
      )}
    </div>
  );
}