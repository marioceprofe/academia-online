# ByteOpos — Guía de instalación completa

## Lo que tienes en este proyecto

```
src/
├── app/
│   ├── page.tsx                  ← Landing page pública
│   ├── layout.tsx                ← Layout raíz (fuentes, metadata)
│   ├── globals.css               ← Sistema de diseño y clases base
│   ├── auth/
│   │   ├── login/page.tsx        ← Página de inicio de sesión
│   │   ├── registro/page.tsx     ← Página de registro
│   │   ├── callback/route.ts     ← Callback OAuth de Supabase
│   │   └── logout/route.ts       ← Cerrar sesión
│   └── dashboard/
│       ├── layout.tsx            ← Layout con sidebar (protegido)
│       └── page.tsx              ← Inicio del área de alumno
├── components/
│   └── layout/
│       ├── Navbar.tsx            ← Navegación pública
│       └── Footer.tsx            ← Pie de página
├── lib/
│   ├── utils.ts                  ← Funciones de utilidad
│   └── supabase/
│       ├── client.ts             ← Cliente para componentes del navegador
│       ├── server.ts             ← Cliente para Server Components
│       └── middleware.ts         ← Protección de rutas
├── middleware.ts                 ← Middleware global de Next.js
└── types/
    └── database.ts               ← Tipos TypeScript de la BD
```

---

## Paso 1 — Instalar dependencias

```bash
cd byte-opos
npm install
```

---

## Paso 2 — Crear tu proyecto en Supabase

1. Ve a **https://supabase.com** y créate una cuenta gratuita
2. Haz clic en **"New project"**
3. Pon un nombre (ej: `byte-opos`) y elige una región europea
4. Espera ~2 minutos a que se cree el proyecto

---

## Paso 3 — Crear la base de datos

1. En tu proyecto de Supabase, ve a **SQL Editor** (icono de terminal en el sidebar)
2. Haz clic en **"New query"**
3. Copia y pega el contenido completo del archivo `supabase-schema.sql`
4. Haz clic en **"Run"** (o Ctrl+Enter)

Verás que se crean las tablas: `perfiles`, `cursos`, `lecciones`, `matriculas`, `progreso_lecciones`.

---

## Paso 4 — Configurar variables de entorno

1. En Supabase, ve a **Project Settings > API**
2. Copia:
   - **Project URL** → es tu `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public key** → es tu `NEXT_PUBLIC_SUPABASE_ANON_KEY`

3. Crea el archivo `.env.local` en la raíz del proyecto:

```bash
cp .env.local.example .env.local
```

4. Abre `.env.local` y rellena con tus valores:

```
NEXT_PUBLIC_SUPABASE_URL=https://XXXXXXXX.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

---

## Paso 5 — Activar autenticación por email y Google

En Supabase → **Authentication > Providers**:

**Email**: ya está activado por defecto ✓

**Google (opcional)**:
1. Ve a https://console.cloud.google.com
2. Crea un proyecto → APIs & Services → Credentials → OAuth 2.0
3. Copia Client ID y Client Secret
4. En Supabase: Authentication > Providers > Google → pega las credenciales
5. En Google Console, añade como URI autorizada: `https://TU_PROYECTO.supabase.co/auth/v1/callback`

---

## Paso 6 — Arrancar en local

```bash
npm run dev
```

Abre **http://localhost:3000** en tu navegador. Deberías ver la landing page.

Rutas disponibles:
- `/` — Landing page
- `/auth/login` — Iniciar sesión
- `/auth/registro` — Crear cuenta
- `/dashboard` — Área de alumno (requiere login)

---

## Paso 7 — Publicar en Vercel (gratis)

1. Crea cuenta en **https://vercel.com** (puedes entrar con GitHub)
2. Sube tu código a GitHub:
   ```bash
   git init
   git add .
   git commit -m "feat: academia online fase 1"
   git remote add origin https://github.com/TU_USUARIO/byte-opos.git
   git push -u origin main
   ```
3. En Vercel → **"Add New Project"** → importa tu repo de GitHub
4. En **Environment Variables**, añade las mismas variables de `.env.local`
5. Haz clic en **Deploy** → en ~2 minutos tendrás tu academia en línea

---

## Qué viene en la Fase 2

- Catálogo de cursos con filtros
- Reproductor de vídeo integrado (Bunny.net)
- Descarga de materiales PDF
- Motor de tests con corrección automática
- Seguimiento de progreso del alumno

---

## Tecnologías usadas

| Tecnología | Uso | Coste |
|---|---|---|
| Next.js 14 | Framework web | Gratis |
| Supabase | Base de datos + Auth | Gratis hasta 50K usuarios |
| Tailwind CSS | Estilos | Gratis |
| Vercel | Hosting | Gratis |
| Sora + Lora | Tipografía | Gratis (Google Fonts) |

**Coste total para empezar: 0 €/mes** ✓
