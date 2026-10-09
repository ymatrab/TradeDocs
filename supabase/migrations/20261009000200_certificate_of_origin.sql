-- Certificate of origin: refused in the database unless it comes through the reviewed path,
-- and recorded with the details it prints (D-008, D-025).
--
-- Until now the certificate of origin was refused only by the application: the server
-- action and the preview route check ENABLE_REGULATED_DOCUMENTS and its review record, but
-- any signed-in member could call public.generate_document(shipment, 'certificate_of_origin')
-- directly and finalize one. This migration closes that, without touching the snapshot or
-- generation routines other document types share.
--
-- What changes:
--   * A BEFORE INSERT trigger on public.documents, for certificate_of_origin rows only:
--     - refuses the row (42501) unless the transaction was opened by
--       public.generate_certificate_of_origin, which only the service role may execute. The
--       application calls it only after its own gate (flag, approval, service mode and the
--       LEGAL_COO_REVIEWED_BY/AT review record) is on, so switching the flag off closes the
--       database path too, with nothing to clean up;
--     - adds `certificate` to the snapshot: the wording version the renderer prints (1, the
--       wording in src/lib/trade/certificate-of-origin.ts) and the number of the shipment's
--       current final commercial invoice, the invoice the certificate refers to (null when
--       there is none). Captured once, at generation, so the document stays reproducible.
--   * public.generate_certificate_of_origin(target_shipment, actor): runs the ordinary
--     public.generate_document as the actor, so membership, numbering, lineage, branding
--     and audit are exactly that routine's. `actor` is the signed-in user the server
--     verified; the routine still refuses a shipment outside the actor's organizations.
--
-- Existing documents are untouched: no certificate of origin was ever generated through the
-- application, because the gate has always been off.
--
-- Access decisions: no new table or view. generate_certificate_of_origin is revoked from
-- public, anon and authenticated and granted to service_role only. The trigger function is
-- private and executable by nobody directly. public.documents keeps its policies and grants.
--
-- Rollback: drop trigger documents_certificate_of_origin on public.documents, then drop
-- function public.generate_certificate_of_origin(uuid, uuid) and
-- private.certificate_of_origin_insert(). Certificates generated meanwhile keep their
-- snapshot, including `certificate`, and render as issued; with the trigger gone the
-- database no longer refuses direct generation, so the application gate is again the only
-- control.

begin;

/**
 * Applies to certificate_of_origin rows only: refuses one that did not come through
 * public.generate_certificate_of_origin, and records the details the certificate prints.
 */
create or replace function private.certificate_of_origin_insert() returns trigger
  language plpgsql
  security definer
  set search_path = ''
as $$
declare
  invoice_number text;
begin
  if coalesce(current_setting('tradedocs.regulated_path', true), '') <> 'certificate_of_origin'
  then
    raise exception 'Certificates of origin are not available on this path.'
      using errcode = '42501';
  end if;

  select d.number into invoice_number from public.documents d
  where d.shipment_id = new.shipment_id and d.org_id = new.org_id
    and d.kind = 'commercial_invoice' and d.status = 'final'
  order by d.created_at desc, d.number desc
  limit 1;

  new.snapshot := new.snapshot || jsonb_build_object(
    'certificate', jsonb_build_object(
      -- Must match CURRENT_COO_WORDING in src/lib/trade/certificate-of-origin.ts.
      'wording_version', 1,
      'invoice_reference', invoice_number
    )
  );
  return new;
end;
$$;

create trigger documents_certificate_of_origin
  before insert on public.documents
  for each row
  when (new.kind = 'certificate_of_origin')
  execute function private.certificate_of_origin_insert();

/**
 * Generates a certificate of origin for `actor`, through the ordinary routine. Service role
 * only: the application calls it once its own review gate is on.
 */
create or replace function public.generate_certificate_of_origin(
  target_shipment uuid,
  actor uuid
)
returns uuid
  language plpgsql
  security definer
  set search_path = ''
as $$
declare
  created uuid;
begin
  if actor is null then
    raise exception 'That shipment is not available.' using errcode = '42501';
  end if;

  -- Local to this transaction: generate_document reads the actor through auth.uid(), and
  -- the trigger accepts the row only while this flag is set.
  perform set_config('request.jwt.claim.sub', actor::text, true);
  perform set_config(
    'request.jwt.claims',
    jsonb_build_object('sub', actor, 'role', 'authenticated')::text,
    true
  );
  perform set_config('tradedocs.regulated_path', 'certificate_of_origin', true);

  created := public.generate_document(target_shipment, 'certificate_of_origin');

  perform set_config('tradedocs.regulated_path', '', true);
  return created;
end;
$$;

revoke execute on function private.certificate_of_origin_insert() from public, anon, authenticated;
revoke execute on function public.generate_certificate_of_origin(uuid, uuid)
  from public, anon, authenticated;
grant execute on function public.generate_certificate_of_origin(uuid, uuid) to service_role;

commit;
