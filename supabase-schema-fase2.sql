-- ══════════════════════════════════════════════════════
-- BYTEOPS — Schema Fase 2: Tests y simulacros
-- Ejecuta en Supabase Dashboard > SQL Editor
-- ══════════════════════════════════════════════════════

-- ── Tests ────────────────────────────────────────────
create table public.tests (
  id            uuid primary key default uuid_generate_v4(),
  titulo        text not null,
  descripcion   text,
  bloque        text,  -- 'sistemas', 'redes', 'bbdd', 'programacion', 'seguridad', 'legislacion'
  tiempo_limite integer,  -- segundos, null = sin límite
  num_preguntas integer not null default 10,
  es_simulacro  boolean not null default false,
  plan_requerido text not null default 'gratuito' check (plan_requerido in ('gratuito','basico','premium')),
  publicado     boolean not null default false,
  creado_en     timestamptz not null default now()
);

-- ── Preguntas ─────────────────────────────────────────
create table public.preguntas (
  id          uuid primary key default uuid_generate_v4(),
  test_id     uuid references public.tests(id) on delete cascade,
  enunciado   text not null,
  explicacion text,
  orden       integer not null default 0,
  creado_en   timestamptz not null default now()
);

-- ── Opciones de respuesta ─────────────────────────────
create table public.opciones (
  id           uuid primary key default uuid_generate_v4(),
  pregunta_id  uuid not null references public.preguntas(id) on delete cascade,
  texto        text not null,
  es_correcta  boolean not null default false,
  orden        integer not null default 0
);

-- ── Intentos de test ──────────────────────────────────
create table public.intentos_test (
  id              uuid primary key default uuid_generate_v4(),
  usuario_id      uuid not null references public.perfiles(id) on delete cascade,
  test_id         uuid not null references public.tests(id) on delete cascade,
  puntuacion      integer,       -- aciertos
  total_preguntas integer,
  tiempo_segundos integer,       -- tiempo empleado
  completado      boolean not null default false,
  creado_en       timestamptz not null default now()
);

-- ── Respuestas del intento ────────────────────────────
create table public.respuestas_intento (
  id           uuid primary key default uuid_generate_v4(),
  intento_id   uuid not null references public.intentos_test(id) on delete cascade,
  pregunta_id  uuid not null references public.preguntas(id),
  opcion_id    uuid references public.opciones(id),  -- null = sin responder
  es_correcta  boolean
);

-- ── RLS ───────────────────────────────────────────────
alter table public.tests              enable row level security;
alter table public.preguntas          enable row level security;
alter table public.opciones           enable row level security;
alter table public.intentos_test      enable row level security;
alter table public.respuestas_intento enable row level security;

create policy "Ver tests publicados"  on public.tests     for select using (publicado = true);
create policy "Ver preguntas"         on public.preguntas for select using (
  exists (select 1 from public.tests where id = test_id and publicado = true)
);
create policy "Ver opciones"          on public.opciones  for select using (
  exists (select 1 from public.preguntas p join public.tests t on t.id = p.test_id
          where p.id = pregunta_id and t.publicado = true)
);
create policy "Ver propios intentos"  on public.intentos_test      for select using (auth.uid() = usuario_id);
create policy "Crear intento"         on public.intentos_test      for insert with check (auth.uid() = usuario_id);
create policy "Actualizar intento"    on public.intentos_test      for update using (auth.uid() = usuario_id);
create policy "Ver respuestas"        on public.respuestas_intento for select using (
  exists (select 1 from public.intentos_test where id = intento_id and usuario_id = auth.uid())
);
create policy "Guardar respuestas"    on public.respuestas_intento for insert with check (
  exists (select 1 from public.intentos_test where id = intento_id and usuario_id = auth.uid())
);

-- ── Datos de ejemplo ─────────────────────────────────
insert into public.tests (titulo, descripcion, bloque, num_preguntas, publicado, plan_requerido) values
  ('Fundamentos de Redes TCP/IP', 'Modelo OSI, protocolos, direccionamiento IP y subredes.', 'redes', 10, true, 'gratuito'),
  ('Sistemas Operativos Linux', 'Comandos, gestión de procesos, permisos y scripting bash.', 'sistemas', 15, true, 'basico'),
  ('SQL y Bases de Datos Relacionales', 'Consultas SELECT, JOINs, índices y normalización.', 'bbdd', 15, true, 'basico'),
  ('Simulacro TAI — Bloque Técnico', 'Examen completo tipo TAI con 50 preguntas y 90 minutos.', NULL, 50, true, 'premium');

update public.tests set es_simulacro = true, tiempo_limite = 5400 where titulo like 'Simulacro%';
