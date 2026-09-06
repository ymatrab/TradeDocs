-- SOURCE ONLY: this migration has not been executed or validated in this session.
-- Ownership and access decisions are documented in DATABASE_IMPLEMENTATION.md.
begin;

create schema if not exists extensions;
create extension if not exists pgcrypto with schema extensions;
create schema if not exists private;
revoke all on schema private from public, anon, authenticated;

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text check (char_length(display_name) <= 160),
  locale text not null default 'en' check (char_length(locale) <= 35),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(btrim(name)) between 1 and 160),
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table public.memberships (
  org_id uuid not null references public.organizations(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete restrict,
  role text not null check (role in ('owner', 'admin', 'member')),
  created_at timestamptz not null default now(),
  primary key (org_id, user_id)
);
create index memberships_user_org_idx on public.memberships(user_id, org_id);

create table public.invitations (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations(id) on delete cascade,
  email text not null check (email = lower(btrim(email)) and char_length(email) <= 254),
  role text not null check (role in ('admin', 'member')),
  token_hash text not null unique check (char_length(token_hash) = 64),
  invited_by uuid not null references auth.users(id),
  expires_at timestamptz not null,
  accepted_at timestamptz,
  accepted_by uuid references auth.users(id),
  revoked_at timestamptz,
  created_at timestamptz not null default now(),
  unique (org_id, id),
  check ((accepted_at is null) = (accepted_by is null))
);
create index invitations_org_email_idx on public.invitations(org_id, email);

create table public.companies (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations(id) on delete cascade,
  name text not null check (char_length(btrim(name)) between 1 and 300),
  legal_name text not null check (char_length(btrim(legal_name)) between 1 and 300),
  kind text not null default 'own' check (kind in ('own', 'customer', 'supplier')),
  trading_name text check (char_length(trading_name) <= 300),
  registration_number text check (char_length(registration_number) <= 100),
  tax_id text check (char_length(tax_id) <= 100),
  website text check (char_length(website) <= 2048),
  email text check (char_length(email) <= 254),
  phone text check (char_length(phone) <= 50),
  address_line1 text check (char_length(address_line1) <= 300),
  address_line2 text check (char_length(address_line2) <= 300),
  city text check (char_length(city) <= 160),
  postal_code text check (char_length(postal_code) <= 35),
  country_code text check (country_code ~ '^[A-Z]{2}$'),
  archived_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (org_id, id)
);
create index companies_org_name_idx on public.companies(org_id, lower(legal_name), id);

create table public.contacts (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations(id) on delete cascade,
  company_id uuid,
  name text not null check (char_length(btrim(name)) between 1 and 300),
  email text check (char_length(email) <= 254),
  phone text check (char_length(phone) <= 50),
  archived_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (org_id, id),
  foreign key (org_id, company_id) references public.companies(org_id, id)
);
create index contacts_org_name_idx on public.contacts(org_id, lower(name), id);

create table public.parties (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations(id) on delete cascade,
  company_id uuid,
  contact_id uuid,
  kind text not null check (kind in ('customer', 'supplier', 'exporter', 'importer', 'producer', 'consignee', 'notify_party', 'carrier', 'other')),
  legal_name text not null check (char_length(btrim(legal_name)) between 1 and 300),
  archived_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (org_id, id),
  foreign key (org_id, company_id) references public.companies(org_id, id),
  foreign key (org_id, contact_id) references public.contacts(org_id, id)
);
create index parties_org_kind_name_idx on public.parties(org_id, kind, lower(legal_name), id);

create table public.addresses (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations(id) on delete cascade,
  company_id uuid,
  party_id uuid,
  label text not null default 'business' check (char_length(label) <= 80),
  line_1 text not null check (char_length(line_1) between 1 and 300),
  line_2 text check (char_length(line_2) <= 300),
  city text check (char_length(city) <= 160),
  region text check (char_length(region) <= 160),
  postal_code text check (char_length(postal_code) <= 35),
  country_code text not null check (country_code ~ '^[A-Z]{2}$'),
  archived_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (org_id, id),
  foreign key (org_id, company_id) references public.companies(org_id, id),
  foreign key (org_id, party_id) references public.parties(org_id, id),
  check (company_id is not null or party_id is not null)
);
create index addresses_org_idx on public.addresses(org_id, id);

create table public.products (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations(id) on delete cascade,
  sku text not null check (char_length(btrim(sku)) between 1 and 100),
  name text not null check (char_length(btrim(name)) between 1 and 300),
  description text not null default '' check (char_length(description) <= 10000),
  origin_country text check (origin_country ~ '^[A-Z]{2}$'),
  hs_code text check (char_length(hs_code) <= 32),
  unit text not null default 'pcs' check (char_length(unit) between 1 and 35),
  unit_price numeric(24, 6) check (unit_price >= 0),
  currency text check (currency ~ '^[A-Z]{3}$'),
  net_weight_kg numeric(24, 6) check (net_weight_kg >= 0),
  dimensions jsonb check (jsonb_typeof(dimensions) = 'object' and octet_length(dimensions::text) <= 2000),
  net_weight numeric(24, 6) check (net_weight >= 0),
  weight_unit text check (weight_unit in ('kg', 'g', 'lb', 'oz')),
  length numeric(24, 6) check (length > 0),
  width numeric(24, 6) check (width > 0),
  height numeric(24, 6) check (height > 0),
  dimension_unit text check (dimension_unit in ('mm', 'cm', 'm', 'in', 'ft')),
  archived_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (org_id, id),
  unique (org_id, sku),
  check ((unit_price is null) = (currency is null)),
  check ((net_weight is null) = (weight_unit is null)),
  check ((length is null and width is null and height is null and dimension_unit is null)
    or (length is not null and width is not null and height is not null and dimension_unit is not null))
);
create index products_org_name_idx on public.products(org_id, lower(name), id);

create table public.product_variants (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations(id) on delete cascade,
  product_id uuid not null,
  sku text not null check (char_length(btrim(sku)) between 1 and 100),
  attributes jsonb not null default '{}' check (jsonb_typeof(attributes) = 'object' and octet_length(attributes::text) <= 16000),
  archived_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (org_id, id),
  unique (org_id, product_id, id),
  unique (org_id, sku),
  foreign key (org_id, product_id) references public.products(org_id, id)
);

create table public.shipments (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations(id) on delete cascade,
  reference text not null check (char_length(btrim(reference)) between 1 and 160),
  status text not null default 'draft' check (status in ('draft', 'ready', 'finalized', 'archived', 'voided')),
  revision integer not null default 1 check (revision > 0),
  currency text not null check (currency ~ '^[A-Z]{3}$'),
  company_id uuid,
  exporter_id uuid,
  consignee_id uuid,
  customer_id uuid,
  mode text check (mode in ('sea', 'air', 'road', 'rail')),
  departure_port text check (char_length(departure_port) <= 300),
  arrival_port text check (char_length(arrival_port) <= 300),
  origin_country text check (origin_country ~ '^[A-Z]{2}$'),
  destination_country text check (destination_country ~ '^[A-Z]{2}$'),
  incoterm text check (incoterm in ('EXW', 'FCA', 'CPT', 'CIP', 'DAP', 'DPU', 'DDP', 'FAS', 'FOB', 'CFR', 'CIF')),
  incoterm_version text check (char_length(incoterm_version) <= 30),
  incoterm_place text check (char_length(incoterm_place) <= 300),
  planned_ship_date date,
  notes text not null default '' check (char_length(notes) <= 10000),
  cloned_from_id uuid,
  created_by uuid references auth.users(id) on delete set null default auth.uid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (org_id, id),
  unique (org_id, reference),
  foreign key (org_id, exporter_id) references public.parties(org_id, id),
  foreign key (org_id, consignee_id) references public.parties(org_id, id),
  foreign key (org_id, company_id) references public.companies(org_id, id),
  foreign key (org_id, customer_id) references public.companies(org_id, id),
  foreign key (org_id, cloned_from_id) references public.shipments(org_id, id),
  check ((incoterm is null) = (incoterm_version is null))
);
create index shipments_org_updated_idx on public.shipments(org_id, updated_at desc, id);

create table public.shipment_items (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations(id) on delete cascade,
  shipment_id uuid not null,
  product_id uuid,
  variant_id uuid,
  position integer not null check (position > 0),
  description text not null check (char_length(description) between 1 and 10000),
  sku text check (char_length(sku) <= 100),
  quantity numeric(24, 6) not null check (quantity > 0),
  unit text not null check (char_length(unit) between 1 and 35),
  unit_price numeric(24, 6) not null default 0 check (unit_price >= 0),
  net_weight_kg numeric(24, 6) check (net_weight_kg >= 0),
  origin_country text check (origin_country ~ '^[A-Z]{2}$'),
  hs_code text check (char_length(hs_code) <= 32),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (org_id, id),
  unique (org_id, shipment_id, id),
  unique (org_id, shipment_id, position),
  foreign key (org_id, shipment_id) references public.shipments(org_id, id),
  foreign key (org_id, product_id) references public.products(org_id, id),
  foreign key (org_id, product_id, variant_id) references public.product_variants(org_id, product_id, id),
  check (variant_id is null or product_id is not null)
);

create table public.packages (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations(id) on delete cascade,
  shipment_id uuid not null,
  package_number text not null check (char_length(package_number) between 1 and 100),
  marks text not null default '' check (char_length(marks) <= 2000),
  net_weight_kg numeric(24, 6) not null check (net_weight_kg >= 0),
  gross_weight_kg numeric(24, 6) not null check (gross_weight_kg >= net_weight_kg),
  length_cm numeric(24, 6) not null check (length_cm > 0),
  width_cm numeric(24, 6) not null check (width_cm > 0),
  height_cm numeric(24, 6) not null check (height_cm > 0),
  package_count integer not null default 1 check (package_count > 0),
  original_measurements jsonb check (jsonb_typeof(original_measurements) = 'object' and octet_length(original_measurements::text) <= 4000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (org_id, id),
  unique (org_id, shipment_id, id),
  unique (org_id, shipment_id, package_number),
  foreign key (org_id, shipment_id) references public.shipments(org_id, id)
);

create table public.package_items (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations(id) on delete cascade,
  shipment_id uuid not null,
  package_id uuid not null,
  shipment_item_id uuid not null,
  quantity numeric(24, 6) not null check (quantity > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (org_id, id),
  unique (org_id, package_id, shipment_item_id),
  foreign key (org_id, shipment_id, package_id) references public.packages(org_id, shipment_id, id),
  foreign key (org_id, shipment_id, shipment_item_id) references public.shipment_items(org_id, shipment_id, id)
);

create table public.transport_legs (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations(id) on delete cascade,
  shipment_id uuid not null,
  position integer not null check (position > 0),
  mode text not null check (mode in ('sea', 'air', 'road', 'rail', 'courier', 'other')),
  carrier_name text check (char_length(carrier_name) <= 300),
  transport_reference text check (char_length(transport_reference) <= 160),
  departure_location text check (char_length(departure_location) <= 300),
  arrival_location text check (char_length(arrival_location) <= 300),
  departure_at timestamptz,
  arrival_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (org_id, id),
  unique (org_id, shipment_id, position),
  foreign key (org_id, shipment_id) references public.shipments(org_id, id),
  check (departure_at is null or arrival_at is null or arrival_at >= departure_at)
);

create table public.regulatory_sources (
  id uuid primary key default gen_random_uuid(),
  registry_key text not null,
  version integer not null check (version > 0),
  source_url text not null check (source_url ~ '^https://'),
  authority text not null,
  jurisdiction text not null,
  effective_from date,
  effective_until date,
  retrieved_at timestamptz not null,
  review_due_at timestamptz not null,
  reviewer_name text,
  approval_reference text,
  approved_at timestamptz,
  status text not null default 'pending_review' check (status in ('pending_review', 'approved', 'retired', 'blocked')),
  approved_copy jsonb not null default '{}' check (jsonb_typeof(approved_copy) = 'object'),
  affected_versions jsonb not null default '[]' check (jsonb_typeof(affected_versions) = 'array'),
  created_at timestamptz not null default now(),
  unique (registry_key, version),
  check (effective_until is null or effective_from is null or effective_until >= effective_from),
  check (status <> 'approved' or (reviewer_name is not null and approval_reference is not null and approved_at is not null))
);

create table public.templates (
  id uuid primary key default gen_random_uuid(),
  template_key text not null,
  version integer not null check (version > 0),
  document_type text not null check (document_type in ('commercial_invoice', 'proforma_invoice', 'packing_list', 'purchase_order', 'quotation', 'sales_order', 'certificate_of_origin_preparation', 'delivery_note', 'shipping_instructions')),
  renderer_version text not null,
  source_hash text not null check (source_hash ~ '^[0-9a-f]{64}$'),
  regulatory_source_id uuid references public.regulatory_sources(id),
  enabled boolean not null default false,
  created_at timestamptz not null default now(),
  unique (template_key, version)
);

create table public.documents (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations(id) on delete cascade,
  shipment_id uuid not null,
  document_type text not null check (document_type in ('commercial_invoice', 'proforma_invoice', 'packing_list', 'purchase_order', 'quotation', 'sales_order', 'certificate_of_origin_preparation', 'delivery_note', 'shipping_instructions')),
  document_number text not null check (char_length(document_number) between 1 and 100),
  status text not null default 'draft' check (status in ('draft', 'finalized', 'superseded', 'voided', 'archived')),
  source_document_id uuid,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (org_id, id),
  unique (org_id, shipment_id, id),
  unique (org_id, document_type, document_number),
  foreign key (org_id, shipment_id) references public.shipments(org_id, id),
  foreign key (org_id, source_document_id) references public.documents(org_id, id)
);
create index documents_org_created_idx on public.documents(org_id, created_at desc, id);

create table public.document_revisions (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations(id) on delete restrict,
  shipment_id uuid not null,
  document_id uuid not null,
  revision integer not null check (revision > 0),
  shipment_revision integer not null check (shipment_revision > 0),
  schema_version text not null,
  template_id uuid not null references public.templates(id),
  renderer_version text not null,
  snapshot jsonb not null check (jsonb_typeof(snapshot) = 'object' and octet_length(snapshot::text) <= 2000000),
  sha256 text not null check (sha256 ~ '^[0-9a-f]{64}$'),
  storage_path text not null check (storage_path like org_id::text || '/%' and storage_path !~ '(^|/)\.\.(/|$)' and storage_path !~ '[\\]'),
  legal_status text not null check (legal_status in ('commercial_draft', 'commercial_document', 'preparation_template_not_issued', 'shipping_instructions_not_carrier_issued')),
  finalized_by uuid references auth.users(id) on delete set null,
  finalized_at timestamptz not null default now(),
  unique (org_id, id),
  unique (org_id, document_id, revision),
  unique (org_id, shipment_id, id),
  unique (storage_path),
  foreign key (org_id, shipment_id, document_id) references public.documents(org_id, shipment_id, id)
);

create table public.document_sets (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations(id) on delete cascade,
  shipment_id uuid not null,
  shipment_revision integer not null check (shipment_revision > 0),
  name text not null check (char_length(btrim(name)) between 1 and 160),
  status text not null default 'draft' check (status in ('draft', 'queued', 'processing', 'partial_failure', 'completed', 'expired')),
  manifest_hash text check (manifest_hash ~ '^[0-9a-f]{64}$'),
  storage_path text check (storage_path like org_id::text || '/%' and storage_path !~ '(^|/)\.\.(/|$)' and storage_path !~ '[\\]'),
  expires_at timestamptz,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (org_id, id),
  unique (org_id, shipment_id, id),
  foreign key (org_id, shipment_id) references public.shipments(org_id, id),
  check (status <> 'completed' or (manifest_hash is not null and storage_path is not null))
);

create table public.document_set_items (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations(id) on delete cascade,
  shipment_id uuid not null,
  document_set_id uuid not null,
  document_id uuid not null,
  document_revision_id uuid,
  status text not null default 'pending' check (status in ('pending', 'processing', 'completed', 'failed')),
  error_code text check (char_length(error_code) <= 80),
  unique (org_id, id),
  unique (org_id, document_set_id, document_id),
  foreign key (org_id, shipment_id, document_set_id) references public.document_sets(org_id, shipment_id, id),
  foreign key (org_id, shipment_id, document_id) references public.documents(org_id, shipment_id, id),
  foreign key (org_id, shipment_id, document_revision_id) references public.document_revisions(org_id, shipment_id, id),
  check (status <> 'completed' or document_revision_id is not null)
);

create table public.attachments (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations(id) on delete cascade,
  shipment_id uuid,
  document_id uuid,
  original_filename text not null check (char_length(original_filename) between 1 and 255),
  storage_path text not null unique check (storage_path like org_id::text || '/%' and storage_path !~ '(^|/)\.\.(/|$)' and storage_path !~ '[\\]'),
  mime_type text not null check (mime_type in ('application/pdf', 'image/png', 'image/jpeg', 'text/csv')),
  size_bytes bigint not null check (size_bytes between 1 and 20971520),
  sha256 text check (sha256 ~ '^[0-9a-f]{64}$'),
  scan_status text not null default 'pending' check (scan_status in ('pending', 'clean', 'rejected', 'error')),
  uploaded_by uuid references auth.users(id) on delete set null default auth.uid(),
  created_at timestamptz not null default now(),
  unique (org_id, id),
  foreign key (org_id, shipment_id) references public.shipments(org_id, id),
  foreign key (org_id, document_id) references public.documents(org_id, id)
);

create table public.render_jobs (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations(id) on delete cascade,
  shipment_id uuid not null,
  document_id uuid,
  document_set_id uuid,
  idempotency_key text not null check (char_length(idempotency_key) between 1 and 160),
  status text not null default 'queued' check (status in ('queued', 'processing', 'succeeded', 'failed', 'cancelled')),
  attempt_count integer not null default 0 check (attempt_count >= 0),
  max_attempts integer not null default 3 check (max_attempts between 1 and 10),
  available_at timestamptz not null default now(),
  locked_until timestamptz,
  locked_by text,
  last_error_code text check (char_length(last_error_code) <= 80),
  requested_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (org_id, id),
  unique (org_id, idempotency_key),
  foreign key (org_id, shipment_id, document_id) references public.documents(org_id, shipment_id, id),
  foreign key (org_id, shipment_id, document_set_id) references public.document_sets(org_id, shipment_id, id),
  foreign key (org_id, shipment_id) references public.shipments(org_id, id),
  check (num_nonnulls(document_id, document_set_id) = 1)
);
create index render_jobs_claim_idx on public.render_jobs(available_at, id) where status in ('queued', 'processing');

create table public.numbering_sequences (
  org_id uuid not null references public.organizations(id) on delete cascade,
  document_type text not null check (document_type in ('commercial_invoice', 'proforma_invoice', 'packing_list', 'purchase_order', 'quotation', 'sales_order', 'certificate_of_origin_preparation', 'delivery_note', 'shipping_instructions')),
  next_value bigint not null default 1 check (next_value > 0),
  primary key (org_id, document_type)
);

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations(id) on delete restrict,
  idempotency_key text not null check (char_length(idempotency_key) between 1 and 160),
  provider text not null check (char_length(provider) between 1 and 80),
  provider_checkout_id text,
  status text not null default 'pending' check (status in ('pending', 'paid', 'cancelled', 'refunded', 'partially_refunded', 'disputed', 'failed')),
  currency text not null check (currency ~ '^[A-Z]{3}$'),
  amount_minor bigint not null check (amount_minor >= 0),
  price_snapshot jsonb not null check (jsonb_typeof(price_snapshot) = 'object'),
  correlation_id uuid not null default gen_random_uuid(),
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (org_id, id),
  unique (org_id, idempotency_key),
  unique (provider, provider_checkout_id)
);
create index orders_org_created_idx on public.orders(org_id, created_at desc, id);

create table public.payments (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations(id) on delete restrict,
  order_id uuid not null,
  provider text not null,
  provider_payment_id text not null,
  status text not null check (status in ('pending', 'succeeded', 'failed', 'refunded', 'partially_refunded', 'disputed')),
  currency text not null check (currency ~ '^[A-Z]{3}$'),
  amount_minor bigint not null check (amount_minor >= 0),
  refunded_minor bigint not null default 0 check (refunded_minor >= 0 and refunded_minor <= amount_minor),
  correlation_id uuid not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (org_id, id),
  unique (provider, provider_payment_id),
  foreign key (org_id, order_id) references public.orders(org_id, id)
);

create table public.payment_events (
  id uuid primary key default gen_random_uuid(),
  provider text not null,
  provider_event_id text not null,
  event_type text not null,
  payload_hash text not null check (payload_hash ~ '^[0-9a-f]{64}$'),
  encrypted_payload_ref text,
  status text not null default 'received' check (status in ('received', 'processed', 'ignored', 'failed')),
  correlation_id uuid not null default gen_random_uuid(),
  received_at timestamptz not null default now(),
  processed_at timestamptz,
  error_code text,
  unique (provider, provider_event_id)
);

create table public.entitlements (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations(id) on delete restrict,
  order_id uuid,
  capability text not null check (char_length(capability) between 1 and 100),
  status text not null check (status in ('active', 'revoked', 'expired')),
  quantity_limit bigint check (quantity_limit >= 0),
  quantity_used bigint not null default 0 check (quantity_used >= 0),
  starts_at timestamptz not null default now(),
  expires_at timestamptz,
  grant_key text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (org_id, id),
  unique (org_id, grant_key),
  foreign key (org_id, order_id) references public.orders(org_id, id),
  check (quantity_limit is null or quantity_used <= quantity_limit),
  check (expires_at is null or expires_at > starts_at)
);
create index entitlements_org_capability_idx on public.entitlements(org_id, capability, status);

create table public.email_events (
  id uuid primary key default gen_random_uuid(),
  org_id uuid references public.organizations(id) on delete restrict,
  user_id uuid references auth.users(id) on delete set null,
  event_key text not null unique,
  template_key text not null,
  template_version integer not null check (template_version > 0),
  provider_message_id text unique,
  recipient_hash text not null check (recipient_hash ~ '^[0-9a-f]{64}$'),
  status text not null default 'queued' check (status in ('queued', 'sending', 'sent', 'delivered', 'bounced', 'complained', 'suppressed', 'failed')),
  attempt_count integer not null default 0 check (attempt_count >= 0),
  correlation_id uuid not null default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.feature_flags (
  id uuid primary key default gen_random_uuid(),
  org_id uuid references public.organizations(id) on delete cascade,
  flag_key text not null check (char_length(flag_key) between 1 and 100),
  enabled boolean not null default false,
  reason text not null check (char_length(reason) between 1 and 1000),
  approval_reference text,
  updated_at timestamptz not null default now(),
  unique nulls not distinct (org_id, flag_key)
);

create table public.audit_events (
  id uuid primary key default gen_random_uuid(),
  org_id uuid references public.organizations(id) on delete restrict,
  actor_id uuid references auth.users(id) on delete set null,
  action text not null check (char_length(action) between 1 and 100),
  target_type text not null,
  target_id text,
  correlation_id uuid not null default gen_random_uuid(),
  metadata jsonb not null default '{}' check (jsonb_typeof(metadata) = 'object' and octet_length(metadata::text) <= 8000),
  created_at timestamptz not null default now()
);
create index audit_events_org_created_idx on public.audit_events(org_id, created_at desc, id);

create table private.rate_limit_counters (
  key_hash text not null,
  window_seconds integer not null,
  window_started_at timestamptz not null,
  request_count integer not null check (request_count >= 0),
  primary key (key_hash, window_seconds, window_started_at)
);
create index rate_limit_counters_expiry_idx on private.rate_limit_counters(window_started_at);

-- Privilege grants and RLS are established before transaction commit in migration 2.
-- Explicitly deny all ordinary API access until that migration is applied.
do $$
declare t record;
begin
  for t in select tablename from pg_tables where schemaname = 'public' loop
    execute format('alter table public.%I enable row level security', t.tablename);
    execute format('revoke all on public.%I from anon, authenticated', t.tablename);
  end loop;
end $$;

commit;
