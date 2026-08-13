// src/app/manage/gallery/page.jsx
'use client';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/stores/useThemeStore';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import ScreenWrapper from '@/components/common/ScreenWrapper';
import Header from '@/components/common/Header';
import GalleryManager from '@/components/manageBusiness/gallery/GalleryManager';

export default function ManageGalleryPage() {
  const router = useRouter();
  const { colors } = useTheme();
  const { isAuthenticated } = useRequireAuth({ redirectToLogin: true });

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
      <Header title="مدیریت گالری" onBackPress={() => router.push('/manage')} />
      <div className="flex-1 overflow-y-auto p-5 pb-32">
        <GalleryManager />
      </div>
    </ScreenWrapper>
  );
}
