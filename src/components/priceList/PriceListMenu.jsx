// src/components/priceList/PriceListMenu.jsx
'use client';
import { useMemo } from 'react';
import Image from 'next/image';
import { toPersianDigit } from '@/utils/numberUtils';
import { PRICE_LIST_THEMES } from '@/data/priceList';

/**
 * تبدیل قیمت به هزار تومان (برای نمایش در منو)
 * ۶۵۰,۰۰۰ → ۶۵۰
 */
const toThousands = (price) => Math.round((price || 0) / 1000);

/**
 * ایموجی بر اساس نام سکشن
 */
const getSectionEmoji = (label = '') => {
  if (label.includes('ناخن')) return '💅';
  if (label.includes('میکاپ') || label.includes('گریم')) return '💄';
  if (label.includes('پوست') || label.includes('فیشیال') || label.includes('پاکسازی')) return '✨';
  if (label.includes('لیزر')) return '⚡';
  if (label.includes('مو') || label.includes('رنگ') || label.includes('کراتین')) return '🎨';
  if (label.includes('مژه') || label.includes('ابرو')) return '👁️';
  if (label.includes('ماساژ') || label.includes('اسپا')) return '💆‍♀️';
  return '💆‍♀️';
};

/**
 * 🏷️ منوی لیست قیمت
 *
 * @param {string} businessName - نام کسب‌وکار
 * @param {string} businessLogo - لوگوی کسب‌وکار
 * @param {object} settings - { themeId, isPublished, notes, services }
 *
 * services از بک‌اند می‌آیند:
 *   [{ id, name, typeName, originalPrice, discountPercent, finalPrice, hasDeposit, depositAmount }]
 */
export default function PriceListMenu({ businessName, businessLogo, settings }) {
  const theme = PRICE_LIST_THEMES.find((t) => t.id === settings?.themeId) || PRICE_LIST_THEMES[0];
  const services = settings?.services || [];
  const notes = settings?.notes || [];

  // گروه‌بندی خدمات بر اساس typeName
  const sections = useMemo(() => {
    const grouped = {};
    services.forEach((s) => {
      const key = s.typeName || 'سایر خدمات';
      if (!grouped[key]) {
        grouped[key] = { label: key, items: [] };
      }
      grouped[key].items.push(s);
    });
    return Object.values(grouped);
  }, [services]);

  return (
    <div
      className="rounded-[28px] p-3"
      style={{ backgroundColor: theme.bg, border: `1.5px solid ${theme.border}` }}
    >
      <div
        className="rounded-[22px] px-4 py-5"
        style={{ backgroundColor: theme.card, border: `1px solid ${theme.border}` }}
      >
        {/* ═══ هدر ═══ */}
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
        {sections.length > 0 ? (
          sections.map((sec) => (
            <div key={sec.label} className="mb-4">
              {/* عنوان سکشن */}
              <div className="flex items-center gap-2 mb-3">
                <div className="flex-1 h-px" style={{ backgroundColor: theme.border }} />
                <span
                  className="text-[12px] font-[Vazir-Bold] flex items-center gap-1"
                  style={{ color: theme.accent }}
                >
                  <span>{getSectionEmoji(sec.label)}</span>
                  {sec.label}
                </span>
                <div className="flex-1 h-px" style={{ backgroundColor: theme.border }} />
              </div>

              {/* آیتم‌ها — دو ستونه */}
              <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                {sec.items.map((item) => {
                  const price = toThousands(item.finalPrice ?? item.originalPrice ?? 0);
                  const hasDeposit = item.hasDeposit && item.depositAmount > 0;
                  const depositPrice = hasDeposit ? toThousands(item.depositAmount) : 0;

                  return (
                    <div key={item.id} className="flex flex-col gap-1">
                      <div className="flex items-center gap-1">
                        <span
                          className="text-[13px] font-[Vazir-Medium] truncate"
                          style={{ color: theme.text }}
                        >
                          {item.name}
                        </span>
                        <div
                          className="flex-1 border-b border-dotted mx-0.5 mb-1 min-w-[8px]"
                          style={{ borderColor: theme.dot }}
                        />
                        <span
                          className="text-[13px] font-[Vazir-Bold] flex-shrink-0"
                          style={{ color: theme.accent }}
                        >
                          {toPersianDigit(price)}
                        </span>
                        <span
                          className="text-[10px] font-[Vazir] flex-shrink-0 mr-1"
                          style={{ color: theme.textSecondary }}
                        >
                          {hasDeposit ? `بیعانه: ${toPersianDigit(depositPrice)}` : 'مبلغ کامل'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center gap-2 py-8">
            <span className="text-3xl">📋</span>
            <p className="text-sm" style={{ color: theme.textSecondary }}>
              هنوز خدمتی ثبت نشده است
            </p>
          </div>
        )}

        {/* ═══ یادداشت‌ها ═══ */}
        {notes.length > 0 && (
          <div className="mt-4 space-y-2">
            <div className="flex items-center gap-2">
              <div className="flex-1 h-px" style={{ backgroundColor: theme.border }} />
              <span className="text-[11px] font-[Vazir-Bold]" style={{ color: theme.accent }}>
                یادداشت‌ها
              </span>
              <div className="flex-1 h-px" style={{ backgroundColor: theme.border }} />
            </div>
            {notes.map((note) => (
              <div
                key={note.id}
                className="flex items-center justify-between px-3 py-2 rounded-lg"
                style={{ backgroundColor: theme.bg }}
              >
                <span className="text-[11px] font-[Vazir]" style={{ color: theme.text }}>
                  {note.label}
                </span>
                {(note.min > 0 || note.max > 0) && (
                  <span className="text-[11px] font-[Vazir-Bold]" style={{ color: theme.accent }}>
                    {note.min > 0 && `از ${toPersianDigit(note.min)}`}
                    {note.min > 0 && note.max > 0 && ' تا '}
                    {note.max > 0 && `${toPersianDigit(note.max)} هزار تومان`}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}

        {/* ═══ فوتر ═══ */}
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
          <span className="text-[10px]" style={{ color: theme.textSecondary }}>
            تمام قیمت‌ها به تومان می‌باشد
          </span>
        </div>
      </div>
    </div>
  );
}
