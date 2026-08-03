'use client';

import { FiPhone, FiMapPin, FiClock, FiInfo } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import { Card } from '@/components/common';
import InfoRow from '@/components/common/InfoRow';
import ActionButtons from '@/components/common/ActionButtons';
import { toPersianDigit } from '@/utils/numberUtils';
import { cleanPhone } from '@/utils/phoneUtils';

export default function BusinessAbout({ business }) {
  const { colors } = useTheme();

  return (
    <div className="flex flex-col gap-3">
      {/* درباره کسب‌وکار */}
      <Card variant="elevated" padding={20} radius={20}>
        <div className="flex items-center gap-2 mb-3">
          <FiInfo size={22} style={{ color: colors.primary }} />
          <h3
            className="text-base font-[Vazir-Bold]"
            style={{ color: colors.textMain }}
          >
            درباره کسب‌وکار
          </h3>
        </div>
        <p
          className="text-sm leading-6 text-justify"
          style={{ color: colors.textSecondary }}
        >
          {business.about}
        </p>
      </Card>

      {/* دکمه‌های تماس و اشتراک‌گذاری */}
      <ActionButtons
        phone={cleanPhone(business.phone)}
        shareMessage={`🌸 ${business.name}\n📍 ${business.address}`}
      />

      {/* اطلاعات تکمیلی */}
      <Card variant="elevated" padding={16} radius={16}>
        <InfoRow
          icon="📍"
          iconColor="#E53935"
          label="آدرس"
          value={business.address}
          showDivider
        />
        <InfoRow
          icon="📞"
          iconColor="#4CAF50"
          label="تلفن تماس"
          value={toPersianDigit(business.phone)}
          showDivider
          monospace
        />
        <InfoRow
          icon="🕐"
          iconColor="#2196F3"
          label="ساعات کاری"
          value={business.workingHours}
        />
      </Card>
    </div>
  );
}