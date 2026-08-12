// src/components/profile/support/SupportChannels.jsx
'use client';
import { FiSend, FiMessageSquare, FiPhone, FiArrowRight } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import { SUPPORT_CHANNELS, SUPPORT_HOURS_SIMPLE } from './constants';

const CHANNEL_ICONS = {
  send: FiSend,
  'message-square': FiMessageSquare,
};

export default function SupportChannels() {
  const { colors } = useTheme();

  const handleChannelPress = (channel) => {
    if (channel.link) {
      window.open(channel.link, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="space-y-4">
      {/* هدر بخش */}
      <div className="flex items-center gap-2.5">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: colors.primary + '15' }}
        >
          <FiPhone size={20} style={{ color: colors.primary }} />
        </div>
        <div className="flex-1 gap-1">
          <p className="text-[15px] font-[Vazir-Bold]" style={{ color: colors.textMain }}>
            راه‌های ارتباطی
          </p>
          <p className="text-xs" style={{ color: colors.textSecondary }}>
            از هر طریقی که راحت‌ترید با ما در تماس باشید
          </p>
        </div>
      </div>

      {/* کارت ساعت پاسخگویی */}
      <div
        className="flex items-center gap-3 p-3.5 rounded-2xl border"
        style={{ backgroundColor: colors.cardBackground, borderColor: colors.border }}
      >
        <div
          className="w-11 h-11 rounded-[14px] flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: '#FF980020' }}
        >
          <span className="text-lg">🕐</span>
        </div>
        <div className="flex-1 gap-1">
          <p className="text-xs" style={{ color: colors.textSecondary }}>
            ساعات پاسخگویی
          </p>
          <p className="text-sm font-[Vazir-Bold]" style={{ color: colors.textMain }}>
            {SUPPORT_HOURS_SIMPLE}
          </p>
        </div>
      </div>

      {/* شبکه کانال‌ها */}
      <div className="grid grid-cols-2 gap-3">
        {SUPPORT_CHANNELS.map((channel) => {
          const Icon = CHANNEL_ICONS[channel.icon] || FiMessageSquare;
          return (
            <button
              key={channel.id}
              onClick={() => handleChannelPress(channel)}
              className="flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all hover:scale-[1.02] active:scale-[0.98]"
              style={{ backgroundColor: colors.cardBackground, borderColor: colors.border }}
            >
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center"
                style={{ backgroundColor: channel.color + '15' }}
              >
                <Icon size={24} color={channel.color} />
              </div>
              <p className="text-sm font-[Vazir-Bold]" style={{ color: colors.textMain }}>
                {channel.title}
              </p>
              <p className="text-[11px] text-center" style={{ color: colors.textSecondary }}>
                {channel.description}
              </p>
              <div
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl mt-1 w-full justify-center"
                style={{ backgroundColor: channel.color + '12' }}
              >
                <span className="text-[11px] font-[Vazir-Bold]" style={{ color: channel.color }}>
                  {channel.actionLabel}
                </span>
                <FiArrowRight size={12} color={channel.color} />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
