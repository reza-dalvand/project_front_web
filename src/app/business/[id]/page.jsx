// src/app/business/[id]/page.jsx
import BusinessDetailsClient from './BusinessDetailsClient';

// ✅ در حالت production با بک‌اند، دیگر generateStaticParams
// بر اساس ماک دیتا نداریم. صفحه کاملاً داینامیک رندر می‌شود.
// در صورت نیاز به SSG، لیست اسلاگ‌ها باید از بک‌اند گرفته شود.

export default function BusinessDetailsPage() {
  return <BusinessDetailsClient />;
}
