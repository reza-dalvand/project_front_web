// src/components/providers/index.jsx
'use client';
import { useEffect } from 'react';
import ThemeProvider from './ThemeProvider';
import ToastProvider from './ToastProvider';
import AuthProvider from './AuthProvider';
import ErrorBoundary from '@/components/common/ErrorBoundary';
import OfflineBanner from '@/components/common/OfflineBanner';
import UpdateModal from '@/components/common/UpdateModal';
import MaintenanceModal from '@/components/common/MaintenanceModal';
import { useNetworkStore } from '@/stores/useNetworkStore';
import { useMaintenanceStore } from '@/stores/useMaintenanceStore';
import { useAppVersionStore } from '@/stores/useAppVersionStore';

// کامپوننت داخلی برای init کردن store ها
function StoreInitializers() {
  const initNetwork = useNetworkStore((s) => s.init);
  const checkMaintenance = useMaintenanceStore((s) => s.checkMaintenance);
  const initMaintenanceListener = useMaintenanceStore((s) => s.initVisibilityListener);
  const checkForUpdate = useAppVersionStore((s) => s.checkForUpdate);
  const initVersionListener = useAppVersionStore((s) => s.initVisibilityListener);

  useEffect(() => {
    // init شبکه
    const cleanupNetwork = initNetwork();

    // بررسی اولیه تعمیرات و نسخه
    checkMaintenance();
    checkForUpdate();

    // گوش دادن به visibility
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

export default function Providers({ children }) {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <StoreInitializers />
        <ToastProvider />
        <OfflineBanner />
        <AuthProvider>{children}</AuthProvider>
        <UpdateModal />
        <MaintenanceModal />
      </ThemeProvider>
    </ErrorBoundary>
  );
}
