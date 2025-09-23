"use client";

import Link from "next/link";
import type { Route } from "next";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Users,
  Package,
  Settings,
  type LucideIcon,
} from "lucide-react";
import { cn } from "./ui/utils";
import { useI18n } from "../lib/i18n";

const links: {
  href: Route;
  icon: LucideIcon;
  labelKey: string;
}[] = [
  {
    href: "/",
    icon: LayoutDashboard,
    labelKey: "common.dashboard",
  },
  {
    href: "/invoices",
    icon: FileText,
    labelKey: "common.invoices",
  },
  {
    href: "/customers",
    icon: Users,
    labelKey: "common.customers",
  },
  {
    href: "/products",
    icon: Package,
    labelKey: "common.products",
  },
  {
    href: "/settings",
    icon: Settings,
    labelKey: "common.settings",
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { t } = useI18n();

  return (
    <aside
      className="relative hidden h-screen w-72 flex-col border-r border-border/60 bg-background/95 px-6 py-8 backdrop-blur lg:flex"
      aria-label="Primary"
    >
      <div className="flex items-center gap-3 pb-10">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <span className="text-lg font-semibold">∞</span>
        </div>
        <div className="space-y-1">
          <p className="text-xs font-medium uppercase tracking-[0.35em] text-muted-foreground">
            {t("common.appName")}
          </p>
          <p className="text-xl font-semibold tracking-tight text-foreground">InvoiceSaaS</p>
        </div>
      </div>
      <nav className="flex-1 space-y-1.5" aria-label="Main navigation">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive =
            pathname === link.href || pathname.startsWith(`${link.href}/`);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "relative flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary/10 text-foreground"
                  : "text-muted-foreground hover:bg-background/70 hover:text-foreground"
              )}
            >
              {isActive ? (
                <span
                  className="absolute left-0 top-1/2 h-7 w-1 -translate-y-1/2 rounded-full bg-primary"
                  aria-hidden="true"
                />
              ) : null}
              <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-border/60 bg-background/80 text-foreground/70">
                <Icon className="h-4 w-4" aria-hidden="true" />
              </span>
              <span>{t(link.labelKey)}</span>
            </Link>
          );
        })}
      </nav>
      <div className="mt-10 space-y-3 text-xs text-muted-foreground">
        <div className="rounded-xl border border-border/60 bg-background/80 p-4">
          <p className="mb-2 text-sm font-semibold text-foreground">{t("common.keyboardFirst")}</p>
          <div className="flex flex-wrap gap-2 text-[11px]">
            <span className="inline-flex items-center gap-1 rounded-md border border-border/70 px-2 py-1 text-muted-foreground">
              <kbd className="rounded bg-background/60 px-1.5 py-0.5 text-[10px] font-semibold text-foreground/80">⌘K</kbd>
              {t("shortcuts.command")}
            </span>
            <span className="inline-flex items-center gap-1 rounded-md border border-border/70 px-2 py-1 text-muted-foreground">
              <kbd className="rounded bg-background/60 px-1.5 py-0.5 text-[10px] font-semibold text-foreground/80">N</kbd>
              {t("shortcuts.newInvoice")}
            </span>
          </div>
        </div>
        <p>© {new Date().getFullYear()} InvoiceSaaS</p>
      </div>
    </aside>
  );
}
