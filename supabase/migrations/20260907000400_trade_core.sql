-- Trade core: reusable parties, shipments, line items and generated documents.
--
-- The product's promise is that documents cannot disagree with each other, so the shape
-- here makes that structural: figures live on the shipment once, a generated document keeps
-- an immutable snapshot of the revision it came from, and a shipment that changes afterwards
-- marks its earlier documents stale rather than rewriting them.
--
-- Fail-closed like the identity core: row security on, no policy, no grant. The next
-- migration opens exactly what each role may do.

begin;

create table public.companies (
  id uuid primary key default extensions.gen_random_uuid(),
  org_id uuid not null references public.organizations (id) on delete cascade,
  kind text not null default 'customer' check (kind in ('own', 'customer', 'supplier')),
  name text not null check (char_length(btrim(name)) between 1 and 300),
  legal_name text check (char_length(legal_name) <= 300),
  tax_number text check (char_length(tax_number) <= 100),
  registration_number text check (char_length(registration_number) <= 100),
  email text check (char_length(email) <= 254),
  phone text check (char_length(phone) <= 60),
  address_line1 text check (char_length(address_line1) <= 200),
  address_line2 text check (char_length(address_line2) <= 200),
  city text check (char_length(city) <= 120),
  region text check (char_length(region) <= 120),
  postal_code text check (char_length(postal_code) <= 40),
  -- ISO 3166-1 alpha-2. Stored as a code, never as a display name, so a document can be
  -- rendered in another language without the country changing meaning.
  country_code text check (country_code ~ '^[A-Z]{2}$'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index companies_org_name_idx on public.companies (org_id, name);

create table public.shipments (
  id uuid primary key default extensions.gen_random_uuid(),
  org_id uuid not null references public.organizations (id) on delete cascade,
  reference text not null check (char_length(btrim(reference)) between 1 and 60),
  status text not null default 'draft' check (status in ('draft', 'confirmed', 'shipped', 'closed')),
  exporter_id uuid references public.companies (id) on delete restrict,
  consignee_id uuid references public.companies (id) on delete restrict,
  notify_id uuid references public.companies (id) on delete restrict,
  incoterm text check (
    incoterm in ('EXW', 'FCA', 'FAS', 'FOB', 'CFR', 'CIF', 'CPT', 'CIP', 'DAP', 'DPU', 'DDP')
  ),
  incoterm_place text check (char_length(incoterm_place) <= 160),
  port_of_loading text check (char_length(port_of_loading) <= 160),
  port_of_discharge text check (char_length(port_of_discharge) <= 160),
  country_of_origin text check (country_of_origin ~ '^[A-Z]{2}$'),
  country_of_destination text check (country_of_destination ~ '^[A-Z]{2}$'),
  -- ISO 4217. Held on the shipment so every document in the set quotes one currency.
  currency text not null default 'EUR' check (currency ~ '^[A-Z]{3}$'),
  shipped_on date,
  marks_and_numbers text check (char_length(marks_and_numbers) <= 2000),
  -- Bumped whenever the shipment or its items change. A document records the revision it
  -- was rendered from, which is what makes staleness detectable rather than guessed.
  revision integer not null default 1 check (revision >= 1),
  created_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (org_id, reference)
);
create index shipments_org_created_idx on public.shipments (org_id, created_at desc);

create table public.shipment_items (
  id uuid primary key default extensions.gen_random_uuid(),
  org_id uuid not null references public.organizations (id) on delete cascade,
  shipment_id uuid not null references public.shipments (id) on delete cascade,
  position integer not null default 1 check (position between 1 and 999),
  description text not null check (char_length(btrim(description)) between 1 and 500),
  hs_code text check (hs_code ~ '^[0-9]{6,10}$'),
  country_of_origin text check (country_of_origin ~ '^[A-Z]{2}$'),
  -- Exact decimals throughout. Money and weights must not be held as floating point:
  -- a rounding difference between two documents is precisely the failure this product exists
  -- to prevent.
  quantity numeric(14, 3) not null check (quantity > 0),
  unit text not null default 'pcs' check (char_length(unit) between 1 and 12),
  unit_price numeric(14, 4) not null default 0 check (unit_price >= 0),
  net_weight_kg numeric(14, 3) check (net_weight_kg >= 0),
  gross_weight_kg numeric(14, 3) check (gross_weight_kg >= 0),
  package_count integer check (package_count >= 0),
  package_kind text check (char_length(package_kind) <= 40),
  created_at timestamptz not null default now(),
  check (gross_weight_kg is null or net_weight_kg is null or gross_weight_kg >= net_weight_kg)
);
create index shipment_items_shipment_idx on public.shipment_items (shipment_id, position);

create table public.numbering_sequences (
  org_id uuid not null references public.organizations (id) on delete cascade,
  scope text not null check (char_length(scope) between 1 and 60),
  period text not null check (char_length(period) between 1 and 10),
  next_value integer not null default 1 check (next_value >= 1),
  primary key (org_id, scope, period)
);

create table public.documents (
  id uuid primary key default extensions.gen_random_uuid(),
  org_id uuid not null references public.organizations (id) on delete cascade,
  shipment_id uuid not null references public.shipments (id) on delete cascade,
  kind text not null check (
    kind in (
      'commercial_invoice',
      'proforma_invoice',
      'packing_list',
      'delivery_note',
      'certificate_of_origin'
    )
  ),
  number text not null check (char_length(number) between 1 and 60),
  status text not null default 'final' check (status in ('final', 'superseded', 'voided')),
  -- The shipment revision this document was rendered from.
  shipment_revision integer not null check (shipment_revision >= 1),
  -- Everything needed to reproduce the document byte for byte, independent of any later
  -- edit to the shipment, the parties or the products.
  snapshot jsonb not null check (jsonb_typeof(snapshot) = 'object'),
  created_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now(),
  unique (org_id, number)
);
create index documents_shipment_idx on public.documents (shipment_id, created_at desc);

create trigger companies_touch_updated_at before update on public.companies
  for each row execute function private.touch_updated_at();
create trigger shipments_touch_updated_at before update on public.shipments
  for each row execute function private.touch_updated_at();

-- A finalized document is evidence. Its number, snapshot and provenance are immutable;
-- only its status may move on.
create or replace function private.freeze_document() returns trigger
  language plpgsql
  security definer
  set search_path = ''
as $$
begin
  if new.snapshot is distinct from old.snapshot
    or new.number is distinct from old.number
    or new.shipment_revision is distinct from old.shipment_revision
    or new.kind is distinct from old.kind
    or new.shipment_id is distinct from old.shipment_id
  then
    raise exception 'A generated document cannot be rewritten. Generate a new one instead.'
      using errcode = 'check_violation';
  end if;
  return new;
end;
$$;

create trigger documents_are_immutable before update on public.documents
  for each row execute function private.freeze_document();

-- Any change to a shipment or its items advances the revision, which is what makes an
-- earlier document detectably stale rather than silently wrong.
create or replace function private.bump_shipment_revision() returns trigger
  language plpgsql
  security definer
  set search_path = ''
as $$
declare
  target uuid;
begin
  target := coalesce(new.shipment_id, old.shipment_id);
  update public.shipments s set revision = s.revision + 1 where s.id = target;
  return coalesce(new, old);
end;
$$;

create trigger shipment_items_bump_revision
  after insert or update or delete on public.shipment_items
  for each row execute function private.bump_shipment_revision();

create or replace function private.bump_own_revision() returns trigger
  language plpgsql
  security definer
  set search_path = ''
as $$
begin
  -- Only substantive edits count; a revision bump caused by its own bump would not end.
  if new.revision is distinct from old.revision then
    return new;
  end if;
  new.revision := old.revision + 1;
  return new;
end;
$$;

create trigger shipments_bump_revision before update on public.shipments
  for each row execute function private.bump_own_revision();

do $$
declare t record;
begin
  for t in
    select tablename from pg_tables
    where schemaname = 'public'
      and tablename in (
        'companies', 'shipments', 'shipment_items', 'numbering_sequences', 'documents'
      )
  loop
    execute format('alter table public.%I enable row level security', t.tablename);
    execute format('revoke all on public.%I from anon, authenticated', t.tablename);
  end loop;
end;
$$;

commit;
