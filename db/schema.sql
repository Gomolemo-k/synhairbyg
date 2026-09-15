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

-- --- orders ---------------------------------------------------------------
create table if not exists orders (
  id                  text primary key,     -- SYN-2026-XXXX
  status              text not null default 'pending'
                        check (status in (
                          'pending','paid','complete',
                          'delivered','cancelled','failed','demo'
                        )),
  user_id             uuid references users(id) on delete set null,
  customer_first_name text not null,
  customer_last_name  text not null,
  customer_email      text not null,
  customer_phone      text,
  shipping_method     text not null
                        check (shipping_method in ('courier','collection')),
  shipping_address1   text,
  shipping_address2   text,
  shipping_city       text,
  shipping_province   text,
  shipping_postal_code text,
  shipping_notes      text,
  subtotal            numeric(10,2) not null default 0,
  shipping_fee        numeric(10,2) not null default 0,
  total               numeric(10,2) not null default 0,
  pf_payment_id       text,
  pf_token            text,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

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
create index if not exists idx_order_items_order  on order_items (order_id);
create index if not exists idx_cart_items_wig     on cart_items (wig_id);
create index if not exists idx_contact_created    on contact_messages (created_at);

commit;