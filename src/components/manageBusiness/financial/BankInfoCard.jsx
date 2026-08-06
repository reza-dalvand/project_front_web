'use client';

import { FiCreditCard, FiAlertTriangle, FiEdit2, FiCheckCircle, FiClock } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import Card from '@/components/common/Card';
import InfoRow from '@/components/common/InfoRow';
import { toPersianDigit } from '@/utils/numberUtils';

export default function BankInfoCard({
  bankInfo,
  onEdit,
  businessOwnerName,
  hasActiveAppointments,
}) {
  const { colors } = useTheme();
  const hasInfo = bankInfo.isRegistered;

  return (
    <div className="mb-5">
      {/* عنوان بخش */}
      <div className="flex items-center gap-2 mb-3 px-0.5">
        <FiCreditCard size={20} style={{ color: colors.primary }} />
        <h3 className="text-sm font-[Vazir-Bold]" style={{ color: colors.textMain }}>
          حساب بانکی تسویه
        </h3>
      </div>

      {/* بنر هشدار - فقط وقتی حساب تایید نشده */}
      {(!bankInfo.isRegistered || !bankInfo.isVerified) && hasActiveAppointments && (
        <Card
          variant="default"
          padding={12}
          radius={14}
          className="border mb-3"
          style={{
            borderColor: '#FF980045',
            backgroundColor: '#FF980012',
          }}
        >
          <div className="flex items-start gap-3">
            <FiAlertTriangle size={22} color="#FF9800" className="flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-xs font-[Vazir-Bold] mb-1" style={{ color: '#FF9800' }}>
                حساب بانکی شما هنوز {bankInfo.isRegistered ? 'تایید' : 'ثبت'} نشده است
              </p>
              <p
                className="text-[11px] font-[Vazir] leading-[18px]"
                style={{ color: colors.textSecondary }}
              >
                برای دریافت {bankInfo.isRegistered ? '' : 'تسویه‌ها'} باید حساب تایید شده‌ای داشته
                باشید
              </p>
            </div>
          </div>
        </Card>
      )}

      {hasInfo ? (
        /* ═══ حالت دارای اطلاعات ═══ */
        <Card variant="elevated" padding={16} radius={18}>
          {/* هدر - صاحب حساب + وضعیت */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{ backgroundColor: '#2196F318' }}
              >
                <FiCreditCard size={24} color="#2196F3" />
              </div>
              <div>
                <p className="text-xs" style={{ color: colors.textSecondary }}>
                  صاحب حساب
                </p>
                <p className="text-sm font-[Vazir-Bold]" style={{ color: colors.textMain }}>
                  {bankInfo.ownerName}
                </p>
              </div>
            </div>
            {bankInfo.isVerified ? (
              <div
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl"
                style={{ backgroundColor: '#43A04715' }}
              >
                <FiCheckCircle size={13} color="#43A047" />
                <span className="text-[11px] font-[Vazir-Bold]" style={{ color: '#43A047' }}>
                  تایید شده
                </span>
              </div>
            ) : (
              <div
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl"
                style={{ backgroundColor: '#FF980015' }}
              >
                <FiClock size={13} color="#FF9800" />
                <span className="text-[11px] font-[Vazir-Bold]" style={{ color: '#FF9800' }}>
                  در حال تایید
                </span>
              </div>
            )}
          </div>

          {/* نام بانک */}
          <div
            className="flex items-center gap-2 px-3 py-2.5 rounded-xl mb-3"
            style={{ backgroundColor: colors.background }}
          >
            <span className="text-base">🏦</span>
            <span className="text-sm font-[Vazir-Bold]" style={{ color: colors.textMain }}>
              {bankInfo.bankName}
            </span>
          </div>

          {/* ردیف‌های اطلاعات */}
          <div className="flex flex-col">
            <InfoRow icon="🔖" label="شماره شبا" value={bankInfo.sheba} monospace showDivider />
            <InfoRow
              icon="💳"
              label="شماره کارت"
              value={bankInfo.cardNumber}
              monospace
              showDivider
            />
            {bankInfo.accountNumber && (
              <InfoRow icon="🔢" label="شماره حساب" value={bankInfo.accountNumber} monospace />
            )}
          </div>

          {/* دکمه ویرایش */}
          <button
            onClick={onEdit}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border mt-4
              transition-all hover:scale-[1.01] active:scale-[0.99]"
            style={{
              borderColor: colors.primary,
              backgroundColor: colors.primary + '08',
            }}
          >
            <FiEdit2 size={16} style={{ color: colors.primary }} />
            <span className="text-sm font-[Vazir-Bold]" style={{ color: colors.primary }}>
              ویرایش اطلاعات حساب
            </span>
          </button>
        </Card>
      ) : (
        /* ═══ حالت خالی - ثبت نشده ═══ */
        <Card
          variant="default"
          padding={24}
          radius={18}
          className="border-2 border-dashed"
          style={{ borderColor: colors.primary + '50' }}
        >
          <div className="flex flex-col items-center gap-4 text-center">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center"
              style={{ backgroundColor: colors.primary + '15' }}
            >
              <FiCreditCard size={32} style={{ color: colors.primary }} />
            </div>
            <div>
              <h4 className="text-base font-[Vazir-Bold] mb-1" style={{ color: colors.textMain }}>
                هنوز حساب بانکی ثبت نکرده‌اید
              </h4>
              <p
                className="text-xs leading-[20px] max-w-[280px]"
                style={{ color: colors.textSecondary }}
              >
                برای دریافت تسویه‌های خودکار، ابتدا شماره شبا و کارت خود را وارد کنید. حساب حتماً
                باید به نام صاحب کسب‌وکار (تطبیق با احراز هویت) باشد.
              </p>
            </div>
            <button
              onClick={onEdit}
              className="px-6 py-3 rounded-xl transition-all hover:scale-105 active:scale-95"
              style={{ backgroundColor: colors.primary }}
            >
              <span className="text-sm font-[Vazir-Bold] text-white">ثبت حساب بانکی</span>
            </button>
          </div>
        </Card>
      )}
    </div>
  );
}
