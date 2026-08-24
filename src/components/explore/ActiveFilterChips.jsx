// src/components/explore/ActiveFilterChips.jsx
'use client';
import { useTheme } from '@/stores/useThemeStore';
import Chip from '@/components/common/Chip';
import { SOURCE_FILTERS } from '@/constants/exploreFilters';
import { useProvinces, useCities } from '@/hooks/useLocationOptions';
import { useBusinessCategories, useServiceCategories } from '@/hooks/useCategoryOptions';

export default function ActiveFilterChips({ filters, onChange }) {
  const { colors } = useTheme();
  const { provinces } = useProvinces();
  const { cities } = useCities(filters.province);
  const { categories: businessTypes } = useBusinessCategories();
  const { categories: serviceCategories } = useServiceCategories();

  const hasActive =
    filters.province ||
    filters.city ||
    filters.businessType ||
    filters.mainCategory !== 'all' ||
    filters.subCategory !== 'all' ||
    filters.source !== 'all';

  if (!hasActive) return null;

  const getSourceLabel = (sourceId) => SOURCE_FILTERS.find((s) => s.id === sourceId)?.label;

  const getMainCategoryLabel = (categoryId) =>
    serviceCategories.find((c) => c.id === categoryId)?.label;

  const getSubCategoryLabel = (mainCat, subCat) => {
    const cat = serviceCategories.find((c) => c.id === mainCat);
    return cat?.subServices?.find((s) => s.id === subCat)?.label;
  };

  return (
    <div
      className="py-2.5 border-b overflow-x-auto"
      style={{
        borderBottomColor: colors.border,
        backgroundColor: colors.background,
      }}
    >
      <div className="flex gap-2 px-4 whitespace-nowrap">
        {/* فیلتر منبع */}
        {filters.source !== 'all' && (
          <Chip
            label={getSourceLabel(filters.source)}
            selected
            onRemove={() => onChange({ ...filters, source: 'all' })}
          />
        )}

        {/* فیلتر دسته‌بندی کلی */}
        {filters.mainCategory !== 'all' && (
          <Chip
            label={getMainCategoryLabel(filters.mainCategory)}
            selected
            onRemove={() => onChange({ ...filters, mainCategory: 'all', subCategory: 'all' })}
          />
        )}

        {/* فیلتر زیردسته */}
        {filters.subCategory !== 'all' && filters.mainCategory !== 'all' && (
          <Chip
            label={getSubCategoryLabel(filters.mainCategory, filters.subCategory)}
            selected
            onRemove={() => onChange({ ...filters, subCategory: 'all' })}
          />
        )}

        {/* فیلتر استان */}
        {filters.province && (
          <Chip
            label={provinces.find((p) => p.id === filters.province)?.label}
            selected
            onRemove={() => onChange({ ...filters, province: null, city: null })}
          />
        )}

        {/* فیلتر شهر */}
        {filters.city && (
          <Chip
            label={cities.find((c) => c.id === filters.city)?.label}
            selected
            onRemove={() => onChange({ ...filters, city: null })}
          />
        )}

        {/* فیلتر نوع کسب‌وکار */}
        {filters.businessType && (
          <Chip
            label={businessTypes.find((t) => t.id === filters.businessType)?.label}
            selected
            onRemove={() => onChange({ ...filters, businessType: null })}
          />
        )}
      </div>
    </div>
  );
}
