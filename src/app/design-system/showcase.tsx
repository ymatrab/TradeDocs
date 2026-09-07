'use client';

import { useState } from 'react';
import { Download, Trash2 } from 'lucide-react';
import { Button, LinkButton } from '@/components/primitives/button';
import { Choice, Combobox, Field, Input, Select, Textarea } from '@/components/primitives/form';
import { DataTable, EmptyValue, NumericCell } from '@/components/primitives/table';
import {
  Callout,
  EmptyState,
  ErrorState,
  LoadingBlock,
  Panel,
} from '@/components/primitives/feedback';
import { Dialog } from '@/components/primitives/dialog';
import { Menu } from '@/components/primitives/menu';
import { Tabs } from '@/components/primitives/tabs';
import { ToastProvider, useToast } from '@/components/primitives/toast';
import { BoxGrid, FieldBox } from '@/components/document/field-box';
import {
  DocumentStatus,
  ShipmentStatus,
  documentStates,
  shipmentStates,
  stateMeaning,
} from '@/components/document/status';
import { AppShell } from '@/components/shell/app';

function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section aria-labelledby={id} style={{ marginBottom: 40 }}>
      <h2 id={id} style={{ marginBottom: 16 }}>
        {title}
      </h2>
      <div style={{ display: 'grid', gap: 16 }}>{children}</div>
    </section>
  );
}

function Row({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
      {children}
    </div>
  );
}

function Controls() {
  const notify = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [pending, setPending] = useState(false);

  return (
    <>
      <Section id="buttons" title="Actions">
        <Row>
          <Button>Save changes</Button>
          <Button tone="secondary">Cancel</Button>
          <Button tone="accent">Prepare document</Button>
          <Button tone="danger">Void document</Button>
          <Button tone="quiet">Dismiss</Button>
          <Button disabled>Unavailable</Button>
          <Button
            pending={pending}
            onClick={() => {
              setPending(true);
              setTimeout(() => {
                setPending(false);
                notify('success', 'Draft saved.');
              }, 2000);
            }}
          >
            Save draft
          </Button>
          <LinkButton href="#buttons" tone="secondary" compact>
            <Download size={15} aria-hidden="true" /> Export
          </LinkButton>
          <Menu
            label="More"
            actions={[
              {
                label: 'Duplicate shipment',
                onSelect: () => notify('neutral', 'Shipment duplicated.'),
              },
              {
                label: 'Delete draft',
                icon: <Trash2 size={15} aria-hidden="true" />,
                onSelect: () => notify('danger', 'Draft deleted.'),
              },
            ]}
          />
          <Button tone="secondary" onClick={() => setDialogOpen(true)}>
            Open dialog
          </Button>
        </Row>
      </Section>

      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        title="Void this document?"
        description="Voiding keeps the document in the audit trail and marks it withdrawn. It cannot be undone."
        footer={
          <>
            <Button tone="secondary" onClick={() => setDialogOpen(false)}>
              Keep document
            </Button>
            <Button
              tone="danger"
              onClick={() => {
                setDialogOpen(false);
                notify('danger', 'Document voided.');
              }}
            >
              Void document
            </Button>
          </>
        }
      >
        <p className="muted" style={{ marginBottom: 0 }}>
          Commercial Invoice CI-2026-0184 stays visible to everyone in this organization.
        </p>
      </Dialog>
    </>
  );
}

