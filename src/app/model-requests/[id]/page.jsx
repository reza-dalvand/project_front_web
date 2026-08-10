import ModelRequestDetailClient from './ModelRequestDetailClient';
import { MOCK_MODEL_REQUESTS } from '@/data/modelRequests';

export async function generateStaticParams() {
  return MOCK_MODEL_REQUESTS.map((req) => ({ id: req.id.toString() }));
}

export default function ModelRequestDetailPage() {
  return <ModelRequestDetailClient />;
}
