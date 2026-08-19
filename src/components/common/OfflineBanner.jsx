// src/components/common/OfflineBanner.jsx
'use client';

import { useEffect, useState } from 'react';
import { FiWifiOff } from 'react-icons/fi';
import { useNetworkStore } from '@/stores/useNetworkStore';

export default function OfflineBanner() {
  const showOfflineBanner = useNetworkStore((s) => s.showOfflineBanner);
  const dismissBanner = useNetworkStore((s) => s.dismissBanner);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (showOfflineBanner) {
      setVisible(true);
    } else {
      const timer = setTimeout(() => setVisible(false), 300);
      return () => clearTimeout(timer);
    }
  }, [showOfflineBanner]);

  if (!visible) return null;

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[99999] transition-all duration-300"
      style={{
        // ✅ اصلاح اصلی: اضافه کردن safe-area-inset-top
        paddingTop: 'env(safe-area-inset-top, 0px)',
        transform: showOfflineBanner ? 'translateY(0)' : 'translateY(-100%)',
      }}
    >
      {/* محتوای بنر */}
      <div
        className="flex items-center justify-between px-4 py-2.5"
        style={{ backgroundColor: '#E53935' }}
      >
        <div className="flex items-center gap-2">
          <FiWifiOff size={16} color="#fff" />
          <span className="text-sm font-[Vazir-Bold] text-white">اتصال اینترنت قطع است</span>
        </div>
        <button onClick={dismissBanner} className="px-2 py-1 rounded-lg text-xs text-white/80">
          ✕
        </button>
      </div>
    </div>
  );
}
