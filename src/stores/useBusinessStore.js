// src/stores/useBusinessStore.js
/**
 * ✅ FIX 5.2: مدیریت کامل migration و rehydration
 * - بهبود migrate function
 * - اضافه کردن onRehydrateStorage
 * - محافظت در برابر داده‌های خراب
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

/**
 * ✅ FIX 5.2: اعتبارسنجی و ترمیم ساختار businessData
 * اگر فیلدهای ضروری وجود نداشته باشند، با مقادیر پیش‌فرض پر می‌شوند
 */
const sanitizeBusinessData = (data) => {
  if (!data || typeof data !== 'object') {
    return { ...INITIAL_BUSINESS_DATA };
  }

  return {
    ...INITIAL_BUSINESS_DATA,
    ...data,
    // اطمینان از وجود آرایه‌ها
    services: Array.isArray(data.services) ? data.services : [],
    team: Array.isArray(data.team) ? data.team : [],
    portfolios: Array.isArray(data.portfolios) ? data.portfolios : [],
    appointments: Array.isArray(data.appointments) ? data.appointments : [],
    schedules: data.schedules && typeof data.schedules === 'object' ? data.schedules : {},
    // اطمینان از وجود bankInfo
    bankInfo: {
      isRegistered: Boolean(data.bankInfo?.isRegistered ?? false),
      isVerified: Boolean(data.bankInfo?.isVerified ?? false),
    },
    // محافظت در برابر فیلدهای حساس باقی‌مانده از نسخه‌های قدیمی
    nationalId: undefined,
    verifiedName: undefined,
    ownerName: undefined,
  };
};

