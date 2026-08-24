// src/components/common/UpdateModal.jsx
'use client';

import { FiDownload, FiX } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import { useAppVersionStore } from '@/stores/useAppVersionStore';
import { toPersianDigit } from '@/utils/numberUtils';

/**
 * ✅ فاز ۵: دیگر MOCK_REMOTE_CONFIG داخلی ندارد.
 * داده‌ها فقط از useAppVersionStore خوانده می‌شوند.
 */
export default function UpdateModal() {
  const { colors } = useTheme();
  const updateInfo = useAppVersionStore((s) => s.updateInfo);
  const dismissOptionalUpdate = useAppVersionStore((s) => s.dismissOptionalUpdate);
  const openStore = useAppVersionStore((s) => s.openStore);

  // اگر آپدیتی وجود ندارد، چیزی نمایش نده
  if (!updateInfo) return null;

  const handleLater = () => {
    if (!updateInfo.isForceUpdate) {
      dismissOptionalUpdate();
    }
  };

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-6"
      style={{ backgroundColor: 'rgba(0,0,0,0.65)' }}
      onClick={updateInfo.isForceUpdate ? undefined : handleLater}
    >
      <div
        className="max-w-md w-full p-6 rounded-3xl relative"
        style={{ backgroundColor: colors.cardBackground }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* دکمه بستن (فقط برای آپدیت اختیاری) */}
        {!updateInfo.isForceUpdate && (
          <button
            onClick={handleLater}
            className="absolute top-4 left-4 w-8 h-8 rounded-full flex items-center justify-center"
            style={{ backgroundColor: colors.background }}
          >
            <FiX size={18} style={{ color: colors.textMain }} />
          </button>
        )}

        {/* آیکون */}
        <div className="flex justify-center mb-4">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center"
            style={{
              backgroundColor: updateInfo.isForceUpdate ? '#E5393520' : colors.primary + '20',
            }}
          >
            <FiDownload size={40} color={updateInfo.isForceUpdate ? '#E53935' : colors.primary} />
          </div>
        </div>

        {/* عنوان */}
        <h2
          className="text-xl text-center mb-2"
          style={{ color: colors.textMain, fontFamily: 'Vazir-Bold' }}
        >
          {updateInfo.isForceUpdate ? 'به‌روزرسانی اجباری' : 'نسخه جدید در دسترس است'}
        </h2>

        {/* مقایسه نسخه‌ها */}
        <div
          className="flex items-center justify-between p-3 rounded-xl mb-4"
          style={{
            backgroundColor: colors.background,
            border: `1px solid ${colors.border}`,
          }}
        >
          <div className="text-center flex-1">
            <p
              className="text-xs mb-1"
              style={{ color: colors.textSecondary, fontFamily: 'Vazir' }}
            >
              فعلی
            </p>
            <p className="text-base" style={{ color: colors.textMain, fontFamily: 'Vazir-Bold' }}>
              {toPersianDigit(updateInfo.currentVersion)}
            </p>
          </div>
          <div className="text-2xl" style={{ color: colors.textSecondary }}>
            ←
          </div>
          <div className="text-center flex-1">
            <p
              className="text-xs mb-1"
              style={{ color: colors.textSecondary, fontFamily: 'Vazir' }}
            >
              جدید
            </p>
            <p
              className="text-base"
              style={{
                color: updateInfo.isForceUpdate ? '#E53935' : colors.primary,
                fontFamily: 'Vazir-Bold',
              }}
            >
              {toPersianDigit(updateInfo.latestVersion)}
            </p>
          </div>
        </div>

        {/* Changelog */}
        {updateInfo.changelog && updateInfo.changelog.length > 0 && (
          <div
            className="p-4 rounded-xl mb-4"
            style={{
              backgroundColor: colors.background,
              border: `1px solid ${colors.border}`,
            }}
          >
            <h3
              className="text-sm mb-3"
              style={{ color: colors.textMain, fontFamily: 'Vazir-Bold' }}
            >
              تغییرات این نسخه:
            </h3>
            <div className="space-y-2">
              {updateInfo.changelog.slice(0, 3).map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span className="text-base">{item.icon}</span>
                  <span
                    className="text-xs"
                    style={{ color: colors.textSecondary, fontFamily: 'Vazir' }}
                  >
                    {item.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* دکمه به‌روزرسانی */}
        <button
          onClick={openStore}
          className="w-full py-4 rounded-2xl flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98] mb-2"
          style={{
            backgroundColor: updateInfo.isForceUpdate ? '#E53935' : colors.primary,
            color: '#fff',
            fontFamily: 'Vazir-Bold',
            fontSize: '15px',
          }}
        >
          <FiDownload size={18} />
          <span>{updateInfo.isForceUpdate ? 'به‌روزرسانی اجباری' : 'به‌روزرسانی'}</span>
        </button>

        {/* دکمه بعداً (فقط اختیاری) */}
        {!updateInfo.isForceUpdate && (
          <button
            onClick={handleLater}
            className="w-full py-3 rounded-xl transition-opacity hover:opacity-80"
            style={{
              color: colors.textSecondary,
              fontFamily: 'Vazir-Medium',
              fontSize: '14px',
            }}
          >
            بعداً یادآوری کن
          </button>
        )}
      </div>
    </div>
  );
}
