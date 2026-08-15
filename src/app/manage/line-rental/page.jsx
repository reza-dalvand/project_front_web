// src/app/manage/line-rental/page.jsx
'use client';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { FiPlus, FiHome } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { useToast } from '@/hooks/useToast';
import ScreenWrapper from '@/components/common/ScreenWrapper';
import Header from '@/components/common/Header';
import EmptyState from '@/components/common/EmptyState';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import LineRentalAdCard from '@/components/manageBusiness/lineRental/LineRentalAdCard';
import LineRentalStats from '@/components/manageBusiness/lineRental/LineRentalStats';
import CreateLineRentalAdSheet from '@/components/manageBusiness/lineRental/CreateLineRentalAdSheet';
import LineRentalDetailModal from '@/components/manageBusiness/lineRental/LineRentalDetailModal';
import { adsService } from '@/api';
import { USE_MOCK } from '@/api/config';
import { MOCK_LINE_RENTALS } from '@/data/lineRentals';

export default function LineRentalPage() {
  const { colors } = useTheme();
  const router = useRouter();
  const { isAuthenticated } = useRequireAuth({ redirectToLogin: true });
  const { showToast } = useToast();

  // ═══════ State‌ها ═══════
  const [ads, setAds] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // ✅ state فرم ایجاد/ویرایش
  const [formVisible, setFormVisible] = useState(false);
  const [editingAd, setEditingAd] = useState(null);

  // ✅ state مدال جزئیات
  const [detailVisible, setDetailVisible] = useState(false);
  const [selectedAd, setSelectedAd] = useState(null);

  // ═══════ دریافت لیست من از API ═══════
  useEffect(() => {
    const fetchMyAds = async () => {
      setIsLoading(true);
      try {
        if (USE_MOCK) {
          setAds(MOCK_LINE_RENTALS);
        } else {
          const result = await adsService.getMyLineRentals();
          setAds(result.data || []);
        }
      } catch (error) {
        console.error('Failed to fetch my line rentals:', error);
        showToast('خطا در بارگذاری آگهی‌ها', 'error');
      } finally {
        setIsLoading(false);
      }
    };
    fetchMyAds();
  }, [showToast]);

  // ═══════ باز کردن فرم ایجاد (جدید) ═══════
  const handleCreate = useCallback(() => {
    setEditingAd(null);
    setFormVisible(true);
  }, []);

  // ═══════ باز کردن فرم ویرایش ═══════
  const handleEdit = useCallback((ad) => {
    setEditingAd(ad);
    setFormVisible(true);
  }, []);

  // ═══════ بستن فرم ═══════
  const handleCloseForm = useCallback(() => {
    setFormVisible(false);
    setEditingAd(null);
  }, []);

  // ═══════ باز کردن مدال جزئیات ═══════
  const handleAdPress = useCallback((ad) => {
    setSelectedAd(ad);
    setDetailVisible(true);
  }, []);

  // ═══════ بستن مدال جزئیات ═══════
  const handleCloseDetail = useCallback(() => {
    setDetailVisible(false);
    setSelectedAd(null);
  }, []);

  // ═══════ ذخیره آگهی (ایجاد یا ویرایش) ═══════
  const handleSave = useCallback(
    async (adData) => {
      try {
        if (!USE_MOCK) {
          if (editingAd) {
            await adsService.updateLineRental(editingAd.id, adData);
          } else {
            await adsService.createLineRental(adData);
          }
          // بروزرسانی لیست
          const result = await adsService.getMyLineRentals();
          setAds(result.data || []);
        } else {
          // حالت Mock
          if (editingAd) {
            setAds((prev) => prev.map((a) => (a.id === editingAd.id ? { ...a, ...adData } : a)));
          } else {
            setAds((prev) => [{ ...adData, id: `lr_${Date.now()}` }, ...prev]);
          }
        }
        showToast(
          editingAd ? '✓ آگهی با موفقیت ویرایش شد' : '✓ آگهی لاین با موفقیت ایجاد شد',
          'success'
        );
      } catch (error) {
        console.error('Save failed:', error);
        showToast(error.message || 'خطا در ذخیره آگهی', 'error');
      }
    },
    [editingAd, showToast]
  );

  // ═══════ حذف آگهی ═══════
  const handleDelete = useCallback(
    async (ad) => {
      try {
        if (!USE_MOCK) {
          await adsService.deleteLineRental(ad.id);
          const result = await adsService.getMyLineRentals();
          setAds(result.data || []);
        } else {
          setAds((prev) => prev.filter((a) => a.id !== ad.id));
        }
        showToast('✓ آگهی لاین حذف شد', 'success');
      } catch (error) {
        console.error('Delete failed:', error);
        showToast(error.message || 'خطا در حذف آگهی', 'error');
      }
    },
    [showToast]
  );

  // ═══════ رندر ═══════
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
      <Header title="اجاره لاین" onBackPress={() => router.push('/manage')} />

      <div className="flex-1 overflow-y-auto p-4 pb-32">
        {/* هدر آیکونی */}
        <div className="flex flex-col items-center gap-2 py-4 mb-4">
          <div
            className="w-[72px] h-[72px] rounded-3xl flex items-center justify-center"
            style={{ backgroundColor: '#667eea15' }}
          >
            <FiHome size={32} color="#667eea" />
          </div>
          <h2 className="text-lg font-[Vazir-Bold]" style={{ color: colors.textMain }}>
            مدیریت آگهی‌های اجاره لاین
          </h2>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner label="در حال بارگذاری..." />
          </div>
        ) : (
          <>
            {/* آمار */}
            {ads.length > 0 && (
              <div className="mb-4">
                <LineRentalStats ads={ads} />
              </div>
            )}

            {/* دکمه ایجاد آگهی جدید */}
            <button
              onClick={handleCreate}
              className="w-full flex items-center gap-3 p-3.5 rounded-2xl mb-4 transition-all hover:scale-[1.01] active:scale-[0.99] shadow-lg"
              style={{ backgroundColor: '#43A047' }}
            >
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
              >
                <FiPlus size={22} color="#fff" />
              </div>
              <div className="flex-1 text-right">
                <p className="text-sm font-[Vazir-Bold] text-white">ثبت آگهی لاین جدید</p>
                <p className="text-[11px] text-white/80">لاین خود را به متخصصان اجاره دهید</p>
              </div>
            </button>

            {/* لیست آگهی‌ها */}
            {ads.length > 0 ? (
              ads.map((ad) => (
                <LineRentalAdCard
                  key={ad.id}
                  ad={ad}
                  onPress={handleAdPress}
                  onDelete={handleDelete}
                />
              ))
            ) : (
              <EmptyState
                icon="🏢"
                title="هنوز آگهی لاینی ثبت نکرده‌اید"
                description="با ثبت آگهی لاین، می‌توانید متخصصان جدید جذب کنید"
                actionLabel="ثبت اولین آگهی"
                onAction={handleCreate}
              />
            )}
          </>
        )}
      </div>

      {/* ✅ فرم ایجاد / ویرایش آگهی */}
      <CreateLineRentalAdSheet
        visible={formVisible}
        onClose={handleCloseForm}
        onSave={handleSave}
        editingAd={editingAd}
      />

      {/* ✅ مدال جزئیات آگهی */}
      <LineRentalDetailModal
        visible={detailVisible}
        ad={selectedAd}
        onClose={handleCloseDetail}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </ScreenWrapper>
  );
}
