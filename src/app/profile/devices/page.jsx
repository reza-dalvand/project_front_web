'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  FiSmartphone,
  FiMonitor,
  FiGlobe,
  FiClock,
  FiMapPin,
  FiLogout,
  FiShield,
} from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import ScreenWrapper from '@/components/common/ScreenWrapper';
import Header from '@/components/common/Header';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import EmptyState from '@/components/common/EmptyState';
import InfoRow from '@/components/common/InfoRow';
import { toPersianDigit } from '@/utils/numberUtils';
import { useToast } from '@/hooks/useToast';

const MOCK_DEVICES = [
  {
    id: 'dev_1',
    name: 'iPhone 14 Pro',
    type: 'ios',
    os: 'iOS 17.5.1',
    ip: '192.168.1.45',
    location: 'تهران، ایران',
    lastActive: 'همین الان',
    isCurrent: true,
    trusted: true,
  },
  {
    id: 'dev_2',
    name: 'Samsung Galaxy S23',
    type: 'android',
    os: 'Android 14',
    ip: '85.185.24.112',
    location: 'اصفهان، ایران',
    lastActive: '۲ ساعت پیش',
    isCurrent: false,
    trusted: true,
  },
  {
    id: 'dev_3',
    name: 'Windows 11 - Chrome',
    type: 'desktop',
    os: 'Windows 11 Pro',
    ip: '5.22.134.89',
    location: 'مشهد، ایران',
    lastActive: 'دیروز، ۲۲:۴۵',
    isCurrent: false,
    trusted: false,
  },
];

