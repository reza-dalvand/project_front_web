'use client';
import {
  FiCalendar,
  FiBox,
  FiClock,
  FiImage,
  FiLink,
  FiUser,
  FiHome,
} from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import { toPersianDigit } from '@/utils/numberUtils';

const QUICK_ACTIONS = [
  {
    id: 'appointments',
    label: 'نوبت‌ها',
    icon: <FiCalendar size={22} />,
    route: '/manage/appointments',
    color: '#667eea',
  },
  {
    id: 'services',
    label: 'خدمات',
    icon: <FiBox size={22} />,
    route: '/manage/services',
    color: '#f093fb',
  },
  {
    id: 'schedule',
    label: 'زمان‌بندی',
    icon: <FiClock size={22} />,
    route: '/manage/schedule',
    color: '#43e97b',
  },
  {
    id: 'portfolio',
    label: 'نمونه‌کار',
    icon: <FiImage size={22} />,
    route: '/manage/portfolio',
    color: '#fa709a',
  },
  {
    id: 'bookingLink',
    label: 'لینک رزرو',
    icon: <FiLink size={22} />,
    route: '/manage/booking-link',
    color: '#0088cc',
  },
  {
    id: 'modelRequests',
    label: 'درخواست مدل',
    icon: <FiUser size={22} />,
    route: '/manage/model-requests',
    color: '#FF9800',
  },
  {
    id: 'lineRental',
    label: 'اجاره لاین',
    icon: <FiHome size={22} />,
    route: '/manage/line-rental',
    color: '#667eea',
  },
];

export default function QuickAccessGrid({ onNavigate, badge = 0 }) {
  const { colors } = useTheme();

  return (
    <div className="px-5 mt-5">
      <h2
        className="text-base font-[Vazir-Bold] mb-3"
        style={{ color: colors.textMain }}
      >
        دسترسی سریع
      </h2>

      {/* ✅ grid-cols-3 به جای grid-cols-2 */}
      <div className="grid grid-cols-3 gap-2.5">
        {QUICK_ACTIONS.map((item) => {
          const showBadge = item.id === 'appointments' && badge > 0;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate?.(item.route)}
              className="relative flex flex-col items-center justify-center gap-1.5
                py-3.5 px-2 rounded-2xl border transition-all
                hover:scale-[1.03] active:scale-[0.97]"
              style={{
                backgroundColor: colors.cardBackground,
                borderColor: colors.border,
              }}
            >
              {/* Badge */}
              {showBadge && (
                <div
                  className="absolute -top-1.5 -left-1.5 min-w-[20px] h-[20px] rounded-full
                    flex items-center justify-center px-1 border-2
                    text-[9px] font-[Vazir-Bold] text-white"
                  style={{
                    backgroundColor: '#E53935',
                    borderColor: colors.cardBackground,
                  }}
                >
                  {badge > 9 ? '۹+' : toPersianDigit(badge)}
                </div>
              )}

              {/* آیکون */}
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: item.color + '18' }}
              >
                <span style={{ color: item.color }}>{item.icon}</span>
              </div>

              {/* لیبل */}
              <span
                className="text-[11px] font-[Vazir-Bold] text-center leading-4"
                style={{ color: colors.textMain }}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}