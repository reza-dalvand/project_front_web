'use client';

const TABS = [
  { id: 'services', label: 'خدمات' },
  { id: 'portfolio', label: 'نمونه‌کار' },
  { id: 'about', label: 'درباره' },
];

export default function BusinessTabs({ activeTab, onTabChange, colors }) {
  return (
    <div className="px-5 mt-2 mb-4">
      <div
        className="flex p-1 rounded-2xl gap-1"
        style={{ backgroundColor: colors.cardBackground }}
      >
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className="flex-1 py-2.5 rounded-xl items-center justify-center transition-all"
              style={{
                backgroundColor: isActive ? '#A88B7D' : 'transparent',
              }}
            >
              <span
                className="text-sm"
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
