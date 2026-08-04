'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { FiImage, FiPlus, FiCamera } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import { useBusinessStore } from '@/stores/useBusinessStore';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { useToast } from '@/hooks/useToast';
import ScreenWrapper from '@/components/common/ScreenWrapper';
import Header from '@/components/common/Header';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import EmptyStateVariants from '@/components/common/EmptyStateVariants';
import StatsCard from '@/components/common/StatsCard';
import PortfolioCard from '@/components/manageBusiness/portfolio/PortfolioCard';
import { toPersianDigit } from '@/utils/numberUtils';

// دیتای موقت نمونه‌کارها
const MOCK_PORTFOLIOS = [
  {
    id: 'pf1',
    title: 'فیشیال VIP عروس',
    coverImage: 'https://picsum.photos/400/400?random=60',
    images: [
      'https://picsum.photos/800/800?random=60',
      'https://picsum.photos/800/800?random=160',
      'https://picsum.photos/800/800?random=260',
    ],
    description: 'فیشیال تخصصی عروس با استفاده از بهترین محصولات روز دنیا.',
    serviceId: 'svc_1',
    serviceName: 'فیشیال تخصصی پوست',
  },
  {
    id: 'pf2',
    title: 'کاشت ناخن ژلیش',
    coverImage: 'https://picsum.photos/400/400?random=61',
    images: [
      'https://picsum.photos/800/800?random=61',
      'https://picsum.photos/800/800?random=161',
    ],
    description: 'کاشت ناخن با طراحی مینیمال و ژلیش ماندگار تا ۳ هفته.',
    serviceId: 'svc_2',
    serviceName: 'کاشت ناخن ژلیش',
  },
  {
    id: 'pf3',
    title: 'میکاپ و شینیون عروس',
    coverImage: 'https://picsum.photos/400/400?random=62',
    images: [
      'https://picsum.photos/800/800?random=62',
      'https://picsum.photos/800/800?random=162',
      'https://picsum.photos/800/800?random=262',
      'https://picsum.photos/800/800?random=362',
    ],
    description: 'میکاپ حرفه‌ای عروس با سبک اروپایی و شینیون مدرن.',
    serviceId: null,
    serviceName: null,
  },
  {
    id: 'pf4',
    title: 'لیزر موهای زائد',
    coverImage: 'https://picsum.photos/400/400?random=63',
    images: ['https://picsum.photos/800/800?random=63'],
    description: 'لیزر با دستگاه الکساندرایت ۲۰۲۴ - بدون درد و ماندگار.',
    serviceId: 'svc_3',
    serviceName: 'لیزر فول بادی',
  },
];

export default function ManagePortfolioPage() {
  const { colors } = useTheme();
  const router = useRouter();
  const { isAuthenticated } = useRequireAuth({ redirectToLogin: true });
  const { showToast } = useToast();

  const [portfolios, setPortfolios] = useState(MOCK_PORTFOLIOS);

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

  const handleDelete = (portfolio) => {
    if (confirm(`آیا از حذف "${portfolio.title}" مطمئن هستید؟`)) {
      setPortfolios((prev) => prev.filter((p) => p.id !== portfolio.id));
      showToast('✓ نمونه‌کار حذف شد', 'info');
    }
  };

  const handleEdit = (portfolio) => {
    showToast(`ویرایش "${portfolio.title}" - به زودی`, 'info');
  };

  const handleAdd = () => {
    showToast('افزودن نمونه‌کار جدید - به زودی', 'info');
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
        {/* Hero Section */}
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

            {/* دکمه افزودن */}
            <button
              onClick={handleAdd}
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
                <p className="text-[15px] font-[Vazir-Bold] text-white">
                  افزودن نمونه‌کار جدید
                </p>
                <p className="text-[11px] text-white/80">
                  کارهای جدید خود را به گالری اضافه کنید
                </p>
              </div>
              <span className="text-white">←</span>
            </button>

            {/* Grid نمونه‌کارها */}
            <div className="flex flex-wrap gap-3 justify-between">
              {portfolios.map((portfolio) => (
                <PortfolioCard
                  key={portfolio.id}
                  portfolio={portfolio}
                  onPress={(p) => console.log('View:', p.title)}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          </>
        ) : (
          <EmptyStateVariants variant="portfolio" onAction={handleAdd} />
        )}
      </div>
    </ScreenWrapper>
  );
}