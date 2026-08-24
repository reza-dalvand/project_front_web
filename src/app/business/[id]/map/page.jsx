// src/app/business/[id]/map/page.jsx
import BusinessMapClient from './BusinessMapClient';
import { getBusinessIds, buildStaticParams, FALLBACK_IDS } from '@/utils/static-params';

/**
 * 🏗️ generateStaticParams — نقشه کسب‌وکارها
 *
 * همان ID های صفحه کسب‌وکار را استفاده می‌کند
 * چون نقشه فقط برای کسب‌وکارهای موجود معنا دارد.
 */
export async function generateStaticParams() {
  try {
    const ids = await getBusinessIds();

    if (ids.length > 0) {
      return buildStaticParams(ids);
    }

    console.warn('[generateStaticParams] No business IDs for map, using fallback');
    return buildStaticParams(FALLBACK_IDS.business);
  } catch (error) {
    console.error('[generateStaticParams] Map page failed:', error.message);
    return buildStaticParams(FALLBACK_IDS.business);
  }
}

export const dynamic = 'force-static';
export const dynamicParams = false;

export default function BusinessMapPage() {
  return <BusinessMapClient />;
}