// src/app/model-requests/[id]/page.jsx
import ModelRequestDetailClient from './ModelRequestDetailClient';
import { getModelRequestIds, buildStaticParams, FALLBACK_IDS } from '@/utils/static-params';

/**
 * 🏗️ generateStaticParams — جزئیات درخواست مدل
 */
export async function generateStaticParams() {
  try {
    const ids = await getModelRequestIds();

    if (ids.length > 0) {
      return buildStaticParams(ids);
    }

    console.warn('[generateStaticParams] No model request IDs from API, using fallback');
    return buildStaticParams(FALLBACK_IDS.modelRequest);
  } catch (error) {
    console.error('[generateStaticParams] Model request page failed:', error.message);
    return buildStaticParams(FALLBACK_IDS.modelRequest);
  }
}

export const dynamic = 'force-static';
export const dynamicParams = false;

export default function ModelRequestDetailPage() {
  return <ModelRequestDetailClient />;
}