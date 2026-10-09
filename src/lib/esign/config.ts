import type { ServerEnv } from '@/lib/config/schema';

/**
 * Whether e-signature through Dropbox Sign is available on this deployment. Pure: the server
 * module passes the environment in.
 *
 * - DROPBOX_SIGN_API_KEY (server-only, required): without it the feature is "not available
 *   yet" and nothing claims it.
 * - DROPBOX_SIGN_CLIENT_ID (optional): an API app's client id, which applies that app's
 *   branding and callback URL. Without it events go to the account callback URL.
 * - DROPBOX_SIGN_TEST_MODE: test unless APP_ENV is production. Every other environment
 *   always sends test requests (not legally binding), whatever the flag says, so a preview
 *   can never send a binding request. Production sends live requests unless the flag is
 *   "true".
 *
 * Accounts and the service-role connection are needed too: requests are org data, and the
 * callback writes through service-role routines. A missing piece answers "misconfigured",
 * which fails this feature alone.
 */

export const ESIGN_ENV = {
  apiKey: 'DROPBOX_SIGN_API_KEY',
  clientId: 'DROPBOX_SIGN_CLIENT_ID',
  testMode: 'DROPBOX_SIGN_TEST_MODE',
} as const;

export type EsignConfig =
  | { state: 'disabled' }
  | { state: 'misconfigured'; reason: string }
  | {
      state: 'ready';
      apiKey: string;
      clientId: string | null;
      testMode: boolean;
      supabaseUrl: string;
      serviceRoleKey: string;
    };

type EsignEnv = Pick<
  ServerEnv,
  'APP_ENV' | 'APPLICATION_MODE' | 'SUPABASE_URL' | 'SUPABASE_SERVICE_ROLE_KEY'
>;

const blank = (value: string | undefined) =>
  value === undefined || value.trim() === '' ? undefined : value.trim();

export function esignConfig(env: EsignEnv, input: Record<string, string | undefined>): EsignConfig {
  const apiKey = blank(input[ESIGN_ENV.apiKey]);
  if (!apiKey) return { state: 'disabled' };
  if (!/^[A-Za-z0-9]{32,128}$/.test(apiKey)) {
    return { state: 'misconfigured', reason: 'api_key_malformed' };
  }
  const clientId = blank(input[ESIGN_ENV.clientId]) ?? null;
  if (clientId && !/^[A-Za-z0-9]{16,64}$/.test(clientId)) {
    return { state: 'misconfigured', reason: 'client_id_malformed' };
  }
  if (env.APPLICATION_MODE !== 'service') {
    return { state: 'misconfigured', reason: 'accounts_not_enabled' };
  }
  if (!env.SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) {
    return { state: 'misconfigured', reason: 'service_role_missing' };
  }
  const testMode =
    env.APP_ENV !== 'production' || blank(input[ESIGN_ENV.testMode])?.toLowerCase() === 'true';
  return {
    state: 'ready',
    apiKey,
    clientId,
    testMode,
    supabaseUrl: env.SUPABASE_URL,
    serviceRoleKey: env.SUPABASE_SERVICE_ROLE_KEY,
  };
}
