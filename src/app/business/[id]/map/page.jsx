'use client';
import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createPortal } from 'react-dom';
import {
  FiArrowRight,
  FiMapPin,
  FiNavigation,
  FiShare2,
  FiPhone,
  FiCopy,
  FiCheck,
  FiX,
  FiExternalLink,
} from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import ScreenWrapper from '@/components/common/ScreenWrapper';
import Button from '@/components/common/Button';
import Card from '@/components/common/Card';
import { toPersianDigit } from '@/utils/numberUtils';
import { cleanPhone } from '@/utils/phoneUtils';
import { useToast } from '@/hooks/useToast';
import 'maplibre-gl/dist/maplibre-gl.css';
import { MOCK_BUSINESSES_MAP } from '@/data/businesses';


// ═══════════════════════════════════════════════════════
//              MapLibre Style (OpenStreetMap)
// ═══════════════════════════════════════════════════════
const MAP_STYLE = {
  version: 8,
  sources: {
    osm: {
      type: 'raster',
      tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
      tileSize: 256,
      attribution: '© OpenStreetMap contributors',
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

// ═══════════════════════════════════════════════════════
//              تنظیمات اپلیکیشن‌های مسیریاب
// ═══════════════════════════════════════════════════════
const NAVIGATION_APPS = [
  {
    id: 'balad',
    name: 'بلد',
    subtitle: 'مسیریاب ایرانی',
    icon: '🗺️',
    color: '#00B4AA',
    deepLink: (lat, lng) => `balad://route?destination=${lat},${lng}`,
    webUrl: (lat, lng) => `https://balad.ir/route?destination=${lat},${lng}`,
  },
  {
    id: 'neshan',
    name: 'نشان',
    subtitle: 'مسیریاب ایرانی',
    icon: '📍',
    color: '#FF6600',
    deepLink: (lat, lng) => `neshan://route?destination=${lat},${lng}`,
    webUrl: (lat, lng) => `https://neshan.org/route?destination=${lat},${lng}`,
  },
  {
    id: 'google',
    name: 'گوگل مپ',
    subtitle: 'Google Maps',
    icon: '🌍',
    color: '#4285F4',
    deepLink: (lat, lng) => {
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      if (isIOS) return `comgooglemaps://?daddr=${lat},${lng}`;
      return `google.navigation:q=${lat},${lng}`;
    },
    webUrl: (lat, lng) => `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`,
  },
];

export default function BusinessMapPage() {
  const params = useParams();
  const router = useRouter();
  const { colors } = useTheme();
  const { showToast } = useToast();

  const [MapLib, setMapLib] = useState(null);
  const [mapLoading, setMapLoading] = useState(true);
  const [mapError, setMapError] = useState(false);
  const [copied, setCopied] = useState(false);
  const [navModalVisible, setNavModalVisible] = useState(false);
  const [navLoading, setNavLoading] = useState(null);
  const navTimerRef = useRef(null);

  const businessId = params.id || '1';
  const business = MOCK_BUSINESSES_MAP[businessId] || MOCK_BUSINESSES_MAP['1'];

  // ═══════ Dynamic Import react-map-gl/maplibre ═══════
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
        setMapError(true);
        setMapLoading(false);
      });
  }, []);

  // ═══════ Cleanup تایمر ═══════
  useEffect(() => {
    return () => {
      if (navTimerRef.current) {
        clearTimeout(navTimerRef.current);
      }
    };
  }, []);

  // ✅ بعد (با flag جلوگیری از اجرای دو باره + حذف امن)
  const openNavigationApp = (app) => {
    const { latitude, longitude } = business.location;
    setNavLoading(app.id);

    const deepLink = app.deepLink(latitude, longitude);
    const webUrl = app.webUrl(latitude, longitude);

    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = deepLink;
    document.body.appendChild(iframe);

    // ✅ flag برای جلوگیری از اجرای دو باره cleanup
    let isHandled = false;

    const cleanup = () => {
      if (isHandled) return;
      isHandled = true;
      clearTimeout(navTimerRef.current);
      removeIframeSafely(iframe);
      document.removeEventListener('visibilitychange', handleVisibility);
      setNavLoading(null);
      setNavModalVisible(false);
    };

    const handleVisibility = () => {
      if (document.hidden && !isHandled) {
        cleanup();
      }
    };

    // اگر بعد از ۲.۵ ثانیه اپ باز نشد → نسخه وب
    navTimerRef.current = setTimeout(() => {
      if (!isHandled) {
        cleanup();
        window.open(webUrl, '_blank');
        showToast(`اپلیکیشن ${app.name} یافت نشد، نسخه وب باز شد`, 'info');
      }
    }, 2500);

    document.addEventListener('visibilitychange', handleVisibility);
  };

  // ═══════ Handlers ═══════
  const handleNavigation = () => {
    setNavModalVisible(true);
  };

  // ═══════ تابع کمکی: حذف امن iframe ═══════
  const removeIframeSafely = (iframe) => {
    if (iframe && iframe.parentNode) {
      iframe.parentNode.removeChild(iframe);
    }
  };

  // ═══════ تابع کمکی: کپی در کلیپ‌بورد با fallback ═══════
  const copyTextToClipboard = async (text) => {
    // روش ۱: Clipboard API مدرن (فقط HTTPS/localhost)
    if (navigator.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(text);
        return true;
      } catch (err) {
        console.log('Clipboard API failed:', err);
      }
    }

    // روش ۲: execCommand fallback (برای HTTP و WebView)
    try {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.left = '-9999px';
      textarea.style.top = '-9999px';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      const success = document.execCommand('copy');
      document.body.removeChild(textarea);
      return success;
    } catch (err) {
      console.log('execCommand copy failed:', err);
      return false;
    }
  };

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/business/${business.id}`;
    const shareMessage = `📍 موقعیت ${business.name}\n🏠 ${business.address}\n🔗 ${shareUrl}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: business.name,
          text: shareMessage,
          url: shareUrl,
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareMessage);
        showToast('لینک موقعیت کپی شد', 'success');
      } catch (err) {
        console.error('Failed to copy:', err);
      }
    }
  };

  const handleCall = () => {
    const phone = cleanPhone(business.phone);
    if (phone) {
      window.location.href = `tel:${phone}`;
    } else {
      showToast('شماره تماسی ثبت نشده است', 'error');
    }
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

  // ═══════ Render Navigation Modal ═══════
  const renderNavModal = () => {
    if (!navModalVisible) return null;

    return createPortal(
      <div
        className="fixed inset-0 z-[9999] flex items-end md:items-center justify-center"
        style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
        onClick={(e) => {
          if (e.target === e.currentTarget) setNavModalVisible(false);
        }}
      >
        <div
          className="w-full max-w-md rounded-t-3xl md:rounded-3xl flex flex-col overflow-hidden"
          style={{
            backgroundColor: colors.cardBackground,
            borderTop: `1px solid ${colors.border}`,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* هدر */}
          <div
            className="flex items-center justify-between px-5 py-4 border-b"
            style={{ borderColor: colors.border }}
          >
            <div className="flex items-center gap-3 flex-1">
              <div
                className="w-11 h-11 rounded-[14px] flex items-center justify-center"
                style={{ backgroundColor: '#43A04715' }}
              >
                <FiNavigation size={22} color="#43A047" />
              </div>
              <div className="flex-1">
                <h3 className="text-base font-[Vazir-Bold]" style={{ color: colors.textMain }}>
                  مسیریابی
                </h3>
                <p className="text-[11px] font-[Vazir]" style={{ color: colors.textSecondary }}>
                  اپلیکیشن مسیریاب خود را انتخاب کنید
                </p>
              </div>
            </div>
            <button
              onClick={() => setNavModalVisible(false)}
              className="w-9 h-9 rounded-full flex items-center justify-center"
              style={{ backgroundColor: colors.background }}
            >
              <FiX size={20} style={{ color: colors.textMain }} />
            </button>
          </div>

          {/* لیست اپلیکیشن‌ها */}
          <div className="p-5 space-y-3">
            {NAVIGATION_APPS.map((app) => {
              const isLoading = navLoading === app.id;
              return (
                <button
                  key={app.id}
                  onClick={() => openNavigationApp(app)}
                  disabled={isLoading}
                  className="w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60"
                  style={{
                    backgroundColor: isLoading ? app.color + '10' : colors.cardBackground,
                    borderColor: isLoading ? app.color : colors.border,
                  }}
                >
                  {/* آیکون */}
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
                    style={{ backgroundColor: app.color + '18' }}
                  >
                    {app.icon}
                  </div>

                  {/* اطلاعات */}
                  <div className="flex-1 text-right">
                    <p className="text-[15px] font-[Vazir-Bold]" style={{ color: colors.textMain }}>
                      {app.name}
                    </p>
                    <p
                      className="text-[11px] font-[Vazir] mt-0.5"
                      style={{ color: colors.textSecondary }}
                    >
                      {app.subtitle}
                    </p>
                  </div>

                  {/* لودینگ یا فلش */}
                  {isLoading ? (
                    <div
                      className="w-6 h-6 border-2 border-current border-t-transparent rounded-full animate-spin"
                      style={{ color: app.color }}
                    />
                  ) : (
                    <FiExternalLink size={18} style={{ color: colors.textSecondary }} />
                  )}
                </button>
              );
            })}

            {/* راهنما */}
            <div
              className="flex items-start gap-2.5 p-3 rounded-xl border"
              style={{
                backgroundColor: colors.primary + '08',
                borderColor: colors.primary + '25',
              }}
            >
              <span className="text-base flex-shrink-0">💡</span>
              <p
                className="text-[11px] font-[Vazir] leading-5 flex-1"
                style={{ color: colors.textSecondary }}
              >
                اگر اپلیکیشن مسیریاب روی گوشی شما نصب باشد، مستقیماً باز می‌شود. در غیر این صورت،
                نسخه وب آن باز خواهد شد.
              </p>
            </div>
          </div>
        </div>
      </div>,
      document.body
    );
  };

  // ═══════ Render ═══════
  return (
    <ScreenWrapper padding={0}>
      <div className="flex flex-col h-screen" style={{ backgroundColor: colors.background }}>
        {/* هدر */}
        <div
          className="flex items-center justify-between px-5 py-4 border-b z-10 relative"
          style={{
            backgroundColor: colors.cardBackground,
            borderColor: colors.border,
          }}
        >
          <button
            onClick={() => router.back()}
            className="w-10 h-10 rounded-full flex items-center justify-center border"
            style={{
              backgroundColor: colors.background,
              borderColor: colors.border,
            }}
          >
            <FiArrowRight size={22} style={{ color: colors.textMain }} />
          </button>
          <div className="flex-1 text-center px-4 min-w-0">
            <h1 className="text-base font-[Vazir-Bold] truncate" style={{ color: colors.textMain }}>
              موقعیت روی نقشه
            </h1>
            <p
              className="text-xs font-[Vazir] mt-0.5 truncate"
              style={{ color: colors.textSecondary }}
            >
              {business.name}
            </p>
          </div>
          <div className="w-10" />
        </div>

        {/* نقشه */}
        <div className="flex-1 relative">
          {MapLib && !mapError ? (
            <MapLib.Map
              initialViewState={{
                longitude: business.location.longitude,
                latitude: business.location.latitude,
                zoom: 15,
              }}
              style={{ width: '100%', height: '100%' }}
              mapStyle={MAP_STYLE}
            >
              <MapLib.NavigationControl position="top-right" />

              {/* Marker قرمز کلاسیک */}
              <MapLib.Marker
                longitude={business.location.longitude}
                latitude={business.location.latitude}
                anchor="bottom"
              >
                <svg
                  width="36"
                  height="48"
                  viewBox="0 0 36 48"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  style={{
                    filter: 'drop-shadow(0 3px 6px rgba(0,0,0,0.35))',
                  }}
                >
                  <path
                    d="M18 0C8.06 0 0 8.06 0 18c0 13.5 18 30 18 30s18-16.5 18-30C36 8.06 27.94 0 18 0z"
                    fill="#E53935"
                  />
                  <circle cx="18" cy="18" r="7" fill="#fff" />
                </svg>
              </MapLib.Marker>
            </MapLib.Map>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="flex flex-col items-center gap-3">
                {mapLoading ? (
                  <>
                    <div
                      className="w-12 h-12 border-4 border-current border-t-transparent rounded-full animate-spin"
                      style={{ color: colors.primary }}
                    />
                    <p className="text-sm font-[Vazir]" style={{ color: colors.textSecondary }}>
                      در حال بارگذاری نقشه...
                    </p>
                  </>
                ) : (
                  <>
                    <div
                      className="w-20 h-20 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: '#E5393518' }}
                    >
                      <FiMapPin size={40} color="#E53935" />
                    </div>
                    <div className="text-center">
                      <p
                        className="text-base font-[Vazir-Bold] mb-1"
                        style={{ color: colors.textMain }}
                      >
                        خطا در بارگذاری نقشه
                      </p>
                      <p className="text-xs font-[Vazir]" style={{ color: colors.textSecondary }}>
                        لطفاً اتصال اینترنت خود را بررسی کنید
                      </p>
                    </div>
                    <Button
                      title="تلاش مجدد"
                      onPress={() => window.location.reload()}
                      variant="outline"
                      size="md"
                    />
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        {/* پنل اطلاعات پایین */}
        <div
          className="border-t p-5 space-y-4"
          style={{
            backgroundColor: colors.cardBackground,
            borderColor: colors.border,
          }}
        >
          {/* اطلاعات کسب‌وکار */}
          <Card variant="default" padding={14} radius={16}>
            <div className="flex items-start gap-3">
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: colors.primary + '18' }}
              >
                <FiMapPin size={22} style={{ color: colors.primary }} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-[Vazir-Bold] mb-1" style={{ color: colors.textMain }}>
                  {business.name}
                </h3>
                <p
                  className="text-xs font-[Vazir] leading-5"
                  style={{ color: colors.textSecondary }}
                >
                  {business.address}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <span
                    className="text-[10px] font-[Vazir-Bold] px-2 py-0.5 rounded-md"
                    style={{
                      backgroundColor: colors.primary + '15',
                      color: colors.primary,
                    }}
                  >
                    {business.category}
                  </span>
                </div>
              </div>
              <button
                onClick={handleCopyAddress}
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all hover:scale-105 active:scale-95"
                style={{
                  backgroundColor: copied ? '#43A04718' : colors.primary + '10',
                }}
              >
                {copied ? (
                  <FiCheck size={18} color="#43A047" />
                ) : (
                  <FiCopy size={18} style={{ color: colors.primary }} />
                )}
              </button>
            </div>

            {/* مختصات */}
            <div
              className="flex items-center gap-2 mt-3 pt-3 border-t"
              style={{ borderColor: colors.border }}
            >
              <span className="text-xs" style={{ color: colors.textSecondary }}>
                📍 مختصات:
              </span>
              <span
                className="text-[11px] font-[Vazir] font-mono"
                style={{
                  color: colors.textSecondary,
                  direction: 'ltr',
                }}
              >
                {toPersianDigit(business.location.latitude.toFixed(4))}°N,{' '}
                {toPersianDigit(business.location.longitude.toFixed(4))}°E
              </span>
            </div>
          </Card>

          {/* دکمه‌های اکشن */}
          <div className="flex gap-3">
            <Button
              title="مسیریابی"
              onPress={handleNavigation}
              variant="primary"
              size="lg"
              className="flex-[2]"
              icon={<FiNavigation size={18} color="#fff" />}
              iconPosition="right"
              style={{ backgroundColor: '#43A047' }}
            />
            <button
              onClick={handleCall}
              className="flex-1 h-14 rounded-2xl flex items-center justify-center border-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
              style={{
                backgroundColor: '#2196F315',
                borderColor: '#2196F3',
              }}
            >
              <div className="flex flex-col items-center gap-0.5">
                <FiPhone size={20} color="#2196F3" />
                <span className="text-[10px] font-[Vazir-Bold]" style={{ color: '#2196F3' }}>
                  تماس
                </span>
              </div>
            </button>
            <button
              onClick={handleShare}
              className="flex-1 h-14 rounded-2xl flex items-center justify-center border-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
              style={{
                borderColor: colors.primary,
                backgroundColor: colors.primary + '10',
              }}
            >
              <div className="flex flex-col items-center gap-0.5">
                <FiShare2 size={18} style={{ color: colors.primary }} />
                <span className="text-[10px] font-[Vazir-Bold]" style={{ color: colors.primary }}>
                  اشتراک
                </span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* مدال انتخاب مسیریاب */}
      {renderNavModal()}
    </ScreenWrapper>
  );
}
