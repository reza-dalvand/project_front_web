'use client';
import Image from 'next/image';
import { FiCalendar, FiMapPin, FiChevronLeft } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import { Card } from '@/components/common';

export default function AllAdsCard({ ad, onPress }) {
  const { colors } = useTheme();

  return (
    <Card variant="elevated" padding={0} radius={20}>
      <button onClick={() => onPress?.(ad)} className="w-full text-right">
        {/* تصویر */}
        <div className="relative w-full h-[200px]">
          <Image
            src={ad.imageUrl}
            alt={ad.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 600px"
          />
          <div
            className="absolute bottom-0 left-0 right-0 h-[80px]"
            style={{ backgroundColor: 'rgba(0,0,0,0.25)' }}
          />
          {/* Badge */}
          {ad.badge && (
            <div
              className="absolute top-3.5 left-3.5 flex items-center gap-1 px-2.5 py-1.5 rounded-xl shadow-md"
              style={{ backgroundColor: '#E53935' }}
            >
              <span className="text-[11px] font-[Vazir-Bold] text-white">{ad.badge}</span>
            </div>
          )}
        </div>

        {/* محتوا */}
        <div className="p-4 space-y-2.5">
          <h3
            className="text-base font-[Vazir-Bold] leading-[23px] line-clamp-2"
            style={{ color: colors.textMain }}
          >
            {ad.title}
          </h3>
          {ad.subtitle && (
            <p
              className="text-[13px] font-[Vazir] leading-[19px] line-clamp-1"
              style={{ color: colors.textSecondary }}
            >
              {ad.subtitle}
            </p>
          )}

          {/* متا */}
          <div className="flex gap-2 mt-1">
            <div
              className="flex-1 flex items-center gap-1.5 px-2.5 py-2 rounded-xl"
              style={{ backgroundColor: colors.background }}
            >
              <span className="text-sm">🏪</span>
              <span
                className="text-[11px] font-[Vazir] line-clamp-1 flex-1"
                style={{ color: colors.textSecondary }}
              >
                {ad.businessName || 'سالن زیبایی'}
              </span>
            </div>
            <div
              className="flex-1 flex items-center gap-1.5 px-2.5 py-2 rounded-xl"
              style={{ backgroundColor: colors.background }}
            >
              <FiMapPin size={13} color="#E53935" />
              <span
                className="text-[11px] font-[Vazir] line-clamp-1 flex-1"
                style={{ color: colors.textSecondary }}
              >
                {ad.city || 'تهران'}
              </span>
            </div>
          </div>

          {/* دکمه رزرو */}
          <div
            className="flex items-center justify-center gap-2 py-3.5 rounded-2xl mt-1.5
              shadow-md"
            style={{ backgroundColor: '#43A047' }}
          >
            <FiCalendar size={16} color="#fff" />
            <span className="text-sm font-[Vazir-Bold] text-white text-center">
              رزرو نوبت با تخفیف ویژه
            </span>
            <FiChevronLeft size={16} color="#fff" />
          </div>
        </div>
      </button>
    </Card>
  );
}
