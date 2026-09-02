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
  const {
    provinceId,
    cityId,
    setLocation,
  } = useGlobalLocationStore();

  // ✅ خواندن وضعیت GPS از استور گلوبال
  const gpsEnabled = useGlobalLocationStore((s) => s.gpsEnabled);

  const { cities } = useCities(provinceId);

  // ─── State محلی برای فرم ───
  const [localProvince, setLocalProvince] = useState(provinceId);
  const [localCity, setLocalCity] = useState(cityId);

  useEffect(() => {
    if (visible) {
      setLocalProvince(provinceId);
      setLocalCity(cityId);
    }
  }, [visible, provinceId, cityId]);

  // ─── اعمال فیلتر ───
  const handleApply = () => {
    setLocation(localProvince, localCity);
    onClose();
  };

  // ─── پاک کردن فیلتر ───
  const handleClear = () => {
    setLocalProvince(null);
    setLocalCity(null);
    setLocation(null, null);
    onClose();
  };

  return (
    <BottomSheet visible={visible} onClose={onClose} title="فیلتر موقعیت مکانی" snapPoint={0.55}>
      <div className="space-y-5 pb-4">

        {/* ═══ پیام هشدار وقتی GPS فعال است ═══ */}
        {gpsEnabled && (
          <div
            className="flex items-start gap-3 p-4 rounded-2xl border"
            style={{
              backgroundColor: '#2196F308',
              borderColor: '#2196F330',
            }}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: '#2196F315' }}
            >
              <FiNavigation size={20} color="#2196F3" />
            </div>
            <div className="flex-1">
              <p
                className="text-sm font-[Vazir-Bold] mb-1"
                style={{ color: '#2196F3' }}
              >
                فیلتر موقعیت مکانی فعال است
              </p>
              <p
                className="text-xs font-[Vazir] leading-5"
                style={{ color: colors.textSecondary }}
              >
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
        <div className="flex gap-3">
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