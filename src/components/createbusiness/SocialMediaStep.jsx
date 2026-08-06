// src/components/createbusiness/SocialMediaStep.jsx
'use client';
import { FiSend, FiMessageSquare, FiHash, FiAtSign } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import Input from '@/components/common/Input';
import Card from '@/components/common/Card';

const SOCIAL_PLATFORMS = [
  {
    key: 'telegram',
    title: 'تلگرام',
    subtitle: 'آیدی یا لینک کانال تلگرام',
    placeholder: 'مثال: nilaram_official',
    icon: FiSend,
    color: '#0088cc',
    prefix: '@',
  },
  {
    key: 'whatsapp',
    title: 'واتساپ',
    subtitle: 'شماره تماس واتساپ (با کد کشور)',
    placeholder: 'مثال: 989123456789',
    icon: FiMessageSquare,
    color: '#25D366',
    prefix: '+',
  },
  {
    key: 'bale',
    title: 'بله',
    subtitle: 'آیدی یا شماره حساب بله',
    placeholder: 'مثال: nilaram_beauty',
    icon: FiAtSign,
    color: '#00a2e8',
    prefix: '@',
  },
  {
    key: 'eitaa',
    title: 'ایتا',
    subtitle: 'آیدی یا لینک کانال ایتا',
    placeholder: 'مثال: nilaram_official',
    icon: FiHash,
    color: '#ef6c00',
    prefix: '@',
  },
];

export default function SocialMediaStep({ formData, onUpdate }) {
  const { colors } = useTheme();

  return (
    <div className="px-5 py-4 space-y-4">
      {/* هدر */}
      <div className="flex items-center gap-2.5 mb-2">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: '#2196F315' }}
        >
          <FiSend size={20} color="#2196F3" />
        </div>
        <div className="flex-1 gap-1">
          <p className="text-[15px] font-[Vazir-Bold]" style={{ color: colors.textMain }}>
            شبکه‌های اجتماعی و پیام‌رسان‌ها
          </p>
          <p className="text-xs" style={{ color: colors.textSecondary }}>
            راه‌های ارتباطی خود را با مشتریان به اشتراک بگذارید
          </p>
        </div>
      </div>

      {/* راهنما */}
      <div
        className="flex items-start gap-2.5 p-3 rounded-2xl border"
        style={{
          backgroundColor: '#2196F308',
          borderColor: '#2196F325',
        }}
      >
        <span className="text-base flex-shrink-0">💡</span>
        <p className="text-xs leading-5 flex-1" style={{ color: colors.textSecondary }}>
          این بخش اختیاری است و می‌توانید بعداً در تنظیمات سالن، پیام‌رسان‌ها را اضافه یا ویرایش
          کنید.
        </p>
      </div>

      {/* فرم‌ها */}
      <Card variant="elevated" padding={16} radius={18}>
        <div className="space-y-4">
          {SOCIAL_PLATFORMS.map((platform) => {
            const Icon = platform.icon;
            return (
              <div key={platform.key}>
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className="w-8 h-8 rounded-[10px] flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: platform.color + '18' }}
                  >
                    <Icon size={16} color={platform.color} />
                  </div>
                  <div className="flex-1">
                    <p className="text-[13px] font-[Vazir-Bold]" style={{ color: colors.textMain }}>
                      {platform.title}
                    </p>
                    <p className="text-[10px]" style={{ color: colors.textSecondary }}>
                      {platform.subtitle}
                    </p>
                  </div>
                </div>
                <Input
                  placeholder={platform.placeholder}
                  value={formData[platform.key] || ''}
                  onChangeText={(t) => onUpdate(platform.key, t)}
                  rightIcon={
                    <span
                      className="text-xs font-[Vazir-Bold] px-1.5 py-0.5 rounded-md"
                      style={{ backgroundColor: platform.color + '15', color: platform.color }}
                    >
                      {platform.prefix}
                    </span>
                  }
                />
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
