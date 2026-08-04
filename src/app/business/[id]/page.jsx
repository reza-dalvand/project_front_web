'use client';

import { useState, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/stores/useThemeStore';
import ScreenWrapper from '@/components/common/ScreenWrapper';
import BusinessHero from '@/components/home/BusinessHero';
import BusinessInfoCard from '@/components/home/BusinessInfoCard';
import BusinessTabs from '@/components/home/BusinessTabs';
import ServiceBookingCard from '@/components/home/ServiceBookingCard';
import PortfolioGrid from '@/components/home/PortfolioGrid';
import PortfolioModal from '@/components/home/PortfolioModal';
import BusinessAbout from '@/components/home/BusinessAbout';
import BookingModal from '@/components/booking/BookingModal';
import BusinessMapButton from '@/components/home/BusinessMapButton';
import StickyBookingBar from '@/components/home/StickyBookingBar';

// ═══════════════════════════════════════════════════════
//                    MOCK DATA
// ═══════════════════════════════════════════════════════
const MOCK_BUSINESS = {
  id: '1',
  name: 'مجموعه زیبایی و سلامت نیلارام',
  ownerName: 'مریم حسینی',
  ownerVerified: true,
  memberSince: '۲ سال',
  category: 'کلینیک پوست و مو',
  city: 'تهران، سعادت‌آباد',
  address: 'سعادت‌آباد، خیابان سرو غربی، ساختمان پزشکان نگین، طبقه ۳',
  phone: '۰۲۱-۲۲۳۳۴۴۵۵',
  workingHours: 'شنبه تا پنج‌شنبه: ۱۰:۰۰ الی ۲۰:۰۰',
  location: {
    latitude: 35.7898,
    longitude: 51.3768,
  },
  rating: 4.9,
  reviewsCount: 142,
  servicesCount: 24,
  VIP: true,
  logo: 'https://picsum.photos/150?random=21',
  gallery: [
    'https://picsum.photos/800/600?random=45',
    'https://picsum.photos/800/600?random=46',
    'https://picsum.photos/800/600?random=47',
    'https://picsum.photos/800/600?random=48',
  ],
  about:
    'مجموعه نیلارام با بیش از ۱۰ سال سابقه درخشان در زمینه خدمات تخصصی پوست، فیشیال، مژه و ناخن، با کادری مجرب و محیطی کاملاً بهداشتی و آرامش‌بخش میزبان شما بانوان عزیز است.',
  services: [
    {
      id: 's1',
      name: 'فیشیال تخصصی و پاکسازی پوست',
      typeId: 'facial',
      price: 750000,
      originalPrice: 850000,
      discount: 12,
      duration: 60,
    },
    {
      id: 's2',
      name: 'کاشت مژه هالیوودی (تار به تار)',
      typeId: 'eyelash',
      price: 580000,
      originalPrice: 580000,
      discount: 0,
      duration: 90,
    },
    {
      id: 's3',
      name: 'ژلیش و پدیکور VIP پا',
      typeId: 'nail',
      price: 320000,
      originalPrice: 380000,
      discount: 15,
      duration: 45,
    },
    {
      id: 's4',
      name: 'کراتینه و احیای موهای آسیب‌دیده',
      typeId: 'keratin',
      price: 1800000,
      originalPrice: 1900000,
      discount: 5,
      duration: 120,
    },
  ],
  portfolios: [
    {
      id: 'pf1',
      title: 'فیشیال VIP عروس',
      coverImage: 'https://picsum.photos/400/400?random=60',
      images: [
        'https://picsum.photos/800/800?random=60',
        'https://picsum.photos/800/800?random=160',
        'https://picsum.photos/800/800?random=260',
      ],
      description:
        'فیشیال تخصصی عروس با استفاده از بهترین محصولات روز دنیا.',
    },
    {
      id: 'pf2',
      title: 'کاشت ناخن ژلیش',
      coverImage: 'https://picsum.photos/400/400?random=61',
      images: [
        'https://picsum.photos/800/800?random=61',
        'https://picsum.photos/800/800?random=161',
      ],
      description: 'کاشت ناخن با طراحی مینیمال و ژلیش ماندگار تا ۳ هفته.',
    },
    {
      id: 'pf3',
      title: 'میکاپ و شینیون عروس',
      coverImage: 'https://picsum.photos/400/400?random=62',
      images: [
        'https://picsum.photos/800/800?random=62',
        'https://picsum.photos/800/800?random=162',
        'https://picsum.photos/800/800?random=262',
        'https://picsum.photos/800/800?random=362',
      ],
      description: 'میکاپ حرفه‌ای عروس با سبک اروپایی و شینیون مدرن.',
    },
    {
      id: 'pf4',
      title: 'لیزر موهای زائد',
      coverImage: 'https://picsum.photos/400/400?random=63',
      images: ['https://picsum.photos/800/800?random=63'],
      description: 'لیزر با دستگاه الکساندرایت ۲۰۲۴ - بدون درد و ماندگار.',
    },
  ],
};

export default function BusinessDetailsPage() {
  const { colors } = useTheme();
  const router = useRouter();
  const biz = MOCK_BUSINESS;

  // ─── State Management ───
  const [activeTab, setActiveTab] = useState('services');
  const [bookingModalVisible, setBookingModalVisible] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [portfolioModalVisible, setPortfolioModalVisible] = useState(false);
  const [activePortfolio, setActivePortfolio] = useState(null);

  // ─── Derived Values ───
  const minServicePrice = useMemo(() => {
    if (!biz.services?.length) return 0;
    return Math.min(...biz.services.map((s) => s.price));
  }, [biz.services]);

  // ─── Handlers ───
  const openBooking = useCallback((service) => {
    setSelectedService(service);
    setBookingModalVisible(true);
  }, []);

  const closeBooking = useCallback(() => {
    setBookingModalVisible(false);
    setSelectedService(null);
  }, []);

  const openPortfolio = useCallback((portfolio, index = 0) => {
    setActivePortfolio(portfolio);
    setPortfolioModalVisible(true);
  }, []);

  const closePortfolio = useCallback(() => {
    setPortfolioModalVisible(false);
    setActivePortfolio(null);
  }, []);

  const toggleFavorite = useCallback(() => {
    setIsFavorite((prev) => !prev);
  }, []);

  const goBack = useCallback(() => {
    router.back();
  }, [router]);

  const openMap = useCallback(() => {
    router.push(`/business/${biz.id}/map`);
  }, [router, biz.id]);

  // ─── Tab Content Renderer ───
  const renderTabContent = () => {
    switch (activeTab) {
      case 'services':
        return (
          <div className="flex flex-col gap-3 pb-2">
            {biz.services.map((service) => (
              <ServiceBookingCard
                key={service.id}
                service={service}
                onBook={openBooking}
              />
            ))}
          </div>
        );
      case 'portfolio':
        return (
          <PortfolioGrid
            portfolios={biz.portfolios}
            onPortfolioPress={openPortfolio}
          />
        );
      case 'about':
        return <BusinessAbout business={biz} />;
      default:
        return null;
    }
  };

  return (
    <ScreenWrapper padding={0}>
      {/* ═══ Main Scrollable Content ═══ */}
      <div className="overflow-y-auto pb-[220px]">
        {/* ─── 1. Hero Gallery ─── */}
        <BusinessHero
          gallery={biz.gallery}
          businessId={biz.id}
          businessName={biz.name}
          onBackPress={goBack}
          isFavorite={isFavorite}
          onFavoritePress={toggleFavorite}
        />

        {/* ─── 2. Business Info Card ─── */}
        <BusinessInfoCard business={biz} />

        {/* ─── 3. Map Button ─── */}
        <div className="px-5 mt-3">
          <BusinessMapButton business={biz} onPress={openMap} />
        </div>

        {/* ─── 4. Tabs ─── */}
        <BusinessTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          colors={colors}
        />

        {/* ─── 5. Tab Content ─── */}
        <div className="px-5 pt-1">{renderTabContent()}</div>
      </div>

      {/* ═══ Sticky Booking Bar ═══ */}
      <StickyBookingBar minPrice={minServicePrice} onBookPress={openBooking} />

      {/* ═══ Booking Modal ═══ */}
      <BookingModal
        visible={bookingModalVisible}
        onClose={closeBooking}
        service={selectedService}
      />

      {/* ═══ Portfolio Modal ═══ */}
      <PortfolioModal
        visible={portfolioModalVisible}
        onClose={closePortfolio}
        portfolio={activePortfolio}
      />
    </ScreenWrapper>
  );
}