// src/components/common/MaintenanceModal.jsx
'use client';

import { FiTool, FiPhone } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import { useMaintenanceStore } from '@/stores/useMaintenanceStore';

/**
 * ✅ فاز ۵: دیگر MOCK_REMOTE_CONFIG داخلی ندارد.
 * داده‌ها فقط از useMaintenanceStore خوانده می‌شوند.
 */
export default function MaintenanceModal() {
  const { colors } = useTheme();
  const maintenanceInfo = useMaintenanceStore((s) => s.maintenanceInfo);

  // اگر حالت تعمیرات فعال نیست، چیزی نمایش نده
  if (!maintenanceInfo) return null;

  const handleCallSupport = () => {
    if (maintenanceInfo.supportPhone) {
      const phone = maintenanceInfo.supportPhone.replace(/[^0-9+]/g, '');
      window.location.href = `tel:${phone}`;
    }
  };

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-6"
      style={{ backgroundColor: 'rgba(0,0,0,0.75)' }}
    >
      <div
        className="max-w-md w-full p-8 rounded-3xl text-center"
        style={{ backgroundColor: colors.cardBackground }}
      >
        {/* آیکون */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div
              className="w-24 h-24 rounded-full flex items-center justify-center"
              style={{ backgroundColor: '#FF980020' }}
            >
              <FiTool size={56} color="#FF9800" />
            </div>
            <div
              className="absolute -top-2 -right-2 w-10 h-10 rounded-full flex items-center justify-center border-2"
              style={{ backgroundColor: '#FF980030', borderColor: colors.cardBackground }}
            >
              <FiTool size={20} color="#FF9800" />
            </div>
          </div>
        </div>

        {/* عنوان */}
        <h1 className="text-2xl mb-3" style={{ color: colors.textMain, fontFamily: 'Vazir-Bold' }}>
          {maintenanceInfo.title}
        </h1>

        {/* پیام */}
        <p
          className="text-sm leading-7 mb-6"
          style={{ color: colors.textSecondary, fontFamily: 'Vazir' }}
        >
          {maintenanceInfo.message}
        </p>

        {/* زمان تقریبی پایان */}
        {maintenanceInfo.estimatedEnd && (
          <div
            className="p-4 rounded-2xl mb-4 flex items-center gap-3"
            style={{ backgroundColor: '#43A04710', border: '1px solid #43A04740' }}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: '#43A04720' }}
            >
              <FiTool size={18} color="#43A047" />
            </div>
            <div className="text-right flex-1">
              <p
                className="text-xs mb-1"
                style={{ color: colors.textSecondary, fontFamily: 'Vazir' }}
              >
                زمان تقریبی پایان
              </p>
              <p className="text-sm" style={{ color: '#43A047', fontFamily: 'Vazir-Bold' }}>
                {maintenanceInfo.estimatedEnd}
              </p>
            </div>
          </div>
        )}

        {/* دکمه تماس با پشتیبانی */}
        {maintenanceInfo.supportPhone && (
          <button
            onClick={handleCallSupport}
            className="w-full py-4 rounded-2xl flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
            style={{
              backgroundColor: colors.primary,
              color: '#fff',
              fontFamily: 'Vazir-Bold',
              fontSize: '15px',
            }}
          >
            <FiPhone size={18} />
            <span>تماس با پشتیبانی</span>
          </button>
        )}
      </div>
    </div>
  );
}
