'use client';
import { useState, useEffect } from 'react';
import { FiMapPin, FiNavigation, FiCheck, FiX, FiEdit } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import Button from './Button';
import Card from './Card';
import 'maplibre-gl/dist/maplibre-gl.css';

const DEFAULT_LOCATION = {
  latitude: 35.6997,
  longitude: 51.338,
  zoom: 13,
};

const MAP_STYLE = {
  version: 8,
  sources: {
    osm: {
      type: 'raster',
      tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
      tileSize: 256,
      attribution: '© OpenStreetMap',
    },
  },
  layers: [
    {
      id: 'osm',
      type: 'raster',
      source: 'osm',
    },
  ],
};

export default function MapPicker({ initialLocation, onLocationSelect, readOnly = false }) {
  const { colors } = useTheme();
  const [modalVisible, setModalVisible] = useState(false);
  const [confirmedLocation, setConfirmedLocation] = useState(initialLocation || null);
  const [confirmedAddress, setConfirmedAddress] = useState('');
  const [tempLocation, setTempLocation] = useState(null);
  const [tempAddress, setTempAddress] = useState('در حال دریافت آدرس...');
  const [loading, setLoading] = useState(false);

  // Dynamic Import برای maplibre
  const [MapLib, setMapLib] = useState(null);
  const [mapLoading, setMapLoading] = useState(true);

  useEffect(() => {
    import('react-map-gl/maplibre')
      .then((mod) => {
        setMapLib({
          Map: mod.default,
          Marker: mod.Marker,
          NavigationControl: mod.NavigationControl,
        });
        setMapLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load maplibre:', err);
        setMapLoading(false);
      });
  }, []);

  const getAddressFromCoordinates = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1&accept-language=fa`,
        { headers: { 'User-Agent': 'ZibanoWebApp/1.0' } }
      );
      const data = await response.json();
      return data.display_name || 'آدرس یافت نشد';
    } catch (error) {
      console.log('Error getting address:', error);
      return 'خطا در دریافت آدرس';
    }
  };

  useEffect(() => {
    const init = async () => {
      if (confirmedLocation?.latitude && confirmedLocation?.longitude) {
        const addr = await getAddressFromCoordinates(
          confirmedLocation.latitude,
          confirmedLocation.longitude
        );
        setConfirmedAddress(addr);
      }
    };
    init();
  }, [confirmedLocation]);

  const openModal = () => {
    if (readOnly) return;
    const startLoc = confirmedLocation || DEFAULT_LOCATION;
    setTempLocation(startLoc);
    setModalVisible(true);
    setLoading(true);
    getAddressFromCoordinates(startLoc.latitude, startLoc.longitude).then((addr) => {
      setTempAddress(addr);
      setLoading(false);
    });
  };

  const handleMapClick = async (e) => {
    if (readOnly) return;
    const { lng, lat } = e.lngLat;
    const newLoc = { latitude: lat, longitude: lng, zoom: 16 };
    setTempLocation(newLoc);
    setTempAddress('در حال جستجوی موقعیت...');
    setLoading(true);
    const addr = await getAddressFromCoordinates(lat, lng);
    setTempAddress(addr);
    setLoading(false);
  };

  const handleConfirm = () => {
    if (!tempLocation) return;
    setConfirmedLocation(tempLocation);
    setConfirmedAddress(tempAddress);
    onLocationSelect?.(tempLocation, tempAddress);
    setModalVisible(false);
  };

  const handleClose = () => {
    setModalVisible(false);
  };

  return (
    <>
      {/* دکمه Trigger */}
      <button
        onClick={openModal}
        disabled={readOnly}
        className="w-full flex items-center gap-3 p-4 rounded-2xl border-2 transition-all
          hover:scale-[1.01] active:scale-[0.99]"
        style={{
          backgroundColor: colors.cardBackground,
          borderColor: confirmedLocation ? colors.primary : colors.border,
          opacity: readOnly ? 0.6 : 1,
        }}
      >
        {confirmedLocation ? (
          <>
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: colors.primary + '18' }}
            >
              <FiMapPin size={22} style={{ color: colors.primary }} />
            </div>
            <div className="flex-1 text-right min-w-0">
              <p className="text-xs font-[Vazir] mb-1" style={{ color: colors.textSecondary }}>
                موقعیت انتخاب شده
              </p>
              <p
                className="text-sm font-[Vazir-Bold] line-clamp-1"
                style={{ color: colors.textMain }}
              >
                {confirmedAddress ||
                  `${confirmedLocation.latitude.toFixed(4)}, ${confirmedLocation.longitude.toFixed(4)}`}
              </p>
            </div>
            <div
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl flex-shrink-0"
              style={{ backgroundColor: colors.primary }}
            >
              <FiEdit size={12} color="#fff" />
              <span className="text-xs font-[Vazir-Bold] text-white">تغییر</span>
            </div>
          </>
        ) : (
          <>
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: colors.border + '60' }}
            >
              <FiMapPin size={22} style={{ color: colors.textSecondary }} />
            </div>
            <div className="flex-1 text-right">
              <p className="text-xs font-[Vazir] mb-1" style={{ color: colors.textSecondary }}>
                موقعیت مکانی
              </p>
              <p className="text-sm font-[Vazir]" style={{ color: colors.textSecondary }}>
                برای انتخاب روی نقشه، ضربه بزنید
              </p>
            </div>
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: colors.primary + '15' }}
            >
              <FiNavigation size={18} style={{ color: colors.primary }} />
            </div>
          </>
        )}
      </button>

      {/* مدال نقشه */}
      {modalVisible && (
        <div
          className="fixed inset-0 z-[9999] flex flex-col"
          style={{ backgroundColor: colors.background }}
        >
          {/* هدر */}
          <div
            className="flex items-center justify-between px-5 py-4 border-b"
            style={{
              backgroundColor: colors.cardBackground,
              borderColor: colors.border,
            }}
          >
            <button
              onClick={handleClose}
              className="w-10 h-10 rounded-xl flex items-center justify-center border"
              style={{
                backgroundColor: colors.background,
                borderColor: colors.border,
              }}
            >
              <FiX size={20} style={{ color: colors.textMain }} />
            </button>
            <div className="flex-1 text-center px-4">
              <h3 className="text-base font-[Vazir-Bold]" style={{ color: colors.textMain }}>
                انتخاب موقعیت مکانی
              </h3>
              <p className="text-xs font-[Vazir] mt-1" style={{ color: colors.textSecondary }}>
                روی نقشه کلیک کنید تا نشانگر روی محل دقیق قرار گیرد
              </p>
            </div>
            <div className="w-10" />
          </div>

          {/* نقشه */}
          <div className="flex-1 relative">
            {MapLib ? (
              <MapLib.Map
                initialViewState={{
                  longitude: tempLocation?.longitude || DEFAULT_LOCATION.longitude,
                  latitude: tempLocation?.latitude || DEFAULT_LOCATION.latitude,
                  zoom: tempLocation?.zoom || DEFAULT_LOCATION.zoom,
                }}
                style={{ width: '100%', height: '100%' }}
                mapStyle={MAP_STYLE}
                onClick={handleMapClick}
              >
                <MapLib.NavigationControl position="top-right" />
                {tempLocation && (
                  <MapLib.Marker
                    longitude={tempLocation.longitude}
                    latitude={tempLocation.latitude}
                    anchor="bottom"
                  >
                    {/* ✅ مارکر قرمز بدون دایره دور - فقط خود پین */}
                    <svg
                      width="36"
                      height="48"
                      viewBox="0 0 36 48"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      style={{ filter: 'drop-shadow(0 3px 6px rgba(0,0,0,0.35))' }}
                    >
                      <path
                        d="M18 0C8.06 0 0 8.06 0 18c0 13.5 18 30 18 30s18-16.5 18-30C36 8.06 27.94 0 18 0z"
                        fill="#E53935"
                      />
                      <circle cx="18" cy="18" r="7" fill="#fff" />
                    </svg>
                  </MapLib.Marker>
                )}
              </MapLib.Map>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p style={{ color: colors.textSecondary }}>
                  {mapLoading ? 'در حال بارگذاری نقشه...' : 'خطا در بارگذاری نقشه'}
                </p>
              </div>
            )}
          </div>

          {/* فوتر - آدرس و دکمه‌ها */}
          <div
            className="border-t p-5 space-y-4"
            style={{
              backgroundColor: colors.cardBackground,
              borderColor: colors.border,
            }}
          >
            {/* باکس آدرس */}
            <div
              className="flex items-start gap-3 p-4 rounded-2xl border"
              style={{
                backgroundColor: colors.background,
                borderColor: colors.border,
              }}
            >
              <FiMapPin size={18} style={{ color: colors.primary, flexShrink: 0 }} />
              <div className="flex-1">
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div
                      className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"
                      style={{ color: colors.primary }}
                    />
                    <span className="text-xs font-[Vazir]" style={{ color: colors.textSecondary }}>
                      در حال جستجوی موقعیت...
                    </span>
                  </div>
                ) : (
                  <>
                    <p
                      className="text-xs font-[Vazir-Bold] mb-1"
                      style={{ color: colors.textMain }}
                    >
                      آدرس انتخابی
                    </p>
                    <p
                      className="text-xs font-[Vazir] leading-5"
                      style={{ color: colors.textSecondary }}
                    >
                      {tempAddress}
                    </p>
                  </>
                )}
              </div>
            </div>

            {/* دکمه‌ها */}
            <div className="flex gap-3">
              <Button
                title="انصراف"
                onPress={handleClose}
                variant="outline"
                size="lg"
                className="flex-1"
              />
              <Button
                title="تایید موقعیت"
                onPress={handleConfirm}
                variant="primary"
                size="lg"
                className="flex-[2]"
                icon={<FiCheck size={18} color="#fff" />}
                iconPosition="right"
                disabled={loading}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
