'use client';

import Link from 'next/link';
import { useActionState, useRef, useState } from 'react';
import { Button } from '@/components/primitives/button';
import { Callout } from '@/components/primitives/feedback';
import { Field, Input } from '@/components/primitives/form';
import { ActionResult } from '@/components/primitives/action-result';
import { useInvalidFocus } from '@/components/primitives/use-invalid-focus';
import { removeBrandingImage, uploadBrandingImage } from '@/app/(app)/branding-actions';
import type { ActionState } from '@/app/(app)/actions';

export type BrandingImageView = {
  /** A short-lived signed URL, or null when one could not be made. */
  previewUrl: string | null;
  width: number;
  height: number;
  format: 'png' | 'jpeg';
  byteSize: number;
};

export type BrandingSlotView = {
  slot: 'logo' | 'signature';
  label: string;
  /** Where and how large it prints, from the renderer's own constants. */
  placement: string;
  current: BrandingImageView | null;
};

function describe(image: BrandingImageView): string {
  const kilobytes = Math.max(1, Math.round(image.byteSize / 1024));
  return `${image.format === 'png' ? 'PNG' : 'JPEG'} · ${image.width} × ${image.height} px · ${kilobytes} KB`;
}

function BrandingSlot({
  org,
  view,
  canUpload,
  canRemove,
  maxBytes,
  requirements,
}: {
  org: string;
  view: BrandingSlotView;
  canUpload: boolean;
  canRemove: boolean;
  maxBytes: number;
  requirements: string;
}) {
  const [uploaded, upload, uploading] = useActionState<ActionState, FormData>(
    uploadBrandingImage,
    {},
  );
  const [removed, remove, removing] = useActionState<ActionState, FormData>(
    removeBrandingImage,
    {},
  );
  const [tooLarge, setTooLarge] = useState(false);
  const form = useRef<HTMLFormElement>(null);
  useInvalidFocus(form, uploaded.fields);
  const id = `branding-${view.slot}`;
  const sizeError = tooLarge ? 'Use an image of 1 MB or smaller.' : undefined;

  return (
    <section aria-labelledby={`${id}-title`} style={{ display: 'grid', gap: 12, paddingTop: 4 }}>
      <h3 id={`${id}-title`} style={{ margin: 0 }}>
        {view.label}
      </h3>
      <p className="muted" style={{ margin: 0 }}>
        {view.placement}
      </p>
      <ActionResult state={uploaded} successTitle="Saved" />
      <ActionResult state={removed} successTitle="Removed" />

      {view.current ? (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'center' }}>
          <div
            style={{
              display: 'grid',
              placeItems: 'center',
              width: 240,
              maxWidth: '100%',
              height: 96,
              padding: 8,
              border: '1px solid var(--line, #d0d0d0)',
              borderRadius: 6,
              background: '#fff',
            }}
          >
            {view.current.previewUrl ? (
              // eslint-disable-next-line @next/next/no-img-element -- a short-lived signed URL from private storage
              <img
                src={view.current.previewUrl}
                alt={`Current ${view.label.toLowerCase()}`}
                style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
              />
            ) : (
              <span className="muted">Preview unavailable. Reload to try again.</span>
            )}
          </div>
          <p className="muted" style={{ margin: 0 }}>
            {describe(view.current)}
          </p>
          {canRemove ? (
            <form action={remove}>
              <input type="hidden" name="org" value={org} />
              <input type="hidden" name="slot" value={view.slot} />
              <Button type="submit" tone="secondary" pending={removing} pendingLabel="Removing…">
                Remove
              </Button>
            </form>
          ) : null}
        </div>
      ) : (
        <p className="muted" style={{ margin: 0 }}>
          No {view.label.toLowerCase()} yet.
        </p>
      )}

      <form ref={form} action={upload} style={{ display: 'grid', gap: 12 }} noValidate>
        <input type="hidden" name="org" value={org} />
        <input type="hidden" name="slot" value={view.slot} />
        <fieldset
          disabled={!canUpload}
          style={{ display: 'grid', gap: 12, border: 0, padding: 0, margin: 0 }}
        >
          <Field
            id={`${id}-image`}
            label={
              view.current
                ? `Replace the ${view.label.toLowerCase()}`
                : `Upload a ${view.label.toLowerCase()}`
            }
            hint={requirements}
            error={sizeError ?? uploaded.fields?.image}
          >
            {({ id: inputId, describedBy, invalid }) => (
              <Input
                id={inputId}
                name="image"
                type="file"
                accept="image/png,image/jpeg"
                invalid={invalid}
                aria-describedby={describedBy}
                onChange={(event) => setTooLarge((event.target.files?.[0]?.size ?? 0) > maxBytes)}
              />
            )}
          </Field>
          <div>
            <Button
              type="submit"
              pending={uploading}
              pendingLabel="Uploading…"
              disabled={!canUpload || uploading || tooLarge}
            >
              {view.current ? 'Replace' : 'Upload'}
            </Button>
          </div>
        </fieldset>
      </form>
    </section>
  );
}

/**
 * Branding on the document settings page: the logo and the signature or stamp image.
 *
 * Shown to everyone. Without Pro or Team the controls are present but disabled, with a plain
 * statement that branding is a paid feature and where to get it; nothing else on the page
 * changes. The server decides every case again: these flags only shape the screen.
 */
export function BrandingPanel({
  org,
  slots,
  entitled,
  canManage,
  loadFailed,
  maxBytes,
  requirements,
}: {
  org: string;
  slots: BrandingSlotView[];
  entitled: boolean;
  canManage: boolean;
  loadFailed: boolean;
  maxBytes: number;
  requirements: string;
}) {
  return (
    <div style={{ display: 'grid', gap: 16 }}>
      {entitled ? null : (
        <Callout tone="neutral" title="Branding is part of Pro">
          Your logo and signature or stamp on every document come with Pro and Team. See{' '}
          <Link className="text-link" href={`/app/${org}/billing`}>
            Billing
          </Link>{' '}
          for this organization’s plan, or{' '}
          <Link className="text-link" href="/pricing">
            pricing
          </Link>{' '}
          for what each plan includes. Everything else on this page stays free.
        </Callout>
      )}
      {entitled && !canManage ? (
        <Callout tone="neutral" title="Ask an owner or administrator">
          Only an owner or an administrator can change the branding.
        </Callout>
      ) : null}
      {loadFailed ? (
        <Callout tone="warning" title="Branding could not be loaded">
          Reload the page to try again. This does not change the documents you generate.
        </Callout>
      ) : (
        slots.map((view) => (
          <BrandingSlot
            key={view.slot}
            org={org}
            view={view}
            canUpload={entitled && canManage}
            canRemove={canManage}
            maxBytes={maxBytes}
            requirements={requirements}
          />
        ))
      )}
    </div>
  );
}
