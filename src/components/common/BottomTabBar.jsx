// src/components/common/BottomTabBar.jsx
'use client';

import { FiHome, FiGrid, FiPlusCircle, FiCreditCard, FiUser, FiLock } from 'react-icons/fi';
import { usePathname, useRouter } from 'next/navigation';
import { useTheme } from '@/stores/useThemeStore';
import { useAuth } from '@/stores/useAuth';

export default function BottomTabBar() {
  const { colors } = useTheme();
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, requireAuth } = useAuth();

  const tabs = [
    { id: 'home', icon: FiHome, label: 'خانه', path: '/' },
    { id: 'explore', icon: FiGrid, label: 'ویترین', path: '/explore' },
    { id: 'create', icon: FiPlusCircle, label: 'ثبت سالن', path: '/create-business' },
    { id: 'manage', icon: FiCreditCard, label: 'مدیریت', path: '/manage' },
    { id: 'profile', icon: FiUser, label: 'پروفایل', path: '/profile' },
  ];

  const handleTabPress = (tab) => {
    // تب‌های نیازمند احراز هویت
    if (['create', 'manage', 'profile'].includes(tab.id)) {
      if (isAuthenticated) {
        router.push(tab.path);
      } else {
        requireAuth(() => {
          router.push(tab.path);
        });
      }
    } else {
      router.push(tab.path);
    }
  };

  const isActive = (tab) => {
    if (tab.path === '/') return pathname === '/';
    return pathname?.startsWith(tab.path);
  };

  return (
    <>
      {/* فاصله برای محتوای صفحه (padding-bottom) */}
      <div className="h-24" />

      {/* Tab Bar */}
      <div
        className="fixed bottom-4 left-4 right-4 h-16 rounded-2xl 
                   flex items-center justify-around px-2 z-40
                   shadow-xl"
        style={{
          backgroundColor: colors.cardBackground,
          boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
          border: `1px solid ${colors.border}`,
        }}
      >
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = isActive(tab);
          const needsAuth = ['create', 'manage', 'profile'].includes(tab.id);
          const showLock = needsAuth && !isAuthenticated;

          return (
            <button
              key={tab.id}
              onClick={() => handleTabPress(tab)}
              className="flex flex-col items-center gap-0.5 py-1 px-3 relative
                         transition-all duration-200 hover:scale-105 active:scale-95"
              type="button"
            >
              <div className="relative">
                <Icon
                  size={24}
                  style={{
                    color: active ? colors.primary : colors.textSecondary,
                    transition: 'color 0.2s',
                  }}
                />
                {showLock && (
                  <div
                    className="absolute -top-1 -right-1 w-4 h-4 rounded-full 
                               flex items-center justify-center"
                    style={{ backgroundColor: '#E53935' }}
                  >
                    <FiLock size={9} color="#fff" />
                  </div>
                )}
              </div>
              <span
                className="text-[10px] transition-colors duration-200"
                style={{
                  color: active ? colors.primary : colors.textSecondary,
                  fontFamily: active ? 'Vazir-Bold' : 'Vazir-Medium',
                }}
              >
                {tab.label}
              </span>

              {/* نشانگر فعال بودن */}
              {active && (
                <div
                  className="absolute -top-1 left-1/2 -translate-x-1/2 
                             w-8 h-1 rounded-full"
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