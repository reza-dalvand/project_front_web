// src/app/manage/price-list/page.jsx
'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FiTag, FiEye, FiEyeOff, FiEdit2, FiInfo } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import { useBusinessStore } from '@/stores/useBusinessStore';
import { usePriceListStore } from '@/stores/usePriceListStore';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { useToast } from '@/hooks/useToast';
import ScreenWrapper from '@/components/common/ScreenWrapper';
import Header from '@/components/common/Header';
import Card from '@/components/common/Card';
import SectionHeader from '@/components/common/SectionHeader';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import PriceListMenu from '@/components/priceList/PriceListMenu';
import { PRICE_LIST_THEMES } from '@/data/priceList';

export default function ManagePriceListPage() {
  const { colors } = useTheme();
  const router = useRouter();
  const { isAuthenticated } = useRequireAuth({ redirectToLogin: true });
  const { showToast } = useToast();
  const businessData = useBusinessStore((s) => s.businessData);
  const businessId = businessData?.id || 'biz_1';
  const list = usePriceListStore((s) => s.lists[businessId]);
  const isLoading = usePriceListStore((s) => s.isLoading);
  const fetchPriceList = usePriceListStore((s) => s.fetchPriceList);
  const ensureList = usePriceListStore((s) => s.ensureList);
  const setTheme = usePriceListStore((s) => s.setTheme);
  const togglePublish = usePriceListStore((s) => s.togglePublish);

  // ═══════ بارگذاری اولیه ═══════
  useEffect(() => {
    fetchPriceList(businessId);
  }, [businessId, fetchPriceList]);

  useEffect(() => {
    ensureList(businessId);
  }, [businessId, ensureList]);

  // ═══════ Handlerها ═══════
  const handleTogglePublish = () => {
    const next = togglePublish(businessId);
    showToast(
      next
        ? '✓ لیست قیمت منتشر شد و در صفحه کسب‌وکار نمایش داده می‌شود'
        : 'لیست قیمت از صفحه کسب‌وکار مخفی شد',
      next ? 'success' : 'info'
    );
  };

  const handleThemeChange = (themeId) => {
    setTheme(businessId, themeId);
    showToast('تم ظاهری تغییر کرد', 'success');
  };

  const settings = list || { themeId: 'classic', isPublished: false, services: [] };

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
      <Header title="لیست قیمت خدمات" onBackPress={() => router.push('/manage')} />
      <div className="flex-1 overflow-y-auto p-4 pb-32 space-y-5">
        {/* ═══ لودینگ ═══ */}
        {isLoading && (
          <div className="flex justify-center py-8">
            <LoadingSpinner label="در حال بارگذاری لیست قیمت..." />
          </div>
        )}

        {/* ═══ انتشار / مخفی ═══ */}
        <Card variant="elevated" padding={16} radius={18}>
          <div className="flex items-center gap-3">
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center"
              style={{
                backgroundColor: settings.isPublished ? '#43A04718' : colors.border + '40',
              }}
            >
              {settings.isPublished ? (
                <FiEye size={20} color="#43A047" />
              ) : (
                <FiEyeOff size={20} style={{ color: colors.textSecondary }} />
              )}
            </div>
            <div className="flex-1">
              <p className="text-sm font-[Vazir-Bold]" style={{ color: colors.textMain }}>
                انتشار لیست قیمت
              </p>
              <p className="text-[11px] mt-0.5" style={{ color: colors.textSecondary }}>
                {settings.isPublished
                  ? 'در تب «قیمت‌ها» صفحه کسب‌وکار نمایش داده می‌شود'
                  : 'فعلاً فقط خودتان در پیش‌نمایش می‌بینید'}
              </p>
            </div>
            <button
              onClick={handleTogglePublish}
              className="relative w-11 h-6 rounded-full transition-colors flex-shrink-0"
              style={{ backgroundColor: settings.isPublished ? '#43A047' : colors.border }}
            >
              <div
                className="absolute top-0.5 w-5 h-5 rounded-full shadow-md transition-all"
                style={{
                  backgroundColor: '#fff',
                  [settings.isPublished ? 'right' : 'left']: '2px',
                }}
              />
            </button>
          </div>
        </Card>

        {/* ═══ انتخاب تم ═══ */}
        <div>
          <SectionHeader
            icon={<FiTag size={18} />}
            iconColor="#E91E63"
            title="تم ظاهری منو"
            subtitle="رنگ‌بندی کارت قیمت را انتخاب کنید"
          />
          <div className="grid grid-cols-2 gap-2.5">
            {PRICE_LIST_THEMES.map((t) => {
              const selected = settings.themeId === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => handleThemeChange(t.id)}
                  className="flex items-center gap-2.5 p-3 rounded-2xl border-2 transition-all"
                  style={{
                    borderColor: selected ? t.accent : colors.border,
                    backgroundColor: selected ? t.accent + '10' : colors.cardBackground,
                  }}
                >
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-base flex-shrink-0"
                    style={{ backgroundColor: t.bg, border: `1.5px solid ${t.border}` }}
                  >
                    {t.emoji}
                  </div>
                  <span
                    className="text-xs font-[Vazir-Bold] flex-1 text-right"
                    style={{ color: selected ? t.accent : colors.textMain }}
                  >
                    {t.label}
                  </span>
                  {selected && (
                    <div
                      className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: t.accent }}
                    >
                      <span className="text-[10px] text-white">✓</span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* ═══ پیش‌نمایش زنده ═══ */}
        <div>
          <SectionHeader
            icon={<FiEye size={18} />}
            iconColor="#43A047"
            title="پیش‌نمایش زنده"
            subtitle="دقیقاً همان چیزی که مشتری می‌بیند"
          />
          <PriceListMenu
            businessName={businessData?.name}
            businessLogo={businessData?.logo}
            settings={settings}
          />
        </div>

        {/* ═══ راهنمای قیمت‌ها ═══ */}
        <Card
          variant="default"
          padding={14}
          radius={14}
          className="border"
          style={{ borderColor: colors.primary + '30', backgroundColor: colors.primary + '08' }}
        >
          <div className="flex items-start gap-2.5">
            <FiEdit2 size={16} style={{ color: colors.primary }} className="flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-xs font-[Vazir-Bold] mb-1" style={{ color: colors.textMain }}>
                قیمت‌ها خودکار از بخش «خدمات» خوانده می‌شوند
              </p>
              <p className="text-[11px] leading-5 mb-2" style={{ color: colors.textSecondary }}>
                برای تغییر قیمت هر خدمت، به مدیریت خدمات مراجعه کنید.
              </p>
              <button
                onClick={() => router.push('/manage/services')}
                className="text-[11px] font-[Vazir-Bold] underline"
                style={{ color: colors.primary }}
              >
                مدیریت خدمات و قیمت‌ها
              </button>
            </div>
          </div>
        </Card>
      </div>
    </ScreenWrapper>
  );
}
