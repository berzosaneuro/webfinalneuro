-- =============================================================================
-- Stripe multi-producto: Premium + Mentoría independientes.
-- Idempotente. No borra usuarios ni datos. No toca roles ni el trigger de auth.
-- =============================================================================

-- users: columnas que el webhook ya necesita y no existían.
alter table public.users add column if not exists stripe_customer_id text;
alter table public.users add column if not exists subscription_status text not null default 'none'; -- estado Premium
alter table public.users add column if not exists is_mentoria boolean not null default false;
alter table public.users add column if not exists mentoria_status text not null default 'none';
create index if not exists users_stripe_customer_id_idx on public.users (stripe_customer_id) where stripe_customer_id is not null;

-- subscriptions: una fila por suscripción de Stripe; `product` distingue premium/mentoria.
create table if not exists public.subscriptions (
  id uuid default gen_random_uuid() primary key,
  user_email text not null,
  product text not null default 'premium',
  stripe_customer_id text not null,
  stripe_subscription_id text not null unique,
  status text not null default 'incomplete',
  current_period_start timestamptz null,
  current_period_end timestamptz null,
  cancel_at_period_end boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
alter table public.subscriptions add column if not exists product text not null default 'premium';
create index if not exists subscriptions_user_email_idx on public.subscriptions (lower(user_email));
create index if not exists subscriptions_customer_idx on public.subscriptions (stripe_customer_id);
create index if not exists subscriptions_product_idx on public.subscriptions (product);

-- payments: auditoría de facturas pagadas, con producto asociado.
create table if not exists public.payments (
  id uuid default gen_random_uuid() primary key,
  user_email text not null,
  product text not null default 'premium',
  stripe_customer_id text not null,
  stripe_subscription_id text default '',
  stripe_invoice_id text not null unique,
  amount_paid integer not null default 0,
  currency text not null default 'eur',
  status text not null default 'paid',
  paid_at timestamptz null,
  created_at timestamptz default now()
);
alter table public.payments add column if not exists product text not null default 'premium';
create index if not exists payments_user_email_idx on public.payments (lower(user_email));
create index if not exists payments_customer_idx on public.payments (stripe_customer_id);

-- stripe_events: deduplicación de eventos de webhook (idempotencia).
create table if not exists public.stripe_events (
  id uuid default gen_random_uuid() primary key,
  stripe_event_id text not null unique,
  event_type text not null,
  processed_at timestamptz default now()
);

-- RLS: solo service_role (igual que el resto de tablas de pago ya endurecidas).
alter table public.subscriptions enable row level security;
drop policy if exists "Full access subscriptions" on public.subscriptions;
drop policy if exists "Service role subscriptions" on public.subscriptions;
create policy "Service role subscriptions" on public.subscriptions
  for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');

alter table public.payments enable row level security;
drop policy if exists "Full access payments" on public.payments;
drop policy if exists "Service role payments" on public.payments;
create policy "Service role payments" on public.payments
  for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');

alter table public.stripe_events enable row level security;
drop policy if exists "Full access stripe_events" on public.stripe_events;
drop policy if exists "Service role stripe events" on public.stripe_events;
create policy "Service role stripe events" on public.stripe_events
  for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');
