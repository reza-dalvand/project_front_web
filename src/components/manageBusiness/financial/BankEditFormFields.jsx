// src/components/manageBusiness/financial/BankEditFormFields.jsx
'use client';
import { useTheme } from '@/stores/useThemeStore';
import Input from '@/components/common/Input';
import Dropdown from '@/components/common/Dropdown';
import { toPersianDigit } from '@/utils/numberUtils';
// ✅ FIX P2: import از فایل مشترک به جای تعریف محلی
import { getBankOptions } from '@/data/banks';

export default function BankEditFormFields({ form, errors, businessOwnerName, onFieldChange }) {
  const { colors } = useTheme();

  // ✅ FIX P2: استفاده از لیست مشترک
  const bankOptions = getBankOptions();

  return (
    <>
      {/* هشدار مهم */}
      <div
        className="flex items-start gap-3 p-3.5 rounded-xl border"
        style={{
          backgroundColor: '#E5393510',
          borderColor: '#E5393530',
        }}
      >
        <span className="text-lg flex-shrink-0">⚠️</span>
        <p className="text-xs font-[Vazir] leading-[18px] flex-1" style={{ color: '#E53935' }}>
          صاحب حساب باید حتماً همان شخصی باشد که کد ملی‌اش در مرحله ثبت کسب‌وکار تایید شده است.
        </p>
      </div>

      {/* نام صاحب حساب */}
      <Input
        label="نام و نام خانوادگی کامل *"
        placeholder="مثال: مریم حسینی"
        value={form.ownerName}
        onChangeText={(v) => onFieldChange('ownerName', v)}
        error={errors.ownerName}
        hint={businessOwnerName ? `نام تایید شده احراز هویت: ${businessOwnerName}` : undefined}
      />

      {/* کد ملی */}
      <Input
        label="کد ملی صاحب حساب *"
        placeholder="مثال: 0012345679"
        value={toPersianDigit(form.nationalId)}
        onChangeText={(v) => onFieldChange('nationalId', v)}
        error={errors.nationalId}
        type="tel"
        maxLength={10}
        hint={`${toPersianDigit(form.nationalId.length)} از ۱۰ رقم`}
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
        placeholder="IR + ۲۴ رقم (مثال: IR062960000000100324200001)"
        value={form.sheba}
        onChangeText={(v) => onFieldChange('sheba', v)}
        error={errors.sheba}
        maxLength={26}
      />

      {/* شماره کارت */}
      <Input
        label="شماره کارت *"
        placeholder="مثال: 6037991812345678"
        value={toPersianDigit(form.cardNumber)}
        onChangeText={(v) => onFieldChange('cardNumber', v)}
        error={errors.cardNumber}
        type="tel"
        maxLength={16}
        hint={`${toPersianDigit(form.cardNumber.length)} از ۱۶ رقم`}
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
