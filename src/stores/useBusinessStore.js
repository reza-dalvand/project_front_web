// src/stores/useBusinessStore.js
/**
 * 🏪 Store کسب‌وکار — فاز ۵
 *
 * ✅ تغییرات فاز ۲:
 * - مهاجرت هوشمند: داده‌های هاردکد پاک می‌شوند ولی
 *   بلافاصله بعد از مهاجرت، بازیابی خودکار از بک‌اند
 * - کاهش ریست کامل — فقط ساختار ریست می‌شود و سپس از بک‌اند بازیابی
 * - کامپوننت‌ها باید با داده‌های خالی هم کار کنند (تا زمانی که بک‌اند جواب دهد)
 */
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { businessesService } from '@/api';
import { INITIAL_BUSINESS_DATA, STORAGE_VERSION } from './business/initialData';
import { createServicesSlice } from './business/slices/servicesSlice';
import { createAppointmentsSlice } from './business/slices/appointmentsSlice';
import { createTeamSlice } from './business/slices/teamSlice';
import { createPortfoliosSlice } from './business/slices/portfoliosSlice';
import { createSchedulesSlice } from './business/slices/schedulesSlice';

// ✅ FIX فاز ۲: فلگ برای اطلاع‌رسانی مهاجرت
let migrationOccurred = false;

