'use client';
import Image from 'next/image';
import { useTheme } from '@/stores/useThemeStore';

/**
 * گرید افقی نمونه‌کارها
 *
 * @param {Array} portfolios - آرایه نمونه‌کارها
 * @param {function} onImagePress - تابع کلیک روی تصویر
 */
export default function PortfolioGrid({ portfolios, onImagePress }) {
  return (
    <div className="flex gap-2 overflow-x-auto px-4 pb-2 scrollbar-hide">
      {portfolios.map((item, index) => (
        <button
          key={item.id || index}
          onClick={() => onImagePress?.(item, index)}
          className="flex-shrink-0 w-[120px] h-[120px] rounded-lg overflow-hidden
            transition-transform hover:scale-105 active:scale-95"
        >
          <Image
            src={item.image}
            alt={item.title || `portfolio-${index}`}
            width={120}
            height={120}
            className="object-cover w-full h-full"
            sizes="120px"
          />
        </button>
      ))}
    </div>
  );
}
