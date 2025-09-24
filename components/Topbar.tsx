"use client";

import { useTheme } from "next-themes";
import { useMemo } from "react";
import { Command, Moon, Search, SunMedium } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { CompanySwitcher } from "./CompanySwitcher";
import { useI18n } from "../lib/i18n";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useCommandPalette } from "./CommandK";

export function Topbar() {
  const { theme, setTheme } = useTheme();
  const { t, locale, setLocale, availableLocales } = useI18n();
  const { setOpen } = useCommandPalette();

  const localeOptions = useMemo(() => availableLocales, [availableLocales]);

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-surface/80 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center gap-4 px-6 lg:px-8">
        <div className="flex flex-1 flex-wrap items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <span className="text-sm font-semibold">∞</span>
            </div>
            <div className="leading-tight">
              <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-text-secondary">
                {t("common.appName")}
              </p>
              <p className="text-sm font-semibold text-text-primary">InvoiceSaaS</p>
            </div>
          </div>
          <div className="relative hidden min-w-[220px] flex-1 items-center md:flex">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-secondary"
              aria-hidden="true"
            />
            <Input
              type="search"
              placeholder={t("common.search")}
              className="pl-9"
              aria-label={t("common.search")}
            />
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-end gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            aria-label={t("common.search")}
            onClick={() => setOpen(true)}
          >
            <Search className="h-4 w-4" />
          </Button>
          <div className="group relative">
            <Button
              variant="ghost"
              size="icon"
              aria-describedby="command-menu-help"
              aria-label={t("common.commandMenu")}
              onClick={() => setOpen(true)}
            >
              <Command className="h-4 w-4" />
              <span className="sr-only">{t("common.commandMenu")}</span>
            </Button>
            <div
              id="command-menu-help"
              role="tooltip"
              className="pointer-events-none absolute -bottom-11 left-1/2 hidden -translate-x-1/2 rounded-lg border border-border/60 bg-surface px-3 py-1 text-xs font-medium text-text-secondary shadow-sm group-hover:flex group-focus-within:flex"
            >
              ⌘K · {t("common.commandMenu")}
            </div>
          </div>
          <div className="min-w-[160px]">
            <CompanySwitcher />
          </div>
          <div className="hidden items-center gap-2 lg:flex">
            <Select value={locale} onValueChange={(value) => setLocale(value as typeof locale)}>
              <SelectTrigger className="w-24" aria-label={t("common.language")}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {localeOptions.map((code) => (
                  <SelectItem key={code} value={code}>
                    {code.toUpperCase()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button
            variant="ghost"
            size="icon"
            aria-label={theme === "dark" ? t("common.lightMode") : t("common.darkMode")}
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? (
              <SunMedium className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>
    </header>
  );
}
