'use client';
import { FiEdit2, FiTrash2, FiClock } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import ServiceTypeIcon from './ServiceTypeIcon';
import { toPersianDigit, formatPrice } from '@/utils/numberUtils';

export default function ServiceCard({ service, onEdit, onToggle, onDelete }) {
  const { colors } = useTheme();
  const isActive = service.isActive !== false;
  const hasDiscount = service.discountPercent > 0;

  const handleDelete = () => {
    if (confirm(`آیا از حذف "${service.name}" مطمئن هستید؟`)) {
      onDelete?.(service.id);
    }
  };

  return (
    <div
      className="rounded-2xl border p-4 cursor-pointer transition-all hover:shadow-md"
      style={{
        backgroundColor: colors.cardBackground,
        borderColor: isActive ? colors.border : colors.border + '60',
        opacity: isActive ? 1 : 0.7,
      }}
      onClick={() => onEdit?.(service)}
    >
      {/* ردیف بالا */}
      <div className="flex items-start gap-3">
        <ServiceTypeIcon typeId={service.typeId} size={56} />
        <div className="flex-1 gap-1">
          <p
            className="text-base font-[Vazir-Bold] line-clamp-1"
            style={{ color: colors.textMain }}
          >
            {service.name}
          </p>
          <p className="text-xs font-[Vazir-Medium]" style={{ color: colors.textSecondary }}>
            {service.typeName}
          </p>
          <div className="flex items-center gap-1 mt-1">
            <FiClock size={12} style={{ color: colors.textSecondary }} />
            <span className="text-[11px]" style={{ color: colors.textSecondary }}>
              {toPersianDigit(service.duration || 60)} دقیقه هر نوبت
            </span>
          </div>
        </div>
        {/* Switch */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggle?.(service.id);
          }}
          className="relative w-11 h-6 rounded-full transition-colors flex-shrink-0"
          style={{ backgroundColor: isActive ? colors.primary + '55' : colors.border }}
        >
          <div
            className="absolute top-0.5 w-5 h-5 rounded-full shadow-md transition-all"
            style={{
              backgroundColor: isActive ? colors.primary : '#ccc',
              [isActive ? 'right' : 'left']: '2px',
            }}
          />
        </button>
      </div>

      {/* خط جداکننده */}
      <div className="h-px my-3" style={{ backgroundColor: colors.border }} />

      {/* قیمت‌ها */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex-1 gap-1">
          {hasDiscount && (
            <p className="text-[11px] line-through" style={{ color: colors.textSecondary }}>
              {formatPrice(service.originalPrice)}
            </p>
          )}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-lg font-[Vazir-Bold]" style={{ color: colors.primary }}>
              {formatPrice(hasDiscount ? service.finalPrice : service.originalPrice)}
            </span>
            {hasDiscount && (
              <span
                className="text-[10px] font-[Vazir-Bold] px-2 py-0.5 rounded-md"
                style={{ backgroundColor: '#43A04720', color: '#43A047' }}
              >
                {toPersianDigit(service.discountPercent)}٪
              </span>
            )}
          </div>
        </div>
        {/* دکمه‌ها */}
        <div className="flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit?.(service);
            }}
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: colors.primary + '15' }}
          >
            <FiEdit2 size={18} style={{ color: colors.primary }} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDelete();
            }}
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: '#E5393515' }}
          >
            <FiTrash2 size={18} color="#E53935" />
          </button>
        </div>
      </div>

      {/* بیعانه */}
      {service.hasDeposit && service.depositAmount > 0 && (
        <div
          className="flex items-center gap-2 mt-3 pt-3 border-t"
          style={{ borderTopColor: colors.border }}
        >
          <span className="text-sm">💰</span>
          <span className="text-[11px]" style={{ color: colors.textSecondary }}>
            بیعانه رزرو:
          </span>
          <span className="text-xs font-[Vazir-Bold] mr-auto" style={{ color: '#1ba609' }}>
            {formatPrice(service.depositAmount)}
          </span>
        </div>
      )}

      {/* راهنما */}
      <div
        className="flex items-center gap-2 mt-3 pt-3 border-t"
        style={{ borderTopColor: colors.border }}
      >
        <span className="text-[10px]" style={{ color: colors.textSecondary }}>
          👆
        </span>
        <span className="text-[10px] flex-1" style={{ color: colors.textSecondary }}>
          برای ویرایش کامل، روی کارت کلیک کنید
        </span>
      </div>
    </div>
  );
}
