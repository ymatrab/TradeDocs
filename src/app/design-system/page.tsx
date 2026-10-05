import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getServerEnv } from '@/lib/config/server';
import { Showcase } from './showcase';

// Read at request time so the gate reflects the running environment, not the
// environment the bundle happened to be built in.
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Design system',
  robots: { index: false, follow: false, nocache: true },
};

/** Resolved by the same validator as the rest of the server; any doubt counts as production. */
function isProduction(): boolean {
  try {
    return getServerEnv().APP_ENV === 'production';
  } catch {
    return true;
  }
}

export default function DesignSystemPage() {
  if (isProduction()) notFound();
  return <Showcase />;
}
