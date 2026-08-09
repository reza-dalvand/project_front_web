'use client';
import { useState, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { FiCreditCard } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import { useAuthStore } from '@/stores/useAuthStore';
import { useBusinessStore } from '@/stores/useBusinessStore';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { useToast } from '@/hooks/useToast';
import ScreenWrapper from '@/components/common/ScreenWrapper';
import Header from '@/components/common/Header';
import Card from '@/components/common/Card';
import EmptyState from '@/components/common/EmptyState';
import FinancialStatsCards from '@/components/manageBusiness/financial/FinancialStatsCards';
import BankInfoCard from '@/components/manageBusiness/financial/BankInfoCard';
import FinancialTabs from '@/components/manageBusiness/financial/FinancialTabs';
import TransactionItem from '@/components/manageBusiness/financial/TransactionItem';
import {
  MOCK_TRANSACTIONS,
  MOCK_BANK_INFO,
  toPersianDigit,
} from '@/components/manageBusiness/financial/constants';

// ✅ Lazy Load
const BankEditModal = dynamic(() => import('@/components/manageBusiness/financial/BankEditModal'), {
  ssr: false,
  loading: () => null,
});

const TransactionDetailModal = dynamic(
  () => import('@/components/manageBusiness/financial/TransactionDetailModal'),
  { ssr: false, loading: () => null }
);

export default function FinancialManagementPage() {
  const { colors } = useTheme();
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const businessData = useBusinessStore((s) => s.businessData);
  const { isAuthenticated } = useRequireAuth({ redirectToLogin: true });
  const { showToast } = useToast();

  const [transactions] = useState(MOCK_TRANSACTIONS);
  const [activeTab, setActiveTab] = useState('all');
  const [bankInfo, setBankInfo] = useState(MOCK_BANK_INFO);
  const [bankEditVisible, setBankEditVisible] = useState(false);
  const [selectedTx, setSelectedTx] = useState(null);
  const [txDetailVisible, setTxDetailVisible] = useState(false);

  const businessOwnerName = businessData?.verifiedName || user?.name || '';

  // ✅ useMemo برای محاسبات
  const stats = useMemo(() => {
    const sumBy = (status) =>
      transactions.filter((t) => t.status === status).reduce((s, t) => s + (t.amount || 0), 0);
    return {
      blockedAmount: sumBy('blocked'),
      settlingAmount: sumBy('settling'),
      settledAmount: sumBy('settled'),
      refundedAmount: sumBy('refunded'),
      totalAmount: transactions.reduce((s, t) => s + (t.amount || 0), 0),
    };
  }, [transactions]);

  const tabCounts = useMemo(() => {
    const c = (status) => transactions.filter((t) => t.status === status).length;
    return {
      all: transactions.length,
      blocked: c('blocked'),
      settling: c('settling'),
      settled: c('settled'),
      refunded: c('refunded'),
    };
  }, [transactions]);

  const filteredTransactions = useMemo(() => {
    if (activeTab === 'all') return transactions;
    return transactions.filter((t) => t.status === activeTab);
  }, [transactions, activeTab]);

  const hasPendingMoney = stats.blockedAmount > 0 || stats.settlingAmount > 0;

  // ✅ useCallback
  const handleOpenBankEdit = useCallback(() => setBankEditVisible(true), []);
  const handleCloseBankEdit = useCallback(() => setBankEditVisible(false), []);

  const handleSaveBankInfo = useCallback(
    (data) => {
      setBankInfo((prev) => ({ ...prev, ...data, isRegistered: true, isVerified: false }));
      setBankEditVisible(false);
      showToast('✓ اطلاعات حساب بانکی ثبت شد و وارد چرخه تایید شد', 'success');
    },
    [showToast]
  );

  const handleTxPress = useCallback((tx) => {
    setSelectedTx(tx);
    setTxDetailVisible(true);
  }, []);

  const handleCloseTxDetail = useCallback(() => {
    setTxDetailVisible(false);
    setSelectedTx(null);
  }, []);

  const goBack = useCallback(() => router.push('/manage'), [router]);

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
      <Header title="مدیریت مالی" onBackPress={goBack} />
      <div className="flex-1 overflow-y-auto p-4 pb-32">
        <FinancialStatsCards stats={stats} />
        <BankInfoCard
          bankInfo={bankInfo}
          onEdit={handleOpenBankEdit}
          businessOwnerName={businessOwnerName}
          hasActiveAppointments={hasPendingMoney}
        />

        <div className="flex items-center gap-2 mb-3 mt-2 px-0.5">
          <FiCreditCard size={20} style={{ color: colors.primary }} />
          <h3 className="text-sm font-[Vazir-Bold]" style={{ color: colors.textMain }}>
            تاریخچه تراکنش‌ها
          </h3>
          <div className="flex-1" />
          <span className="text-xs" style={{ color: colors.textSecondary }}>
            {toPersianDigit(filteredTransactions.length)} تراکنش
          </span>
        </div>

        <FinancialTabs active={activeTab} counts={tabCounts} onChange={setActiveTab} />

        {filteredTransactions.length > 0 ? (
          filteredTransactions.map((tx) => (
            <TransactionItem key={tx.id} tx={tx} onPress={handleTxPress} />
          ))
        ) : (
          <Card variant="elevated" padding={0} radius={16}>
            <EmptyState
              icon="🧾"
              title="تراکنشی یافت نشد"
              description="در این دسته‌بندی هنوز تراکنشی ثبت نشده است"
            />
          </Card>
        )}
      </div>

      {/* مدال‌ها (Lazy) */}
      <BankEditModal
        visible={bankEditVisible}
        onClose={handleCloseBankEdit}
        onSave={handleSaveBankInfo}
        bankInfo={bankInfo}
        businessOwnerName={businessOwnerName}
      />
      <TransactionDetailModal
        visible={txDetailVisible}
        tx={selectedTx}
        onClose={handleCloseTxDetail}
      />
    </ScreenWrapper>
  );
}
