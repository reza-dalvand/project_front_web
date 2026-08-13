// src/stores/useBusinessStore.js
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { businessesService, servicesService, schedulesService } from '@/api';
import { INITIAL_BUSINESS_DATA, STORAGE_VERSION } from './business/initialData';
import { createServicesSlice } from './business/slices/servicesSlice';
import { createAppointmentsSlice } from './business/slices/appointmentsSlice';
import { createTeamSlice } from './business/slices/teamSlice';
import { createPortfoliosSlice } from './business/slices/portfoliosSlice';
import { createSchedulesSlice } from './business/slices/schedulesSlice';

export const useBusinessStore = create(
  persist(
    (set, get) => ({
      // ─── State اصلی ───
      businessData: INITIAL_BUSINESS_DATA,
      gallery: [], // 🆕 تصاویر گالری
      _version: STORAGE_VERSION,

      // ─── Slice‌ها ───
      ...createServicesSlice(set),
      ...createAppointmentsSlice(set),
      ...createTeamSlice(set),
      ...createPortfoliosSlice(set),
      ...createSchedulesSlice(set),

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
        set({ businessData: INITIAL_BUSINESS_DATA, gallery: [], _version: STORAGE_VERSION });
      },

      // ═══════════════════════════════════════════
      //    🆕 API Sync — Businesses
      // ═══════════════════════════════════════════

      /**
       * دریافت جزئیات کسب‌وکار از API و sync با store
       */
      fetchBusinessDetail: async () => {
        try {
          const response = await businessesService.getBusinessDetail();
          const b = response.data;
          set((state) => ({
            businessData: {
              ...state.businessData,
              id: b.id,
              name: b.name,
              category: b.category?.name || '',
              categoryId: b.category?.id || '',
              address: b.address,
              city: b.city?.name || '',
              cityId: b.city?.id || '',
              provinceId: b.province?.id || '',
              phone: b.phone,
              workingHours: b.working_hours,
              about: b.about,
              rating: b.rating,
              reviewsCount: b.reviews_count,
              VIP: b.is_vip,
              logo: b.logo,
              coverUrl: b.cover_image,
              ownerPhoto: b.owner_photo,
              ownerName: b.owner_name,
              verifiedName: b.verified_name,
              bankInfo: {
                isRegistered: b.bank_info_registered,
                isVerified: b.bank_info_verified,
              },
              bookingSlug: b.booking_slug,
              isActive: b.status === 'approved',
              latitude: b.latitude,
              longitude: b.longitude,
              gallery: b.gallery || [],
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
       * دریافت وضعیت کسب‌وکار
       */
      fetchBusinessStatus: async () => {
        try {
          const response = await businessesService.getBusinessStatus();
          return response.data;
        } catch (error) {
          console.error('fetchBusinessStatus failed:', error);
          throw error;
        }
      },

      /**
       * ثبت کسب‌وکار جدید در API
       * @param {FormData} formData
       */
      createBusinessApi: async (formData) => {
        try {
          const response = await businessesService.createBusiness(formData);
          const b = response.data;
          set((state) => ({
            businessData: {
              ...state.businessData,
              id: b.id,
              name: b.name,
              category: b.category?.name || '',
              address: b.address,
              bookingSlug: b.booking_slug,
              isActive: b.status === 'approved',
            },
          }));
          return response.data;
        } catch (error) {
          console.error('createBusinessApi failed:', error);
          throw error;
        }
      },

      /**
       * بروزرسانی کسب‌وکار در API
       */
      updateBusinessApi: async (data) => {
        try {
          const response = await businessesService.updateBusiness(data);
          const b = response.data;
          set((state) => ({
            businessData: {
              ...state.businessData,
              name: b.name,
              address: b.address,
              phone: b.phone,
              workingHours: b.working_hours,
              about: b.about,
            },
          }));
          return response.data;
        } catch (error) {
          console.error('updateBusinessApi failed:', error);
          throw error;
        }
      },

      /**
       * دریافت اطلاعات بانکی از API
       */
      fetchBankInfo: async () => {
        try {
          const response = await businessesService.getBankInfo();
          return response.data;
        } catch (error) {
          console.error('fetchBankInfo failed:', error);
          throw error;
        }
      },

      /**
       * بروزرسانی اطلاعات بانکی در API
       */
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

      /**
       * حذف کسب‌وکار در API
       */
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
      //    🆕 API Sync — Gallery
      // ═══════════════════════════════════════════

      /**
       * دریافت گالری از API
       */
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

      /**
       * آپلود تصویر گالری در API
       */
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

      /**
       * حذف تصویر گالری در API
       */
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

      /**
       * تغییر ترتیب گالری در API
       */
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

      // ═══════════════════════════════════════════
      //    🆕 API Sync — Services (از فاز ۲)
      // ═══════════════════════════════════════════

      fetchServices: async () => {
        try {
          const response = await servicesService.getServices();
          const services = (response.data || []).map((s) => ({
            id: s.id,
            name: s.name,
            typeId: s.sub_service?.type_id || '',
            typeName: s.sub_service?.name || '',
            originalPrice: s.original_price,
            discountPercent: s.discount_percent,
            finalPrice: s.final_price,
            duration: s.duration,
            hasDeposit: s.has_deposit,
            depositAmount: s.deposit_amount,
            isActive: s.is_active,
          }));
          set((state) => ({
            businessData: { ...state.businessData, services },
          }));
          return services;
        } catch (error) {
          console.error('fetchServices failed:', error);
          throw error;
        }
      },

      createService: async (serviceData) => {
        try {
          const response = await servicesService.createService({
            name: serviceData.name,
            category: serviceData.categoryId,
            sub_service: serviceData.typeId,
            description: serviceData.description || '',
            original_price: serviceData.originalPrice,
            discount_percent: serviceData.discountPercent,
            has_deposit: serviceData.hasDeposit,
            deposit_amount: serviceData.depositAmount,
            duration: serviceData.duration,
            is_active: true,
          });
          get().addService({ ...serviceData, id: response.data.id });
          return response.data;
        } catch (error) {
          console.error('createService failed:', error);
          throw error;
        }
      },

      updateServiceApi: async (serviceId, serviceData) => {
        try {
          const response = await servicesService.updateService(serviceId, {
            name: serviceData.name,
            original_price: serviceData.originalPrice,
            discount_percent: serviceData.discountPercent,
            has_deposit: serviceData.hasDeposit,
            deposit_amount: serviceData.depositAmount,
            duration: serviceData.duration,
            description: serviceData.description,
          });
          get().updateService(serviceId, serviceData);
          return response.data;
        } catch (error) {
          console.error('updateServiceApi failed:', error);
          throw error;
        }
      },

      deleteServiceApi: async (serviceId) => {
        try {
          await servicesService.deleteService(serviceId);
          get().deleteService(serviceId);
        } catch (error) {
          console.error('deleteServiceApi failed:', error);
          throw error;
        }
      },

      toggleServiceActiveApi: async (serviceId) => {
        try {
          await servicesService.toggleServiceActive(serviceId);
          get().toggleServiceActive(serviceId);
        } catch (error) {
          console.error('toggleServiceActiveApi failed:', error);
          throw error;
        }
      },
    }),
    {
      name: 'zibano-business-storage',
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
          return { businessData: INITIAL_BUSINESS_DATA, gallery: [], _version: STORAGE_VERSION };
        }
        return persistedState;
      },
    }
  )
);
