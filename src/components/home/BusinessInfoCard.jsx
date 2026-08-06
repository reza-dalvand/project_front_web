'use client';

import Image from 'next/image';
import { FiMapPin, FiStar } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import { Card } from '@/components/common';
import StatsCard from '@/components/common/StatsCard';
import { toPersianDigit } from '@/utils/numberUtils';

export default function BusinessInfoCard({ business }) {
  const { colors } = useTheme();
  const memberSince = business.memberSince || '۲ سال';

  return (
    <div className="px-5 pt-5 pb-4">
      {/* لوگو و Badge */}
      <div className="flex items-center gap-3 mb-3">
        <div
          className="relative w-[92px] h-[92px] rounded-[26px] overflow-hidden -mt-[70px] shadow-lg"
          style={{ border: `4px solid ${colors.background}` }}
        >
          <Image
            src={business.logo}
            alt={business.name}
            fill
            className="object-cover"
            sizes="92px"
          />
        </div>
      </div>

      {/* نام کسب‌وکار */}
      <h1
        className="text-[22px] font-[Vazir-Bold] leading-[30px] mb-2 mt-[4%]"
        style={{ color: colors.textMain }}
      >
        {business.name}
      </h1>

      {/* نام مدیر */}
      {business.ownerName && (
        <div className="flex items-center gap-2 mb-2">
          <div
            className="w-[26px] h-[26px] rounded-lg flex items-center justify-center"
            style={{ backgroundColor: colors.primary + '15' }}
          >
            <span className="text-sm">👤</span>
          </div>
          <span className="text-xs" style={{ color: colors.textSecondary }}>
            مدیریت:
          </span>
          <span className="text-sm font-[Vazir-Bold]" style={{ color: colors.textMain }}>
            {business.ownerName}
          </span>
          {business.ownerVerified && (
            <div
              className="flex items-center gap-1 px-2 py-0.5 rounded-md"
              style={{ backgroundColor: '#4CAF5020' }}
            >
              <span className="text-[10px]">✓</span>
              <span className="text-[9px] font-[Vazir-Bold]" style={{ color: '#4CAF50' }}>
                تایید شده
              </span>
            </div>
          )}
        </div>
      )}

      {/* دسته‌بندی و شهر */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-base">💆‍♀️</span>
        <span className="text-sm font-[Vazir-Medium]" style={{ color: colors.primary }}>
          {business.category}
        </span>
        <div className="w-1 h-1 rounded-full mx-0.5" style={{ backgroundColor: colors.border }} />
        <FiMapPin size={16} style={{ color: colors.textSecondary }} />
        <span className="text-sm" style={{ color: colors.textSecondary }}>
          {business.city}
        </span>
      </div>

      {/* کارت آمار */}
      <Card variant="elevated" padding={16} radius={20} className="mt-2">
        <div className="flex items-center">
          <StatsCard
            icon="⭐"
            label="امتیاز"
            value={toPersianDigit(business.rating)}
            subtitle={`${toPersianDigit(business.reviewsCount)} نظر`}
            color="#FFC107"
            variant="compact"
          />
          <div className="w-px h-[50px] mx-2" style={{ backgroundColor: colors.border }} />
          <StatsCard
            icon="💆‍♀️"
            label="خدمات"
            value={toPersianDigit(business.servicesCount || 0)}
            subtitle="فعال"
            color="#4CAF50"
            variant="compact"
          />
          <div className="w-px h-[50px] mx-2" style={{ backgroundColor: colors.border }} />
          <StatsCard
            icon="🏆"
            label="عضویت"
            value={memberSince}
            subtitle="در زیبانو"
            color="#2196F3"
            variant="compact"
          />
        </div>
      </Card>
    </div>
  );
}
