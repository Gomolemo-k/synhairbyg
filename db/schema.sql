begin;

-- ============================================================================
-- SynHairbyG — Postgres schema
-- ============================================================================

-- --- users ----------------------------------------------------------------
create table if not exists users (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  email         text not null unique,
  email_verified boolean not null default false,
  password_hash text,                    -- null until password auth is enabled
  phone         text,
  image         text,
  role          text not null default 'customer'
                  check (role in ('customer', 'admin')),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- --- collections ----------------------------------------------------------
create table if not exists collections (
  id            uuid primary key default gen_random_uuid(),
  slug          text not null unique,
  name          text not null,
  tagline       text,
  description   text,
  gradient_from text,
  gradient_to   text,
  sort_order    integer not null default 0,
  created_at    timestamptz not null default now()
);

-- --- wigs -----------------------------------------------------------------
create table if not exists wigs (
  id               text primary key,        -- p01, p02, etc.
  slug             text not null unique,
  name             text not null,
  short            text,
  description      text,
  type             text not null
                     check (type in ('Synthetic', 'Human Blend')),
  price            numeric(10,2) not null check (price >= 0),
  compare_at_price numeric(10,2)
                     check (compare_at_price is null or compare_at_price >= 0),
  length           text,
  texture          text,
  cap_type         text,
  density          text,
  color            text,
  stock            integer not null default 0 check (stock >= 0),
  featured         boolean not null default false,
  badge            text,
  collection_id    uuid references collections(id) on delete set null,
  gradient_from    text,
  gradient_to      text,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

-- --- wig images -----------------------------------------------------------
create table if not exists wig_images (
  id         bigint generated always as identity primary key,
  wig_id     text not null references wigs(id) on delete cascade,
  url        text not null,
  alt        text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

-- --- PAXI points ----------------------------------------------------------
-- PAXI has no public rate/shipment API. We keep our own list of PAXI points
-- (PEP, PEPhome, Tekkie Town, Shoe City stores) so customers can pick their
-- nearest collection point. Replace/extend this with PAXI's official store
-- list once you have API access.
create table if not exists paxi_points (
  id           bigint generated always as identity primary key,
  code         text not null unique,       -- unique PAXI point code (6 digits)
  name         text not null,              -- store name shown to customers
  brand        text not null default 'PEP',
  address      text,
  suburb       text,
  city         text not null,
  province     text not null,
  postal_code  text,
  lat          double precision,
  lng          double precision,
  active       boolean not null default true,
  created_at   timestamptz not null default now()
);

-- --- orders ---------------------------------------------------------------
create table if not exists orders (
  id                  text primary key,     -- SYN-2026-XXXX
  status              text not null default 'pending'
                        check (status in (
                          'pending','paid','packed','sent',
                          'complete','delivered','cancelled','failed','demo'
                        )),
  user_id             uuid references users(id) on delete set null,
  customer_first_name text not null,
  customer_last_name  text not null,
  customer_email      text not null,
  customer_phone      text,
  shipping_method     text not null default 'collection',
  shipping_address1   text,
  shipping_address2   text,
  shipping_city       text,
  shipping_province   text,
  shipping_postal_code text,
  shipping_notes      text,
  delivery_provider   text not null default 'courier',
  paxi_point_code     text,
  paxi_point_name     text,
  paxi_point_address  text,
  paxi_bag            text,
  paxi_service        text,
  subtotal            numeric(10,2) not null default 0,
  shipping_fee        numeric(10,2) not null default 0,
  total               numeric(10,2) not null default 0,
  payment_provider    text not null default 'demo',
  yoco_checkout_id    text,
  yoco_payment_id     text,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

-- Idempotent upgrades for databases created from an earlier schema.
alter table orders add column if not exists delivery_provider  text not null default 'courier';
alter table orders add column if not exists paxi_point_code    text;
alter table orders add column if not exists paxi_point_name    text;
alter table orders add column if not exists paxi_point_address text;
alter table orders add column if not exists paxi_bag           text;
alter table orders add column if not exists paxi_service       text;
alter table orders add column if not exists payment_provider   text not null default 'demo';
alter table orders add column if not exists yoco_checkout_id   text;
alter table orders add column if not exists yoco_payment_id    text;

-- Retired legacy payment columns and normalise the provider default.
alter table orders drop column if exists pf_payment_id;
alter table orders drop column if exists pf_token;
alter table orders alter column payment_provider set default 'demo';

-- Widen the order status check to include the PAXI fulfilment steps.
do $$
begin
  if exists (select 1 from pg_constraint where conname = 'orders_status_check') then
    alter table orders drop constraint orders_status_check;
  end if;
end $$;
alter table orders add constraint orders_status_check
  check (status in ('pending','paid','packed','sent','complete','delivered','cancelled','failed','demo'));

-- Backfill delivery_provider from the legacy shipping_method column.
update orders
   set delivery_provider = shipping_method
 where delivery_provider = 'courier'
   and shipping_method in ('courier', 'collection');

-- Widen the shipping_method check to include PAXI.
do $$
begin
  if exists (select 1 from pg_constraint where conname = 'orders_shipping_method_check') then
    alter table orders drop constraint orders_shipping_method_check;
  end if;
end $$;
alter table orders add constraint orders_shipping_method_check
  check (shipping_method in ('courier','collection','paxi'));

-- Webhook deliveries processed (dedupes Yoco event retries).
create table if not exists webhook_deliveries (
  id         text primary key,             -- the webhook-id header
  provider   text not null default 'yoco',
  event_type text,
  created_at timestamptz not null default now()
);

-- --- sessions --------------------------------------------------------------
-- Signed-in customer sessions. The cookie holds a random token; only its
-- SHA-256 hash is stored here so a DB leak can't be replayed elsewhere.
create table if not exists sessions (
  token_hash text primary key,
  user_id    uuid not null references users(id) on delete cascade,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null
);
create index if not exists idx_sessions_user on sessions (user_id);
create index if not exists idx_sessions_expires on sessions (expires_at);

-- --- order items ----------------------------------------------------------
create table if not exists order_items (
  id         bigint generated always as identity primary key,
  order_id   text not null references orders(id) on delete cascade,
  wig_id     text references wigs(id) on delete set null,
  name       text not null,
  qty        integer not null check (qty > 0),
  price      numeric(10,2) not null,
  created_at timestamptz not null default now()
);

-- --- carts ----------------------------------------------------------------
create table if not exists carts (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid references users(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists cart_items (
  cart_id    uuid not null references carts(id) on delete cascade,
  wig_id     text not null references wigs(id) on delete cascade,
  qty        integer not null default 1 check (qty > 0),
  created_at timestamptz not null default now(),
  primary key (cart_id, wig_id)
);

-- --- contact messages -----------------------------------------------------
create table if not exists contact_messages (
  id         bigint generated always as identity primary key,
  name       text,
  email      text,
  topic      text,
  message    text,
  created_at timestamptz not null default now()
);

-- --- email tokens ---------------------------------------------------------
-- One-time tokens for email verification and password reset. High-entropy raw
-- tokens are stored; used_at becomes set once consumed (single-use).
create table if not exists email_tokens (
  id         uuid primary key default gen_random_uuid(),
  token      text not null unique,
  user_id    uuid not null references users(id) on delete cascade,
  type       text not null check (type in ('verify', 'reset')),
  expires_at timestamptz not null,
  used_at    timestamptz,
  created_at timestamptz not null default now()
);
create index if not exists idx_email_tokens_token on email_tokens (token);
create index if not exists idx_email_tokens_user on email_tokens (user_id);

-- --- newsletter subscribers -----------------------------------------------
create table if not exists newsletter_subscribers (
  id               uuid primary key default gen_random_uuid(),
  email            text not null unique,
  unsub_token      text not null unique,   -- high-entropy, for the unsubscribe link
  source           text not null default 'footer',
  subscribed_at    timestamptz not null default now(),
  unsubscribed_at  timestamptz
);
create index if not exists idx_newsletter_subscribers_email on newsletter_subscribers (email);

-- --- cart reminders -------------------------------------------------------
-- One row per abandoned-cart reminder sent, so we never nag twice per window.
create table if not exists cart_reminders (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references users(id) on delete cascade,
  sent_at    timestamptz not null default now()
);
create index if not exists idx_cart_reminders_user on cart_reminders (user_id);

-- --- updated_at triggers --------------------------------------------------
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists users_updated_at on users;
create trigger users_updated_at
  before update on users   for each row execute function set_updated_at();
drop trigger if exists wigs_updated_at on wigs;
create trigger wigs_updated_at
  before update on wigs    for each row execute function set_updated_at();
drop trigger if exists orders_updated_at on orders;
create trigger orders_updated_at
  before update on orders  for each row execute function set_updated_at();
drop trigger if exists carts_updated_at on carts;
create trigger carts_updated_at
  before update on carts   for each row execute function set_updated_at();

-- --- indexes --------------------------------------------------------------
create index if not exists idx_wigs_slug          on wigs (slug);
create index if not exists idx_wigs_type          on wigs (type);
create index if not exists idx_wigs_collection    on wigs (collection_id);
create index if not exists idx_wigs_featured      on wigs (featured);
create index if not exists idx_orders_status      on orders (status);
create index if not exists idx_orders_customer    on orders (customer_email);
create index if not exists idx_orders_user        on orders (user_id);
create index if not exists idx_order_items_order  on order_items (order_id);
create index if not exists idx_cart_items_wig     on cart_items (wig_id);
create index if not exists idx_contact_created    on contact_messages (created_at);
create index if not exists idx_paxi_points_city    on paxi_points (city);
create index if not exists idx_paxi_points_province on paxi_points (province);
create index if not exists idx_paxi_points_active  on paxi_points (active);

commit;