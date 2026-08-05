// src/stores/useBusinessStore.js
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const INITIAL_BUSINESS_DATA = {
  id: 'biz_1',
  isActive: true, 
  name: 'سالن زیبایی نیلارام',
  category: 'کلینیک پوست و مو',
  categoryId: '2',
  address: 'تهران، سعادت‌آباد، خیابان سرو غربی',
  city: 'تهران، سعادت‌آباد',
  phone: '۰۲۱-۲۲۳۳۴۴۵۵',
  rating: 4.9,
  reviewsCount: 142,
  VIP: true,
  logo: 'https://picsum.photos/150?random=1',
  coverUrl: 'https://picsum.photos/800/400?random=10',
  ownerName: 'مریم حسینی',
  verifiedName: 'مریم حسینی',
  services: [
    {
      id: 'svc_1',
      name: 'فیشیال تخصصی پوست',
      typeId: 'facial',
      typeName: 'فیشیال و پاکسازی پوست',
      originalPrice: 750000,
      discountPercent: 10,
      finalPrice: 675000,
      duration: 60,
      hasDeposit: true,
      depositAmount: 200000,
      isActive: true,
    },
    {
      id: 'svc_2',
      name: 'کاشت ناخن ژلیش',
      typeId: 'nail',
      typeName: 'کاشت و طراحی ناخن',
      originalPrice: 450000,
      discountPercent: 0,
      finalPrice: 450000,
      duration: 90,
      hasDeposit: true,
      depositAmount: 100000,
      isActive: true,
    },
    {
      id: 'svc_3',
      name: 'لیزر فول بادی',
      typeId: 'laser',
      typeName: 'لیزر موهای زائد',
      originalPrice: 2500000,
      discountPercent: 15,
      finalPrice: 2125000,
      duration: 120,
      hasDeposit: true,
      depositAmount: 500000,
      isActive: true,
    },
  ],
  team: [],
  schedules: {},
  appointments: [
    {
      id: 'apt_1',
      customerName: 'نازنین کریمی',
      customerPhone: '09121112233',
      serviceName: 'فیشیال تخصصی پوست',
      employeeName: 'سارا احمدی',
      date: { jy: 1405, jm: 5, jd: 14 },
      time: '۱۰:۳۰',
      status: 'reserved',
      price: 675000,
      depositPaid: 200000,
    },
    {
      id: 'apt_2',
      customerName: 'الهام محمدی',
      customerPhone: '09124445566',
      serviceName: 'کاشت ناخن ژلیش',
      employeeName: 'مریم رضایی',
      date: { jy: 1405, jm: 5, jd: 14 },
      time: '۱۴:۳۰',
      status: 'reserved',
      price: 450000,
      depositPaid: 100000,
    },
  ],
  portfolios: [],
};

export const useBusinessStore = create(
  persist(
    (set, get) => ({
      businessData: INITIAL_BUSINESS_DATA,

      // ═══════ Services ═══════
      addService: (service) =>
        set((state) => ({
          businessData: {
            ...state.businessData,
            services: [
              ...state.businessData.services,
              { ...service, id: `svc_${Date.now()}` },
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
            services: state.businessData.services.filter(
              (s) => s.id !== serviceId
            ),
          },
        })),

      // ═══════ Team ═══════
      addTeamMember: (member) =>
        set((state) => ({
          businessData: {
            ...state.businessData,
            team: [
              ...state.businessData.team,
              { ...member, id: `emp_${Date.now()}` },
            ],
          },
        })),

      updateTeamMember: (memberId, updates) =>
        set((state) => ({
          businessData: {
            ...state.businessData,
            team: state.businessData.team.map((m) =>
              m.id === memberId ? { ...m, ...updates } : m
            ),
          },
        })),

      deleteTeamMember: (memberId) =>
        set((state) => ({
          businessData: {
            ...state.businessData,
            team: state.businessData.team.filter((m) => m.id !== memberId),
          },
        })),

      // ═══════ Appointments ═══════
      updateAppointmentStatus: (appointmentId, newStatus) =>
        set((state) => ({
          businessData: {
            ...state.businessData,
            appointments: state.businessData.appointments.map((apt) =>
              apt.id === appointmentId ? { ...apt, status: newStatus } : apt
            ),
          },
        })),

      // ═══════ Portfolios ═══════
      addPortfolio: (portfolio) =>
        set((state) => ({
          businessData: {
            ...state.businessData,
            portfolios: [
              ...state.businessData.portfolios,
              { ...portfolio, id: `pf_${Date.now()}` },
            ],
          },
        })),

      deletePortfolio: (portfolioId) =>
        set((state) => ({
          businessData: {
            ...state.businessData,
            portfolios: state.businessData.portfolios.filter(
              (p) => p.id !== portfolioId
            ),
          },
        })),

      // ═══════ Business Info ═══════
      updateBusinessInfo: (updates) =>
        set((state) => ({
          businessData: { ...state.businessData, ...updates },
        })),

      deleteBusiness: () => {
        set((state) => ({
          businessData: {
            ...state.businessData,
            isActive: false,
          },
        }));
        return true;
      },

      // ═══════ Selectors ═══════
      getActiveServices: () =>
        get().businessData.services.filter((s) => s.isActive !== false),
    }),
    {
      name: 'zibano-business-storage',
      storage: createJSONStorage(() =>
        typeof window !== 'undefined' ? localStorage : { getItem: () => null, setItem: () => {} }
      ),
      partialize: (state) => ({
        businessData: state.businessData,
      }),
    }
  )
);