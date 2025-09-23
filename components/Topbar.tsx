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
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center gap-4 px-6">
        <div className="flex flex-1 items-center gap-3">
          <Button
            variant="outline"
            className="hidden items-center gap-2 rounded-lg border-border/60 bg-background/80 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground sm:flex"
            aria-label={t("common.commandMenu")}
            onClick={() => setOpen(true)}
          >
            <Command className="h-4 w-4" />
            <span>{t("common.commandMenu")}</span>
            <span className="rounded bg-background/60 px-1.5 py-0.5 text-[11px] font-semibold text-muted-foreground">⌘K</span>
          </Button>
          <div className="relative hidden min-w-[220px] flex-1 items-center sm:flex">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <Input
              type="search"
              placeholder={t("common.search")}
              className="rounded-lg border-border/60 bg-background/80 pl-9 pr-3 text-sm"
              aria-label={t("common.search")}
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className="sm:hidden"
            aria-label={t("common.commandMenu")}
            onClick={() => setOpen(true)}
          >
            <Command className="h-4 w-4" />
          </Button>
          <div className="lg:hidden">
            <CompanySwitcher />
          </div>
          <div className="hidden lg:flex">
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
            className="rounded-lg"
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
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-6 pb-3 sm:hidden">
        <div className="relative flex min-w-[200px] flex-1 items-center">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            type="search"
            placeholder={t("common.search")}
            className="rounded-lg border-border/60 bg-background/80 pl-9 pr-3 text-sm"
            aria-label={t("common.search")}
          />
        </div>
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
    </header>
  );
}
