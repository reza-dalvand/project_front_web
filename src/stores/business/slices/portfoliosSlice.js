// src/stores/business/slices/portfoliosSlice.js

/**
 * Slice نمونه‌کارها
 * اکشن‌های مدیریت گالری نمونه‌کارهای کسب‌وکار
 */
export const createPortfoliosSlice = (set) => ({
  // ─── افزودن نمونه‌کار ───
  addPortfolio: (portfolio) =>
    set((state) => ({
      businessData: {
        ...state.businessData,
        portfolios: [
          ...state.businessData.portfolios,
          { ...portfolio, id: portfolio.id || `pf_${Date.now()}` },
        ],
      },
    })),

  // ─── ویرایش نمونه‌کار ───
  updatePortfolio: (portfolioId, updates) =>
    set((state) => ({
      businessData: {
        ...state.businessData,
        portfolios: state.businessData.portfolios.map((p) =>
          p.id === portfolioId ? { ...p, ...updates } : p
        ),
      },
    })),

  // ─── حذف نمونه‌کار ───
  deletePortfolio: (portfolioId) =>
    set((state) => ({
      businessData: {
        ...state.businessData,
        portfolios: state.businessData.portfolios.filter((p) => p.id !== portfolioId),
      },
    })),
});
