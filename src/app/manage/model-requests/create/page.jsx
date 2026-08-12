// src/app/manage/model-requests/create/page.jsx
'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTheme } from '@/stores/useThemeStore';
import { useBusinessStore } from '@/stores/useBusinessStore';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import ScreenWrapper from '@/components/common/ScreenWrapper';
import Header from '@/components/common/Header';
import ModelRequestForm from '@/components/manageBusiness/modelRequest/ModelRequestForm';
import { useToast } from '@/hooks/useToast';
import { adsService } from '@/api';
import { USE_MOCK } from '@/api/config';

// ═══════════ کامپوننت داخلی با useSearchParams ═══════════
function CreateModelRequestPageContent() {
  const { colors } = useTheme();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated } = useRequireAuth({ redirectToLogin: true });
  const { showToast } = useToast();
  const businessData = useBusinessStore((s) => s.businessData);

  const requestId = searchParams.get('id');
  const [existingRequest, setExistingRequest] = useState(null);
  const [isLoadingExisting, setIsLoadingExisting] = useState(false);
  const isEditMode = !!requestId;

  const services = businessData?.services || [];

  // ═══ در حالت ویرایش، دریافت داده‌های موجود ═══
  useEffect(() => {
    if (!requestId) return;

    const fetchExisting = async () => {
      if (USE_MOCK) {
        const { MOCK_MODEL_REQUESTS } = await import('@/data/modelRequests');
        const found = MOCK_MODEL_REQUESTS.find((r) => r.id === requestId);
        if (found) setExistingRequest(found);
        return;
      }
      setIsLoadingExisting(true);
      try {
        const result = await adsService.getModelRequestDetail(requestId);
        setExistingRequest(result.data);
      } catch (error) {
        console.error('Failed to fetch existing request:', error);
        showToast('خطا در بارگذاری داده‌های موجود', 'error');
      } finally {
        setIsLoadingExisting(false);
      }
    };

    fetchExisting();
  }, [requestId, showToast]);

  // ═══ ذخیره ═══
  const handleSave = async (formData) => {
    if (USE_MOCK) {
      showToast(
        isEditMode ? 'درخواست مدل با موفقیت ویرایش شد' : 'درخواست مدل با موفقیت ایجاد شد',
        'success'
      );
      setTimeout(() => router.push('/manage/model-requests'), 1200);
      return;
    }

    try {
      if (isEditMode) {
        await adsService.createModelRequest({
          service: formData.serviceId,
          title: formData.title,
          description: formData.description,
          cost_type: formData.costType,
          discount: formData.discount || 0,
          is_urgent: formData.isUrgent || false,
          contact_phone: formData.contactPhone,
        });
        showToast('درخواست جدید ثبت شد (ویرایش مستقیم پشتیبانی نمی‌شود)', 'info');
      } else {
        await adsService.createModelRequest({
          service: formData.serviceId,
          title: formData.title,
          description: formData.description,
          cost_type: formData.costType,
          discount: formData.discount || 0,
          is_urgent: formData.isUrgent || false,
          contact_phone: formData.contactPhone,
        });
        showToast('درخواست مدل با موفقیت ایجاد شد', 'success');
      }
      setTimeout(() => router.push('/manage/model-requests'), 1200);
    } catch (error) {
      console.error('Failed to save model request:', error);
      showToast(error.message || 'خطا در ذخیره درخواست', 'error');
    }
  };

  const handleClose = () => {
    router.push('/manage/model-requests');
  };

  if (!isAuthenticated) {
    return (
      <ScreenWrapper>
        <div className="flex items-center justify-center min-h-screen">
          <p style={{ color: colors.textMain }}>در حال بارگذاری...</p>
        </div>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper padding={0}>
      <Header
        title={isEditMode ? 'ویرایش درخواست مدل' : 'ایجاد درخواست مدل'}
        onBackPress={() => router.back()}
      />

      <div className="flex-1 overflow-y-auto">
        {isLoadingExisting ? (
          <div className="flex items-center justify-center py-20">
            <p style={{ color: colors.textSecondary }}>در حال بارگذاری...</p>
          </div>
        ) : (
          <ModelRequestForm
            services={services}
            initialData={existingRequest}
            defaultPhone={businessData?.phone || ''}
            onSave={handleSave}
            onClose={handleClose}
          />
        )}
      </div>
    </ScreenWrapper>
  );
}

// ═══════════ کامپوننت اصلی با Suspense ═══════════
export default function CreateModelRequestPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-app">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <CreateModelRequestPageContent />
    </Suspense>
  );
}
