import type { Metadata } from 'next';
import { Planimeter } from '@/components/tools/Planimeter';

export const metadata: Metadata = {
  title: 'Planimeter',
  description:
    'An interactive polar planimeter: place the pole, set the tracer arm, trace a contour and watch the measuring wheel earn its reading in real time.',
};

export default function PlanimeterPage() {
  return <Planimeter />;
}
