'use client';
import { useState, useEffect } from 'react';
import { FiDownload, FiX } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import { toPersianDigit } from '@/utils/numberUtils';

const APP_VERSION = '1.0.0';

const MOCK_REMOTE_CONFIG = {
  latestVersion: '1.2.0',
  minRequiredVersion: '1.0.0',
  isForceUpdate: false,
  changelog: [
    { icon: '✨', text: 'افزوده شدن سیستم نظردهی' },
    { icon: '⚡', text: 'بهبود سرعت بارگذاری' },
    { icon: '🛡️', text: 'ارتقای امنیت حساب کاربری' },
  ],
};

export default function UpdateModal() {
  const { colors } = useTheme();
  const [visible, setVisible] = useState(false);
  const [updateInfo, setUpdateInfo] = useState(null);

  useEffect(() => {
    const checkUpdate = () => {
      const compareVersions = (a, b) => {
        const numA = a.split('.').map(Number);
        const numB = b.split('.').map(Number);
        for (let i = 0; i < 3; i++) {
          if (numA[i] < numB[i]) return -1;
          if (numA[i] > numB[i]) return 1;
        }
        return 0;
      };

      const compareLatest = compareVersions(APP_VERSION, MOCK_REMOTE_CONFIG.latestVersion);
      const compareMin = compareVersions(APP_VERSION, MOCK_REMOTE_CONFIG.minRequiredVersion);

      if (compareLatest < 0) {
        const isForce = compareMin < 0 || MOCK_REMOTE_CONFIG.isForceUpdate;
        setUpdateInfo({
          ...MOCK_REMOTE_CONFIG,
          currentVersion: APP_VERSION,
          isForceUpdate: isForce,
        });
        setVisible(true);
      }
    };

    const timer = setTimeout(checkUpdate, 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleUpdate = () => {
    window.location.reload();
  };

  const handleLater = () => {
    if (!updateInfo?.isForceUpdate) setVisible(false);
  };

  if (!visible || !updateInfo) return null;

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
        {!updateInfo.isForceUpdate && (
          <button
            onClick={handleLater}
            className="absolute top-4 left-4 w-8 h-8 rounded-full
              flex items-center justify-center"
            style={{ backgroundColor: colors.background }}
          >
            <FiX size={18} style={{ color: colors.textMain }} />
          </button>
        )}

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

        <h2
          className="text-xl text-center mb-2"
          style={{ color: colors.textMain, fontFamily: 'Vazir-Bold' }}
        >
          {updateInfo.isForceUpdate ? 'به‌روزرسانی اجباری' : 'نسخه جدید در دسترس است'}
        </h2>

        <div
          className="flex items-center justify-between p-3 rounded-xl mb-4"
          style={{
            backgroundColor: colors.background,
            border: `1px solid ${colors.border}`,
          }}
        >
          <div className="text-center flex-1">
            <p className="text-xs mb-1" style={{ color: colors.textSecondary, fontFamily: 'Vazir' }}>
              فعلی
            </p>
            <p className="text-base" style={{ color: colors.textMain, fontFamily: 'Vazir-Bold' }}>
              {toPersianDigit(updateInfo.currentVersion)}
            </p>
          </div>
          <div className="text-2xl" style={{ color: colors.textSecondary }}>←</div>
          <div className="text-center flex-1">
            <p className="text-xs mb-1" style={{ color: colors.textSecondary, fontFamily: 'Vazir' }}>
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

        <button
          onClick={handleUpdate}
          className="w-full py-4 rounded-2xl flex items-center justify-center gap-2
            transition-all hover:scale-[1.02] active:scale-[0.98] mb-2"
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