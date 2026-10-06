'use client';

import { useCallback, useState } from 'react';
import Link from 'next/link';
import { LifeBuoy } from 'lucide-react';
import { Dialog } from '@/components/primitives/dialog';
import { LoadingBlock } from '@/components/primitives/feedback';
import type { HelpEntry } from '@/lib/content/faq';
import type { ChatProvider } from '@/lib/help/chat';
import { HelpSearch } from './help-search';

type Index =
  | { state: 'idle' }
  | { state: 'loading' }
  | { state: 'ready'; entries: HelpEntry[] }
  | { state: 'failed' };

/** The questions shown before anything is typed: the account and support set. */
const SUGGESTED = 5;

/**
 * The floating "Help" button on the public and workspace shells, and the panel it opens.
 *
 * The panel is the native modal dialog (components/primitives/dialog), so the browser traps
 * focus inside it, closes it on Escape and returns focus to this button. The answers are
 * fetched once, on first open, from /api/help/faq. `chat` is the vendor slot (lib/help/chat):
 * it is always `none` until the owner approves a provider.
 */
export function HelpLauncher({ chat = 'none' }: { chat?: ChatProvider }) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState<Index>({ state: 'idle' });

  const load = useCallback(async () => {
    setIndex({ state: 'loading' });
    try {
      const response = await fetch('/api/help/faq', { credentials: 'omit' });
      if (!response.ok) throw new Error(String(response.status));
      const body = (await response.json()) as { entries?: HelpEntry[] };
      setIndex({ state: 'ready', entries: Array.isArray(body.entries) ? body.entries : [] });
    } catch {
      setIndex({ state: 'failed' });
    }
  }, []);

  const show = () => {
    setOpen(true);
    if (index.state === 'idle' || index.state === 'failed') void load();
  };

  return (
    <>
      <button
        type="button"
        className="help-launcher"
        onClick={show}
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        <LifeBuoy size={18} aria-hidden="true" />
        Help
      </button>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        title="How can we help?"
        description="Search the answers from across TradeDocs, or send us a message."
        footer={
          <>
            <Link className="btn quiet" href="/help" onClick={() => setOpen(false)}>
              Open the help centre
            </Link>
            <Link className="btn" href="/contact" onClick={() => setOpen(false)}>
              Contact us
            </Link>
            <button type="button" className="btn secondary" onClick={() => setOpen(false)}>
              Close
            </button>
          </>
        }
      >
        {index.state === 'ready' ? (
          <HelpSearch
            entries={index.entries}
            suggestions={index.entries.slice(0, SUGGESTED)}
            limit={8}
            autoFocus
            label="Search the help answers"
          />
        ) : index.state === 'failed' ? (
          <p className="muted" role="alert" style={{ margin: 0 }}>
            The answers could not be loaded.{' '}
            <button type="button" className="text-link help-retry" onClick={() => void load()}>
              Try again
            </button>{' '}
            or use the contact form.
          </p>
        ) : (
          <LoadingBlock label="Loading the help answers" lines={4} />
        )}
        {chat !== 'none' ? <div className="help-chat-slot" data-provider={chat} /> : null}
      </Dialog>
    </>
  );
}
