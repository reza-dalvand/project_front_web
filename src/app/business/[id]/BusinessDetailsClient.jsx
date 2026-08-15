// src/app/business/[id]/BusinessDetailsClient.jsx
'use client';
import { useState, useCallback, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { useTheme } from '@/stores/useThemeStore';
import { useToast } from '@/hooks/useToast';
import ScreenWrapper from '@/components/common/ScreenWrapper';
import BusinessHero from '@/components/home/BusinessHero';
import BusinessInfoCard from '@/components/home/BusinessInfoCard';
import BusinessTabs from '@/components/home/BusinessTabs';
import ServiceBookingCard from '@/components/home/ServiceBookingCard';
import PortfolioGrid from '@/components/home/PortfolioGrid';
import BusinessAbout from '@/components/home/BusinessAbout';
import HonorMedalsSection from './HonorMedalsSection';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { businessesService } from '@/api';
import { USE_MOCK } from '@/api/config';
import { MOCK_BUSINESS } from '@/data/businesses';

const BookingModal = dynamic(() => import('@/components/booking/BookingModal'), { ssr: false });
const PortfolioModal = dynamic(() => import('@/components/home/PortfolioModal'), { ssr: false });
const PriceListMenu = dynamic(() => import('@/components/priceList/PriceListMenu'), { ssr: false });

export default function BusinessDetailsPage() {
  const { colors } = useTheme();
  const router = useRouter();
  const params = useParams();
  const { showToast } = useToast();

  const [business, setBusiness] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('services');
  const [bookingModalVisible, setBookingModalVisible] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [portfolioModalVisible, setPortfolioModalVisible] = useState(false);
  const [activePortfolio, setActivePortfolio] = useState(null);

  // ═══════ دریافت جزئیات از API ═══════
  useEffect(() => {
    const fetchBusiness = async () => {
      setIsLoading(true);
      try {
        if (!USE_MOCK) {
          const response = await businessesService.getPublicBusiness(params.id);
          const b = response.data;

          // تبدیل فرمت بک‌اند به فرمت فرانت
          const businessData = {
            id: b.id,
            name: b.name,
            category: b.category?.name || '',
            city: b.city?.name || '',
            address: b.address,
            phone: b.phone,
            workingHours: b.workingHours,
            about: b.about,
            rating: b.rating,
            reviewsCount: b.reviewsCount,
            VIP: b.is_vip,
            logo: b.logo,
            coverUrl: b.coverImage,
            ownerPhoto: b.ownerPhoto,
            ownerName: b.ownerName,
            verifiedName: b.verifiedName,
            bookingSlug: b.bookingSlug,
            latitude: b.latitude,
            longitude: b.longitude,
            gallery: (b.gallery || []).map((img) => img.image_url || img.image),
            services: b.services || [],
            portfolios: [], // جداگانه دریافت شود
          };

          setBusiness(businessData);
        } else {
          setBusiness(MOCK_BUSINESS);
        }
      } catch (error) {
        console.error('Failed to fetch business:', error);
        showToast('خطا در بارگذاری اطلاعات کسب‌وکار', 'error');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBusiness();
  }, [params.id, showToast]);

  const openBooking = useCallback((service) => {
    setSelectedService(service);
    setBookingModalVisible(true);
  }, []);

  const closeBooking = useCallback(() => {
    setBookingModalVisible(false);
    setSelectedService(null);
  }, []);

  const openPortfolio = useCallback((portfolio) => {
    setActivePortfolio(portfolio);
    setPortfolioModalVisible(true);
  }, []);

  const closePortfolio = useCallback(() => {
    setPortfolioModalVisible(false);
    setActivePortfolio(null);
  }, []);

  const toggleFavorite = useCallback(() => setIsFavorite((prev) => !prev), []);
  const goBack = useCallback(() => router.back(), [router]);
  const openMap = useCallback(() => router.push(`/business/${params.id}/map`), [router, params.id]);

  if (isLoading) {
    return (
      <ScreenWrapper>
        <div className="flex items-center justify-center min-h-[60vh]">
          <LoadingSpinner label="در حال بارگذاری..." />
        </div>
      </ScreenWrapper>
    );
  }

  if (!business) {
    return (
      <ScreenWrapper>
        <div className="flex items-center justify-center min-h-[60vh]">
          <p style={{ color: colors.textMain }}>کسب‌وکار یافت نشد</p>
        </div>
      </ScreenWrapper>
    );
  }

  // تبدیل گالری از فرمت API به فرمت کامپوننت
  const gallery = (business.gallery || []).map((img) => img.image_url || img.image || img);
  const services = business.services || [];
  const portfolios = business.portfolios || [];

  return (
    <ScreenWrapper padding={0}>
      <div className="overflow-y-auto pb-[220px]">
        <BusinessHero
          gallery={gallery}
          businessId={business.id}
          businessName={business.name}
          onBackPress={goBack}
          isFavorite={isFavorite}
          onFavoritePress={toggleFavorite}
        />
        <BusinessInfoCard business={business} onMapPress={openMap} />
        <BusinessTabs activeTab={activeTab} onTabChange={setActiveTab} colors={colors} />
        <div className="px-5 pt-1">
          {activeTab === 'services' && (
            <div className="flex flex-col gap-3 pb-2">
              {services.map((service) => (
                <ServiceBookingCard key={service.id} service={service} onBook={openBooking} />
              ))}
            </div>
          )}
          {activeTab === 'honors' && <HonorMedalsSection businessId={business.id} />}
          {activeTab === 'portfolio' && (
            <PortfolioGrid portfolios={portfolios} onPortfolioPress={openPortfolio} />
          )}
          {activeTab === 'about' && <BusinessAbout business={business} />}
        </div>
      </div>

      <BookingModal
        visible={bookingModalVisible}
        onClose={closeBooking}
        service={selectedService}
        businessId={business?.id || params.id}
        businessName={business?.name || ''}
      />
      <PortfolioModal
        visible={portfolioModalVisible}
        onClose={closePortfolio}
        portfolio={activePortfolio}
      />
    </ScreenWrapper>
  );
}
