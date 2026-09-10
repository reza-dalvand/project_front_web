// src/stores/business/slices/servicesSlice.js
/**
 * Slice خدمات — نسخه نهایی با API sync
 *
 * هماهنگ با بک‌اند:
 * - Service model: name, category, sub_service, original_price,
 *   discount_percent, has_deposit, deposit_amount, duration, renewal_days, is_active
 * - Computed: final_price, discount_amount, app_fee
 * - sub_service به صورت nested: { id, name, slug, type_id, category }
 */
import { servicesService } from '@/api';
/**
 * تبدیل فرمت بک‌اند به فرمت فرانت
 */
/**
 * تبدیل فرمت بک‌اند به فرمت فرانت
 * ✅ فاز ۳: بعد از نرمال‌ساز، کلیدها camelCase هستند
 */
const mapServiceFromApi = (s) => {
  if (!s) return null;
  return {
    id: s.id,
    name: s.name,
    typeId: s.subService?.typeId || s.subServiceId || '',
    typeName: s.subService?.name || s.subServiceName || '',
    categoryId: s.categoryId || s.category?.id || null,
    categoryLabel: s.categoryName || '',
    originalPrice: s.originalPrice,
    discountPercent: s.discountPercent || 0,
    discountAmount: s.discountAmount || 0,
    finalPrice: s.finalPrice || s.originalPrice,
    appFee: s.appFee || 0,
    duration: s.duration || 60,
    hasDeposit: s.hasDeposit || false,
    depositAmount: s.depositAmount || 0,
    renewalDays: s.renewalDays || 0,
    isActive: s.isActive !== false,
    description: s.description || '',
  };
};

/**
 * تبدیل فرمت فرانت به فرمت بک‌اند (برای ایجاد/بروزرسانی)
 */
const mapServiceToApi = (serviceData) => {
  const payload = {};
  if (serviceData.name !== undefined) payload.name = serviceData.name;
  if (serviceData.categoryId !== undefined) payload.category = serviceData.categoryId;
  if (serviceData.typeId !== undefined) payload.sub_service = serviceData.typeId;
  if (serviceData.description !== undefined) payload.description = serviceData.description;
  if (serviceData.originalPrice !== undefined) payload.original_price = serviceData.originalPrice;
  if (serviceData.discountPercent !== undefined)
    payload.discount_percent = serviceData.discountPercent;
  if (serviceData.hasDeposit !== undefined) payload.has_deposit = serviceData.hasDeposit;
  if (serviceData.depositAmount !== undefined) payload.deposit_amount = serviceData.depositAmount;
  if (serviceData.duration !== undefined) payload.duration = serviceData.duration;
  if (serviceData.renewalDays !== undefined) payload.renewal_days = serviceData.renewalDays;
  if (serviceData.isActive !== undefined) payload.is_active = serviceData.isActive;
  return payload;
};

export const createServicesSlice = (set, get) => ({
  // ─── State ───
  servicesLoading: false,
  servicesError: null,

  // ─── API Sync ───
  /**
   * دریافت لیست خدمات از API
   */
  fetchServices: async () => {
    set({ servicesLoading: true, servicesError: null });
    try {
      const response = await servicesService.getServices();
      const services = (response.data || []).map(mapServiceFromApi);
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
    try {
      const payload = mapServiceToApi(serviceData);
      const response = await servicesService.createService(payload);

      const rawData = response?.data || response;
      const servicePayload = rawData?.data || rawData;

      if (!servicePayload || !servicePayload.id) {
        throw new Error('Invalid service creation response');
      }

      const newService = mapServiceFromApi(servicePayload);
      if (newService) {
        get().addService(newService);
      }
      return servicePayload;
    } catch (error) {
      console.error('createServiceApi failed:', error);
      throw error;
    }
  },

  /**
   * بروزرسانی خدمت در API
   */
  updateServiceApi: async (serviceId, serviceData) => {
    try {
      const payload = mapServiceToApi(serviceData);
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
