'use client';
import { useState, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { FiCamera, FiPlus } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import { useBusinessStore } from '@/stores/useBusinessStore';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { useToast } from '@/hooks/useToast';
import ScreenWrapper from '@/components/common/ScreenWrapper';
import Header from '@/components/common/Header';
import Card from '@/components/common/Card';
import EmptyState from '@/components/common/EmptyState';
import StatsCard from '@/components/common/StatsCard';
import { PortfolioCard } from '@/components/manageBusiness/portfolio';
import { toPersianDigit } from '@/utils/numberUtils';

// ✅ Lazy Load
const PortfolioFormSheet = dynamic(
  () => import('@/components/manageBusiness/portfolio/PortfolioFormSheet'),
  { ssr: false, loading: () => null }
);

const PortfolioDetailModal = dynamic(
  () => import('@/components/manageBusiness/portfolio/PortfolioDetailModal'),
  { ssr: false, loading: () => null }
);

export default function ManagePortfolioPage() {
  const { colors } = useTheme();
  const router = useRouter();
  const { isAuthenticated } = useRequireAuth({ redirectToLogin: true });
  const { showToast } = useToast();
  const businessData = useBusinessStore((s) => s.businessData);
  const addPortfolio = useBusinessStore((s) => s.addPortfolio);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [formVisible, setFormVisible] = useState(false);
  const [editingPortfolio, setEditingPortfolio] = useState(null);
  const [detailVisible, setDetailVisible] = useState(false);
  const [activePortfolio, setActivePortfolio] = useState(null);

  const portfolios = businessData?.portfolios || [];
  const services = businessData?.services || [];

  // ✅ useMemo برای آمار
  const stats = useMemo(() => {
    const totalImages = portfolios.reduce(
      (sum, p) => sum + (p.images?.length || (p.coverImage ? 1 : 0)),
      0
    );
    return { total: portfolios.length, totalImages };
  }, [portfolios]);

  // ✅ useCallback برای handler‌ها
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

  const closeForm = useCallback(() => {
    setFormVisible(false);
    setEditingPortfolio(null);
  }, []);

  const handleSave = useCallback((portfolioData, editingId) => {
    if (editingId) {
      showToast('✓ نمونه‌کار با موفقیت ویرایش شد', 'success');
    } else {
      addPortfolio(portfolioData);
      showToast('✓ نمونه‌کار جدید اضافه شد', 'success');
    }
    setFormVisible(false);
    setEditingPortfolio(null);
  }, [showToast, addPortfolio]);

  const handleDelete = useCallback(() => {
    setDetailVisible(false);
    setActivePortfolio(null);
    showToast('✓ نمونه‌کار حذف شد', 'info');
  }, [showToast]);

  const handleEditFromDetail = useCallback((p) => {
    setDetailVisible(false);
    setTimeout(() => openEditForm(p), 300);
  }, [openEditForm]);

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
      <Header title="نمونه‌کارها" onBackPress={goBack} />
      <div className="flex-1 overflow-y-auto p-4 pb-32">
        {/* Hero */}
        <div className="flex flex-col items-center gap-2 py-4 mb-4">
          <div
            className="w-[72px] h-[72px] rounded-3xl flex items-center justify-center"
            style={{ backgroundColor: colors.primary + '15' }}
          >
            <FiCamera size={32} style={{ color: colors.primary }} />
          </div>
          <h2 className="text-lg font-[Vazir-Bold]" style={{ color: colors.textMain }}>
            گالری نمونه‌کارها
          </h2>
          <p className="text-xs font-[Vazir] text-center" style={{ color: colors.textSecondary }}>
            بهترین کارهای خود را به مشتریان نمایش دهید
          </p>
        </div>

        {portfolios.length > 0 ? (
          <>
            {/* Stats */}
            <Card variant="elevated" padding={14} radius={18} className="mb-4">
              <div className="flex items-center">
                <StatsCard icon="📸" label="نمونه‌کار" value={toPersianDigit(stats.total)} color="#9C27B0" variant="compact" />
                <div className="w-px h-10 mx-2" style={{ backgroundColor: colors.border }} />
                <StatsCard icon="🖼️" label="تصویر" value={toPersianDigit(stats.totalImages)} color="#2196F3" variant="compact" />
              </div>
            </Card>

            {/* دکمه افزودن */}
            <button
              onClick={openAddForm}
              className="w-full flex items-center gap-3 p-3.5 rounded-2xl mb-4 transition-all hover:scale-[1.01] active:scale-[0.99]"
              style={{ backgroundColor: '#43A047' }}
            >
              <div className="w-11 h-11 rounded-[14px] flex items-center justify-center" style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}>
                <FiPlus size={22} color="#fff" />
              </div>
              <div className="flex-1 text-right">
                <p className="text-[15px] font-[Vazir-Bold] text-white">افزودن نمونه‌کار جدید</p>
                <p className="text-[11px] text-white/80">کارهای جدید خود را به گالری اضافه کنید</p>
              </div>
              <span className="text-white text-xl">←</span>
            </button>

            {/* Grid */}
            <div className="flex flex-wrap gap-3 justify-between">
              {portfolios.map((portfolio) => (
                <PortfolioCard
                  key={portfolio.id}
                  portfolio={portfolio}
                  onPress={openDetail}
                  onEdit={openEditForm}
                  onDelete={(p) => {
                    setDeleteTarget(p);
                    setDeleteDialogVisible(true);
                  }}
                />
              ))}
            </div>
          </>
        ) : (
          <EmptyState variant="portfolio" onAction={openAddForm} />
        )}
      </div>

      {/* Modals (Lazy) */}
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

      <ConfirmDialog
        visible={deleteDialogVisible}
        title="حذف نمونه‌کار"
        message={`آیا از حذف "${deleteTarget?.title}" مطمئن هستید؟ این عمل قابل بازگشت نیست.`}
        confirmText="حذف"
        cancelText="انصراف"
        variant="danger"
        onConfirm={() => {
          showToast('✓ نمونه‌کار حذف شد', 'info');
          setDeleteDialogVisible(false);
          setDeleteTarget(null);
        }}
        onCancel={() => {
          setDeleteDialogVisible(false);
          setDeleteTarget(null);
        }}
      />
    </ScreenWrapper>
  );
}