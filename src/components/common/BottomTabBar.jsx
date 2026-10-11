// src/components/common/BottomTabBar.jsx
'use client';

import {
  FiHome,
  FiSearch,
  FiBriefcase,
  FiPlusSquare,
  FiUser,
  FiLogIn,
  FiCamera,
} from 'react-icons/fi';

import { usePathname, useRouter } from 'next/navigation';

import { useTheme } from '@/stores/useThemeStore';
import { useAuth } from '@/stores/useAuthStore';
import { useBusinessStore } from '@/stores/useBusinessStore';

/* ═══════ تنظیمات ظاهری (قابل تیون در یک جا) ═══════ */
const BAR_HEIGHT = 60; // ارتفاع dock داخلی
const BOTTOM_GAP = 12; // فاصله dock از پایین صفحه
const BUBBLE_INSET_Y = 5; // فاصله حباب فعال از لبه بالا/پایین dock
const SPRING = 'cubic-bezier(0.34, 1.56, 0.64, 1)'; // منحنی فنری انیمیشن

/**
 * BottomTabBar — نسخه Floating Compact Glass Dock
 *
 * ویژگی‌ها:
 * - تمام‌عرض نیست؛ وسط و با max-width نمایش داده می‌شود.
 * - شیشه‌ای، گرد، سبک و جمع‌وجور.
 * - حباب گرادیانی فعال حفظ شده است.
 * - safe-area پایین رعایت می‌شود.
 * - منطق تب‌های قبلی بدون تغییر مانده است.
 *
 * نکته:
 * اگر صفحه‌ای خودش padding پایین برای تب‌بار دارد،
 * می‌توانی showSpacer={false} بدهی تا فضای خالی تکراری ایجاد نشود.
 */
export default function BottomTabBar({ showSpacer = true }) {
  const { colors, resolvedTheme } = useTheme();
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

  const isDark = resolvedTheme === 'dark';

  // ═══════ منطق تب‌ها — بدون تغییر ═══════
  const tabs = isAuthenticated
    ? [
        { id: 'home', icon: FiHome, label: 'خانه', path: '/' },
        { id: 'explore', icon: FiSearch, label: 'ویترین', path: '/explore' },
        hasBusiness
          ? { id: 'manage', icon: FiBriefcase, label: 'مدیریت', path: '/manage' }
          : { id: 'create', icon: FiPlusSquare, label: 'ثبت آگهی', path: '/create-business' },
        { id: 'model-requests', icon: FiCamera, label: 'آگهی مدل', path: '/model-requests' },
        { id: 'profile', icon: FiUser, label: 'پروفایل', path: '/profile' },
      ]
    : [
        { id: 'home', icon: FiHome, label: 'خانه', path: '/' },
        { id: 'explore', icon: FiSearch, label: 'ویترین', path: '/explore' },
        { id: 'model-requests', icon: FiCamera, label: 'درخواست مدل', path: '/model-requests' },
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

  // فضای خالی پایین صفحه برای اینکه محتوا زیر dock نرود.
  // 60 ارتفاع dock + 12 فاصله پایین + 8 حاشیه امن = 80px
  const clearanceHeight = `calc(${BAR_HEIGHT + BOTTOM_GAP + 8}px + env(safe-area-inset-bottom, 0px))`;

  const dockShadow = isDark
    ? '0 18px 42px rgba(0,0,0,0.48), 0 2px 10px rgba(0,0,0,0.28)'
    : '0 16px 38px rgba(44,37,33,0.16), 0 2px 10px rgba(44,37,33,0.08)';

  return (
    <>
      {/* فضای خالی اختیاری برای صفحاتی که خودشون padding پایین ندارند */}
      {showSpacer && (
        <div
          aria-hidden="true"
          style={{
            height: clearanceHeight,
          }}
        />
      )}

      {/* ═══ Floating Bottom Tab Bar — Compact Glass Dock ═══ */}
      <div
        className="fixed inset-x-0 bottom-0 z-40 flex justify-center px-3 pointer-events-none"
        style={{
          paddingBottom: `calc(${BOTTOM_GAP}px + env(safe-area-inset-bottom, 0px))`,
        }}
      >
        <nav
          aria-label="ناوبری اصلی"
          className="pointer-events-auto relative w-full max-w-[420px] sm:max-w-[480px] md:max-w-[540px] overflow-hidden rounded-full border"
          style={{
            height: BAR_HEIGHT,
            backgroundColor: `${colors.cardBackground}f2`,
            borderColor: colors.border,
            boxShadow: dockShadow,
            backdropFilter: 'blur(22px) saturate(1.35)',
            WebkitBackdropFilter: 'blur(22px) saturate(1.35)',
          }}
        >
          {/* ═══ حباب گرادیانی لغزان پشت تب فعال ═══ */}
          {activeIndex >= 0 && (
            <div
              aria-hidden="true"
              className="absolute rounded-full"
              style={{
                top: BUBBLE_INSET_Y,
                bottom: BUBBLE_INSET_Y,
                insetInlineStart: `${activeIndex * slotWidth}%`,
                width: `${slotWidth}%`,
                background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
                boxShadow: `0 8px 20px ${colors.primary}55`,
                transition: `inset-inline-start 450ms ${SPRING}`,
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
          )}

          {/* ═══ تب‌ها ═══ */}
          <div className="relative flex h-full items-stretch">
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
                    flex flex-col items-center justify-center gap-[3px]
                    transition-transform duration-200
                    active:scale-[0.94]
                    focus:outline-none
                  "
                  style={{
                    WebkitTapHighlightColor: 'transparent',
                  }}
                >
                  <Icon
                    size={active ? 22 : 20}
                    className="transition-all duration-300"
                    style={{
                      color: active ? '#fff' : colors.textSecondary,
                      transform: active ? 'translateY(-1px) scale(1.04)' : 'none',
                      filter: active
                        ? 'drop-shadow(0 2px 4px rgba(0,0,0,0.22))'
                        : 'none',
                    }}
                  />

                  <span
                    className="
                      max-w-[68px] sm:max-w-[78px]
                      truncate
                      text-[9px] sm:text-[10px]
                      leading-none
                      transition-all duration-300
                    "
                    style={{
                      color: active ? '#fff' : colors.textSecondary,
                      opacity: active ? 1 : 0.72,
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
      </div>
    </>
  );
}