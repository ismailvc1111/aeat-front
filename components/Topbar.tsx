"use client";

import { useTheme } from "next-themes";
import { useMemo } from "react";
import { Command, Moon, SunMedium } from "lucide-react";
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
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-border bg-background/80 px-4 backdrop-blur">
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="icon"
          aria-label="Command menu"
          onClick={() => setOpen(true)}
        >
          <Command className="h-4 w-4" />
        </Button>
        <div className="flex">
          <CompanySwitcher />
        </div>
        <Input
          type="search"
          placeholder={t("common.search")}
          className="w-48 md:w-72"
          aria-label={t("common.search")}
        />
      </div>
      <div className="flex items-center gap-3">
        <div className="hidden md:flex items-center gap-2">
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
            <SunMedium className="h-4 w-4" />
          ) : (
            <Moon className="h-4 w-4" />
          )}
        </Button>
      </div>
    </header>
  );
}
