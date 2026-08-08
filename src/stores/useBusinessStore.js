// src/stores/useBusinessStore.js
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { todayJalaali } from '@/utils/dateUtils';

// ✅ نسخه استور - هر بار ساختار داده عوض شد، این عدد را ۱ واحد زیاد کنید
const STORAGE_VERSION = 2;

// ✅ تاریخ امروز به صورت داینامیک
const today = todayJalaali();

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
  // ═══════ نوبت‌ها با تاریخ امروز ═══════
  appointments: [
    {
      id: 'apt_1',
      customerName: 'نازنین کریمی',
      customerPhone: '09121112233',
      serviceName: 'فیشیال تخصصی پوست',
      employeeName: 'سارا احمدی',
      date: today,
      time: '۰۸:۳۰',
      status: 'done',
      price: 675000,
      depositPaid: 200000,
      verificationCode: '5892',
    },
    {
      id: 'apt_2',
      customerName: 'الهام محمدی',
      customerPhone: '09124445566',
      serviceName: 'کاشت ناخن ژلیش',
      employeeName: 'مریم رضایی',
      date: today,
      time: '۰۹:۳۰',
      status: 'pending_verification',
      price: 450000,
      depositPaid: 100000,
      verificationCode: '2571',
    },
    {
      id: 'apt_3',
      customerName: 'زهرا حسینی',
      customerPhone: '09127778899',
      serviceName: 'لیزر فول بادی',
      employeeName: 'دکتر رضایی',
      date: today,
      time: '۱۰:۳۰',
      status: 'reserved',
      price: 2125000,
      depositPaid: 500000,
      verificationCode: '7456',
    },
    {
      id: 'apt_4',
      customerName: 'مریم احمدی',
      customerPhone: '09123334455',
      serviceName: 'فیشیال تخصصی پوست',
      employeeName: 'سارا احمدی',
      date: today,
      time: '۱۱:۳۰',
      status: 'reserved',
      price: 675000,
      depositPaid: 200000,
      verificationCode: '3841',
    },
    {
      id: 'apt_5',
      customerName: 'سمیرا قاسمی',
      customerPhone: '09126665544',
      serviceName: 'کاشت ناخن ژلیش',
      employeeName: 'مریم رضایی',
      date: today,
      time: '۱۲:۳۰',
      status: 'cancelled_by_salon',
      price: 450000,
      depositPaid: 100000,
      cancellationReason: 'سالن در این ساعت تعطیل است',
      refundAmount: 100000,
    },
    {
      id: 'apt_6',
      customerName: 'پریسا نوری',
      customerPhone: '09128889900',
      serviceName: 'لیزر فول بادی',
      employeeName: 'دکتر رضایی',
      date: today,
      time: '۱۴:۰۰',
      status: 'pending_verification',
      price: 2125000,
      depositPaid: 500000,
      verificationCode: '9213',
    },
    {
      id: 'apt_7',
      customerName: 'فاطمه رضوی',
      customerPhone: '09121234567',
      serviceName: 'فیشیال تخصصی پوست',
      employeeName: 'سارا احمدی',
      date: today,
      time: '۱۵:۳۰',
      status: 'reserved',
      price: 675000,
      depositPaid: 200000,
      verificationCode: '6174',
    },
    {
      id: 'apt_8',
      customerName: 'شیما کاظمی',
      customerPhone: '09129876543',
      serviceName: 'کاشت ناخن ژلیش',
      employeeName: 'مریم رضایی',
      date: today,
      time: '۱۶:۳۰',
      status: 'pending_verification',
      price: 450000,
      depositPaid: 100000,
      verificationCode: '4528',
    },
    {
      id: 'apt_9',
      customerName: 'نگار موسوی',
      customerPhone: '09125556677',
      serviceName: 'لیزر فول بادی',
      employeeName: 'دکتر رضایی',
      date: today,
      time: '۱۷:۳۰',
      status: 'cancelled_by_salon',
      price: 2125000,
      depositPaid: 500000,
      cancellationReason: 'دستگاه لیزر در تعمیر است',
      refundAmount: 500000,
    },
    {
      id: 'apt_10',
      customerName: 'آیدا شریفی',
      customerPhone: '09124443322',
      serviceName: 'فیشیال تخصصی پوست',
      employeeName: 'سارا احمدی',
      date: today,
      time: '۱۹:۰۰',
      status: 'reserved',
      price: 675000,
      depositPaid: 200000,
      verificationCode: '8367',
    },
  ],
  portfolios: [],
};

export const useBusinessStore = create(
  persist(
    (set, get) => ({
      businessData: INITIAL_BUSINESS_DATA,
      // ═══════ نسخه برای ریست خودکار ═══════
      _version: STORAGE_VERSION,

      // ═══════ Services ═══════
      addService: (service) =>
        set((state) => ({
          businessData: {
            ...state.businessData,
            services: [...state.businessData.services, { ...service, id: `svc_${Date.now()}` }],
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
          },
        })),

      // ═══════ Team ═══════
      addTeamMember: (member) =>
        set((state) => ({
          businessData: {
            ...state.businessData,
            team: [...state.businessData.team, { ...member, id: `emp_${Date.now()}` }],
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
            portfolios: state.businessData.portfolios.filter((p) => p.id !== portfolioId),
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
      getActiveServices: () => get().businessData.services.filter((s) => s.isActive !== false),

      // ═══════ ریست دستی ═══════
      resetToDefaults: () => {
        set({ businessData: INITIAL_BUSINESS_DATA, _version: STORAGE_VERSION });
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
      // ✅ مهاجرت خودکار: اگر نسخه قدیمی بود، داده‌ها ریست شوند
      migrate: (persistedState, version) => {
        if (version < STORAGE_VERSION) {
          // نسخه قدیمی → ریست کامل با تاریخ‌های جدید
          return {
            businessData: INITIAL_BUSINESS_DATA,
            _version: STORAGE_VERSION,
          };
        }
        return persistedState;
      },
      // ✅ اگر داده‌ها خالی یا خراب بودند، از مقادیر پیش‌فرض استفاده کن
      merge: (persistedState, currentState) => {
        if (
          !persistedState ||
          !persistedState.businessData ||
          !persistedState.businessData.appointments ||
          persistedState.businessData.appointments.length === 0
        ) {
          return currentState;
        }
        // ✅ بررسی سلامت تاریخ‌ها
        const firstApt = persistedState.businessData.appointments[0];
        if (!firstApt.date || !firstApt.date.jy || !firstApt.date.jm || !firstApt.date.jd) {
          return currentState;
        }
        return { ...currentState, ...persistedState };
      },
    }
  )
);