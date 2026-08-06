'use client';
import { FiEdit } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import Card from '@/components/common/Card';
import { formatPrice } from '@/utils/numberUtils';

export default function ServiceManagerCard({ service, onToggle, onEdit }) {
  const { colors } = useTheme();

  return (
    <Card variant="elevated" padding={14} radius={14}>
      <div className="flex items-center gap-3">
        {/* Switch */}
        <button
          onClick={() => onToggle?.(service.id)}
          className="relative w-11 h-6 rounded-full transition-colors flex-shrink-0"
          style={{ backgroundColor: service.active ? colors.primary + '55' : colors.border }}
        >
          <div
            className="absolute top-0.5 w-5 h-5 rounded-full shadow-md transition-all"
            style={{
              backgroundColor: service.active ? colors.primary : '#ccc',
              [service.active ? 'right' : 'left']: '2px',
            }}
          />
        </button>

        {/* اطلاعات خدمت */}
        <div className="flex-1 text-right">
          <p className="text-sm font-[Vazir-Medium] mb-0.5" style={{ color: colors.textMain }}>
            {service.name}
          </p>
          <p className="text-[13px]" style={{ color: colors.primary }}>
            {formatPrice(service.price)}
          </p>
        </div>

        {/* دکمه ویرایش */}
        <button onClick={() => onEdit?.(service)}>
          <FiEdit size={20} color={colors.textSecondary} />
        </button>
      </div>
    </Card>
  );
}
