import { waivableControls, type ServerEnv, type WaivableControl } from './schema';

const controlNames = Object.keys(waivableControls) as WaivableControl[];

/**
 * Whether a waivable control runs. Any configured key activates it, whatever its waiver says
 * (D-017): only an explicit waiver with no keys at all switches a control off.
 */
export function controlActive(env: ServerEnv, control: WaivableControl): boolean {
  const keys: readonly (keyof ServerEnv)[] = waivableControls[control].keys;
  return keys.some((field) => Boolean(env[field]));
}

/** Controls switched off by an explicit owner waiver. Names only; never values. */
export function degradedControls(env: ServerEnv): WaivableControl[] {
  return controlNames.filter(
    (control) => env[waivableControls[control].waiver] && !controlActive(env, control),
  );
}

/**
 * Whether bot-challenge verification must run. Any path that accepts a Turnstile token must
 * verify it whenever this is true; it may skip verification only when this is false.
 */
export function turnstileEnforced(env: ServerEnv): boolean {
  return controlActive(env, 'turnstile');
}
