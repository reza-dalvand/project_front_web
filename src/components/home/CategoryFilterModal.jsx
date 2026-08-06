'use client';
import { useState, useEffect, useMemo } from 'react';
import { FiX, FiCheck, FiTrash2, FiStar, FiTrendingUp, FiTag, FiGrid } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import BottomSheet from '@/components/common/BottomSheet';
import Button from '@/components/common/Button';
import { getSubServicesForCategory, SORT_OPTIONS } from '@/constants/categorySubServices';

const SORT_ICONS = {
  all: FiGrid,
  top_rated: FiStar,
  most_booked: FiTrendingUp,
  highest_discount: FiTag,
};

export default function CategoryFilterModal({
  visible,
  onClose,
  onApply,
  currentFilters,
  categoryId,
}) {
  const { colors } = useTheme();
  const [serviceType, setServiceType] = useState(null);
  const [sortBy, setSortBy] = useState('all');

  // زیرخدمات مربوط به این دسته
  const subServices = useMemo(() => {
    const subs = getSubServicesForCategory(categoryId);
    return [{ id: 'all', label: 'همه خدمات' }, ...subs];
  }, [categoryId]);

  useEffect(() => {
    if (visible && currentFilters) {
      setServiceType(currentFilters.serviceType || null);
      setSortBy(currentFilters.sortBy || 'all');
    }
  }, [visible, currentFilters]);

  const handleApply = () => {
    onApply({ serviceType, sortBy });
    onClose();
  };

  const handleClear = () => {
    setServiceType(null);
    setSortBy('all');
    onApply({ serviceType: null, sortBy: 'all' });
    onClose();
  };

  const activeCount = (serviceType && serviceType !== 'all' ? 1 : 0) + (sortBy !== 'all' ? 1 : 0);

  return (
    <BottomSheet visible={visible} onClose={onClose} title="فیلتر و مرتب‌سازی" snapPoint={0.75}>
      <div className="flex flex-col gap-6 pb-4">
        {/* ═══════ بخش ۱: نوع خدمت (Dropdown ساده) ═══════ */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-[10px] flex items-center justify-center"
              style={{ backgroundColor: '#FF980018' }}
            >
              <FiGrid size={16} color="#FF9800" />
            </div>
            <span className="text-sm font-[Vazir-Bold]" style={{ color: colors.textMain }}>
              نوع خدمت
            </span>
          </div>

          {/* لیست زیرخدمات به صورت Chip */}
          <div className="flex flex-wrap gap-2">
            {subServices.map((sub) => {
              const isSelected = serviceType === sub.id;
              return (
                <button
                  key={sub.id}
                  onClick={() => setServiceType(sub.id === 'all' ? null : sub.id)}
                  className="px-4 py-2.5 rounded-[14px] border-[1.5px] text-[13px] font-[Vazir-Medium] transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                  style={{
                    backgroundColor: isSelected ? colors.primary + '15' : colors.cardBackground,
                    borderColor: isSelected ? colors.primary : colors.border,
                    color: isSelected ? colors.primary : colors.textMain,
                  }}
                >
                  {sub.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* خط جداکننده */}
        <div className="h-px" style={{ backgroundColor: colors.border }} />

        {/* ═══════ بخش ۲: مرتب‌سازی ═══════ */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-[10px] flex items-center justify-center"
              style={{ backgroundColor: '#2196F318' }}
            >
              <FiTrendingUp size={16} color="#2196F3" />
            </div>
            <span className="text-sm font-[Vazir-Bold]" style={{ color: colors.textMain }}>
              مرتب‌سازی بر اساس
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {SORT_OPTIONS.map((option) => {
              const isSelected = sortBy === option.id;
              const IconComponent = SORT_ICONS[option.id] || FiGrid;
              return (
                <button
                  key={option.id}
                  onClick={() => setSortBy(option.id)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-[14px] border-[1.5px] text-[13px] font-[Vazir-Medium] transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                  style={{
                    backgroundColor: isSelected ? colors.primary + '15' : colors.cardBackground,
                    borderColor: isSelected ? colors.primary : colors.border,
                    color: isSelected ? colors.primary : colors.textMain,
                  }}
                >
                  <IconComponent
                    size={14}
                    color={isSelected ? colors.primary : colors.textSecondary}
                  />
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* خط جداکننده */}
        <div className="h-px" style={{ backgroundColor: colors.border }} />

        {/* ═══════ شمارنده فیلترهای فعال ═══════ */}
        {activeCount > 0 && (
          <div
            className="flex items-center gap-2 px-4 py-3 rounded-[14px] border"
            style={{
              backgroundColor: colors.primary + '08',
              borderColor: colors.primary + '30',
            }}
          >
            <FiCheck size={14} style={{ color: colors.primary }} />
            <span className="text-xs font-[Vazir-Bold] flex-1" style={{ color: colors.primary }}>
              {activeCount === 1 ? '۱ فیلتر فعال' : `${activeCount} فیلتر فعال`}
            </span>
          </div>
        )}

        {/* ═══════ دکمه‌ها ═══════ */}
        <div className="flex gap-3">
          <Button
            title="حذف همه"
            onPress={handleClear}
            variant="outline"
            size="lg"
            className="flex-1"
            icon={<FiTrash2 size={16} style={{ color: colors.primary }} />}
            iconPosition="right"
          />
          <Button
            title="اعمال فیلتر"
            onPress={handleApply}
            variant="primary"
            size="lg"
            className="flex-1"
            icon={<FiCheck size={16} color="#fff" />}
            iconPosition="right"
          />
        </div>
      </div>
    </BottomSheet>
  );
}
