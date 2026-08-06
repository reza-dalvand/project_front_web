'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  FiZap,
  FiGrid,
  FiUser,
  FiUserPlus,
  FiArrowLeft,
  FiStar,
  FiCalendar,
  FiTrendingUp,
  FiAward,
  FiCreditCard,
} from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import { useAuth, useAuthModal } from '@/stores/useAuth';
import { useReviewStore } from '@/stores/useReviewStore';
import { SectionHeader, BottomTabBar } from '@/components/common';
import HomeHeader from '@/components/home/HomeHeader';
import AdSlider from '@/components/home/AdSlider';
import CategoryGrid from '@/components/home/CategoryGrid';
import SeeAllButton from '@/components/home/SeeAllButton';
import NotificationModal from '@/components/home/NotificationModal';
import HomeFilterModal from '@/components/home/HomeFilterModal';
import ActiveFiltersBar from '@/components/home/ActiveFiltersBar';
import ReviewModal from '@/components/customer/ReviewModal';
import { useToast } from '@/hooks/useToast';

// ═══════════ داده‌های آگهی‌ها (مشابه اندروید) ═══════════
const MOCK_ADS = [
  {
    id: 1,
    businessId: '1',
    imageUrl: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800',
    title: 'جشنواره تخفیف‌های بهار کلینیک رُز',
    subtitle: 'تا ۳۰٪ تخفیف خدمات پوست',
    badge: 'پیشنهاد ویژه',
  },
  {
    id: 2,
    businessId: '2',
    imageUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800',
    title: 'افتتاحیه سالن زیبایی لاویا',
    subtitle: 'نوبت‌دهی آنلاین با بیعانه اقتصادی',
    badge: 'جدید',
  },
  {
    id: 3,
    businessId: '3',
    imageUrl: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=800',
    title: 'لیزر با جدیدترین دستگاه ۲۰۲۴',
    subtitle: 'مرکز رویال - تخفیف ویژه',
    badge: 'پرفروش',
  },
];

// ═══════════ دسته‌بندی‌ها (مشابه اندروید) ═══════════
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

// ═══════════ فرصت‌های مدلینگ (مشابه اندروید) ═══════════
const MOCK_MODEL_REQUESTS = [
  {
    id: 'mr_1',
    title: 'مدل فیشیال VIP عروس',
    serviceName: 'فیشیال تخصصی پوست',
    serviceImage: 'https://picsum.photos/400/300?random=50',
    businessName: 'کلینیک زیبایی صدف',
    city: 'تهران، سعادت‌آباد',
    costType: 'paid',
    discount: 50,
    isUrgent: true,
  },
  {
    id: 'mr_2',
    title: 'مدل طراحی ناخن ژورنالی',
    serviceName: 'کاشت ناخن',
    serviceImage: 'https://picsum.photos/400/300?random=51',
    businessName: 'ناخن گالری پریا',
    city: 'کرج، فردیس',
    costType: 'material_cost',
    discount: 70,
    isUrgent: false,
  },
  {
    id: 'mr_3',
    title: 'مدل تکنیک بالیاژ فرانسوی',
    serviceName: 'رنگ و لایت مو',
    serviceImage: 'https://picsum.photos/400/300?random=52',
    businessName: 'سالن زیبایی افرا',
    city: 'تهران، نیاوران',
    costType: 'paid',
    discount: 60,
    isUrgent: false,
  },
];

// ═══════════ اجاره لاین (مشابه اندروید) ═══════════
const MOCK_LINE_RENTALS = [
  {
    id: 'lr_1',
    title: 'لاین ناخن VIP با تجهیزات کامل',
    serviceTypeName: 'کاشت ناخن',
    collabType: 'percent',
    priceDisplay: '۴۰-۶۰٪',
    businessName: 'سالن زیبایی نیلارام',
    city: 'تهران، سعادت‌آباد',
    lineImage: 'https://picsum.photos/400/300?random=70',
  },
  {
    id: 'lr_2',
    title: 'لاین میکاپ با نور طبیعی',
    serviceTypeName: 'میکاپ و گریم',
    collabType: 'hourly',
    priceDisplay: '۱۵۰K / ساعت',
    businessName: 'استودیو لاویا',
    city: 'تهران، نیاوران',
    lineImage: 'https://picsum.photos/400/300?random=71',
  },
  {
    id: 'lr_3',
    title: 'لاین لیزر با دستگاه الکس',
    serviceTypeName: 'لیزر موهای زائد',
    collabType: 'fixed',
    priceDisplay: '۸M ماهانه',
    businessName: 'کلینیک رویال',
    city: 'اصفهان',
    lineImage: 'https://picsum.photos/400/300?random=72',
  },
];

