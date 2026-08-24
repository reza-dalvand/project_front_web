// src/app/business/[id]/page.jsx
import BusinessDetailsClient from './BusinessDetailsClient';
import { getBusinessIds, buildStaticParams, FALLBACK_IDS } from '@/utils/static-params';

/**
 * 🏗️ generateStaticParams — خروجی استاتیک
 *
 * ID های کسب‌وکارها را از بک‌اند دریافت می‌کند
 * تا در زمان build صفحات HTML ساخته شوند.
 *
 * ⚠️ برای Capacitor (APK) و هاست استاتیک الزامی است.
 */
export async function generateStaticParams() {
  try {
    const ids = await getBusinessIds();

    if (ids.length > 0) {
      return buildStaticParams(ids);
    }

    // اگر API هیچ داده‌ای نداد، از fallback استفاده کن
    console.warn('[generateStaticParams] No business IDs from API, using fallback');
    return buildStaticParams(FALLBACK_IDS.business);
  } catch (error) {
    console.error('[generateStaticParams] Business page failed:', error.message);
    return buildStaticParams(FALLBACK_IDS.business);
  }
}

// ✅ صفحه به صورت استاتیک تولید می‌شود
// اگر کاربر به ID ناشناخته‌ای برود، 404 نمایش داده می‌شود
export const dynamic = 'force-static';
export const dynamicParams = false;

export default function BusinessDetailsPage() {
  return <BusinessDetailsClient />;
}