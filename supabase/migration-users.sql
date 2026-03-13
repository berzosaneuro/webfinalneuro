-- Migración: añadir tabla users
-- Ejecuta en Supabase: Dashboard > SQL Editor > New Query > Pegar y ejecutar

create table if not exists users (
  id uuid default gen_random_uuid() primary key,
  email text not null unique,
  nombre text default '',
  last_login_at timestamptz default now(),
  created_at timestamptz default now()
);

create unique index if not exists users_email_unique on users (lower(email));

alter table users enable row level security;
create policy "Full access users" on users for all using (true);
