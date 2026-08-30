// src/app/business/map/BusinessMapClient.jsx
'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/stores/useThemeStore';
import ScreenWrapper from '@/components/common/ScreenWrapper';
import { useToast } from '@/hooks/useToast';
import { cleanPhone } from '@/utils/phoneUtils';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import BusinessMapHeader from '@/components/businessMap/BusinessMapHeader';
import BusinessMapPanel from '@/components/businessMap/BusinessMapPanel';
import NavigationModal from '@/components/businessMap/NavigationModal';
import MapErrorState from '@/components/businessMap/MapErrorState';
import { businessesService } from '@/api';
import 'maplibre-gl/dist/maplibre-gl.css';

const getMapStyle = () => {
  return {
    version: 8,
    sources: {
      osm: {
        type: 'raster',
        tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
        tileSize: 256,
        attribution: '© OpenStreetMap contributors',
      },
    },
    layers: [{ id: 'osm', type: 'raster', source: 'osm' }],
  };
};

const MAP_STYLE = getMapStyle();

const NAVIGATION_DEEP_LINKS = {
  balad: (lat, lng) => `balad://route?destination=${lat},${lng}`,
  neshan: (lat, lng) => `neshan://route?destination=${lat},${lng}`,
  google: (lat, lng) => {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    if (isIOS) return `comgooglemaps://?daddr=${lat},${lng}`;
    return `google.navigation:q=${lat},${lng}`;
  },
};

const NAVIGATION_WEB_URLS = {
  balad: (lat, lng) => `https://balad.ir/route?destination=${lat},${lng}`,
  neshan: (lat, lng) => `https://neshan.org/route?destination=${lat},${lng}`,
  google: (lat, lng) => `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`,
};

export default function BusinessMapClient({ businessSlug }) {
  const router = useRouter();
  const { colors } = useTheme();
  const { showToast } = useToast();
  const [MapLib, setMapLib] = useState(null);
  const [mapLoading, setMapLoading] = useState(true);
  const [mapError, setMapError] = useState(false);
  const [copied, setCopied] = useState(false);
  const [navModalVisible, setNavModalVisible] = useState(false);
  const [navLoading, setNavLoading] = useState(null);
  const [business, setBusiness] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navTimerRef = useRef(null);

  useEffect(() => {
    const fetchBusiness = async () => {
      setIsLoading(true);
      try {
        const response = await businessesService.getPublicBusiness(businessSlug);
        const b = response.data;
        setBusiness({
          id: b.id,
          name: b.name,
          category: b.category?.name || b.category_name || '',
          address: b.address,
          phone: b.phone,
          location: {
            latitude: b.latitude || 35.6892,
            longitude: b.longitude || 51.389,
          },
        });
      } catch (err) {
        console.error('Failed to fetch business for map:', err);
        showToast('خطا در بارگذاری موقعیت کسب‌وکار', 'error');
      } finally {
        setIsLoading(false);
      }
    };
    fetchBusiness();
  }, [businessId, showToast]);

  useEffect(() => {
    import('react-map-gl/maplibre')
      .then((mod) => {
        setMapLib({ Map: mod.default, Marker: mod.Marker, NavigationControl: mod.NavigationControl });
        setMapLoading(false);
      })
      .catch(() => {
        setMapError(true);
        setMapLoading(false);
      });
  }, []);

  useEffect(() => {
    return () => {
      if (navTimerRef.current) clearTimeout(navTimerRef.current);
    };
  }, []);

  const openNavigationApp = (app) => {
    const { latitude, longitude } = business.location;
    setNavLoading(app.id);
    const deepLink = NAVIGATION_DEEP_LINKS[app.id](latitude, longitude);
    const webUrl = NAVIGATION_WEB_URLS[app.id](latitude, longitude);
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = deepLink;
    document.body.appendChild(iframe);
    let isHandled = false;
    const cleanup = () => {
      if (isHandled) return;
      isHandled = true;
      clearTimeout(navTimerRef.current);
      if (iframe.parentNode) iframe.parentNode.removeChild(iframe);
      document.removeEventListener('visibilitychange', handleVisibility);
      setNavLoading(null);
      setNavModalVisible(false);
    };
    const handleVisibility = () => {
      if (document.hidden && !isHandled) cleanup();
    };
    navTimerRef.current = setTimeout(() => {
      if (!isHandled) {
        cleanup();
        window.open(webUrl, '_blank');
        showToast(`اپلیکیشن ${app.name} یافت نشد، نسخه وب باز شد`, 'info');
      }
    }, 2500);
    document.addEventListener('visibilitychange', handleVisibility);
  };

  const handleNavigation = () => setNavModalVisible(true);

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/business?id=${business.id}`;
    const shareMessage = `📍 موقعیت ${business.name}\n🏠 ${business.address}\n🔗 ${shareUrl}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: business.name, text: shareMessage, url: shareUrl });
      } catch (err) {}
    } else {
      try {
        await navigator.clipboard.writeText(shareMessage);
        showToast('لینک موقعیت کپی شد', 'success');
      } catch (err) {}
    }
  };

  const handleCall = () => {
    const phone = cleanPhone(business.phone);
    if (phone) window.location.href = `tel:${phone}`;
    else showToast('شماره تماسی ثبت نشده است', 'error');
  };

  const handleBack = () => {
    if (typeof window !== 'undefined' && window.history.length > 1) router.back();
    else router.push('/');
  };

  const handleCopyAddress = async () => {
    try {
      await navigator.clipboard.writeText(business.address);
      setCopied(true);
      showToast('آدرس کپی شد', 'success');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  if (isLoading || !business) {
    return (
      <ScreenWrapper>
        <div className="flex items-center justify-center min-h-screen">
          <LoadingSpinner label="در حال بارگذاری..." />
        </div>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper padding={0}>
      <div className="flex flex-col h-screen" style={{ backgroundColor: colors.background }}>
        <BusinessMapHeader businessName={business.name} onBack={handleBack} />
        <div className="flex-1 relative">
          {MapLib && !mapError ? (
            <MapLib.Map
              initialViewState={{ longitude: business.location.longitude, latitude: business.location.latitude, zoom: 15 }}
              style={{ width: '100%', height: '100%' }}
              mapStyle={MAP_STYLE}
            >
              <MapLib.NavigationControl position="top-right" />
              <MapLib.Marker longitude={business.location.longitude} latitude={business.location.latitude} anchor="bottom">
                <svg width="36" height="48" viewBox="0 0 36 48" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ filter: 'drop-shadow(0 3px 6px rgba(0,0,0,0.35))' }}>
                  <path d="M18 0C8.06 0 0 8.06 0 18c0 13.5 18 30 18 30s18-16.5 18-30C36 8.06 27.94 0 18 0z" fill="#E53935" />
                  <circle cx="18" cy="18" r="7" fill="#fff" />
                </svg>
              </MapLib.Marker>
            </MapLib.Map>
          ) : (
            <MapErrorState isLoading={mapLoading} />
          )}
        </div>
        <BusinessMapPanel business={business} copied={copied} onCopyAddress={handleCopyAddress} onNavigation={handleNavigation} onCall={handleCall} onShare={handleShare} />
      </div>
      <NavigationModal visible={navModalVisible} onClose={() => setNavModalVisible(false)} onSelect={openNavigationApp} navLoading={navLoading} />
    </ScreenWrapper>
  );
}