'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  FiCalendar,
  FiHeart,
  FiCreditCard,
  FiEdit3,
  FiSmartphone,
  FiHelpCircle,
  FiLogOut,
  FiShield,
} from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import { useAuthStore } from '@/stores/useAuthStore';
import ProfileHeader from '@/components/profile/ProfileHeader';
import ProfileStatsCard from '@/components/profile/ProfileStatsCard';
import ProfileMenuList from '@/components/profile/ProfileMenuList';
import ThemeToggleItem from '@/components/profile/ThemeToggleItem';
import { Button } from '@/components/common';
import { useToast } from '@/hooks/useToast';

export default function ProfilePage() {
  const { colors, resolvedTheme, setTheme } = useTheme();
  const { user, logout } = useAuthStore();
  const { showToast } = useToast();
  const router = useRouter();

  const isDark = resolvedTheme === 'dark';
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const toggleTheme = () => setTheme(isDark ? 'light' : 'dark');

  const userStats = [
    { id: 1, label: 'نوبت‌ها', value: 12, icon: FiCalendar, color: '#2196F3' },
    { id: 2, label: 'علاقه‌مندی', value: 28, icon: FiHeart, color: '#E91E63' },
  ];

  const quickMenuItems = [
    {
      id: 'appointments',
      title: 'نوبت‌های من',
      subtitle: 'نوبت‌های آینده و گذشته',
      icon: FiCalendar,
      color: '#2196F3',
      badge: 2,
      route: '/profile/appointments',
    },
    {
      id: 'favorites',
      title: 'علاقه‌مندی‌های من',
      subtitle: 'کسب‌وکارها و پست‌های ویترین',
      icon: FiHeart,
      color: '#E91E63',
      route: '/profile/favorites',
    },
    {
      id: 'payments',
      title: 'تاریخچه پرداخت‌ها',
      subtitle: 'سوابق مالی و بیعانه‌ها',
      icon: FiCreditCard,
      color: '#4CAF50',
      route: '/profile/payments',
    },
    {
      id: 'edit',
      title: 'ویرایش پروفایل',
      subtitle: 'نام و شماره موبایل',
      icon: FiEdit3,
      color: '#FF9800',
      route: '/profile/edit',
    },
  ];

  const settingsMenuItems = [
    {
      id: 'devices',
      title: 'دستگاه‌های فعال',
      subtitle: 'مدیریت نشست‌های فعال',
      icon: FiSmartphone,
      color: '#2196F3',
      badge: 4,
      route: '/profile/devices',
    },
    {
      id: 'support',
      title: 'پشتیبانی و راهنما',
      subtitle: 'سوالات متداول و تماس با ما',
      icon: FiHelpCircle,
      color: '#607D8B',
      route: '/profile/support',
    },
  ];

  const handleMenuPress = (item) => {
    router.push(item.route);
  };

  const handleLogout = () => {
    logout();
    showToast('با موفقیت از حساب خارج شدید', 'success');
    router.push('/');
  };

  return (
    <div
      className="min-h-screen pb-20"
      style={{ backgroundColor: colors.background }}
    >
      <ProfileHeader user={user} />

      <div className="px-5 pt-6">
        <ProfileStatsCard stats={userStats} />

        <ProfileMenuList
          title="دسترسی سریع"
          items={quickMenuItems}
          onItemPress={handleMenuPress}
        />

        {/* بخش تنظیمات */}
        <div className="mb-6">
          <h3
            className="text-base font-[Vazir-Bold] mb-3"
            style={{ color: colors.textMain }}
          >
            تنظیمات
          </h3>

          {/* تم شب/روز */}
          <div className="mb-2.5">
            <ThemeToggleItem isDark={isDark} onToggle={toggleTheme} />
          </div>

          <ProfileMenuList
            title=""
            items={settingsMenuItems}
            onItemPress={handleMenuPress}
          />
        </div>

        {/* خروج */}
        <div className="mt-4 flex flex-col gap-3 items-center">
          <Button
            title="خروج از حساب کاربری"
            onPress={() => setShowLogoutConfirm(true)}
            variant="outline"
            size="lg"
            fullWidth
            icon={<FiLogOut size={20} color="#E53935" />}
            iconPosition="left"
            className="!border-[#E53935] !border-[1.5px]"
            style={{ color: '#E53935' }}
          />
          <span
            className="text-xs font-[Vazir]"
            style={{ color: colors.textSecondary }}
          >
            نسخه ۱.۰.۰ - زیبانو
          </span>
        </div>
      </div>

      {/* مدال تایید خروج */}
      {showLogoutConfirm && (
        <div
          className="fixed inset-0 z-[10000] flex items-center justify-center p-6"
          style={{ backgroundColor: 'rgba(0,0,0,0.65)' }}
          onClick={(e) => e.target === e.currentTarget && setShowLogoutConfirm(false)}
        >
          <div
            className="w-full max-w-sm rounded-3xl p-6 flex flex-col items-center gap-4"
            style={{ backgroundColor: colors.cardBackground }}
          >
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center"
              style={{ backgroundColor: '#E5393520' }}
            >
              <FiShield size={40} color="#E53935" />
            </div>
            <h3
              className="text-xl font-[Vazir-Bold] text-center"
              style={{ color: colors.textMain }}
            >
              خروج از حساب کاربری
            </h3>
            <p
              className="text-sm text-center leading-6"
              style={{ color: colors.textSecondary }}
            >
              آیا از خروج از حساب کاربری خود مطمئن هستید؟
            </p>
            <div className="flex gap-3 w-full mt-2">
              <Button
                title="انصراف"
                onPress={() => setShowLogoutConfirm(false)}
                variant="outline"
                size="lg"
                className="flex-1"
              />
              <Button
                title="خروج"
                onPress={handleLogout}
                variant="primary"
                size="lg"
                className="flex-1"
                style={{ backgroundColor: '#E53935' }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}