'use client';

import { FiCalendar, FiBox, FiClock, FiImage, FiLink, FiUser, FiHome } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import { toPersianDigit } from '@/utils/numberUtils';

const QUICK_ACTIONS = [
  {
    id: 'appointments',
    label: 'نوبت‌ها',
    subtitle: 'مدیریت نوبت‌های سالن',
    icon: <FiCalendar size={26} />,
    route: '/manage/appointments',
    color: '#667eea',
  },
  {
    id: 'services',
    label: 'خدمات',
    subtitle: 'افزودن و ویرایش خدمات',
    icon: <FiBox size={26} />,
    route: '/manage/services',
    color: '#f093fb',
  },
  {
    id: 'schedule',
    label: 'زمان‌بندی',
    subtitle: 'تنظیم ساعات کاری',
    icon: <FiClock size={26} />,
    route: '/manage/schedule',
    color: '#43e97b',
  },
  {
    id: 'portfolio',
    label: 'نمونه‌کار',
    subtitle: 'گالری کارهای شما',
    icon: <FiImage size={26} />,
    route: '/manage/portfolio',
    color: '#fa709a',
  },
  {
    id: 'bookingLink',
    label: 'لینک رزرو',
    subtitle: 'لینک اختصاصی شبکه‌های اجتماعی',
    icon: <FiLink size={26} />,
    route: '/manage/booking-link',
    color: '#0088cc',
  },
  {
    id: 'modelRequests',
    label: 'درخواست مدل',
    subtitle: 'جذب مدل برای نمونه‌کار',
    icon: <FiUser size={26} />,
    route: '/manage/model-requests',
    color: '#FF9800',
  },
  {
    id: 'lineRental',
    label: 'اجاره لاین',
    subtitle: 'اجاره محیط و جذب متخصص',
    icon: <FiHome size={26} />,
    route: '/manage/line-rental',
    color: '#667eea',
  },
];

export default function QuickAccessGrid({ onNavigate, badge = 0 }) {
  const { colors } = useTheme();

  return (
    <div className="px-5 mt-7">
      <h2 className="text-base font-[Vazir-Bold] mb-4" style={{ color: colors.textMain }}>
        دسترسی سریع
      </h2>

      <div className="grid grid-cols-2 gap-3">
        {QUICK_ACTIONS.map((item, index) => {
          const showBadge = item.id === 'appointments' && badge > 0;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate?.(item.route)}
              className="flex flex-col items-center text-center gap-2 p-4 rounded-2xl border transition-all hover:scale-[1.02] active:scale-[0.98] min-h-[140px] relative"
              style={{
                backgroundColor: colors.cardBackground,
                borderColor: colors.border,
              }}
            >
              {/* Badge نوبت‌های فعال */}
              {showBadge && (
                <div
                  className="absolute -top-2 -right-2 min-w-[22px] h-[22px] rounded-full flex items-center justify-center px-1.5 border-2 text-[10px] font-[Vazir-Bold] text-white"
                  style={{
                    backgroundColor: '#E53935',
                    borderColor: colors.cardBackground,
                  }}
                >
                  {badge > 9 ? '۹+' : toPersianDigit(badge)}
                </div>
              )}

              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center"
                style={{ backgroundColor: item.color + '18' }}
              >
                <span style={{ color: item.color }}>{item.icon}</span>
              </div>

              <span className="text-sm font-[Vazir-Bold]" style={{ color: colors.textMain }}>
                {item.label}
              </span>
              <span
                className="text-[11px] font-[Vazir] leading-4 text-center"
                style={{ color: colors.textSecondary }}
              >
                {item.subtitle}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
