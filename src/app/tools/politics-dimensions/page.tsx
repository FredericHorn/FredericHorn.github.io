import type { Metadata } from 'next';
import { PoliticsDimensions } from '@/components/tools/PoliticsDimensions';

export const metadata: Metadata = {
  title: 'How many dimensions does politics have?',
  description:
    'An interactive essay on SVD & PCA, using real Wahl-O-Mat 2025 data to find how many axes German party politics really has.',
};

export default function PoliticsDimensionsPage() {
  return <PoliticsDimensions />;
}
