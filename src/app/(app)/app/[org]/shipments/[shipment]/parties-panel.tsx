'use client';

import { useActionState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/primitives/button';
import { Field, Select } from '@/components/primitives/form';
import { Panel } from '@/components/primitives/feedback';
import { ActionResult } from '@/components/primitives/action-result';
import { partyRoleLabels, type PartyRole } from '@/lib/labels';
import { setShipmentParty } from '@/app/(app)/master-data-actions';
import type { ActionState } from '@/app/(app)/actions';

export type PartyOption = {
  id: string;
  name: string;
  city: string | null;
  country_code: string | null;
};

export type PartySelection = Record<PartyRole, string | null>;

const descriptions: Record<PartyRole, string> = {
  exporter_id: 'The seller and shipper. Appears as the issuer on every document in the set.',
  consignee_id: 'Who the goods are consigned to.',
  notify_id: 'Told of the arrival. Often the buyer’s agent, and often the same as the consignee.',
};

function place(option: PartyOption): string {
  const where = [option.city, option.country_code].filter(Boolean).join(', ');
  return where ? `${option.name} (${where})` : option.name;
}

/**
 * Sets the three parties from the saved directory.
 *
 * Each selector saves on its own so a shipment can be assembled as the information
 * arrives, which is how it actually arrives — the consignee is usually known long before
 * the notify party is.
 */
export function PartiesPanel({
  org,
  shipmentId,
  options,
  selected,
}: {
  org: string;
  shipmentId: string;
  options: PartyOption[];
  selected: PartySelection;
}) {
  const [state, action, pending] = useActionState<ActionState, FormData>(setShipmentParty, {});
  const roles = Object.keys(partyRoleLabels) as PartyRole[];

  return (
    <Panel
      title="Parties"
      actions={
        <Link className="text-link" href={`/app/${org}/companies`}>
          Manage companies
        </Link>
      }
    >
      <div style={{ display: 'grid', gap: 16 }}>
        <ActionResult state={state} successTitle="Saved" />

        {options.length === 0 ? (
          <p className="muted" style={{ marginBottom: 0 }}>
            No companies saved yet.{' '}
            <Link className="text-link" href={`/app/${org}/companies/new`}>
              Add one
            </Link>{' '}
            and every document in this set will carry the same address, spelled the same way.
          </p>
        ) : (
          <div
            style={{
              display: 'grid',
              gap: 16,
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            }}
          >
            {roles.map((role) => (
              <form key={role} action={action} style={{ display: 'grid', gap: 10 }}>
                <input type="hidden" name="org" value={org} />
                <input type="hidden" name="shipment" value={shipmentId} />
                <input type="hidden" name="role" value={role} />
                <Field id={role} label={partyRoleLabels[role]} hint={descriptions[role]}>
                  {({ id, describedBy }) => (
                    <Select
                      id={id}
                      name="company"
                      defaultValue={selected[role] ?? ''}
                      aria-describedby={describedBy}
                    >
                      <option value="">Not set</option>
                      {options.map((option) => (
                        <option key={option.id} value={option.id}>
                          {place(option)}
                        </option>
                      ))}
                    </Select>
                  )}
                </Field>
                <div>
                  <Button
                    type="submit"
                    tone="quiet"
                    compact
                    pending={pending}
                    pendingLabel="Saving…"
                  >
                    Set {partyRoleLabels[role].toLowerCase()}
                  </Button>
                </div>
              </form>
            ))}
          </div>
        )}
      </div>
    </Panel>
  );
}
