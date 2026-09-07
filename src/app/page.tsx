import { ArrowUpRight } from 'lucide-react';
import { LinkButton } from '@/components/primitives/button';
import { Callout } from '@/components/primitives/feedback';
import { BoxGrid, FieldBox } from '@/components/document/field-box';
import { DocumentStatus } from '@/components/document/status';
import { PublicShell } from '@/components/shell/public';

export default function Home() {
  return (
    <PublicShell>
      <p className="eyebrow">Engineering foundation</p>
      <h1 style={{ maxWidth: '24ch', marginBottom: 16 }}>
        One shipment. One connected document set.
      </h1>
      <p className="measure muted" style={{ fontSize: 17, marginBottom: 32 }}>
        TradeDocs captures company, customer and product data once, then reuses it across every
        document a shipment needs — so the invoice, the packing list and the certificate all agree.
      </p>

      <BoxGrid label="What a prepared document carries">
        <FieldBox
          ordinal="1"
          caption="Captured once"
          value="Parties, addresses, products and packing"
        />
        <FieldBox
          ordinal="2"
          caption="Reused across"
          value="Invoice, packing list, delivery note, origin"
        />
        <FieldBox ordinal="3" caption="Locked to" value="A numbered shipment revision" />
        <FieldBox ordinal="4" caption="Current state">
          <DocumentStatus state="draft" describe />
        </FieldBox>
      </BoxGrid>

      <div style={{ marginTop: 32, display: 'grid', gap: 16, maxWidth: 760 }}>
        <Callout tone="legal" level={2} title="This environment is not open for customer use">
          The platform is being built from its production specification. No account, shipment or
          document can be created here yet.
        </Callout>
        <div>
          <LinkButton href="/api/health" tone="secondary">
            Check application health <ArrowUpRight size={16} aria-hidden="true" />
          </LinkButton>
        </div>
      </div>
    </PublicShell>
  );
}
