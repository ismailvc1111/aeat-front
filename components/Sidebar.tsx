"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, FileText, Users, Package, Settings } from "lucide-react";
import { cn } from "./ui/utils";
import { useI18n } from "../lib/i18n";

const links = [
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
      className="hidden h-screen w-64 flex-col border-r border-border bg-background/80 backdrop-blur lg:flex"
      aria-label="Primary"
    >
      <div className="flex h-16 items-center border-b border-border px-6 text-lg font-semibold">
        {t("common.appName")}
      </div>
      <nav className="flex-1 space-y-1 px-3 py-6" aria-label="Main navigation">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive =
            pathname === link.href || pathname.startsWith(`${link.href}/`);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted/40 hover:text-foreground"
              )}
            >
              <Icon className="h-4 w-4" aria-hidden="true" />
              <span>{t(link.labelKey)}</span>
            </Link>
          );
        })}
      </nav>
      <div className="px-6 pb-6 text-xs text-muted-foreground">
        © {new Date().getFullYear()} InvoiceSaaS
      </div>
    </aside>
  );
}
