// src/components/manageBusiness/financial/BankEditFormFields.jsx
'use client';
import { useTheme } from '@/stores/useThemeStore';
import Input from '@/components/common/Input';
import Dropdown from '@/components/common/Dropdown';
import { getBankOptions } from '@/constants/banks';
import { toPersianDigit } from '@/utils/numberUtils';

export default function BankEditFormFields({ 
  form, 
  errors, 
  businessOwnerName, 
  isVerified, 
  verifiedName, 
  onFieldChange 
}) {
  const { colors } = useTheme();
  const bankOptions = getBankOptions();

  return (
    <>
      {/* هشدار مهم */}
      {!isVerified && (
        <div className="flex items-start gap-2 p-3 rounded-xl border mb-4"
            style={{ backgroundColor: '#FF980008', borderColor: '#FF980030' }}>
          <span className="text-base">⚠️</span>
          <p className="text-xs font-[Vazir] leading-5 flex-1" style={{ color: colors.textSecondary }}>
            برای ثبت اطلاعات بانکی، ابتدا باید <strong>کد ملی</strong> خود را در بخش تنظیمات/پروفایل تایید کنید.
            نام صاحب حساب به صورت خودکار از روی کد ملی شما تنظیم می‌شود.
          </p>
        </div>
      )}

      <Input
        label="نام صاحب حساب *"
        value={isVerified ? (verifiedName || 'تایید نشده') : 'تایید نشده'}
        disabled={true} // همیشه غیرقابل ویرایش است (یا تایید نشده یا از کد ملی خوانده می‌شود)
        hint={isVerified ? "این نام بر اساس استعلام کد ملی شما به صورت خودکار تنظیم شده است" : "ابتدا کد ملی خود را تایید کنید"}
      />

      {/* نام بانک */}
      <div>
        <Dropdown
          label="نام بانک *"
          placeholder="بانک را انتخاب کنید"
          value={form.bankId}
          options={bankOptions}
          onSelect={(val) => onFieldChange('bankId', val)}
        />
        {errors.bankId && (
          <div className="flex items-center gap-1 mt-[-8px] mb-2 px-1">
            <span className="text-xs font-[Vazir]" style={{ color: '#E53935' }}>
              {errors.bankId}
            </span>
          </div>
        )}
      </div>

      {/* شماره شبا */}
      <Input
        label="شماره شبا *"
        placeholder="IR000000000000000000000000"
        value={form.sheba}
        onChangeText={(v) => onFieldChange('sheba', v)}
        error={errors.sheba}
        maxLength={26}
      />

      {/* شماره کارت */}
      <Input
        label="شماره کارت *"
        placeholder="مثال: ۶۰۳۷۹۹۱۸۱۲۳۴۵۶۷۸"
        value={toPersianDigit(form.cardNumber)}
        onChangeText={(v) => onFieldChange('cardNumber', v)}
        error={errors.cardNumber}
        type="tel"
        maxLength={16}
      />

      {/* نکات */}
      <div className="p-4 rounded-xl" style={{ backgroundColor: colors.background }}>
        <p className="text-xs font-[Vazir-Bold] mb-2" style={{ color: colors.textMain }}>
          نکات مهم:
        </p>
        <ul className="space-y-1.5">
          {[
            'تایید اطلاعات توسط کارشناسان حدود ۲۴ تا ۴۸ ساعت زمان می‌برد',
            'پس از تایید، تمامی بیعانه‌ها ظرف ۴۸ ساعت بعد از انجام خدمت واریز می‌شوند',
            'تغییر حساب بعداً هم ممکن است اما مجدداً وارد چرخه تایید خواهد شد',
          ].map((note, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="text-xs mt-0.5" style={{ color: colors.primary }}>
                •
              </span>
              <span className="text-[11px] leading-[18px]" style={{ color: colors.textSecondary }}>
                {note}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}