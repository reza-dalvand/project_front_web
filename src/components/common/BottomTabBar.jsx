'use client';

import {
  FiHome,
  FiSearch,
  FiBriefcase,
  FiPlusSquare,
  FiUser,
  FiLogIn,
  FiStar,
} from 'react-icons/fi';

import { usePathname, useRouter } from 'next/navigation';

import { useTheme } from '@/stores/useThemeStore';
import { useAuth } from '@/stores/useAuthStore';
import { useBusinessStore } from '@/stores/useBusinessStore';

export default function BottomTabBar() {
  const { colors } = useTheme();
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  const businessData = useBusinessStore((s) => s.businessData);
  const businessStatus = useBusinessStore((s) => s.businessStatus);
  const hasBusiness = Boolean(businessData?.id) || Boolean(businessStatus);

  const tabs = isAuthenticated
    ? [
        { id: 'home', icon: FiHome, label: 'خانه', path: '/' },
        { id: 'explore', icon: FiSearch, label: 'ویترین', path: '/explore' },
        hasBusiness
          ? { id: 'manage', icon: FiBriefcase, label: 'مدیریت', path: '/manage' }
          : { id: 'create', icon: FiPlusSquare, label: 'ثبت آگهی', path: '/create-business' },
        { id: 'model-requests', icon: FiStar, label: 'آگهی مدل', path: '/model-requests' },
        { id: 'profile', icon: FiUser, label: 'پروفایل', path: '/profile' },
      ]
    : [
        { id: 'home', icon: FiHome, label: 'خانه', path: '/' },
        { id: 'explore', icon: FiSearch, label: 'ویترین', path: '/explore' },
        { id: 'model-requests', icon: FiStar, label: 'درخواست مدل', path: '/model-requests' },
        { id: 'login', icon: FiLogIn, label: 'ورود و ثبت‌نام', isAuthAction: true },
      ];

  const isActive = (tab) => {
    if (tab.isAuthAction) return false;
    if (tab.path === '/') return pathname === '/';
    return pathname === tab.path || pathname?.startsWith(`${tab.path}/`);
  };

  const handleTabPress = (tab) => {
    if (tab.isAuthAction) {
      router.push('/auth/login');
      return;
    }
    if (isActive(tab)) return;
    router.push(tab.path);
  };

  return (
    <>
      {/* فضای خالی — responsive */}
      <div
        className="h-20 sm:h-24 md:h-28"
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      />

      {/* Bottom Tab Bar */}
      <div
        className="
          fixed
          left-2 right-2
          sm:left-4 sm:right-4
          md:left-1/2 md:right-auto md:-translate-x-1/2
          md:max-w-lg md:w-[calc(100%-2rem)]
          h-[60px] sm:h-[64px] md:h-[68px]
          rounded-xl sm:rounded-2xl
          flex
          items-center
          justify-around
          px-1 sm:px-2
          z-40
          shadow-xl
          backdrop-blur-sm
        "
        style={{
          backgroundColor: `${colors.cardBackground}f2`,
          boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
          border: `1px solid ${colors.border}`,
          bottom: 'calc(8px + env(safe-area-inset-bottom, 0px))',
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
                flex flex-col items-center justify-center
                gap-0 sm:gap-0.5
                py-1 px-1.5 sm:px-2 md:px-3
                relative
                transition-all duration-200
                hover:scale-105 active:scale-95
                min-w-0
              "
              type="button"
            >
              <div className="relative flex items-center justify-center">
                <Icon
                  size={20}
                  className="sm:w-[22px] sm:h-[22px] md:w-[24px] md:h-[24px] transition-colors duration-200"
                  style={{
                    color: active ? colors.primary : colors.textSecondary,
                  }}
                />
              </div>

              <span
                className="
                  text-[9px] sm:text-[10px] md:text-[11px]
                  transition-colors duration-200
                  text-center leading-tight
                  truncate max-w-[60px] sm:max-w-[70px] md:max-w-none
                "
                style={{
                  color: active ? colors.primary : colors.textSecondary,
                  fontFamily: active ? 'Vazir-Bold' : 'Vazir-Medium',
                }}
              >
                {tab.label}
              </span>

              {active && (
                <div
                  className="
                    absolute -top-0.5 sm:-top-1
                    left-1/2 -translate-x-1/2
                    w-6 sm:w-7 md:w-8
                    h-[3px] sm:h-1
                    rounded-full
                    transition-all duration-200
                  "
                  style={{ backgroundColor: colors.primary }}
                />
              )}
            </button>
          );
        })}
      </div>
    </>
  );
}