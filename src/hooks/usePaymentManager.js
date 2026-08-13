// src/hooks/usePaymentManager.js
/**
 * Hook مدیریت مالی کسب‌وکار
 *
 * ترکیب paymentsService + usePaymentStore
 * برای استفاده در صفحه manage/financial
 */
'use client';
import { useState, useMemo, useCallback, useEffect } from 'react';
import { usePaymentStore, TX_STATUS_MAP, TX_TYPE_MAP } from '@/stores/usePaymentStore';
import { paymentsService } from '@/api';
import { USE_MOCK } from '@/api/config';
import { useToast } from '@/hooks/useToast';

export const usePaymentManager = () => {
  const { showToast } = useToast();
  const {
    businessStats,
    transactions,
    settlements,
    isLoading,
    isLoadingStats,
    fetchBusinessStats,
    fetchBusinessTransactions,
    fetchSettlements,
    requestSettlement,
  } = usePaymentStore();

  const [activeTab, setActiveTab] = useState('all');
  const [selectedTx, setSelectedTx] = useState(null);
  const [detailVisible, setDetailVisible] = useState(false);

  // ═══════ بارگذاری اولیه ═══════
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        await Promise.all([fetchBusinessStats(), fetchBusinessTransactions(), fetchSettlements()]);
      } catch (error) {
        console.error('Failed to load financial data:', error);
        showToast('خطا در بارگذاری اطلاعات مالی', 'error');
      }
    };
    loadInitialData();
  }, []);

  // ═══════ فیلتر تراکنش‌ها ═══════
  const filteredTransactions = useMemo(() => {
    if (activeTab === 'all') return transactions;
    return transactions.filter((tx) => tx.status === activeTab);
  }, [transactions, activeTab]);

  // ═══════ شمارنده‌ها ═══════
  const tabCounts = useMemo(() => {
    const counts = { all: transactions.length };
    Object.keys(TX_STATUS_MAP).forEach((status) => {
      counts[status] = transactions.filter((tx) => tx.status === status).length;
    });
    return counts;
  }, [transactions]);

  // ═══════ هندلرها ═══════
  const handleOpenDetail = useCallback((tx) => {
    setSelectedTx(tx);
    setDetailVisible(true);
  }, []);

  const handleCloseDetail = useCallback(() => {
    setDetailVisible(false);
    setSelectedTx(null);
  }, []);

  const handleRequestSettlement = useCallback(async () => {
    try {
      await requestSettlement(null);
      showToast('درخواست تسویه با موفقیت ثبت شد', 'success');
    } catch (error) {
      showToast(error.message || 'خطا در ثبت درخواست تسویه', 'error');
    }
  }, [requestSettlement, showToast]);

  return {
    businessStats,
    transactions: filteredTransactions,
    allTransactions: transactions,
    settlements,
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
    fetchBusinessTransactions,
  };
};
