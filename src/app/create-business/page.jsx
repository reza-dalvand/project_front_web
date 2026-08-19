// src/app/create-business/page.jsx
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FiShield } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import { useAuthStore } from '@/stores/useAuthStore';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { useToast } from '@/hooks/useToast';
import ScreenWrapper from '@/components/common/ScreenWrapper';
import Header from '@/components/common/Header';
import Button from '@/components/common/Button';
import StepProgress from '@/components/createbusiness/StepProgress';
import TermsAndConditionsStep from '@/components/createbusiness/TermsAndConditionsStep';
import BasicInfoStep from '@/components/createbusiness/BasicInfoStep';
import NationalIdVerificationStep from '@/components/createbusiness/NationalIdVerificationStep';
import SuccessModal from '@/components/common/SuccessModal';
import { businessesService } from '@/api';
import { USE_MOCK } from '@/api/config';

export default function CreateBusinessPage() {
  const router = useRouter();
  const { colors } = useTheme();
  const user = useAuthStore((s) => s.user);
  const updateUser = useAuthStore((s) => s.updateUser);
  const { isAuthenticated } = useRequireAuth({ redirectToLogin: true });
  const { showToast } = useToast();

  const [termsAccepted, setTermsAccepted] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [isStepValid, setIsStepValid] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const needsNationalId = !user?.isNationalIdVerified;
  const totalSteps = needsNationalId ? 2 : 1;

  const [formData, setFormData] = useState({
    name: '',
    categoryId: null,
    provinceId: null,
    cityId: null,
    address: '',
    phone: '',
    workingHours: '',
    about: '',
    location: null,
    mapAddress: '',
    coverUrl: null,
    ownerPhoto: null,
    logo: null,
    nationalId: '',
    verifiedName: '',
  });

  const updateForm = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const validateForm = () => {
    if (!formData.name?.trim()) {
      showToast('نام کسب‌وکار الزامی است', 'error');
      return false;
    }
    if (!formData.categoryId) {
      showToast('نوع کسب‌وکار را انتخاب کنید', 'error');
      return false;
    }
    if (!formData.provinceId) {
      showToast('استان را انتخاب کنید', 'error');
      return false;
    }
    if (!formData.cityId) {
      showToast('شهر را انتخاب کنید', 'error');
      return false;
    }
    if (!formData.address?.trim() || formData.address.trim().length < 10) {
      showToast('آدرس باید حداقل ۱۰ کاراکتر باشد', 'error');
      return false;
    }
    if (!formData.phone?.trim()) {
      showToast('شماره تماس الزامی است', 'error');
      return false;
    }
    if (!formData.workingHours?.trim()) {
      showToast('ساعات کاری الزامی است', 'error');
      return false;
    }
    if (!formData.about?.trim()) {
      showToast('توضیحات الزامی است', 'error');
      return false;
    }
    if (!formData.coverUrl) {
      showToast('تصویر کاور الزامی است', 'error');
      return false;
    }
    if (!formData.ownerPhoto) {
      showToast('تصویر صاحب کسب‌وکار الزامی است', 'error');
      return false;
    }
    if (!formData.location) {
      showToast('موقعیت روی نقشه الزامی است', 'error');
      return false;
    }
    return true;
  };

  const handleFinalSubmit = async (fd) => {
    if (!validateForm()) return;
    setSubmitting(true);
    try {
      if (!USE_MOCK) {
        await businessesService.createBusiness(fd);
      } else {
        await new Promise((r) => setTimeout(r, 1500));
      }
      setSubmitting(false);
      setSuccessModalVisible(true);
    } catch (error) {
      setSubmitting(false);
      const msg = error?.details?.non_field_errors?.[0] || error?.message || 'خطا در ثبت';
      showToast(msg, 'error');
    }
  };

  const handleSuccessClose = () => {
    setSuccessModalVisible(false);
    router.push('/manage');
  };

  const renderCurrentStep = () => {
    if (!termsAccepted) {
      return (
        <TermsAndConditionsStep
          onAccept={() => {
            setTermsAccepted(true);
            setCurrentStep(1);
          }}
          onDecline={() => router.back()}
        />
      );
    }
    if (needsNationalId && currentStep === 1) {
      return (
        <NationalIdVerificationStep
          formData={formData}
          onUpdate={updateForm}
          registeredPhone={user?.phone || ''}
          onVerified={() => {
            updateUser({ isNationalIdVerified: true, verifiedName: formData.verifiedName });
            setCurrentStep(2);
          }}
        />
      );
    }
    return (
      <BasicInfoStep
        formData={formData}
        onUpdate={updateForm}
        onValidationChange={setIsStepValid}
        onSubmit={handleFinalSubmit}
        submitting={submitting}
        isFinalStep
      />
    );
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
      <div className="flex flex-col h-screen" style={{ backgroundColor: colors.background }}>
        <Header title="ثبت کسب‌وکار جدید" onBackPress={() => router.back()} />
        {termsAccepted && <StepProgress currentStep={currentStep} totalSteps={totalSteps} />}
        <div className="flex-1 overflow-y-auto">{renderCurrentStep()}</div>
      </div>
      <SuccessModal
        visible={successModalVisible}
        onClose={handleSuccessClose}
        title="ثبت‌نام با موفقیت انجام شد"
        message="اطلاعات کسب‌وکار شما با موفقیت ثبت شد. پس از بررسی توسط کارشناسان بیو کلاب، نتیجه از طریق پیامک ارسال خواهد شد."
        confirmText="متوجه شدم"
        emoji="🎉"
      />
    </ScreenWrapper>
  );
}
