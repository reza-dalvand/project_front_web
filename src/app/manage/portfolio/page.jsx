// src/app/manage/portfolio/page.jsx
'use client';
import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FiPlus, FiImage } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import { useBusinessStore } from '@/stores/useBusinessStore';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { useToast } from '@/hooks/useToast';
import ScreenWrapper from '@/components/common/ScreenWrapper';
import Header from '@/components/common/Header';
import EmptyState from '@/components/common/EmptyState';
import { PortfolioCard } from '@/components/manageBusiness/portfolio';
import dynamic from 'next/dynamic';
import { portfoliosService } from '@/api';
import { USE_MOCK } from '@/api/config';

const PortfolioFormSheet = dynamic(
  () => import('@/components/manageBusiness/portfolio/PortfolioFormSheet'),
  { ssr: false, loading: () => null }
);
const PortfolioDetailModal = dynamic(
  () => import('@/components/manageBusiness/portfolio/PortfolioDetailModal'),
  { ssr: false, loading: () => null }
);

export default function ManagePortfolioPage() {
  const router = useRouter();
  const { colors } = useTheme();
  const { isAuthenticated } = useRequireAuth({ redirectToLogin: true });
  const { showToast } = useToast();
  const businessData = useBusinessStore((s) => s.businessData);
  const addPortfolio = useBusinessStore((s) => s.addPortfolio);
  const updatePortfolio = useBusinessStore((s) => s.updatePortfolio);
  const deletePortfolio = useBusinessStore((s) => s.deletePortfolio);

  const [formVisible, setFormVisible] = useState(false);
  const [editingPortfolio, setEditingPortfolio] = useState(null);
  const [detailVisible, setDetailVisible] = useState(false);
  const [activePortfolio, setActivePortfolio] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const portfolios = businessData?.portfolios || [];
  const services = businessData?.services || [];

  // ═══ دریافت نمونه‌کارها از API ═══
  useEffect(() => {
    const fetchPortfolios = async () => {
      if (USE_MOCK) return;

      setIsLoading(true);
      try {
        const response = await portfoliosService.getMyPortfolios();
        // در production، باید store آپدیت شود
      } catch (error) {
        console.error('Failed to fetch portfolios:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPortfolios();
  }, []);

  const openAddForm = () => {
    setEditingPortfolio(null);
    setFormVisible(true);
  };

  const openEditForm = (portfolio) => {
    setEditingPortfolio(portfolio);
    setFormVisible(true);
  };

  const openDetail = (portfolio) => {
    setActivePortfolio(portfolio);
    setDetailVisible(true);
  };

  const closeDetail = () => {
    setDetailVisible(false);
    setActivePortfolio(null);
  };

  const closeForm = () => {
    setFormVisible(false);
    setEditingPortfolio(null);
  };

  const handleSave = async (portfolioData, editingId) => {
    if (editingId) {
      // ویرایش
      if (!USE_MOCK) {
        try {
          await portfoliosService.updatePortfolio(editingId, portfolioData);
        } catch (error) {
          showToast(error.message || 'خطا در ویرایش نمونه‌کار', 'error');
          return;
        }
      }
      updatePortfolio(editingId, portfolioData);
      showToast('✓ نمونه‌کار با موفقیت ویرایش شد', 'success');
    } else {
      // افزودن
      if (!USE_MOCK) {
        try {
          const response = await portfoliosService.createPortfolio(portfolioData);
          portfolioData.id = response.data?.id;
        } catch (error) {
          showToast(error.message || 'خطا در افزودن نمونه‌کار', 'error');
          return;
        }
      }
      addPortfolio(portfolioData);
      showToast('✓ نمونه‌کار جدید اضافه شد', 'success');
    }
    closeForm();
  };

  const handleDelete = async (portfolio) => {
    if (!USE_MOCK) {
      try {
        await portfoliosService.deletePortfolio(portfolio.id);
      } catch (error) {
        showToast(error.message || 'خطا در حذف نمونه‌کار', 'error');
        return;
      }
    }
    deletePortfolio(portfolio.id);
    showToast('✓ نمونه‌کار حذف شد', 'info');
    closeDetail();
  };

  const handleEditFromDetail = (p) => {
    closeDetail();
    setTimeout(() => openEditForm(p), 300);
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
    <ScreenWrapper scrollable padding={0}>
      <Header title="نمونه‌کارها" onBackPress={() => router.push('/manage')} />

      <div className="p-4 pb-32">
        {/* هدر + دکمه افزودن */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <FiImage size={20} style={{ color: colors.primary }} />
            <span className="text-base font-[Vazir-Bold]" style={{ color: colors.textMain }}>
              گالری نمونه‌کارها
            </span>
          </div>
          <button
            onClick={openAddForm}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
            style={{ backgroundColor: '#43A047' }}
          >
            <FiPlus size={16} color="#fff" />
            <span className="text-sm font-[Vazir-Bold] text-white">افزودن</span>
          </button>
        </div>

        {/* لیست نمونه‌کارها */}
        {portfolios.length > 0 ? (
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

      {/* مدال‌ها */}
      <PortfolioDetailModal
        visible={detailVisible}
        portfolio={activePortfolio}
        services={services}
        onClose={closeDetail}
        onEdit={handleEditFromDetail}
        onDelete={handleDelete}
      />
      <PortfolioFormSheet
        visible={formVisible}
        onClose={closeForm}
        onSave={handleSave}
        editingPortfolio={editingPortfolio}
        services={services}
      />
    </ScreenWrapper>
  );
}
