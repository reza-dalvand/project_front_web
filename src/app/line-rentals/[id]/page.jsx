import LineRentalDetailClient from './LineRentalDetailClient';

export async function generateStaticParams() {
  return MOCK_LINE_RENTALS.map((ad) => ({ id: ad.id.toString() }));
}

export default function LineRentalDetailPage() {
  return <LineRentalDetailClient />;
}
