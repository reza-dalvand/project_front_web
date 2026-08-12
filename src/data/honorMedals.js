// src/data/honorMedals.js
export const HONOR_MEDALS = [
  { id: 'clean', tagId: 'clean', label: 'مکان تمیز بود', emoji: '🧹', threshold: 15 },
  { id: 'punctual', tagId: 'punctual', label: 'سر وقت انجام شد', emoji: '⏰', threshold: 25 },
  { id: 'quality', tagId: 'quality', label: 'کیفیت عالی بود', emoji: '⭐', threshold: 30 },
  { id: 'polite', tagId: 'polite', label: 'رفتار محترمانه', emoji: '🤝', threshold: 20 },
  { id: 'fair_price', tagId: 'fair_price', label: 'قیمت مناسب بود', emoji: '💰', threshold: 10 },
  { id: 'recommend', tagId: 'recommend', label: 'پیشنهاد می‌کنم', emoji: '👍', threshold: 35 },
];

export const MOCK_TAG_COUNTS = {
  1: { clean: 18, punctual: 12, quality: 35, polite: 8, fair_price: 14, recommend: 22 },
  2: { clean: 5, punctual: 28, quality: 15, polite: 25, fair_price: 7, recommend: 40 },
  3: { clean: 22, punctual: 30, quality: 42, polite: 18, fair_price: 12, recommend: 38 },
  4: { clean: 3, punctual: 5, quality: 8, polite: 2, fair_price: 4, recommend: 6 },
  5: { clean: 16, punctual: 20, quality: 28, polite: 22, fair_price: 11, recommend: 30 },
};

export const getTagCounts = (businessId) =>
  MOCK_TAG_COUNTS[businessId] || {
    clean: 0,
    punctual: 0,
    quality: 0,
    polite: 0,
    fair_price: 0,
    recommend: 0,
  };
