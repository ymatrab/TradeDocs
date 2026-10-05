import type { ReactNode } from 'react';
import { PublicShell } from '@/components/shell/public';
import { isDatabaseConfigured } from '@/lib/supabase/server';

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <PublicShell contained={false} accountsOpen={isDatabaseConfigured()}>
      {children}
    </PublicShell>
  );
}
