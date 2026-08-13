// src/app/business/[id]/BusinessDetailsClient.jsx
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
import HonorMedalsSection from './HonorMedalsSection';
import PriceListMenu from '@/components/priceList/PriceListMenu';
import { usePriceListStore } from '@/stores/usePriceListStore';
import { MOCK_BUSINESS } from '@/data/businesses';

// ✅ Lazy Load
const BookingModal = dynamic(() => import('@/components/booking/BookingModal'), {
  ssr: false,
  loading: () => null,
});
const PortfolioModal = dynamic(() => import('@/components/home/PortfolioModal'), {
  ssr: false,
  loading: () => null,
});

export default function BusinessDetailsPage() {
  const { colors } = useTheme();
  const router = useRouter();
  const biz = MOCK_BUSINESS;

  // ✅ لیست قیمت (فقط اگر منتشر شده)
  const priceList = usePriceListStore((s) => s.lists[biz.id]);
  const showPrices = Boolean(priceList?.isPublished);

  const [activeTab, setActiveTab] = useState('services');
  const [bookingModalVisible, setBookingModalVisible] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [portfolioModalVisible, setPortfolioModalVisible] = useState(false);
  const [activePortfolio, setActivePortfolio] = useState(null);

  const minServicePrice = useMemo(() => {
    if (!biz.services?.length) return 0;
    return Math.min(...biz.services.map((s) => s.price));
  }, [biz.services]);

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

  const renderTabContent = () => {
    switch (activeTab) {
      case 'services':
        // ✅ هر خدمت یک کارت جدا با دکمه رزرو تمام‌عرض چسبیده
        return (
          <div className="flex flex-col gap-3 pb-2">
            {biz.services.map((service) => (
              <ServiceBookingCard key={service.id} service={service} onBook={openBooking} />
            ))}
          </div>
        );
      case 'prices':
        return showPrices ? (
          <PriceListMenu businessName={biz.name} businessLogo={biz.logo} settings={priceList} />
        ) : null;
      case 'honors':
        return <HonorMedalsSection businessId={biz.id} />;
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
      <div className="overflow-y-auto pb-[220px]">
        <BusinessHero
          gallery={biz.gallery}
          businessId={biz.id}
          businessName={biz.name}
          onBackPress={goBack}
          isFavorite={isFavorite}
          onFavoritePress={toggleFavorite}
        />
        <BusinessInfoCard business={biz} onMapPress={openMap} />
        <BusinessTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          colors={colors}
          showPrices={showPrices}
        />
        <div className="px-5 pt-1">{renderTabContent()}</div>
      </div>

      <BookingModal
        visible={bookingModalVisible}
        onClose={closeBooking}
        service={selectedService}
      />
      <PortfolioModal
        visible={portfolioModalVisible}
        onClose={closePortfolio}
        portfolio={activePortfolio}
      />
    </ScreenWrapper>
  );
}
