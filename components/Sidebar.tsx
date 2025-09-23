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
      className="relative hidden h-screen w-72 flex-col border-r border-border/40 bg-gradient-to-b from-background/75 via-background/55 to-background/75 px-6 py-8 backdrop-blur-xl lg:flex"
      aria-label="Primary"
    >
      <div className="flex items-center gap-3 pb-10">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/70 via-primary/40 to-transparent shadow-[0_20px_45px_rgba(37,99,235,0.28)]">
          <span className="text-lg font-semibold text-primary-foreground">∞</span>
        </div>
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">
            {t("common.appName")}
          </p>
          <p className="text-xl font-semibold tracking-tight text-foreground">
            InvoiceSaaS
          </p>
        </div>
      </div>
      <nav className="flex-1 space-y-2" aria-label="Main navigation">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive =
            pathname === link.href || pathname.startsWith(`${link.href}/`);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all",
                isActive
                  ? "bg-white/10 text-foreground shadow-[0_18px_35px_rgba(15,15,15,0.35)]"
                  : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
              )}
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-xl border border-border/50 bg-background/60 backdrop-blur-md transition-colors group-hover:border-primary/40 group-hover:text-primary">
                <Icon className="h-4 w-4" aria-hidden="true" />
              </span>
              <span>{t(link.labelKey)}</span>
            </Link>
          );
        })}
      </nav>
      <div className="mt-10 space-y-4 text-xs text-muted-foreground">
        <div className="rounded-2xl border border-border/50 bg-background/60 p-4 backdrop-blur">
          <p className="mb-1 font-semibold text-foreground/80">
            {t("common.keyboardFirst")}
          </p>
          <p className="text-[11px] leading-relaxed text-muted-foreground">
            ⌘K · {t("shortcuts.command")}<br />N · {t("shortcuts.newInvoice")}
          </p>
        </div>
        <p>© {new Date().getFullYear()} InvoiceSaaS</p>
      </div>
    </aside>
  );
}
