// src/components/priceList/PriceListMenu.jsx
'use client';
import Image from 'next/image';
import { toPersianDigit } from '@/utils/numberUtils';
import { PRICE_LIST_THEMES } from '@/data/priceList';

// تبدیل تومان به هزار تومان (۶۵۰,۰۰۰ → ۶۵۰)
const toThousands = (price) => Math.round((price || 0) / 1000);

// ایموجی هر سکشن بر اساس نام دسته
const getSectionEmoji = (label = '') => {
  if (label.includes('ناخن')) return '💅';
  if (label.includes('میکاپ') || label.includes('گریم')) return '💄';
  if (label.includes('پوست') || label.includes('فیشیال') || label.includes('پاکسازی')) return '✨';
  if (label.includes('لیزر')) return '⚡';
  if (label.includes('مو') || label.includes('رنگ') || label.includes('کراتین')) return '🎨';
  if (label.includes('مژه') || label.includes('ابرو')) return '👁️';
  if (label.includes('ماساژ') || label.includes('اسپا')) return '💆‍♀️';
  return '💆♀️';
};

/**
 * 📋 منوی قیمت خدمات (طرح مشابه کارت چاپی)
 * استفاده در: تب «قیمت‌ها» صفحه کسب‌وکار + پیش‌نمایش صفحه مدیریت
 */
export default function PriceListMenu({ businessName, businessLogo, services = [], settings }) {
  const theme = PRICE_LIST_THEMES.find((t) => t.id === settings?.themeId) || PRICE_LIST_THEMES[0];
  const notes = settings?.notes || [];

  // گروه‌بندی خدمات بر اساس typeName (سکشن‌ها)
  const sections = [];
  (services || []).forEach((s) => {
    const key = s.typeName || 'سایر خدمات';
    let sec = sections.find((x) => x.label === key);
    if (!sec) {
      sec = { label: key, items: [] };
      sections.push(sec);
    }
    sec.items.push(s);
  });

  return (
    <div
      className="rounded-[28px] p-3"
      style={{ backgroundColor: theme.bg, border: `1.5px solid ${theme.border}` }}
    >
      <div
        className="rounded-[22px] px-4 py-5"
        style={{ backgroundColor: theme.card, border: `1px solid ${theme.border}` }}
      >
        {/* ═══ هدر: لوگو + نام کسب‌وکار + نام اپ ═══ */}
        <div className="flex flex-col items-center gap-1.5 mb-5 text-center">
          {businessLogo && (
            <div
              className="w-14 h-14 rounded-full overflow-hidden mb-1"
              style={{ border: `2px solid ${theme.accent}` }}
            >
              <Image
                src={businessLogo}
                alt={businessName || 'لوگو'}
                width={56}
                height={56}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <span
            className="text-[9px] font-bold tracking-[4px]"
            style={{ color: theme.accent }}
            dir="ltr"
          >
            PRICE LIST
          </span>
          <h3 className="text-lg font-[Vazir-Bold] leading-6" style={{ color: theme.text }}>
            {businessName}
          </h3>
          <span className="text-[10px]" style={{ color: theme.textSecondary }}>
            زیبانو | رزرو آنلاین خدمات زیبایی و سلامت
          </span>
          <div className="mt-1 px-5 py-1.5 rounded-full" style={{ backgroundColor: theme.accent }}>
            <span className="text-[11px] font-[Vazir-Bold] text-white">لیست قیمت خدمات</span>
          </div>
        </div>

        {/* ═══ سکشن‌ها + آیتم‌ها ═══ */}
        {sections.map((sec) => (
          <div key={sec.label} className="mb-4">
            {/* عنوان سکشن با خط تزئینی */}
            <div className="flex items-center gap-2 mb-2.5">
              <div className="flex-1 h-px" style={{ backgroundColor: theme.border }} />
              <span
                className="text-[11px] font-[Vazir-Bold] flex items-center gap-1"
                style={{ color: theme.accent }}
              >
                <span>{getSectionEmoji(sec.label)}</span>
                {sec.label}
              </span>
              <div className="flex-1 h-px" style={{ backgroundColor: theme.border }} />
            </div>
            {/* آیتم‌ها در دو ستون */}
            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
              {sec.items.map((item) => (
                <div key={item.id} className="flex items-center gap-1">
                  <span
                    className="text-[11px] font-[Vazir-Medium] truncate"
                    style={{ color: theme.text }}
                  >
                    {item.name}
                  </span>
                  <div
                    className="flex-1 border-b border-dotted mx-1 mb-1"
                    style={{ borderColor: theme.dot }}
                  />
                  <span
                    className="text-[11px] font-[Vazir-Bold] flex-shrink-0"
                    style={{ color: theme.accent }}
                  >
                    {toPersianDigit(
                      toThousands(item.finalPrice ?? item.price ?? item.originalPrice)
                    )}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* ═══ یادداشت‌های بازه قیمتی ═══ */}
        {notes.length > 0 && (
          <div
            className="rounded-2xl px-3.5 py-3 mt-2"
            style={{ backgroundColor: theme.accentSoft, border: `1px solid ${theme.border}` }}
          >
            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
              {notes.map((n) => (
                <div key={n.id} className="flex items-center justify-between gap-1">
                  <span className="text-[10px] truncate" style={{ color: theme.text }}>
                    ♥ {n.label}
                  </span>
                  <span
                    className="text-[10px] font-[Vazir-Bold] flex-shrink-0"
                    style={{ color: theme.accent }}
                  >
                    {toPersianDigit(n.min)} تا {toPersianDigit(n.max)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ═══ فوتر: لوگوی اپ (به جای اینستاگرام) ═══ */}
        <div className="flex flex-col items-center gap-1.5 mt-5">
          <div
            className="flex items-center gap-2 px-6 py-2 rounded-full"
            style={{ backgroundColor: theme.bg, border: `1px solid ${theme.border}` }}
          >
            <span className="text-sm">🌸</span>
            <span className="text-[11px] font-[Vazir-Bold]" style={{ color: theme.accent }}>
              زیبانو
            </span>
          </div>
          <span className="text-[9px]" style={{ color: theme.textSecondary }}>
            تمام قیمت‌ها به هزار تومان می‌باشد
          </span>
        </div>
      </div>
    </div>
  );
}
