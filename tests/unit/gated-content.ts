import { expect } from 'vitest';
import { certificateOfOriginGate, gatedPublicPhrases } from '@/lib/trade/regulated';

/**
 * Shared by the content tests: whether this run's environment offers the certificate of
 * origin, by the same gate the server uses (flag, approval, service mode, review record).
 * Off in every ordinary run, so the gated phrases stay forbidden.
 */
export const COO_OFFERED = certificateOfOriginGate(process.env).state === 'on';

/** Fails if `text` uses a phrase that may not appear while its document is not offered. */
export function expectNoGatedPhrase(text: string, label?: string): void {
  for (const pattern of gatedPublicPhrases(COO_OFFERED)) {
    expect(text, label).not.toMatch(pattern);
  }
}
