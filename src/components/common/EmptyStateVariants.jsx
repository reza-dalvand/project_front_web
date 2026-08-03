// src/components/common/EmptyStateVariants.jsx
'use client';

import { useTheme } from '@/stores/useThemeStore';
import Button from './Button';

/**
 * کامپوننت EmptyStateVariants - حالت خالی با واریانت‌های مختلف
 *
 * @param {'service'|'appointment'|'portfolio'|'favorite'|'payment'|'default'} variant
 * @param {function} onAction - هندلر دکمه اکشن
 * @param {string} customTitle - عنوان سفارشی (اختیاری)
 * @param {string} customDescription - توضیحات سفارشی (اختیاری)
 */

const VARIANTS = {
  service: {
    emoji: '💆‍♀️',
    title: 'هنوز خدمتی ثبت نشده',
    description:
      'اولین خدمت خود را اضافه کنید تا مشتریان بتوانند نوبت رزرو کنند',
    actionLabel: 'افزودن اولین خدمت',
  },
  appointment: {
    emoji: '📅',
    title: 'نوبتی ثبت نشده است',
    description: 'هنوز هیچ نوبتی برای شما ثبت نشده است',
    actionLabel: null,
  },
  portfolio: {
    emoji: '📸',
    title: 'نمونه‌کاری ثبت نشده',
    description: 'با ثبت نمونه‌کارها، اعتماد مشتریان را جلب کنید',
    actionLabel: 'افزودن نمونه‌کار',
  },
  favorite: {
    emoji: '❤️',
    title: 'لیست علاقه‌مندی خالی است',
    description: 'کسب‌وکارها و پست‌های مورد علاقه خود را ذخیره کنید',
    actionLabel: null,
  },
  payment: {
    emoji: '💳',
    title: 'تراکنشی ثبت نشده',
    description: 'هنوز هیچ تراکنش مالی انجام نشده است',
    actionLabel: null,
  },
  default: {
    emoji: '📭',
    title: 'موردی یافت نشد',
    description: 'هیچ نتیجه‌ای برای نمایش وجود ندارد',
    actionLabel: null,
  },
};

export default function EmptyStateVariants({
  variant = 'default',
  onAction,
  customTitle,
  customDescription,
}) {
  const { colors } = useTheme();
  const config = VARIANTS[variant] || VARIANTS.default;

  return (
    <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
      {/* آیکون */}
      <div
        className="w-20 h-20 rounded-3xl border flex items-center justify-center mb-5"
        style={{
          backgroundColor: colors.cardBackground,
          borderColor: colors.border,
        }}
      >
        <span className="text-4xl">{config.emoji}</span>
      </div>

      {/* عنوان */}
      <h3
        className="text-lg mb-2 font-[Vazir-Bold]"
        style={{ color: colors.textMain }}
      >
        {customTitle || config.title}
      </h3>

      {/* توضیحات */}
      <p
        className="text-sm leading-6 mb-6 max-w-xs font-[Vazir]"
        style={{ color: colors.textSecondary }}
      >
        {customDescription || config.description}
      </p>

      {/* دکمه اکشن */}
      {config.actionLabel && onAction && (
        <Button
          title={config.actionLabel}
          onPress={onAction}
          variant="outline"
          size="md"
        />
      )}
    </div>
  );
}