-- Migración: tabla audio_config
create table if not exists audio_config (
  slot text primary key,
  url text default ''
);
alter table audio_config enable row level security;
create policy "Full access audio_config" on audio_config for all using (true);
