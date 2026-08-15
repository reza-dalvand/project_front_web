// src/components/manageBusiness/lineRental/FixedPriceFields.jsx
'use client';
import Card from '@/components/common/Card';
import Input from '@/components/common/Input';

export default function FixedPriceFields({
  fixedAmount,
  fixedDeposit,
  onFixedAmountChange,
  onFixedDepositChange,
}) {
  return (
    <Card variant="default" padding={14} radius={14}>
      <div className="[&>div]:mb-3 last:[&>div]:mb-0">
        <Input
          label="مبلغ اجاره ماهانه (تومان) *"
          placeholder="مثال: ۵,۰۰۰,۰۰۰"
          value={fixedAmount}
          onChangeText={onFixedAmountChange}
          type="tel"
        />
        <Input
          label="مبلغ رهن (اختیاری)"
          placeholder="مثال: ۲۰,۰۰۰,۰۰۰ یا خالی"
          value={fixedDeposit}
          onChangeText={onFixedDepositChange}
          type="tel"
        />
      </div>
    </Card>
  );
}