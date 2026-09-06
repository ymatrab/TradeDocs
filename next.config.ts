import type { NextConfig } from 'next';
import { PHASE_PRODUCTION_BUILD, PHASE_PRODUCTION_SERVER } from 'next/constants';
import { validateDeploymentEnv } from './src/lib/config/schema';
import { securityHeaders } from './src/lib/security/headers';

export default function nextConfig(phase: string): NextConfig {
  const env = validateDeploymentEnv(
    process.env,
    [PHASE_PRODUCTION_BUILD, PHASE_PRODUCTION_SERVER].includes(phase),
  );
  return {
    poweredByHeader: false,
    reactStrictMode: true,
    experimental: { serverActions: { bodySizeLimit: '1mb' } },
    async headers() {
      return [
        {
          source: '/:path*',
          headers: securityHeaders(env.APP_ENV !== 'local' && env.APP_ENV !== 'test'),
        },
      ];
    },
  };
}
