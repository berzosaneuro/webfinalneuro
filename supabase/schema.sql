-- ===========================================
-- NEUROCONCIENCIA - Esquema de Base de Datos
-- Ejecuta este SQL en Supabase SQL Editor
-- Dashboard > SQL Editor > New Query > Pegar y ejecutar
-- ===========================================

-- 1. Tabla de mensajes de contacto
create table if not exists contacts (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  email text not null,
  message text not null,
  created_at timestamptz default now()
);

-- 2. Tabla de leads (captación de emails)
create table if not exists leads (
  id uuid default gen_random_uuid() primary key,
  email text not null,
  name text default '',
  source text default 'web',
  created_at timestamptz default now()
);

-- 3. Tabla de posts de la comunidad
create table if not exists community_posts (
  id uuid default gen_random_uuid() primary key,
  autor text not null,
  avatar text default '🌟',
  nivel text default 'Observador',
  texto text not null,
  likes integer default 0,
  replies integer default 0,
  tag text default 'experiencia',
  created_at timestamptz default now()
);

-- 4. Tabla de clientes (CRM)
create table if not exists clients (
  id uuid default gen_random_uuid() primary key,
  nombre text not null,
  email text default '',
  telefono text default '',
  estado text default 'potencial' check (estado in ('activo', 'inactivo', 'nuevo', 'potencial')),
  plan text default 'ninguno' check (plan in ('free', 'premium', 'ninguno')),
  notas text default '',
  ultima_sesion text default '',
  proxima_sesion text default '',
  sesiones_totales integer default 0,
  fecha_alta text default '',
  tags text[] default '{}',
  created_at timestamptz default now()
);

-- 5. Tabla de llamadas
create table if not exists calls (
  id uuid default gen_random_uuid() primary key,
  cliente_nombre text not null,
  telefono text default '',
  tipo text default 'programada' check (tipo in ('programada', 'completada', 'perdida', 'cancelada')),
  fecha text not null,
  hora text not null,
  duracion integer default 0,
  notas text default '',
  recordatorio boolean default true,
  motivo text default 'Sesión',
  created_at timestamptz default now()
);

-- 6. Tabla de entradas del diario
create table if not exists diary_entries (
  id uuid default gen_random_uuid() primary key,
  user_email text not null,
  date text not null,
  presence_level integer default 50,
  mood text default '',
  insight text default '',
  created_at timestamptz default now()
);
create unique index if not exists diary_email_date on diary_entries (user_email, date);

-- 7. Tabla del mapa de consciencia
create table if not exists mapa_entries (
  id uuid default gen_random_uuid() primary key,
  user_email text not null,
  date text not null,
  presencia numeric default 5,
  calma numeric default 5,
  claridad numeric default 5,
  energia numeric default 5,
  conexion numeric default 5,
  nivel numeric default 5,
  nota text default '',
  created_at timestamptz default now()
);
create unique index if not exists mapa_email_date on mapa_entries (user_email, date);

-- 8. Tabla de neuroscore
create table if not exists neuroscore_entries (
  id uuid default gen_random_uuid() primary key,
  user_email text not null,
  date text not null,
  meditated boolean default false,
  exercise_done boolean default false,
  test_done boolean default false,
  despertar_done boolean default false,
  journal_done boolean default false,
  score integer default 0,
  created_at timestamptz default now()
);
create unique index if not exists neuroscore_email_date on neuroscore_entries (user_email, date);

