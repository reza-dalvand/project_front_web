'use client';
import { useState, useEffect } from 'react';
import { FiMapPin, FiInfo, FiCheck, FiTrash2 } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import BottomSheet from '@/components/common/BottomSheet';
import Dropdown from '@/components/common/Dropdown';
import Button from '@/components/common/Button';
import { PROVINCES, CITIES } from '@/constants/exploreFilters';

export default function HomeFilterModal({ visible, onClose, onApply, currentFilters }) {
  const { colors } = useTheme();
  const [province, setProvince] = useState(null);
  const [city, setCity] = useState(null);

  useEffect(() => {
    if (visible && currentFilters) {
      setProvince(currentFilters.province || null);
      setCity(currentFilters.city || null);
    }
  }, [visible, currentFilters]);

  const handleApply = () => {
    onApply({ province, city });
    onClose();
  };

  const handleClear = () => {
    setProvince(null);
    setCity(null);
    onApply({});
    onClose();
  };

  const hasActiveFilter = province || city;

  return (
    <BottomSheet visible={visible} onClose={onClose} title="فیلتر موقعیت مکانی" snapPoint={0.8}>
      <div className="space-y-5 pb-5">
        {/* راهنما */}
        <div
          className="flex items-start gap-2.5 p-3 rounded-xl border"
          style={{
            backgroundColor: '#2196F30A',
            borderColor: '#2196F325',
          }}
        >
          <FiInfo size={16} color="#2196F3" className="flex-shrink-0 mt-0.5" />
          <p
            className="text-xs font-[Vazir] flex-1 leading-[19px]"
            style={{ color: colors.textSecondary }}
          >
            استان و شهر موردنظر خود را انتخاب کنید تا فقط کسب‌وکارهای آن منطقه نمایش داده شود
          </p>
        </div>

        {/* استان */}
        <Dropdown
          label="استان"
          placeholder="انتخاب استان"
          value={province}
          options={PROVINCES}
          onSelect={(val) => {
            setProvince(val);
            setCity(null);
          }}
        />

        {/* شهر */}
        <Dropdown
          label="شهر"
          placeholder={province ? 'انتخاب شهر' : 'ابتدا استان را انتخاب کنید'}
          value={city}
          options={province ? CITIES[province] || [] : []}
          onSelect={setCity}
          disabled={!province}
        />

        {/* دکمه‌ها */}
        <div className="flex gap-3 pt-2">
          <Button
            title="حذف فیلترها"
            onPress={handleClear}
            variant="outline"
            size="lg"
            className="flex-1"
            icon={<FiTrash2 size={16} />}
          />
          <Button
            title="اعمال فیلتر"
            onPress={handleApply}
            variant="primary"
            size="lg"
            className="flex-1"
            // icon={<FiCheck size={16} color="#fff" />}
            iconPosition="right"
          />
        </div>
      </div>
    </BottomSheet>
  );
}
