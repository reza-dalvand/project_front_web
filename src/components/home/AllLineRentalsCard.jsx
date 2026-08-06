'use client';
import Image from 'next/image';
import { FiMapPin } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import { Card, CollabBadge } from '@/components/common';

// متادیتای انواع خدمات برای Badge
const SERVICE_TYPE_META = {
  facial: { color: '#C2185B', icon: '💆‍♀️' },
  nail: { color: '#7B1FA2', icon: '💅' },
  hair_color: { color: '#0277BD', icon: '🎨' },
  keratin: { color: '#E65100', icon: '✨' },
  laser: { color: '#00838F', icon: '⚡' },
  makeup: { color: '#AD1457', icon: '💄' },
  eyelash: { color: '#4527A0', icon: '👁️' },
  waxing: { color: '#2E7D32', icon: '🧴' },
  massage: { color: '#558B2F', icon: '💆‍♀️' },
  tattoo: { color: '#D84315', icon: '✒️' },
  skincare: { color: '#00695C', icon: '🧖‍♀️' },
  hair_cut: { color: '#5D4037', icon: '✂️' },
  bridal: { color: '#880E4F', icon: '👰' },
  other: { color: '#455A64', icon: '💼' },
};

export default function AllLineRentalsCard({ ad, onPress }) {
  const { colors } = useTheme();
  const serviceMeta = SERVICE_TYPE_META[ad.serviceTypeId] || SERVICE_TYPE_META.other;

  return (
    <Card variant="elevated" padding={0} radius={20} className="mb-3.5 overflow-hidden">
      <button onClick={() => onPress?.(ad)} className="w-full text-right">
        {/* تصویر */}
        <div className="relative w-full h-[180px]">
          <Image
            src={ad.lineImage}
            alt={ad.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 600px"
          />
          <div
            className="absolute bottom-0 left-0 right-0 h-[70px]"
            style={{ backgroundColor: 'rgba(0,0,0,0.35)' }}
          />
          {/* Badge نوع خدمت */}
          <div
            className="absolute top-3 left-3 flex items-center gap-1 px-2.5 py-1.5 rounded-xl shadow-md"
            style={{ backgroundColor: serviceMeta.color }}
          >
            <span className="text-[10px]">{serviceMeta.icon}</span>
            <span className="text-[10px] font-[Vazir-Bold] text-white">{ad.serviceTypeName}</span>
          </div>
        </div>

        {/* محتوا */}
        <div className="p-4 space-y-2.5">
          {/* عنوان */}
          <h3
            className="text-base font-[Vazir-Bold] leading-6 line-clamp-2"
            style={{ color: colors.textMain }}
          >
            {ad.title}
          </h3>

          {/* نام کسب‌وکار */}
          <div className="flex items-center gap-1">
            <span className="text-xs">🏪</span>
            <span className="text-xs font-[Vazir-Medium]" style={{ color: colors.primary }}>
              {ad.businessName}
            </span>
          </div>

          {/* نوع همکاری */}
          <CollabBadge type={ad.collabType} priceDisplay={ad.priceDisplay} variant="solid" />

          {/* شهر */}
          <div className="flex items-center gap-1">
            <FiMapPin size={12} color={colors.textSecondary} />
            <span className="text-[11px]" style={{ color: colors.textSecondary }}>
              {ad.city}
            </span>
          </div>

          {/* دکمه جزئیات */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPress?.(ad);
            }}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl
              transition-all hover:opacity-90 active:scale-[0.99] shadow-md"
            style={{ backgroundColor: '#667eea' }}
          >
            <span className="text-sm">📋</span>
            <span className="text-sm font-[Vazir-Bold] text-white flex-1 text-center">
              مشاهده جزئیات و تماس
            </span>
            <span className="text-sm text-white">←</span>
          </button>
        </div>
      </button>
    </Card>
  );
}
