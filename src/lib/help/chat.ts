/**
 * Live chat is a slot, not a vendor (D-018). The owner has approved no chat vendor and no AI
 * spend, so the only provider is `none` and the help panel offers the FAQ search and the
 * contact form.
 *
 * Adding a vendor later means: a new value here, its script origin in the CSP, an entry in
 * the privacy and cookie pages, and a component rendered in the help panel's chat slot when
 * `resolveChatProvider` returns it. CHAT_PROVIDER is read outside the strict server schema so
 * an unknown value switches chat off rather than failing the deployment.
 */
export const CHAT_PROVIDERS = ['none'] as const;
export type ChatProvider = (typeof CHAT_PROVIDERS)[number];

export function resolveChatProvider(raw: string | undefined): ChatProvider {
  const value = raw?.trim().toLowerCase();
  return (CHAT_PROVIDERS as readonly string[]).includes(value ?? '')
    ? (value as ChatProvider)
    : 'none';
}
