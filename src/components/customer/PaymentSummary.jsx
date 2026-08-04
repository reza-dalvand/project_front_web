'use client';
import { useTheme } from '@/stores/useThemeStore';
import { toPersianDigit } from '@/utils/numberUtils';

/**
 * خلاصه پرداخت
 *
 * @param {Array} items - آیتم‌های خرید [{ name, price }]
 * @param {number} discount - تخفیف
 * @param {number} total - مجموع نهایی
 */
export default function PaymentSummary({ items, discount = 0, total }) {
  const { colors } = useTheme();

  const subtotal = items.reduce((sum, item) => sum + item.price, 0);
  const finalTotal = total ?? subtotal - discount;

  return (
    <div
      className="rounded-xl p-4"
      style={{ backgroundColor: colors.cardBackground }}
    >
      <h3
        className="text-base font-[Vazir-Bold] mb-3"
        style={{ color: colors.textMain }}
      >
        خلاصه پرداخت
      </h3>

      {/* آیتم‌ها */}
      <div className="space-y-2.5 mb-3">
        {items.map((item, index) => (
          <div key={index} className="flex justify-between items-center">
            <span
              className="text-sm font-[Vazir] flex-1"
              style={{ color: colors.textMain }}
            >
              {item.name}
            </span>
            <span
              className="text-sm font-[Vazir]"
              style={{ color: colors.textMain }}
            >
              {item.price.toLocaleString('fa-IR')} تومان
            </span>
          </div>
        ))}
      </div>

      {/* تخفیف */}
      {discount > 0 && (
        <>
          <div
            className="h-px my-3"
            style={{ backgroundColor: colors.border }}
          />
          <div className="flex justify-between items-center">
            <span
              className="text-sm font-[Vazir]"
              style={{ color: colors.textSecondary }}
            >
              تخفیف
            </span>
            <span
              className="text-sm font-[Vazir]"
              style={{ color: '#4CAF50' }}
            >
              {discount.toLocaleString('fa-IR')}- تومان
            </span>
          </div>
        </>
      )}

      <div
        className="h-px my-3"
        style={{ backgroundColor: colors.border }}
      />

      {/* مجموع */}
      <div className="flex justify-between items-center">
        <span
          className="text-[15px] font-[Vazir-Bold]"
          style={{ color: colors.textMain }}
        >
          مجموع
        </span>
        <span
          className="text-[17px] font-[Vazir-Bold]"
          style={{ color: colors.primary }}
        >
          {finalTotal.toLocaleString('fa-IR')} تومان
        </span>
      </div>
    </div>
  );
}