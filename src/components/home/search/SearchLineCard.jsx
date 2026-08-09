'use client';

import Image from 'next/image';
import { FiMapPin } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import { Card, Badge } from '@/components/common';

const COLLAB_TYPE_META = {
  percent: { label: 'درصدی', color: '#9C27B0' },
  fixed: { label: 'اجاره ثابت', color: '#2196F3' },
  hourly: { label: 'ساعتی', color: '#FF9800' },
};

export default function SearchLineCard({ ad, onPress }) {
  const { colors } = useTheme();
  const collabMeta = COLLAB_TYPE_META[ad.collabType] || COLLAB_TYPE_META.percent;

  return (
    <Card variant="elevated" padding={0} radius={18}>
      <button onClick={() => onPress?.(ad)} className="w-full text-right">
        {/* تصویر */}
        <div className="relative w-full h-28">
          <Image src={ad.lineImage} alt={ad.title} fill className="object-cover rounded-t-2xl" />
          <div
            className="absolute bottom-0 left-0 right-0 h-10"
            style={{ backgroundColor: 'rgba(0,0,0,0.3)' }}
          />
          <Badge
            label={collabMeta.label}
            variant="primary"
            size="sm"
            className="absolute top-2 right-2"
          />
        </div>

        {/* اطلاعات */}
        <div className="p-3 gap-2">
          <h3
            className="text-sm font-[Vazir-Bold] line-clamp-2 min-h-[40px]"
            style={{ color: colors.textMain }}
          >
            {ad.title}
          </h3>
          <div className="flex items-center gap-1">
            <span className="text-xs">🏪</span>
            <span
              className="text-[11px] font-[Vazir-Medium] line-clamp-1"
              style={{ color: colors.primary }}
            >
              {ad.businessName}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <FiMapPin size={11} color={colors.textSecondary} />
            <span
              className="text-[10px] font-[Vazir] line-clamp-1"
              style={{ color: colors.textSecondary }}
            >
              {ad.city}
            </span>
          </div>
          <div className="text-xs font-[Vazir-Bold] mt-1" style={{ color: collabMeta.color }}>
            {ad.priceDisplay}
          </div>
        </div>
      </button>
    </Card>
  );
}
