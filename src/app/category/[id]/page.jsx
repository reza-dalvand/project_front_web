// src/app/category/[id]/page.jsx
import CategoryBusinessesClient from './CategoryBusinessesClient';
import { getCategoryIds, buildStaticParams, FALLBACK_IDS } from '@/utils/static-params';

/**
 * 🏗️ generateStaticParams — صفحات دسته‌بندی
 *
 * ID های دسته‌بندی‌ها را از بک‌اند دریافت می‌کند.
 */
export async function generateStaticParams() {
  try {
    const ids = await getCategoryIds();

    if (ids.length > 0) {
      return buildStaticParams(ids);
    }

    console.warn('[generateStaticParams] No category IDs from API, using fallback');
    return buildStaticParams(FALLBACK_IDS.category);
  } catch (error) {
    console.error('[generateStaticParams] Category page failed:', error.message);
    return buildStaticParams(FALLBACK_IDS.category);
  }
}

export const dynamic = 'force-static';
export const dynamicParams = false;

export default function CategoryPage() {
  return <CategoryBusinessesClient />;
}