export default function ActiveDevicesPage() {
  const router = useRouter();
  const { colors } = useTheme();
  const { showToast } = useToast();
  const [devices, setDevices] = useState(MOCK_DEVICES);

  const currentDevice = devices.find((d) => d.isCurrent);
  const otherDevices = devices.filter((d) => !d.isCurrent);

  const stats = {
    total: devices.length,
    trusted: devices.filter((d) => d.trusted).length,
    suspicious: devices.filter((d) => !d.trusted && !d.isCurrent).length,
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

  const handleRemoveDevice = (device) => {
    if (confirm(`آیا مطمئن هستید که می‌خواهید از "${device.name}" خارج شوید؟`)) {
      setDevices((prev) => prev.filter((d) => d.id !== device.id));
      showToast(`نشست "${device.name}" بسته شد`, 'success');
    }
  };

  const handleLogoutAll = () => {
    if (confirm('از تمام دستگاه‌های متصل خارج می‌شوید (به جز دستگاه فعلی)')) {
      setDevices((prev) => prev.filter((d) => d.isCurrent));
      showToast('از همه دستگاه‌ها خارج شدید', 'success');
    }
  };

  return (
    <ScreenWrapper padding={0}>
      <Header
        title="دستگاه‌های فعال"
        onBackPress={() => router.back()}
      />

      <div className="flex-1 overflow-y-auto px-5 pt-6 pb-10 space-y-5">
        {/* آمار */}
        <Card variant="elevated" padding={16} radius={18}>
          <div className="flex items-center">
            <div className="flex-1 flex flex-col items-center gap-1">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center mb-1"
                style={{ backgroundColor: colors.primary + '18' }}
              >
                <FiSmartphone size={18} style={{ color: colors.primary }} />
              </div>
              <span
                className="text-[17px] font-[Vazir-Bold]"
                style={{ color: colors.textMain }}
              >
                {toPersianDigit(stats.total)}
              </span>
              <span
                className="text-[10px] font-[Vazir]"
                style={{ color: colors.textSecondary }}
              >
                دستگاه فعال
              </span>
            </div>

            <div className="w-px h-[50px]" style={{ backgroundColor: colors.border }} />

            <div className="flex-1 flex flex-col items-center gap-1">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center mb-1"
                style={{ backgroundColor: '#43A04718' }}
              >
                <FiShield size={18} color="#43A047" />
              </div>
              <span
                className="text-[17px] font-[Vazir-Bold]"
                style={{ color: colors.textMain }}
              >
                {toPersianDigit(stats.trusted)}
              </span>
              <span
                className="text-[10px] font-[Vazir]"
                style={{ color: colors.textSecondary }}
              >
                مورد اعتماد
              </span>
            </div>

            <div className="w-px h-[50px]" style={{ backgroundColor: colors.border }} />

            <div className="flex-1 flex flex-col items-center gap-1">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center mb-1"
                style={{ backgroundColor: '#FF980018' }}
              >
                <FiShield size={18} color="#FF9800" />
              </div>
              <span
                className="text-[17px] font-[Vazir-Bold]"
                style={{ color: colors.textMain }}
              >
                {toPersianDigit(stats.suspicious)}
              </span>
              <span
                className="text-[10px] font-[Vazir]"
                style={{ color: colors.textSecondary }}
              >
                مشکوک
              </span>
            </div>
          </div>
        </Card>

        {/* دستگاه فعلی */}
        {currentDevice && (
          <div>
            <div className="flex items-center gap-2 mb-3 px-1">
              <FiSmartphone size={18} style={{ color: colors.primary }} />
              <span
                className="text-sm font-[Vazir-Bold]"
                style={{ color: colors.textMain }}
              >
                دستگاه فعلی
              </span>
            </div>

            <Card
              variant="default"
              padding={14}
              radius={16}
              className="border-[1.5px]"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-[52px] h-[52px] rounded-2xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: '#2196F318' }}
                >
                  {getDeviceIcon(currentDevice.type)}
                </div>
                <div className="flex-1">
                  <span
                    className="text-sm font-[Vazir-Bold] block"
                    style={{ color: colors.textMain }}
                  >
                    {currentDevice.name}
                  </span>
                  <span
                    className="text-xs font-[Vazir]"
                    style={{ color: colors.textSecondary }}
                  >
                    {currentDevice.os}
                  </span>
                </div>
                <div
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg"
                  style={{ backgroundColor: colors.primary + '20' }}
                >
                  <div
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: colors.primary }}
                  />
                  <span
                    className="text-[10px] font-[Vazir-Bold]"
                    style={{ color: colors.primary }}
                  >
                    فعلی
                  </span>
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
              <span
                className="text-sm font-[Vazir-Bold]"
                style={{ color: colors.textMain }}
              >
                سایر دستگاه‌ها
              </span>
            </div>
            <span
              className="text-xs font-[Vazir]"
              style={{ color: colors.textSecondary }}
            >
              {toPersianDigit(otherDevices.length)} دستگاه
            </span>
          </div>

          {otherDevices.length > 0 ? (
            <div className="space-y-3">
              {otherDevices.map((device) => (
                <Card key={device.id} variant="elevated" padding={14} radius={16}>
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className="w-[52px] h-[52px] rounded-2xl flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: '#607D8B18' }}
                    >
                      {getDeviceIcon(device.type)}
                    </div>
                    <div className="flex-1">
                      <span
                        className="text-sm font-[Vazir-Bold] block"
                        style={{ color: colors.textMain }}
                      >
                        {device.name}
                      </span>
                      <span
                        className="text-xs font-[Vazir]"
                        style={{ color: colors.textSecondary }}
                      >
                        {device.os}
                      </span>
                    </div>
                    <button
                      onClick={() => handleRemoveDevice(device)}
                      className="w-9 h-9 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: '#E5393515' }}
                    >
                      <FiLogout size={16} color="#E53935" />
                    </button>
                  </div>

                  <div
                    className="flex flex-col gap-1 pt-3 border-t"
                    style={{ borderColor: colors.border }}
                  >
                    <InfoRow
                      icon="🌐"
                      label="آی‌پی:"
                      value={device.ip}
                    />
                    <InfoRow
                      icon="🕐"
                      label="آخرین فعالیت:"
                      value={device.lastActive}
                    />
                    <InfoRow
                      icon="📍"
                      label="مکان:"
                      value={device.location}
                    />
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <EmptyState
              icon="🎉"
              title="دستگاه دیگری متصل نیست"
              description="فقط از دستگاه فعلی به حساب خود دسترسی دارید"
            />
          )}
        </div>

        {/* دکمه خروج از همه */}
        {otherDevices.length > 0 && (
          <Button
            title="خروج از همه دستگاه‌ها"
            onPress={handleLogoutAll}
            variant="outline"
            size="lg"
            fullWidth
            className="!border-[#E53935] !border-[1.5px]"
            style={{ color: '#E53935' }}
          />
        )}
      </div>
    </ScreenWrapper>
  );
}