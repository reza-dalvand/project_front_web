'use client';
import Image from 'next/image';
import { FiChevronLeft, FiMapPin } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import SectionHeader from '@/components/common/SectionHeader';
import CostTypeBadge from '@/components/common/CostTypeBadge';
import SeeAllButton from './SeeAllButton';
import { MOCK_MODEL_REQUESTS } from './search/searchData';
import { useAuth } from '@/stores/useAuth';

export default function ModelRequestsSection() {
  const { colors } = useTheme();
  const { requireAuth } = useAuth();

  const handleSeeAll = () => {
    requireAuth(() => {
      // navigation to AllModelRequests
    });
  };

  const handleItemPress = (request) => {
    requireAuth(() => {
      // navigation to ModelRequestDetail
    });
  };

  return (
    <div className="mb-6">
      <SectionHeader
        icon={<span className="text-lg">👤</span>}
        title="فرصت‌های مدلینگ"
        subtitle="با تخفیف ویژه مدل شوید و نمونه‌کار بسازید"
        iconColor="#E91E63"
        rightElement={
          <SeeAllButton onPress={handleSeeAll} count={MOCK_MODEL_REQUESTS.length} />
        }
      />

      {/* اسکرول افقی */}
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {MOCK_MODEL_REQUESTS.map((request) => (
          <button
            key={request.id}
            onClick={() => handleItemPress(request)}
            className="flex-shrink-0 w-[220px] rounded-2xl border overflow-hidden transition-all hover:shadow-md active:scale-[0.98] text-right"
            style={{
              backgroundColor: colors.cardBackground,
              borderColor: colors.border,
            }}
          >
            {/* تصویر */}
            <div className="relative w-full h-[130px]">
              <Image
                src={request.serviceImage}
                alt={request.title}
                fill
                className="object-cover"
                sizes="220px"
              />
              {/* Badge تخفیف */}
              {request.discount > 0 && (
                <div
                  className="absolute top-2 left-2 flex items-center gap-1 px-2 py-1 rounded-lg"
                  style={{ backgroundColor: '#E53935' }}
                >
                  <span className="text-[10px] font-[Vazir-Bold] text-white">
                    {request.discount}٪
                  </span>
                </div>
              )}
              {/* Badge فوری */}
              {request.isUrgent && (
                <div
                  className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 rounded-lg"
                  style={{ backgroundColor: 'rgba(255,152,0,0.9)' }}
                >
                  <span className="text-[10px] font-[Vazir-Bold] text-white">فوری</span>
                </div>
              )}
            </div>

            {/* اطلاعات */}
            <div className="p-3 gap-2">
              <p
                className="text-[13px] font-[Vazir-Bold] leading-5 line-clamp-2 min-h-[40px]"
                style={{ color: colors.textMain }}
              >
                {request.title}
              </p>
              <div className="flex items-center gap-1.5">
                <span className="text-xs">🏪</span>
                <span
                  className="text-[11px] font-[Vazir-Medium] truncate"
                  style={{ color: colors.primary }}
                >
                  {request.businessName}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <FiMapPin size={11} color={colors.textSecondary} />
                  <span
                    className="text-[10px] font-[Vazir] truncate"
                    style={{ color: colors.textSecondary }}
                  >
                    {request.city}
                  </span>
                </div>
                <CostTypeBadge type={request.costType} variant="compact" />
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}