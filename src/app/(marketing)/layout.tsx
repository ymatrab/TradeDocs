import type { ReactNode } from 'react';
import { PublicShell } from '@/components/shell/public';

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return <PublicShell contained={false}>{children}</PublicShell>;
}
