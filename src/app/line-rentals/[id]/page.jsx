// src/app/line-rentals/[id]/page.jsx
import LineRentalDetailClient from './LineRentalDetailClient';
import { getLineRentalIds, buildStaticParams, FALLBACK_IDS } from '@/utils/static-params';

/**
 * 🏗️ generateStaticParams — جزئیات آگهی اجاره لاین
 */
export async function generateStaticParams() {
  try {
    const ids = await getLineRentalIds();

    if (ids.length > 0) {
      return buildStaticParams(ids);
    }

    console.warn('[generateStaticParams] No line rental IDs from API, using fallback');
    return buildStaticParams(FALLBACK_IDS.lineRental);
  } catch (error) {
    console.error('[generateStaticParams] Line rental page failed:', error.message);
    return buildStaticParams(FALLBACK_IDS.lineRental);
  }
}

export const dynamic = 'force-static';
export const dynamicParams = false;

export default function LineRentalDetailPage() {
  return <LineRentalDetailClient />;
}