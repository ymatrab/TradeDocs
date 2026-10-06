import 'server-only';

import type { Metadata } from 'next';
import { isLegalApproved, readLegalIdentity, type LegalIdentity } from './identity';

export function getLegalIdentity(): LegalIdentity {
  return readLegalIdentity(process.env);
}

export function legalPagesApproved(): boolean {
  return isLegalApproved(getLegalIdentity());
}

/**
 * A draft legal page is never indexed (D-009): it is noindex here, absent from the sitemap
 * and llms.txt, and carries a visible banner. Once approved it inherits the deployment's
 * own indexing decision from the root layout like every other public page.
 */
export function legalMetadata(path: string, title: string, description: string): Metadata {
  const approved = legalPagesApproved();
  return {
    title,
    description,
    alternates: { canonical: path },
    ...(approved ? {} : { robots: { index: false, follow: true, nocache: true } }),
  };
}
