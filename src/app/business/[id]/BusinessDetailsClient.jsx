'use client';
import { useState, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { useTheme } from '@/stores/useThemeStore';
import ScreenWrapper from '@/components/common/ScreenWrapper';
import BusinessHero from '@/components/home/BusinessHero';
import BusinessInfoCard from '@/components/home/BusinessInfoCard';
import BusinessTabs from '@/components/home/BusinessTabs';
import ServiceBookingCard from '@/components/home/ServiceBookingCard';
import PortfolioGrid from '@/components/home/PortfolioGrid';
import BusinessAbout from '@/components/home/BusinessAbout';
import BusinessMapButton from '@/components/home/BusinessMapButton';
import { MOCK_BUSINESS } from '@/data/businesses';
import { MOCK_BUSINESSES_LIST, MOCK_BUSINESSES_MAP } from '@/data/businesses';

// ✅ Lazy Load — مودال‌های سنگین فقط وقتی لازم شوند لود می‌شوند
const BookingModal = dynamic(() => import('@/components/booking/BookingModal'), {
  ssr: false,
  loading: () => null,
});

const PortfolioModal = dynamic(() => import('@/components/home/PortfolioModal'), {
  ssr: false,
  loading: () => null,
});

// ✅ اضافه کردن generateStaticParams برای Static Export
export async function generateStaticParams() {
  // لیست تمام ID‌های موجود در داده‌های MOCK
  const allIds = [...MOCK_BUSINESSES_LIST.map((b) => b.id), ...Object.keys(MOCK_BUSINESSES_MAP)];
  // حذف موارد تکراری
  const uniqueIds = [...new Set(allIds)];

  return uniqueIds.map((id) => ({
    id: id.toString(),
  }));
}

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

  // ─── Handlers (useCallback) ───
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
              <ServiceBookingCard key={service.id} service={service} onBook={openBooking} />
            ))}
          </div>
        );
      case 'portfolio':
        return <PortfolioGrid portfolios={biz.portfolios} onPortfolioPress={openPortfolio} />;
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
        <BusinessTabs activeTab={activeTab} onTabChange={setActiveTab} colors={colors} />

        {/* ─── 5. Tab Content ─── */}
        <div className="px-5 pt-1">{renderTabContent()}</div>
      </div>

      {/* ═══ Booking Modal (Lazy) ═══ */}
      <BookingModal
        visible={bookingModalVisible}
        onClose={closeBooking}
        service={selectedService}
      />

      {/* ═══ Portfolio Modal (Lazy) ═══ */}
      <PortfolioModal
        visible={portfolioModalVisible}
        onClose={closePortfolio}
        portfolio={activePortfolio}
      />
    </ScreenWrapper>
  );
}
