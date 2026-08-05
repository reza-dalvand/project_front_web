'use client';
import Image from 'next/image';
import { FiChevronLeft, FiMapPin } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import SectionHeader from '@/components/common/SectionHeader';
import CollabBadge from '@/components/common/CollabBadge';
import SeeAllButton from './SeeAllButton';
import { MOCK_LINE_RENTALS } from './search/searchData';
import { useAuth } from '@/stores/useAuth';

export default function LineRentalSection() {
  const { colors } = useTheme();
  const { requireAuth } = useAuth();

  const handleSeeAll = () => {
    requireAuth(() => {
      // navigation to AllLineRentals
    });
  };

  const handleItemPress = (ad) => {
    requireAuth(() => {
      // navigation to LineRentalDetail
    });
  };

  return (
    <div className="mb-6">
      <SectionHeader
        icon={<span className="text-lg">🏢</span>}
        title="فرصت‌های همکاری"
        subtitle="با اجاره لاین، کسب‌وکار خود را گسترش دهید"
        iconColor="#667eea"
        rightElement={
          <SeeAllButton onPress={handleSeeAll} count={MOCK_LINE_RENTALS.length} />
        }
      />

      {/* اسکرول افقی */}
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {MOCK_LINE_RENTALS.map((ad) => (
          <button
            key={ad.id}
            onClick={() => handleItemPress(ad)}
            className="flex-shrink-0 w-[220px] rounded-2xl border overflow-hidden transition-all hover:shadow-md active:scale-[0.98] text-right"
            style={{
              backgroundColor: colors.cardBackground,
              borderColor: colors.border,
            }}
          >
            {/* تصویر */}
            <div className="relative w-full h-[130px]">
              <Image
                src={ad.lineImage}
                alt={ad.title}
                fill
                className="object-cover"
                sizes="220px"
              />
              {/* Badge نوع خدمت */}
              <div
                className="absolute top-2 left-2 flex items-center gap-1 px-2 py-1 rounded-lg"
                style={{ backgroundColor: ad.serviceTypeColor || '#607D8B' }}
              >
                <span className="text-[10px] font-[Vazir-Bold] text-white">
                  {ad.serviceTypeName}
                </span>
              </div>
            </div>

            {/* اطلاعات */}
            <div className="p-3 gap-2">
              <p
                className="text-[13px] font-[Vazir-Bold] leading-5 line-clamp-2 min-h-[40px]"
                style={{ color: colors.textMain }}
              >
                {ad.title}
              </p>
              <div className="flex items-center gap-1.5">
                <span className="text-xs">🏪</span>
                <span
                  className="text-[11px] font-[Vazir-Medium] truncate"
                  style={{ color: colors.primary }}
                >
                  {ad.businessName}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <FiMapPin size={11} color={colors.textSecondary} />
                  <span
                    className="text-[10px] font-[Vazir] truncate"
                    style={{ color: colors.textSecondary }}
                  >
                    {ad.city}
                  </span>
                </div>
                <CollabBadge
                  type={ad.collabType}
                  priceDisplay={ad.priceDisplay}
                  variant="compact"
                />
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}