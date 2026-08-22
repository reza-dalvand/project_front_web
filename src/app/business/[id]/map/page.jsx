// src/app/business/[id]/map/page.jsx
import BusinessMapClient from './BusinessMapClient';

// ✅ generateStaticParams حذف شد — صفحه کاملاً داینامیک است
// و اطلاعات از بک‌اند در زمان رندر گرفته می‌شود

export default function BusinessMapPage() {
  return <BusinessMapClient />;
}