// src/app/manage/financial/page.jsx
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FiCreditCard, FiRefreshCw, FiAlertTriangle } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { useBusinessStore } from '@/stores/useBusinessStore';
import { useToast } from '@/hooks/useToast';
import ScreenWrapper from '@/components/common/ScreenWrapper';
import Header from '@/components/common/Header';
import Button from '@/components/common/Button';
import FinancialStatsCards from '@/components/manageBusiness/financial/FinancialStatsCards';
import BankInfoCard from '@/components/manageBusiness/financial/BankInfoCard';
import FinancialTabs from '@/components/manageBusiness/financial/FinancialTabs';
import TransactionItem from '@/components/manageBusiness/financial/TransactionItem';
import { usePaymentManager } from '@/hooks/usePaymentManager';
import { TX_STATUS_MAP } from '@/stores/usePaymentStore';
import dynamic from 'next/dynamic';

const TransactionDetailModal = dynamic(
  () => import('@/components/manageBusiness/financial/TransactionDetailModal'),
  { ssr: false, loading: () => null }
);
const BankEditModal = dynamic(() => import('@/components/manageBusiness/financial/BankEditModal'), {
  ssr: false,
  loading: () => null,
});

export default function FinancialManagementPage() {
  const { colors } = useTheme();
  const router = useRouter();
  const { isAuthenticated } = useRequireAuth({ redirectToLogin: true });
  const businessData = useBusinessStore((s) => s.businessData);
  const { showToast } = useToast();

  const {
    businessStats,
    transactions,
    isLoading,
    isLoadingStats,
    activeTab,
    setActiveTab,
    tabCounts,
    selectedTx,
    detailVisible,
    handleOpenDetail,
    handleCloseDetail,
    handleRequestSettlement,
  } = usePaymentManager();

  const [bankEditVisible, setBankEditVisible] = useState(false);
  const bankInfo = businessData?.bankInfo || { isRegistered: false, isVerified: false };
  const hasPendingMoney = (businessStats?.blocked || 0) > 0 || (businessStats?.settling || 0) > 0;

  const handleSaveBankInfo = (data) => {
    setBankEditVisible(false);
    showToast('اطلاعات حساب بانکی ثبت شد و وارد مرحله تایید شد', 'success');
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
      <Header title="مدیریت مالی" onBackPress={() => router.push('/manage')} />

      <div className="flex-1 overflow-y-auto p-4 pb-32">
        {/* آمار مالی */}
        {isLoadingStats ? (
          <div className="flex justify-center py-8">
            <div
              className="w-8 h-8 border-3 border-current border-t-transparent rounded-full animate-spin"
              style={{ color: colors.primary }}
            />
          </div>
        ) : (
          <FinancialStatsCards stats={businessStats} />
        )}

        {/* اطلاعات بانکی */}
        <BankInfoCard
          bankInfo={bankInfo}
          onEdit={() => setBankEditVisible(true)}
          businessOwnerName={businessData?.ownerName || ''}
          hasActiveAppointments={hasPendingMoney}
        />

        {/* دکمه درخواست تسویه */}
        {(businessStats?.settling || 0) > 0 && (
          <div className="mb-4">
            <Button
              title="درخواست تسویه"
              onPress={handleRequestSettlement}
              variant="primary"
              size="lg"
              fullWidth
              icon={<FiRefreshCw size={18} color="#fff" />}
              iconPosition="right"
            />
          </div>
        )}

        {/* تب‌ها */}
        <div className="flex items-center gap-2 mb-3 px-0.5">
          <FiCreditCard size={20} style={{ color: colors.primary }} />
          <h3 className="text-sm font-[Vazir-Bold]" style={{ color: colors.textMain }}>
            تراکنش‌های مالی
          </h3>
        </div>

        <FinancialTabs active={activeTab} counts={tabCounts} onChange={setActiveTab} />

        {/* لیست تراکنش‌ها */}
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div
              className="w-8 h-8 border-3 border-current border-t-transparent rounded-full animate-spin"
              style={{ color: colors.primary }}
            />
          </div>
        ) : transactions.length > 0 ? (
          transactions.map((tx) => (
            <TransactionItem key={tx.id} tx={tx} onPress={handleOpenDetail} />
          ))
        ) : (
          <div className="flex flex-col items-center py-12 gap-3">
            <span className="text-4xl">💳</span>
            <p className="text-sm font-[Vazir-Bold]" style={{ color: colors.textMain }}>
              تراکنشی یافت نشد
            </p>
          </div>
        )}
      </div>

      {/* مدال‌ها */}
      <TransactionDetailModal visible={detailVisible} tx={selectedTx} onClose={handleCloseDetail} />
      <BankEditModal
        visible={bankEditVisible}
        onClose={() => setBankEditVisible(false)}
        onSave={handleSaveBankInfo}
        bankInfo={bankInfo}
        businessOwnerName={businessData?.ownerName || ''}
      />
    </ScreenWrapper>
  );
}
