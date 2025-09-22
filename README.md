# InvoiceSaaS Frontend

Frontend completo para un SaaS de facturación multi-tenant construido con Next.js 14 (App Router), TailwindCSS y shadcn/ui. Incluye autenticación mock, dashboard con KPIs, listado y edición de facturas con formularios dinámicos (react-hook-form + zod), Command Palette accesible, modo oscuro/claro, i18n (ES/EN) y datos simulados con servicios asíncronos.

## Requisitos

- Node.js 18+
- pnpm (recomendado) o npm/yarn

## Scripts principales

```bash
pnpm install      # instala dependencias
pnpm dev          # entorno local en http://localhost:3000
pnpm build        # build de producción
pnpm start        # sirve el build (usado por Vercel)
pnpm lint         # linting (Next.js + ESLint)
```

## Deploy en Vercel

1. Importa el repositorio en Vercel.
2. Selecciona el framework **Next.js** (14).
3. Variables opcionales:
   - `NEXT_PUBLIC_APP_NAME` (por defecto `InvoiceSaaS`).
   - `NEXT_PUBLIC_DEFAULT_LOCALE` (`es` o `en`).
4. No se necesitan servicios externos ni base de datos. La aplicación usa mocks in-memory compatibles con Edge.

## Estructura destacada

```
app/
  (auth)/*          # pantallas de login/register/forgot
  (app)/layout.tsx  # layout principal (sidebar + topbar)
  (app)/page.tsx    # dashboard con KPIs + Recharts
  (app)/invoices/*  # listado, nueva factura y editor
  (app)/customers   # CRUD mock de clientes
  (app)/products    # CRUD mock de productos
  (app)/settings    # ajustes de empresa, idioma y tema
components/
  CommandK.tsx      # command palette + shortcuts (⌘K, N, S, P)
  InvoiceForm.tsx   # formulario dinámico con RHF+Zod
  PdfPreview.tsx    # placeholder + descarga PDF dummy
  Table.tsx         # tabla reutilizable accesible
lib/
  api/*             # servicios mock con latencia simulada
  mock/*            # datos in-memory
  providers/*       # AppDataProvider, I18nProvider, etc.
  utils/*           # currency, totals, shortcuts
styles/
  globals.css       # tokens Tailwind/shadcn (dark por defecto)
```

## Tema y diseño

- Paleta definida en `styles/globals.css` (tokens CSS) y `tailwind.config.ts`.
- Para cambiar colores ajusta los tokens `--background`, `--primary`, etc., y reconstruye (`pnpm dev`).
- Modo dark/light gestionado con `next-themes`. Toggle en la topbar.

## i18n

- Diccionarios en `lib/i18n/{es,en}.ts`.
- Para añadir idiomas duplica un diccionario, expórtalo y actualiza `dictionaries` en `lib/i18n/index.tsx`.
- `useI18n()` provee `t`, `locale`, `setLocale` y lista de locales disponibles.

## Integración con backend real

Reemplaza los servicios mock en `lib/api/*` por llamadas a tus endpoints:

- `lib/api/companies.ts` → datos de empresas / multi-tenant.
- `lib/api/customers.ts` → CRUD de clientes.
- `lib/api/products.ts` → CRUD de productos.
- `lib/api/invoices.ts` → list/CRUD de facturas, emisión y numeración.

Cada servicio simula latencia (300-600ms) y opera sobre los mocks (`lib/mock`). Sustitúyelos por fetch/axios manteniendo las mismas firmas para evitar cambios en el UI.

## Teclado y accesibilidad

- ⌘K abre el Command Palette (Radix Dialog + framer-motion).
- N: nueva factura · S: emitir · P: vista previa PDF.
- Componentes accesibles (focus visible, aria labels, tablas responsive).
- Skeletons y toasts optimistas mediante shadcn/ui.

## Datos mock

- `lib/mock/*` contiene seed inicial.
- `lib/providers/app-data.tsx` orquesta el estado (empresas, clientes, productos, facturas) y expone acciones a los componentes.
- `lib/utils/totals.ts` calcula totales (base, IVA, total).

¡Lista para iterar y conectar a tu backend! 🧾🚀
