-- ===========================================
-- MIGRATION: RLS Hardening — ALL public tables
-- Run in Supabase SQL Editor. Idempotent: safe to re-run.
-- ===========================================
-- All API routes use service_role (bypasses RLS).
-- These policies block direct access via anon/authenticated keys.
-- ===========================================

-- Helper: enables RLS, drops listed policies, creates service_role policy.
-- Skips silently if the table does not exist.
create or replace function _rls_harden(
  _table text,
  _policy_name text,
  _drop_names text[]
) returns void language plpgsql as $$
declare
  _pol text;
begin
  if not exists (
    select 1 from pg_tables where schemaname = 'public' and tablename = _table
  ) then
    raise notice 'Table %.% does not exist — skipped', 'public', _table;
    return;
  end if;

  execute format('alter table public.%I enable row level security', _table);

  foreach _pol in array _drop_names loop
    execute format('drop policy if exists %I on public.%I', _pol, _table);
  end loop;

  execute format(
    'create policy %I on public.%I for all using (auth.role() = ''service_role'') with check (auth.role() = ''service_role'')',
    _policy_name, _table
  );

  raise notice 'Hardened: public.%', _table;
end;
$$;

-- ───────────────────────────────────────────
-- Apply to every known table
-- ───────────────────────────────────────────

select _rls_harden('contacts', 'Service role contacts', array[
  'Anyone can insert contacts','Anyone can read contacts','Full access contacts','Service role contacts'
]);

select _rls_harden('leads', 'Service role leads', array[
  'Anyone can insert leads','Anyone can read leads','Full access leads','Service role leads'
]);

select _rls_harden('community_posts', 'Service role posts', array[
  'Anyone can read posts','Anyone can insert posts','Anyone can update posts','Full access posts','Service role posts'
]);

select _rls_harden('clients', 'Service role clients', array[
  'Full access clients','Service role clients'
]);

select _rls_harden('calls', 'Service role calls', array[
  'Full access calls','Service role calls'
]);

select _rls_harden('users', 'Service role users', array[
  'Full access users','Service role users'
]);

select _rls_harden('diary_entries', 'Service role diary', array[
  'Full access diary','Service role diary'
]);

select _rls_harden('mapa_entries', 'Service role mapa', array[
  'Full access mapa','Service role mapa'
]);

select _rls_harden('neuroscore_entries', 'Service role neuroscore', array[
  'Full access neuroscore','Service role neuroscore'
]);

select _rls_harden('programa_progress', 'Service role programa', array[
  'Full access programa','Service role programa'
]);

select _rls_harden('test_results', 'Service role test results', array[
  'Full access test_results','Service role test results'
]);

select _rls_harden('subscriptions', 'Service role subscriptions', array[
  'Full access subscriptions','Service role subscriptions'
]);

select _rls_harden('payments', 'Service role payments', array[
  'Full access payments','Service role payments'
]);

select _rls_harden('stripe_events', 'Service role stripe events', array[
  'Full access stripe_events','Service role stripe events'
]);

select _rls_harden('audio_config', 'Service role audio config', array[
  'Full access audio_config','Service role audio config'
]);

select _rls_harden('biblioteca_posts', 'Service role biblioteca', array[
  'Full access biblioteca','Service role biblioteca'
]);

select _rls_harden('subscribers', 'Service role subscribers', array[
  'Full access subscribers','Service role subscribers'
]);

select _rls_harden('content_items', 'Service role content_items', array[
  'Full access content_items','Service role content_items'
]);

select _rls_harden('calendar', 'Service role calendar', array[
  'Full access calendar','Service role calendar'
]);

-- ───────────────────────────────────────────
-- Cleanup helper function
-- ───────────────────────────────────────────
drop function if exists _rls_harden(text, text, text[]);

-- ───────────────────────────────────────────
-- Verification
-- ───────────────────────────────────────────

select tablename, rowsecurity as rls_enabled
from pg_tables
where schemaname = 'public'
order by tablename;

select tablename, policyname, permissive, cmd
from pg_policies
where schemaname = 'public'
order by tablename, policyname;
