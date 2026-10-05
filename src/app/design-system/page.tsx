import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { Showcase } from './showcase';

// Read at request time so the gate reflects the running environment, not the
// environment the bundle happened to be built in.
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Design system',
  robots: { index: false, follow: false, nocache: true },
};

export default function DesignSystemPage() {
  if (process.env.APP_ENV === 'production') notFound();
  return <Showcase />;
}
