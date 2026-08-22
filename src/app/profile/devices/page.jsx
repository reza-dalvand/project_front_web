// src/app/profile/devices/page.jsx
'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FiSmartphone, FiMonitor, FiGlobe, FiShield, FiLogOut } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import { useToast } from '@/hooks/useToast';
import ScreenWrapper from '@/components/common/ScreenWrapper';
import Header from '@/components/common/Header';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import InfoRow from '@/components/common/InfoRow';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import { toPersianDigit } from '@/utils/numberUtils';
import { authService } from '@/api';

export default function ActiveDevicesPage() {
  const router = useRouter();
  const { colors } = useTheme();
  const { showToast } = useToast();

  const [devices, setDevices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [removeDeviceTarget, setRemoveDeviceTarget] = useState(null);
  const [removeDeviceDialogVisible, setRemoveDeviceDialogVisible] = useState(false);

  // دریافت دستگاه‌ها از API
  useEffect(() => {
    const fetchDevices = async () => {
      setIsLoading(true);
      try {
        const result = await authService.getDevices();
        setDevices(result.data || []);
      } catch (error) {
        showToast('خطا در دریافت دستگاه‌ها', 'error');
      } finally {
        setIsLoading(false);
      }
    };
    fetchDevices();
  }, []);

  const currentDevice = devices.find((d) => d.is_current || d.isCurrent);
  const otherDevices = devices.filter((d) => !d.is_current && !d.isCurrent);

  const stats = {
    total: devices.length,
    trusted: devices.filter((d) => d.trusted).length,
  };

  const getDeviceIcon = (type) => {
    switch (type) {
      case 'ios':
      case 'android':
        return <FiSmartphone size={26} color="#2196F3" />;
      case 'desktop':
        return <FiMonitor size={26} color="#607D8B" />;
      default:
        return <FiGlobe size={26} color="#607D8B" />;
    }
  };

  const handleRemoveDevice = async () => {
    if (!removeDeviceTarget) return;

    try {
      if (!USE_MOCK) {
        await authService.revokeDevice(removeDeviceTarget.id);
      }
      setDevices((prev) => prev.filter((d) => d.id !== removeDeviceTarget.id));
      showToast(
        `نشست "${removeDeviceTarget.device_name || removeDeviceTarget.name}" بسته شد`,
        'success'
      );
    } catch (err) {
      showToast(err.message || 'خطا در بستن نشست', 'error');
    }

    setRemoveDeviceDialogVisible(false);
    setRemoveDeviceTarget(null);
  };

  if (isLoading) {
    return (
      <ScreenWrapper>
        <Header title="دستگاه‌های فعال" onBackPress={() => router.back()} />
        <div className="flex items-center justify-center py-20">
          <LoadingSpinner label="در حال بارگذاری..." />
        </div>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper padding={0}>
      <Header title="دستگاه‌های فعال" onBackPress={() => router.back()} />

      <div className="flex-1 overflow-y-auto px-5 pt-6 pb-10 space-y-5">
        {/* آمار */}
        <Card variant="elevated" padding={16} radius={18}>
          <div className="flex items-center">
            {[
              {
                icon: <FiSmartphone size={18} />,
                label: 'دستگاه فعال',
                value: stats.total,
                color: colors.primary,
              },
              {
                icon: <FiShield size={18} />,
                label: 'مورد اعتماد',
                value: stats.trusted,
                color: '#43A047',
              },
            ].map((stat, i) => (
              <div key={i} className="flex flex-1 flex-col items-center gap-1 relative">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center mb-1"
                  style={{ backgroundColor: stat.color + '18' }}
                >
                  <span style={{ color: stat.color }}>{stat.icon}</span>
                </div>
                <span className="text-lg font-[Vazir-Bold]" style={{ color: colors.textMain }}>
                  {toPersianDigit(stat.value)}
                </span>
                <span className="text-[10px]" style={{ color: colors.textSecondary }}>
                  {stat.label}
                </span>
                {i < 1 && (
                  <div
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-px h-[50px]"
                    style={{ backgroundColor: colors.border }}
                  />
                )}
              </div>
            ))}
          </div>
        </Card>

        {/* دستگاه فعلی */}
        {currentDevice && (
          <div>
            <div className="flex items-center gap-2 mb-3 px-1">
              <FiSmartphone size={18} style={{ color: colors.primary }} />
              <span className="text-sm font-[Vazir-Bold]" style={{ color: colors.textMain }}>
                دستگاه فعلی
              </span>
            </div>
            <Card
              variant="default"
              padding={14}
              radius={16}
              className="border-[1.5px]"
              style={{ borderColor: colors.primary + '60' }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: '#2196F318' }}
                >
                  {getDeviceIcon(currentDevice.device_type || currentDevice.type)}
                </div>
                <div>
                  <p className="text-sm font-[Vazir-Bold]" style={{ color: colors.textMain }}>
                    {currentDevice.device_name || currentDevice.name}
                  </p>
                  <p className="text-xs" style={{ color: colors.textSecondary }}>
                    {currentDevice.os_info || currentDevice.os}
                  </p>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* سایر دستگاه‌ها */}
        <div>
          <div className="flex items-center justify-between mb-3 px-1">
            <div className="flex items-center gap-2">
              <FiMonitor size={18} style={{ color: colors.primary }} />
              <span className="text-sm font-[Vazir-Bold]" style={{ color: colors.textMain }}>
                سایر دستگاه‌ها
              </span>
            </div>
            <span className="text-xs" style={{ color: colors.textSecondary }}>
              {toPersianDigit(otherDevices.length)} دستگاه
            </span>
          </div>

          {otherDevices.length > 0 ? (
            <div className="space-y-3">
              {otherDevices.map((device) => (
                <Card key={device.id} variant="elevated" padding={14} radius={16}>
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: '#607D8B18' }}
                    >
                      {getDeviceIcon(device.device_type || device.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <span
                        className="text-sm font-[Vazir-Bold] block truncate"
                        style={{ color: colors.textMain }}
                      >
                        {device.device_name || device.name}
                      </span>
                      <span className="text-xs" style={{ color: colors.textSecondary }}>
                        {device.os_info || device.os}
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        setRemoveDeviceTarget(device);
                        setRemoveDeviceDialogVisible(true);
                      }}
                      className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: '#E5393515' }}
                    >
                      <FiLogOut size={16} color="#E53935" />
                    </button>
                  </div>
                  <div
                    className="flex flex-col gap-1 pt-3 border-t"
                    style={{ borderColor: colors.border }}
                  >
                    <InfoRow
                      icon="🌐"
                      label="آی‌پی:"
                      value={device.ip_address || device.ip}
                      monospace
                    />
                    <InfoRow
                      icon="🕐"
                      label="آخرین فعالیت:"
                      value={device.last_active || device.lastActive}
                    />
                    <InfoRow icon="📍" label="مکان:" value={device.location} />
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center py-12 gap-3">
              <span className="text-4xl">🎉</span>
              <h3 className="text-lg font-[Vazir-Bold]" style={{ color: colors.textMain }}>
                دستگاه دیگری متصل نیست
              </h3>
              <p className="text-sm text-center" style={{ color: colors.textSecondary }}>
                فقط از دستگاه فعلی به حساب خود دسترسی دارید
              </p>
            </div>
          )}
        </div>
      </div>

      <ConfirmDialog
        visible={removeDeviceDialogVisible}
        title="بستن نشست"
        message={`آیا مطمئن هستید که می‌خواهید از "${removeDeviceTarget?.device_name || removeDeviceTarget?.name || ''}" خارج شوید؟`}
        confirmText="خروج"
        cancelText="انصراف"
        variant="warning"
        onConfirm={handleRemoveDevice}
        onCancel={() => {
          setRemoveDeviceDialogVisible(false);
          setRemoveDeviceTarget(null);
        }}
      />
    </ScreenWrapper>
  );
}