function Forms() {
  return (
    <Section id="forms" title="Forms">
      <div
        style={{
          display: 'grid',
          gap: 16,
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        }}
      >
        <Field id="consignee" label="Consignee" hint="The party receiving the goods.">
          {({ id, describedBy }) => (
            <Input id={id} aria-describedby={describedBy} defaultValue="Nordwind Handels GmbH" />
          )}
        </Field>
        <Field
          id="hs-code"
          label="HS code"
          error="Enter a 6 to 10 digit code. TradeDocs does not classify goods for you."
        >
          {({ id, describedBy, invalid }) => (
            <Input id={id} aria-describedby={describedBy} invalid={invalid} defaultValue="84713" />
          )}
        </Field>
        <Field id="incoterm" label="Incoterm" requirement="Optional">
          {({ id, describedBy }) => (
            <Select id={id} aria-describedby={describedBy} defaultValue="FOB">
              <option>EXW</option>
              <option>FOB</option>
              <option>CIF</option>
              <option>DAP</option>
            </Select>
          )}
        </Field>
        <Field id="port" label="Port of loading" hint="Start typing to filter.">
          {({ id, describedBy }) => (
            <Combobox
              id={id}
              aria-describedby={describedBy}
              options={['Rotterdam', 'Hamburg', 'Jebel Ali', 'Ningbo-Zhoushan']}
            />
          )}
        </Field>
        <Field id="marks" label="Marks and numbers">
          {({ id, describedBy }) => <Textarea id={id} aria-describedby={describedBy} />}
        </Field>
        <Field
          id="disabled-field"
          label="Shipment reference"
          hint="Set when the shipment is created."
        >
          {({ id, describedBy }) => (
            <Input id={id} aria-describedby={describedBy} disabled value="SHP-2026-0184" readOnly />
          )}
        </Field>
      </div>
      <fieldset style={{ border: '1px solid var(--rule)', padding: 16, margin: 0 }}>
        <legend className="caption">Document set</legend>
        <Choice id="ci" label="Commercial invoice" defaultChecked />
        <Choice id="pl" label="Packing list" hint="Derived from the packages you record." />
        <Choice id="co" label="Certificate of origin" type="radio" name="optional" />
        <Choice
          id="none"
          label="No additional document"
          type="radio"
          name="optional"
          defaultChecked
        />
      </fieldset>
    </Section>
  );
}

function Data() {
  return (
    <Section id="data" title="Tables">
      <DataTable caption="Shipment items">
        <thead>
          <tr>
            <th scope="col">Description</th>
            <th scope="col">HS code</th>
            <th scope="col" className="numeric">
              Quantity
            </th>
            <th scope="col" className="numeric">
              Net weight
            </th>
            <th scope="col" className="numeric">
              Line total
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Industrial bearing housing, cast iron, painted</td>
            <td className="data">8483.30</td>
            <NumericCell value="1,200" unit="pcs" />
            <NumericCell value="4,380.00" unit="kg" />
            <NumericCell value="18,600.00" unit="EUR" />
          </tr>
          <tr>
            <td>
              Replacement seal kit for hydraulic press, packed in cartons of fifty with desiccant
              sachets
            </td>
            <td>
              <EmptyValue label="No HS code recorded" />
            </td>
            <NumericCell value="80" unit="ctn" />
            <NumericCell value="96.50" unit="kg" />
            <NumericCell value="2,140.75" unit="EUR" />
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <th scope="row" colSpan={4}>
              Total
            </th>
            <NumericCell value="20,740.75" unit="EUR" />
          </tr>
        </tfoot>
      </DataTable>
      <DataTable caption="Recent documents, compact density" density="compact">
        <thead>
          <tr>
            <th scope="col">Reference</th>
            <th scope="col">Status</th>
            <th scope="col">Revision</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="data">CI-2026-0184</td>
            <td>
              <DocumentStatus state="final" />
            </td>
            <td className="data">r3</td>
          </tr>
          <tr>
            <td className="data">PL-2026-0184</td>
            <td>
              <DocumentStatus state="stale" />
            </td>
            <td className="data">r1</td>
          </tr>
        </tbody>
      </DataTable>
    </Section>
  );
}

