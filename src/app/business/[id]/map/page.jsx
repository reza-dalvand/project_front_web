'use client';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FiX, FiNavigation, FiMapPin } from 'react-icons/fi';
import Map, { Marker, NavigationControl } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useTheme } from '@/stores/useThemeStore';
import Button from '@/components/common/Button';

// استایل نقشه OpenStreetMap (رایگان)
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

// داده‌های MOCK کسب‌وکار
const MOCK_BUSINESS = {
  id: '1',
  name: 'مجموعه زیبایی و سلامت نیلارام',
  address: 'سعادت‌آباد، خیابان سرو غربی، ساختمان پزشکان نگین، طبقه ۳',
  location: {
    latitude: 35.7898,
    longitude: 51.3768,
  },
};

export default function BusinessMapPage() {
  const params = useParams();
  const router = useRouter();
  const { colors } = useTheme();
  const business = MOCK_BUSINESS; // در production از API

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleNavigation = () => {
    if (!business.location) return;

    const { latitude, longitude } = business.location;
    const label = encodeURIComponent(business.name || 'مقصد');

    // باز کردن مسیریاب پیش‌فرض سیستم
    const url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
    window.open(url, '_blank');
  };

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col" style={{ backgroundColor: colors.background }}>
      {/* ═══ نقشه تمام صفحه ═══ */}
      <div className="flex-1 relative">
        <Map
          initialViewState={{
            longitude: business.location.longitude,
            latitude: business.location.latitude,
            zoom: 16,
          }}
          style={{ width: '100%', height: '100%' }}
          mapStyle={MAP_STYLE}
        >
          <NavigationControl position="top-right" />
          <Marker
            longitude={business.location.longitude}
            latitude={business.location.latitude}
            anchor="bottom"
          >
            <div className="relative flex flex-col items-center">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center shadow-lg"
                style={{ backgroundColor: '#E53935' }}
              >
                <FiMapPin size={20} color="#fff" />
              </div>
              <div
                className="w-4 h-2 rounded-full mt-[-2px]"
                style={{ backgroundColor: 'rgba(0,0,0,0.2)' }}
              />
            </div>
          </Marker>
        </Map>
      </div>

      {/* ═══ فوتر - اطلاعات و دکمه‌ها ═══ */}
      <div
        className="border-t p-5 space-y-4 shadow-2xl"
        style={{
          backgroundColor: colors.cardBackground,
          borderColor: colors.border,
        }}
      >
        {/* اطلاعات کسب‌وکار */}
        <div className="text-right">
          <h2
            className="text-base font-[Vazir-Bold] mb-1"
            style={{ color: colors.textMain }}
          >
            {business.name}
          </h2>
          <p
            className="text-xs leading-5"
            style={{ color: colors.textSecondary }}
          >
            {business.address}
          </p>
        </div>

        {/* دکمه‌ها */}
        <div className="flex gap-3">
          <Button
            title="انصراف"
            onPress={() => router.back()}
            variant="outline"
            size="lg"
            className="flex-1"
            icon={<FiX size={18} style={{ color: colors.textMain }} />}
            iconPosition="left"
          />
          <Button
            title="مسیریابی"
            onPress={handleNavigation}
            variant="primary"
            size="lg"
            className="flex-[2]"
            icon={<FiNavigation size={18} color="#fff" />}
            iconPosition="right"
          />
        </div>
      </div>
    </div>
  );
}