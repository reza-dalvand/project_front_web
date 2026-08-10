import CategoryBusinessesClient from './CategoryBusinessesClient';
import { MOCK_CATEGORIES } from '@/data/businesses';

export async function generateStaticParams() {
  return MOCK_CATEGORIES.map((c) => ({ id: c.id.toString() }));
}

export default function CategoryPage() {
  return <CategoryBusinessesClient />;
}