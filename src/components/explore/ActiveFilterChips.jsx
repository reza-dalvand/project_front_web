// src/components/explore/ActiveFilterChips.jsx
'use client';
import { FiX, FiStar } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import { useServiceCategories, useSubServices } from '@/hooks/useCategoryOptions';

function Chip({ label, icon, onRemove, color }) {
  const { colors } = useTheme();
  return (
    <div
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium"
      style={{
        backgroundColor: (color || colors.primary) + '12',
        borderColor: (color || colors.primary) + '30',
        color: color || colors.primary,
      }}
    >
      {icon}
      <span>{label}</span>
      <button onClick={onRemove} className="mr-0.5 hover:opacity-70">
        <FiX size={12} />
      </button>
    </div>
  );
}

export default function ActiveFilterChips({ filters, onChange }) {
  const { colors } = useTheme();
  const { categories } = useServiceCategories();
  const { subServices } = useSubServices(
    filters.mainCategory !== 'all' ? filters.mainCategory : null
  );

  const getMainCategoryLabel = (id) => {
    if (id === 'all') return null;
    return categories.find((c) => String(c.id) === String(id))?.name || 'دسته';
  };

  const getSubCategoryLabel = (mainId, subId) => {
    if (subId === 'all') return null;
    return subServices.find((s) => String(s.id) === String(subId))?.name || 'زیردسته';
  };

  const hasAnyFilter =
    filters.mainCategory !== 'all' ||
    filters.subCategory !== 'all' ||
    (filters.source && filters.source !== 'all');

  if (!hasAnyFilter) return null;

  return (
    <div className="px-4 py-2">
      <div className="flex flex-wrap gap-2">
        {/* ✅ فیلتر دسته اصلی */}
        {filters.mainCategory !== 'all' && (
          <Chip
            label={getMainCategoryLabel(filters.mainCategory)}
            selected
            onRemove={() => onChange({ ...filters, mainCategory: 'all', subCategory: 'all' })}
          />
        )}

        {/* ✅ فیلتر زیردسته */}
        {filters.subCategory !== 'all' && filters.mainCategory !== 'all' && (
          <Chip
            label={getSubCategoryLabel(filters.mainCategory, filters.subCategory)}
            selected
            onRemove={() => onChange({ ...filters, subCategory: 'all' })}
          />
        )}

        {/* ✅ فیلتر منبع */}
        {filters.source && filters.source !== 'all' && (
          <Chip
            label={filters.source === 'business' ? 'کسب‌وکارها' : 'کاربران'}
            color="#FF9800"
            onRemove={() => onChange({ ...filters, source: 'all' })}
          />
        )}

        {/* ❌ چیپ‌های استان/شهر حذف شدند — مکان سراسری در هدر مدیریت می‌شود */}
      </div>
    </div>
  );
}
