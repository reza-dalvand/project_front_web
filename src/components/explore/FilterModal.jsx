// src/components/explore/FilterModal.jsx
'use client';
import { useState, useEffect, useMemo } from 'react';
import { FiFilter, FiMapPin, FiGrid, FiCheck, FiTrash2 } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import BottomSheet from '@/components/common/BottomSheet';
import Dropdown from '@/components/common/Dropdown';
import Button from '@/components/common/Button';
import Chip from '@/components/common/Chip';
import Divider from '@/components/common/Divider';
import { SOURCE_FILTERS } from '@/constants/exploreFilters';
import { useProvinces, useCities } from '@/hooks/useLocationOptions';
import { useBusinessCategories, useServiceCategories } from '@/hooks/useCategoryOptions';

export default function FilterModal({ visible, onClose, onApply, currentFilters }) {
  const { colors } = useTheme();
  const [province, setProvince] = useState(null);
  const [city, setCity] = useState(null);
  const [businessType, setBusinessType] = useState(null);
  const [mainCategory, setMainCategory] = useState('all');
  const [subCategory, setSubCategory] = useState('all');
  const [source, setSource] = useState('all');

  // ✅ دریافت داده‌ها از بک‌اند
  const { provinces } = useProvinces();
  const { cities } = useCities(province);
  const { categories: businessTypes } = useBusinessCategories();
  const { categories: serviceCategories } = useServiceCategories();

  useEffect(() => {
    if (visible && currentFilters) {
      setProvince(currentFilters.province);
      setCity(currentFilters.city);
      setBusinessType(currentFilters.businessType);
      setMainCategory(currentFilters.mainCategory || 'all');
      setSubCategory(currentFilters.subCategory || 'all');
      setSource(currentFilters.source || 'all');
    }
  }, [visible, currentFilters]);

  // ✅ زیردسته‌ها بر اساس دسته انتخاب‌شده (از بک‌اند)
  const availableSubCategories = useMemo(() => {
    if (mainCategory === 'all') return [];
    const cat = serviceCategories.find((c) => c.id === mainCategory);
    return cat?.subServices || [];
  }, [mainCategory, serviceCategories]);

  const handleMainCategoryChange = (value) => {
    setMainCategory(value);
    setSubCategory('all');
  };

  const handleApply = () => {
    onApply({ province, city, businessType, mainCategory, subCategory, source });
    onClose();
  };

  const handleClear = () => {
    setProvince(null);
    setCity(null);
    setBusinessType(null);
    setMainCategory('all');
    setSubCategory('all');
    setSource('all');
    onApply({
      province: null,
      city: null,
      businessType: null,
      mainCategory: 'all',
      subCategory: 'all',
      source: 'all',
    });
    onClose();
  };

  // ساخت گزینه‌های دسته‌بندی اصلی
  const mainCategoryOptions = [
    { id: 'all', label: 'همه دسته‌ها' },
    ...serviceCategories.map((c) => ({ id: c.id, label: c.label })),
  ];

  return (
    <BottomSheet
      visible={visible}
      onClose={onClose}
      title="فیلتر ویترین"
      snapPoint={0.8}
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
        {/* بخش ۱: منبع پست */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: '#9C27B018' }}
            >
              <FiFilter size={16} color="#9C27B0" />
            </div>
            <span className="text-sm font-bold" style={{ color: colors.textMain }}>
              نوع محتوا
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {SOURCE_FILTERS.map((sf) => (
              <Chip
                key={sf.id}
                label={sf.label}
                selected={source === sf.id}
                onPress={() => setSource(sf.id)}
              />
            ))}
          </div>
        </div>

        <Divider />

        {/* بخش ۲: دسته‌بندی خدمات */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: '#FF980018' }}
            >
              <FiGrid size={16} color="#FF9800" />
            </div>
            <span className="text-sm font-bold" style={{ color: colors.textMain }}>
              دسته‌بندی خدمات
            </span>
          </div>
          <Dropdown
            label="دسته‌بندی کلی"
            placeholder="انتخاب دسته‌بندی"
            value={mainCategory}
            options={mainCategoryOptions}
            onSelect={handleMainCategoryChange}
          />
          <Dropdown
            label="نوع خدمت"
            placeholder={mainCategory === 'all' ? 'ابتدا دسته‌بندی کلی را انتخاب کنید' : 'همه'}
            value={subCategory}
            options={availableSubCategories.map((c) => ({ id: c.id, label: c.label }))}
            onSelect={setSubCategory}
            disabled={mainCategory === 'all'}
          />
        </div>

        <Divider />

        {/* بخش ۳: موقعیت مکانی */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: '#2196F318' }}
            >
              <FiMapPin size={16} color="#2196F3" />
            </div>
            <span className="text-sm font-bold" style={{ color: colors.textMain }}>
              موقعیت مکانی
            </span>
          </div>
          <Dropdown
            label="استان"
            placeholder="انتخاب استان"
            value={province}
            options={provinces}
            onSelect={(val) => {
              setProvince(val);
              setCity(null);
            }}
          />
          <Dropdown
            label="شهر"
            placeholder={province ? 'انتخاب شهر' : 'ابتدا استان را انتخاب کنید'}
            value={city}
            options={cities}
            onSelect={setCity}
            disabled={!province}
          />
        </div>

        <Divider />

        {/* بخش ۴: نوع کسب‌وکار */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: '#9C27B018' }}
            >
              <FiFilter size={16} color="#9C27B0" />
            </div>
            <span className="text-sm font-bold" style={{ color: colors.textMain }}>
              نوع کسب‌وکار
            </span>
          </div>
          <Dropdown
            label="نوع کسب‌وکار"
            placeholder="انتخاب نوع کسب‌وکار"
            value={businessType}
            options={businessTypes}
            onSelect={setBusinessType}
          />
        </div>
      </div>
    </BottomSheet>
  );
}