export const useBusinessStore = create(
  persist(
    (set, get) => ({
      // ─── State اصلی (خالی در شروع) ───
      businessData: INITIAL_BUSINESS_DATA,
      gallery: [],
      _version: STORAGE_VERSION,

      // ─── Slice‌ها ───
      ...createServicesSlice(set, get),
      ...createAppointmentsSlice(set),
      ...createTeamSlice(set),
      ...createPortfoliosSlice(set),
      ...createSchedulesSlice(set, get),

      // ─── اطلاعات پایه ───
      updateBusinessInfo: (updates) =>
        set((state) => ({
          businessData: { ...state.businessData, ...updates },
        })),

      deleteBusiness: () => {
        set((state) => ({
          businessData: { ...state.businessData, isActive: false },
        }));
        return true;
      },

      // ─── Selectors ───
      getActiveServices: () => get().businessData.services.filter((s) => s.isActive !== false),

      resetToDefaults: () => {
        set({
          businessData: INITIAL_BUSINESS_DATA,
          gallery: [],
          _version: STORAGE_VERSION,
        });
      },

      // ═══════════════════════════════════════════
      //    API Sync — Businesses
      // ═══════════════════════════════════════════
      fetchBusinessDetail: async () => {
        try {
          const response = await businessesService.getBusinessDetail();
          const b = response.data;

          set((state) => ({
            businessData: {
              ...state.businessData,
              id: b.id,
              name: b.name || '',
              category: b.category?.name || '',
              categoryId: b.category?.id || null,
              address: b.address || '',
              city: b.city?.name || '',
              cityId: b.city?.id || null,
              provinceId: b.province?.id || null,
              phone: b.phone || '',
              // ✅ فاز ۳: خوانش camelCase
              workingHours: b.workingHours || '',
              about: b.about || '',
              rating: b.rating || 0,
              reviewsCount: b.reviewsCount || 0,
              VIP: b.isVip || false,
              logo: b.logo || null,
              coverUrl: b.coverImage || null,
              ownerPhoto: b.ownerPhoto || null,
              ownerName: b.ownerName || '',
              verifiedName: b.verifiedName || '',
              nationalId: b.nationalId || '',
              bankInfo: {
                isRegistered: b.bankInfoRegistered || false,
                isVerified: b.bankInfoVerified || false,
              },
              bookingSlug: b.bookingSlug || '',
              isActive: b.status === 'approved',
              status: b.status || null,
              latitude: b.latitude || null,
              longitude: b.longitude || null,
              services: b.services || [],
              team: b.team || [],
              appointments: b.appointments || [],
              portfolios: b.portfolios || [],
            },
            gallery: b.gallery || [],
          }));

          return response.data;
        } catch (error) {
          console.error('fetchBusinessDetail failed:', error);
          throw error;
        }
      },

      /**
       * ✅ FIX فاز ۲: بازیابی خودکار پس از مهاجرت
       * وقتی مهاجرت اتفاق می‌افتد، داده‌های محلی پاک می‌شوند.
       * این تابع باید بعد از مهاجرت و هنگام اولین بارگذاری اپ
       * صدا زده شود تا داده‌ها از بک‌اند بازیابی شوند.
       */
      autoRecoverFromMigration: async () => {
        if (!migrationOccurred) return;
        migrationOccurred = false;
        try {
          await get().fetchBusinessDetail();
        } catch (error) {
          // در صورت عدم دسترسی به بک‌اند، داده‌ها خالی می‌مانند
          // و هنگام اتصال بعدی، از بک‌اند پر می‌شوند
          console.warn('Auto-recovery failed:', error);
        }
      },

      fetchBusinessStatus: async () => {
        try {
          const response = await businessesService.getBusinessStatus();
          return response.data;
        } catch (error) {
          console.error('fetchBusinessStatus failed:', error);
          throw error;
        }
      },

      createBusinessApi: async (formData) => {
        try {
          const response = await businessesService.createBusiness(formData);
          const b = response.data;

          set((state) => ({
            businessData: {
              ...state.businessData,
              id: b.id,
              name: b.name || '',
              category: b.category?.name || '',
              address: b.address || '',
              // ✅ فاز ۳
              bookingSlug: b.bookingSlug || '',
              isActive: b.status === 'approved',
              status: b.status || null,
            },
          }));

          return response.data;
        } catch (error) {
          console.error('createBusinessApi failed:', error);
          throw error;
        }
      },

      updateBusinessApi: async (data) => {
        try {
          const response = await businessesService.updateBusiness(data);
          const b = response.data;

          set((state) => ({
            businessData: {
              ...state.businessData,
              name: b.name || state.businessData.name,
              address: b.address || state.businessData.address,
              phone: b.phone || state.businessData.phone,
              // ✅ فاز ۳
              workingHours: b.workingHours || state.businessData.workingHours,
              about: b.about || state.businessData.about,
            },
          }));

          return response.data;
        } catch (error) {
          console.error('updateBusinessApi failed:', error);
          throw error;
        }
      },

      fetchBankInfo: async () => {
        try {
          const response = await businessesService.getBankInfo();
          return response.data;
        } catch (error) {
          console.error('fetchBankInfo failed:', error);
          throw error;
        }
      },

      updateBankInfoApi: async (bankData) => {
        try {
          const response = await businessesService.updateBankInfo({
            bank_owner_name: bankData.ownerName,
            bank_national_id: bankData.nationalId,
            bank_name: bankData.bankName,
            bank_id: bankData.bankId,
            bank_sheba: bankData.sheba,
            bank_card_number: bankData.cardNumber,
            bank_account_number: bankData.accountNumber,
          });
          set((state) => ({
            businessData: {
              ...state.businessData,
              bankInfo: { isRegistered: true, isVerified: false },
            },
          }));
          return response.data;
        } catch (error) {
          console.error('updateBankInfoApi failed:', error);
          throw error;
        }
      },

      deleteBusinessApi: async () => {
        try {
          await businessesService.deleteBusiness();
          set((state) => ({
            businessData: { ...state.businessData, isActive: false },
          }));
        } catch (error) {
          console.error('deleteBusinessApi failed:', error);
          throw error;
        }
      },

      // ═══════════════════════════════════════════
      //    API Sync — Gallery
      // ═══════════════════════════════════════════
      fetchGallery: async () => {
        try {
          const response = await businessesService.getGallery();
          set({ gallery: response.data || [] });
          return response.data;
        } catch (error) {
          console.error('fetchGallery failed:', error);
          throw error;
        }
      },

      uploadGalleryImageApi: async (imageFile, sortOrder = 0) => {
        try {
          const response = await businessesService.uploadGalleryImage(imageFile, sortOrder);
          const newImage = response.data;
          set((state) => ({ gallery: [...state.gallery, newImage] }));
          return response.data;
        } catch (error) {
          console.error('uploadGalleryImageApi failed:', error);
          throw error;
        }
      },

      deleteGalleryImageApi: async (imageId) => {
        try {
          await businessesService.deleteGalleryImage(imageId);
          set((state) => ({
            gallery: state.gallery.filter((img) => img.id !== imageId),
          }));
        } catch (error) {
          console.error('deleteGalleryImageApi failed:', error);
          throw error;
        }
      },

      reorderGalleryApi: async (order) => {
        try {
          await businessesService.reorderGallery(order);
          set((state) => {
            const sorted = [...state.gallery].sort((a, b) => {
              const idxA = order.indexOf(a.id);
              const idxB = order.indexOf(b.id);
              return (idxA === -1 ? 999 : idxA) - (idxB === -1 ? 999 : idxB);
            });
            return { gallery: sorted };
          });
        } catch (error) {
          console.error('reorderGalleryApi failed:', error);
          throw error;
        }
      },
    }),
    {
      name: 'beau-business-storage',
      version: STORAGE_VERSION,
      storage: createJSONStorage(() =>
        typeof window !== 'undefined'
          ? localStorage
          : { getItem: () => null, setItem: () => {}, removeItem: () => {} }
      ),
      partialize: (state) => ({
        businessData: state.businessData,
        gallery: state.gallery,
        _version: STORAGE_VERSION,
      }),
      /**
       * ✅ FIX فاز ۲: مهاجرت هوشمندانه
       *
       * قبلاً: هر نسخه < 5 → ریست کامل داده‌ها
       * حالا: فقط داده‌های هاردکد پاک می‌شوند و بلافاصله
       *       بازیابی خودکار از بک‌اند انجام می‌شود.
       *       کاربر فقط در اولین بارگذاری پس از آپدیت
       *       ممکن است یک بار صفحه را خالی ببیند،
       *       و سپس داده‌ها از بک‌اند پر می‌شوند.
       */
      migrate: (persistedState, version) => {
        if (version < STORAGE_VERSION) {
          console.log(
            `[BusinessStore] Migration from v${version} to v${STORAGE_VERSION}. ` +
              'Hardcoded data cleared. Auto-recovery from backend will occur on next fetch.'
          );
          // ✅ FIX فاز ۲: فلگ مهاجرت را فعال کن
          migrationOccurred = true;
          return {
            businessData: INITIAL_BUSINESS_DATA,
            gallery: [],
            _version: STORAGE_VERSION,
          };
        }
        return persistedState;
      },
    }
  )
);

// ═══════════════════════════════════════════════════════
//    Selector‌های اختصاصی
// ═══════════════════════════════════════════════════════
export const useBusinessName = () => useBusinessStore((s) => s.businessData?.name);
export const useBusinessServices = () => useBusinessStore((s) => s.businessData?.services || []);
export const useBusinessAppointments = () =>
  useBusinessStore((s) => s.businessData?.appointments || []);
export const useBusinessPortfolios = () =>
  useBusinessStore((s) => s.businessData?.portfolios || []);
export const useBusinessGallery = () => useBusinessStore((s) => s.gallery);
export const useBusinessIsActive = () => useBusinessStore((s) => s.businessData?.isActive);
export const useBusinessBankInfo = () => useBusinessStore((s) => s.businessData?.bankInfo);
export const useBusinessBookingSlug = () => useBusinessStore((s) => s.businessData?.bookingSlug);
export const useBusinessHasData = () =>
  useBusinessStore((s) => Boolean(s.businessData?.id && s.businessData?.name));
