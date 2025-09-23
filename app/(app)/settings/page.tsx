"use client";

import { useState } from "react";
import { useTheme } from "next-themes";
import { useAppData } from "../../../lib/providers/app-data";
import { useI18n } from "../../../lib/i18n";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Label } from "../../../components/ui/label";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";

export const runtime = "edge";

export default function SettingsPage() {
  const { companies, companyId } = useAppData();
  const { t, locale, setLocale, availableLocales } = useI18n();
  const { theme, setTheme } = useTheme();
  const company = companies.find((item) => item.id === companyId);
  const [name, setName] = useState(company?.name ?? "");
  const [taxId, setTaxId] = useState(company?.taxId ?? "");
  const [series, setSeries] = useState(company?.series.join(", ") ?? "");

  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <h1 className="text-3xl font-semibold tracking-tight">{t("settings.title")}</h1>
        <p className="text-sm text-muted-foreground">
          {t("settings.preferences")}
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-border/40">
          <CardHeader className="pb-2">
            <CardTitle>{t("settings.company")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="company-name">{t("auth.name")}</Label>
              <Input
                id="company-name"
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company-tax">{t("customers.taxId")}</Label>
              <Input
                id="company-tax"
                value={taxId}
                onChange={(event) => setTaxId(event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company-series">{t("settings.series")}</Label>
              <Input
                id="company-series"
                value={series}
                onChange={(event) => setSeries(event.target.value)}
              />
            </div>
            <Button type="button" disabled>
              {t("common.save")}
            </Button>
          </CardContent>
        </Card>
        <Card className="border-border/40">
          <CardHeader className="pb-2">
            <CardTitle>{t("settings.preferences")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>{t("settings.language")}</Label>
              <Select value={locale} onValueChange={(value) => setLocale(value as typeof locale)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {availableLocales.map((code) => (
                    <SelectItem key={code} value={code}>
                      {code.toUpperCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{t("settings.theme")}</Label>
              <Select value={theme} onValueChange={(value) => setTheme(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dark">{t("common.darkMode")}</SelectItem>
                  <SelectItem value="light">{t("common.lightMode")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{t("settings.profile")}</Label>
              <Input placeholder="you@example.com" disabled value="demo@invoicesaas.dev" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
