// src/app/category/[id]/page.jsx
import CategoryBusinessesClient from './CategoryBusinessesClient';

// ✅ generateStaticParams حذف شد — صفحه کاملاً داینامیک است
// دسته‌بندی‌ها از بک‌اند در زمان رندر گرفته می‌شوند

export default function CategoryPage() {
  return <CategoryBusinessesClient />;
}
