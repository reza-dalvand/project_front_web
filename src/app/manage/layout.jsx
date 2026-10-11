// src/app/manage/layout.jsx
'use client';

import { useRequireBusiness } from '@/hooks/useRequireBusiness';
import { useTheme } from '@/stores/useThemeStore';
import LoadingSpinner from '@/components/common/LoadingSpinner';

export default function ManageLayout({ children }) {
  const { colors } = useTheme();

  const {
    isAuthenticated,
    hasBusiness,
    isApproved,
    businessStatus,
    hydrated,
  } = useRequireBusiness();

  // هنوز وضعیت احراز هویت مشخص نشده
  if (!hydrated || !isAuthenticated) {
    return <LoadingSpinner label="در حال بررسی دسترسی..." />;
  }

  // کاربر کسب‌وکار ندارد؛ useRequireBusiness او را به /create-business می‌برد.
  // تا آن لحظه فقط loading نشان داده می‌شود.
  if (!hasBusiness) {
    return <LoadingSpinner label="در حال بررسی دسترسی..." />;
  }

  // کاربر کسب‌وکار دارد ولی هنوز تایید نشده است.
  // در این حالت children رندر نمی‌شود تا هیچ صفحه‌ای درخواست API مدیریت نزند.
  if (!isApproved) {
    const isRejected = businessStatus === 'rejected';
    const isPending = businessStatus === 'pending';

    const title = isRejected
      ? 'کسب‌وکار شما تایید نشده است'
      : isPending
        ? 'کسب‌وکار شما در انتظار تایید است'
        : 'وضعیت کسب‌وکار هنوز مشخص نیست';

    const description = isRejected
      ? 'برای بررسی دلیل و اقدام بعدی با پشتیبانی تماس بگیرید.'
      : isPending
        ? 'پس از تایید کسب‌وکار، دسترسی به بخش مدیریت فعال می‌شود.'
        : 'لطفاً بعداً دوباره تلاش کنید یا وضعیت کسب‌وکار را بررسی کنید.';

    return (
      <div dir="rtl" className="min-h-screen flex items-center justify-center p-6">
        <div className="max-w-sm text-center space-y-4">
          <div className="text-5xl">{isRejected ? '❌' : '⏳'}</div>

          <h2
            className="text-lg font-[Vazir-Bold]"
            style={{ color: colors.textMain }}
          >
            {title}
          </h2>

          <p
            className="text-sm font-[Vazir] leading-7"
            style={{ color: colors.textSecondary }}
          >
            {description}
          </p>
        </div>
      </div>
    );
  }

  // فقط کسب‌وکارهای تاییدشده اجازه دسترسی به صفحات مدیریت را دارند.
  return <>{children}</>;
}