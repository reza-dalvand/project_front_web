// src/components/home/HomeFilterModal.jsx
'use client';

import { useState, useEffect } from 'react';
import { FiCheck, FiTrash2, FiNavigation } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import BottomSheet from '@/components/common/BottomSheet';
import Dropdown from '@/components/common/Dropdown';
import Button from '@/components/common/Button';
import { useProvinces, useCities } from '@/hooks/useLocationOptions';
import { useGlobalLocationStore } from '@/stores/useGlobalLocationStore';

export default function HomeFilterModal({ visible, onClose }) {
  const { colors } = useTheme();
  const { provinces } = useProvinces();
  const { provinceId, cityId, setLocation } = useGlobalLocationStore();

  const gpsEnabled = useGlobalLocationStore((s) => s.gpsEnabled);

  const { cities } = useCities(provinceId);

  const [localProvince, setLocalProvince] = useState(provinceId);
  const [localCity, setLocalCity] = useState(cityId);

  useEffect(() => {
    if (visible) {
      setLocalProvince(provinceId);
      setLocalCity(cityId);
    }
  }, [visible, provinceId, cityId]);

  const handleApply = () => {
    setLocation(localProvince, localCity);
    onClose();
  };

  const handleClear = () => {
    setLocalProvince(null);
    setLocalCity(null);
    setLocation(null, null);
    onClose();
  };

  return (
    <BottomSheet visible={visible} onClose={onClose} title="فیلتر موقعیت مکانی" snapPoint={0.55}>
      <div className="space-y-4 sm:space-y-5 md:space-y-6 pb-4 md:pb-6">
        {/* ═══ پیام هشدار وقتی GPS فعال است ═══ */}
        {gpsEnabled && (
          <div
            className="flex items-start gap-2.5 sm:gap-3 md:gap-4 p-3.5 sm:p-4 md:p-5 rounded-xl sm:rounded-2xl border"
            style={{
              backgroundColor: '#2196F308',
              borderColor: '#2196F330',
            }}
          >
            <div
              className="w-9 h-9 sm:w-10 sm:h-10 md:w-11 md:h-11 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: '#2196F315' }}
            >
              <FiNavigation size={18} className="sm:w-5 sm:h-5" color="#2196F3" />
            </div>
            <div className="flex-1">
              <p className="text-[13px] sm:text-sm md:text-[15px] font-[Vazir-Bold] mb-0.5 sm:mb-1" style={{ color: '#2196F3' }}>
                فیلتر موقعیت مکانی فعال است
              </p>
              <p className="text-[11px] sm:text-xs md:text-[13px] font-[Vazir] leading-5 md:leading-6" style={{ color: colors.textSecondary }}>
                تا وقتی این فیلتر فعاله نمیشه استان و شهر رو انتخاب کرد
              </p>
            </div>
          </div>
        )}

        {/* ═══ استان و شهر ═══ */}
        <div className={gpsEnabled ? 'opacity-40 pointer-events-none' : ''}>
          <Dropdown
            label="استان"
            placeholder="انتخاب استان"
            value={localProvince}
            options={provinces}
            onSelect={(val) => {
              setLocalProvince(val);
              setLocalCity(null);
            }}
            disabled={gpsEnabled}
          />

          <Dropdown
            label="شهر"
            placeholder={localProvince ? 'انتخاب شهر' : 'ابتدا استان را انتخاب کنید'}
            value={localCity}
            options={cities}
            onSelect={setLocalCity}
            disabled={gpsEnabled || !localProvince}
          />
        </div>

        {/* ═══ دکمه‌ها ═══ */}
        <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 md:gap-4">
          <Button
            title="حذف فیلتر"
            onPress={handleClear}
            variant="outline"
            size="lg"
            className="flex-1"
            icon={<FiTrash2 size={16} />}
            disabled={gpsEnabled}
          />
          <Button
            title="اعمال فیلتر"
            onPress={handleApply}
            variant="primary"
            size="lg"
            className="flex-1"
            icon={<FiCheck size={16} color="#fff" />}
            iconPosition="right"
            disabled={gpsEnabled}
          />
        </div>
      </div>
    </BottomSheet>
  );
}