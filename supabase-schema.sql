-- ══════════════════════════════════════════════════════
-- ACADEMIA ONLINE — Schema inicial de Supabase
-- Ejecuta este SQL en: Supabase Dashboard > SQL Editor
-- ══════════════════════════════════════════════════════

-- Extensión para UUIDs
create extension if not exists "uuid-ossp";

-- ── Perfiles de usuario ──────────────────────────────
create table public.perfiles (
  id            uuid references auth.users(id) on delete cascade primary key,
  nombre        text,
  apellidos     text,
  avatar_url    text,
  plan          text not null default 'gratuito' check (plan in ('gratuito', 'basico', 'premium')),
  creado_en     timestamptz not null default now(),
  actualizado_en timestamptz not null default now()
);

-- Trigger: crear perfil automáticamente al registrarse
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.perfiles (id, nombre)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'nombre', split_part(new.email, '@', 1))
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ── Cursos ───────────────────────────────────────────
create table public.cursos (
  id              uuid primary key default uuid_generate_v4(),
  titulo          text not null,
  descripcion     text,
  imagen_url      text,
  precio          integer not null default 0,  -- en céntimos
  plan_requerido  text not null default 'gratuito' check (plan_requerido in ('gratuito', 'basico', 'premium')),
  publicado       boolean not null default false,
  orden           integer not null default 0,
  creado_en       timestamptz not null default now()
);

-- ── Lecciones ────────────────────────────────────────
create table public.lecciones (
  id                  uuid primary key default uuid_generate_v4(),
  curso_id            uuid not null references public.cursos(id) on delete cascade,
  titulo              text not null,
  descripcion         text,
  video_url           text,
  duracion_segundos   integer,
  orden               integer not null default 0,
  es_preview          boolean not null default false,
  creado_en           timestamptz not null default now()
);

-- ── Matrículas ───────────────────────────────────────
create table public.matriculas (
  id          uuid primary key default uuid_generate_v4(),
  usuario_id  uuid not null references public.perfiles(id) on delete cascade,
  curso_id    uuid not null references public.cursos(id) on delete cascade,
  creado_en   timestamptz not null default now(),
  unique(usuario_id, curso_id)
);

-- ── Progreso de lecciones ────────────────────────────
create table public.progreso_lecciones (
  id          uuid primary key default uuid_generate_v4(),
  usuario_id  uuid not null references public.perfiles(id) on delete cascade,
  leccion_id  uuid not null references public.lecciones(id) on delete cascade,
  completado  boolean not null default false,
  creado_en   timestamptz not null default now(),
  unique(usuario_id, leccion_id)
);

-- ── RLS (Row Level Security) ─────────────────────────
alter table public.perfiles           enable row level security;
alter table public.cursos             enable row level security;
alter table public.lecciones          enable row level security;
alter table public.matriculas         enable row level security;
alter table public.progreso_lecciones enable row level security;

-- Perfiles: cada usuario solo ve/edita el suyo
create policy "Ver propio perfil"    on public.perfiles for select using (auth.uid() = id);
create policy "Editar propio perfil" on public.perfiles for update using (auth.uid() = id);

-- Cursos: todos pueden ver los publicados
create policy "Ver cursos publicados" on public.cursos for select using (publicado = true);

-- Lecciones: ver si el curso está publicado
create policy "Ver lecciones" on public.lecciones for select
  using (exists (select 1 from public.cursos where id = curso_id and publicado = true));

-- Matrículas: cada usuario gestiona las suyas
create policy "Ver propias matrículas"   on public.matriculas for select using (auth.uid() = usuario_id);
create policy "Crear propia matrícula"   on public.matriculas for insert with check (auth.uid() = usuario_id);

-- Progreso: cada usuario gestiona el suyo
create policy "Ver propio progreso"    on public.progreso_lecciones for select using (auth.uid() = usuario_id);
create policy "Crear propio progreso"  on public.progreso_lecciones for insert with check (auth.uid() = usuario_id);
create policy "Actualizar propio prog" on public.progreso_lecciones for update using (auth.uid() = usuario_id);

-- ── Datos de ejemplo ─────────────────────────────────
insert into public.cursos (titulo, descripcion, plan_requerido, publicado, orden) values
  ('Constitución Española', 'Estudio completo del texto constitucional con casos prácticos y jurisprudencia.', 'gratuito', true, 1),
  ('Derecho Administrativo', 'Procedimiento administrativo, acto administrativo y recursos.', 'basico', true, 2),
  ('Ofimática para oposiciones', 'Word, Excel y Access al nivel exigido en las oposiciones de la AGE.', 'basico', true, 3),
  ('Simulacros de examen completos', 'Exámenes cronometrados de convocatorias anteriores con corrección detallada.', 'premium', true, 4);
