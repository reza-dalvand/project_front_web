'use client';
import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { FiPlus, FiHome } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { useToast } from '@/hooks/useToast';
import ScreenWrapper from '@/components/common/ScreenWrapper';
import Header from '@/components/common/Header';
import EmptyState from '@/components/common/EmptyState';
import LineRentalAdCard from '@/components/manageBusiness/lineRental/LineRentalAdCard';
import LineRentalStats from '@/components/manageBusiness/lineRental/LineRentalStats';
import { MOCK_LINE_RENTALS } from '@/data/lineRentals';

// ✅ Lazy Load
const CreateLineRentalAdSheet = dynamic(
  () => import('@/components/manageBusiness/lineRental/CreateLineRentalAdSheet'),
  { ssr: false, loading: () => null }
);

const LineRentalDetailModal = dynamic(
  () => import('@/components/manageBusiness/lineRental/LineRentalDetailModal'),
  { ssr: false, loading: () => null }
);


export default function LineRentalPage() {
  const { colors } = useTheme();
  const router = useRouter();
  const { isAuthenticated } = useRequireAuth({ redirectToLogin: true });
  const { showToast } = useToast();

  const [ads, setAds] = useState(MOCK_LINE_RENTALS);
  const [createVisible, setCreateVisible] = useState(false);
  const [editingAd, setEditingAd] = useState(null);
  const [selectedAd, setSelectedAd] = useState(null);
  const [detailVisible, setDetailVisible] = useState(false);

  const handleCreate = useCallback(() => {
    setEditingAd(null);
    setCreateVisible(true);
  }, []);

  const handleEdit = useCallback((ad) => {
    setEditingAd(ad);
    setCreateVisible(true);
  }, []);

  const handleDelete = useCallback((ad) => {
    setAds((p) => p.filter((a) => a.id !== ad.id));
    setDetailVisible(false);
    setSelectedAd(null);
    showToast('آگهی لاین با موفقیت حذف شد', 'success');
  }, [showToast]);

  const handleSave = useCallback((adData) => {
    if (editingAd) {
      setAds((p) => p.map((a) => (a.id === editingAd.id ? { ...a, ...adData } : a)));
      showToast('آگهی لاین با موفقیت ویرایش شد', 'success');
    } else {
      setAds((p) => [{ ...adData, lineImage: 'https://picsum.photos/400/400?random=99', businessName: 'سالن زیبایی نیلارام', city: 'تهران، سعادت‌آباد', contactPhone: '09121234567', createdAt: '۱۴۰۳/۰۴/۲۰', expiresAt: '۱۴۰۳/۰۵/۲۰' }, ...p]);
      showToast('آگهی لاین با موفقیت ثبت شد', 'success');
    }
  }, [editingAd, showToast]);

  const openDetail = useCallback((ad) => {
    setSelectedAd(ad);
    setDetailVisible(true);
  }, []);

  const closeDetail = useCallback(() => {
    setDetailVisible(false);
    setTimeout(() => setSelectedAd(null), 300);
  }, []);

  const closeCreate = useCallback(() => {
    setCreateVisible(false);
    setEditingAd(null);
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
      <Header title="اجاره لاین" onBackPress={goBack} />
      <div className="flex-1 overflow-y-auto p-4 pb-32">
        <div className="flex flex-col items-center gap-2 py-4 mb-4">
          <div className="w-[72px] h-[72px] rounded-3xl flex items-center justify-center" style={{ backgroundColor: colors.primary + '15' }}>
            <FiHome size={32} style={{ color: colors.primary }} />
          </div>
          <h2 className="text-lg font-[Vazir-Bold]" style={{ color: colors.textMain }}>اگهی همکاری</h2>
          <p className="text-xs text-center px-5" style={{ color: colors.textSecondary }}>برای مشاهده جزئیات، روی هر آگهی ضربه بزنید</p>
        </div>

        {ads.length > 0 && <div className="mb-4"><LineRentalStats ads={ads} /></div>}

        {ads.length > 0 && (
          <button onClick={handleCreate} className="w-full flex items-center gap-3 p-3.5 rounded-2xl mb-4 transition-all hover:scale-[1.01] active:scale-[0.99]" style={{ backgroundColor: '#43A047' }}>
            <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}>
              <FiPlus size={22} color="#fff" />
            </div>
            <div className="flex-1 text-right">
              <p className="text-sm font-[Vazir-Bold] text-white">ثبت آگهی همکاری</p>
              <p className="text-[11px] text-white/80">جذب متخصص برای محیط کاری</p>
            </div>
          </button>
        )}

        {ads.length > 0 ? (
          ads.map((ad) => <LineRentalAdCard key={ad.id} ad={ad} onPress={openDetail} />)
        ) : (
          <EmptyState icon="🏢" title="هنوز آگهی لاینی ثبت نکرده‌اید" description="با ثبت آگهی لاین، می‌توانید متخصصان جدید جذب کنید" actionLabel="ثبت اولین آگهی" onAction={handleCreate} />
        )}
      </div>

      <CreateLineRentalAdSheet visible={createVisible} onClose={closeCreate} onSave={handleSave} editingAd={editingAd} />
      <LineRentalDetailModal visible={detailVisible} ad={selectedAd} onClose={closeDetail} onEdit={handleEdit} onDelete={handleDelete} />
    </ScreenWrapper>
  );
}