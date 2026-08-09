// src/stores/business/slices/servicesSlice.js

/**
 * Slice خدمات
 * اکشن‌های add / update / delete / toggle برای خدمات کسب‌وکار
 */
export const createServicesSlice = (set) => ({
  // ─── افزودن خدمت جدید ───
  addService: (service) =>
    set((state) => ({
      businessData: {
        ...state.businessData,
        services: [
          ...state.businessData.services,
          { ...service, id: service.id || `svc_${Date.now()}` },
        ],
      },
    })),

  // ─── ویرایش خدمت ───
  updateService: (serviceId, updates) =>
    set((state) => ({
      businessData: {
        ...state.businessData,
        services: state.businessData.services.map((s) =>
          s.id === serviceId ? { ...s, ...updates } : s
        ),
      },
    })),

  // ─── حذف خدمت ───
  deleteService: (serviceId) =>
    set((state) => ({
      businessData: {
        ...state.businessData,
        services: state.businessData.services.filter((s) => s.id !== serviceId),
        // حذف سرویس از تیم‌ها هم
        team: state.businessData.team.map((member) => ({
          ...member,
          services: (member.services || []).filter((id) => id !== serviceId),
        })),
      },
    })),

  // ─── فعال/غیرفعال کردن خدمت ───
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
