-- =============================================================================
-- Sincronización obligatoria: auth.users → public.users (invariante en BD)
-- Ejecutar en Supabase SQL Editor (o migraciones) en producción.
-- La app solo hace backfill si falta la fila (usuarios legacy / fallo atípico).
--
-- v2 — FIX: un email histórico ya presente en public.users (creado antes de
-- que ese usuario tuviera cuenta real en auth.users — p. ej. vía captación de
-- leads, CRM o el webhook de Stripe) ya no puede abortar la transacción de
-- alta en auth.users. Antes, `on conflict (id) do nothing` solo cubría el PK;
-- una colisión de UNIQUE(email) quedaba sin capturar y provocaba rollback
-- completo del INSERT en auth.users (signUp fallaba con "Database error
-- saving new user").
--
-- Ahora: si el INSERT choca por email, se RECONCILIA la fila histórica
-- adoptando el nuevo id de auth.users (no hay FKs a users.id en el esquema;
-- todas las tablas relacionadas usan user_email), preservando nombre, rol,
-- estado de suscripción y demás columnas ya existentes. Nunca se aborta la
-- creación de auth.users.
-- =============================================================================

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  _norm_email text := lower(trim(coalesce(new.email, '')));
  _existing_id uuid;
begin
  begin
    insert into public.users (id, email, created_at)
    values (new.id, _norm_email, now())
    on conflict (id) do nothing;
  exception
    when unique_violation then
      -- Conflicto de email (fila histórica/huérfana sin auth.users asociado).
      -- Adoptamos esa fila para el id nuevo en vez de dejar que aborte auth.users.
      select id into _existing_id
      from public.users
      where lower(email) = _norm_email
      limit 1;

      if _existing_id is not null and _existing_id <> new.id then
        update public.users
        set id = new.id
        where id = _existing_id;
      end if;
  end;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- No se añade FK users.id -> auth.users.id: el esquema actual no la tiene y
-- las tablas relacionadas usan user_email, no user_id. No es necesaria para
-- este fix y añadirla ahora sin backfill previo podría romper filas huérfanas
-- legítimas (leads que aún no se han registrado).
