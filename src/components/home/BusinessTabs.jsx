// src/components/home/BusinessTabs.jsx
'use client';

export default function BusinessTabs({ activeTab, onTabChange, colors, showPrices = false }) {
  const TABS = [
    { id: 'services', label: 'خدمات' },
    ...(showPrices ? [{ id: 'prices', label: 'قیمت‌ها' }] : []),
    { id: 'honors', label: 'نشان‌ها' },
    { id: 'portfolio', label: 'نمونه‌کار' },
    { id: 'about', label: 'درباره' },
  ];

  return (
    <div className="px-5 mt-2 mb-4">
      <div
        className="flex p-1 rounded-2xl gap-1 overflow-x-auto scrollbar-hide"
        style={{ backgroundColor: colors.cardBackground }}
      >
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className="flex-1 py-2.5 px-2 rounded-xl items-center justify-center transition-all whitespace-nowrap"
              style={{
                backgroundColor: isActive ? '#A88B7D' : 'transparent',
              }}
            >
              <span
                className="text-[13px]"
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
