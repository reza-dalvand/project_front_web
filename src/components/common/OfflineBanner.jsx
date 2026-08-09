'use client';
import { useState, useEffect } from 'react';
import { FiWifiOff, FiX } from 'react-icons/fi';

export default function OfflineBanner() {
  const [isOffline, setIsOffline] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      setDismissed(false);
    };
    const handleOffline = () => {
      setIsOffline(true);
      setDismissed(false);
    };

    if (typeof window !== 'undefined') {
      setIsOffline(!navigator.onLine);
    }

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!isOffline || dismissed) return null;

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[9999] px-4 py-3
        flex items-center gap-3 shadow-lg"
      style={{ backgroundColor: '#E53935' }}
    >
      <div
        className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
      >
        <FiWifiOff size={18} color="#fff" />
      </div>
      <div className="flex-1">
        <p className="text-sm" style={{ color: '#fff', fontFamily: 'Vazir-Bold' }}>
          اتصال اینترنت قطع شد
        </p>
        <p className="text-xs" style={{ color: 'rgba(255,255,255,0.9)', fontFamily: 'Vazir' }}>
          لطفاً اتصال اینترنت خود را بررسی کنید
        </p>
      </div>
      <button
        onClick={() => setDismissed(true)}
        className="w-8 h-8 rounded-full flex items-center justify-center
          transition-transform hover:scale-110"
        style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}
      >
        <FiX size={18} color="#fff" />
      </button>
    </div>
  );
}