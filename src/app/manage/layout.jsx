// src/app/manage/layout.jsx
'use client';
import { useRequireBusiness } from '@/hooks/useRequireBusiness';
import LoadingSpinner from '@/components/common/LoadingSpinner';

export default function ManageLayout({ children }) {
  const { isAuthenticated, hasBusiness, hydrated } = useRequireBusiness();

  // ─── نمایش لودینگ تا تایید دسترسی ───
  if (!hydrated || !isAuthenticated || !hasBusiness) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg)]">
        <LoadingSpinner label="در حال بررسی دسترسی..." />
      </div>
    );
  }

  return <>{children}</>;
}
