'use client';

import { useState } from 'react';
import { FiSearch, FiX, FiCalendar } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';

const DATE_FILTER_LABELS = {
  null: 'همه تاریخ‌ها',
  today: 'امروز',
  week: 'این هفته',
  month: 'این ماه',
};

export default function AppointmentSearchBar({
  searchQuery,
  onSearchChange,
  dateFilter,
  onDateFilterChange,
}) {
  const { colors } = useTheme();
  const [focused, setFocused] = useState(false);

  const handleClear = () => {
    onSearchChange?.('');
  };

  const cycleDateFilter = () => {
    const filters = [null, 'today', 'week', 'month'];
    const currentIndex = filters.indexOf(dateFilter);
    const nextIndex = (currentIndex + 1) % filters.length;
    onDateFilterChange?.(filters[nextIndex]);
  };

  return (
    <div className="flex gap-2 px-4 py-3">
      {/* باکس جستجو */}
      <div
        className="flex-1 flex items-center gap-2.5 px-3.5 h-12 rounded-[14px] border-[1.5px] transition-colors"
        style={{
          backgroundColor: colors.cardBackground,
          borderColor: focused ? colors.primary : colors.border,
        }}
      >
        <FiSearch size={20} style={{ color: focused ? colors.primary : colors.textSecondary }} />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="جستجوی نام مشتری یا خدمت..."
          className="flex-1 bg-transparent outline-none text-sm text-right"
          style={{ color: colors.textMain, fontFamily: 'Vazir' }}
        />
        {searchQuery?.length > 0 && (
          <button
            onClick={handleClear}
            className="p-1 rounded-lg"
            style={{ backgroundColor: colors.background }}
          >
            <FiX size={16} style={{ color: colors.textSecondary }} />
          </button>
        )}
      </div>

      {/* دکمه فیلتر تاریخ */}
      <button
        onClick={cycleDateFilter}
        className="flex items-center gap-1.5 px-3.5 h-12 rounded-[14px] border-[1.5px] min-w-[120px] transition-colors"
        style={{
          backgroundColor: dateFilter ? colors.primary + '15' : colors.cardBackground,
          borderColor: dateFilter ? colors.primary : colors.border,
        }}
      >
        <FiCalendar size={18} style={{ color: dateFilter ? colors.primary : colors.textMain }} />
        <span
          className="text-xs font-[Vazir-Bold] whitespace-nowrap"
          style={{ color: dateFilter ? colors.primary : colors.textMain }}
        >
          {DATE_FILTER_LABELS[dateFilter]}
        </span>
      </button>
    </div>
  );
}
