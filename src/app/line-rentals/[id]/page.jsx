// src/app/line-rentals/[id]/page.jsx
import LineRentalDetailClient from './LineRentalDetailClient';

// ✅ generateStaticParams حذف شد — صفحه کاملاً داینامیک است

export default function LineRentalDetailPage() {
  return <LineRentalDetailClient />;
}