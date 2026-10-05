import { AppShell } from '@/components/shell/app';
import { LoadingBlock, Skeleton } from '@/components/primitives/feedback';

/**
 * Shown while a workspace page reads its data on the server. The shell stays in place so
 * navigation remains reachable, and the region announces it is busy without moving focus.
 */
export default function WorkspaceLoading() {
  return (
    <AppShell title="Loading">
      <div className="app-page">
        <div className="panel">
          <div className="panel-body" style={{ display: 'grid', gap: 16 }}>
            <Skeleton width="40%" height={20} />
            <LoadingBlock label="Loading this page" lines={4} />
          </div>
        </div>
      </div>
    </AppShell>
  );
}
