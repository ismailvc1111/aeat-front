"use client";

import { createContext, useContext, useMemo, useState } from "react";
import { en, type Dictionary } from "./en";
import { es } from "./es";

type Locale = "en" | "es";

const dictionaries: Record<Locale, Dictionary> = { en, es };

type I18nContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
  availableLocales: Locale[];
};

const I18nContext = createContext<I18nContextValue | undefined>(undefined);

const translate = (dictionary: Dictionary, key: string) => {
  return key.split(".").reduce<unknown>((acc, part) => {
    if (acc && typeof acc === "object" && part in acc) {
      return (acc as Record<string, unknown>)[part];
    }
    return undefined;
  }, dictionary) as string | undefined;
};

export function I18nProvider({
  children,
  initialLocale = (process.env.NEXT_PUBLIC_DEFAULT_LOCALE as Locale) || "es",
}: {
  children: React.ReactNode;
  initialLocale?: Locale;
}) {
  const [locale, setLocale] = useState<Locale>(initialLocale);

  const value = useMemo<I18nContextValue>(() => {
    const dictionary = dictionaries[locale] ?? dictionaries.es;
    return {
      locale,
      setLocale,
      availableLocales: Object.keys(dictionaries) as Locale[],
      t: (key: string) => translate(dictionary, key) ?? key,
    };
  }, [locale]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export const useI18n = () => {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error("useI18n must be used within I18nProvider");
  }
  return ctx;
};