// ═══════════ نوبت‌های انجام‌شده برای نظردهی ═══════════
const MOCK_DONE_APPOINTMENTS = [
  {
    id: 'apt_done_1',
    businessName: 'سالن زیبایی نیلارام',
    businessLogo: 'https://picsum.photos/100/100?random=21',
    serviceName: 'فیشیال تخصصی پوست',
    employeeName: 'سارا احمدی',
    date: '۱۴۰۳/۰۴/۱۸',
    time: '۱۰:۳۰',
    status: 'done',
  },
];

export default function HomePage() {
  const router = useRouter();
  const { colors, resolvedTheme, setTheme } = useTheme();
  const { isAuthenticated, user } = useAuth();
  const { requireAuth } = useAuth();
  const { showToast } = useToast();
  const { pendingReviews, addPendingReview } = useReviewStore();

  const isDark = resolvedTheme === 'dark';

  // ─── State‌ها ───
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [notificationVisible, setNotificationVisible] = useState(false);
  const [filterVisible, setFilterVisible] = useState(false);
  const [filters, setFilters] = useState({});
  const [reviewVisible, setReviewVisible] = useState(false);
  const [currentReviewAppointment, setCurrentReviewAppointment] = useState(null);

  const hasActiveFilter = Object.values(filters).some(
    (v) => v && v !== 'all' && v !== 'recommended'
  );

  // ─── افزودن نوبت‌های انجام‌شده به pendingReviews ───
  useEffect(() => {
    MOCK_DONE_APPOINTMENTS.forEach((apt) => {
      addPendingReview(apt);
    });
  }, []);

  // ─── نمایش خودکار مدال نظردهی ───
  useEffect(() => {
    if (pendingReviews.length > 0 && !reviewVisible) {
      const timer = setTimeout(() => {
        setCurrentReviewAppointment(pendingReviews[0]);
        setReviewVisible(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [pendingReviews, reviewVisible]);

  // ─── Handlers ───
  const handleThemeToggle = () => setTheme(isDark ? 'light' : 'dark');

  const handleAdPress = (ad) => {
    if (ad.businessId) {
      router.push(`/business/${ad.businessId}`);
    }
  };

  const handleCategorySelect = (item) => {
    setSelectedCategory(item.id);
    router.push(`/category/${item.id}`);
  };

  const handleModelRequestPress = (request) => {
    router.push(`/model-requests/${request.id}`);
  };

  const handleLineRentalPress = (ad) => {
    router.push(`/line-rentals/${ad.id}`);
  };

  const handleReviewClose = () => {
    setReviewVisible(false);
    setCurrentReviewAppointment(null);
  };

  // ─── تشخیص فیلتر فعال ───
  const hasActiveHomeFilter = Object.values(filters).some((v) => v && v !== 'all');

  return (
    <div className="min-h-screen pb-28" style={{ backgroundColor: colors.background }}>
      {/* ═══════════ هدر ═══════════ */}
      <HomeHeader
        userName={user?.name}
        userAvatar={user?.avatar}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSearchSubmit={() => {
          if (searchQuery.trim()) {
            router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
          }
        }}
        onSearchClick={() => router.push('/search')}
        onFilterPress={() => setFilterVisible(true)}
        hasActiveFilter={hasActiveHomeFilter}
        isDark={isDark}
        onThemeToggle={handleThemeToggle}
        onNotificationPress={() => {
          if (isAuthenticated) {
            setNotificationVisible(true);
          } else {
            requireAuth(() => setNotificationVisible(true));
          }
        }}
        notificationCount={3}
      />

      {/* ═══════════ نوار فیلترهای فعال ═══════════ */}
      <ActiveFiltersBar filters={filters} onChange={setFilters} onClearAll={() => setFilters({})} />

      {/* ═══════════ بنر دعوت به ثبت‌نام (فقط لاگین‌نشده) ═══════════ */}
      {!isAuthenticated && (
        <div
          className="mx-5 mt-3 p-4 rounded-2xl border relative overflow-hidden"
          style={{
            backgroundColor: colors.cardBackground,
            borderColor: colors.border,
          }}
        >
          {/* نقطه‌های تزئینی */}
          <div
            className="absolute -top-3 -left-3 w-16 h-16 rounded-full"
            style={{ backgroundColor: colors.primary + '18' }}
          />
          <div
            className="absolute -bottom-4 -right-4 w-14 h-14 rounded-full"
            style={{ backgroundColor: '#FFC10720' }}
          />

          <div className="flex items-center justify-between gap-3 relative z-10">
            <div className="flex items-center gap-3 flex-1">
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center border"
                style={{
                  backgroundColor: colors.primary + '15',
                  borderColor: colors.primary + '30',
                }}
              >
                <FiZap size={22} color={colors.primary} />
              </div>
              <div className="flex flex-col gap-0.5 flex-1">
                <span className="text-[13px] font-[Vazir-Bold]" style={{ color: colors.textMain }}>
                  امکانات بیشتری می‌خوای؟ ✨
                </span>
                <span className="text-[11px] font-[Vazir]" style={{ color: colors.textSecondary }}>
                  رزرو آنلاین، ساخت آگهی، ذخیره و اشتراک پست‌ها و ...
                </span>
              </div>
            </div>
            <button
              onClick={() => requireAuth()}
              className="flex items-center gap-1 px-4 py-2.5 rounded-xl whitespace-nowrap"
              style={{ backgroundColor: colors.primary }}
            >
              <span className="text-white text-xs font-[Vazir-Bold]">ورود</span>
              <FiArrowLeft size={14} color="#fff" />
            </button>
          </div>
        </div>
      )}

      {/* ═══════════ محتوای اصلی ═══════════ */}
      <div className="px-5 pt-4 flex flex-col gap-6">
        {/* ─── ۱. اسلایدر تبلیغات ─── */}
        <section>
          <SectionHeader
            icon={<FiStar size={18} />}
            iconColor={colors.primary}
            title="پیشنهادات ویژه"
            rightElement={
              <SeeAllButton onPress={() => router.push('/ads')} count={MOCK_ADS.length} />
            }
          />
          <AdSlider ads={MOCK_ADS} onPress={handleAdPress} />
        </section>

        {/* ─── ۲. دسته‌بندی خدمات ─── */}
        <section>
          <SectionHeader icon={<FiGrid size={18} />} iconColor="#FF9800" title="دسته‌بندی خدمات" />
          <CategoryGrid
            categories={MOCK_CATEGORIES}
            selectedId={selectedCategory}
            onSelect={handleCategorySelect}
          />
        </section>

        {/* ─── ۳. فرصت‌های مدلینگ ─── */}
        <section>
          <SectionHeader
            icon={<FiUser size={18} />}
            iconColor="#E91E63"
            title="فرصت‌های مدلینگ"
            subtitle="با تخفیف ویژه مدل شوید و نمونه‌کار بسازید"
            rightElement={
              <SeeAllButton
                onPress={() => router.push('/model-requests')}
                count={MOCK_MODEL_REQUESTS.length}
              />
            }
          />
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide">
            {MOCK_MODEL_REQUESTS.map((request) => (
              <button
                key={request.id}
                onClick={() => handleModelRequestPress(request)}
                className="flex-shrink-0 w-[220px] rounded-[18px] border overflow-hidden text-right"
                style={{
                  backgroundColor: colors.cardBackground,
                  borderColor: colors.border,
                }}
              >
                <div className="relative h-[140px] w-full">
                  <img
                    src={request.serviceImage}
                    alt={request.title}
                    className="w-full h-full object-cover"
                  />
                  {/* Badge نوع هزینه */}
                  <div
                    className="absolute top-2 left-2 px-2.5 py-1 rounded-lg text-[10px] font-[Vazir-Bold] text-white"
                    style={{
                      backgroundColor:
                        request.costType === 'free'
                          ? '#4CAF50'
                          : request.costType === 'paid'
                            ? '#2196F3'
                            : '#FF9800',
                    }}
                  >
                    {request.costType === 'free'
                      ? 'رایگان'
                      : request.costType === 'paid'
                        ? 'با هزینه'
                        : 'هزینه مواد'}
                  </div>
                  {/* Badge فوری */}
                  {request.isUrgent && (
                    <div
                      className="absolute bottom-2 left-2 px-2 py-0.5 rounded-lg text-[9px] font-[Vazir-Bold] text-white"
                      style={{ backgroundColor: 'rgba(255,152,0,0.9)' }}
                    >
                      فوری
                    </div>
                  )}
                </div>
                <div className="p-3 flex flex-col gap-2">
                  <h4
                    className="text-[14px] font-[Vazir-Bold] line-clamp-2 min-h-[40px]"
                    style={{ color: colors.textMain }}
                  >
                    {request.title}
                  </h4>
                  <div className="flex items-center gap-1">
                    <span className="text-sm">🏪</span>
                    <span
                      className="text-[11px] font-[Vazir-Medium]"
                      style={{ color: colors.primary }}
                    >
                      {request.businessName}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-sm">📍</span>
                    <span className="text-[10px]" style={{ color: colors.textSecondary }}>
                      {request.city}
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* ─── ۴. فرصت‌های همکاری / اجاره لاین ─── */}
        <section>
          <SectionHeader
            icon={<FiAward size={18} />}
            iconColor="#667eea"
            title="فرصت‌های همکاری"
            subtitle="با اجاره لاین، کسب‌وکار خود را گسترش دهید"
            rightElement={
              <SeeAllButton
                onPress={() => router.push('/line-rentals')}
                count={MOCK_LINE_RENTALS.length}
              />
            }
          />
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide">
            {MOCK_LINE_RENTALS.map((ad) => (
              <button
                key={ad.id}
                onClick={() => handleLineRentalPress(ad)}
                className="flex-shrink-0 w-[220px] rounded-[18px] border overflow-hidden text-right"
                style={{
                  backgroundColor: colors.cardBackground,
                  borderColor: colors.border,
                }}
              >
                <div className="relative h-[130px] w-full">
                  <img src={ad.lineImage} alt={ad.title} className="w-full h-full object-cover" />
                  <div
                    className="absolute top-2 left-2 px-2.5 py-1 rounded-lg text-[10px] font-[Vazir-Bold] text-white"
                    style={{ backgroundColor: '#667eea' }}
                  >
                    {ad.serviceTypeName}
                  </div>
                </div>
                <div className="p-3 flex flex-col gap-2">
                  <h4
                    className="text-[14px] font-[Vazir-Bold] line-clamp-2 min-h-[40px]"
                    style={{ color: colors.textMain }}
                  >
                    {ad.title}
                  </h4>
                  <div
                    className="inline-flex items-center gap-1 self-start px-2 py-1 rounded-lg text-[10px] font-[Vazir-Bold]"
                    style={{
                      backgroundColor: '#9C27B022',
                      color: '#9C27B0',
                    }}
                  >
                    {ad.collabType === 'percent'
                      ? 'درصدی'
                      : ad.collabType === 'hourly'
                        ? 'ساعتی'
                        : 'اجاره ثابت'}
                    {ad.priceDisplay && ` • ${ad.priceDisplay}`}
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-sm">📍</span>
                    <span className="text-[10px]" style={{ color: colors.textSecondary }}>
                      {ad.city}
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </section>
      </div>

      {/* ═══════════ Bottom Tab Bar ═══════════ */}
      <BottomTabBar />

      {/* ═══════════ مدال اعلان‌ها ═══════════ */}
      <NotificationModal
        visible={notificationVisible}
        onClose={() => setNotificationVisible(false)}
      />

      {/* ═══════════ مدال فیلتر خانه ═══════════ */}
      <HomeFilterModal
        visible={filterVisible}
        onClose={() => setFilterVisible(false)}
        onApply={setFilters}
        currentFilters={filters}
      />

      {/* ═══════════ مدال نظردهی ═══════════ */}
      <ReviewModal
        visible={reviewVisible}
        appointment={currentReviewAppointment}
        onClose={handleReviewClose}
      />
    </div>
  );
}
