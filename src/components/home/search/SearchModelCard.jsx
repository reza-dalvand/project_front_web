'use client';

import Image from 'next/image';
import { FiMapPin, FiTag } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import { Card, Badge } from '@/components/common';
import { toPersianDigit } from '@/utils/numberUtils';

const COST_TYPE_META = {
  paid: { label: 'با هزینه', color: '#2196F3' },
  material_cost: { label: 'هزینه مواد', color: '#FF9800' },
  free: { label: 'رایگان', color: '#4CAF50' },
};

export default function SearchModelCard({ request, onPress }) {
  const { colors } = useTheme();
  const costMeta = COST_TYPE_META[request.costType] || COST_TYPE_META.material_cost;

  return (
    <Card variant="elevated" padding={0} radius={18}>
      <button onClick={() => onPress?.(request)} className="w-full text-right">
        {/* تصویر */}
        <div className="relative w-full h-32">
          <Image
            src={request.serviceImage}
            alt={request.title}
            fill
            className="object-cover rounded-t-2xl"
          />
          <div
            className="absolute bottom-0 left-0 right-0 h-12"
            style={{ backgroundColor: 'rgba(0,0,0,0.3)' }}
          />
          <Badge
            label={costMeta.label}
            variant={request.costType === 'free' ? 'success' : 'warning'}
            size="sm"
            className="absolute top-2 left-2"
          />
        </div>

        {/* اطلاعات */}
        <div className="p-3 gap-2">
          <h3
            className="text-sm font-[Vazir-Bold] line-clamp-2 min-h-[40px]"
            style={{ color: colors.textMain }}
          >
            {request.title}
          </h3>
          <div className="flex items-center gap-1">
            <span className="text-xs">🏪</span>
            <span
              className="text-[11px] font-[Vazir-Medium] line-clamp-1"
              style={{ color: colors.primary }}
            >
              {request.businessName}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <FiMapPin size={11} color={colors.textSecondary} />
            <span
              className="text-[10px] font-[Vazir] line-clamp-1"
              style={{ color: colors.textSecondary }}
            >
              {request.city}
            </span>
          </div>
          {request.discount > 0 && (
            <div
              className="flex items-center gap-1 mt-1"
              style={{ color: '#E53935' }}
            >
              <FiTag size={11} />
              <span className="text-[10px] font-[Vazir-Bold]">
                {toPersianDigit(request.discount)}٪ تخفیف
              </span>
            </div>
          )}
        </div>
      </button>
    </Card>
  );
}