export const useBusinessStore = create(
  persist(
    (set, get) => ({
      businessData: INITIAL_BUSINESS_DATA,
      gallery: [],
      _version: STORAGE_VERSION,

      businessStatus: null, // 'pending' | 'approved' | 'rejected' | null

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
          businessStatus: null,
        }));
        return true;
      },

      getActiveServices: () => get().businessData.services.filter((s) => s.isActive !== false),

      resetToDefaults: () => {
        set({
          businessData: INITIAL_BUSINESS_DATA,
          gallery: [],
          _version: STORAGE_VERSION,
          businessStatus: null,
        });
      },

      clearForLogout: () => {
        set({
          businessData: INITIAL_BUSINESS_DATA,
          gallery: [],
          _version: STORAGE_VERSION,
          businessStatus: null,
        });
        try {
          useBusinessStore.persist.clearStorage();
        } catch {
          // silently ignore
        }
      },

      fetchBusinessDetail: async () => {
        try {
          const response = await businessesService.getBusinessDetail();
          const b = response.data;
          set((state) => ({
            businessData: {
              ...state.businessData,
              id: b.id,
              name: b.name || '',
              category: b.categoryName || b.category?.name || '',
              categoryId: b.categoryId || b.category?.id || null,
              address: b.address || '',
              city: b.cityName || b.city?.name || '',
              cityId: b.cityId || b.city?.id || null,
              provinceId: b.provinceId || b.province?.id || null,
              phone: b.phone || '',
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
              isNationalIdVerified: Boolean(b.isNationalIdVerified),
              bookingSlug: b.bookingSlug || '',
              latitude: b.latitude || null,
              longitude: b.longitude || null,
              isActive: b.status === 'approved',
              status: b.status || null,
              isSuspended: b.isSuspended ?? false,
              suspensionReason: b.suspensionReason ?? '',
              services: (b.services || []).map((s) => ({
                id: s.id,
                name: s.name,
                typeId: s.subService?.typeId || s.typeId || '',
                typeName: s.subService?.name || s.typeName || '',
                originalPrice: s.originalPrice ?? 0,
                discountPercent: s.discountPercent ?? 0,
                finalPrice: s.finalPrice ?? s.originalPrice ?? 0,
                duration: s.duration || 60,
                hasDeposit: s.hasDeposit ?? false,
                depositAmount: s.depositAmount || 0,
                renewalDays: s.renewalDays || 0,
                isActive: s.isActive !== false,
                description: s.description || '',
              })),
              team: b.team || [],
              bankInfo: {
                isRegistered: Boolean(b.bankInfoRegistered ?? b.is_registered),
                isVerified: Boolean(b.bankInfoVerified ?? b.is_verified),
                bankName: b.bankName || b.bank_name || '',
                bankId: b.bankId || b.bank_id || '',
                sheba: b.bankSheba || b.sheba || '',
                cardNumber: b.bankCardNumber || b.cardNumber || '',
                ownerName: b.bankOwnerName || b.ownerName || b.owner_name || '',
                accountNumber: b.bankAccountNumber || b.accountNumber || b.account_number || '',
                nationalId: b.bankNationalId || b.nationalId || b.national_id || '',
              },
            },
            gallery: b.gallery || [],
            businessStatus: b.status || state.businessStatus,
          }));
          return response.data;
        } catch (error) {
          const isNoBusiness =
            error?.code === 'NOT_FOUND' ||
            error?.status === 404 ||
            (typeof error?.message === 'string' &&
              error.message.includes('کسب‌وکاری ثبت نکرده‌اید'));
          if (isNoBusiness) {
            set({
              businessData: INITIAL_BUSINESS_DATA,
              gallery: [],
              businessStatus: null,
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
          const data = response.data;

          if (data?.hasBusiness) {
            set((state) => ({
              businessStatus: data.status || 'pending',
              businessData: {
                ...state.businessData,
                isSuspended: data.isSuspended ?? false,
                suspensionReason: data.suspensionReason ?? '',
              },
            }));
          }
          return data;
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
              category: b.categoryName || b.category?.name || '',
              address: b.address || '',
              bookingSlug: b.bookingSlug || '',
              isActive: b.status === 'approved',
              status: b.status || 'pending',
              ownerName: b.ownerName || '',
              verifiedName: b.verifiedName || '',
              nationalId: b.nationalId || '',
              isNationalIdVerified: Boolean(b.isNationalIdVerified),
              phone: b.phone || '',
              latitude: b.latitude || null,
              longitude: b.longitude || null,
            },
            businessStatus: b.status || 'pending',
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
                isRegistered: Boolean(data.bankInfoRegistered ?? data.is_registered ?? true),
                isVerified: Boolean(data.bankInfoVerified ?? data.is_verified),
                bankName: data.bankName || data.bank_name || '',
                bankId: data.bankId || data.bank_id || '',
                sheba: data.bankSheba || data.sheba || '',
                cardNumber: data.bankCardNumber || data.cardNumber || '',
                ownerName: data.bankOwnerName || data.ownerName || data.owner_name || '',
                accountNumber:
                  data.bankAccountNumber || data.accountNumber || data.account_number || '',
                nationalId: data.bankNationalId || data.nationalId || data.national_id || '',
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
            owner_name: bankData.owner_name || bankData.ownerName || '',
            national_id: bankData.national_id || bankData.nationalId || '',
            bankName: bankData.bank_name || bankData.bankName || '',
            bank_id: bankData.bank_id || bankData.bankId || '',
            sheba: bankData.sheba || '',
            card_number: bankData.card_number || bankData.cardNumber || '',
            account_number: bankData.account_number || bankData.accountNumber || '',
          });

          set((state) => ({
            businessData: {
              ...state.businessData,
              bankInfo: {
                isRegistered: true,
                isVerified: false,
                bankName: bankData.bank_name || bankData.bankName || '',
                bankId: bankData.bank_id || bankData.bankId || '',
                sheba: bankData.sheba || '',
                cardNumber: bankData.card_number || bankData.cardNumber || '',
                ownerName: bankData.owner_name || bankData.ownerName || '',
                accountNumber: bankData.account_number || bankData.accountNumber || '',
                nationalId: bankData.national_id || bankData.nationalId || '',
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
            businessStatus: null,
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
      // ═══════════════════════════════════════════════════════════════
      // ✅ FIX امنیت: حذف فیلدهای حساس از localStorage
      // ═══════════════════════════════════════════════════════════════
      partialize: (state) => ({
        businessData: {
          ...state.businessData,
          // ❌ حذف فیلدهای حساس از persist
          nationalId: undefined,
          verifiedName: undefined,
          ownerName: undefined,
          bankInfo: {
            // ✅ فقط وضعیت، نه اطلاعات واقعی بانکی
            isRegistered: state.businessData?.bankInfo?.isRegistered ?? false,
            isVerified: state.businessData?.bankInfo?.isVerified ?? false,
            // ❌ حذف: bankName, bankId, sheba, cardNumber, ownerName, accountNumber, nationalId
          },
        },
        gallery: state.gallery,
        businessStatus: state.businessStatus,
        _version: STORAGE_VERSION,
      }),

      // ═══════════════════════════════════════════════════════════════
      // ✅ FIX 5.2: Migration بهبودیافته
      // ═══════════════════════════════════════════════════════════════
      migrate: (persistedState, version) => {
        // ─── حالت ۱: داده‌ای وجود ندارد ───
        if (!persistedState) {
          return {
            businessData: INITIAL_BUSINESS_DATA,
            gallery: [],
            businessStatus: null,
            _version: STORAGE_VERSION,
          };
        }

        // ─── حالت ۲: نسخه قدیمی‌تر از نسخه فعلی ───
        if (version < STORAGE_VERSION) {
          console.warn(
            `[useBusinessStore] Migrating from v${version} to v${STORAGE_VERSION}. Resetting data.`
          );
          return {
            businessData: INITIAL_BUSINESS_DATA,
            gallery: [],
            businessStatus: null,
            _version: STORAGE_VERSION,
          };
        }

        // ─── حالت ۳: نسخه مطابقت دارد — اعتبارسنجی ساختار ───
        return {
          ...persistedState,
          businessData: sanitizeBusinessData(persistedState.businessData),
          gallery: Array.isArray(persistedState.gallery) ? persistedState.gallery : [],
          businessStatus: persistedState.businessStatus || null,
          _version: STORAGE_VERSION,
        };
      },

      // ═══════════════════════════════════════════════════════════════
      // ✅ FIX 5.2: اعتبارسنجی و ترمیم هنگام rehydration
      // ═══════════════════════════════════════════════════════════════
      onRehydrateStorage: () => {
        return (state, error) => {
          if (error) {
            console.error('[useBusinessStore] Rehydration error:', error);
            // در صورت خطای rehydration، استور را ریست کن
            try {
              useBusinessStore.persist.clearStorage();
            } catch {
              // silently ignore
            }
            return;
          }

          if (!state) return;

          // ─── اعتبارسنجی ساختار داده‌ها ───
          try {
            // بررسی businessData
            if (!state.businessData || typeof state.businessData !== 'object') {
              console.warn('[useBusinessStore] Invalid businessData detected, resetting.');
              state.businessData = { ...INITIAL_BUSINESS_DATA };
            } else {
              // ترمیم آرایه‌ها
              if (!Array.isArray(state.businessData.services)) {
                state.businessData.services = [];
              }
              if (!Array.isArray(state.businessData.team)) {
                state.businessData.team = [];
              }
              if (!Array.isArray(state.businessData.portfolios)) {
                state.businessData.portfolios = [];
              }
              if (!Array.isArray(state.businessData.appointments)) {
                state.businessData.appointments = [];
              }
              // ترمیم schedules
              if (!state.businessData.schedules || typeof state.businessData.schedules !== 'object') {
                state.businessData.schedules = {};
              }
              // ترمیم bankInfo
              if (!state.businessData.bankInfo || typeof state.businessData.bankInfo !== 'object') {
                state.businessData.bankInfo = {
                  isRegistered: false,
                  isVerified: false,
                };
              }
            }

            // بررسی gallery
            if (!Array.isArray(state.gallery)) {
              state.gallery = [];
            }

            // بررسی businessStatus
            const validStatuses = ['pending', 'approved', 'rejected', null];
            if (!validStatuses.includes(state.businessStatus)) {
              state.businessStatus = null;
            }
          } catch (sanitizeError) {
            console.error('[useBusinessStore] Sanitization failed, full reset:', sanitizeError);
            state.businessData = { ...INITIAL_BUSINESS_DATA };
            state.gallery = [];
            state.businessStatus = null;
          }
        };
      },
    }
  )
);

// ─── Selectors ───
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

export const useHasAnyBusiness = () =>
  useBusinessStore((s) => Boolean(s.businessData?.id) || Boolean(s.businessStatus));

export const useBusinessHasData = () =>
  useBusinessStore((s) => Boolean(s.businessData?.id && s.businessData?.name));