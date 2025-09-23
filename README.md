Prompt completo (solo FRONTEND), listo para pegar en Firebase AI u otro generador.
Cubre: Next.js 14, Tailwind + shadcn/ui, multi-tenant, i18n, accesibilidad, atajos, mock API, paleta pro, y 100% deployable en Vercel.

PROMPT — SaaS de Facturación (Frontend Only, listo para Vercel)

Eres un generador de código senior. Crea solo el FRONTEND completo de un SaaS de facturación multi-tenant, con UI premium (estilo Vercel/Linear), accesibilidad AA, i18n (ES/EN) y modo dark/light.
El backend NO existe: usa mock API (in-memory o /lib/mock) y deja puntos de integración claros para reemplazar por API real más adelante.

1) Objetivo de producto

Usuarios gestionan empresas (multi-tenant), clientes, productos y facturas (borrador→emitida).

Editor de facturas con totales dinámicos, vista previa (dummy) de PDF.

Dashboard con KPIs y gráfico de facturas.

UI minimalista, rápida, teclado-first (⌘K, N, S, P).

2) Stack & librerías obligatorias

Next.js 14 App Router + TypeScript (optimizado para Vercel).

TailwindCSS, shadcn/ui, Radix UI, lucide-react.

framer-motion (micro-interacciones), Recharts (KPIs).

react-hook-form + zod (formularios/validación).

i18n con simple diccionarios (ES/EN) y helpers.

Edge Runtime por defecto; Node.js Runtime solo si hace falta (mock PDF), pero mantén todo “serverless-friendly”.

Sin dependencias de servidor (no Strapi, no DB). Todo mock.

3) Paleta y tipografía (tema profesional)

Fondo oscuro: #0F0F0F

Tarjetas: #1C1C1C

Texto primario: #FFFFFF

Texto secundario: #9CA3AF

Borde: #2D2D2D

Primario: #2563EB (botones/links)

Éxito: #22C55E | Error: #EF4444 | Warning: #F59E0B

Modo claro: fondo #F9FAFB, tarjetas #FFFFFF, textos #111827

Tipografía: Inter o Geist Sans

Configura tokens de color en Tailwind y tema de shadcn/ui. Dark como predeterminado, con toggle.

4) Páginas y navegación

/(auth)/login, /(auth)/register, /(auth)/forgot (UI sola, sin lógica real)

/ Dashboard (KPIs + gráfico Recharts + timeline)

/invoices listado (filtros por estado/serie, búsqueda)

/invoices/new y /invoices/[id] editor (borrador)

/customers CRUD mock

/products CRUD mock (con IVA por defecto)

/settings (empresa, series, idioma, perfil, tema)

Company Switcher en la topbar (multi-tenant simulado)

5) Componentes clave a construir

components/Sidebar, components/Topbar, components/CompanySwitcher

components/CommandK (⌘K): Acciones — nueva factura, emitir, descargar PDF (dummy)

components/KpiCard, components/StatusChip (success/error/warning)

components/InvoiceForm (RHF+Zod, líneas dinámicas, totales en vivo)

components/MoneyInput, components/TaxBadge, components/PdfPreview (dummy)

components/Table reutilizable (responsive, accesible, con “empty state”)

6) Lógica de UI (mock)

Mock data en /lib/mock: companies, customers, products, invoices.

Mock servicios en /lib/api con promesas (simulate latency 300-600ms).

Emitir factura: cambia status: "draft" → "issued", asigna número secuencial por series, fija issueDate.

Cálculos: base, IVA por línea, totales; redondeo a 2 decimales.

PdfPreview: placeholder (imagen o iframe) + botón “Descargar PDF” (genera blob dummy).

7) Accesibilidad y UX

Contraste AA, focus visible, aria-labels, navegación teclado.

Atajos: N (nueva factura), S (emitir), P (abrir vista previa PDF), ⌘K (Command).

Estados optimistas con toasts no intrusivos (shadcn/ui).

Skeletons de carga (dashboard/listas/editor).

Animaciones sutiles (fade/slide) con framer-motion.

8) i18n (ES/EN)

Diccionarios simples en /i18n/es.ts y /i18n/en.ts.

Hook useI18n() para traducir.

Selector de idioma en /settings.

