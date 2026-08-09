// src/components/booking/RulesCard.jsx
'use client';
import { FiExternalLink } from 'react-icons/fi';
import Card from '@/components/common/Card';

export default function RulesCard({ colors }) {
  return (
    <Card variant="default" padding={16} radius={18}>
      <a
        href="https://zibano.app/rules/booking"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-3 p-4 rounded-xl border transition-all hover:scale-[1.01] active:scale-[0.99]"
        style={{
          backgroundColor: colors.primary + '08',
          borderColor: colors.primary + '25',
        }}
      >
        <FiExternalLink size={18} style={{ color: colors.primary }} />
        <span className="text-sm font-[Vazir-Bold] flex-1" style={{ color: colors.primary }}>
          برای مطالعه قوانین این قسمت به لینک زیر مراجعه کنید
        </span>
      </a>
    </Card>
  );
}
