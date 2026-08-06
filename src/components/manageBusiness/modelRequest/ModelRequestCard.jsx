'use client';
import Image from 'next/image';
import { FiChevronLeft } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import CostTypeBadge from '@/components/common/CostTypeBadge';
import Badge from '@/components/common/Badge';

export default function ModelRequestCard({ request, onPress }) {
  const { colors } = useTheme();

  const statusConfig = {
    active: { label: 'فعال', variant: 'success' },
    inactive: { label: 'غیرفعال', variant: 'error' },
  };
  const currentStatus = statusConfig[request.status] || statusConfig.inactive;

  return (
    <button
      onClick={() => onPress?.(request)}
      className="w-full flex items-center gap-3 p-3 rounded-2xl border mb-2.5
        transition-all hover:scale-[1.01] active:scale-[0.99] text-right"
      style={{
        backgroundColor: colors.cardBackground,
        borderColor: colors.border,
      }}
    >
      {/* Thumbnail خدمت */}
      {request.serviceImage ? (
        <div className="relative w-14 h-14 rounded-xl overflow-hidden flex-shrink-0">
          <Image
            src={request.serviceImage}
            alt={request.title}
            fill
            className="object-cover"
            sizes="56px"
          />
        </div>
      ) : (
        <div
          className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: colors.background }}
        >
          <span className="text-xl">🖼️</span>
        </div>
      )}

      {/* محتوا */}
      <div className="flex-1 min-w-0 gap-1.5">
        <h4 className="text-sm font-[Vazir-Bold] line-clamp-1" style={{ color: colors.textMain }}>
          {request.title}
        </h4>
        <div className="flex items-center gap-2">
          <CostTypeBadge type={request.costType} variant="compact" />
          <div className="flex-1" />
          <Badge label={currentStatus.label} variant={currentStatus.variant} size="sm" />
        </div>
      </div>

      {/* فلش */}
      <FiChevronLeft size={20} style={{ color: colors.textSecondary }} />
    </button>
  );
}
