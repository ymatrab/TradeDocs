import type { Metadata } from 'next';
import { createClient, getUser } from '@/lib/supabase/server';
import { AppShell } from '@/components/shell/app';
import { Panel, Callout } from '@/components/primitives/feedback';
import { BoxGrid, FieldBox } from '@/components/document/field-box';
import { AccountLifecycle } from './account-lifecycle';

export const metadata: Metadata = { title: 'Account' };

export default async function AccountPage() {
  const client = await createClient();
  const user = await getUser();
  const { data: request } = await client
    .from('account_deletion_requests')
    .select('purge_after, cancelled_at')
    .maybeSingle();
  const pendingDeletion = request && !request.cancelled_at ? request.purge_after : null;

  return (
    <AppShell title="Account" current="Account">
      <div style={{ display: 'grid', gap: 24, maxWidth: 820 }}>
        <BoxGrid label="Account record">
          <FieldBox ordinal="1" caption="Email address" value={user?.email ?? undefined} />
          <FieldBox
            ordinal="2"
            caption="Address confirmed"
            value={user?.email_confirmed_at ? 'Yes' : 'Not yet'}
          />
          <FieldBox ordinal="3" caption="Account opened">
            <span className="data">{user?.created_at?.slice(0, 10) ?? '—'}</span>
          </FieldBox>
        </BoxGrid>

        {pendingDeletion ? (
          <Callout tone="danger" title="Deletion is scheduled">
            Your account and its personal data are scheduled for removal after{' '}
            {new Date(pendingDeletion).toISOString().slice(0, 10)}. You can withdraw this until
            then.
          </Callout>
        ) : null}

        <Panel title="Your data">
          <AccountLifecycle deletionScheduled={Boolean(pendingDeletion)} />
        </Panel>

        <Panel title="Sessions">
          <p className="muted">
            Signing out everywhere ends every session on every device, including this one. Use it if
            you think someone else has access.
          </p>
          <form action="/auth/sign-out?scope=global" method="post">
            <button type="submit" className="btn secondary">
              Sign out on all devices
            </button>
          </form>
        </Panel>
      </div>
    </AppShell>
  );
}
