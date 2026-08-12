// src/app/line-rentals/[id]/LineRentalDetailClient.jsx
'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { FiArrowRight, FiShare2, FiPhone, FiMapPin, FiClock, FiInfo } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import ScreenWrapper from '@/components/common/ScreenWrapper';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import CollabBadge from '@/components/common/CollabBadge';
import { toPersianDigit } from '@/utils/numberUtils';
import { cleanPhone } from '@/utils/phoneUtils';
import { useToast } from '@/hooks/useToast';
import { adsService } from '@/api';
import { USE_MOCK } from '@/api/config';
import { MOCK_LINE_RENTAL_DETAIL } from '@/data/lineRentals';

// متادیتای انواع خدمات
const SERVICE_TYPE_META = {
  facial: { color: '#C2185B', icon: '💆‍♀️' },
  nail: { color: '#7B1FA2', icon: '💅' },
  hair_color: { color: '#0277BD', icon: '🎨' },
  keratin: { color: '#E65100', icon: '✨' },
  laser: { color: '#00838F', icon: '⚡' },
  makeup: { color: '#AD1457', icon: '💄' },
  eyelash: { color: '#4527A0', icon: '👁️' },
  massage: { color: '#2E7D32', icon: '💆‍♀️' },
  hair_cut: { color: '#5D4037', icon: '✂️' },
  bridal: { color: '#880E4F', icon: '👰' },
  other: { color: '#455A64', icon: '💼' },
};

export default function LineRentalDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { colors } = useTheme();
  const { showToast } = useToast();
  const [ad, setAd] = useState(MOCK_LINE_RENTAL_DETAIL);
  const [isLoading, setIsLoading] = useState(false);

  // ═══ دریافت جزئیات از API ═══
  useEffect(() => {
    const fetchDetail = async () => {
      if (USE_MOCK) return;
      setIsLoading(true);
      try {
        const result = await adsService.getLineRentalDetail(params.id);
        setAd(result.data);
      } catch (error) {
        console.error('Failed to fetch line rental detail:', error);
        showToast('خطا در بارگذاری جزئیات', 'error');
      } finally {
        setIsLoading(false);
      }
    };
    fetchDetail();
  }, [params.id, showToast]);

  const serviceMeta = SERVICE_TYPE_META[ad.serviceTypeId] || SERVICE_TYPE_META.other;

  const handleCall = () => {
    if (ad.contactPhone) {
      window.location.href = `tel:${cleanPhone(ad.contactPhone)}`;
    } else {
      showToast('شماره تماسی ثبت نشده است', 'error');
    }
  };

  const handleShare = async () => {
    const shareMessage = `🏢 ${ad.title}
🏪 ${ad.businessName}
📍 ${ad.city}
🔗 ${typeof window !== 'undefined' ? window.location.href : ''}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: ad.title,
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
      showToast('امکان اشتراک‌گذاری وجود ندارد', 'error');
    }
  };

  if (isLoading) {
    return (
      <ScreenWrapper>
        <div className="flex items-center justify-center min-h-screen">
          <p style={{ color: colors.textMain }}>در حال بارگذاری...</p>
        </div>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper scrollable padding={0}>
      {/* Hero */}
      <div className="relative w-full h-[320px] bg-black overflow-hidden">
        <Image
          src={ad.lineImage}
          alt={ad.title}
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
        <div
          className="absolute bottom-0 left-0 right-0 h-[120px] pointer-events-none"
          style={{ backgroundColor: 'rgba(0,0,0,0.35)' }}
        />
        {/* دکمه‌ها */}
        <div className="absolute top-4 left-4 right-4 flex items-center gap-3 z-10">
          <button
            onClick={() => router.back()}
            className="w-11 h-11 rounded-full flex items-center justify-center
border border-white/15 transition-all hover:scale-110 active:scale-95"
            style={{ backgroundColor: 'rgba(0,0,0,0.35)' }}
          >
            <FiArrowRight size={22} color="#fff" />
          </button>
          <div className="flex-1" />
          <button
            onClick={handleShare}
            className="w-11 h-11 rounded-full flex items-center justify-center
border border-white/15 transition-all hover:scale-110 active:scale-95"
            style={{ backgroundColor: 'rgba(0,0,0,0.35)' }}
          >
            <FiShare2 size={20} color="#fff" />
          </button>
        </div>
        {/* Badge نوع خدمت */}
        <div
          className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1.5 rounded-xl shadow-md"
          style={{ backgroundColor: serviceMeta.color }}
        >
          <span className="text-[10px]">{serviceMeta.icon}</span>
          <span className="text-[10px] font-[Vazir-Bold] text-white">{ad.serviceTypeName}</span>
        </div>
      </div>

      {/* محتوا */}
      <div className="p-5 space-y-4 pb-32">
        {/* عنوان و badges */}
        <div className="space-y-3">
          <h1 className="text-xl font-[Vazir-Bold] leading-8" style={{ color: colors.textMain }}>
            {ad.title}
          </h1>
          <CollabBadge type={ad.collabType} priceDisplay={ad.priceDisplay} variant="default" />
        </div>

        {/* نام کسب‌وکار و شهر */}
        <div className="flex items-center gap-2">
          <span className="text-xs">🏪</span>
          <span className="text-xs font-[Vazir-Bold]" style={{ color: colors.primary }}>
            {ad.businessName}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <FiMapPin size={12} color={colors.textSecondary} />
          <span className="text-xs" style={{ color: colors.textSecondary }}>
            {ad.city}
          </span>
        </div>

        {/* شرایط همکاری */}
        <Card variant="elevated" padding={16} radius={18}>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-base">🤝</span>
            <span className="text-sm font-[Vazir-Bold]" style={{ color: colors.textMain }}>
              شرایط همکاری
            </span>
          </div>
          <div
            className="p-3 rounded-xl border"
            style={{ backgroundColor: colors.primary + '08', borderColor: colors.primary + '25' }}
          >
            <p className="text-sm font-[Vazir-Bold]" style={{ color: colors.primary }}>
              {ad.priceDisplay}
            </p>
          </div>
        </Card>

        {/* توضیحات */}
        <Card variant="elevated" padding={16} radius={18}>
          <div className="flex items-center gap-2 mb-3">
            <FiInfo size={18} color="#2196F3" />
            <span className="text-sm font-[Vazir-Bold]" style={{ color: colors.textMain }}>
              توضیحات آگهی
            </span>
          </div>
          <p className="text-sm leading-7 text-justify" style={{ color: colors.textMain }}>
            {ad.description}
          </p>
        </Card>

        {/* تاریخ‌ها */}
        <Card variant="elevated" padding={14} radius={16}>
          <div className="flex items-center gap-3 mb-2">
            <FiClock size={16} color={colors.textSecondary} />
            <span className="text-xs" style={{ color: colors.textSecondary }}>
              ثبت: {ad.createdAt}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <FiClock size={16} color="#FF9800" />
            <span className="text-xs" style={{ color: colors.textSecondary }}>
              انقضا: {ad.expiresAt}
            </span>
          </div>
        </Card>

        {/* دکمه تماس */}
        <Button
          title="تماس با کسب‌وکار"
          onPress={handleCall}
          variant="primary"
          size="lg"
          fullWidth
          icon={<FiPhone size={18} color="#fff" />}
          iconPosition="right"
          style={{ backgroundColor: '#667eea' }}
        />
      </div>
    </ScreenWrapper>
  );
}
