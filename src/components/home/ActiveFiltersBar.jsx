'use client';
import { FiX, FiMapPin, FiStar, FiSliders } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import { PROVINCES, CITIES } from '@/constants/exploreFilters';

const SORT_LABELS = {
  top_rated: 'بیشترین امتیاز',
  most_booked: 'بیشترین رزرو',
  highest_discount: 'بیشترین تخفیف',
  nearest: 'نزدیک‌ترین',
};

export default function ActiveFiltersBar({ filters, onChange, onClearAll }) {
  const { colors } = useTheme();

  const hasActive =
    filters.province ||
    filters.city ||
    (filters.minRating && filters.minRating !== '0') ||
    (filters.sortBy && filters.sortBy !== 'top_rated');

  if (!hasActive) return null;

  const chips = [];

  if (filters.province) {
    const provinceLabel = PROVINCES.find((p) => p.id === filters.province)?.label;
    chips.push({
      id: 'province',
      label: provinceLabel,
      icon: <FiMapPin size={14} />,
      onRemove: () => onChange({ ...filters, province: null, city: null }),
    });
  }

  if (filters.city && filters.province) {
    const cityLabel = CITIES[filters.province]?.find((c) => c.id === filters.city)?.label;
    if (cityLabel) {
      chips.push({
        id: 'city',
        label: cityLabel,
        icon: <FiMapPin size={14} />,
        onRemove: () => onChange({ ...filters, city: null }),
      });
    }
  }

  if (filters.minRating && filters.minRating !== '0') {
    chips.push({
      id: 'minRating',
      label: `⭐ ${filters.minRating}+`,
      icon: <FiStar size={14} />,
      onRemove: () => onChange({ ...filters, minRating: '0' }),
    });
  }

  if (filters.sortBy && filters.sortBy !== 'top_rated') {
    chips.push({
      id: 'sortBy',
      label: SORT_LABELS[filters.sortBy] || filters.sortBy,
      icon: <FiSliders size={14} />,
      onRemove: () => onChange({ ...filters, sortBy: 'top_rated' }),
    });
  }

  return (
    <div
      className="py-2.5 border-b overflow-x-auto scrollbar-hide"
      style={{ borderBottomColor: colors.border, backgroundColor: colors.background }}
    >
      <div className="flex gap-2 px-5 items-center whitespace-nowrap">
        {chips.map((chip) => (
          <span
            key={chip.id}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[16px] border-[1.5px] text-[12px] font-[Vazir-Medium]"
            style={{
              backgroundColor: colors.primary + '15',
              borderColor: colors.primary + '40',
              color: colors.primary,
            }}
          >
            {chip.icon}
            {chip.label}
            <button onClick={chip.onRemove} className="ml-0.5 hover:opacity-70">
              <FiX size={14} />
            </button>
          </span>
        ))}
        <button
          onClick={onClearAll}
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-[16px] text-[12px] font-[Vazir-Bold]"
          style={{
            backgroundColor: '#E5737315',
            color: '#E57373',
          }}
        >
          <FiX size={14} />
          حذف همه
        </button>
      </div>
    </div>
  );
}