function DocumentPrimitives() {
  return (
    <Section id="document" title="Document primitives">
      <p className="muted measure">
        Trade paperwork is a grid of numbered, captioned boxes. The workspace uses the same grid, so
        a field can be discussed by its box number on screen and on the printed document.
      </p>
      <BoxGrid label="Commercial invoice header">
        <FieldBox ordinal="1" caption="Exporter" value="Meridian Components Ltd" />
        <FieldBox ordinal="2" caption="Consignee" value="Nordwind Handels GmbH" />
        <FieldBox ordinal="3" caption="Notify party" />
        <FieldBox ordinal="4" caption="Invoice number">
          <span className="data">CI-2026-0184</span>
        </FieldBox>
        <FieldBox ordinal="5" caption="Incoterm 2020" value="FOB Rotterdam" />
        <FieldBox ordinal="6" caption="Status">
          <DocumentStatus state="final" />
        </FieldBox>
        <FieldBox
          ordinal="7"
          caption="Marks and numbers"
          wide
          value="MERIDIAN / ROTTERDAM / 1-80 / MADE IN UNITED KINGDOM"
        />
      </BoxGrid>
      <Panel title="Document lifecycle">
        <div style={{ display: 'grid', gap: 10 }}>
          {documentStates.map((state) => (
            <div
              key={state}
              style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}
            >
              <DocumentStatus state={state} />
              <span className="muted" style={{ fontSize: 14 }}>
                {stateMeaning(state)}
              </span>
            </div>
          ))}
        </div>
      </Panel>
      <Panel title="Shipment lifecycle">
        <div style={{ display: 'grid', gap: 10 }}>
          {shipmentStates.map((state) => (
            <div key={state} style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <ShipmentStatus state={state} />
            </div>
          ))}
          {/* A value the schema has grown but the interface has not been taught. */}
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <ShipmentStatus state="held_at_customs" />
          </div>
        </div>
      </Panel>
    </Section>
  );
}

function States() {
  return (
    <Section id="states" title="States and disclosure">
      <Callout tone="legal" title="Preparation only">
        A document prepared here is not issued, endorsed or cleared by any authority. Check every
        value against your own records before you send it.
      </Callout>
      <Callout tone="warning" title="Shipment changed after rendering">
        Packing List PL-2026-0184 was rendered from revision 1. Re-render it to match revision 3.
      </Callout>
      <Callout tone="success" title="Document set complete">
        All four documents match the current shipment revision.
      </Callout>
      <div
        style={{
          display: 'grid',
          gap: 16,
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        }}
      >
        <Panel title="Empty">
          <EmptyState
            title="No shipments yet"
            description="Create your first shipment to reuse its parties, products and packing on every document."
            action={<Button tone="accent">Create shipment</Button>}
          />
        </Panel>
        <Panel title="Error">
          <ErrorState
            title="Documents could not be loaded"
            description="The connection timed out. Your draft is unchanged."
            action={<Button tone="secondary">Try again</Button>}
          />
        </Panel>
        <Panel title="Loading">
          <LoadingBlock label="Loading shipment documents" />
        </Panel>
      </div>
      <Tabs
        label="Shipment detail"
        items={[
          {
            id: 'summary',
            label: 'Summary',
            content: (
              <p className="measure muted">Parties, transport and totals for this shipment.</p>
            ),
          },
          {
            id: 'items',
            label: 'Items',
            content: <p className="measure muted">Line items, quantities and weights.</p>,
          },
          {
            id: 'history',
            label: 'History',
            content: <p className="measure muted">Every revision and who made it.</p>,
          },
        ]}
      />
    </Section>
  );
}

export function Showcase() {
  return (
    <ToastProvider>
      <AppShell title="Design system">
        <p className="eyebrow">Internal reference</p>
        <p className="measure muted" style={{ marginBottom: 32 }}>
          Every component TradeDocs ships, in every state it can reach. This route is not available
          in production.
        </p>
        <Controls />
        <Forms />
        <Data />
        <DocumentPrimitives />
        <States />
      </AppShell>
    </ToastProvider>
  );
}
