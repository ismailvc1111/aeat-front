"use client";

import { ThemeProvider } from "next-themes";
import { I18nProvider } from "../lib/i18n";
import { AppDataProvider } from "../lib/providers/app-data";
import { ToastProvider } from "../components/ui/toast-provider";
import { CommandPaletteProvider } from "../components/CommandK";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <I18nProvider>
        <AppDataProvider>
          <ToastProvider>
            <CommandPaletteProvider>{children}</CommandPaletteProvider>
          </ToastProvider>
        </AppDataProvider>
      </I18nProvider>
    </ThemeProvider>
  );
}
