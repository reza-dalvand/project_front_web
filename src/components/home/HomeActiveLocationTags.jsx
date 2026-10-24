'use client';

import { useCallback, useEffect, useState } from 'react';
import { FiMapPin, FiNavigation, FiX } from 'react-icons/fi';
import { LOCATION_TYPES, useGlobalLocationStore } from '@/stores/useGlobalLocationStore';
import { locationsService } from '@/api';

const provinceCache = new Map();
const cityCache = new Map();

let provincesPromise = null;
const citiesPromises = new Map();

function normalizeId(value) {
  return value == null ? null : String(value);
}

async function fetchProvincesOnce() {
  if (provincesPromise) return provincesPromise;

  provincesPromise = locationsService
    .getProvinces()
    .then((res) => {
      const list = (res?.data || [])
        .map((item) => ({
          id: normalizeId(item.id),
          label: item.name || item.label || '',
        }))
        .filter((item) => item.id && item.label);

      list.forEach((item) => {
        provinceCache.set(item.id, item.label);
      });

      return list;
    })
    .finally(() => {
      provincesPromise = null;
    });

  return provincesPromise;
}

async function fetchCitiesOnce(provinceId) {
  const pid = normalizeId(provinceId);

  if (!pid) return new Map();

  if (citiesPromises.has(pid)) {
    return citiesPromises.get(pid);
  }

  const promise = locationsService
    .getCities(pid)
    .then((res) => {
      const map = new Map();

      (res?.data || []).forEach((item) => {
        const id = normalizeId(item.id);
        const label = item.name || item.label || '';

        if (id && label) {
          map.set(id, label);
        }
      });

      cityCache.set(pid, map);
      return map;
    })
    .finally(() => {
      citiesPromises.delete(pid);
    });

  citiesPromises.set(pid, promise);

  return promise;
}

function LocationTag({
  icon,
  label,
  loading = false,
  removable = true,
  onRemove,
  removeLabel,
}) {
  return (
    <div
      dir="rtl"
      className="inline-flex max-w-[220px] items-center gap-1.5 rounded-full border border-white/25 bg-white/15 px-3 py-1.5 text-white shadow-sm backdrop-blur-sm"
    >
      <span className="flex-shrink-0 opacity-90">{icon}</span>

      <span
        className={`min-w-0 font-vazir-medium text-[12px] leading-none truncate ${
          loading ? 'animate-pulse' : ''
        }`}
      >
        {label}
      </span>

      {removable && (
        <button
          type="button"
          onClick={onRemove}
          aria-label={removeLabel}
          className="mr-0.5 grid h-5 w-5 flex-shrink-0 place-items-center rounded-full bg-white/20 transition hover:bg-white/30 active:scale-90"
        >
          <FiX size={12} color="#fff" />
        </button>
      )}
    </div>
  );
}

export default function HomeActiveLocationTags() {
  const locationType = useGlobalLocationStore((s) => s.locationType);
  const gpsEnabled = useGlobalLocationStore((s) => s.gpsEnabled);
  const gpsLoading = useGlobalLocationStore((s) => s.gpsLoading);
  const provinceId = useGlobalLocationStore((s) => s.provinceId);
  const cityId = useGlobalLocationStore((s) => s.cityId);

  const [provinceLabel, setProvinceLabel] = useState('');
  const [cityLabel, setCityLabel] = useState('');

  const showGps = locationType === LOCATION_TYPES.GPS && gpsEnabled;
  const showGpsLoading = gpsLoading && !showGps;
  const showProvinceCity = locationType === LOCATION_TYPES.PROVINCE_CITY && Boolean(provinceId);
  const showCity = showProvinceCity && Boolean(cityId);

  useEffect(() => {
    if (!showProvinceCity) {
      setProvinceLabel('');
      return;
    }

    let active = true;
    const pid = normalizeId(provinceId);
    const cached = provinceCache.get(pid);

    if (cached) {
      setProvinceLabel(cached);
      return;
    }

    setProvinceLabel('');

    fetchProvincesOnce()
      .then(() => {
        if (!active) return;

        const label = provinceCache.get(pid) || '';
        setProvinceLabel(label);
      })
      .catch(() => {});

    return () => {
      active = false;
    };
  }, [showProvinceCity, provinceId]);

  useEffect(() => {
    if (!showCity) {
      setCityLabel('');
      return;
    }

    let active = true;
    const pid = normalizeId(provinceId);
    const cid = normalizeId(cityId);
    const cached = cityCache.get(pid)?.get(cid);

    if (cached) {
      setCityLabel(cached);
      return;
    }

    setCityLabel('');

    fetchCitiesOnce(pid)
      .then(() => {
        if (!active) return;

        const label = cityCache.get(pid)?.get(cid) || '';
        setCityLabel(label);
      })
      .catch(() => {});

    return () => {
      active = false;
    };
  }, [showCity, provinceId, cityId]);

  const handleRemoveGps = useCallback(() => {
    useGlobalLocationStore.getState().disableGps();
  }, []);

  const handleRemoveProvince = useCallback(() => {
    useGlobalLocationStore.getState().resetLocation();
  }, []);

  const handleRemoveCity = useCallback(() => {
    const state = useGlobalLocationStore.getState();
    state.setLocation(state.provinceId, null);
  }, []);

  if (!showGps && !showGpsLoading && !showProvinceCity) {
    return null;
  }

  return (
    <div className="mt-3 flex flex-wrap items-center gap-2">
      {showGpsLoading && (
        <LocationTag
          icon={<FiNavigation size={14} />}
          label="در حال دریافت موقعیت..."
          loading
          removable={false}
        />
      )}

      {showGps && (
        <LocationTag
          icon={<FiNavigation size={14} />}
          label="موقعیت فعلی شما"
          onRemove={handleRemoveGps}
          removeLabel="غیرفعال کردن موقعیت فعلی"
        />
      )}

      {showProvinceCity && (
        <LocationTag
          icon={<FiMapPin size={14} />}
          label={provinceLabel || 'استان انتخاب‌شده'}
          loading={!provinceLabel}
          onRemove={handleRemoveProvince}
          removeLabel="حذف فیلتر استان"
        />
      )}

      {showCity && (
        <LocationTag
          icon={<FiMapPin size={14} />}
          label={cityLabel || 'شهر انتخاب‌شده'}
          loading={!cityLabel}
          onRemove={handleRemoveCity}
          removeLabel="حذف فیلتر شهر"
        />
      )}
    </div>
  );
}