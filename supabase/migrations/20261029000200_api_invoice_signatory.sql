-- The REST API requires the signatory on a commercial invoice (D-029), as the workspace does:
-- 19 CFR 141.86(j) asks every invoice to name a responsible person of the exporter, and the
-- signatory in the organization's document settings is who TradeDocs prints.
--
-- What changes: public.api_generate_document refuses kind commercial_invoice with
-- check_violation (SQLSTATE 23514) while the key's organization has no signatory name, before
-- the Idempotency-Key is claimed. The route answers 422 SIGNATORY_REQUIRED. Nothing else in
-- the routine changes. public.generate_document itself is unchanged.
--
-- Access decisions: none new. create or replace keeps the routine's grants (service_role only).
--
-- Rollback: re-create public.api_generate_document from 20261009000400_public_api.sql.

begin;

/** As in 20261009000400_public_api.sql, plus the signatory check on commercial invoices. */
create or replace function public.api_generate_document(
  p_key_hash text,
  p_idempotency_key text,
  p_request_hash text,
  p_shipment uuid,
  p_kind text
) returns jsonb
  language plpgsql
  security definer
  set search_path = ''
as $$
declare
  principal public.api_keys := private.api_principal(p_key_hash);
  claim jsonb;
  previous_claims text := current_setting('request.jwt.claims', true);
  previous_sub text := current_setting('request.jwt.claim.sub', true);
  created uuid;
  document public.documents;
  body jsonb;
begin
  if not exists (
    select 1 from public.shipments s where s.id = p_shipment and s.org_id = principal.org_id
  ) then
    return null;
  end if;

  -- A commercial invoice names the exporter's responsible person (19 CFR 141.86(j), D-029),
  -- as the workspace requires. Refused before the Idempotency-Key is claimed, so the same
  -- request succeeds once the signatory is set.
  if p_kind = 'commercial_invoice' and not exists (
    select 1 from public.organization_settings o
    where o.org_id = principal.org_id and nullif(btrim(o.signatory_name), '') is not null
  ) then
    raise exception 'A commercial invoice must name the person responsible for it. Set the signatory name in the document settings.'
      using errcode = 'check_violation';
  end if;

  claim := private.api_idempotency_claim(principal.id, p_idempotency_key, p_request_hash);
  if claim ? 'conflict' then
    return claim;
  end if;
  if claim ? 'replay' then
    return jsonb_build_object('status', 200, 'body', claim -> 'replay', 'replayed', true);
  end if;

  -- Act as the creator (an owner or administrator, checked by api_principal) for the one
  -- call, then put the caller's claims back.
  perform set_config(
    'request.jwt.claims',
    jsonb_build_object('sub', principal.created_by, 'role', 'authenticated')::text,
    true
  );
  perform set_config('request.jwt.claim.sub', principal.created_by::text, true);
  created := public.generate_document(p_shipment, p_kind);
  perform set_config('request.jwt.claims', coalesce(previous_claims, ''), true);
  perform set_config('request.jwt.claim.sub', coalesce(previous_sub, ''), true);

  select * into document from public.documents d where d.id = created and d.org_id = principal.org_id;
  body := private.api_document_json(document);
  perform private.api_idempotency_store(principal.id, p_idempotency_key, body);

  insert into public.audit_events (org_id, actor_id, action, target_type, target_id, metadata)
  values (
    principal.org_id, principal.created_by, 'api.document_generated', 'document', created::text,
    jsonb_build_object('key_id', principal.id, 'prefix', principal.prefix, 'kind', p_kind)
  );
  return jsonb_build_object('status', 201, 'body', body);
end;
$$;

commit;
