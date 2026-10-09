/**
 * Synthetic Dropbox Sign payloads in the documented shapes (SignatureRequestResponse and
 * EventCallbackRequest in hellosign-openapi's openapi.yaml). No real account, request,
 * signer or key: every id, email and key here is invented for the tests.
 */

export const TEST_API_KEY = 'syntheticdropboxsignkeyfortestsonly';
export const PROVIDER_ID = 'fa5c9a166732164420acd5b1ae5d4a8fe31dbfa0';
export const ROW_ID = '22222222-2222-4222-8222-222222222222';
export const ORG_ID = '11111111-1111-4111-8111-111111111111';

export function liveRequest(overrides: Record<string, unknown> = {}) {
  return {
    signature_request_id: PROVIDER_ID,
    test_mode: true,
    is_complete: false,
    is_declined: false,
    has_error: false,
    expires_at: null,
    metadata: { tradedocs_request_id: ROW_ID },
    signatures: [
      {
        signature_id: '78caf2a1d01cd39cea2bc1cbb340dac3',
        signer_email_address: 'Buyer@Example.test',
        signer_name: 'Buyer',
        status_code: 'awaiting_signature',
        signed_at: null,
      },
      {
        signature_id: '616629ed37f8588d28600be17ab5d6b7',
        signer_email_address: 'agent@example.test',
        signer_name: 'Agent',
        status_code: 'signed',
        signed_at: 1760000000,
      },
    ],
    ...overrides,
  };
}

export function callbackEvent(eventType: string, eventTime: string, eventHash: string) {
  return {
    event: { event_time: eventTime, event_type: eventType, event_hash: eventHash },
    signature_request: {
      signature_request_id: PROVIDER_ID,
      metadata: { tradedocs_request_id: ROW_ID },
    },
  };
}

/** A minimal byte sequence that starts like a PDF. */
export const SIGNED_PDF = new TextEncoder().encode('%PDF-1.7\n% synthetic signed copy\n%%EOF\n');
