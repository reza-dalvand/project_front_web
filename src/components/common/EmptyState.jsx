'use client';

import { useTheme } from '@/stores/useThemeStore';
import Button from './Button';

/**
 * کامپوننت EmptyState - حالت خالی لیست
 *
 * @param {string|React.ReactNode} icon - آیکون یا ایموجی
 * @param {string} title - عنوان
 * @param {string} description - توضیحات
 * @param {string} actionLabel - متن دکمه اکشن
 * @param {function} onAction - هندلر دکمه
 */
export default function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
}) {
  const { colors } = useTheme();

  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      {/* آیکون */}
      {icon && (
        <div
          className="w-20 h-20 rounded-3xl border flex items-center justify-center mb-5"
          style={{
            backgroundColor: colors.cardBackground,
            borderColor: colors.border,
          }}
        >
          {typeof icon === 'string' ? (
            <span className="text-4xl">{icon}</span>
          ) : (
            icon
          )}
        </div>
      )}

      {/* عنوان */}
      {title && (
        <h3
          className="text-lg mb-2 font-[Vazir-Bold]"
          style={{ color: colors.textMain }}
        >
          {title}
        </h3>
      )}

      {/* توضیحات */}
      {description && (
        <p
          className="text-sm leading-6 mb-6 max-w-xs font-[Vazir]"
          style={{ color: colors.textSecondary }}
        >
          {description}
        </p>
      )}

      {/* دکمه اکشن */}
      {actionLabel && onAction && (
        <Button
          title={actionLabel}
          onPress={onAction}
          variant="outline"
          size="md"
        />
      )}
    </div>
  );
}