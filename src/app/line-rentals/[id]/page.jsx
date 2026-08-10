import LineRentalDetailClient from './LineRentalDetailClient';
import { MOCK_LINE_RENTALS } from '@/data/lineRentals';

export async function generateStaticParams() {
  return MOCK_LINE_RENTALS.map((ad) => ({ id: ad.id.toString() }));
}

export default function LineRentalDetailPage() {
  return <LineRentalDetailClient />;
}