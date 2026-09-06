// src/stores/useBusinessStore.js
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { businessesService } from '@/api';
import { INITIAL_BUSINESS_DATA, STORAGE_VERSION } from './business/initialData';
import { createServicesSlice } from './business/slices/servicesSlice';
import { createAppointmentsSlice } from './business/slices/appointmentsSlice';
import { createTeamSlice } from './business/slices/teamSlice';
import { createPortfoliosSlice } from './business/slices/portfoliosSlice';
import { createSchedulesSlice } from './business/slices/schedulesSlice';

// ❌ حذف شد: let migrationOccurred = false;

export const useBusinessStore = create(
  persist(
    (set, get) => ({
      businessData: INITIAL_BUSINESS_DATA,
      gallery: [],
      _version: STORAGE_VERSION,

      ...createServicesSlice(set, get),
      ...createAppointmentsSlice(set),
      ...createTeamSlice(set),
      ...createPortfoliosSlice(set),
      ...createSchedulesSlice(set, get),

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

      getActiveServices: () => get().businessData.services.filter((s) => s.isActive !== false),

      resetToDefaults: () => {
        set({
          businessData: INITIAL_BUSINESS_DATA,
          gallery: [],
          _version: STORAGE_VERSION,
        });
      },

      /**
       * ✅ جدید: پاک کردن کامل برای خروج از حساب
       * در logout صدا زده می‌شود تا داده‌های کاربر قبلی پاک شوند
       */
      clearForLogout: () => {
        set({
          businessData: INITIAL_BUSINESS_DATA,
          gallery: [],
          _version: STORAGE_VERSION,
        });
      },

      fetchBusinessDetail: async () => {
        try {
          const response = await businessesService.getBusinessDetail();
          const b = response.data;

          set((state) => ({
            // ... (همان مپینگ‌های قبلی بدون تغییر)
            businessData: {
              ...state.businessData,
              id: b.id,
              // ...
            },
            gallery: b.gallery || [],
          }));
          return response.data;
        } catch (error) {
          // ✅ FIX: اگر کاربر هنوز کسب‌وکاری ثبت نکرده (404)، این یک خطای واقعی نیست.
          const isNoBusiness =
            error?.code === 'NOT_FOUND' ||
            error?.status === 404 ||
            error?.response?.status === 404 ||
            (typeof error?.message === 'string' &&
              error.message.includes('کسب‌وکاری ثبت نکرده‌اید'));

          if (isNoBusiness) {
            // کاربر تازه وارد شده و هنوز بیزینسی نساخته است.
            // استیت را به حالت اولیه ریست می‌کنیم و بدون ارور خارج می‌شویم.
            set({
              businessData: INITIAL_BUSINESS_DATA,
              gallery: [],
            });
            return null;
          }

          console.error('fetchBusinessDetail failed:', error);
          throw error;
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
          const data = response.data;

          set((state) => ({
            businessData: {
              ...state.businessData,
              bankInfo: {
                isRegistered: true,
                isVerified: data.isVerified ?? data.is_verified ?? false,
                bankName: data.bankName || data.bank_name || '',
                bankId: data.bankId || data.bank_id || '',
                sheba: data.sheba || '',
                cardNumber: data.cardNumber || data.card_number || '',
                ownerName: data.ownerName || data.owner_name || '',
                accountNumber: data.accountNumber || data.account_number || '',
                nationalId: data.nationalId || data.national_id || '',
              },
            },
          }));

          return data;
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
              bankInfo: {
                isRegistered: true,
                isVerified: false,
                bankName: bankData.bankName || '',
                bankId: bankData.bankId || '',
                sheba: bankData.sheba || '',
                cardNumber: bankData.cardNumber || '',
                ownerName: bankData.ownerName || '',
                accountNumber: bankData.accountNumber || '',
                nationalId: bankData.nationalId || '',
              },
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
      migrate: (persistedState, version) => {
        if (version < STORAGE_VERSION) {
          console.log(
            `[BusinessStore] Migration from v${version} to v${STORAGE_VERSION}. Clearing stale data.`
          );
          // ✅ FIX: مستقیماً استور خالی برگردانده شود
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
