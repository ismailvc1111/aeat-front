"use client";

import "../../styles/globals.css";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { useI18n } from "../../lib/i18n";

export const runtime = "edge";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { t } = useI18n();
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(76,125,255,0.25),transparent_55%),radial-gradient(circle_at_bottom,rgba(236,72,153,0.18),transparent_60%)]" />
      <div className="pointer-events-none absolute inset-y-0 left-1/2 h-[120%] w-[60%] -translate-x-1/2 rounded-full bg-primary/10 blur-[120px]" />
      <div className="relative z-10 w-full max-w-lg px-6">
        <Card className="border-border/40 bg-card/85 p-8 text-center shadow-[0_40px_90px_rgba(0,0,0,0.45)]">
          <CardHeader className="space-y-2 pb-0">
            <CardTitle className="text-3xl font-semibold tracking-tight">{t("common.appName")}</CardTitle>
            <p className="text-sm text-muted-foreground">{t("auth.subtitle")}</p>
          </CardHeader>
          <CardContent className="mt-6">{children}</CardContent>
        </Card>
      </div>
    </div>
  );
}
