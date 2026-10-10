// src/components/common/BottomTabBar.jsx
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

/* ═══════ تنظیمات ظاهری (قابل تیون در یک جا) ═══════ */
const BAR_HEIGHT = 68; // ارتفاع بار (px)
const BUBBLE_INSET_Y = 7; // فاصله حباب از لبه بالا/پایین بار (px)
const SPRING = 'cubic-bezier(0.34, 1.56, 0.64, 1)'; // منحنی فنری انیمیشن

export default function BottomTabBar() {
  const { colors } = useTheme();
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  const businessData = useBusinessStore((s) => s.businessData);
  const businessStatus = useBusinessStore((s) => s.businessStatus);

  // ✅ FIX F-21: بدون تغییر — بررسی جامع hasBusiness
  const hasBusiness =
    Boolean(businessData?.id) ||
    Boolean(businessStatus) ||
    Boolean(businessData?.status) ||
    Boolean(businessData?.bookingSlug);

  // ═══════ منطق تب‌ها — بدون تغییر ═══════
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

  // ═══════ موقعیت حباب لغزان ═══════
  const activeIndex = tabs.findIndex((tab) => isActive(tab));
  const slotWidth = 100 / tabs.length;

  return (
    <>
      {/* فضای خالی برای محتوا — responsive */}
      <div
        className="h-24 sm:h-28 md:h-32"
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      />

      {/* ═══ Bottom Tab Bar — Floating Glass Dock ═══ */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-40 border-t"
        style={{
          backgroundColor: colors.cardBackground,
          borderColor: colors.border,
          // ✅ FIX: فاصله از پایین برای جلوگیری از پرش روی نوتچ/ژست شیائومی
          paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        }}
      >
        <div
          className="relative w-full flex items-stretch overflow-hidden rounded-[26px] sm:rounded-[30px]"
          style={{
            height: BAR_HEIGHT,
            backgroundColor: `${colors.cardBackground}d9`,
            backdropFilter: 'blur(22px) saturate(1.4)',
            WebkitBackdropFilter: 'blur(22px) saturate(1.4)',
            border: `1px solid ${colors.border}`,
            boxShadow: '0 12px 32px rgba(0,0,0,0.14), 0 2px 8px rgba(0,0,0,0.06)',
          }}
        >
          {/* ═══ حباب گرادیانی لغزان پشت تب فعال ═══ */}
          <div
            aria-hidden="true"
            className="absolute rounded-[20px] sm:rounded-[24px]"
            style={{
              top: BUBBLE_INSET_Y,
              bottom: BUBBLE_INSET_Y,
              insetInlineStart: `${(activeIndex >= 0 ? activeIndex : 0) * slotWidth}%`,
              width: `${slotWidth}%`,
              opacity: activeIndex >= 0 ? 1 : 0,
              transform: activeIndex >= 0 ? 'scale(1)' : 'scale(0.85)',
              background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
              boxShadow: `0 6px 16px ${colors.primary}55`,
              transition: `inset-inline-start 450ms ${SPRING}, opacity 250ms ease, transform 250ms ease`,
            }}
          >
            {/* برق شیشه‌ای روی حباب */}
            <div
              className="absolute inset-x-3 top-1 h-1/3 rounded-full"
              style={{
                background:
                  'linear-gradient(180deg, rgba(255,255,255,0.28), rgba(255,255,255,0))',
              }}
            />
          </div>

          {/* ═══ تب‌ها ═══ */}
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const active = isActive(tab);

            return (
              <button
                key={tab.id}
                onClick={() => handleTabPress(tab)}
                type="button"
                aria-current={active ? 'page' : undefined}
                className="
                  relative flex-1 min-w-0
                  flex flex-col items-center justify-center gap-1
                  transition-transform duration-200
                  active:scale-[0.94]
                "
              >
                <Icon
                  size={21}
                  className="sm:w-[23px] sm:h-[23px] transition-all duration-300"
                  style={{
                    color: active ? '#fff' : colors.textSecondary,
                    transform: active ? 'translateY(-1px)' : 'none',
                    filter: active ? 'drop-shadow(0 2px 4px rgba(0,0,0,0.25))' : 'none',
                  }}
                />
                <span
                  className="
                    text-[9.5px] sm:text-[10.5px] leading-none
                    truncate max-w-[64px] sm:max-w-[76px]
                    transition-all duration-300
                  "
                  style={{
                    color: active ? '#fff' : colors.textSecondary,
                    opacity: active ? 1 : 0.8,
                    fontFamily: active ? 'Vazir-Bold' : 'Vazir-Medium',
                  }}
                >
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
}