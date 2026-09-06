export const dynamic = 'force-dynamic';

/** Liveness only: this intentionally does not claim downstream services are healthy. */
export function GET(): Response {
  return Response.json({ status: 'ok' }, { headers: { 'Cache-Control': 'no-store' } });
}
