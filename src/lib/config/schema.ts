import { z } from 'zod';

export const applicationEnvironments = [
  'local',
  'test',
  'preview',
  'staging',
  'production',
] as const;

const environment = z.enum(applicationEnvironments);
const optionalText = z.string().min(1).optional();
const optionalSecret = z.string().min(16).optional();
const flag = z
  .enum(['true', 'false'])
  .default('false')
  .transform((value) => value === 'true');

/** Pure schema: this module never reads process.env and may be imported by tooling. */
export const serverEnvSchema = z
  .object({
    APP_ENV: environment,
    APPLICATION_MODE: z.enum(['foundation', 'service']).default('foundation'),
    APP_URL: z.url().optional(),
    VERCEL_ENV: z.enum(['development', 'preview', 'production']).optional(),
    SUPABASE_URL: z.url().optional(),
    SUPABASE_ANON_KEY: optionalSecret,
    SUPABASE_SERVICE_ROLE_KEY: optionalSecret,
    SUPABASE_PROJECT_REF: z
      .string()
      .regex(/^[a-z0-9]{8,32}$/)
      .optional(),
    SUPABASE_ENVIRONMENT: environment.optional(),
    PRODUCTION_SUPABASE_PROJECT_REF: z
      .string()
      .regex(/^[a-z0-9]{8,32}$/)
      .optional(),
    RESEND_API_KEY: optionalSecret,
    EMAIL_FROM: optionalText,
    EMAIL_SANDBOX_RECIPIENT: z.email().optional(),
    TURNSTILE_SITE_KEY: optionalText,
    TURNSTILE_SECRET_KEY: optionalSecret,
    SENTRY_DSN: z.url().optional(),
    PDF_WORKER_URL: z.url().optional(),
    PDF_WORKER_TOKEN: optionalSecret,
    QUEUE_SIGNING_KEY: optionalSecret,
    PAYMENT_PROVIDER: z.enum(['disabled', 'stripe', 'paddle']).default('disabled'),
    PAYMENT_API_KEY: optionalSecret,
    PAYMENT_WEBHOOK_SECRET: optionalSecret,
    RATE_LIMIT_KEY_SECRET: z.string().min(32).optional(),
    INDEXNOW_KEY: optionalText,
    ANALYTICS_SITE_ID: optionalText,
    ENABLE_PAYMENTS: flag,
    ENABLE_REGULATED_DOCUMENTS: flag,
    ENABLE_TRANSACTIONAL_EMAIL: flag,
    PAYMENTS_APPROVED: flag,
    REGULATED_DOCUMENTS_APPROVED: flag,
    EMAIL_DELIVERY_APPROVED: flag,
    LAUNCH_APPROVED: flag,
  })
  .superRefine((value, context) => {
    const deployed = !['local', 'test'].includes(value.APP_ENV);
    const production = value.APP_ENV === 'production';
    const serviceMode = value.APPLICATION_MODE === 'service';
    const addIssue = (field: keyof typeof value, message: string) => {
      context.addIssue({ code: 'custom', path: [field], message });
    };

    if (value.VERCEL_ENV === 'production' && !production) {
      addIssue('APP_ENV', 'Must match the production deployment environment.');
    }
    if (value.VERCEL_ENV === 'preview' && !['preview', 'staging'].includes(value.APP_ENV)) {
      addIssue('APP_ENV', 'Must use preview or staging for a preview deployment.');
    }
    if (value.VERCEL_ENV === 'development' && production) {
      addIssue('APP_ENV', 'Production cannot use a development deployment.');
    }

    const supabaseFields = [
      'SUPABASE_URL',
      'SUPABASE_ANON_KEY',
      'SUPABASE_PROJECT_REF',
      'SUPABASE_ENVIRONMENT',
    ] as const;
    const anySupabaseField = supabaseFields.some((field) => Boolean(value[field]));
    if ((deployed && serviceMode) || anySupabaseField) {
      for (const field of supabaseFields) {
        if (!value[field]) addIssue(field, 'Required for configured database access.');
      }
    }
    if (deployed && serviceMode) {
      const required = [
        'APP_URL',
        'SUPABASE_SERVICE_ROLE_KEY',
        'PRODUCTION_SUPABASE_PROJECT_REF',
        'RATE_LIMIT_KEY_SECRET',
      ] as const;
      for (const field of required) {
        if (!value[field]) addIssue(field, 'Required for deployed environments.');
      }
    }
    if (value.SUPABASE_ENVIRONMENT && value.SUPABASE_ENVIRONMENT !== value.APP_ENV) {
      addIssue('SUPABASE_ENVIRONMENT', 'Must match APP_ENV.');
    }
    if (value.SUPABASE_URL) {
      let url: URL | undefined;
      try {
        url = new URL(value.SUPABASE_URL);
      } catch {
        addIssue('SUPABASE_URL', 'Must be a valid service URL.');
      }
      if (url) {
        const hostedProject = `${value.SUPABASE_PROJECT_REF}.supabase.co`;
        const loopback = ['127.0.0.1', 'localhost', '[::1]'].includes(url.hostname);
        if (url.hostname !== hostedProject && !(loopback && !deployed)) {
          addIssue(
            'SUPABASE_URL',
            'Must identify the configured hosted project or a local test service.',
          );
        }
        if (url.pathname !== '/' || url.search || url.hash || url.username || url.password) {
          addIssue(
            'SUPABASE_URL',
            'Must be a service origin without credentials, path, query or fragment.',
          );
        }
      }
    }
    if (
      !production &&
      value.SUPABASE_PROJECT_REF &&
      value.PRODUCTION_SUPABASE_PROJECT_REF === value.SUPABASE_PROJECT_REF
    ) {
      addIssue('SUPABASE_PROJECT_REF', 'Non-production must not use the production project.');
    }
    if (production && value.SUPABASE_PROJECT_REF !== value.PRODUCTION_SUPABASE_PROJECT_REF) {
      addIssue('SUPABASE_PROJECT_REF', 'Production must identify the approved production project.');
    }

    for (const field of ['APP_URL', 'SUPABASE_URL', 'PDF_WORKER_URL', 'SENTRY_DSN'] as const) {
      const raw = value[field];
      if (!raw) continue;
      let url: URL;
      try {
        url = new URL(raw);
      } catch {
        addIssue(field, 'Must be a valid service URL.');
        continue;
      }
      if (deployed && url.protocol !== 'https:') {
        addIssue(field, 'Deployed services require HTTPS.');
      }
      if (!['https:', 'http:'].includes(url.protocol)) {
        addIssue(field, 'Must use HTTP or HTTPS.');
      }
      if (field !== 'SENTRY_DSN' && (url.username || url.password)) {
        addIssue(field, 'Credentials must not appear in service URLs.');
      }
      if (field === 'APP_URL' && (url.pathname !== '/' || url.search || url.hash)) {
        addIssue(field, 'Must be the canonical application origin.');
      }
    }

    if (
      value.ENABLE_PAYMENTS &&
      (!value.PAYMENTS_APPROVED ||
        value.PAYMENT_PROVIDER === 'disabled' ||
        !value.PAYMENT_API_KEY ||
        !value.PAYMENT_WEBHOOK_SECRET)
    ) {
      addIssue('ENABLE_PAYMENTS', 'Requires an approved, fully configured payment provider.');
    }
    if (value.ENABLE_REGULATED_DOCUMENTS && !value.REGULATED_DOCUMENTS_APPROVED) {
      addIssue('ENABLE_REGULATED_DOCUMENTS', 'Requires a recorded legal and regulatory approval.');
    }
    if (
      value.ENABLE_TRANSACTIONAL_EMAIL &&
      (!value.EMAIL_DELIVERY_APPROVED || !value.RESEND_API_KEY || !value.EMAIL_FROM)
    ) {
      addIssue('ENABLE_TRANSACTIONAL_EMAIL', 'Requires approved and configured email delivery.');
    }
    if (!production && value.ENABLE_TRANSACTIONAL_EMAIL && !value.EMAIL_SANDBOX_RECIPIENT) {
      addIssue('EMAIL_SANDBOX_RECIPIENT', 'Non-production delivery requires a sandbox recipient.');
    }
    if (
      !serviceMode &&
      (value.ENABLE_PAYMENTS ||
        value.ENABLE_REGULATED_DOCUMENTS ||
        value.ENABLE_TRANSACTIONAL_EMAIL)
    ) {
      addIssue('APPLICATION_MODE', 'Foundation deployments cannot enable customer capabilities.');
    }
    if (production && serviceMode) {
      for (const field of [
        'RESEND_API_KEY',
        'EMAIL_FROM',
        'TURNSTILE_SITE_KEY',
        'TURNSTILE_SECRET_KEY',
        'SENTRY_DSN',
        'PDF_WORKER_URL',
        'PDF_WORKER_TOKEN',
        'QUEUE_SIGNING_KEY',
        'INDEXNOW_KEY',
        'ANALYTICS_SITE_ID',
      ] as const) {
        if (!value[field]) addIssue(field, 'Required before production deployment.');
      }
      if (!value.LAUNCH_APPROVED)
        addIssue('LAUNCH_APPROVED', 'Requires the approved release checklist.');
    }
  });

