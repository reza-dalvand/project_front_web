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

      getActiveServices: () =>
        get().businessData.services.filter((s) => s.isActive !== false),

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
                isRegistered: Boolean(b.bankInfoRegistered),
                isVerified: Boolean(b.bankInfoVerified),
                bankName: b.bankName || '',
                bankId: b.bankId || '',
                sheba: b.bankSheba || '',
                cardNumber: b.bankCardNumber || '',
                ownerName: b.bankOwnerName || '',
                accountNumber: b.bankAccountNumber || '',
                nationalId: b.bankNationalId || '',
              },
            },
            gallery: b.gallery || [],
            // ✅ FIX: وضعیت بیزینس هم آپدیت شود
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
          // ✅ FIX: اگر خطا غیر از "بیزینس ندارید" بود، استور را ریست نکن
          // فقط ارور را لاگ کن تا داده‌های قبلی حفظ شوند
          console.error('fetchBusinessDetail failed:', error);
          throw error;
        }
      },

      fetchBusinessStatus: async () => {
        try {
          const response = await businessesService.getBusinessStatus();
          const data = response.data;
          // ✅ FIX: اگر بیزینس وجود دارد، status را در استور ذخیره کن
          if (data?.hasBusiness) {
            set({ businessStatus: data.status || 'pending' });
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
            // ✅ FIX: وضعیت بیزینس بلافاصله ست شود
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
                isRegistered: Boolean(data.bankInfoRegistered ?? true),
                isVerified: Boolean(data.bankInfoVerified),    
                bankName: data.bankName || '',
                bankId: data.bankId || '',
                sheba: data.sheba || '',
                cardNumber: data.cardNumber || '',
                ownerName: data.ownerName || '',
                accountNumber: data.accountNumber || '',
                nationalId: data.bankNationalId || '',   
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
      // ✅ FIX: businessStatus هم persist شود
      partialize: (state) => ({
        businessData: state.businessData,
        gallery: state.gallery,
        businessStatus: state.businessStatus,
        _version: STORAGE_VERSION,
      }),
      migrate: (persistedState, version) => {
        if (version < STORAGE_VERSION) {
          return {
            businessData: INITIAL_BUSINESS_DATA,
            gallery: [],
            businessStatus: null,
            _version: STORAGE_VERSION,
          };
        }
        return persistedState;
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