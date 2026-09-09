'use client';

import {
  FiHome,
  FiSearch,
  FiBriefcase,
  FiPlusSquare,
  FiUser,
  FiLogIn,
} from 'react-icons/fi';
import { GiNails } from 'react-icons/gi';


import { usePathname, useRouter } from 'next/navigation';

import { useTheme } from '@/stores/useThemeStore';
import { useAuth } from '@/stores/useAuthStore';
import { useBusinessStore } from '@/stores/useBusinessStore';

export default function BottomTabBar() {
  const { colors } = useTheme();

  const pathname = usePathname();
  const router = useRouter();

  const { isAuthenticated } = useAuth();

  // بررسی وجود کسب‌وکار
  const businessData = useBusinessStore((s) => s.businessData);
  const businessStatus = useBusinessStore((s) => s.businessStatus);

  // فقط وجود id یا status برای تشخیص داشتن کسب‌وکار کافی است
  const hasBusiness =
    Boolean(businessData?.id) || Boolean(businessStatus);

  const tabs = isAuthenticated
    ? [
        {
          id: 'home',
          icon: FiHome,
          label: 'خانه',
          path: '/',
        },

        {
          id: 'explore',
          icon: FiSearch,
          label: 'ویترین',
          path: '/explore',
        },

        hasBusiness
          ? {
              id: 'manage',
              icon: FiBriefcase,
              label: 'مدیریت',
              path: '/manage',
            }
          : {
              id: 'create',
              icon: FiPlusSquare,
              label: 'ثبت آگهی',
              path: '/create-business',
            },

        {
          id: 'model-requests',
          icon: GiNails,
          label: 'آگهی مدل',
          path: '/model-requests',
        },

        {
          id: 'profile',
          icon: FiUser,
          label: 'پروفایل',
          path: '/profile',
        },
      ]
    : [
        {
          id: 'home',
          icon: FiHome,
          label: 'خانه',
          path: '/',
        },

        {
          id: 'explore',
          icon: FiSearch,
          label: 'ویترین',
          path: '/explore',
        },

        {
          id: 'model-requests',
          icon: GiNails,
          label: 'درخواست مدل',
          path: '/model-requests',
        },

        {
          id: 'login',
          icon: FiLogIn,
          label: 'ورود و ثبت‌نام',
          isAuthAction: true,
        },
      ];

  const isActive = (tab) => {
    // تب ورود هیچ‌وقت active نمی‌شود
    if (tab.isAuthAction) return false;

    // صفحه اصلی
    if (tab.path === '/') {
      return pathname === '/';
    }

    // سایر مسیرها
    return (
      pathname === tab.path ||
      pathname?.startsWith(`${tab.path}/`)
    );
  };

  const handleTabPress = (tab) => {
    // ورود و ثبت‌نام
    if (tab.isAuthAction) {
      router.push('/auth/login');
      return;
    }

    // اگر همین صفحه فعال است، کاری انجام نده
    if (isActive(tab)) return;

    router.push(tab.path);
  };

  return (
    <>
      {/* فضای خالی برای جلوگیری از پوشانده شدن محتوای صفحه */}
      <div
        className="h-24"
        style={{
          paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        }}
      />

      {/* Bottom Tab Bar */}
      <div
        className="
          fixed
          left-4
          right-4
          h-16
          rounded-2xl
          flex
          items-center
          justify-around
          px-2
          z-40
          shadow-xl
        "
        style={{
          backgroundColor: colors.cardBackground,
          boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
          border: `1px solid ${colors.border}`,
          bottom:
            'calc(16px + env(safe-area-inset-bottom, 0px))',
        }}
      >
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = isActive(tab);

          return (
            <button
              key={tab.id}
              onClick={() => handleTabPress(tab)}
              className="
                flex
                flex-col
                items-center
                gap-0.5
                py-1
                px-3
                relative
                transition-all
                duration-200
                hover:scale-105
                active:scale-95
              "
              type="button"
            >
              {/* Icon */}
              <div className="relative">
                <Icon
                  size={24}
                  style={{
                    color: active
                      ? colors.primary
                      : colors.textSecondary,
                    transition: 'color 0.2s',
                  }}
                />
              </div>

              {/* Label */}
              <span
                className="
                  text-[10px]
                  transition-colors
                  duration-200
                  text-center
                  leading-tight
                "
                style={{
                  color: active
                    ? colors.primary
                    : colors.textSecondary,
                  fontFamily: active
                    ? 'Vazir-Bold'
                    : 'Vazir-Medium',
                }}
              >
                {tab.label}
              </span>

              {/* Active Indicator */}
              {active && (
                <div
                  className="
                    absolute
                    -top-1
                    left-1/2
                    -translate-x-1/2
                    w-8
                    h-1
                    rounded-full
                  "
                  style={{
                    backgroundColor: colors.primary,
                  }}
                />
              )}
            </button>
          );
        })}
      </div>
    </>
  );
}

