'use client';

import { useState } from 'react';
import Image from 'next/image';
import {
  FiBell,
  FiHeart,
  FiBookmark,
  FiUser,
  FiHome,
  FiGrid,
  FiPlusCircle,
  FiStar,
  FiCalendar,
  FiTrendingUp,
  FiAward,
  FiCreditCard,
} from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import {
  Button,
  Card,
  Avatar,
  Badge,
  BottomSheet,
  LoadingSpinner,
  EmptyState,
  SectionHeader,
  Divider,
  SearchBar,
  Chip,
  StatsCard,
  StarRating,
} from '@/components/common';
import HomeHeader from '@/components/home/HomeHeader';
import CategoryGrid from '@/components/home/CategoryGrid';
import AdSlider from '@/components/home/AdSlider';
import { useToast } from '@/hooks/useToast';

const MOCK_ADS = [
  {
    id: 1,
    imageUrl: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800',
    title: 'جشنواره تخفیف‌های بهار کلینیک رُز',
    subtitle: 'تا ۳۰٪ تخفیف خدمات پوست',
    badge: 'پیشنهاد ویژه',
  },
  {
    id: 2,
    imageUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800',
    title: 'افتتاحیه سالن زیبایی لاویا',
    subtitle: 'نوبت‌دهی آنلاین با بیعانه اقتصادی',
    badge: 'جدید',
  },
  {
    id: 3,
    imageUrl: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=800',
    title: 'لیزر با جدیدترین دستگاه ۲۰۲۴',
    subtitle: 'مرکز رویال - تخفیف ویژه',
    badge: 'پرفروش',
  },
];

const MOCK_CATEGORIES = [
  { id: 1, name: 'میکاپ', icon: 'face', count: 6 },
  { id: 2, name: 'کاشت ناخن', icon: 'brush', count: 6 },
  { id: 3, name: 'لیزر مو', icon: 'flash-on', count: 5 },
  { id: 4, name: 'پاکسازی', icon: 'spa', count: 6 },
  { id: 5, name: 'رنگ مو', icon: 'palette', count: 6 },
  { id: 6, name: 'کراتین', icon: 'auto-awesome', count: 5 },
  { id: 7, name: 'مژه', icon: 'visibility', count: 6 },
  { id: 8, name: 'ماساژ', icon: 'self-improvement', count: 4 },
];

