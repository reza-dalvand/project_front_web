// src/components/providers/index.jsx
'use client';

import ThemeProvider from './ThemeProvider';
import ToastProvider from './ToastProvider';
import AuthProvider from './AuthProvider';
import ErrorBoundary from '@/components/common/ErrorBoundary';
import OfflineBanner from '@/components/common/OfflineBanner';
import UpdateModal from '@/components/common/UpdateModal';
import MaintenanceModal from '@/components/common/MaintenanceModal';

export default function Providers({ children }) {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <ToastProvider />
        <OfflineBanner />
        <AuthProvider>
          {children}
        </AuthProvider>
        <UpdateModal />
        <MaintenanceModal />
      </ThemeProvider>
    </ErrorBoundary>
  );
}