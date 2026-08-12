// src/data/priceList.js
/**
 * 🎨 تم‌های ظاهری منوی قیمت + تنظیمات اولیه (MOCK)
 */

export const PRICE_LIST_THEMES = [
  {
    id: 'rose',
    label: 'صورتی پاستلی',
    emoji: '🌸',
    bg: '#FBE9EE',
    card: '#FFF7FA',
    accent: '#B4486B',
    accentSoft: '#B4486B15',
    text: '#6E2A44',
    textSecondary: '#9A6B7C',
    border: '#EAC6D3',
    dot: '#D9A0B4',
  },
  {
    id: 'gold',
    label: 'طلایی لوکس',
    emoji: '👑',
    bg: '#FAF4E8',
    card: '#FFFBF2',
    accent: '#9C7A2E',
    accentSoft: '#9C7A2E15',
    text: '#5A4415',
    textSecondary: '#8A744A',
    border: '#E4D3AC',
    dot: '#CBB277',
  },
  {
    id: 'mint',
    label: 'سبز مینیمال',
    emoji: '🌿',
    bg: '#EAF4EF',
    card: '#F7FCF9',
    accent: '#2F7D62',
    accentSoft: '#2F7D6215',
    text: '#1E4D3C',
    textSecondary: '#5F8577',
    border: '#C4DFD3',
    dot: '#93C4B0',
  },
  {
    id: 'classic',
    label: 'کلاسیک زیبانو',
    emoji: '🤎',
    bg: '#F5F0EC',
    card: '#FDFAF7',
    accent: '#A88B7D',
    accentSoft: '#A88B7D15',
    text: '#2C2521',
    textSecondary: '#5A504B',
    border: '#DCD1CB',
    dot: '#C3B2A6',
  },
];

// ═══════ تنظیمات اولیه لیست قیمت برای هر کسب‌وکار (MOCK) ═══════
export const INITIAL_PRICE_LISTS = {
  // کسب‌وکار عمومی (صفحه جزئیات مشتری)
  1: {
    businessId: '1',
    themeId: 'rose',
    isPublished: true,
    notes: [
      { id: 'nt1', label: 'افزانه مواد', min: 50, max: 100 },
      { id: 'nt2', label: 'تغییر فرم', min: 80, max: 100 },
      { id: 'nt3', label: 'ناخن شکسته', min: 25, max: 35 },
      { id: 'nt4', label: 'ترمیم همکار', min: 50, max: 80 },
    ],
  },
  // کسب‌وکار صاحب‌کار (مدیریت)
  biz_1: {
    businessId: 'biz_1',
    themeId: 'rose',
    isPublished: false,
    notes: [{ id: 'nt5', label: 'مشاوره پوست', min: 0, max: 0 }],
  },
};
