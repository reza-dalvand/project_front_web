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
import { USE_MOCK } from '@/api/config';
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

  // ─── دریافت نمونه‌کارها از API ───
  useEffect(() => {
    const fetchPortfolios = async () => {
      setIsLoading(true);
      try {
        if (USE_MOCK) {
          setPortfolios(businessData?.portfolios || []);
        } else {
          const result = await portfoliosService.getMyPortfolios();
          setPortfolios(result.data || []);
        }
      } catch (error) {
        console.error('Failed to fetch portfolios:', error);
        showToast('خطا در بارگذاری نمونه‌کارها', 'error');
      } finally {
        setIsLoading(false);
      }
    };
    fetchPortfolios();
  }, [showToast, businessData?.portfolios]);

  // ─── ایجاد/ویرایش نمونه‌کار ───
  const handleSave = useCallback(
    async (portfolioData, editingId) => {
      try {
        if (!USE_MOCK) {
          if (editingId) {
            await portfoliosService.updatePortfolio(editingId, portfolioData);
          } else {
            await portfoliosService.createPortfolio(portfolioData);
          }
          // بروزرسانی لیست
          const result = await portfoliosService.getMyPortfolios();
          setPortfolios(result.data || []);
        } else {
          if (editingId) {
            setPortfolios((prev) =>
              prev.map((p) => (p.id === editingId ? { ...p, ...portfolioData } : p))
            );
          } else {
            setPortfolios((prev) => [{ ...portfolioData, id: `pf_${Date.now()}` }, ...prev]);
          }
        }
        showToast(editingId ? '✓ نمونه‌کار ویرایش شد' : '✓ نمونه‌کار جدید اضافه شد', 'success');
        setFormVisible(false);
        setEditingPortfolio(null);
      } catch (error) {
        console.error('Save portfolio failed:', error);
        showToast(error.message || 'خطا در ذخیره نمونه‌کار', 'error');
      }
    },
    [showToast]
  );

  // ─── حذف نمونه‌کار ───
  const handleDelete = useCallback(
    async (portfolio) => {
      try {
        if (!USE_MOCK) {
          await portfoliosService.deletePortfolio(portfolio.id);
          const result = await portfoliosService.getMyPortfolios();
          setPortfolios(result.data || []);
        } else {
          setPortfolios((prev) => prev.filter((p) => p.id !== portfolio.id));
        }
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
        {/* هدر + دکمه افزودن */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <FiImage size={20} style={{ color: colors.primary }} />
            <span className="text-base font-[Vazir-Bold]" style={{ color: colors.textMain }}>
              گالری نمونه‌کارها
            </span>
          </div>
          <span className="text-xs" style={{ color: colors.textSecondary }}>
            {toPersianDigit(portfolios.length)} نمونه‌کار
          </span>
        </div>

        {/* دکمه افزودن */}
        <button
          onClick={openAddForm}
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl border-2 border-dashed mb-4 transition-all hover:scale-[1.01] active:scale-[0.99]"
          style={{ borderColor: colors.primary + '50', backgroundColor: colors.primary + '05' }}
        >
          <FiPlus size={18} style={{ color: colors.primary }} />
          <span className="text-sm font-[Vazir-Bold]" style={{ color: colors.primary }}>
            افزودن نمونه‌کار جدید
          </span>
        </button>

        {/* لیست نمونه‌کارها */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div
              className="w-8 h-8 border-3 border-current border-t-transparent rounded-full animate-spin"
              style={{ color: colors.primary }}
            />
          </div>
        ) : portfolios.length > 0 ? (
          <div className="flex flex-wrap gap-3 justify-between">
            {portfolios.map((portfolio) => (
              <PortfolioCard
                key={portfolio.id}
                portfolio={portfolio}
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

      {/* مدال فرم */}
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

      {/* مدال جزئیات */}
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
