// src/app/model-requests/[id]/ModelRequestDetailClient.jsx
'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FiPhone } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import ScreenWrapper from '@/components/common/ScreenWrapper';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import CostTypeBadge from '@/components/common/CostTypeBadge';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ModelRequestHero from '@/components/modelRequests/detail/ModelRequestHero';
import ModelRequestDatesCard from '@/components/modelRequests/detail/ModelRequestDatesCard';
import { toPersianDigit } from '@/utils/numberUtils';
import { cleanPhone } from '@/utils/phoneUtils';
import { useToast } from '@/hooks/useToast';
import { adsService } from '@/api';

export default function ModelRequestDetailPage({ requestId }) {
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
        const result = await adsService.getModelRequestDetail(requestId);
        setRequest(result.data);
      } catch (error) {
        console.error('Failed to fetch model request detail:', error);
        showToast('خطا در بارگذاری جزئیات', 'error');
      } finally {
        setIsLoading(false);
      }
    };
    fetchDetail();
  }, [requestId, showToast]);

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

  const costType = request.costType;
  const discount = request.discount || 0;
  const isUrgent = request.isUrgent;
  const businessName = request.businessName;
  const serviceName = request.serviceName;
  const city = request.city || '';
  const description = request.description || '';
  const contactPhone = request.contactPhone;
  const createdAt = request.createdJalali || '';
  const expiresAt = request.expiresJalali || '';

  return (
    <ScreenWrapper scrollable padding={0}>
      {/* هدر گرادیانی */}
      <ModelRequestHero
        serviceName={serviceName}
        costType={costType}
        discount={discount}
        isUrgent={isUrgent}
        onBack={() => router.back()}
        onShare={handleShare}
      />

      {/* محتوا */}
      <div className="p-5 space-y-4 pb-32">
        {/* عنوان و اطلاعات */}
        <div className="space-y-3">
          <h1 className="text-lg font-[Vazir-Bold] leading-7" style={{ color: colors.textMain }}>
            {request.title}
          </h1>
          <div className="flex items-center gap-2 flex-wrap">
            <CostTypeBadge type={costType} variant="default" />
          </div>
          <div className="flex items-center gap-2 flex-wrap">
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
            {serviceName && (
              <div className="flex items-center gap-2">
                <span className="text-xs">💆‍♀️</span>
                <span className="text-xs" style={{ color: colors.textSecondary }}>
                  {serviceName}
                </span>
              </div>
            )}
          </div>
          {discount > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-xs">🏷️</span>
              <span className="text-xs font-[Vazir-Bold]" style={{ color: '#E53935' }}>
                {toPersianDigit(discount)}٪ تخفیف مدل‌ها
              </span>
            </div>
          )}
        </div>

        {/* توضیحات */}
        <Card variant="default" padding={14} radius={14}>
          <p className="text-xs leading-6 text-justify" style={{ color: colors.textSecondary }}>
            {description || 'توضیحاتی برای این آگهی ثبت نشده است.'}
          </p>
        </Card>

        {/* تاریخ‌ها */}
        <ModelRequestDatesCard createdAt={createdAt} expiresAt={expiresAt} />

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
