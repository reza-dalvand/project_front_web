// src/app/model-requests/[id]/ModelRequestDetailClient.jsx
'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { FiArrowRight, FiShare2, FiPhone, FiMapPin, FiClock, FiInfo } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import ScreenWrapper from '@/components/common/ScreenWrapper';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import CostTypeBadge from '@/components/common/CostTypeBadge';
import { toPersianDigit } from '@/utils/numberUtils';
import { cleanPhone } from '@/utils/phoneUtils';
import { useToast } from '@/hooks/useToast';
import { adsService } from '@/api';
import { USE_MOCK } from '@/api/config';
import { MOCK_MODEL_REQUEST_DETAIL } from '@/data/modelRequests';

export default function ModelRequestDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { colors } = useTheme();
  const { showToast } = useToast();
  const [request, setRequest] = useState(MOCK_MODEL_REQUEST_DETAIL);
  const [isLoading, setIsLoading] = useState(false);

  // ═══ دریافت جزئیات از API ═══
  useEffect(() => {
    const fetchDetail = async () => {
      if (USE_MOCK) return;
      setIsLoading(true);
      try {
        const result = await adsService.getModelRequestDetail(params.id);
        setRequest(result.data);
      } catch (error) {
        console.error('Failed to fetch model request detail:', error);
        showToast('خطا در بارگذاری جزئیات', 'error');
      } finally {
        setIsLoading(false);
      }
    };
    fetchDetail();
  }, [params.id, showToast]);

  const handleBusinessPress = () => {
    router.push(`/business/${request.businessId}`);
  };

  const handleCall = () => {
    if (request.contactPhone) {
      window.location.href = `tel:${cleanPhone(request.contactPhone)}`;
    } else {
      showToast('شماره تماسی ثبت نشده است', 'error');
    }
  };

  // ✅ بعد: اشتراک‌گذاری با fallback امن
  const handleShare = async () => {
    const shareMessage = `👤 ${request.title}
🏪 ${request.businessName}
📍 ${request.city}
🔗 ${typeof window !== 'undefined' ? window.location.href : ''}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: request.title,
          text: shareMessage,
          url: typeof window !== 'undefined' ? window.location.href : undefined,
        });
        return;
      } catch (err) {
        if (err?.name === 'AbortError') return;
      }
    }
    // Fallback: کپی در کلیپ‌بورد
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
          src={request.serviceImage}
          alt={request.title}
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
        {/* Badge فوری */}
        {request.isUrgent && (
          <div
            className="absolute top-20 right-4 px-3 py-1.5 rounded-xl shadow-md"
            style={{ backgroundColor: '#FF9800' }}
          >
            <span className="text-[11px] font-[Vazir-Bold] text-white">🔥 فوری</span>
          </div>
        )}
      </div>

      {/* محتوا */}
      <div className="p-5 space-y-4 pb-32">
        {/* عنوان و badges */}
        <div className="space-y-3">
          <h1 className="text-xl font-[Vazir-Bold] leading-8" style={{ color: colors.textMain }}>
            {request.title}
          </h1>
          <div className="flex items-center gap-2 flex-wrap">
            <CostTypeBadge type={request.costType} variant="default" />
            {request.discount > 0 && (
              <div
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl"
                style={{ backgroundColor: '#E5393515' }}
              >
                <span className="text-[11px] font-[Vazir-Bold]" style={{ color: '#E53935' }}>
                  {toPersianDigit(request.discount)}٪ تخفیف مدل‌ها
                </span>
              </div>
            )}
          </div>
        </div>

        {/* کارت کسب‌وکار */}
        <button onClick={handleBusinessPress} className="w-full text-right">
          <Card variant="elevated" padding={14} radius={16}>
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: colors.primary + '15' }}
              >
                <span className="text-xl">🏪</span>
              </div>
              <div className="flex-1">
                <span
                  className="text-sm font-[Vazir-Bold] block"
                  style={{ color: colors.textMain }}
                >
                  {request.businessName}
                </span>
                <div className="flex items-center gap-1 mt-0.5">
                  <FiMapPin size={12} color={colors.textSecondary} />
                  <span className="text-xs" style={{ color: colors.textSecondary }}>
                    {request.city}
                  </span>
                </div>
              </div>
              <span className="text-xl" style={{ color: colors.textSecondary }}>
                ←
              </span>
            </div>
          </Card>
        </button>

        {/* توضیحات */}
        <Card variant="elevated" padding={16} radius={18}>
          <div className="flex items-center gap-2 mb-3">
            <FiInfo size={18} color="#2196F3" />
            <span className="text-sm font-[Vazir-Bold]" style={{ color: colors.textMain }}>
              توضیحات آگهی
            </span>
          </div>
          <p className="text-sm leading-7 text-justify" style={{ color: colors.textMain }}>
            {request.description}
          </p>
        </Card>

        {/* اطلاعات تکمیلی */}
        <Card variant="elevated" padding={14} radius={16}>
          <div className="flex items-center gap-3 mb-2">
            <FiClock size={16} color={colors.textSecondary} />
            <span className="text-xs" style={{ color: colors.textSecondary }}>
              ثبت: {request.createdAt}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <FiClock size={16} color="#FF9800" />
            <span className="text-xs" style={{ color: colors.textSecondary }}>
              انقضا: {request.expiresAt}
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
          style={{ backgroundColor: '#4CAF50' }}
        />
      </div>
    </ScreenWrapper>
  );
}
