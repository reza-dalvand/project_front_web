'use client';

import Image from 'next/image';
import { FiImage } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';

export default function PortfolioGrid({ portfolios, onPortfolioPress }) {
  const { colors } = useTheme();

  if (!portfolios || portfolios.length === 0) {
    return (
      <div
        className="p-6 rounded-2xl flex flex-col items-center gap-3"
        style={{ backgroundColor: colors.cardBackground }}
      >
        <FiImage size={48} style={{ color: colors.textSecondary + '60' }} />
        <span className="text-sm" style={{ color: colors.textSecondary }}>
          هنوز نمونه‌کاری ثبت نشده است
        </span>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-base font-[Vazir-Bold] mb-3" style={{ color: colors.textMain }}>
        گالری نمونه‌کارها
      </h2>

      {/* Grid دو ستونه */}
      <div className="grid grid-cols-2 gap-3">
        {portfolios.map((portfolio, index) => {
          const imageCount = portfolio.images?.length || 1;
          return (
            <button
              key={portfolio.id || index}
              onClick={() => onPortfolioPress(portfolio, index)}
              className="relative w-full aspect-square rounded-2xl overflow-hidden
                         shadow-sm transition-transform hover:scale-[1.02] active:scale-[0.98]"
              style={{ backgroundColor: '#eee' }}
            >
              <Image
                src={portfolio.coverImage || portfolio.images?.[0]}
                alt={portfolio.title || 'portfolio'}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 50vw, 300px"
              />

              {/* گرادیان پایین */}
              <div
                className="absolute bottom-0 left-0 right-0 h-[50%]"
                style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}
              />

              {/* Badge تعداد تصاویر */}
              {imageCount > 1 && (
                <div
                  className="absolute top-2 right-2 flex items-center gap-1
                             px-2 py-1 rounded-lg"
                  style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
                >
                  <span className="text-[10px] text-white">🖼️</span>
                  <span className="text-[10px] font-[Vazir-Bold] text-white">{imageCount}</span>
                </div>
              )}

              {/* عنوان نمونه‌کار روی تصویر */}
              {portfolio.title && (
                <div className="absolute bottom-0 left-0 right-0 px-2.5 py-2.5">
                  <p className="text-xs font-[Vazir-Bold] text-white leading-[17px] line-clamp-2">
                    {portfolio.title}
                  </p>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
