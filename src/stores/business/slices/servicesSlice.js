// src/stores/business/slices/servicesSlice.js
/**
 * Slice خدمات — نسخه نهایی با API sync
 *
 * هماهنگ با بک‌اند:
 * - Service model: name, category, sub_service, original_price,
 *   discount_percent, has_deposit, deposit_amount, duration, renewal_days, is_active
 * - Computed: final_price, discount_amount, app_fee
 */
import { servicesService } from '@/api';
import { USE_MOCK } from '@/api/config';

export const createServicesSlice = (set, get) => ({
  // ─── State ───
  servicesLoading: false,
  servicesError: null,

  // ─── API Sync ───

  /**
   * دریافت لیست خدمات از API
   */
  fetchServices: async () => {
    if (USE_MOCK) return get().businessData.services;

    set({ servicesLoading: true, servicesError: null });
    try {
      const response = await servicesService.getServices();
      const services = (response.data || []).map((s) => ({
        id: s.id,
        name: s.name,
        typeId: s.sub_service?.type_id || s.sub_service_id || '',
        typeName: s.sub_service?.name || s.sub_service_name || '',
        categoryId: s.category_id || s.category?.id || null,
        categoryLabel: s.category_name || '',
        originalPrice: s.original_price,
        discountPercent: s.discount_percent || 0,
        discountAmount: s.discount_amount || 0,
        finalPrice: s.final_price || s.original_price,
        appFee: s.app_fee || 0,
        duration: s.duration || 60,
        hasDeposit: s.has_deposit || false,
        depositAmount: s.deposit_amount || 0,
        renewalDays: s.renewal_days || 0,
        isActive: s.is_active !== false,
        description: s.description || '',
      }));

      set((state) => ({
        businessData: { ...state.businessData, services },
        servicesLoading: false,
      }));
      return services;
    } catch (error) {
      console.error('fetchServices failed:', error);
      set({ servicesError: error.message, servicesLoading: false });
      throw error;
    }
  },

  /**
   * ایجاد خدمت جدید در API
   */
  createServiceApi: async (serviceData) => {
    if (USE_MOCK) {
      get().addService(serviceData);
      return { id: `svc_${Date.now()}`, ...serviceData };
    }

    try {
      const response = await servicesService.createService({
        name: serviceData.name,
        category: serviceData.categoryId,
        sub_service: serviceData.typeId,
        description: serviceData.description || '',
        original_price: serviceData.originalPrice,
        discount_percent: serviceData.discountPercent || 0,
        has_deposit: serviceData.hasDeposit || false,
        deposit_amount: serviceData.depositAmount || 0,
        duration: serviceData.duration || 60,
        renewal_days: serviceData.renewalDays || 0,
        is_active: serviceData.isActive !== false,
      });

      const newService = {
        id: response.data.id,
        name: serviceData.name,
        typeId: serviceData.typeId,
        typeName: serviceData.typeName || '',
        categoryId: serviceData.categoryId,
        categoryLabel: serviceData.categoryLabel || '',
        originalPrice: serviceData.originalPrice,
        discountPercent: serviceData.discountPercent || 0,
        finalPrice: response.data.final_price || serviceData.originalPrice,
        duration: serviceData.duration || 60,
        hasDeposit: serviceData.hasDeposit || false,
        depositAmount: serviceData.depositAmount || 0,
        renewalDays: serviceData.renewalDays || 0,
        isActive: true,
        description: serviceData.description || '',
      };

      get().addService(newService);
      return response.data;
    } catch (error) {
      console.error('createServiceApi failed:', error);
      throw error;
    }
  },

  /**
   * بروزرسانی خدمت در API
   */
  updateServiceApi: async (serviceId, serviceData) => {
    if (USE_MOCK) {
      get().updateService(serviceId, serviceData);
      return serviceData;
    }

    try {
      const payload = {};
      if (serviceData.name !== undefined) payload.name = serviceData.name;
      if (serviceData.originalPrice !== undefined)
        payload.original_price = serviceData.originalPrice;
      if (serviceData.discountPercent !== undefined)
        payload.discount_percent = serviceData.discountPercent;
      if (serviceData.hasDeposit !== undefined) payload.has_deposit = serviceData.hasDeposit;
      if (serviceData.depositAmount !== undefined)
        payload.deposit_amount = serviceData.depositAmount;
      if (serviceData.duration !== undefined) payload.duration = serviceData.duration;
      if (serviceData.renewalDays !== undefined) payload.renewal_days = serviceData.renewalDays;
      if (serviceData.description !== undefined) payload.description = serviceData.description;
      if (serviceData.categoryId !== undefined) payload.category = serviceData.categoryId;
      if (serviceData.typeId !== undefined) payload.sub_service = serviceData.typeId;

      const response = await servicesService.updateService(serviceId, payload);
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
    if (USE_MOCK) {
      get().deleteService(serviceId);
      return;
    }

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
    if (USE_MOCK) {
      get().toggleServiceActive(serviceId);
      return;
    }

    try {
      await servicesService.toggleServiceActive(serviceId);
      get().toggleServiceActive(serviceId);
    } catch (error) {
      console.error('toggleServiceActiveApi failed:', error);
      throw error;
    }
  },

  // ─── Local Actions (بدون تغییر) ───

  addService: (service) =>
    set((state) => ({
      businessData: {
        ...state.businessData,
        services: [
          ...state.businessData.services,
          {
            ...service,
            id: service.id || `svc_${Date.now()}`,
            isActive: service.isActive !== false,
          },
        ],
      },
    })),

  updateService: (serviceId, updates) =>
    set((state) => ({
      businessData: {
        ...state.businessData,
        services: state.businessData.services.map((s) =>
          s.id === serviceId ? { ...s, ...updates } : s
        ),
      },
    })),

  deleteService: (serviceId) =>
    set((state) => ({
      businessData: {
        ...state.businessData,
        services: state.businessData.services.filter((s) => s.id !== serviceId),
        team: state.businessData.team.map((member) => ({
          ...member,
          services: (member.services || []).filter((id) => id !== serviceId),
        })),
      },
    })),

  toggleServiceActive: (serviceId) =>
    set((state) => ({
      businessData: {
        ...state.businessData,
        services: state.businessData.services.map((s) =>
          s.id === serviceId ? { ...s, isActive: !s.isActive } : s
        ),
      },
    })),
});
