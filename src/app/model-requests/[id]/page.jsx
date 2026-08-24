// src/app/model-requests/[id]/page.jsx
import ModelRequestDetailClient from './ModelRequestDetailClient';

// ✅ generateStaticParams حذف شد — صفحه کاملاً داینامیک است

export default function ModelRequestDetailPage() {
  return <ModelRequestDetailClient />;
}
