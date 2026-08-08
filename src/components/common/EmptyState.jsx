'use client';
import { useTheme } from '@/stores/useThemeStore';
import Button from './Button';

/**
 * کامپوننت EmptyState - حالت خالی لیست (ادغام‌شده)
 *
 * @param {string|React.ReactNode} icon - آیکون یا ایموجی
 * @param {string} title - عنوان
 * @param {string} description - توضیحات
 * @param {string} actionLabel - متن دکمه اکشن
 * @param {function} onAction - هندلر دکمه
 * @param {'service'|'appointment'|'portfolio'|'favorite'|'payment'|'ads'|'lineRental'|'modelRequest'|'default'} variant - نوع پیش‌فرض
 * @param {string} customTitle - عنوان سفارشی (override)
 * @param {string} customDescription - توضیحات سفارشی (override)
 */

const VARIANTS = {
  service:      { emoji: '💆‍♀️', title: 'هنوز خدمتی ثبت نشده',       description: 'اولین خدمت خود را اضافه کنید تا مشتریان بتوانند نوبت رزرو کنند', actionLabel: 'افزودن اولین خدمت' },
  appointment:  { emoji: '📅',   title: 'نوبتی ثبت نشده است',         description: 'هنوز هیچ نوبتی برای شما ثبت نشده است',                     actionLabel: null },
  portfolio:    { emoji: '📸',   title: 'نمونه‌کاری ثبت نشده',        description: 'با ثبت نمونه‌کارها، اعتماد مشتریان را جلب کنید',           actionLabel: 'افزودن نمونه‌کار' },
  favorite:     { emoji: '❤️',   title: 'لیست علاقه‌مندی خالی است',   description: 'کسب‌وکارها و پست‌های مورد علاقه خود را ذخیره کنید',       actionLabel: null },
  payment:      { emoji: '💳',   title: 'تراکنشی ثبت نشده',           description: 'هنوز هیچ تراکنش مالی انجام نشده است',                    actionLabel: null },
  ads:          { emoji: '🔥',   title: 'فعلاً پیشنهاد ویژه‌ای نیست', description: 'به زودی تخفیف‌ها و جشنواره‌های جدید اضافه می‌شود',          actionLabel: null },
  lineRental:   { emoji: '🏢',   title: 'آگهی لاینی یافت نشد',        description: 'فیلترهای خود را تغییر دهید',                              actionLabel: null },
  modelRequest: { emoji: '👤',   title: 'فرصت مدلینگی یافت نشد',      description: 'به زودی فرصت‌های جدید اضافه می‌شود',                      actionLabel: null },
  default:      { emoji: '📭',   title: 'موردی یافت نشد',             description: 'هیچ نتیجه‌ای برای نمایش وجود ندارد',                       actionLabel: null },
};

export default function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  variant = 'default',
  customTitle,
  customDescription,
}) {
  const { colors } = useTheme();

  // اگر variant مشخص شده و icon/title دستی داده نشده، از preset استفاده کن
  const config = VARIANTS[variant] || VARIANTS.default;
  const displayIcon = icon ?? config.emoji;
  const displayTitle = title ?? customTitle ?? config.title;
  const displayDesc = description ?? customDescription ?? config.description;
  const displayAction = actionLabel ?? config.actionLabel;

  return (
    <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
      {/* آیکون */}
      {displayIcon && (
        <div
          className="w-20 h-20 rounded-3xl border flex items-center justify-center mb-5"
          style={{ backgroundColor: colors.cardBackground, borderColor: colors.border }}
        >
          {typeof displayIcon === 'string' ? (
            <span className="text-4xl">{displayIcon}</span>
          ) : (
            displayIcon
          )}
        </div>
      )}

      {/* عنوان */}
      {displayTitle && (
        <h3 className="text-lg mb-2 font-[Vazir-Bold]" style={{ color: colors.textMain }}>
          {displayTitle}
        </h3>
      )}

      {/* توضیحات */}
      {displayDesc && (
        <p className="text-sm leading-6 mb-6 max-w-xs font-[Vazir]" style={{ color: colors.textSecondary }}>
          {displayDesc}
        </p>
      )}

      {/* دکمه اکشن */}
      {displayAction && onAction && (
        <Button title={displayAction} onPress={onAction} variant="outline" size="md" />
      )}
    </div>
  );
}