'use client';
import { FiGrid, FiBell } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import { toPersianDigit } from '@/utils/numberUtils';

/**
 * تب‌های خدمات برای فیلتر مشتریان یادآوری
 * هر تب = یک خدمت + شمارنده مشتریان نیازمند یادآوری آن خدمت
 *
 * @param {Array}  tabs          - [{ id, label, count }]
 * @param {string} activeTab     - id تب فعال ('all' یا serviceId)
 * @param {function} onChange    - تغییر تب
 */
export default function ReminderTabs({ tabs, activeTab, onChange }) {
  const { colors } = useTheme();

  return (
    <div
      className="overflow-x-auto scrollbar-hide border-b"
      style={{ borderColor: colors.border, backgroundColor: colors.background }}
    >
      <div className="flex gap-2 px-4 py-3 whitespace-nowrap">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const isAll = tab.id === 'all';

          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-[20px] border-[1.5px]
                transition-all duration-200 flex-shrink-0"
              style={{
                backgroundColor: isActive ? colors.primary : colors.cardBackground,
                borderColor: isActive ? colors.primary : colors.border,
              }}
            >
              {/* آیکون */}
              {isAll ? (
                <FiGrid size={15} color={isActive ? '#fff' : colors.textSecondary} />
              ) : (
                <FiBell size={15} color={isActive ? '#fff' : '#FF9800'} />
              )}

              {/* لیبل */}
              <span
                className="text-[13px] font-[Vazir-Bold]"
                style={{ color: isActive ? '#fff' : colors.textMain }}
              >
                {tab.label}
              </span>

              {/* شمارنده */}
              <span
                className="min-w-[22px] h-[22px] px-1.5 rounded-full flex items-center
                  justify-center text-[11px] font-[Vazir-Bold]"
                style={{
                  backgroundColor: isActive
                    ? 'rgba(255,255,255,0.3)'
                    : tab.count > 0
                      ? '#FF980020'
                      : colors.border + '60',
                  color: isActive ? '#fff' : tab.count > 0 ? '#FF9800' : colors.textSecondary,
                }}
              >
                {toPersianDigit(tab.count)}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
