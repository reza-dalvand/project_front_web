'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FiChevronRight, FiChevronLeft, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import { useAuthStore } from '@/stores/useAuthStore';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import ScreenWrapper from '@/components/common/ScreenWrapper';
import Header from '@/components/common/Header';
import Button from '@/components/common/Button';
import StepProgress from '@/components/createbusiness/StepProgress';
import TermsAndConditionsStep from '@/components/createbusiness/TermsAndConditionsStep';
import BasicInfoStep from '@/components/createbusiness/BasicInfoStep';
import NationalIdVerificationStep from '@/components/createbusiness/NationalIdVerificationStep';
import SuccessModal from '@/components/common/SuccessModal';
import ServicesManagement from '@/components/createbusiness/ServicesManagement';

export default function CreateBusinessPage() {
  const router = useRouter();
  const { colors } = useTheme();
  const user = useAuthStore((s) => s.user);
  const { isAuthenticated } = useRequireAuth({ redirectToLogin: true });

  const [termsAccepted, setTermsAccepted] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 2;
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [isStepValid, setIsStepValid] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    provinceId: null,
    cityId: null,
    address: '',
    location: null,
    mapAddress: '',
    coverUrl: null,
    ownerPhoto: null,
    nationalId: '',
    isNationalIdVerified: false,
    verifiedName: '',
    categoryId: null,
    services: [], 

  });

  const registeredPhone = user?.phone || '09123456789';

  const updateForm = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <BasicInfoStep
            formData={formData}
            onUpdate={updateForm}
            onValidationChange={(valid) => setIsStepValid(valid)}
          />
        );
      case 2:
        return (
          <NationalIdVerificationStep
            formData={formData}
            onUpdate={updateForm}
            registeredPhone={registeredPhone}
          />
        );
      default:
        return null;
    }
  };

  const isLastStep = currentStep === totalSteps;
  const isFirstStep = currentStep === 1;

  const canFinalSubmit = formData.isNationalIdVerified === true;

  const canGoNext = () => {
    if (currentStep === 1) return isStepValid;
    if (currentStep === 2) return canFinalSubmit;
    return true;
  };

  const handleNextStep = () => {
    if (!canGoNext()) {
      alert(
        currentStep === 1
          ? 'لطفاً تمام فیلدهای الزامی را تکمیل کنید'
          : 'ابتدا کد ملی خود را استعلام و تایید کنید'
      );
      return;
    }

    if (isLastStep) {
      handleFinalSubmit();
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleFinalSubmit = () => {
    if (!canFinalSubmit) {
      alert(
        'برای ثبت نهایی کسب‌وکار، ابتدا باید کد ملی خود را با شماره ثبت‌نام شده تطبیق دهید'
      );
      return;
    }

    const submitData = {
      name: formData.name,
      province: formData.provinceId,
      city: formData.cityId,
      address: formData.address,
      latitude: formData.location?.latitude,
      longitude: formData.location?.longitude,
      map_address: formData.mapAddress,
      cover_image: formData.coverUrl,
      owner_photo: formData.ownerPhoto,
      national_id: formData.nationalId,
      verified_name: formData.verifiedName,
      owner_phone: registeredPhone,
      category_id: formData.categoryId,
      services: formData.services, 
    };

    console.log('✅ Final Data Ready for API:', submitData);
    setSuccessModalVisible(true);
  };

  const handleSuccessClose = () => {
    setSuccessModalVisible(false);
    router.push('/manage');
  };

  const handleBackFromWizard = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      setTermsAccepted(false);
    }
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

  // مرحله قوانین
  if (!termsAccepted) {
    return (
      <ScreenWrapper padding={0}>
        <div className="flex flex-col h-screen" style={{ backgroundColor: colors.background }}>
          <Header
            title="ثبت کسب‌وکار جدید"
            onBackPress={() => router.back()}
          />
          <div className="flex-1 overflow-hidden flex flex-col">
            <TermsAndConditionsStep
              onAccept={() => {
                setTermsAccepted(true);
                setCurrentStep(1);
              }}
              onDecline={() => router.back()}
            />
          </div>
        </div>
      </ScreenWrapper>
    );
  }

  // مراحل Wizard
  return (
    <ScreenWrapper padding={0}>
      <div className="flex flex-col h-screen" style={{ backgroundColor: colors.background }}>
        {/* هدر لوکس */}
        <div
          className="px-5 py-4 shadow-md"
          style={{
            backgroundColor: colors.primary,
          }}
        >
          <div className="flex items-center justify-between">
            <button
              onClick={handleBackFromWizard}
              className="w-9 h-9 rounded-full flex items-center justify-center"
              style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
            >
              <FiChevronRight size={22} color="#fff" />
            </button>
            <h1 className="text-base font-[Vazir-Bold] text-white">
              ثبت کسب‌وکار جدید
            </h1>
            <div className="w-9" />
          </div>
        </div>

        {/* محتوای اسکرولی */}
        <div className="flex-1 overflow-y-auto">
          <StepProgress currentStep={currentStep} totalSteps={totalSteps} />
          {renderCurrentStep()}
          <div className="h-32" />
        </div>

        {/* فوتر دکمه‌ها */}
        <div
          className="px-5 pt-4 pb-6 space-y-3 border-t shadow-lg"
          style={{
            backgroundColor: colors.cardBackground,
            borderColor: colors.border,
          }}
        >
          <div className="flex gap-3">
            <Button
              title={isLastStep ? 'ثبت نهایی' : 'مرحله بعد'}
              onPress={handleNextStep}
              variant="primary"
              size="lg"
              disabled={!canGoNext()}
              icon={
                isLastStep ? (
                  <FiCheckCircle size={18} color="#fff" />
                ) : (
                  <FiChevronLeft size={18} color="#fff" />
                )
              }
              iconPosition="right"
              className={isFirstStep ? 'flex-1' : 'flex-[1.6]'}
            />
            {!isFirstStep && (
              <Button
                title="مرحله قبل"
                onPress={handleBackFromWizard}
                variant="outline"
                size="lg"
                className="flex-1"
                icon={<FiChevronRight size={18} style={{ color: colors.primary }} />}
                iconPosition="left"
              />
            )}
          </div>

          {!canGoNext() && (
            <div
              className="flex items-center gap-2 py-2.5 px-4 rounded-xl border"
              style={{
                backgroundColor: '#FFA00010',
                borderColor: '#FFA00030',
              }}
            >
              <FiAlertCircle size={14} color="#FFA000" />
              <p className="text-xs font-[Vazir] flex-1" style={{ color: colors.textSecondary }}>
                {currentStep === 1 &&
                  'برای فعال‌سازی دکمه «مرحله بعد»، تمام فیلدهای الزامی را تکمیل کنید'}
                {currentStep === 2 &&
                  'برای فعال‌سازی دکمه ثبت نهایی، ابتدا کد ملی خود را استعلام و تایید کنید'}
              </p>
            </div>
          )}
        </div>

        {/* مدال موفقیت */}
        <SuccessModal
          visible={successModalVisible}
          onClose={handleSuccessClose}
          title="ثبت‌نام با موفقیت انجام شد"
          message="اطلاعات کسب‌وکار شما با موفقیت ثبت شد. پس از بررسی توسط کارشناسان زیبانو، نتیجه از طریق پیامک به شماره ثبت‌نام‌شده ارسال خواهد شد."
          confirmText="متوجه شدم"
          emoji="🎉"
        />
      </div>
    </ScreenWrapper>
  );
}