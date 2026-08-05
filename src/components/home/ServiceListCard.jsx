'use client';
import Image from 'next/image';
import { FiCalendar } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import ServiceTypeIcon from '@/components/manageBusiness/services/ServiceTypeIcon';
import { toPersianDigit, formatPrice } from '@/utils/numberUtils';

export default function ServiceListCard({ service, onPress, onBook }) {
  const { colors } = useTheme();
  const hasDiscount = service.discount > 0;
  const finalPrice = hasDiscount
    ? service.price * (1 - service.discount / 100)
    : service.price;

  return (
    <button
      onClick={() => onPress?.(service)}
      className="w-full rounded-2xl border overflow-hidden transition-all hover:shadow-md active:scale-[0.98] text-right"
      style={{
        backgroundColor: colors.cardBackground,
        borderColor: colors.border,
      }}
    >
      {/* تصویر */}
      {service.image && (
        <div className="relative w-full h-[140px]">
          <Image
            src={service.image}
            alt={service.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 500px"
          />
          {hasDiscount && (
            <div
              className="absolute top-3 left-3 flex items-center gap-1 px-2 py-1 rounded-lg"
              style={{ backgroundColor: '#E53935' }}
            >
              <span className="text-[10px] font-[Vazir-Bold] text-white">
                {toPersianDigit(service.discount)}٪
              </span>
            </div>
          )}
        </div>
      )}

      {/* اطلاعات */}
      <div className="p-3.5 gap-2">
        <div className="flex items-center gap-3">
          <ServiceTypeIcon typeId={service.typeId} size={48} />
          <div className="flex-1 min-w-0">
            <p
              className="text-sm font-[Vazir-Bold] truncate"
              style={{ color: colors.textMain }}
            >
              {service.name}
            </p>
            <p
              className="text-[11px] font-[Vazir] mt-0.5"
              style={{ color: colors.textSecondary }}
            >
              {service.businessName}
            </p>
          </div>
        </div>

        {/* قیمت و دکمه رزرو */}
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-2">
            {hasDiscount && (
              <span
                className="text-[11px] font-[Vazir] line-through"
                style={{ color: colors.textSecondary }}
              >
                {formatPrice(service.price)}
              </span>
            )}
            <span
              className="text-sm font-[Vazir-Bold]"
              style={{ color: colors.primary }}
            >
              {formatPrice(finalPrice)}
            </span>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onBook?.(service);
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl"
            style={{ backgroundColor: '#43A047' }}
          >
            <FiCalendar size={14} color="#fff" />
            <span className="text-xs font-[Vazir-Bold] text-white">رزرو</span>
          </button>
        </div>
      </div>
    </button>
  );
}