export type ServerEnv = z.output<typeof serverEnvSchema>;
export type EnvironmentInput = Record<string, string | undefined>;

export class ConfigurationError extends Error {
  constructor(readonly fields: readonly string[]) {
    // Never include raw input, a Zod issue message or credential-bearing URL.
    super(`Invalid server configuration. Review: ${fields.join(', ')}.`);
    this.name = 'ConfigurationError';
  }
}

export function parseServerEnv(input: EnvironmentInput): ServerEnv {
  const normalized = Object.fromEntries(
    Object.entries(input).map(([key, value]) => [key, value === '' ? undefined : value]),
  );
  const result = serverEnvSchema.safeParse(normalized);
  if (!result.success) {
    const fields = [
      ...new Set(result.error.issues.map((issue) => issue.path[0]?.toString() ?? 'APP_ENV')),
    ].sort();
    throw new ConfigurationError(fields);
  }
  return result.data;
}

/** Called by next.config at build and by instrumentation at server startup. */
export function validateDeploymentEnv(
  input: EnvironmentInput,
  productionRuntime: boolean,
): ServerEnv {
  const explicitEnvironment = input.APP_ENV?.trim() || undefined;
  const inferredEnvironment =
    input.VERCEL_ENV === 'production'
      ? 'production'
      : input.VERCEL_ENV === 'preview'
        ? 'preview'
        : input.VERCEL_ENV === 'development'
          ? 'local'
          : productionRuntime
            ? undefined
            : 'local';
  const env = parseServerEnv({ ...input, APP_ENV: explicitEnvironment ?? inferredEnvironment });
  if (productionRuntime && env.APP_ENV === 'local') {
    throw new ConfigurationError(['APP_ENV']);
  }
  return env;
}
