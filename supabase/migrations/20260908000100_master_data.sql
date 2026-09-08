-- Master data: the reusable catalog the product's promise rests on.
--
-- Until now a shipment could only be typed in fresh, which makes this a document
-- generator rather than a trade workspace. The tables here are the "capture once"
-- half of the promise: a product a company actually ships, and a party it actually
-- ships to, described once and then referenced.
--
-- Reference, not copy. A shipment item takes its values from a product at the moment
-- it is added and then owns them, because a price correction made next quarter must
-- not reach backwards and change what an invoice said. `product_id` records where the
-- line came from; it does not keep the line in sync.

begin;

create table public.products (
  id uuid primary key default extensions.gen_random_uuid(),
  org_id uuid not null references public.organizations (id) on delete cascade,
  -- The organization's own article number. Optional, because plenty of small exporters
  -- do not run one, and forcing an invented code would corrupt the catalog it indexes.
  sku text check (char_length(btrim(sku)) between 1 and 60),
  description text not null check (char_length(btrim(description)) between 1 and 500),
  hs_code text check (hs_code ~ '^[0-9]{6,10}$'),
  country_of_origin text check (country_of_origin ~ '^[A-Z]{2}$'),
  unit text not null default 'pcs' check (char_length(unit) between 1 and 12),
  unit_price numeric(14, 4) not null default 0 check (unit_price >= 0),
  -- The currency this catalog price is quoted in. Null means "whatever the shipment
  -- uses", which is the honest answer for an organization that sells in one currency.
  currency text check (currency ~ '^[A-Z]{3}$'),
  net_weight_kg numeric(14, 3) check (net_weight_kg >= 0),
  gross_weight_kg numeric(14, 3) check (gross_weight_kg >= 0),
  package_kind text check (char_length(package_kind) <= 40),
  units_per_package numeric(14, 3) check (units_per_package > 0),
  notes text check (char_length(notes) <= 2000),
  -- Archived, never deleted while a shipment item still points here: a catalog entry
  -- that a past document was built from is history, and history does not get tidied up.
  archived_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (gross_weight_kg is null or net_weight_kg is null or gross_weight_kg >= net_weight_kg)
);

create index products_org_description_idx on public.products (org_id, description);
create index products_org_active_idx on public.products (org_id, archived_at);
-- Unique among what is in use. A retired SKU may be reissued; two live ones may not
-- collide, or "add from catalog" would present the user an ambiguous choice.
create unique index products_org_sku_live_idx
  on public.products (org_id, upper(btrim(sku)))
  where sku is not null and archived_at is null;

-- Parties gain the same archival treatment, plus the human a document is actually
-- addressed to. Both were absent, which is why the table had no interface.
alter table public.companies
  add column contact_name text check (char_length(contact_name) <= 200),
  add column notes text check (char_length(notes) <= 2000),
  add column archived_at timestamptz;

create index companies_org_active_idx on public.companies (org_id, kind, archived_at);

-- Where a line came from. `set null` because deleting a catalog entry must not cascade
-- into a shipment: the line stands on the values it captured.
alter table public.shipment_items
  add column product_id uuid references public.products (id) on delete set null;

create index shipment_items_product_idx on public.shipment_items (product_id);

/**
 * How the goods are physically packed. Kept separate from the line items because the
 * relationship is genuinely many-to-many in practice — one carton holds three articles,
 * one article fills forty cartons — and collapsing it onto the item row is what forces
 * the packing list and the invoice to disagree.
 */
create table public.shipment_packages (
  id uuid primary key default extensions.gen_random_uuid(),
  org_id uuid not null references public.organizations (id) on delete cascade,
  shipment_id uuid not null references public.shipments (id) on delete cascade,
  position integer not null default 1 check (position between 1 and 999),
  kind text not null default 'carton' check (char_length(btrim(kind)) between 1 and 40),
  package_count integer not null default 1 check (package_count between 1 and 100000),
  length_cm numeric(10, 2) check (length_cm > 0),
  width_cm numeric(10, 2) check (width_cm > 0),
  height_cm numeric(10, 2) check (height_cm > 0),
  net_weight_kg numeric(14, 3) check (net_weight_kg >= 0),
  gross_weight_kg numeric(14, 3) check (gross_weight_kg >= 0),
  marks text check (char_length(marks) <= 500),
  -- Volume is derived, so it is stored derived. A packing list and a freight quote that
  -- disagree on CBM because one of them recomputed it by hand is a support ticket.
  volume_m3 numeric(14, 4) generated always as (
    case
      when length_cm is not null and width_cm is not null and height_cm is not null
        then round(package_count * length_cm * width_cm * height_cm / 1000000.0, 4)
    end
  ) stored,
  created_at timestamptz not null default now(),
  check (gross_weight_kg is null or net_weight_kg is null or gross_weight_kg >= net_weight_kg)
);

create index shipment_packages_shipment_idx on public.shipment_packages (shipment_id, position);

/**
 * Which goods sit in which packages. Quantity is the amount of that line allocated to
 * that package group, so a packing list can state contents per package rather than
 * repeating the invoice.
 */
create table public.package_contents (
  id uuid primary key default extensions.gen_random_uuid(),
  org_id uuid not null references public.organizations (id) on delete cascade,
  package_id uuid not null references public.shipment_packages (id) on delete cascade,
  item_id uuid not null references public.shipment_items (id) on delete cascade,
  quantity numeric(14, 3) not null check (quantity > 0),
  created_at timestamptz not null default now(),
  unique (package_id, item_id)
);

create index package_contents_item_idx on public.package_contents (item_id);

create trigger products_touch_updated_at before update on public.products
  for each row execute function private.touch_updated_at();

-- Packing is part of the shipment, so changing it makes earlier documents stale exactly
-- as changing a line does. A packing list generated before the cartons were re-measured
-- is wrong in the same way and must say so.
create trigger shipment_packages_bump_revision
  after insert or update or delete on public.shipment_packages
  for each row execute function private.bump_shipment_revision();

create or replace function private.bump_revision_via_package() returns trigger
  language plpgsql
  security definer
  set search_path = ''
as $$
declare
  target uuid;
begin
  select p.shipment_id into target
  from public.shipment_packages p
  where p.id = coalesce(new.package_id, old.package_id);

  if target is not null then
    update public.shipments s set revision = s.revision + 1 where s.id = target;
  end if;
  return coalesce(new, old);
end;
$$;

create trigger package_contents_bump_revision
  after insert or update or delete on public.package_contents
  for each row execute function private.bump_revision_via_package();

do $$
declare t record;
begin
  for t in
    select tablename from pg_tables
    where schemaname = 'public'
      and tablename in ('products', 'shipment_packages', 'package_contents')
  loop
    execute format('alter table public.%I enable row level security', t.tablename);
    execute format('revoke all on public.%I from anon, authenticated', t.tablename);
  end loop;
end;
$$;

commit;
