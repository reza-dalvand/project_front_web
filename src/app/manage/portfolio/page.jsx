// src/app/manage/portfolio/page.jsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { FiPlus, FiImage } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { useToast } from '@/hooks/useToast';
import ScreenWrapper from '@/components/common/ScreenWrapper';
import Header from '@/components/common/Header';
import EmptyState from '@/components/common/EmptyState';
import {
  PortfolioCard,
  PortfolioFormSheet,
  PortfolioDetailModal,
} from '@/components/manageBusiness/portfolio';
import { portfoliosService } from '@/api';
import { useBusinessStore } from '@/stores/useBusinessStore';
import { toPersianDigit } from '@/utils/numberUtils';
import { useRouter } from 'next/navigation';

export default function ManagePortfolioPage() {
  const { colors } = useTheme();
  const { isAuthenticated } = useRequireAuth({ redirectToLogin: true });
  const { showToast } = useToast();
  const router = useRouter();
  const businessData = useBusinessStore((s) => s.businessData);
  const services = businessData?.services || [];

  const [portfolios, setPortfolios] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [formVisible, setFormVisible] = useState(false);
  const [editingPortfolio, setEditingPortfolio] = useState(null);
  const [detailVisible, setDetailVisible] = useState(false);
  const [activePortfolio, setActivePortfolio] = useState(null);

  const fetchPortfolios = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await portfoliosService.getMyPortfolios();
      setPortfolios(result.data || []);
    } catch (error) {
      console.error('Failed to fetch portfolios:', error);
      showToast('خطا در بارگذاری نمونه‌کارها', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchPortfolios();
  }, [showToast, businessData?.portfolios]);

  const handleSave = useCallback(
    async (portfolioData, editId) => {
      try {
        if (editId) {
          await portfoliosService.updatePortfolio(editId, portfolioData);
        } else {
          await portfoliosService.createPortfolio(portfolioData);
        }

        // refresh لیست
        await fetchPortfolios();
        setFormVisible(false);
        setEditingPortfolio(null);

        showToast(editId ? '✓ نمونه‌کار ویرایش شد' : '✓ نمونه‌کار اضافه شد', 'success');
      } catch (error) {
        console.error('Save portfolio failed:', error);
        showToast(error.message || 'خطا در ذخیره نمونه‌کار', 'error');
      }
    },
    [showToast, fetchPortfolios]
  );

  // ✅ حذف USE_MOCK — فقط API
  const handleDelete = useCallback(
    async (portfolio) => {
      try {
        await portfoliosService.deletePortfolio(portfolio.id);
        const result = await portfoliosService.getMyPortfolios();
        setPortfolios(result.data || []);
        showToast('✓ نمونه‌کار حذف شد', 'success');
        setDetailVisible(false);
        setActivePortfolio(null);
      } catch (error) {
        console.error('Delete portfolio failed:', error);
        showToast(error.message || 'خطا در حذف نمونه‌کار', 'error');
      }
    },
    [showToast]
  );

  const openAddForm = useCallback(() => {
    setEditingPortfolio(null);
    setFormVisible(true);
  }, []);

  const openEditForm = useCallback((portfolio) => {
    setEditingPortfolio(portfolio);
    setFormVisible(true);
  }, []);

  const openDetail = useCallback((portfolio) => {
    setActivePortfolio(portfolio);
    setDetailVisible(true);
  }, []);

  const closeDetail = useCallback(() => {
    setDetailVisible(false);
    setActivePortfolio(null);
  }, []);

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
      <Header title="نمونه‌کارها" onBackPress={() => router.back()} />

      <div className="p-4 pb-32">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <FiImage size={20} style={{ color: colors.primary }} />
            <span className="text-base font-[Vazir-Bold]" style={{ color: colors.textMain }}>
              گالری نمونه‌کارها
            </span>
          </div>
          <span className="text-sm font-[Vazir]" style={{ color: colors.textSecondary }}>
            {toPersianDigit(portfolios.length)} نمونه‌کار
          </span>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div
              className="w-8 h-8 border-3 border-current border-t-transparent rounded-full animate-spin"
              style={{ color: colors.primary }}
            />
          </div>
        ) : portfolios.length > 0 ? (
          <div className="flex flex-wrap gap-3 justify-between">
            {portfolios.map((portfolio, index) => (
              <PortfolioCard
                key={portfolio.id}
                portfolio={portfolio}
                priority={index < 2}
                onPress={openDetail}
                onEdit={openEditForm}
                onDelete={handleDelete}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            icon="📸"
            title="هنوز نمونه‌کاری ثبت نشده"
            description="با ثبت نمونه‌کارها، اعتماد مشتریان را جلب کنید"
            actionLabel="افزودن اولین نمونه‌کار"
            onAction={openAddForm}
          />
        )}
      </div>

      <PortfolioFormSheet
        visible={formVisible}
        onClose={() => {
          setFormVisible(false);
          setEditingPortfolio(null);
        }}
        onSave={handleSave}
        editingPortfolio={editingPortfolio}
        services={services}
      />

      <PortfolioDetailModal
        visible={detailVisible}
        portfolio={activePortfolio}
        services={services}
        onClose={closeDetail}
        onEdit={openEditForm}
        onDelete={handleDelete}
      />
    </ScreenWrapper>
  );
}
