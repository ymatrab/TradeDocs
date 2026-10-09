'use server';

import { revalidatePath } from 'next/cache';
import { hasEntitlement } from '@/lib/billing/server';
import { loadBrandingImages, needsBranding } from '@/lib/branding/server';
import { createDropboxSignClient } from '@/lib/esign/dropbox-sign';
import { initialSigners, parseSendForm, requestTexts } from '@/lib/esign/request';
import {
  currentEsignConfig,
  EsignRpcError,
  ESIGN_LIMITS,
  serviceRpc,
  sha256Hex,
} from '@/lib/esign/server';
import { documentKindLabel } from '@/lib/labels';
import { renderTradeDocument, type BrandingImages } from '@/lib/pdf/trade-document';
import { actionContext, consumeQuotas, userSubject } from '@/lib/security/auth-limits';
import { rateLimitMode } from '@/lib/security/rate-limit';
import { createClient } from '@/lib/supabase/server';
import { safeFileName } from '@/lib/zip';
import type { ActionState } from './actions';

/**
 * Sends a finalized document for e-signature through Dropbox Sign (D-025).
 *
 * Order matters:
 * 1. The form is validated (1 to 5 signers, distinct emails, a bounded message).
 * 2. The caller must be signed in and a member; the document is read as the caller, so
 *    another organization's document is simply not found.
 * 3. Paid gate, fail closed: hasEntitlement(org, 'esign'). The database checks again.
 * 4. The provider must be configured and quotas enforceable; sends are rate limited per
 *    account and per organization.
 * 5. Only a final document that still matches its shipment is sent, never a preview.
 * 6. The exact bytes are rendered from the immutable snapshot and their SHA-256 recorded
 *    with the request (lineage) before anything leaves TradeDocs. The row's id travels in
 *    the request metadata, so the callback can match a request whose confirmation failed.
 *
 * Nothing about the document or the signers is logged.
 */

const UNAVAILABLE = 'E-signature is not available yet on this workspace.';
const PRO_REQUIRED =
  'E-signature is part of Pro and Team. Upgrade the organization from Billing to send documents for signature.';

