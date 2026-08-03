'use client';

import { FiShield, FiRotateCcw, FiCheckCircle, FiLock } from 'react-icons/fi';
import Card from '@/components/common/Card';

export default function RulesCard({ colors }) {
  const rules = [
    {
      icon: FiLock,
      iconColor: '#FF9800',
      iconBg: '#FF980018',
      title: 'بیعانه غیرقابل استرداد',
      description:
        'پس از رزرو و پرداخت بیعانه، این مبلغ به عنوان تأیید نوبت شما نزد زیبانو نگهداری می‌شود و در صورت عدم حضور، مسترد نخواهد شد.',
    },
    {
      icon: FiRotateCcw,
      iconColor: '#43A047',
      iconBg: '#43A04718',
      title: 'لغو توسط سالن',
      description:
        'در صورتی که سالن نوبت شما را لغو کند، کل بیعانه به همراه ۱۰٪ غرامت تاخیر، ظرف ۲۴ ساعت به حساب شما واریز می‌شود.',
    },
    {
      icon: FiCheckCircle,
      iconColor: '#9C27B0',
      iconBg: '#9C27B018',
      title: 'کد تایید خدمت',
      description:
        'پس از رزرو، یک کد ۴ رقمی برای شما صادر می‌شود. این کد را حتماً پس از انجام خدمت به سالن‌دار ارائه دهید تا بیعانه آزاد شود.',
    },
  ];

  return (
    <Card variant="default" padding={16} radius={18}>
      {/* هدر */}
      <div className="flex items-center gap-2 mb-1">
        <div
          className="w-9 h-9 rounded-[11px] flex items-center justify-center"
          style={{ backgroundColor: '#9C27B015' }}
        >
          <FiShield size={20} color="#9C27B0" />
        </div>
        <span
          className="text-[15px] font-[Vazir-Bold]"
          style={{ color: colors.textMain }}
        >
          قوانین و مقررات رزرو
        </span>
      </div>

      {/* لیست قوانین */}
      <div className="flex flex-col">
        {rules.map((rule, index) => {
          const Icon = rule.icon;
          return (
            <div
              key={index}
              className="flex gap-2.5 py-2.5 items-start"
              style={{
                borderBottom:
                  index < rules.length - 1
                    ? `0.5px solid ${colors.border}`
                    : 'none',
              }}
            >
              <div
                className="w-[34px] h-[34px] rounded-[11px] flex items-center justify-center flex-shrink-0 mt-0.5"
                style={{ backgroundColor: rule.iconBg }}
              >
                <Icon size={18} style={{ color: rule.iconColor }} />
              </div>
              <div className="flex flex-col gap-0.5 flex-1">
                <span
                  className="text-[13px] font-[Vazir-Bold]"
                  style={{ color: colors.textMain }}
                >
                  {rule.title}
                </span>
                <span
                  className="text-[11.5px] font-[Vazir] leading-[19px] text-justify"
                  style={{ color: colors.textSecondary }}
                >
                  {rule.description}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* نکته امنیتی */}
      <div
        className="flex items-center gap-2 p-2.5 rounded-[10px] border mt-1"
        style={{
          backgroundColor: '#43A04710',
          borderColor: '#43A04730',
        }}
      >
        <FiShield size={16} color="#43A047" />
        <span
          className="text-[11px] font-[Vazir-Bold] flex-1"
          style={{ color: '#43A047' }}
        >
          پرداخت شما از طریق درگاه امن بانکی و با رمزنگاری SSL انجام می‌شود
        </span>
      </div>
    </Card>
  );
}