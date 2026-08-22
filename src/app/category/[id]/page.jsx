import CategoryBusinessesClient from './CategoryBusinessesClient';

export async function generateStaticParams() {
  return MOCK_CATEGORIES.map((c) => ({ id: c.id.toString() }));
}

export default function CategoryPage() {
  return <CategoryBusinessesClient />;
}
