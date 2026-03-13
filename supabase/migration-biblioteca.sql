-- Migración: tabla biblioteca_posts
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
alter table biblioteca_posts enable row level security;
create policy "Full access biblioteca" on biblioteca_posts for all using (true);

-- Insertar artículos actuales (ejecutar solo si la tabla está vacía)
insert into biblioteca_posts (slug, title, date, summary, content, exercise, free) values
('por-que-tu-mente-no-se-calla', 'Por qué tu mente no se calla', '2026-02-10', 'El ruido mental no es un defecto. Es un patrón aprendido que tu cerebro repite porque nadie le enseñó a parar.', 'Tu mente no para porque así fue entrenada. Desde que eres pequeño, la sociedad premia la actividad mental constante: planificar, anticipar, analizar. El problema es que nadie te enseñó a desactivar ese modo.', 'Durante 5 minutos, siéntate en silencio y cuenta cada pensamiento que aparece. No lo juzgues, solo cuenta.', true),
('ego-mecanismo-defensivo', 'Ego: mecanismo defensivo', '2026-02-05', 'El ego no es tu enemigo. Pero tampoco eres tú. Aprende a reconocer cuándo habla el ego y cuándo habla la conciencia.', 'El ego es un constructo mental que creaste para sobrevivir socialmente. No es malo, pero confundirlo con tu identidad real genera sufrimiento.', 'La próxima vez que sientas una reacción emocional intensa, para y pregúntate: ¿Esto amenaza mi supervivencia real o solo mi autoimagen?', true)
on conflict (slug) do nothing;
