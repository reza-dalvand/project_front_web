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

export default function LineRentalPage() {
  const { colors } = useTheme();
  const router = useRouter();
  const { isAuthenticated } = useRequireAuth({ redirectToLogin: true });
  const { showToast } = useToast();

  const [ads, setAds] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [formVisible, setFormVisible] = useState(false);
  const [editingAd, setEditingAd] = useState(null);
  const [detailVisible, setDetailVisible] = useState(false);
  const [selectedAd, setSelectedAd] = useState(null);

  useEffect(() => {
    const fetchMyAds = async () => {
      setIsLoading(true);
      try {
        const result = await adsService.getMyLineRentals();
        setAds(result.data || []);
      } catch (error) {
        console.error('Failed to fetch my line rentals:', error);
        showToast('خطا در بارگذاری آگهی‌ها', 'error');
      } finally {
        setIsLoading(false);
      }
    };
    fetchMyAds();
  }, [showToast]);

  const handleCreate = useCallback(() => {
    setEditingAd(null);
    setFormVisible(true);
  }, []);

  const handleEdit = useCallback((ad) => {
    setEditingAd(ad);
    setFormVisible(true);
  }, []);

  const handleCloseForm = useCallback(() => {
    setFormVisible(false);
    setEditingAd(null);
  }, []);

  const handleAdPress = useCallback((ad) => {
    setSelectedAd(ad);
    setDetailVisible(true);
  }, []);

  const handleCloseDetail = useCallback(() => {
    setDetailVisible(false);
    setSelectedAd(null);
  }, []);

  const handleSave = useCallback(
    async (adData) => {
      try {
        // 🔄 نگاشت کلیدهای camelCase فرم به snake_case مورد انتظار بک‌اند
        const payload = {
          title: adData.title,
          description: adData.description,
          service_category: adData.categoryId,
          sub_service: adData.subServiceId,
          collab_type: adData.collabType,
          contact_phone: adData.contactPhone,
        };

        // افزودن فیلدهای مالی بر اساس نوع همکاری
        if (adData.collabType === 'percent') {
          payload.percent_salon = adData.percentSalon;
          payload.percent_partner = adData.percentPartner;
        } else if (adData.collabType === 'fixed') {
          payload.fixed_amount = adData.fixedAmount;
          if (adData.fixedDeposit) payload.fixed_deposit = adData.fixedDeposit;
        } else if (adData.collabType === 'hourly') {
          payload.hourly_rate = adData.hourlyRate;
        }

        if (editingAd) {
          await adsService.updateLineRental(editingAd.id, payload);
        } else {
          await adsService.createLineRental(payload);
        }

        const result = await adsService.getMyLineRentals();
        setAds(result.data || []);
        showToast(
          editingAd ? '✓ آگهی با موفقیت ویرایش شد' : '✓ آگهی لاین با موفقیت ایجاد شد',
          'success'
        );
      } catch (error) {
        console.error('Save failed:', error);

        // ✅ بهبود نمایش خطا: استخراج پیام دقیق خطای اعتبارسنجی بک‌اند
        let errorMsg = error.message || 'خطا در ذخیره آگهی';
        if (error.details && typeof error.details === 'object') {
          const detailsMsg = Object.values(error.details).flat().join(' | ');
          if (detailsMsg) errorMsg = detailsMsg;
        }
        showToast(errorMsg, 'error');
      }
    },
    [editingAd, showToast]
  );

  // ✅ حذف USE_MOCK — فقط API
  const handleDelete = useCallback(
    async (ad) => {
      try {
        await adsService.deleteLineRental(ad.id);
        const result = await adsService.getMyLineRentals();
        setAds(result.data || []);
        showToast('✓ آگهی لاین حذف شد', 'success');
      } catch (error) {
        console.error('Delete failed:', error);
        showToast(error.message || 'خطا در حذف آگهی', 'error');
      }
    },
    [showToast]
  );

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
            {ads.length > 0 && (
              <div className="mb-4">
                <LineRentalStats ads={ads} />
              </div>
            )}

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

      <CreateLineRentalAdSheet
        visible={formVisible}
        onClose={handleCloseForm}
        onSave={handleSave}
        editingAd={editingAd}
      />

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
