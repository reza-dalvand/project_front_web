import BusinessMapClient from './BusinessMapClient';
import { MOCK_BUSINESSES_MAP } from '@/data/businesses';

export async function generateStaticParams() {
  const ids = Object.keys(MOCK_BUSINESSES_MAP);
  return ids.map((id) => ({ id: id.toString() }));
}

export default function BusinessMapPage() {
  return <BusinessMapClient />;
}