export default function HomePage() {
  const { colors, resolvedTheme, setTheme } = useTheme();
  const { showToast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [filterVisible, setFilterVisible] = useState(false);
  const [bookingVisible, setBookingVisible] = useState(false);

  const isDark = resolvedTheme === 'dark';
  const toggleTheme = () => setTheme(isDark ? 'light' : 'dark');

  return (
    <div
      className="min-h-screen pb-28"
      style={{ backgroundColor: colors.background }}
    >
      {/* هدر صفحه خانه */}
      <HomeHeader
        userName="مریم حسینی"
        userAvatar="https://i.pravatar.cc/150?img=5"
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSearchSubmit={() => showToast('جستجو انجام شد', 'info')}
        onFilterPress={() => setFilterVisible(true)}
        hasActiveFilter={true}
        isDark={isDark}
        onThemeToggle={toggleTheme}
        onSearchClick={() => showToast('صفحه جستجو باز شد', 'info')}
      />

      {/* محتوای اصلی */}
      <div className="px-5 pt-4 flex flex-col gap-6">

        {/* ۱. اسلایدر تبلیغات */}
        <section>
          <SectionHeader
            icon={<FiStar size={18} />}
            iconColor={colors.primary}
            title="پیشنهادات ویژه"
            rightElement={
              <button
                onClick={() => showToast('نمایش همه آگهی‌ها', 'info')}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl border"
                style={{
                  backgroundColor: colors.primary + '12',
                  borderColor: colors.primary + '35',
                }}
              >
                <span
                  className="text-[12px] font-bold"
                  style={{ color: colors.primary }}
                >
                  مشاهده همه
                </span>
              </button>
            }
          />
          <AdSlider ads={MOCK_ADS} />
        </section>

        {/* ۲. دسته‌بندی خدمات */}
        <section>
          <SectionHeader
            icon={<FiGrid size={18} />}
            iconColor="#FF9800"
            title="دسته‌بندی خدمات"
          />
          <CategoryGrid
            categories={MOCK_CATEGORIES}
            selectedId={selectedCategory}
            onSelect={(item) => {
              setSelectedCategory(item.id);
              showToast(`دسته ${item.name} انتخاب شد`, 'info');
            }}
          />
        </section>

        {/* ۳. فرصت‌های مدلینگ */}
        <section>
          <SectionHeader
            icon={<FiUser size={18} />}
            iconColor="#E91E63"
            title="فرصت‌های مدلینگ"
            subtitle="با تخفیف ویژه مدل شوید و نمونه‌کار بسازید"
            rightElement={<Badge label="۳ فرصت" variant="primary" size="sm" />}
          />
          <Card variant="default" padding={10} radius={12}>
            <div className="flex items-center gap-2">
              <span className="text-lg">✨</span>
              <span
                className="text-[11px] flex-1 leading-[17px]"
                style={{ color: colors.textMain }}
              >
                با شرکت در درخواست‌های مدلینگ، تا{' '}
                <span className="font-bold text-[#E91E63]">۸۰٪ تخفیف</span>{' '}
                بگیرید
              </span>
            </div>
          </Card>

          {/* کارت‌های مدلینگ (Horizontal Scroll) */}
          <div className="flex gap-3 overflow-x-auto pt-3 pb-1 -mx-1 px-1 scrollbar-hide">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex-shrink-0 w-[220px] rounded-[18px] border overflow-hidden cursor-pointer hover:scale-[1.02] transition-transform"
                style={{
                  backgroundColor: colors.cardBackground,
                  borderColor: colors.border,
                }}
                onClick={() => showToast('جزئیات فرصت مدلینگ', 'info')}
              >
                <div className="relative h-[140px] w-full overflow-hidden">
                  <Image
                    src={`https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&sig=${i}`}
                    alt="model"
                    fill
                    className="object-cover"
                    sizes="220px"
                  />
                  <div className="absolute top-2 left-2 bg-[#E91E63] px-2 py-1 rounded-lg">
                    <span className="text-[10px] font-bold text-white">
                      با هزینه
                    </span>
                  </div>
                </div>
                <div className="p-3 flex flex-col gap-2">
                  <h4
                    className="text-[14px] font-bold line-clamp-2 min-h-[40px]"
                    style={{ color: colors.textMain }}
                  >
                    مدل فیشیال VIP عروس
                  </h4>
                  <div className="flex items-center gap-1">
                    <span className="text-sm">🏪</span>
                    <span
                      className="text-[11px] font-medium"
                      style={{ color: colors.primary }}
                    >
                      کلینیک زیبایی صدف
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-sm">📍</span>
                    <span
                      className="text-[10px]"
                      style={{ color: colors.textSecondary }}
                    >
                      تهران، سعادت‌آباد
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ۴. اجاره لاین */}
        <section>
          <SectionHeader
            icon={<FiPlusCircle size={18} />}
            iconColor="#667eea"
            title="فرصت‌های همکاری"
            subtitle="با اجاره لاین، کسب‌وکار خود را گسترش دهید"
          />
          <Card variant="default" padding={10} radius={12}>
            <div className="flex items-center gap-2">
              <FiAward size={16} color="#667eea" />
              <span
                className="text-[11px] flex-1 leading-[17px]"
                style={{ color: colors.textMain }}
              >
                برای متخصصان: با حداقل سرمایه، کسب‌وکار خود را راه‌اندازی کنید
              </span>
            </div>
          </Card>

          <div className="flex gap-3 overflow-x-auto pt-3 pb-1 -mx-1 px-1 scrollbar-hide">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex-shrink-0 w-[220px] rounded-[18px] border overflow-hidden cursor-pointer hover:scale-[1.02] transition-transform"
                style={{
                  backgroundColor: colors.cardBackground,
                  borderColor: colors.border,
                }}
                onClick={() => showToast('جزئیات لاین', 'info')}
              >
                <div className="relative h-[130px] w-full overflow-hidden">
                  <Image
                    src={`https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&sig=${i + 10}`}
                    alt="line"
                    fill
                    className="object-cover"
                    sizes="220px"
                  />
                  <div className="absolute top-2 left-2 bg-[#7B1FA2] px-2 py-1 rounded-lg">
                    <span className="text-[10px] font-bold text-white">
                      کاشت ناخن
                    </span>
                  </div>
                </div>
                <div className="p-3 flex flex-col gap-2">
                  <h4
                    className="text-[14px] font-bold line-clamp-2 min-h-[40px]"
                    style={{ color: colors.textMain }}
                  >
                    لاین ناخن VIP با تجهیزات کامل
                  </h4>
                  <div className="inline-flex items-center gap-1 self-start bg-[#9C27B022] px-2 py-1 rounded-lg">
                    <span className="text-[10px] font-bold text-[#9C27B0]">
                      همکاری ۴۰-۶۰٪
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-sm">📍</span>
                    <span
                      className="text-[10px]"
                      style={{ color: colors.textSecondary }}
                    >
                      تهران، سعادت‌آباد
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ۵. کارت آمار نمونه */}
        <section>
          <SectionHeader
            icon={<FiTrendingUp size={18} />}
            iconColor="#4CAF50"
            title="آمار نمونه (StatsCard)"
          />
          <Card variant="elevated" padding={16} radius={20}>
            <div className="flex items-center">
              <StatsCard
                icon="⭐"
                label="امتیاز"
                value="۴.۹"
                subtitle="۱۴۲ نظر"
                color="#FFC107"
                variant="compact"
              />
              <div
                className="w-px h-[50px] mx-2"
                style={{ backgroundColor: colors.border }}
              />
              <StatsCard
                icon="💆‍♀️"
                label="خدمات"
                value="۲۴"
                subtitle="فعال"
                color="#4CAF50"
                variant="compact"
              />
              <div
                className="w-px h-[50px] mx-2"
                style={{ backgroundColor: colors.border }}
              />
              <StatsCard
                icon="🏆"
                label="عضویت"
                value="۲ سال"
                subtitle="در زیبانو"
                color="#2196F3"
                variant="compact"
              />
            </div>
          </Card>
        </section>

        {/* ۶. StarRating نمونه */}
        <section>
          <SectionHeader
            icon={<FiStar size={18} />}
            iconColor="#FFC107"
            title="امتیازدهی (StarRating)"
          />
          <Card variant="elevated" padding={16} radius={16}>
            <div className="flex flex-col gap-4">
              <div>
                <span className="text-[13px] font-bold block mb-2" style={{ color: colors.textMain }}>
                  فقط نمایش:
                </span>
                <StarRating value={4.5} size="lg" showLabel />
              </div>
              <Divider spacing={8} />
              <div>
                <span className="text-[13px] font-bold block mb-2" style={{ color: colors.textMain }}>
                  تعاملی (کلیک کنید):
                </span>
                <StarRating
                  value={3}
                  size="lg"
                  interactive
                  onRate={(r) => showToast(`امتیاز ${r} ثبت شد`, 'success')}
                />
              </div>
            </div>
          </Card>
        </section>
      </div>

      {/* Bottom Tab Bar */}
      <div
        className="fixed bottom-4 left-4 right-4 h-[65px] rounded-[20px] flex items-center justify-around px-2 shadow-xl z-40"
        style={{
          backgroundColor: colors.cardBackground,
          boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
        }}
      >
        {[
          { icon: FiHome, label: 'خانه', active: true },
          { icon: FiGrid, label: 'ویترین', active: false },
          { icon: FiPlusCircle, label: 'ثبت سالن', active: false },
          { icon: FiCreditCard, label: 'مدیریت', active: false },
          { icon: FiUser, label: 'پروفایل', active: false },
        ].map((tab, i) => {
          const Icon = tab.icon;
          return (
            <button
              key={i}
              onClick={() => showToast(`تب ${tab.label}`, 'info')}
              className="flex flex-col items-center gap-0.5 py-1 px-3"
            >
              <Icon
                size={24}
                style={{ color: tab.active ? colors.primary : colors.textSecondary }}
              />
              <span
                className="text-[10px] font-medium"
                style={{ color: tab.active ? colors.primary : colors.textSecondary }}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* BottomSheet فیلتر */}
      <BottomSheet
        visible={filterVisible}
        onClose={() => setFilterVisible(false)}
        title="فیلتر موقعیت مکانی"
        snapPoint={0.7}
      >
        <div className="flex flex-col gap-4 p-2">
          <div className="flex items-start gap-2 p-3 rounded-xl border" style={{
            backgroundColor: '#2196F30A',
            borderColor: '#2196F325',
          }}>
            <span className="text-lg">ℹ️</span>
            <span className="text-[12px] flex-1 leading-[19px]" style={{ color: colors.textSecondary }}>
              استان و شهر موردنظر خود را انتخاب کنید
            </span>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-[13px] font-medium" style={{ color: colors.textMain }}>
              استان
            </span>
            <div className="flex flex-wrap gap-2">
              {['تهران', 'البرز', 'اصفهان', 'فارس', 'خراسان'].map((p) => (
                <Chip key={p} label={p} selected={p === 'تهران'} onPress={() => {}} />
              ))}
            </div>
          </div>

          <Button
            title="اعمال فیلتر"
            onPress={() => {
              setFilterVisible(false);
              showToast('فیلتر اعمال شد', 'success');
            }}
            fullWidth
          />
        </div>
      </BottomSheet>
    </div>
  );
}