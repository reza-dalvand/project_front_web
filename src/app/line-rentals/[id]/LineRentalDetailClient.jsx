// src/app/line-rentals/[id]/LineRentalDetailClient.jsx
'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { FiPhone } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import ScreenWrapper from '@/components/common/ScreenWrapper';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import CollabBadge from '@/components/common/CollabBadge';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import LineRentalHero from '@/components/lineRentals/detail/LineRentalHero';
import LineRentalPriceCard from '@/components/lineRentals/detail/LineRentalPriceCard';
import LineRentalDatesCard from '@/components/lineRentals/detail/LineRentalDatesCard';
import { toPersianDigit } from '@/utils/numberUtils';
import { cleanPhone } from '@/utils/phoneUtils';
import { useToast } from '@/hooks/useToast';
import { adsService } from '@/api';

export default function LineRentalDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { colors } = useTheme();
  const { showToast } = useToast();
  const [rental, setRental] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // ═══ دریافت جزئیات از API ═══
  useEffect(() => {
    const fetchDetail = async () => {
      setIsLoading(true);
      try {
        const result = await adsService.getLineRentalDetail(params.id);
        setRental(result.data);
      } catch (error) {
        console.error('Failed to fetch line rental detail:', error);
        showToast('خطا در بارگذاری جزئیات', 'error');
      } finally {
        setIsLoading(false);
      }
    };
    fetchDetail();
  }, [params.id, showToast]);

  const handleCall = () => {
    if (rental?.contact_phone || rental?.contactPhone) {
      const phone = cleanPhone(rental.contact_phone || rental.contactPhone);
      window.location.href = `tel:${phone}`;
    } else {
      showToast('شماره تماسی ثبت نشده است', 'error');
    }
  };

  const handleShare = async () => {
    const shareMessage = `🏢 ${rental?.title || ''}
🏪 ${rental?.business_name || rental?.businessName || ''}
🔗 ${typeof window !== 'undefined' ? window.location.href : ''}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: rental?.title || 'آگهی لاین',
          text: shareMessage,
          url: typeof window !== 'undefined' ? window.location.href : undefined,
        });
        return;
      } catch (err) {
        if (err?.name === 'AbortError') return;
      }
    }
    try {
      await navigator.clipboard.writeText(shareMessage);
      showToast('لینک کپی شد', 'success');
    } catch {
      showToast('امکان کپی وجود ندارد', 'error');
    }
  };

  if (isLoading) {
    return (
      <ScreenWrapper>
        <div className="flex justify-center py-20">
          <LoadingSpinner label="در حال بارگذاری..." />
        </div>
      </ScreenWrapper>
    );
  }

  if (!rental) {
    return (
      <ScreenWrapper>
        <div className="flex flex-col items-center py-20 gap-3">
          <span className="text-4xl">🔍</span>
          <p className="text-base font-[Vazir-Bold]" style={{ color: colors.textMain }}>
            آگهی یافت نشد
          </p>
        </div>
      </ScreenWrapper>
    );
  }

  const collabType = rental.collab_type || rental.collabType;
  const businessName = rental.business_name || rental.businessName;
  const city = rental.city || '';
  const description = rental.description || '';
  const contactPhone = rental.contact_phone || rental.contactPhone;
  const createdAt = rental.created_jalali || rental.createdAt || '';
  const expiresAt = rental.expires_jalali || rental.expiresAt || '';
  const serviceTypeName = rental.service_category_name || rental.serviceTypeName || '';
  const subServiceName = rental.sub_service_name || '';
  const percentSalon = rental.percent_salon || rental.percentSalon;
  const percentPartner = rental.percent_partner || rental.percentPartner;
  const fixedAmount = rental.fixed_amount || rental.fixedAmount;
  const fixedDeposit = rental.fixed_deposit || rental.fixedDeposit;
  const hourlyRate = rental.hourly_rate || rental.hourlyRate;

  const getPriceDisplay = () => {
    if (collabType === 'percent') {
      return `${toPersianDigit(percentSalon)}-${toPersianDigit(percentPartner)}٪`;
    }
    if (collabType === 'fixed') {
      let text = `${toPersianDigit((fixedAmount || 0).toLocaleString('en-US'))} تومان`;
      if (fixedDeposit > 0) {
        text += ` + ${toPersianDigit(fixedDeposit.toLocaleString('en-US'))} رهن`;
      }
      return text;
    }
    if (collabType === 'hourly') {
      return `${toPersianDigit((hourlyRate || 0).toLocaleString('en-US'))} / ساعت`;
    }
    return '';
  };

  const priceInfo = {
    percentSalon,
    percentPartner,
    fixedAmount,
    fixedDeposit,
    hourlyRate,
    priceDisplay: getPriceDisplay(),
  };

  return (
    <ScreenWrapper scrollable padding={0}>
      {/* هدر گرادیانی */}
      <LineRentalHero
        serviceTypeName={serviceTypeName}
        collabType={collabType}
        priceDisplay={getPriceDisplay()}
        onBack={() => router.back()}
        onShare={handleShare}
      />

      {/* محتوا */}
      <div className="p-5 space-y-4 pb-32">
        {/* عنوان و اطلاعات */}
        <div className="space-y-3">
          <h1 className="text-lg font-[Vazir-Bold] leading-7" style={{ color: colors.textMain }}>
            {rental.title}
          </h1>
          <div className="flex items-center gap-2 flex-wrap">
            <CollabBadge type={collabType} priceDisplay={getPriceDisplay()} variant="default" />
          </div>
          {businessName && (
            <div className="flex items-center gap-2">
              <span className="text-xs">🏪</span>
              <span className="text-xs font-[Vazir-Bold]" style={{ color: colors.primary }}>
                {businessName}
              </span>
            </div>
          )}
          {city && (
            <div className="flex items-center gap-2">
              <span className="text-xs">📍</span>
              <span className="text-xs" style={{ color: colors.textSecondary }}>
                {city}
              </span>
            </div>
          )}
          {subServiceName && (
            <div className="flex items-center gap-2">
              <span className="text-xs">💆‍♀️</span>
              <span className="text-xs" style={{ color: colors.textSecondary }}>
                {subServiceName}
              </span>
            </div>
          )}
        </div>

        {/* قیمت */}
        <LineRentalPriceCard collabType={collabType} priceInfo={priceInfo} />

        {/* توضیحات */}
        <Card variant="default" padding={14} radius={14}>
          <p className="text-xs leading-6 text-justify" style={{ color: colors.textSecondary }}>
            {description || 'توضیحاتی برای این آگهی ثبت نشده است.'}
          </p>
        </Card>

        {/* تاریخ‌ها */}
        <LineRentalDatesCard createdAt={createdAt} expiresAt={expiresAt} />

        {/* دکمه تماس */}
        {contactPhone && (
          <Button
            title="تماس با کسب‌وکار"
            onPress={handleCall}
            variant="primary"
            size="lg"
            fullWidth
            icon={<FiPhone size={18} color="#fff" />}
            iconPosition="right"
            style={{ backgroundColor: '#4CAF50' }}
          />
        )}
      </div>
    </ScreenWrapper>
  );
}
