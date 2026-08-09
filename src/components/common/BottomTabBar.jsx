// src/components/common/BottomTabBar.jsx
'use client';
import { FiHome, FiGrid, FiPlusCircle, FiCreditCard, FiUser, FiLogIn } from 'react-icons/fi';
import { usePathname, useRouter } from 'next/navigation';
import { useTheme } from '@/stores/useThemeStore';
import { useAuth } from '@/stores/useAuthStore';
import { useBusinessStore } from '@/stores/useBusinessStore';

export default function BottomTabBar() {
  const { colors } = useTheme();
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, openAuthModal } = useAuth();
  const businessData = useBusinessStore((s) => s.businessData);

  const hasBusiness = Boolean(
    businessData?.id && businessData?.name && businessData?.isActive !== false
  );

  const tabs = isAuthenticated
    ? [
        { id: 'home', icon: FiHome, label: 'خانه', path: '/' },
        { id: 'explore', icon: FiGrid, label: 'ویترین', path: '/explore' },
        hasBusiness
          ? { id: 'manage', icon: FiCreditCard, label: 'مدیریت کسب‌وکار', path: '/manage' }
          : { id: 'create', icon: FiPlusCircle, label: 'ثبت آگهی جدید', path: '/create-business' },
        { id: 'profile', icon: FiUser, label: 'پروفایل', path: '/profile' },
      ]
    : [
        { id: 'home', icon: FiHome, label: 'خانه', path: '/' },
        { id: 'explore', icon: FiGrid, label: 'ویترین', path: '/explore' },
        { id: 'login', icon: FiLogIn, label: 'ورود و ثبت‌نام', isAuthAction: true },
      ];

  const handleTabPress = (tab) => {
    if (tab.isAuthAction) {
      openAuthModal();
      return;
    }
    router.push(tab.path);
  };

  const isActive = (tab) => {
    if (tab.isAuthAction) return false;
    if (tab.path === '/') return pathname === '/';
    return pathname?.startsWith(tab.path);
  };

  return (
    <>
      <div className="h-24" />
      <div
        className="fixed bottom-4 left-4 right-4 h-16 rounded-2xl flex items-center justify-around px-2 z-40 shadow-xl"
        style={{
          backgroundColor: colors.cardBackground,
          boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
          border: `1px solid ${colors.border}`,
        }}
      >
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = isActive(tab);
          return (
            <button
              key={tab.id}
              onClick={() => handleTabPress(tab)}
              className="flex flex-col items-center gap-0.5 py-1 px-3 relative transition-all duration-200 hover:scale-105 active:scale-95"
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
              </div>
              <span
                className="text-[10px] transition-colors duration-200 text-center leading-tight"
                style={{
                  color: active ? colors.primary : colors.textSecondary,
                  fontFamily: active ? 'Vazir-Bold' : 'Vazir-Medium',
                }}
              >
                {tab.label}
              </span>
              {active && (
                <div
                  className="absolute -top-1 left-1/2 -translate-x-1/2 w-8 h-1 rounded-full"
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