-- 9. Tabla de progreso del programa 21 días
create table if not exists programa_progress (
  id uuid default gen_random_uuid() primary key,
  user_email text not null,
  start_date text default '',
  completed_days integer[] default '{}',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create unique index if not exists programa_email on programa_progress (user_email);

-- 10. Tabla de resultados del test
create table if not exists test_results (
  id uuid default gen_random_uuid() primary key,
  user_email text default '',
  score integer not null,
  level text not null,
  answers integer[] default '{}',
  created_at timestamptz default now()
);

-- 11. Tabla de usuarios (registro / acceso)
create table if not exists users (
  id uuid default gen_random_uuid() primary key,
  email text not null unique,
  nombre text default '',
  last_login_at timestamptz default now(),
  created_at timestamptz default now()
);
create unique index if not exists users_email_unique on users (lower(email));

-- 11b. Stripe / Premium (idempotente; ejecutar también en BD ya existentes)
alter table users add column if not exists stripe_customer_id text;
alter table users add column if not exists subscription_status text default 'none';
alter table users add column if not exists is_premium boolean default false;
create index if not exists users_stripe_customer_id_idx on users (stripe_customer_id) where stripe_customer_id is not null;

-- 11c. Suscripciones / pagos Stripe (auditoría operacional)
create table if not exists subscriptions (
  id uuid default gen_random_uuid() primary key,
  user_email text not null,
  stripe_customer_id text not null,
  stripe_subscription_id text not null unique,
  status text not null default 'incomplete',
  current_period_start timestamptz null,
  current_period_end timestamptz null,
  cancel_at_period_end boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create index if not exists subscriptions_user_email_idx on subscriptions (lower(user_email));
create index if not exists subscriptions_customer_idx on subscriptions (stripe_customer_id);

create table if not exists payments (
  id uuid default gen_random_uuid() primary key,
  user_email text not null,
  stripe_customer_id text not null,
  stripe_subscription_id text default '',
  stripe_invoice_id text not null unique,
  amount_paid integer not null default 0,
  currency text not null default 'eur',
  status text not null default 'paid',
  paid_at timestamptz null,
  created_at timestamptz default now()
);
create index if not exists payments_user_email_idx on payments (lower(user_email));
create index if not exists payments_customer_idx on payments (stripe_customer_id);

create table if not exists stripe_events (
  id uuid default gen_random_uuid() primary key,
  stripe_event_id text not null unique,
  event_type text not null,
  processed_at timestamptz default now()
);

-- 12. Configuración de audios (meditaciones)
create table if not exists audio_config (
  slot text primary key,
  url text default ''
);

-- 13. Biblioteca (artículos)
create table if not exists biblioteca_posts (
  id uuid default gen_random_uuid() primary key,
  slug text not null unique,
  title text not null,
  date text default '',
  summary text default '',
  content text default '',
  exercise text default '',
  free boolean default false,
  created_at timestamptz default now()
);
create unique index if not exists biblioteca_slug_unique on biblioteca_posts (slug);

-- 14. Tabla de suscriptores (emails de todas las fuentes)
create table if not exists subscribers (
  id uuid default gen_random_uuid() primary key,
  email text not null,
  nombre text default '',
  sources text[] default '{}',
  extra_data jsonb default '{}',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Índice único por email para evitar duplicados
create unique index if not exists subscribers_email_unique on subscribers (lower(email));

-- ===========================================
-- Políticas de seguridad (RLS)
-- Permitir lectura/escritura pública (sin auth)
-- ===========================================

alter table contacts enable row level security;
alter table leads enable row level security;
alter table community_posts enable row level security;
alter table clients enable row level security;
alter table calls enable row level security;

-- Contacts: cualquiera puede insertar (formulario público), solo lectura para admin
create policy "Anyone can insert contacts" on contacts for insert with check (true);
create policy "Anyone can read contacts" on contacts for select using (true);

-- Leads: cualquiera puede insertar, lectura pública
create policy "Anyone can insert leads" on leads for insert with check (true);
create policy "Anyone can read leads" on leads for select using (true);

-- Community posts: lectura y escritura pública
create policy "Anyone can read posts" on community_posts for select using (true);
create policy "Anyone can insert posts" on community_posts for insert with check (true);
create policy "Anyone can update posts" on community_posts for update using (true);

-- Clients: acceso completo (protegido por API route, no expuesto al público)
create policy "Full access clients" on clients for all using (true);

-- Calls: acceso completo
create policy "Full access calls" on calls for all using (true);

-- Users: acceso completo
alter table users enable row level security;
create policy "Full access users" on users for all using (true);

-- Subscriptions / payments / stripe events: acceso completo por API (endurecer en producción con auth real)
alter table subscriptions enable row level security;
create policy "Full access subscriptions" on subscriptions for all using (true);
alter table payments enable row level security;
create policy "Full access payments" on payments for all using (true);
alter table stripe_events enable row level security;
create policy "Full access stripe_events" on stripe_events for all using (true);

-- Audio config: acceso completo
alter table audio_config enable row level security;
create policy "Full access audio_config" on audio_config for all using (true);

-- Subscribers: acceso completo
alter table subscribers enable row level security;
create policy "Full access subscribers" on subscribers for all using (true);

-- Diary entries: acceso completo
alter table diary_entries enable row level security;
create policy "Full access diary" on diary_entries for all using (true);

-- Mapa entries: acceso completo
alter table mapa_entries enable row level security;
create policy "Full access mapa" on mapa_entries for all using (true);

-- Neuroscore entries: acceso completo
alter table neuroscore_entries enable row level security;
create policy "Full access neuroscore" on neuroscore_entries for all using (true);

-- Programa progress: acceso completo
alter table programa_progress enable row level security;
create policy "Full access programa" on programa_progress for all using (true);

-- Test results: acceso completo
alter table test_results enable row level security;
create policy "Full access test_results" on test_results for all using (true);

-- 16. Hardening producción: quitar políticas abiertas y permitir solo service_role
drop policy if exists "Anyone can insert contacts" on contacts;
drop policy if exists "Anyone can read contacts" on contacts;
drop policy if exists "Anyone can insert leads" on leads;
drop policy if exists "Anyone can read leads" on leads;
drop policy if exists "Anyone can read posts" on community_posts;
drop policy if exists "Anyone can insert posts" on community_posts;
drop policy if exists "Anyone can update posts" on community_posts;
drop policy if exists "Full access clients" on clients;
drop policy if exists "Full access calls" on calls;
drop policy if exists "Full access users" on users;
drop policy if exists "Full access subscriptions" on subscriptions;
drop policy if exists "Full access payments" on payments;
drop policy if exists "Full access stripe_events" on stripe_events;
drop policy if exists "Full access audio_config" on audio_config;
drop policy if exists "Full access subscribers" on subscribers;
drop policy if exists "Full access diary" on diary_entries;
drop policy if exists "Full access mapa" on mapa_entries;
drop policy if exists "Full access neuroscore" on neuroscore_entries;
drop policy if exists "Full access programa" on programa_progress;
drop policy if exists "Full access test_results" on test_results;

create policy "Service role contacts" on contacts for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');
create policy "Service role leads" on leads for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');
create policy "Service role posts" on community_posts for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');
create policy "Service role clients" on clients for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');
create policy "Service role calls" on calls for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');
create policy "Service role users" on users for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');
create policy "Service role subscriptions" on subscriptions for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');
create policy "Service role payments" on payments for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');
create policy "Service role stripe events" on stripe_events for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');
create policy "Service role audio config" on audio_config for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');
create policy "Service role subscribers" on subscribers for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');
create policy "Service role diary" on diary_entries for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');
create policy "Service role mapa" on mapa_entries for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');
create policy "Service role neuroscore" on neuroscore_entries for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');
create policy "Service role programa" on programa_progress for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');
create policy "Service role test results" on test_results for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');

-- ===========================================
-- Datos demo para comunidad
-- ===========================================

insert into community_posts (autor, avatar, nivel, texto, likes, replies, tag) values
  ('Elena R.', '🧘‍♀️', 'Consciente', 'Día 15 del programa y hoy por primera vez experimenté ese "espacio entre pensamientos". Fue solo un segundo pero fue REAL. Estoy llorando de emoción.', 34, 12, 'experiencia'),
  ('Marcos T.', '🧠', 'Observador', '¿A alguien más le pasa que cuando meditan les surge una resistencia enorme? Como si la mente NO quisiera que observes. Justo ahí está el ego defendiéndose, ¿verdad?', 21, 8, 'pregunta'),
  ('Dr. Berzosa', '⚡', 'Guía', 'Recordad: el despertar no es sentirse bien todo el tiempo. Es ver con claridad, incluso el dolor. La supraconsciencia incluye TODO lo que eres. No rechaces nada. Observa.', 89, 23, 'enseñanza'),
  ('Sofía L.', '🌊', 'Despertando', 'Mi NeuroScore pasó de 30 a 72 en un mes. Los datos no mienten. Esto funciona. Gracias a esta comunidad por el apoyo diario.', 56, 15, 'progreso'),
  ('Javier M.', '🔥', 'Consciente', 'Acabo de hacer la meditación grupal de las 20h. Meditar con 50 personas a la vez tiene una energía completamente diferente. Lo recomiendo a todos.', 43, 7, 'experiencia');
