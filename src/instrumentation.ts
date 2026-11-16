export async function register() {
  // The configuration derives secrets with node:crypto (config/defaults.ts), which only the
  // Node.js runtime provides. Every route and the proxy run there; no edge bundle loads it.
  if (process.env.NEXT_RUNTIME !== 'nodejs') return;
  const { validateDeploymentEnv } = await import('@/lib/config/schema');
  validateDeploymentEnv(process.env, process.env.NODE_ENV === 'production');
}
