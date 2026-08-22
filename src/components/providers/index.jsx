// src/components/providers/index.jsx
'use client';
import { useEffect } from 'react';
import ThemeProvider from './ThemeProvider';
import ToastProvider from './ToastProvider';
import AuthProvider from './AuthProvider';
import BackButtonHandler from './BackButtonHandler';
import ErrorBoundary from '@/components/common/ErrorBoundary';
import OfflineBanner from '@/components/common/OfflineBanner';
import { useNetworkStore } from '@/stores/useNetworkStore';
import { useMaintenanceStore } from '@/stores/useMaintenanceStore';
import { useAppVersionStore } from '@/stores/useAppVersionStore';
import CapacitorSplashManager from './CapacitorSplashManager';

// ✅ Lazy load مدال‌های غیربحرانی
import dynamic from 'next/dynamic';
const UpdateModal = dynamic(() => import('@/components/common/UpdateModal'), {
  ssr: false,
  loading: () => null,
});
const MaintenanceModal = dynamic(() => import('@/components/common/MaintenanceModal'), {
  ssr: false,
  loading: () => null,
});

// ─── کامپوننت init storeها ───
function StoreInitializers() {
  const initNetwork = useNetworkStore((s) => s.init);
  const checkMaintenance = useMaintenanceStore((s) => s.checkMaintenance);
  const initMaintenanceListener = useMaintenanceStore((s) => s.initVisibilityListener);
  const checkForUpdate = useAppVersionStore((s) => s.checkForUpdate);
  const initVersionListener = useAppVersionStore((s) => s.initVisibilityListener);

  useEffect(() => {
    const cleanupNetwork = initNetwork();
    checkMaintenance();
    checkForUpdate();
    const cleanupMaintenance = initMaintenanceListener();
    const cleanupVersion = initVersionListener();
    return () => {
      cleanupNetwork?.();
      cleanupMaintenance?.();
      cleanupVersion?.();
    };
  }, []);

  return null;
}

function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-app">
      <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

export default function Providers({ children }) {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <CapacitorSplashManager /> {/* ✅ اینجا اضافه شود */}
        <StoreInitializers />
        <ToastProvider />
        <OfflineBanner />
        <BackButtonHandler>
          <AuthProvider>{children}</AuthProvider>
        </BackButtonHandler>
        <UpdateModal />
        <MaintenanceModal />
      </ThemeProvider>
    </ErrorBoundary>
  );
}
