// src/app/model-requests/[id]/ModelRequestDetailClient.jsx
'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  FiArrowRight,
  FiShare2,
  FiPhone,
  FiMapPin,
  FiCalendar,
  FiInfo,
  FiTag,
} from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import ScreenWrapper from '@/components/common/ScreenWrapper';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import CostTypeBadge from '@/components/common/CostTypeBadge';
import LoadingSpinner from '@/components/common/LoadingSpinner';
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
  const [request, setRequest] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // ═══ دریافت جزئیات از API ═══
  useEffect(() => {
    const fetchDetail = async () => {
      setIsLoading(true);
      try {
        if (USE_MOCK) {
          setRequest(MOCK_MODEL_REQUEST_DETAIL);
        } else {
          const result = await adsService.getModelRequestDetail(params.id);
          setRequest(result.data);
        }
      } catch (error) {
        console.error('Failed to fetch model request detail:', error);
        showToast('خطا در بارگذاری جزئیات', 'error');
      } finally {
        setIsLoading(false);
      }
    };
    fetchDetail();
  }, [params.id, showToast]);

  const handleCall = () => {
    if (request?.contact_phone || request?.contactPhone) {
      const phone = cleanPhone(request.contact_phone || request.contactPhone);
      window.location.href = `tel:${phone}`;
    } else {
      showToast('شماره تماسی ثبت نشده است', 'error');
    }
  };

  const handleShare = async () => {
    const shareMessage = `👤 ${request?.title || ''}
🏪 ${request?.business_name || request?.businessName || ''}
🔗 ${typeof window !== 'undefined' ? window.location.href : ''}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: request?.title || 'فرصت مدلینگ',
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

  if (!request) {
    return (
      <ScreenWrapper>
        <div className="flex flex-col items-center py-20 gap-3">
          <span className="text-4xl">🔍</span>
          <p className="text-base font-[Vazir-Bold]" style={{ color: colors.textMain }}>
            درخواست یافت نشد
          </p>
        </div>
      </ScreenWrapper>
    );
  }

  const costType = request.cost_type || request.costType;
  const discount = request.discount || 0;
  const isUrgent = request.is_urgent || request.isUrgent;
  const businessName = request.business_name || request.businessName;
  const serviceName = request.service_name || request.serviceName;
  const city = request.city || '';
  const serviceImage = request.service_image_url || request.serviceImage;
  const description = request.description || '';
  const contactPhone = request.contact_phone || request.contactPhone;
  const createdAt = request.created_jalali || request.createdAt || '';
  const expiresAt = request.expires_jalali || request.expiresAt || '';

  return (
    <ScreenWrapper scrollable padding={0}>
      {/* هدر با تصویر */}
      <div className="relative w-full h-[320px] bg-black overflow-hidden">
        {serviceImage && (
          <Image
            src={serviceImage}
            alt={request.title}
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
        )}
        <div
          className="absolute bottom-0 left-0 right-0 h-[120px] pointer-events-none"
          style={{ backgroundColor: 'rgba(0,0,0,0.45)' }}
        />
        {/* دکمه‌ها */}
        <div className="absolute top-4 left-4 right-4 flex items-center gap-3 z-10">
          <button
            onClick={() => router.back()}
            className="w-11 h-11 rounded-full flex items-center justify-center border border-white/15 backdrop-blur-sm"
            style={{ backgroundColor: 'rgba(0,0,0,0.35)' }}
          >
            <FiArrowRight size={22} color="#fff" />
          </button>
          <div className="flex-1" />
          <button
            onClick={handleShare}
            className="w-11 h-11 rounded-full flex items-center justify-center border border-white/15 backdrop-blur-sm"
            style={{ backgroundColor: 'rgba(0,0,0,0.35)' }}
          >
            <FiShare2 size={20} color="#fff" />
          </button>
        </div>
        {/* Badge فوری */}
        {isUrgent && (
          <div
            className="absolute top-20 right-4 px-3 py-1.5 rounded-xl shadow-md"
            style={{ backgroundColor: '#FF9800' }}
          >
            <span className="text-[11px] font-[Vazir-Bold] text-white">🔥 فوری</span>
          </div>
        )}
        {/* Badge نوع هزینه */}
        <div className="absolute top-20 left-4">
          <CostTypeBadge type={costType} variant="solid" />
        </div>
      </div>

      {/* محتوا */}
      <div className="p-5 space-y-4 pb-32">
        {/* عنوان و اطلاعات */}
        <div className="space-y-3">
          <h1 className="text-lg font-[Vazir-Bold] leading-7" style={{ color: colors.textMain }}>
            {request.title}
          </h1>

          {/* متا */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-1.5">
              <span className="text-xs">🏪</span>
              <span className="text-[11px] font-[Vazir-Medium]" style={{ color: colors.primary }}>
                {businessName}
              </span>
            </div>
            {city && (
              <div className="flex items-center gap-1">
                <FiMapPin size={11} color={colors.textSecondary} />
                <span className="text-[10px]" style={{ color: colors.textSecondary }}>
                  {city}
                </span>
              </div>
            )}
            {serviceName && (
              <div className="flex items-center gap-1">
                <span className="text-[11px]" style={{ color: colors.textSecondary }}>
                  💆‍♀️
                </span>
                <span className="text-[10px]" style={{ color: colors.textSecondary }}>
                  {serviceName}
                </span>
              </div>
            )}
          </div>

          {/* تخفیف */}
          {discount > 0 && (
            <div className="flex items-center gap-1.5">
              <FiTag size={12} color="#E53935" />
              <span className="text-[11px] font-[Vazir-Bold]" style={{ color: '#E53935' }}>
                {toPersianDigit(discount)}٪ تخفیف مدل‌ها
              </span>
            </div>
          )}
        </div>

        {/* توضیحات */}
        <Card variant="elevated" padding={16} radius={18}>
          <div className="flex items-center gap-2 mb-3">
            <FiInfo size={18} style={{ color: colors.primary }} />
            <span className="text-sm font-[Vazir-Bold]" style={{ color: colors.textMain }}>
              توضیحات آگهی
            </span>
          </div>
          <p className="text-[13px] leading-6 text-justify" style={{ color: colors.textSecondary }}>
            {description || 'توضیحاتی برای این آگهی ثبت نشده است.'}
          </p>
        </Card>

        {/* تاریخ‌ها */}
        {(createdAt || expiresAt) && (
          <Card variant="elevated" padding={14} radius={16}>
            {createdAt && (
              <div className="flex items-center gap-3 mb-2">
                <FiCalendar size={16} color={colors.textSecondary} />
                <span className="text-xs" style={{ color: colors.textSecondary }}>
                  ثبت: {createdAt}
                </span>
              </div>
            )}
            {expiresAt && (
              <div className="flex items-center gap-3">
                <FiCalendar size={16} color="#FF9800" />
                <span className="text-xs" style={{ color: colors.textSecondary }}>
                  انقضا: {expiresAt}
                </span>
              </div>
            )}
          </Card>
        )}

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
