'use client';

import { FiCalendar } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import { Card } from '@/components/common';
import { formatPrice } from '@/utils/numberUtils';
import ServiceTypeIcon from '@/components/manageBusiness/services/ServiceTypeIcon';

export default function ServiceBookingCard({ service, onBook }) {
  const { colors } = useTheme();
  const hasDiscount = service.discount > 0;

  return (
    <Card variant="elevated" padding={0} radius={20} className="overflow-hidden">
      <div className="flex p-3.5 gap-3.5">
        {/* آیکون خدمت */}
        <div className="relative flex-shrink-0">
          <ServiceTypeIcon typeId={service.typeId} size={80} />
          {hasDiscount && (
            <div
              className="absolute top-1 left-1 flex items-center gap-0.5
                         px-1.5 py-0.5 rounded-lg shadow-sm"
              style={{ backgroundColor: '#E53935' }}
            >
              <span className="text-[9px]">🏷️</span>
              <span className="text-[10px] font-[Vazir-Bold] text-white">{service.discount}٪</span>
            </div>
          )}
        </div>

        {/* اطلاعات خدمت */}
        <div className="flex-1 flex flex-col gap-1.5 min-w-0">
          <h3
            className="text-sm font-[Vazir-Bold] leading-[20px] line-clamp-2"
            style={{ color: colors.textMain }}
          >
            {service.name}
          </h3>

          {/* قیمت و دکمه رزرو */}
          <div className="flex items-center justify-between mt-auto">
            <div className="flex flex-col gap-0.5 flex-1">
              {hasDiscount && (
                <span className="text-[11px] line-through" style={{ color: colors.textSecondary }}>
                  {formatPrice(service.originalPrice)}
                </span>
              )}
              <span className="text-sm font-[Vazir-Bold]" style={{ color: colors.primary }}>
                {formatPrice(service.price)}
              </span>
            </div>

            <button
              onClick={() => onBook(service)}
              className="flex items-center gap-1 px-3.5 py-2 rounded-xl
                         shadow-md transition-all hover:shadow-lg active:scale-95"
              style={{ backgroundColor: '#43A047' }}
            >
              <FiCalendar size={14} color="#fff" />
              <span className="text-sm font-[Vazir-Bold] text-white">رزرو</span>
            </button>
          </div>
        </div>
      </div>
    </Card>
  );
}
