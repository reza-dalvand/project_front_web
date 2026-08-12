// src/stores/useBusinessStore.js
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { businessesService, servicesService, schedulesService } from '@/api';
import { INITIAL_BUSINESS_DATA, STORAGE_VERSION } from './business/initialData';
import { createServicesSlice } from './business/slices/servicesSlice';
import { createAppointmentsSlice } from './business/slices/appointmentsSlice';
import { createTeamSlice } from './business/slices/teamSlice';
import { createPortfoliosSlice } from './business/slices/portfoliosSlice';
import { createSchedulesSlice } from './business/slices/schedulesSlice'; // ✅ اضافه شد

export const useBusinessStore = create(
  persist(
    (set, get) => ({
      // ─── State اصلی ───
      businessData: INITIAL_BUSINESS_DATA,
      _version: STORAGE_VERSION,

      // ─── Slice: خدمات ───
      ...createServicesSlice(set),

      // ─── Slice: نوبت‌ها ───
      ...createAppointmentsSlice(set),

      // ─── Slice: تیم ───
      ...createTeamSlice(set),

      // ─── Slice: نمونه‌کارها ───
      ...createPortfoliosSlice(set),

      // ─── Slice: زمان‌بندی ───
      ...createSchedulesSlice(set),

      // ─── اطلاعات پایه کسب‌وکار ───
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

      // ─── ریست دستی ───
      resetToDefaults: () => {
        set({ businessData: INITIAL_BUSINESS_DATA, _version: STORAGE_VERSION });
      },

      // ═══════════════════════════════════════════════
      //    🆕 API Sync Methods
      // ═══════════════════════════════════════════════

      /**
       * دریافت اطلاعات کسب‌وکار از API
       */
      fetchBusinessDetail: async () => {
        try {
          const response = await businessesService.getBusinessDetail();
          const business = response.data;

          set((state) => ({
            businessData: {
              ...state.businessData,
              id: business.id,
              name: business.name,
              category: business.category?.name || '',
              categoryId: business.category?.id || '',
              address: business.address,
              city: business.city?.name || '',
              cityId: business.city?.id || '',
              phone: business.phone,
              rating: business.rating,
              reviewsCount: business.reviews_count,
              VIP: business.is_vip,
              logo: business.logo,
              coverUrl: business.cover_image,
              ownerName: business.owner_name,
              verifiedName: business.verified_name,
              bankInfo: {
                isRegistered: business.bank_info_registered,
                isVerified: business.bank_info_verified,
              },
              isActive: business.status === 'approved',
            },
          }));

          return response.data;
        } catch (error) {
          console.error('fetchBusinessDetail failed:', error);
          throw error;
        }
      },

      /**
       * دریافت وضعیت کسب‌وکار از API
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
       * دریافت لیست خدمات از API
       */
      fetchServices: async () => {
        try {
          const response = await servicesService.getServices();
          const services = response.data;

          // تبدیل به فرمت store
          const formattedServices = services.map((service) => ({
            id: service.id,
            name: service.name,
            typeId: service.sub_service?.type_id || '',
            typeName: service.sub_service?.name || '',
            originalPrice: service.original_price,
            discountPercent: service.discount_percent,
            finalPrice: service.final_price,
            duration: service.duration,
            hasDeposit: service.has_deposit,
            depositAmount: service.deposit_amount,
            isActive: service.is_active,
          }));

          set((state) => ({
            businessData: {
              ...state.businessData,
              services: formattedServices,
            },
          }));

          return formattedServices;
        } catch (error) {
          console.error('fetchServices failed:', error);
          throw error;
        }
      },

      /**
       * ایجاد خدمت جدید در API
       */
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

          // به‌روزرسانی store محلی
          get().addService({
            ...serviceData,
            id: response.data.id,
          });

          return response.data;
        } catch (error) {
          console.error('createService failed:', error);
          throw error;
        }
      },

      /**
       * بروزرسانی خدمت در API
       */
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

          // به‌روزرسانی store محلی
          get().updateService(serviceId, serviceData);

          return response.data;
        } catch (error) {
          console.error('updateServiceApi failed:', error);
          throw error;
        }
      },

      /**
       * حذف خدمت در API
       */
      deleteServiceApi: async (serviceId) => {
        try {
          await servicesService.deleteService(serviceId);
          get().deleteService(serviceId);
        } catch (error) {
          console.error('deleteServiceApi failed:', error);
          throw error;
        }
      },

      /**
       * فعال/غیرفعال کردن خدمت در API
       */
      toggleServiceActiveApi: async (serviceId) => {
        try {
          const response = await servicesService.toggleServiceActive(serviceId);
          get().toggleServiceActive(serviceId);
          return response;
        } catch (error) {
          console.error('toggleServiceActiveApi failed:', error);
          throw error;
        }
      },

      /**
       * دریافت زمان‌بندی‌ها از API
       */
      fetchSchedules: async () => {
        try {
          const response = await schedulesService.getSchedules();
          return response.data;
        } catch (error) {
          console.error('fetchSchedules failed:', error);
          throw error;
        }
      },

      /**
       * دریافت زمان‌بندی بر اساس تاریخ از API
       */
      fetchSchedulesByDate: async (jy, jm, jd, serviceId = null) => {
        try {
          const response = await schedulesService.getSchedulesByDate(jy, jm, jd, serviceId);
          return response.data;
        } catch (error) {
          console.error('fetchSchedulesByDate failed:', error);
          throw error;
        }
      },

      /**
       * ایجاد زمان‌بندی جدید در API
       */
      createSchedule: async (scheduleData) => {
        try {
          const response = await schedulesService.createSchedule({
            service: scheduleData.serviceId,
            jy: scheduleData.jy,
            jm: scheduleData.jm,
            jd: scheduleData.jd,
            work_start: scheduleData.workStart,
            work_end: scheduleData.workEnd,
            slot_duration: scheduleData.slotDuration,
            breaks: scheduleData.breaks || [],
          });

          // به‌روزرسانی store محلی
          const dateKey = `${scheduleData.jy}/${String(scheduleData.jm).padStart(2, '0')}/${String(scheduleData.jd).padStart(2, '0')}`;
          get().saveSchedule(
            scheduleData.ownerId || 'owner',
            scheduleData.serviceId,
            dateKey,
            scheduleData
          );

          return response.data;
        } catch (error) {
          console.error('createSchedule failed:', error);
          throw error;
        }
      },

      /**
       * به‌روزرسانی اطلاعات بانکی در API
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

          // به‌روزرسانی store محلی
          set((state) => ({
            businessData: {
              ...state.businessData,
              bankInfo: {
                isRegistered: true,
                isVerified: false,
              },
            },
          }));

          return response.data;
        } catch (error) {
          console.error('updateBankInfoApi failed:', error);
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
        _version: STORAGE_VERSION,
      }),
      migrate: (persistedState, version) => {
        if (version < STORAGE_VERSION) {
          return { businessData: INITIAL_BUSINESS_DATA, _version: STORAGE_VERSION };
        }
        return persistedState;
      },
      merge: (persistedState, currentState) => {
        if (
          !persistedState ||
          !persistedState.businessData ||
          !persistedState.businessData.appointments ||
          persistedState.businessData.appointments.length === 0
        ) {
          return currentState;
        }
        const firstApt = persistedState.businessData.appointments[0];
        if (!firstApt.date || !firstApt.date.jy || !firstApt.date.jm || !firstApt.date.jd) {
          return currentState;
        }
        return { ...currentState, ...persistedState };
      },
    }
  )
);
