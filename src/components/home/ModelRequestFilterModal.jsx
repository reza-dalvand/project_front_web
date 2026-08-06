// src/components/home/ModelRequestFilterModal.jsx
'use client';
import { useState, useEffect } from 'react';
import { FiGrid, FiGift, FiBox, FiDollarSign, FiStar, FiCheck, FiTrash2 } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import BottomSheet from '@/components/common/BottomSheet';
import Button from '@/components/common/Button';
import Chip from '@/components/common/Chip';
import Divider from '@/components/common/Divider';
import Dropdown from '@/components/common/Dropdown';
import { SERVICE_TYPES } from '@/constants/serviceTypes';

// ═══════════ گزینه‌های نوع هزینه ═══════════
const COST_FILTER_OPTIONS = [
  { id: 'all', label: 'همه', icon: FiGrid, color: '#607D8B' },
  { id: 'free', label: 'رایگان', icon: FiGift, color: '#4CAF50' },
  { id: 'material_cost', label: 'هزینه مواد', icon: FiBox, color: '#FF9800' },
  { id: 'paid', label: 'با هزینه', icon: FiDollarSign, color: '#2196F3' },
];

// ═══════════ گزینه‌های نوع خدمت (برای Dropdown) ═══════════
const SERVICE_FILTER_OPTIONS = [
  { id: 'all', label: 'همه خدمات' },
  ...SERVICE_TYPES.filter((s) => s.id !== 'other'),
];

/**
 * مدال فیلتر فرصت‌های مدلینگ
 * معادل ModelRequestFilterModal اندروید
 *
 * @param {boolean}  visible        - وضعیت نمایش
 * @param {function} onClose        - بستن مدال
 * @param {function} onApply        - اعمال فیلترها
 * @param {object}   currentFilters - فیلترهای فعلی { costType, serviceType }
 */
export default function ModelRequestFilterModal({ visible, onClose, onApply, currentFilters }) {
  const { colors } = useTheme();
  const [costType, setCostType] = useState('all');
  const [serviceType, setServiceType] = useState('all');

  // ═══════ همگام‌سازی با فیلترهای فعلی هنگام باز شدن ═══════
  useEffect(() => {
    if (visible && currentFilters) {
      setCostType(currentFilters.costType || 'all');
      setServiceType(currentFilters.serviceType || 'all');
    }
  }, [visible, currentFilters]);

  // ═══════ اعمال فیلترها ═══════
  const handleApply = () => {
    onApply({ costType, serviceType });
    onClose();
  };

  // ═══════ حذف همه فیلترها ═══════
  const handleClear = () => {
    setCostType('all');
    setServiceType('all');
    onApply({ costType: 'all', serviceType: 'all' });
    onClose();
  };

  // تعداد فیلترهای فعال
  const activeCount = (costType !== 'all' ? 1 : 0) + (serviceType !== 'all' ? 1 : 0);

  return (
    <BottomSheet
      visible={visible}
      onClose={onClose}
      title="فیلتر فرصت‌های مدلینگ"
      snapPoint={0.7}
      footer={
        <div className="flex gap-3">
          <Button
            title="حذف همه"
            onPress={handleClear}
            variant="outline"
            size="lg"
            icon={<FiTrash2 size={16} />}
            className="flex-1"
          />
          <Button
            title="اعمال فیلتر"
            onPress={handleApply}
            variant="primary"
            size="lg"
            icon={<FiCheck size={16} color="#fff" />}
            className="flex-1"
          />
        </div>
      }
    >
      <div className="space-y-6 pb-5">
        {/* ═══════ بخش ۱: نوع هزینه ═══════ */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: '#4CAF5018' }}
            >
              <FiDollarSign size={16} color="#4CAF50" />
            </div>
            <div className="flex-1">
              <span className="text-sm font-[Vazir-Bold] block" style={{ color: colors.textMain }}>
                نوع هزینه
              </span>
              <span className="text-[11px] font-[Vazir]" style={{ color: colors.textSecondary }}>
                مشخص کنید چه نوع فرصت‌هایی را می‌خواهید ببینید
              </span>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {COST_FILTER_OPTIONS.map((option) => {
              const Icon = option.icon;
              const isSelected = costType === option.id;
              return (
                <Chip
                  key={option.id}
                  label={option.label}
                  selected={isSelected}
                  icon={
                    <Icon
                      size={14}
                      style={{
                        color: isSelected ? option.color : colors.textSecondary,
                      }}
                    />
                  }
                  onPress={() => setCostType(option.id)}
                />
              );
            })}
          </div>
        </div>

        <Divider spacing={16} />

        {/* ═══════ بخش ۲: نوع خدمت ═══════ */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: '#E91E6318' }}
            >
              <FiStar size={16} color="#E91E63" />
            </div>
            <div className="flex-1">
              <span className="text-sm font-[Vazir-Bold] block" style={{ color: colors.textMain }}>
                نوع خدمت
              </span>
            </div>
          </div>
          <Dropdown
            label="دسته‌بندی خدمت"
            placeholder="انتخاب نوع خدمت"
            value={serviceType}
            options={SERVICE_FILTER_OPTIONS}
            onSelect={(val) => setServiceType(val)}
          />
        </div>

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
              {activeCount === 1 ? '۱ فیلتر فعال' : '۲ فیلتر فعال'}
            </span>
          </div>
        )}
      </div>
    </BottomSheet>
  );
}
