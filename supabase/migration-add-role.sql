-- ===========================================
-- MIGRATION: Add role column + assign master
-- Run this in Supabase SQL Editor BEFORE deploying the new code.
-- ===========================================

-- 1. Add the role column (idempotent)
alter table users add column if not exists role text not null default 'user';

-- 2. Upsert master user (insert if missing, update if exists)
insert into users (email, nombre, role)
values ('ceo@berzosaneuro.com', 'Admin', 'master')
on conflict (email)
do update set role = 'master';

-- 3. Verify — should return exactly one row with role = 'master'
select id, email, nombre, role from users where lower(email) = 'ceo@berzosaneuro.com';
