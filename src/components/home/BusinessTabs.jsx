// src/components/home/BusinessTabs.jsx
'use client';

export default function BusinessTabs({ activeTab, onTabChange, colors, showPrices = false }) {
  const TABS = [
    { id: 'services', label: 'خدمات' },
    ...(showPrices ? [{ id: 'prices', label: 'قیمت‌ها' }] : []),
    { id: 'honors', label: 'نظرات' },
    { id: 'portfolio', label: 'نمونه‌کار' },
    { id: 'about', label: 'درباره' },
  ];

  return (
    // ✅ چسبان: هنگام اسکرول بالای صفحه ثابت می‌ماند
    <div
      className="sticky top-0 z-30 px-5 pt-2 pb-3"
      style={{ backgroundColor: colors.background }}
    >
      <div
        className="flex p-1 rounded-2xl gap-1 border"
        style={{ backgroundColor: colors.cardBackground, borderColor: colors.border }}
      >
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className="flex-1 py-2.5 rounded-xl items-center justify-center transition-colors whitespace-nowrap"
              style={{ backgroundColor: isActive ? colors.primary : 'transparent' }}
            >
              <span
                className="text-[12px]"
                style={{
                  color: isActive ? '#fff' : colors.textSecondary,
                  fontFamily: isActive ? 'Vazir-Bold' : 'Vazir',
                }}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
