// src/app/business/BusinessDetailsClient.jsx
'use client';
import { useState, useCallback, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { useTheme } from '@/stores/useThemeStore';
import { useToast } from '@/hooks/useToast';
import { usePriceListStore } from '@/stores/usePriceListStore';
import ScreenWrapper from '@/components/common/ScreenWrapper';
import BusinessHero from '@/components/home/BusinessHero';
import BusinessInfoCard from '@/components/home/BusinessInfoCard';
import BusinessTabs from '@/components/home/BusinessTabs';
import ServiceBookingCard from '@/components/home/ServiceBookingCard';
import PortfolioGrid from '@/components/home/PortfolioGrid';
import BusinessAbout from '@/components/home/BusinessAbout';
import HonorMedalsSection from './HonorMedalsSection';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import EmptyState from '@/components/common/EmptyState';
import { businessesService, portfoliosService } from '@/api';
import { useAuth } from '@/stores/useAuthStore';
import { useFavoriteStore } from '@/stores/useFavoriteStore';

const BookingModal = dynamic(() => import('@/components/booking/BookingModal'), { ssr: false });
const PortfolioModal = dynamic(() => import('@/components/home/PortfolioModal'), { ssr: false });
const PriceListMenu = dynamic(() => import('@/components/priceList/PriceListMenu'), { ssr: false });

const mapServiceToPriceList = (s) => ({
  id: s.id,
  name: s.name,
  typeName: s.typeName || s.type_name || '',
  typeId: s.typeId || s.type_id || '',
  originalPrice: s.originalPrice ?? s.original_price ?? s.price ?? 0,
  discountPercent: s.discountPercent ?? s.discount_percent ?? s.discount ?? 0,
  finalPrice: s.finalPrice ?? s.final_price ?? s.price ?? 0,
  hasDeposit: s.hasDeposit ?? s.has_deposit ?? false,
  depositAmount: s.depositAmount ?? s.deposit_amount ?? 0,
});

export default function BusinessDetailsClient({ businessSlug }) {
  const { colors } = useTheme();
  const router = useRouter();
  const { showToast } = useToast();
  const { isAuthenticated, requireAuth } = useAuth();
  const [business, setBusiness] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('services');
  const [bookingModalVisible, setBookingModalVisible] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const isBusinessFavorited = useFavoriteStore((s) => s.isBusinessFavorited);
  const toggleBusinessFavorite = useFavoriteStore((s) => s.toggleBusinessFavorite);
  const [activePortfolio, setActivePortfolio] = useState(null);
  const [portfolioModalVisible, setPortfolioModalVisible] = useState(false);

  const isFavorite = business?.id ? isBusinessFavorited(business.id) : false;
  const priceListFromStore = usePriceListStore((s) => s.lists[business?.id]);
  const fetchPriceList = usePriceListStore((s) => s.fetchPriceList);

  // ✅ اصلاح ۱: استفاده از businessSlug برای دریافت اطلاعات
  useEffect(() => {
    if (!businessSlug) return;
    const fetchBusiness = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await businessesService.getPublicBusiness(businessSlug);
        const b = response.data;
        const businessData = {
          id: b.id,
          name: b.name,
          category: b.category?.name || b.categoryName || '',
          city: b.city?.name || b.cityName || '',
          address: b.address,
          phone: b.phone,
          workingHours: b.workingHours,
          about: b.about,
          rating: b.rating,
          reviewsCount: b.reviewsCount || 0,
          VIP: b.isVip || false,
          logo: b.logo || null,
          coverUrl: b.coverImage || null,
          ownerPhoto: b.ownerPhoto || null,
          ownerName: b.ownerName || '',
          verifiedName: b.verifiedName || '',
          bookingSlug: b.bookingSlug || '',
          latitude: b.latitude,
          longitude: b.longitude,
          gallery: (b.gallery || []).map((img) => img.imageUrl || img.image || img),
          services: (b.services || []).map((s) => ({
            id: s.id,
            name: s.name,
            typeId: s.subService?.typeId || s.typeId || '',
            typeName: s.subService?.name || s.typeName || '',
            originalPrice: s.originalPrice ?? 0,
            discountPercent: s.discountPercent ?? 0,
            finalPrice: s.finalPrice ?? s.originalPrice ?? 0,
            duration: s.duration || 60,
            hasDeposit: s.hasDeposit ?? false,
            depositAmount: s.depositAmount ?? 0,
            isActive: s.isActive ?? true,
          })),
          portfolios: [],
        };
        setBusiness(businessData);
      } catch (err) {
        console.error('Failed to fetch business:', err);
        setError(err);
        showToast('خطا در بارگذاری اطلاعات کسب‌وکار', 'error');
      } finally {
        setIsLoading(false);
      }
    };
    fetchBusiness();
  }, [businessSlug, showToast]);

  useEffect(() => {
    if (!business?.id) return;
    const fetchPortfolios = async () => {
      try {
        const result = await portfoliosService.getPortfolios({ business_id: business.id });
        const portfolios = (result.data || []).map((p) => ({
          id: p.id,
          title: p.title,
          description: p.description,
          coverImage: p.cover_image || p.coverImage,
          images: (p.images || []).map((img) => img.image || img),
        }));
        setBusiness((prev) => (prev ? { ...prev, portfolios } : prev));
      } catch (err) {
        console.error('Failed to fetch portfolios:', err);
      }
    };
    fetchPortfolios();
  }, [business?.id]);

  useEffect(() => {
    if (business?.id) {
      fetchPriceList(business.id).catch(() => {});
    }
  }, [business?.id, fetchPriceList]);

  const priceListSettings = useMemo(() => {
    const storeList = priceListFromStore;
    if (storeList) {
      if ((!storeList.services || storeList.services.length === 0) && business?.services?.length) {
        return {
          ...storeList,
          services: business.services
            .filter((s) => s.isActive !== false)
            .map(mapServiceToPriceList),
        };
      }
      return storeList;
    }
    if (business?.services?.length) {
      return {
        businessId: business.id,
        themeId: 'classic',
        isPublished: true,
        services: business.services.filter((s) => s.isActive !== false).map(mapServiceToPriceList),
      };
    }
    return null;
  }, [priceListFromStore, business]);

  const showPrices =
    priceListSettings?.isPublished === true && (priceListSettings?.services?.length ?? 0) > 0;

  const openBooking = useCallback(
    (service) => {
      requireAuth(() => {
        setSelectedService(service);
        setBookingModalVisible(true);
      });
    },
    [requireAuth]
  );

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

  // ✅ اصلاح ۲: استفاده از business.id به جای businessId برای اکشن‌ها
  const toggleFavorite = useCallback(async () => {
    if (!isAuthenticated) {
      requireAuth(() => {});
      return;
    }
    if (!business?.id) return; // اگر هنوز آی‌دی لود نشده کاری نکن
    try {
      const newState = await toggleBusinessFavorite(business.id, {
        id: business.id,
        name: business?.name,
        category: business?.category,
        city: business?.city,
        logo: business?.logo,
      });
      showToast(newState ? 'به علاقه‌مندی‌ها اضافه شد' : 'از علاقه‌مندی‌ها حذف شد', 'success');
    } catch (err) {
      showToast(err.message || 'خطا در عملیات', 'error');
    }
  }, [isAuthenticated, requireAuth, toggleBusinessFavorite, business, showToast]);

  const goBack = useCallback(() => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back();
    } else {
      router.push('/');
    }
  }, [router]);

  const openMap = useCallback(
    () => router.push(`/business/map?slug=${businessSlug}`),
    [router, businessSlug]
  );

  if (isLoading) {
    return (
      <ScreenWrapper>
        <div className="flex items-center justify-center min-h-[60vh]">
          <LoadingSpinner label="در حال بارگذاری..." />
        </div>
      </ScreenWrapper>
    );
  }

  if (error || !business) {
    return (
      <ScreenWrapper>
        <div className="flex items-center justify-center min-h-[60vh]">
          <EmptyState
            icon="🔍"
            title="کسب‌وکار یافت نشد"
            description="این کسب‌وکار ممکن است حذف شده باشد"
            actionLabel="بازگشت به خانه"
            onAction={() => router.push('/')}
          />
        </div>
      </ScreenWrapper>
    );
  }

  const gallery = (business.gallery || []).map((img) => img.image_url || img.image || img);
  const services = business.services || [];
  const portfolios = business.portfolios || [];

  return (
    <ScreenWrapper padding={0}>
      <div className="overflow-y-auto pb-[220px]">
        <BusinessHero
          logo={business.logo}
          coverUrl={business.coverUrl}
          ownerPhoto={business.ownerPhoto}
          gallery={gallery}
          businessId={business.id}
          businessName={business.name}
          onBackPress={goBack}
          isFavorite={isFavorite}
          onFavoritePress={toggleFavorite}
        />
        <BusinessInfoCard business={business} onMapPress={openMap} />
        <BusinessTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          colors={colors}
          showPrices={showPrices}
        />
        <div className="px-5 pt-1">
          {activeTab === 'services' && (
            <div className="flex flex-col gap-3 pb-2">
              {services.map((service) => (
                <ServiceBookingCard key={service.id} service={service} onBook={openBooking} />
              ))}
            </div>
          )}
          {activeTab === 'prices' && priceListSettings && (
            <PriceListMenu
              businessName={business.name}
              businessLogo={business.logo}
              settings={priceListSettings}
            />
          )}
          {activeTab === 'honors' && <HonorMedalsSection businessId={business.id} />}
          {activeTab === 'portfolio' && (
            <PortfolioGrid portfolios={portfolios} onPortfolioPress={openPortfolio} />
          )}
          {activeTab === 'about' && <BusinessAbout business={business} />}
        </div>
      </div>

      {/* ✅ اصلاح ۳: ارسال business.id به مودال رزرو */}
      <BookingModal
        visible={bookingModalVisible}
        onClose={closeBooking}
        service={selectedService}
        businessId={business?.id}
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
