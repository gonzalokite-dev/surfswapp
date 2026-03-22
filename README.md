# SURFSWAPP — MVP

Marketplace especializado en material de surf, kitesurf, windsurf, wing y foil de segunda mano.

> **Dale una segunda vida. Coge la próxima ola.**

---

## Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS** + **shadcn/ui** components
- **Supabase** (Auth, Database, Storage, Realtime)
- **React Hook Form** + **Zod** (validación)
- Deploy: **Vercel**

---

## Requisitos previos

- Node.js 18+
- npm o pnpm
- Cuenta en [Supabase](https://supabase.com) (plan gratuito suficiente para MVP)
- Cuenta en [Vercel](https://vercel.com) (opcional, para deploy)

---

## Instalación local

### 1. Clonar e instalar dependencias

```bash
cd SURFSWAPP
npm install
```

### 2. Variables de entorno

```bash
cp .env.local.example .env.local
```

Edita `.env.local` con tus credenciales de Supabase:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Encuéntralos en: **Supabase Dashboard → Settings → API**

### 3. Configurar Supabase

#### 3.1 Crear tablas (schema)

En **Supabase Dashboard → SQL Editor**, ejecuta en orden:

1. `supabase/schema.sql` — crea todas las tablas, índices y triggers
2. `supabase/rls.sql` — activa Row Level Security y define las políticas

#### 3.2 Crear bucket de Storage

En **Supabase Dashboard → Storage → New bucket**:
- Name: `product-images`
- Public: ✅ activado

Luego en **SQL Editor**, ejecuta las políticas de Storage al final de `supabase/rls.sql` (están comentadas, descoméntalas).

#### 3.3 Habilitar Realtime

En **Supabase Dashboard → Database → Replication**:
- Activa la tabla `messages` para **INSERT** events

### 4. Ejecutar el proyecto

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000)

---

## Datos de demo

Una vez que hayas creado al menos un usuario (vía `/registro`), ejecuta el seed:

En **Supabase Dashboard → SQL Editor**:

```sql
-- Ejecuta supabase/seed.sql
```

Esto creará 10 productos de ejemplo asociados al primer usuario registrado.

---

## Estructura del proyecto

```
surfswapp/
├── app/
│   ├── (public)/           # Rutas públicas (landing, explorar, producto)
│   │   ├── page.tsx        # Landing page
│   │   ├── explorar/       # Marketplace / listado con filtros
│   │   └── producto/[id]/  # Ficha de producto
│   ├── (auth)/             # Auth routes
│   │   ├── login/
│   │   └── registro/
│   └── (dashboard)/        # Rutas privadas (requieren auth)
│       └── dashboard/
│           ├── page.tsx            # Resumen / stats
│           ├── productos/          # Gestión de anuncios
│           │   ├── nuevo/          # Crear anuncio
│           │   └── [id]/editar/    # Editar anuncio
│           ├── mensajes/           # Inbox + chat
│           │   └── [id]/           # Conversación individual
│           └── perfil/             # Perfil del usuario
├── components/
│   ├── ui/             # Componentes base (shadcn)
│   ├── layout/         # Navbar, Footer
│   ├── landing/        # Secciones de la landing
│   ├── products/       # Componentes de productos
│   ├── chat/           # Componentes de chat
│   └── common/         # Compartidos (empty state, spinner, image upload)
├── lib/
│   ├── supabase/       # Clients (browser + server)
│   ├── types/          # TypeScript types + database types
│   ├── utils/          # Helpers (format, cn)
│   └── validations/    # Zod schemas
├── hooks/              # Custom hooks (use-toast)
├── supabase/
│   ├── schema.sql      # Tablas, índices, triggers
│   ├── rls.sql         # Row Level Security policies
│   └── seed.sql        # Datos de demo
└── middleware.ts        # Protección de rutas
```

---

## Rutas

### Públicas
| Ruta | Descripción |
|------|-------------|
| `/` | Landing page |
| `/explorar` | Marketplace con filtros |
| `/producto/[id]` | Ficha de producto |
| `/login` | Inicio de sesión |
| `/registro` | Registro |

### Privadas (requieren auth)
| Ruta | Descripción |
|------|-------------|
| `/dashboard` | Resumen de actividad |
| `/dashboard/productos` | Mis anuncios |
| `/dashboard/productos/nuevo` | Crear anuncio |
| `/dashboard/productos/[id]/editar` | Editar anuncio |
| `/dashboard/mensajes` | Inbox de mensajes |
| `/dashboard/mensajes/[id]` | Conversación |
| `/dashboard/perfil` | Mi perfil |

---

## Deploy en Vercel

1. Push tu código a GitHub
2. Importa el repo en [Vercel](https://vercel.com)
3. Añade las variables de entorno en **Vercel → Settings → Environment Variables**:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_APP_URL` (tu URL de producción)
4. Deploy

---

## Branding

**Nombre:** SURFSWAPP
**Tagline:** *Dale una segunda vida. Coge la próxima ola.*
**Paleta:** Ocean (`#0ea5e9`) · Coral (`#f97316`) · Slate Dark (`#0f172a`)
**Tipografía:** Outfit (display/headings) + Inter (body)
**Tono:** Cercano, directo, orientado a comunidad. Sin corporativo.

---

## Variables de entorno

| Variable | Descripción | Obligatoria |
|----------|-------------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | URL del proyecto Supabase | ✅ |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Clave anon pública de Supabase | ✅ |
| `SUPABASE_SERVICE_ROLE_KEY` | Clave service role (solo backend) | Opcional |
| `NEXT_PUBLIC_APP_URL` | URL de la aplicación | Recomendada |

---

## Roadmap futuro (post-MVP)

- [ ] Favoritos / guardados
- [ ] Valoraciones entre usuarios
- [ ] Pagos integrados (Stripe)
- [ ] Notificaciones por email
- [ ] OAuth (Google, Apple)
- [ ] Panel de administración
- [ ] Envíos integrados
- [ ] App móvil (React Native)
- [ ] Verificación de usuarios
- [ ] Destacar anuncios

---

## Licencia

Proyecto privado. Todos los derechos reservados © 2024 SURFSWAPP.
