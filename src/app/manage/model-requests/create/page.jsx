'use client';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTheme } from '@/stores/useThemeStore';
import { useBusinessStore } from '@/stores/useBusinessStore';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import ScreenWrapper from '@/components/common/ScreenWrapper';
import Header from '@/components/common/Header';
import ModelRequestForm from '@/components/manageBusiness/modelRequest/ModelRequestForm';
import { useToast } from '@/hooks/useToast';

export default function CreateModelRequestPage() {
  const { colors } = useTheme();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated } = useRequireAuth({ redirectToLogin: true });
  const { showToast } = useToast();
  const businessData = useBusinessStore((s) => s.businessData);

  const requestId = searchParams.get('id');
  const existingRequest = requestId
    ? // در production از API یا store گرفته می‌شود
      null
    : null;
  const isEditMode = !!existingRequest;

  const services = businessData?.services || [];

  const handleSave = (formData) => {
    console.log('Saving model request:', formData);
    showToast(
      isEditMode ? 'درخواست مدل با موفقیت ویرایش شد' : 'درخواست مدل با موفقیت ایجاد شد',
      'success'
    );
    setTimeout(() => {
      router.push('/manage/model-requests');
    }, 1200);
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
        <ModelRequestForm
          services={services}
          initialData={existingRequest}
          defaultPhone={businessData?.phone || ''}
          onSave={handleSave}
          onClose={handleClose}
        />
      </div>
    </ScreenWrapper>
  );
}
