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
import { useAuthStore } from '@/stores/useAuthStore';
import { useBusinessStore } from '@/stores/useBusinessStore';
import CapacitorSplashManager from './CapacitorSplashManager';

import dynamic from 'next/dynamic';
const UpdateModal = dynamic(() => import('@/components/common/UpdateModal'), {
  ssr: false,
  loading: () => null,
});
const MaintenanceModal = dynamic(() => import('@/components/common/MaintenanceModal'), {
  ssr: false,
  loading: () => null,
});

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

function BusinessInitializer() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const fetchBusinessDetail = useBusinessStore((s) => s.fetchBusinessDetail);
  const businessId = useBusinessStore((s) => s.businessData?.id);

  useEffect(() => {
    if (isAuthenticated) {
      fetchBusinessDetail().catch((err) => {
        console.warn('Business fetch failed:', err);
      });
    }
  }, [isAuthenticated, fetchBusinessDetail]);
  
  return null;
}

export default function Providers({ children }) {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <CapacitorSplashManager />
        <StoreInitializers />
        <BusinessInitializer />
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