9) Estructura de proyecto (App Router)
app/
  (auth)/
    login/page.tsx
    register/page.tsx
    forgot/page.tsx
  (app)/
    layout.tsx
    page.tsx                 # Dashboard
    invoices/
      page.tsx               # listado
      new/page.tsx
      [id]/page.tsx          # editor
    customers/page.tsx
    products/page.tsx
    settings/page.tsx
components/
  Sidebar.tsx
  Topbar.tsx
  CompanySwitcher.tsx
  CommandK.tsx
  KpiCard.tsx
  StatusChip.tsx
  InvoiceForm.tsx
  MoneyInput.tsx
  TaxBadge.tsx
  PdfPreview.tsx
  Table.tsx
lib/
  api/
    invoices.ts
    customers.ts
    products.ts
    companies.ts
  mock/
    seed.ts
    invoices.ts
    customers.ts
    products.ts
    companies.ts
  utils/
    currency.ts
    shortcuts.ts
    totals.ts
  i18n/
    index.ts
    es.ts
    en.ts
styles/
  globals.css
  theme.css

10) Contratos de datos (TypeScript, mock)
// lib/types.ts
export type Company = { id: string; name: string; taxId: string; country: string; series: string; };
export type Customer = { id: string; companyId: string; name: string; taxId: string; country: string; email?: string; };
export type Product = { id: string; companyId: string; name: string; unitPrice: number; taxRate: number; };
export type InvoiceLine = { id: string; description: string; qty: number; unitPrice: number; taxRate: number; lineTotal: number; };
export type InvoiceStatus = 'draft' | 'issued' | 'sent';
export type Invoice = {
  id: string; companyId: string; customerId: string;
  status: InvoiceStatus; series: string; number?: number;
  issueDate?: string; subtotal: number; taxTotal: number; total: number; currency: 'EUR';
  lines: InvoiceLine[];
};

11) Validación de formulario (Zod ejemplo)
import { z } from 'zod';
export const LineSchema = z.object({
  description: z.string().min(1),
  qty: z.number().positive(),
  unitPrice: z.number().nonnegative(),
  taxRate: z.number().min(0).max(21)
});
export const InvoiceSchema = z.object({
  customerId: z.string().min(1),
  series: z.string().min(1),
  lines: z.array(LineSchema).min(1)
});

12) Totales (utilidad)
export function computeTotals(lines:{qty:number;unitPrice:number;taxRate:number}[]){
  return lines.reduce((acc, l)=>{
    const base = l.qty * l.unitPrice;
    const tax = base * (l.taxRate/100);
    return {
      subtotal: +(acc.subtotal + base).toFixed(2),
      taxTotal: +(acc.taxTotal + tax).toFixed(2),
      total: +(acc.total + base + tax).toFixed(2),
    };
  }, { subtotal:0, taxTotal:0, total:0 });
}

13) Estilo (Tailwind & shadcn/ui)

Configura tema con tokens arriba.

Sidebar fija, topbar con búsqueda y CompanySwitcher.

Tablas con filas hover, estados con StatusChip.

Botón primario azul (#2563EB), secundarios grises, destructive rojo.

14) Vercel (adaptación total)

Sin dependencias de servidor: build & deploy directo.

Scripts:

dev: next dev

build: next build

start: next start

Variables opcionales:

NEXT_PUBLIC_APP_NAME="InvoiceSaaS"

NEXT_PUBLIC_DEFAULT_LOCALE="es"

Incluye vercel.json mínimo si lo ves necesario (no obligatorio).

15) Criterios de aceptación (obligatorios)

Cambiar empresa en CompanySwitcher refresca datos mock (multi-tenant simulado).

Dashboard: 3–4 KPIs (emitidas, aceptadas, rechazadas, importe total) + gráfico mensual.

Listado de facturas con búsqueda y filtro por estado/serie.

Editor con líneas dinámicas y totales en vivo; botón Emitir cambia estado y asigna número.

⌘K abre Command Palette con acciones: Nueva factura, Emitir, Descargar PDF (dummy).

Accesibilidad AA, focus visible, dark/light toggle, responsive.

Sin errores de TypeScript ni ESLint; build OK; deploy instantáneo en Vercel.

16) Entregables

Código completo del frontend con la estructura propuesta.

Datos mock y servicios mock funcionales.

Documentación README.md con:

cómo ejecutar local (pnpm i && pnpm dev)

cómo desplegar en Vercel

cómo cambiar la paleta/tema y añadir nuevos idiomas

puntos de integración para backend real (endpoints que reemplazar)
