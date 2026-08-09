'use client';
import Image from 'next/image';
import { FiMapPin, FiClock, FiChevronLeft } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import { Card } from '@/components/common';
import CostTypeBadge from '@/components/common/CostTypeBadge';

export default function AllModelRequestsCard({ request, onPress }) {
  const { colors } = useTheme();

  return (
    <Card variant="elevated" padding={0} radius={20}>
      <button onClick={() => onPress?.(request)} className="w-full text-right">
        {/* تصویر */}
        <div className="relative w-full h-[180px]">
          <Image
            src={request.serviceImage}
            alt={request.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 600px"
          />
          <div
            className="absolute bottom-0 left-0 right-0 h-[70px]"
            style={{ backgroundColor: 'rgba(0,0,0,0.35)' }}
          />
          {/* Badge نوع هزینه */}
          <div className="absolute top-3 left-3">
            <CostTypeBadge type={request.costType} variant="solid" />
          </div>
        </div>

        {/* محتوا */}
        <div className="p-4 space-y-2.5">
          <h3
            className="text-base font-[Vazir-Bold] leading-[23px] line-clamp-2"
            style={{ color: colors.textMain }}
          >
            {request.title}
          </h3>

          {/* نام کسب‌وکار */}
          <div className="flex items-center gap-1.5">
            <span className="text-sm">🏪</span>
            <span
              className="text-xs font-[Vazir-Medium] line-clamp-1"
              style={{ color: colors.primary }}
            >
              {request.businessName}
            </span>
          </div>

          {/* متا */}
          <div className="flex gap-2 mt-1">
            <div
              className="flex-1 flex items-center gap-1.5 px-2.5 py-2 rounded-xl"
              style={{ backgroundColor: colors.background }}
            >
              <FiMapPin size={12} color="#E53935" />
              <span
                className="text-[11px] font-[Vazir] line-clamp-1 flex-1"
                style={{ color: colors.textSecondary }}
              >
                {request.city}
              </span>
            </div>
            <div
              className="flex-1 flex items-center gap-1.5 px-2.5 py-2 rounded-xl"
              style={{ backgroundColor: colors.background }}
            >
              <FiClock size={12} color="#2196F3" />
              <span
                className="text-[11px] font-[Vazir] line-clamp-1 flex-1"
                style={{ color: colors.textSecondary }}
              >
                {request.serviceName}
              </span>
            </div>
          </div>

          {/* دکمه جزئیات */}
          <div
            className="flex items-center justify-center gap-2 py-3.5 rounded-2xl mt-1.5
              shadow-md"
            style={{ backgroundColor: '#E91E63' }}
          >
            <span className="text-sm">📋</span>
            <span className="text-sm font-[Vazir-Bold] text-white text-center">
              مشاهده جزئیات و تماس
            </span>
            <FiChevronLeft size={16} color="#fff" />
          </div>
        </div>
      </button>
    </Card>
  );
}
