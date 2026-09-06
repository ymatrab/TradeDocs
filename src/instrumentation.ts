import { validateDeploymentEnv } from '@/lib/config/schema';

export function register() {
  validateDeploymentEnv(process.env, process.env.NODE_ENV === 'production');
}
