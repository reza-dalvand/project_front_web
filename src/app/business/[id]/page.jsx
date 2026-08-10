// src/app/business/[id]/page.jsx
import BusinessDetailsClient from './BusinessDetailsClient';
import { MOCK_BUSINESSES_LIST, MOCK_BUSINESSES_MAP } from '@/data/businesses';

// ✅ این تابع Server-side است و باید اینجا بماند
export async function generateStaticParams() {
  const allIds = [
    ...MOCK_BUSINESSES_LIST.map((b) => b.id),
    ...Object.keys(MOCK_BUSINESSES_MAP),
  ];
  const uniqueIds = [...new Set(allIds)];
  return uniqueIds.map((id) => ({ id: id.toString() }));
}

// ✅ این فایل "use client" ندارد، پس می‌تواند generateStaticParams داشته باشد
export default function BusinessDetailsPage() {
  return <BusinessDetailsClient />;
}