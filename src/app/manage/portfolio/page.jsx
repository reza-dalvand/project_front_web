'use client';
import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { FiCamera, FiPlus, FiImage, FiTag } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import { useBusinessStore } from '@/stores/useBusinessStore';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { useToast } from '@/hooks/useToast';
import ScreenWrapper from '@/components/common/ScreenWrapper';
import Header from '@/components/common/Header';
import Card from '@/components/common/Card';
import EmptyStateVariants from '@/components/common/EmptyStateVariants';
import StatsCard from '@/components/common/StatsCard';
import {
  PortfolioCard,
  PortfolioFormSheet,
  PortfolioDetailModal,
} from '@/components/manageBusiness/portfolio';
import { toPersianDigit } from '@/utils/numberUtils';

export default function ManagePortfolioPage() {
  const { colors } = useTheme();
  const router = useRouter();
  const { isAuthenticated } = useRequireAuth({ redirectToLogin: true });
  const { showToast } = useToast();
  const businessData = useBusinessStore((s) => s.businessData);

  const [formVisible, setFormVisible] = useState(false);
  const [editingPortfolio, setEditingPortfolio] = useState(null);
  const [detailVisible, setDetailVisible] = useState(false);
  const [activePortfolio, setActivePortfolio] = useState(null);

  const portfolios = businessData?.portfolios || [];
  const services = businessData?.services || [];

  // آمار
  const stats = useMemo(() => {
    const totalImages = portfolios.reduce(
      (sum, p) => sum + (p.images?.length || (p.coverImage ? 1 : 0)),
      0
    );
    const withService = portfolios.filter((p) => p.serviceId).length;
    return {
      total: portfolios.length,
      totalImages,
      withService,
    };
  }, [portfolios]);

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

  const handleSave = (portfolioData, editingId) => {
    if (editingId) {
      // ویرایش
      showToast('✓ نمونه‌کار با موفقیت ویرایش شد', 'success');
    } else {
      // افزودن جدید
      showToast('✓ نمونه‌کار جدید اضافه شد', 'success');
    }
    setFormVisible(false);
    setEditingPortfolio(null);
  };

  const handleDelete = (portfolio) => {
    setDetailVisible(false);
    setActivePortfolio(null);
    showToast('✓ نمونه‌کار حذف شد', 'info');
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
      <Header title="نمونه‌کارها" onBackPress={() => router.push('/manage')} />
      <div className="flex-1 overflow-y-auto p-4 pb-32">
        {/* ═══════ Hero Section ═══════ */}
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
            {/* ═══════ Stats ═══════ */}
            <Card variant="elevated" padding={14} radius={18} className="mb-4">
              <div className="flex items-center">
                <StatsCard
                  icon="📸"
                  label="نمونه‌کار"
                  value={toPersianDigit(stats.total)}
                  color="#9C27B0"
                  variant="compact"
                />
                <div className="w-px h-10 mx-2" style={{ backgroundColor: colors.border }} />
                <StatsCard
                  icon="🖼️"
                  label="تصویر"
                  value={toPersianDigit(stats.totalImages)}
                  color="#2196F3"
                  variant="compact"
                />
                <div className="w-px h-10 mx-2" style={{ backgroundColor: colors.border }} />
                <StatsCard
                  icon="💆‍♀️"
                  label="با خدمت"
                  value={toPersianDigit(stats.withService)}
                  color="#4CAF50"
                  variant="compact"
                />
              </div>
            </Card>

            {/* ═══════ دکمه سبز افزودن ═══════ */}
            <button
              onClick={openAddForm}
              className="w-full flex items-center gap-3 p-3.5 rounded-2xl mb-4 transition-all hover:scale-[1.01] active:scale-[0.99]"
              style={{ backgroundColor: '#43A047' }}
            >
              <div
                className="w-11 h-11 rounded-[14px] flex items-center justify-center"
                style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
              >
                <FiPlus size={22} color="#fff" />
              </div>
              <div className="flex-1 text-right">
                <p className="text-[15px] font-[Vazir-Bold] text-white">افزودن نمونه‌کار جدید</p>
                <p className="text-[11px] text-white/80">کارهای جدید خود را به گالری اضافه کنید</p>
              </div>
              <span className="text-white text-xl">←</span>
            </button>

            {/* ═══════ Grid نمونه‌کارها ═══════ */}
            <div className="flex flex-wrap gap-3 justify-between">
              {portfolios.map((portfolio) => (
                <PortfolioCard
                  key={portfolio.id}
                  portfolio={portfolio}
                  onPress={openDetail}
                  onEdit={openEditForm}
                  onDelete={(p) => {
                    if (confirm(`آیا از حذف "${p.title}" مطمئن هستید؟`)) {
                      showToast('✓ نمونه‌کار حذف شد', 'info');
                    }
                  }}
                />
              ))}
            </div>
          </>
        ) : (
          <EmptyStateVariants variant="portfolio" onAction={openAddForm} />
        )}
      </div>

      {/* ═══════ Modals ═══════ */}
      <PortfolioDetailModal
        visible={detailVisible}
        portfolio={activePortfolio}
        services={services}
        onClose={() => {
          setDetailVisible(false);
          setActivePortfolio(null);
        }}
        onEdit={(p) => {
          setDetailVisible(false);
          setTimeout(() => openEditForm(p), 300);
        }}
        onDelete={handleDelete}
      />

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
    </ScreenWrapper>
  );
}
