// src/components/manageBusiness/lineRental/HourlyPriceFields.jsx
'use client';
import Card from '@/components/common/Card';
import Input from '@/components/common/Input';

export default function HourlyPriceFields({ hourlyRate, onHourlyRateChange }) {
  return (
    <Card variant="default" padding={14} radius={14}>
      <Input
        label="نرخ هر ساعت (تومان) *"
        placeholder="مثال: ۱۵۰,۰۰۰"
        value={hourlyRate}
        onChangeText={onHourlyRateChange}
        type="tel"
      />
    </Card>
  );
}