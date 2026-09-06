// src/app/manage/layout.jsx
'use client';
import { useRequireBusiness } from '@/hooks/useRequireBusiness';
import LoadingSpinner from '@/components/common/LoadingSpinner';

export default function ManageLayout({ children }) {
  const { isAuthenticated, hasBusiness, hydrated } = useRequireBusiness();

  if (!hydrated || !isAuthenticated) {
    return <LoadingSpinner label="در حال بررسی دسترسی..." />;
  }

  if (!hasBusiness) {
    return <LoadingSpinner label="در حال بررسی دسترسی..." />;
  }

  return <>{children}</>;
}