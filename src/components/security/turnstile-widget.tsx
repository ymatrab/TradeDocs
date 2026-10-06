'use client';

import { useEffect, useRef, useState } from 'react';

type TurnstileApi = {
  render(container: HTMLElement, options: Record<string, unknown>): string;
  reset(widgetId?: string): void;
  remove(widgetId: string): void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

const SCRIPT_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
let loading: Promise<TurnstileApi> | null = null;

/**
 * Loads Cloudflare's script once per page. It is inserted by this already-trusted bundle, so
 * the nonce-based CSP admits it through 'strict-dynamic'; frame-src and connect-src already
 * name challenges.cloudflare.com.
 */
function loadTurnstile(): Promise<TurnstileApi> {
  if (window.turnstile) return Promise.resolve(window.turnstile);
  if (!loading) {
    loading = new Promise<TurnstileApi>((resolve, reject) => {
      const script = document.createElement('script');
      script.src = SCRIPT_SRC;
      script.async = true;
      script.onload = () =>
        window.turnstile ? resolve(window.turnstile) : reject(new Error('turnstile_missing'));
      script.onerror = () => {
        loading = null;
        reject(new Error('turnstile_load_failed'));
      };
      document.head.append(script);
    });
  }
  return loading;
}

/**
 * Cloudflare Turnstile, rendered only when the server says the challenge is active.
 *
 * Inside a form the widget writes its token into a hidden `cf-turnstile-response` field, so
 * a server action reads it like any other input; a fetch caller takes it from `onToken`.
 * Tokens are single-use: change `resetKey` after every submission to get a fresh one.
 *
 * `siteKey` undefined means "ask the server" (for client-only screens); null means the
 * challenge is off and nothing renders.
 */
export function TurnstileWidget({
  siteKey,
  action,
  resetKey,
  onToken,
}: {
  siteKey?: string | null;
  action: string;
  resetKey?: unknown;
  onToken?: (token: string | null) => void;
}) {
  const container = useRef<HTMLDivElement>(null);
  const widget = useRef<string | null>(null);
  const tokenCallback = useRef(onToken);
  const [fetchedKey, setFetchedKey] = useState<string | null | undefined>(undefined);
  const resolvedKey = siteKey !== undefined ? siteKey : fetchedKey;
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    tokenCallback.current = onToken;
  }, [onToken]);

  useEffect(() => {
    if (siteKey !== undefined) return;
    let cancelled = false;
    fetch('/api/security/challenge', { cache: 'no-store' })
      .then((response) => (response.ok ? response.json() : { siteKey: null }))
      .then((body: { siteKey?: unknown }) => {
        if (!cancelled) setFetchedKey(typeof body.siteKey === 'string' ? body.siteKey : null);
      })
      .catch(() => {
        // The server still decides: if the challenge is active it refuses the submission
        // and says why, so a failed lookup cannot silently skip the check.
        if (!cancelled) setFetchedKey(null);
      });
    return () => {
      cancelled = true;
    };
  }, [siteKey]);

  useEffect(() => {
    if (!resolvedKey || !container.current) return;
    let cancelled = false;
    const element = container.current;
    loadTurnstile()
      .then((api) => {
        if (cancelled || widget.current) return;
        widget.current = api.render(element, {
          sitekey: resolvedKey,
          action,
          appearance: 'interaction-only',
          callback: (token: string) => tokenCallback.current?.(token),
          'expired-callback': () => tokenCallback.current?.(null),
          'error-callback': () => {
            tokenCallback.current?.(null);
            setFailed(true);
          },
        });
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });
    return () => {
      cancelled = true;
      if (widget.current && window.turnstile) window.turnstile.remove(widget.current);
      widget.current = null;
    };
  }, [resolvedKey, action]);

  useEffect(() => {
    if (resetKey === undefined || !widget.current || !window.turnstile) return;
    tokenCallback.current?.(null);
    window.turnstile.reset(widget.current);
  }, [resetKey]);

  if (!resolvedKey) return null;
  return (
    <div>
      <div ref={container} />
      {failed ? (
        <p className="error-text" role="alert" style={{ margin: '8px 0 0' }}>
          The security check could not load. Reload the page, or allow
          challenges.cloudflare.com if a blocker is stopping it.
        </p>
      ) : null}
    </div>
  );
}
