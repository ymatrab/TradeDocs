import type { ReactNode } from 'react';
import Link from 'next/link';
import { Callout, EmptyState } from '@/components/primitives/feedback';
import { AdminAuditRefused, AdminShell, AdminUnavailable } from '@/components/shell/admin';
import { adminContext, recordAdminEvent } from '@/lib/admin/server';
import { topicLabel } from '@/lib/contact/schema';
import { MarkHandled } from './mark-handled';

const LIMIT = 100;

const notificationLabel: Record<string, string> = {
  sent: 'Emailed to the contact address',
  not_sent: 'Stored only (email not configured)',
  failed: 'Email failed',
  pending: 'Email not attempted',
};

/** The contact inbox. Open messages first; `?show=all` includes handled ones. */
export default async function AdminMessagesPage({
  searchParams,
}: {
  searchParams: Promise<{ show?: string }>;
}) {
  const context = await adminContext();
  if (context.kind === 'unavailable') return <AdminUnavailable />;
  const showAll = (await searchParams).show === 'all';

  const shell = (body: ReactNode) => (
    <AdminShell title="Contact messages" current="Messages" adminEmail={context.admin.email}>
      {body}
    </AdminShell>
  );
  const audit = await recordAdminEvent(context, {
    action: 'view_contact_messages',
    targetType: 'contact_message_list',
    metadata: { scope: showAll ? 'all' : 'open' },
  });
  if (!audit.ok) return shell(<AdminAuditRefused cause={audit.cause} />);

  let query = context.client
    .from('contact_messages')
    .select(
      'id, name, email, topic, message, notification_status, notification_detail, handled_at, created_at',
    )
    .order('created_at', { ascending: false })
    .limit(LIMIT);
  if (!showAll) query = query.is('handled_at', null);
  const { data, error } = await query;

  const toggle = (
    <p style={{ margin: 0 }}>
      {showAll ? (
        <Link className="text-link" href="/admin/messages">
          Show open messages only
        </Link>
      ) : (
        <Link className="text-link" href="/admin/messages?show=all">
          Include handled messages
        </Link>
      )}
    </p>
  );

  if (error) {
    return shell(
      <Callout tone="danger" title="Messages could not be read" live>
        {`${error.code ?? 'unknown'}: ${error.message}`}
      </Callout>,
    );
  }
  if (!data || data.length === 0) {
    return shell(
      <div style={{ display: 'grid', gap: 16 }}>
        {toggle}
        <EmptyState
          title={showAll ? 'No messages yet' : 'Nothing open'}
          description="Messages sent through /contact arrive here, whether or not email is configured."
        />
      </div>,
    );
  }

  return shell(
    <div style={{ display: 'grid', gap: 16, maxWidth: 960 }}>
      {toggle}
      <ol className="admin-messages">
        {data.map((item) => (
          <li key={item.id} className="panel">
            <div className="panel-head">
              <h2 className="caption">{topicLabel(item.topic)}</h2>
              <span className="data">{item.created_at.slice(0, 16).replace('T', ' ')} UTC</span>
            </div>
            <div className="panel-body admin-message-body">
              <p style={{ margin: 0 }}>
                <strong>{item.name}</strong> ·{' '}
                <a className="text-link" href={`mailto:${item.email}`}>
                  {item.email}
                </a>
              </p>
              <p className="admin-message-text">{item.message}</p>
              <p className="muted" style={{ margin: 0, fontSize: 14 }}>
                {notificationLabel[item.notification_status] ?? item.notification_status}
                {item.notification_detail ? ` · ${item.notification_detail}` : ''}
                {item.handled_at ? ` · handled ${item.handled_at.slice(0, 10)}` : ''}
              </p>
              {item.handled_at ? null : <MarkHandled id={item.id} />}
            </div>
          </li>
        ))}
      </ol>
      {data.length === LIMIT ? (
        <p className="muted" style={{ margin: 0 }}>
          Showing the latest {LIMIT}.
        </p>
      ) : null}
    </div>,
  );
}
