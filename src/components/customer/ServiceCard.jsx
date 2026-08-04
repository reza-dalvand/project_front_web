'use client';
import Image from 'next/image';
import { useTheme } from '@/stores/useThemeStore';

/**
 * کارت خدمت برای نمایش به مشتری
 *
 * @param {object} service - داده خدمت
 * @param {function} onPress - تابع کلیک
 */
export default function ServiceCard({ service, onPress }) {
  const { colors } = useTheme();

  const hasDiscount = service.discount > 0;
  const finalPrice = hasDiscount
    ? service.price * (1 - service.discount / 100)
    : service.price;

  return (
    <button
      onClick={onPress}
      className="w-full rounded-xl overflow-hidden mb-3 text-right
        transition-transform hover:scale-[1.01] active:scale-[0.99]"
      style={{ backgroundColor: colors.cardBackground }}
    >
      {service.image && (
        <div className="relative w-full h-[140px]">
          <Image
            src={service.image}
            alt={service.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 400px"
          />
        </div>
      )}
      <div className="p-3">
        <h3
          className="text-[15px] font-semibold mb-2 line-clamp-2"
          style={{ color: colors.textMain }}
        >
          {service.name}
        </h3>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-1.5">
            {hasDiscount && (
              <span
                className="text-[13px] line-through"
                style={{ color: colors.textSecondary }}
              >
                {service.price.toLocaleString('fa-IR')}
              </span>
            )}
            <span
              className="text-[15px] font-semibold"
              style={{ color: colors.primary }}
            >
              {finalPrice.toLocaleString('fa-IR')} تومان
            </span>
          </div>
        </div>
      </div>
    </button>
  );
}