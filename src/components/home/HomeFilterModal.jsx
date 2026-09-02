// src/components/home/HomeFilterModal.jsx
'use client';
import { useState, useEffect } from 'react';
import { FiMapPin, FiNavigation, FiCheck, FiTrash2 } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import BottomSheet from '@/components/common/BottomSheet';
import Dropdown from '@/components/common/Dropdown';
import Button from '@/components/common/Button';
import { useProvinces, useCities } from '@/hooks/useLocationOptions';
import { useGlobalLocationStore, LOCATION_TYPES } from '@/stores/useGlobalLocationStore';
import { getCurrentLocation } from '@/utils/geo-utils';
import { useToast } from '@/hooks/useToast';

export default function HomeFilterModal({ visible, onClose }) {
  const { colors } = useTheme();
  const { showToast } = useToast();
  const { provinces } = useProvinces();

  const {
    locationType,
    provinceId,
    cityId,
    gpsEnabled,
    gpsLoading,
    setLocation,
    enableGps,
    disableGps,
    handleGpsError,
    setGpsLoading,
  } = useGlobalLocationStore();

  const { cities } = useCities(provinceId);

  // ─── State محلی برای فرم ───
  const [localProvince, setLocalProvince] = useState(provinceId);
  const [localCity, setLocalCity] = useState(cityId);
  const [localGpsEnabled, setLocalGpsEnabled] = useState(gpsEnabled);
  const latitude = useGlobalLocationStore((s) => s.latitude);
  const longitude = useGlobalLocationStore((s) => s.longitude);

  useEffect(() => {
    if (visible) {
      setLocalProvince(provinceId);
      setLocalCity(cityId);
      setLocalGpsEnabled(gpsEnabled);
    }
  }, [visible, provinceId, cityId, gpsEnabled, locationType, latitude, longitude]);

  const gpsIsActive = localGpsEnabled || locationType === LOCATION_TYPES.GPS;

  // ─── فعال‌سازی GPS ───
  const handleGpsToggle = async () => {
    if (gpsIsActive) {
      // غیرفعال‌سازی
      setLocalGpsEnabled(false);
      disableGps();
      showToast('فیلتر موقعیت مکانی غیرفعال شد', 'info');
      return;
    }

    setGpsLoading(true);
    try {
      const loc = await getCurrentLocation();
      enableGps(loc.latitude, loc.longitude);
      setLocalGpsEnabled(true);
      showToast('موقعیت مکانی شما فعال شد', 'success');
    } catch (err) {
      handleGpsError();
      if (err.code === 1) {
        showToast('دسترسی به موقعیت رد شد. از تنظیمات اجازه دهید.', 'error');
      } else if (err.code === 2) {
        showToast('GPS در دسترس نیست. روشن کنید.', 'warning');
      } else {
        showToast('خطا در دریافت موقعیت', 'error');
      }
    } finally {
      setGpsLoading(false);
    }
  };

  // ─── اعمال فیلتر ───
  const handleApply = () => {
    if (localGpsEnabled) {
      // GPS فعال است → استان/شهر نادیده گرفته شود
      onClose();
      return;
    }
    setLocation(localProvince, localCity);
    onClose();
  };

  // ─── پاک کردن فیلتر ───
  const handleClear = () => {
    setLocalProvince(null);
    setLocalCity(null);
    setLocalGpsEnabled(false);
    setLocation(null, null);
    if (gpsEnabled) disableGps();
    onClose();
  };

  return (
    <BottomSheet visible={visible} onClose={onClose} title="فیلتر موقعیت مکانی" snapPoint={0.65}>
      <div className="space-y-5 pb-4">
        {/* ═══ سوئیچ GPS ═══ */}
        <div
          className="flex items-center gap-3 p-4 rounded-2xl border"
          style={{
            backgroundColor: gpsIsActive ? '#2196F308' : colors.cardBackground,
            borderColor: gpsIsActive ? '#2196F3' : colors.border,
          }}
        >
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: '#2196F315' }}
          >
            {gpsLoading ? (
              <div
                className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"
                style={{ color: '#2196F3' }}
              />
            ) : (
              <FiNavigation size={22} color="#2196F3" />
            )}
          </div>
          <div className="flex-1">
            <span className="text-sm font-[Vazir-Bold] block" style={{ color: colors.textMain }}>
              موقعیت مکانی من (GPS)
            </span>
            <span className="text-xs" style={{ color: colors.textSecondary }}>
              {gpsIsActive
                ? 'فعال — نزدیک‌ترین‌ها نمایش داده می‌شوند'
                : 'بر اساس موقعیت فعلی شما'}
            </span>
          </div>
          {/* سوئیچ */}
          <button
            onClick={handleGpsToggle}
            disabled={gpsLoading}
            className="relative w-12 h-7 rounded-full transition-colors flex-shrink-0"
            style={{ backgroundColor: gpsIsActive ? '#2196F3' : colors.border }}
          >
            <div
              className="absolute top-0.5 w-6 h-6 rounded-full shadow-md transition-all"
              style={{
                backgroundColor: '#fff',
                [gpsIsActive ? 'right' : 'left']: '2px',
              }}
            />
          </button>
        </div>

        {/* ═══ پیام اولویت GPS ═══ */}
        {gpsIsActive && (
          <div
            className="flex items-start gap-2 p-3 rounded-xl border"
            style={{ backgroundColor: '#FF980008', borderColor: '#FF980030' }}
          >
            <span className="text-sm flex-shrink-0">💡</span>
            <p className="text-xs leading-5" style={{ color: colors.textSecondary }}>
              فیلتر موقعیت مکانی فعال است. فیلتر استان/شهر موقتاً غیرفعال شده و پس از
              غیرفعال‌سازی GPS، آخرین انتخاب شما بازیابی می‌شود.
            </p>
          </div>
        )}

        {/* ═══ استان و شهر ═══ */}
        <div className={gpsIsActive ? 'opacity-40 pointer-events-none' : ''}>
          <Dropdown
            label="استان"
            placeholder="انتخاب استان"
            value={localProvince}
            options={provinces}
            onSelect={(val) => {
              setLocalProvince(val);
              setLocalCity(null);
            }}
            disabled={gpsIsActive}
          />
          <Dropdown
            label="شهر"
            placeholder={localProvince ? 'انتخاب شهر' : 'ابتدا استان را انتخاب کنید'}
            value={localCity}
            options={cities}
            onSelect={setLocalCity}
            disabled={gpsIsActive || !localProvince}
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