export async function sendForSignature(
  _previous: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = parseSendForm(formData);
  if (!parsed.ok) return { error: parsed.error, fields: parsed.fields };
  const { org, document: documentId, signers, message } = parsed.value;

  const client = await createClient();
  const {
    data: { user },
  } = await client.auth.getUser();
  if (!user) return { error: 'Sign in again, then retry.' };

  const { data: membership } = await client
    .from('memberships')
    .select('role')
    .eq('org_id', org)
    .eq('user_id', user.id)
    .maybeSingle();
  if (!membership) return { error: 'That document is not available.' };

  if (!(await hasEntitlement(org, 'esign'))) return { error: PRO_REQUIRED };

  const config = currentEsignConfig();
  if (config.state !== 'ready') {
    if (config.state === 'misconfigured') {
      console.error('esign: misconfigured', { reason: config.reason });
    }
    return { error: UNAVAILABLE };
  }

  const { env } = await actionContext();
  if (rateLimitMode(env).mode !== 'enforced') {
    console.error('esign: quotas not enforceable');
    return { error: UNAVAILABLE };
  }
  const quota = await consumeQuotas(env, [
    [ESIGN_LIMITS.sendAccount, userSubject(user.id)],
    [ESIGN_LIMITS.sendOrganization, `org:${org}`],
  ]);
  if (!quota.ok) return { error: quota.message };

  const { data: document } = await client
    .from('documents')
    .select('id, org_id, kind, number, status, snapshot, shipment_id, shipment_revision')
    .eq('id', documentId)
    .eq('org_id', org)
    .maybeSingle();
  if (!document) return { error: 'That document is not available.' };
  const snapshot = document.snapshot;
  const isSnapshot = snapshot !== null && typeof snapshot === 'object' && !Array.isArray(snapshot);
  if (document.status !== 'final' || !isSnapshot || 'preview' in snapshot) {
    return { error: 'Only a final document can be sent for signature.' };
  }
  const { data: shipment } = await client
    .from('shipments')
    .select('revision')
    .eq('id', document.shipment_id)
    .maybeSingle();
  if (!shipment || shipment.revision !== document.shipment_revision) {
    return {
      error:
        'The shipment changed after this document was generated. Regenerate it, then send the new one.',
    };
  }

  let images: BrandingImages | undefined;
  if (needsBranding(document.snapshot)) {
    const loaded = await loadBrandingImages(client, org, document.snapshot);
    if (!loaded)
      return { error: 'The document’s logo or signature image could not be loaded. Try again.' };
    images = loaded;
  }
  let pdf: Uint8Array;
  try {
    pdf = renderTradeDocument(document.snapshot, undefined, images);
  } catch {
    console.error('esign: document could not be rendered', { document: document.id });
    return { error: 'This document could not be rendered. Nothing was sent.' };
  }

  let requestId: string;
  try {
    requestId = await serviceRpc<string>(config, 'esign_create_request', {
      p_org: org,
      p_document: document.id,
      p_actor: user.id,
      p_signers: initialSigners(signers),
      p_message: message,
      p_test_mode: config.testMode,
      p_original_sha256: sha256Hex(pdf),
    });
  } catch (error) {
    if (error instanceof EsignRpcError && error.code === '42501') return { error: PRO_REQUIRED };
    if (error instanceof EsignRpcError && error.code === '23514') {
      return { error: 'Only a current, final document can be sent for signature.' };
    }
    console.error('esign: request not recorded', {
      status: error instanceof EsignRpcError ? error.status : 'unknown',
    });
    return { error: 'The request could not be recorded. Nothing was sent. Try again.' };
  }

  const kind = documentKindLabel(document.kind);
  const texts = requestTexts(document.number, kind);
  const provider = createDropboxSignClient(config.apiKey);
  let sent: Awaited<ReturnType<typeof provider.send>>;
  try {
    sent = await provider.send({
      pdf,
      fileName: `${safeFileName(document.number)}.pdf`,
      title: texts.title,
      subject: texts.subject,
      message,
      signers,
      testMode: config.testMode,
      clientId: config.clientId,
      requestId,
    });
  } catch {
    // A timeout may still have reached Dropbox Sign; if it did, its callback carries our id
    // and completes the record.
    sent = { ok: false, kind: 'unavailable', status: 0 };
  }

  if (!sent.ok) {
    await serviceRpc(config, 'esign_mark_failed', {
      p_request: requestId,
      p_reason: `provider_${sent.kind}_${sent.status}`,
    }).catch(() => undefined);
    console.error('esign: provider refused the request', { status: sent.status, kind: sent.kind });
    revalidatePath(`/app/${org}/documents/${document.id}/signature`);
    return {
      error:
        sent.kind === 'rejected'
          ? 'Dropbox Sign refused the request. Check the signers’ email addresses, then try again.'
          : 'Dropbox Sign could not be reached. Nothing was sent. Try again in a minute.',
    };
  }

  try {
    await serviceRpc(config, 'esign_mark_sent', {
      p_request: requestId,
      p_provider_request_id: sent.request.signature_request_id,
      p_signers: null,
    });
  } catch {
    // Sent, but not yet confirmed here: the callback matches it by id and records it.
    console.error('esign: send not confirmed locally', { request: requestId });
  }

  revalidatePath(`/app/${org}/documents/${document.id}/signature`);
  return {
    notice: config.testMode
      ? `Sent to ${signers.length === 1 ? 'the signer' : `${signers.length} signers`} as a test request through Dropbox Sign. A test request is not legally binding.`
      : `Sent to ${signers.length === 1 ? 'the signer' : `${signers.length} signers`} through Dropbox Sign. Each signer gets an email from Dropbox Sign with a link to sign.`,
  };
}
